# Implementação Vue MVP — RASCOMP Front

## Decisão

A implementação prática do frontend passa a usar **Vue 3 + TypeScript + Vite**.

A referência de UX/estrutura veio dos projetos:
- Armour/vue-typescript-admin-template;
- PanJiaChen/vue-admin-template;
- iview/iview-admin.

O código do RASCOMP é próprio. As referências foram usadas para os padrões de:
- shell administrativo com sidebar;
- rotas por permissão;
- cliente HTTP centralizado;
- dashboard operacional;
- separação entre API, store, views e componentes.

## Gestão

Stack:
- Vue 3;
- TypeScript;
- Vue Router;
- Pinia;
- Axios;
- Element Plus;
- Vite.

Fluxos implementados no MVP:
- login JWT;
- hidratação de sessão via `/api/v1/auth/me`;
- dashboard por perfil;
- competições;
- análise de inscrições;
- Follow Line com lançamento de tentativa e ranking;
- Sumô com inspeção, geração de chave, partidas, rounds e resultados;
- portal do participante em leitura;
- ponto de integração Camunda com feature flag.

### Camunda

```text
VITE_CAMUNDA_ENABLED=false
```

Enquanto `false`, a análise de inscrição é manual pelo endpoint atual.

Quando o BPMN estiver pronto, habilitar a flag e evoluir `camundaApi` para tarefas humanas sem mover ranking, inspeção, geração/progressão de chave ou demais regras competitivas para o frontend.

## Landing

A landing Vue consome apenas `/api/v1/public/**`.

Ela já possui:
- competição em foco;
- contadores públicos;
- ranking Follow;
- chave/partidas/resultados Sumô;
- robôs/equipes;
- polling controlado durante competição `EM_ANDAMENTO`.

## Contrato de backend usado

A implementação está alinhada à branch backend `arquitetura-usuarios-acesso`, onde estão presentes:
- `AuthController`;
- `ParticipantPortalController`;
- `PublicController`;
- JWT;
- ownership;
- fotos de robô;
- API pública sanitizada.

A `main` do backend ainda deve receber/confirmar essa arquitetura antes de considerar a integração final concluída.

## Paleta

Extraída da logo RASCOMP fornecida:
- roxo principal: `#4F1967`;
- rubro principal: `#9F0F3B`;
- rubro de destaque: `#C31549`;
- superfícies neutras claras para preservar legibilidade operacional.

## Execução

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

Por padrão:
- Gestão: `http://localhost:5173`
- Landing: `http://localhost:5174`
- Backend: `http://localhost:8080`
