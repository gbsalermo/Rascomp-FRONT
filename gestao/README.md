# Gestão — RASCOMP

Aplicação autenticada para operação e administração do RASCOMP/RRC.

## Responsabilidade

Esta aplicação será responsável pelos fluxos internos da competição e deverá consumir os contratos reais disponibilizados pelo backend.

## Escopo previsto

- autenticação;
- dashboard;
- equipes;
- participantes;
- robôs;
- modalidades;
- inscrições;
- pagamentos/status;
- competições;
- chaves e confrontos;
- resultados;
- ranking.

## Estrutura prevista após a inicialização técnica

```text
gestao/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── .env.example
├── index.html
└── package.json
```

## Regra importante

A interface não deve inventar contratos da API. Antes de implementar cada CRUD ou ação administrativa, verificar endpoints, DTOs, status HTTP, erros e permissões disponíveis no backend.

## Status

Aguardando **GESTÃO 0 — Fundação técnica**, conforme `docs/CONTINUIDADE_FRONTEND.md`.
