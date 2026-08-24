# RASCOMP Gestão

Sistema operacional da competição em **Vue 3 + TypeScript + Vite**.

## Perfis

- `ORGANIZACAO`: competições, inscrições, Follow Line, Sumô e processos;
- `PARTICIPANTE`: acesso às próprias equipes, competidores, robôs e inscrições conforme ownership do backend.

## Integrações

- JWT via `/api/v1/auth/**`;
- API administrativa `/api/v1/**`;
- portal `/api/v1/participante/**`;
- Camunda preparado por feature flag em `VITE_CAMUNDA_ENABLED`.

## Rodar

```bash
cp .env.example .env
npm install
npm run dev
```

A interface usa o backend como fonte oficial para ranking, resultados e progressão de chave.
