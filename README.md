# RASCOMP Frontend

Frontend do RASCOMP, dividido em duas aplicações Vue independentes no mesmo repositório:

- **`gestao/`** — sistema autenticado para `ORGANIZACAO` e `PARTICIPANTE`;
- **`landing-page/`** — interface pública institucional e de acompanhamento da competição.

## Arquitetura

```text
PARTICIPANTE / ORGANIZACAO
           │
           ▼
     Frontend Gestão
           │
           ▼
        Backend
       ┌───┴──────────────────┐
       │                      │
API autenticada       /api/v1/public/**
                              │
                              ▼
                           Landing
```

O backend é a única fonte de verdade. A Gestão não envia dados diretamente para a Landing.

## Stack atual

```text
Vue 3 + TypeScript + Vite
Vue Router + Pinia
Axios
Element Plus (Gestão)
```

A implementação se inspira nos padrões de shell administrativo, sidebar, rotas por permissão e cliente HTTP centralizado de `Armour/vue-typescript-admin-template`, `PanJiaChen/vue-admin-template` e `iview/iview-admin`, mantendo código próprio.

## Gestão implementada

- login JWT e `/api/v1/auth/me`;
- rotas protegidas por `PARTICIPANTE` / `ORGANIZACAO`;
- dashboard;
- competições;
- análise de inscrições;
- Follow Line: lançamento de tentativas + ranking oficial;
- Sumô: inspeção + geração de chave + partidas + rounds + resultados;
- portal do participante em leitura;
- adapter/feature flag para Camunda Engine REST.

## Landing implementada

A Landing consome apenas `/api/v1/public/**` e já espelha:

- competição em foco;
- inscrições aprovadas/equipes/robôs;
- ranking do Follow Line;
- chaveamento, partidas e resultados do Sumô;
- fotos principais dos robôs quando publicadas;
- polling controlado durante competição `EM_ANDAMENTO`.

## Camunda

O frontend está preparado para Camunda sem transferir regras competitivas para BPMN ou para o navegador.

```env
VITE_CAMUNDA_ENABLED=false
VITE_CAMUNDA_URL=http://localhost:8080/engine-rest
```

Enquanto o BPMN RASCOMP não estiver implantado, a análise de inscrição continua usando o fluxo REST atual. Depois, o adapter de processos pode assumir as tarefas humanas.

## Backend usado como contrato

Os fluxos de autenticação, participante e API pública foram implementados conforme a arquitetura existente na branch backend `arquitetura-usuarios-acesso`. Essa arquitetura ainda precisa estar presente/confirmada na `main` do backend para a integração final completa.

## Executar

Gestão:

```bash
cd gestao
cp .env.example .env
npm install
npm run dev
```

Landing:

```bash
cd landing-page
cp .env.example .env
npm install
npm run dev
```

Portas padrão:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

## Documentação

- `docs/IMPLEMENTACAO_VUE_MVP.md` — estado prático atual;
- `docs/SYSTEM_DESIGN_GESTAO.md` — decisões arquiteturais anteriores e domínio;
- `docs/CONTINUIDADE_FRONTEND.md` — histórico/continuidade.

A decisão tecnológica mais recente (**Vue 3**) substitui referências anteriores a React existentes nos documentos históricos.
