#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LANDING_DIR="$ROOT_DIR/landing-page"
PREVIEW_PORT="${RASCOMP_LANDING_HOMOLOG_PORT:-4174}"
PREVIEW_LOG="${TMPDIR:-/tmp}/rascomp-landing-homolog-preview.log"
GESTAO_URL="${1:-}"

for command_name in npm cloudflared curl; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Erro: '$command_name' não foi encontrado no PATH."
    exit 1
  fi
done

BACKEND_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 3 http://127.0.0.1:8080/api/v1/public/competicoes || true)"
if [ "$BACKEND_STATUS" = "000" ] || [ -z "$BACKEND_STATUS" ]; then
  echo "Erro: o backend não está acessível em http://127.0.0.1:8080."
  exit 1
fi

cleanup() {
  if [ -n "${PREVIEW_PID:-}" ] && kill -0 "$PREVIEW_PID" >/dev/null 2>&1; then
    kill "$PREVIEW_PID" >/dev/null 2>&1 || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cd "$LANDING_DIR"

echo "==> Gerando build da Landing para homologação externa..."
echo "    API pública será same-origin em /api/v1/public."

export VITE_API_URL=""
if [ -n "$GESTAO_URL" ]; then
  export VITE_GESTAO_URL="$GESTAO_URL"
  echo "    CTA Inscrever-se: $GESTAO_URL"
else
  export VITE_GESTAO_URL=""
  echo "    CTA Inscrever-se ficará sem destino externo nesta validação."
fi

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
echo "==> Abrindo Quick Tunnel PÚBLICO para a Landing..."
echo "    Esta URL é temporária. Ctrl+C encerra o Tunnel e o preview."
echo

cloudflared tunnel \
  --url "http://127.0.0.1:$PREVIEW_PORT" \
  --http-host-header localhost
