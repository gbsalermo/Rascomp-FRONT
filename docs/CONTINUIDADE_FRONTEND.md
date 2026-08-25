# Continuidade — RASCOMP Frontend

Última atualização: 2026-08-24

Este documento é o checkpoint principal do frontend RASCOMP.

> Qualquer referência histórica a React/TanStack Query em versões anteriores deste arquivo está **substituída** pela implementação atual em Vue 3.

---

# 1. Identidade do projeto

```text
RASCOMP = plataforma/software
RRC     = evento/competição
RAS UFRB = identidade institucional pública
```

O repositório possui duas aplicações independentes:

```text
Rascomp-FRONT/
├── gestao/        -> sistema autenticado
└── landing-page/  -> site público RAS UFRB + área RRC
```

A Gestão é desenvolvida primeiro. A Landing permanece pausada como fundação/POC até a Gestão estar consolidada e os contratos públicos serem novamente revisados.

Documento exclusivo da Landing:

```text
docs/CONTINUIDADE_LANDING_PAGE.md
```

---

# 2. Arquitetura atual

## Gestão

Stack oficial:

```text
Vue 3
TypeScript
Vite
Vue Router
Pinia
Axios
Element Plus
```

## Fluxo de dados

```text
Gestão Vue
    ↓ REST + JWT
Spring Boot
    ↓
Banco
    ↓
/api/v1/public/**
    ↓
Landing Vue
```

O backend é a única fonte de verdade.

O navegador **não** calcula oficialmente:

- ranking;
- vencedor de partida;
- progressão da chave;
- campeão;
- eliminação/classificação oficial;
- aprovação de inspeção;
- regras competitivas.

---

# 3. Camunda

Camunda foi retirado do caminho oficial do projeto.

A decisão atual é manter os fluxos competitivos e administrativos necessários no domínio Spring Boot.

Motivo:

- geração de chave já existe no backend;
- BYE já é tratado no backend;
- rounds já geram resultado de Sumô automaticamente;
- vencedor já progride automaticamente;
- ranking Follow Line já é calculado no backend;
- análise de inscrição pode permanecer como regra transacional simples.

Camunda só deve ser reconsiderado no futuro se surgir um processo realmente duradouro, multiator e com esperas/timers que justifique BPMN executável.

---

# 4. Perfis e experiências

```text
ORGANIZACAO
PARTICIPANTE
```

A aplicação autenticada possui **duas experiências completas dentro do mesmo `gestao/`**.

```text
ORGANIZACAO  -> operar e administrar a competição
PARTICIPANTE -> acompanhar a própria participação no evento
```

Não criar outro frontend separado apenas para competidores.

## ORGANIZACAO

Opera:

- competições;
- categorias;
- inscrições;
- Follow Line;
- Sumô;
- inspeções;
- chaveamentos;
- partidas;
- rounds;
- resultados;
- cadastros administrativos.

## PARTICIPANTE

Fluxo de primeiro acesso definido:

```text
Criar conta
    ↓
UserAccount PARTICIPANTE
    ↓
Minha equipe
    ↓
Já tem equipe?
├── NÃO → criar equipe → vira líder
└── SIM → buscar equipe → solicitar entrada → líder aprova/rejeita
    ↓
Equipe pronta
    ↓
Inscrição de um robô
├── 1 responsável
└── 0..N suportes
```

Durante o evento, o participante precisa de um **dashboard competitivo próprio**, capaz de responder:

- qual é minha próxima partida/tentativa;
- horário, quando existir;
- adversário no Sumô;
- situação atual na chave;
- se avançou, foi eliminado ou é campeão, quando o backend fornecer esse estado;
- colocação oficial no Follow Line;
- melhor resultado oficial;
- inscrições e robôs vinculados;
- equipe e membros.

Documento específico:

```text
docs/EXPERIENCIA_PARTICIPANTE_COMPETICAO.md
```

Onboarding:

```text
docs/ONBOARDING_PARTICIPANTE.md
backend: rascomp/docs/POS_SWAGGER_USUARIOS_EQUIPES_INSCRICAO.md
```

---

# 5. Autenticação

Implementado:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
Authorization: Bearer <JWT>
```

Rotas públicas da Gestão:

```text
/login
/cadastro
/recuperar-senha
```

Frontend:

- Pinia para sessão;
- `localStorage` quando “Lembrar de mim” está marcado;
- `sessionStorage` caso contrário;
- interceptor Axios;
- limpeza em 401;
- rotas por role;
- logout;
- cadastro de participante com login automático;
- tela de recuperação preparada, backend ainda pendente.

Validação local da integração Gestão ↔ Backend realizada com sucesso em 2026-08-24:

```text
backend local      ✅
frontend local     ✅
login ORGANIZACAO  ✅
```

---

# 6. Paleta e direção visual da Gestão

Base aprovada:

```text
Roxo principal       #4F1967
Rubro principal      #9F0F3B
Rubro destaque       #C31549
Sidebar escura
Superfícies claras
```

Referência visual oficial: protótipo aprovado na conversa do projeto com:

- login split-panel;
- sidebar administrativa escura;
- topbar clara;
- dashboard operacional;
- cards de métricas;
- tabelas limpas;
- bracket visual;
- tela de partida/rounds;
- identidade tecnológica sem excesso de neon/cyberpunk.

A experiência PARTICIPANTE usa a mesma identidade visual, porém com informação orientada ao competidor e não à operação administrativa.

---

# 7. Rotas atuais e rotas-alvo

## Rotas atuais

```text
/login
/cadastro
/recuperar-senha
/
/competicoes
/inscricoes
/follow-line
/sumo
/minha-equipe
```

## Navegação ORGANIZACAO

```text
GERAL
└── Visão geral

COMPETIÇÃO
├── Competições
└── Inscrições

OPERAÇÃO
├── Seguidor de Linha
└── Sumô
```

## Navegação PARTICIPANTE alvo

```text
GERAL
├── Meu painel
└── Minha equipe

MEUS RECURSOS
├── Meus robôs
└── Minhas inscrições

COMPETIÇÃO
├── Próximas partidas
├── Minha chave        // Sumô
├── Minha colocação    // Follow Line
└── Histórico
```

A navegação pode ser adaptativa conforme as modalidades em que o participante estiver inscrito.

---

# 8. GESTÃO UI — convergência para o protótipo aprovado

## UI 1 — Shell + Dashboard ORGANIZACAO

Status: **IMPLEMENTADO / AGUARDANDO VALIDAÇÃO LOCAL VISUAL**

Alterações:

- [x] sidebar refinada;
- [x] agrupamento Geral / Competição / Operação;
- [x] topbar contextual por rota;
- [x] identificação do perfil;
- [x] competição em foco;
- [x] métricas reais;
- [x] contagem de inscrições da edição;
- [x] contagem de equipes;
- [x] contagem de robôs;
- [x] contagem de competidores;
- [x] pendências da edição;
- [x] últimas inscrições;
- [x] atalhos rápidos de operação;
- [x] responsividade inicial.

Não foram criados números falsos para reproduzir o mockup.

## UI 2 — Inscrições ORGANIZACAO

Status: **IMPLEMENTADO / AGUARDANDO VALIDAÇÃO LOCAL**

Entregue:

- [x] competição em foco;
- [x] métricas total/pendentes/aprovadas/rejeitadas;
- [x] filtros por competição e status;
- [x] busca por equipe, robô, categoria, solicitante ou competidor;
- [x] tabela operacional refinada;
- [x] detalhe da inscrição em drawer;
- [x] visualização dos competidores;
- [x] observação original preservada;
- [x] aprovação/rejeição com confirmação;
- [x] leitura de `reviewedByUser` / `reviewedAt`;
- [x] atualização após mutação;
- [x] responsividade inicial.

## UI 3 — Follow Line ORGANIZACAO

**PRÓXIMA ETAPA ADMINISTRATIVA** depois da validação local das telas já alteradas.

Planejado:

- competição/categoria em foco;
- inscritos;
- lançamento de tentativa;
- tomadas/tentativas;
- penalidade/checkpoints;
- ranking oficial;
- histórico operacional;
- refetch após mutação.

## UI 4 — Sumô / Inspeção ORGANIZACAO

Planejado:

- inscrições aprovadas;
- inspeção;
- aptidão;
- bloqueios claros antes do bracket.

## UI 5 — Sumô / Bracket visual ORGANIZACAO

Referência oficial: bracket em árvore do protótipo aprovado.

O frontend nunca decide quem avança.

## UI 6 — Sumô / Partida e Rounds ORGANIZACAO

Planejado:

- participantes A/B;
- placar consolidado;
- lista de rounds;
- vencedor de cada round;
- registro do próximo round;
- resultado automático do backend;
- atualização do bracket após resultado.

---

# 9. Trilha PARTICIPANTE — experiência competitiva

Essa trilha é obrigatória e deve ser validada separadamente da ORGANIZACAO.

## PARTICIPANTE 1 — Dashboard competitivo

Planejado:

- próxima partida/atividade em destaque;
- horário quando houver `dataHora`;
- adversário no Sumô;
- robô/categoria/modalidade;
- inscrições ativas;
- situação dos robôs;
- atalhos para chave, ranking e histórico.

## PARTICIPANTE 2 — Equipe e adesão

- criar equipe;
- buscar equipe;
- solicitar entrada;
- líder aprova/rejeita;
- membros da equipe;
- ownership.

Solicitação/aprovação depende do backend pós-Swagger.

## PARTICIPANTE 3 — Meus robôs

- listar robôs;
- detalhes;
- fotos;
- inscrições associadas;
- histórico competitivo.

## PARTICIPANTE 4 — Minhas inscrições

- competição;
- categoria;
- robô;
- status;
- responsável;
- suportes;
- observação;
- resultado quando aplicável.

## PARTICIPANTE 5 — Meu Sumô

- chave da categoria;
- partidas próprias;
- próxima partida;
- adversário;
- rodada;
- horário;
- rounds/resultados;
- situação oficial quando projetada pelo backend.

## PARTICIPANTE 6 — Meu Follow Line

- posição oficial;
- melhor resultado;
- tempo bruto/final;
- penalidade;
- tomada/tentativa;
- ranking completo da categoria.

## PARTICIPANTE 7 — Histórico

- participações finalizadas;
- resultados;
- posições;
- partidas;
- robôs utilizados.

---

# 10. Contratos atuais úteis para o PARTICIPANTE

Já existem dados suficientes para uma primeira versão útil combinando:

```text
/api/v1/participante/equipes
/api/v1/participante/equipes/{teamId}/robos
/api/v1/participante/equipes/{teamId}/inscricoes

/api/v1/public/chaveamentos
/api/v1/public/partidas
/api/v1/public/resultados
/api/v1/public/ranking/seguidor-linha
```

`MatchDTO` já contém `registrationAId`, `registrationBId`, `rodada`, `ordem`, `dataHora` e `status`.

O ranking Follow Line já contém `registrationId` e `posicao` calculada pelo backend.

Pode-se cruzar IDs próprios com projeções públicas para exibição inicial.

No pós-Swagger, avaliar projeções autenticadas específicas para reduzir junções no frontend e entregar semântica pronta como próxima partida e situação competitiva.

---

# 11. Extensibilidade de modalidades

Não hardcodar a experiência visual assumindo que o sistema terá para sempre apenas duas opções.

Backend atual:

```text
SUMO
FOLLOW_LINE
```

Backlog pós-Swagger:

```text
SUMO
├── RC
└── AUTÔNOMO

FOLLOW_LINE
├── padrão
└── cores (futuro)

COMBATE (futuro)
RESGATE (futuro)
```

Documento backend:

```text
rascomp/docs/POS_SWAGGER_MODALIDADES_E_CATEGORIAS.md
```

---

# 12. Landing

Estado: **PAUSADA / FUNDAÇÃO TÉCNICA**.

Retomada:

```text
Gestão ORGANIZACAO consolidada
      ↓
Gestão PARTICIPANTE consolidada
      ↓
backend pós-Swagger e extensibilidade revisado
      ↓
contratos /api/v1/public/** revisados
      ↓
LANDING 0 — auditoria
```

---

# 13. Execução local

Gestão:

```bash
cd gestao
cp .env.example .env
npm install
npm run dev
```

URLs padrão:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

Antes de considerar uma etapa tecnicamente concluída:

```bash
npm run typecheck
npm run build
```

---

# 14. Próxima ação oficial

```text
VALIDAR LOCALMENTE
Login + Cadastro + Primeiro acesso
Shell + Dashboard ORGANIZACAO
Inscrições ORGANIZACAO
        ↓
UI 3 — Follow Line ORGANIZACAO
        ↓
UI 4/5/6 — Sumô ORGANIZACAO
        ↓
TRILHA PARTICIPANTE — dashboard competitivo e acompanhamento
        ↓
Pós-Swagger — adesão/equipe/papéis/projeções participante
        ↓
Consolidação
        ↓
Landing
```
