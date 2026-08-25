# RASCOMP Frontend

Frontend do RASCOMP, dividido em duas aplicações Vue independentes no mesmo repositório:

- **`gestao/`** — sistema autenticado para `ORGANIZACAO` e `PARTICIPANTE`;
- **`landing-page/`** — site público da RAS UFRB e acompanhamento do evento RRC.

## Nomenclatura

- **RAS UFRB** — identidade institucional pública;
- **RRC** — evento/competição de robótica;
- **RASCOMP** — plataforma de software que sustenta Gestão + Backend + experiência pública.

## Arquitetura

```text
PARTICIPANTE / ORGANIZACAO
           │
           ▼
     Frontend Gestão
           │
           ▼
     Spring Boot API
       ┌───┴──────────────────┐
       │                      │
API autenticada       /api/v1/public/**
                              │
                              ▼
                         Site público
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

## Gestão

Já existe base funcional para:

- login JWT e `/api/v1/auth/me`;
- rotas protegidas por `PARTICIPANTE` / `ORGANIZACAO`;
- dashboard;
- competições;
- análise de inscrições;
- Follow Line: lançamento de tentativas + ranking oficial;
- Sumô: inspeção + geração de chave + partidas + rounds + resultados;
- portal do participante em leitura.

### Decisão arquitetural: sem Camunda

Camunda foi retirado do escopo do RASCOMP.

Os fluxos competitivos permanecem no domínio Spring Boot. Em especial, o Sumô já possui serviços para:

```text
inscrições aprovadas + inspeção apta
        ↓
geração de chave
        ↓
BYEs automáticos
        ↓
partidas
        ↓
rounds
        ↓
MatchResult automático
        ↓
progressão do vencedor
        ↓
finalização da chave
```

Não será adicionado workflow engine sem uma necessidade futura concreta de processo duradouro/multiator.

## Chaveamento visual

O frontend deverá convergir para o protótipo visual aprovado: bracket em árvore por rodadas, com cards de confronto, conectores, vencedor destacado e abertura da partida/rounds ao clicar.

A interface **não calcula a progressão**. Ela renderiza o estado retornado pelo backend usando `rodada`, `ordem`, participantes, status e resultados.

## Landing

A Landing está pausada como POC técnico. O desenvolvimento final começa após a consolidação da Gestão e revisão dos contratos públicos do backend.

O site final será institucional da RAS UFRB, com uma área forte do RRC para pré-evento, acompanhamento ao vivo e histórico.

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

Landing POC:

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

- `docs/IMPLEMENTACAO_VUE_MVP.md` — estado prático atual e decisões recentes;
- `docs/SYSTEM_DESIGN_GESTAO.md` — domínio e arquitetura da Gestão;
- `docs/CONTINUIDADE_LANDING_PAGE.md` — continuidade exclusiva do site público;
- `docs/CONTINUIDADE_FRONTEND.md` — histórico do planejamento inicial.

A decisão tecnológica mais recente é **Vue 3**. Referências históricas a React não representam a implementação atual.
