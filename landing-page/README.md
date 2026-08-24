# RASCOMP Landing Pública

Landing **Vue 3 + TypeScript + Vite** para presença institucional e acompanhamento público da competição.

```text
Gestão -> Backend -> /api/v1/public/** -> Landing
```

## Já espelha

- competição e status;
- equipes/robôs;
- ranking Follow Line;
- chave, partidas e resultados Sumô;
- fotos públicas dos robôs;
- atualização periódica durante `EM_ANDAMENTO`.

A Landing não calcula vencedor, ranking nem progressão: ela renderiza o estado público sanitizado do backend.

## Rodar

```bash
cp .env.example .env
npm install
npm run dev
```

Porta padrão: `5174`.
