#!/usr/bin/env bash
set -Eeuo pipefail

if [ "$#" -lt 1 ]; then
  echo "Uso: ./scripts/homologacao-quick-tunnel.sh email@exemplo.com [outro@email.com ...]"
  echo
  echo "O backend precisa estar rodando em http://127.0.0.1:8080."
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GESTAO_DIR="$ROOT_DIR/gestao"
PREVIEW_PORT="${RASCOMP_HOMOLOG_PORT:-4173}"
PREVIEW_LOG="${TMPDIR:-/tmp}/rascomp-homolog-preview.log"

for command_name in npm cloudflared curl; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Erro: '$command_name' não foi encontrado no PATH."
    exit 1
  fi
done

BACKEND_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 3 http://127.0.0.1:8080/ || true)"
if [ "$BACKEND_STATUS" = "000" ] || [ -z "$BACKEND_STATUS" ]; then
  echo "Erro: o backend não está acessível em http://127.0.0.1:8080."
  echo "Inicie o Spring Boot antes de abrir a homologação."
  exit 1
fi

ALLOWED_MAIL_ARGS=()
for allowed_mail in "$@"; do
  ALLOWED_MAIL_ARGS+=(--allowed-mail "$allowed_mail")
done

cleanup() {
  if [ -n "${PREVIEW_PID:-}" ] && kill -0 "$PREVIEW_PID" >/dev/null 2>&1; then
    kill "$PREVIEW_PID" >/dev/null 2>&1 || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cd "$GESTAO_DIR"

echo "==> Gerando build da aplicação Gestão/Participante..."
echo "    Forçando API same-origin (/api) para evitar localhost no navegador remoto."
export VITE_API_URL=""
npm run build

echo "==> Iniciando preview local em 127.0.0.1:$PREVIEW_PORT..."
npm run preview:homolog >"$PREVIEW_LOG" 2>&1 &
PREVIEW_PID=$!

for _ in $(seq 1 30); do
  if curl -sS -o /dev/null --connect-timeout 1 "http://127.0.0.1:$PREVIEW_PORT/"; then
    break
  fi
  if ! kill -0 "$PREVIEW_PID" >/dev/null 2>&1; then
    echo "Erro: o preview encerrou antes de ficar disponível."
    cat "$PREVIEW_LOG"
    exit 1
  fi
  sleep 1
done

if ! curl -sS -o /dev/null --connect-timeout 2 "http://127.0.0.1:$PREVIEW_PORT/"; then
  echo "Erro: preview não respondeu em 127.0.0.1:$PREVIEW_PORT."
  cat "$PREVIEW_LOG"
  exit 1
fi

echo
echo "==> Abrindo Quick Tunnel protegido por e-mail..."
echo "    O endereço público será mostrado abaixo pela Cloudflare."
echo "    Ctrl+C encerra o Tunnel e o preview."
echo

cloudflared tunnel \
  --url "http://127.0.0.1:$PREVIEW_PORT" \
  --http-host-header localhost \
  "${ALLOWED_MAIL_ARGS[@]}"
