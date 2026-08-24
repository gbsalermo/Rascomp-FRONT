# Gestão — RASCOMP

Aplicação autenticada do RASCOMP para dois perfis:

- `PARTICIPANTE`;
- `ORGANIZACAO`.

A aplicação será responsável pelos fluxos autenticados do sistema, mas o backend continuará sendo a única fonte de verdade e autoridade de negócio.

## Documento principal

Antes da implementação, seguir:

```text
../docs/SYSTEM_DESIGN_GESTAO.md
```

E manter o andamento em:

```text
../docs/CONTINUIDADE_FRONTEND.md
```

---

## Regra central

A Gestão não sincroniza diretamente com a Landing Page.

```text
Gestão -> Backend -> /api/v1/public/** -> Landing
```

A Gestão modifica o estado real da competição. A Landing consulta somente a projeção pública sanitizada desse estado.

---

## PARTICIPANTE

Fluxo principal:

```text
Equipe
  ↓
Competidores + Robôs
  ↓
Inscrição
  ↓
Acompanhamento de status
```

Escopo previsto:

- autenticação;
- conta;
- próprias equipes;
- competidores das próprias equipes;
- robôs das próprias equipes;
- fotos de robôs conforme API;
- inscrições;
- acompanhamento de status.

Ownership é validado pelo backend.

---

## ORGANIZACAO

Escopo previsto:

- instituições;
- equipes;
- competidores;
- robôs;
- competições;
- categorias;
- ConfigFollow;
- ConfigSumo;
- análise de inscrições;
- execução de Follow Line;
- inspeção de Sumô;
- chaveamentos;
- partidas;
- rounds;
- consulta de resultados;
- ranking.

### FOLLOW_LINE

```text
inscrição aprovada
-> tentativas
-> melhor tentativa válida
-> ranking
```

Não há bracket/partida/round para Follow.

### SUMO

```text
inscrição aprovada
-> inspeção
-> aptidão
-> bracket
-> match
-> round
-> MatchResult automático
-> progressão
```

O frontend não cria `MatchResult` manualmente.

---

## Stack definida para a fundação

```text
React
TypeScript
Vite
React Router
TanStack Query
Axios
React Hook Form
Zod
CSS variables + CSS Modules
```

Não adicionar Redux/Zustand sem necessidade concreta.

---

## Estrutura prevista

```text
gestao/
└── src/
    ├── app/
    │   ├── router/
    │   ├── providers/
    │   └── layouts/
    ├── shared/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   ├── types/
    │   ├── utils/
    │   └── styles/
    └── features/
        ├── auth/
        ├── account/
        ├── institutions/
        ├── teams/
        ├── competitors/
        ├── robots/
        ├── competitions/
        ├── categories/
        ├── registrations/
        ├── follow-line/
        └── sumo/
```

Organização por feature/domínio será preferida a uma estrutura global de páginas e serviços.

---

## Lacunas que não serão simuladas

- `fotos do dia/galeria`: backend atual suporta foto de robô, mas não um módulo de mídia do evento;
- `pagamentos`: não existe contrato correspondente no backend congelado analisado.

Essas telas só serão implementadas quando houver suporte real da API.

---

## Status

- [x] System Design concluído.
- [ ] Fundação técnica.

Próxima etapa:

```text
GESTÃO 0 — Fundação técnica
```
