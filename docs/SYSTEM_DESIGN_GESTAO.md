# System Design — Frontend de Gestão do RASCOMP

Data de referência: 24/08/2026

## 1. Objetivo

Este documento define a arquitetura inicial do frontend autenticado do RASCOMP antes da implementação das telas.

O frontend de Gestão não será apenas um painel administrativo. Ele reunirá, na mesma aplicação autenticada, dois contextos de uso diferentes:

- `PARTICIPANTE`: responsável por suas próprias equipes, competidores, robôs, fotos de robôs e inscrições;
- `ORGANIZACAO`: responsável pela administração e execução da competição.

A Landing Page continuará sendo uma aplicação separada e pública.

---

# 2. Regra arquitetural principal

O backend é a única fonte de verdade do estado da competição.

```text
PARTICIPANTE / ORGANIZACAO
           │
           ▼
   Frontend de Gestão
           │
           │ comandos autenticados
           ▼
        Backend
           │
           ├── estado privado / administrativo
           │
           └── projeção pública sanitizada
                     │
                     ▼
               Landing Page
```

A Gestão não deve enviar estado diretamente para a Landing Page.

A Landing também não deve consumir respostas administrativas e tentar esconder campos sensíveis no navegador.

A separação correta é:

```text
/api/v1/participante/**  -> PARTICIPANTE + ownership
/api/v1/**               -> ORGANIZACAO
/api/v1/public/**        -> público, somente leitura e sanitizado
```

Portanto:

1. uma ação é registrada pela Gestão;
2. o backend valida e persiste;
3. o backend passa a representar o novo estado da competição;
4. a Landing consulta somente os contratos públicos;
5. o público vê a atualização quando a sua tela atualizar/refizer a consulta.

Essa regra evita sincronização manual entre frontends e impede que a Landing se torne uma segunda fonte de verdade.

---

# 3. Estado do backend que orienta o frontend

O contrato atual distingue claramente as modalidades.

## FOLLOW_LINE

```text
Registration APROVADA
        ↓
TentativaSeguidorLinha
        ↓
melhor tentativa válida e concluída
        ↓
RankingFollowService
        ↓
ranking público
```

Não existe chaveamento, partida ou round para Follow Line.

## SUMO

```text
Registration APROVADA
        ↓
InspecaoSumo
        ↓
apta
        ↓
Bracket
        ↓
Match
        ↓
RoundSumo
        ↓
MatchResult automático
        ↓
progressão do vencedor
        ↓
campeão
```

`MatchResult` é somente leitura para os clientes externos.

O frontend não cria manualmente um resultado de partida do Sumô. Ele registra os rounds permitidos; o backend consolida a partida e avança a chave.

---

# 4. Atores e escopos

## 4.1 PARTICIPANTE

Objetivos principais:

- criar conta e autenticar;
- consultar a própria conta;
- criar e administrar suas equipes conforme ownership;
- administrar competidores das próprias equipes;
- administrar robôs das próprias equipes;
- enviar/alterar foto de robô conforme API;
- criar inscrições;
- acompanhar status das inscrições;
- acompanhar a competição sem obter permissões administrativas.

A UI pode esconder ações não permitidas, mas a autorização real continua sendo responsabilidade do backend.

## 4.2 ORGANIZACAO

Objetivos principais:

- manter cadastros administrativos;
- manter competições e categorias;
- configurar regras de Sumô e Follow Line;
- analisar inscrições;
- executar prova de Follow Line;
- executar inspeções de Sumô;
- gerar e acompanhar chaveamentos;
- operar partidas e rounds;
- consultar resultados e rankings;
- acompanhar o que já está refletido publicamente.

## 4.3 Público anônimo

Não pertence à Gestão.

Consome somente a Landing Page e os contratos `/api/v1/public/**`.

---

# 5. Relação Gestão -> Backend -> Landing

A seguir está a matriz que deve orientar todas as telas que alteram dados potencialmente públicos.

| Ação na Gestão | Estado gerado no backend | Reflexo esperado na Landing |
|---|---|---|
| criar/alterar competição | competição e status | competição atual, situação e informações públicas |
| aprovar inscrição | inscrição `APROVADA` | equipe/robô aptos a aparecer na competição quando o contrato público permitir |
| alterar equipe/robô | cadastro persistido | dados públicos sanitizados de competidores/equipes/robôs |
| enviar foto de robô | mídia ligada ao robô | imagem pública do robô quando exposta pelo contrato público |
| registrar tentativa Follow | nova tentativa | ranking atualizado a partir da melhor tentativa válida |
| finalizar nova tentativa Follow | ranking recalculado | posição/tempo público atualizado |
| registrar inspeção Sumô | aptidão da inscrição | influência indireta sobre quem pode entrar na chave |
| gerar bracket Sumô | chaveamento e partidas | chave pública da categoria |
| registrar round Sumô | round persistido | placar parcial/final conforme exposição pública |
| atingir vitórias necessárias | `MatchResult` automático + progressão | vencedor da partida e chave atualizada |
| finalizar a final Sumô | bracket finalizado | campeão público |
| finalizar competição | status final | resultados históricos/pódio quando suportados |

## Regra de consistência

Após uma mutação crítica, a Gestão deve considerar a resposta do backend e uma nova consulta como verdade.

Não usar estado local como confirmação definitiva de:

- vencedor;
- posição de ranking;
- progressão de chave;
- aptidão;
- status de inscrição;
- status de partida.

---

# 6. Lacunas atuais que não devem ser inventadas no frontend

## 6.1 Fotos do dia / galeria do evento

O backend atual possui suporte a fotos de robôs, mas o contrato revisado não apresenta um módulo de galeria/evento/fotos do dia.

Portanto, para a Landing ter:

```text
fotos do dia
álbum do evento
momentos da rodada
```

será necessário criar futuramente um contrato próprio no backend, com entidade/armazenamento/DTO público e regras de publicação.

Até isso existir, o frontend não deve simular uma galeria persistente usando arquivos estáticos como se fosse funcionalidade do sistema.

## 6.2 Pagamentos

O contrato congelado atualmente analisado não apresenta endpoints de pagamento.

Qualquer tela de pagamento deve ficar fora do MVP até existir suporte real no backend.

---

# 7. Arquitetura técnica recomendada

## 7.1 Stack

Base recomendada para a Gestão:

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

### Motivos

- **TypeScript**: reduz erros ao trabalhar com muitos DTOs, enums e telas operacionais;
- **React Router**: separa rotas por perfil e contexto;
- **TanStack Query**: gerencia estado vindo da API, cache, invalidação e refetch;
- **Axios**: centraliza base URL, Authorization e interceptação de erros HTTP;
- **React Hook Form + Zod**: organiza formulários e validações de interface sem mover regras de negócio para o navegador;
- **CSS variables + CSS Modules**: mantém CSS explícito e controlado, sem exigir uma biblioteca visual pesada no início.

Tailwind ou outra solução visual só deve ser adicionada depois se trouxer benefício real.

## 7.2 O que não usar inicialmente

Não adicionar Redux/Zustand apenas para armazenar dados que já pertencem ao backend.

Separar:

```text
server state  -> TanStack Query
session/auth  -> AuthProvider/contexto pequeno
UI local      -> useState/useReducer
form state    -> React Hook Form
```

Se surgir estado global real não coberto por esses grupos, a necessidade é reavaliada antes de adicionar outra biblioteca.

---

# 8. Estrutura de código

A aplicação deve ser organizada por domínio/feature, não apenas por tipo de arquivo.

```text
gestao/
└── src/
    ├── app/
    │   ├── router/
    │   ├── providers/
    │   └── layouts/
    │
    ├── shared/
    │   ├── api/
    │   │   ├── httpClient.ts
    │   │   └── errors.ts
    │   ├── components/
    │   ├── hooks/
    │   ├── types/
    │   ├── utils/
    │   └── styles/
    │
    ├── features/
    │   ├── auth/
    │   ├── account/
    │   ├── institutions/
    │   ├── teams/
    │   ├── competitors/
    │   ├── robots/
    │   ├── competitions/
    │   ├── categories/
    │   ├── registrations/
    │   ├── follow-line/
    │   └── sumo/
    │
    └── main.tsx
```

Cada feature pode conter:

```text
api/
components/
hooks/
pages/
schemas/
types/
```

Exemplo:

```text
features/registrations/
├── api/
│   └── registrationsApi.ts
├── components/
│   ├── RegistrationStatusBadge.tsx
│   └── RegistrationReviewPanel.tsx
├── hooks/
│   └── useRegistrations.ts
├── pages/
│   ├── RegistrationListPage.tsx
│   └── RegistrationDetailsPage.tsx
├── schemas/
└── types/
```

---

# 9. Camada HTTP e contratos

Toda chamada passa por um cliente central.

```text
Component/Page
      ↓
feature hook
      ↓
feature api
      ↓
httpClient
      ↓
Backend
```

Evitar:

```text
axios.get(...)
```

espalhado por páginas e componentes.

O `httpClient` deve ser responsável por:

- `baseURL` via `VITE_API_URL`;
- envio do Bearer Token;
- normalização de erros comuns;
- reação a `401`;
- não registrar token ou informações sensíveis em logs.

Os tipos TypeScript devem refletir DTOs reais da API/Swagger.

Não criar um único arquivo `types.ts` gigante para todo o sistema.

---

# 10. Sessão e autorização

Fluxo base:

```text
/login
   ↓
POST /api/v1/auth/login
   ↓
JWT
   ↓
GET /api/v1/auth/me
   ↓
perfil atual
   ├── PARTICIPANTE
   └── ORGANIZACAO
```

O frontend usa o perfil para navegação e experiência visual.

O backend continua responsável por impedir acessos indevidos.

## Guards

Devem existir três conceitos:

```text
PublicRoute
AuthenticatedRoute
RoleRoute
```

Exemplos:

```text
/login                         -> pública
/app                           -> autenticada
/app/participante/**           -> PARTICIPANTE
/app/organizacao/**            -> ORGANIZACAO
```

Um `403` vindo do backend deve ser tratado como acesso negado, mesmo que a rota tenha passado pelo guard do navegador.

---

# 11. Mapa inicial de rotas do frontend

As rotas abaixo são rotas da interface e não representam caminhos do backend.

## Autenticação

```text
/login
/cadastro
```

## Área comum

```text
/app
/app/conta
```

`/app` redireciona conforme o perfil retornado por `/auth/me`.

## PARTICIPANTE

```text
/app/participante
/app/participante/equipes
/app/participante/equipes/:teamId
/app/participante/robos
/app/participante/inscricoes
/app/participante/inscricoes/:registrationId
```

A navegação deve priorizar o fluxo real:

```text
Equipe
  ↓
Competidores + Robôs
  ↓
Inscrição
  ↓
Acompanhamento de status
```

## ORGANIZACAO

```text
/app/organizacao
/app/organizacao/instituicoes
/app/organizacao/equipes
/app/organizacao/competidores
/app/organizacao/robos
/app/organizacao/competicoes
/app/organizacao/competicoes/:competitionId
/app/organizacao/categorias
/app/organizacao/inscricoes
/app/organizacao/inscricoes/:registrationId
```

## Operação da competição

```text
/app/organizacao/competicoes/:competitionId/follow/:categoryId
/app/organizacao/competicoes/:competitionId/sumo/:categoryId
```

Essas duas telas são diferentes porque os domínios são diferentes.

Não criar uma tela genérica de "resultado" tentando tratar Sumô e Follow Line da mesma forma.

---

# 12. Centro Operacional da Competição

A tela mais importante do perfil `ORGANIZACAO` não deve ser um CRUD genérico, e sim o contexto da competição selecionada.

Estrutura conceitual:

```text
Competição: RASCOMP 2026
Status: EM_ANDAMENTO

[Visão geral]
[Inscrições]
[Follow Line]
[Sumô]
[Resultado / publicação]
```

O usuário deve sempre saber:

- qual competição está operando;
- qual categoria está selecionada;
- qual modalidade está operando;
- qual estado atual foi confirmado pelo backend.

Evitar operações competitivas importantes fora desse contexto.

---

# 13. Console FOLLOW_LINE

O console de Follow deve ser orientado a tentativa e ranking.

```text
Categoria
   ↓
Inscrições aprovadas
   ↓
selecionar robô/inscrição
   ↓
selecionar tomada + tentativa
   ↓
registrar tempo/checkpoints/penalidade/conclusão
   ↓
backend valida
   ↓
refetch
   ↓
ranking atualizado
```

A tela pode ter dois blocos principais:

```text
[Operação da tentativa]    [Ranking atual]
```

Após salvar uma tentativa:

1. bloquear dupla submissão;
2. aguardar confirmação do backend;
3. invalidar tentativa/inscrição/ranking relacionados;
4. buscar novamente o ranking;
5. exibir feedback claro de sucesso/erro.

Não calcular classificação oficial no cliente.

---

# 14. Console SUMO

A operação do Sumô deve seguir o domínio real:

```text
Inscrições aprovadas
        ↓
Inspeções
        ↓
Aptos
        ↓
Gerar chave
        ↓
Partidas
        ↓
Rounds
        ↓
Resultado automático
        ↓
Progressão
```

Tela conceitual:

```text
┌─────────────────────────────────────────┐
│ Categoria SUMO                          │
├──────────────────┬──────────────────────┤
│ Inspeções        │ Chaveamento          │
│                  │                      │
├──────────────────┼──────────────────────┤
│ Partida atual    │ Rounds / placar      │
└──────────────────┴──────────────────────┘
```

Ao registrar um round que possa finalizar uma partida, o frontend não deve antecipar visualmente o vencedor.

Fluxo correto:

```text
POST round
   ↓
backend consolida
   ↓
MatchResult automático
   ↓
backend progride bracket
   ↓
frontend refaz consultas
   ↓
UI mostra novo vencedor/chave
```

---

# 15. Estado público e "ao vivo"

Durante uma competição, algumas consultas precisam ser mais frequentes.

No MVP:

- Gestão invalida/refaz consultas imediatamente após cada ação;
- telas operacionais podem usar polling apenas enquanto a competição estiver `EM_ANDAMENTO`;
- Landing poderá usar polling nos widgets públicos ao vivo;
- WebSocket/SSE não é requisito inicial.

Se polling se mostrar insuficiente, SSE/WebSocket pode ser avaliado depois.

## Importante

"Partida atual" não deve ser escolhida arbitrariamente pelo frontend se o backend puder manter mais de uma partida ativa.

Se o contrato não fornecer uma forma inequívoca de identificar o evento ao vivo, será necessário adicionar futuramente um endpoint/projeção pública de `live state` em vez de inventar uma regra no cliente.

---

# 16. Tratamento de mutações críticas

Para operações como:

- aprovação/rejeição de inscrição;
- tentativa de Follow;
- inspeção de Sumô;
- geração de chave;
- criação de round;
- alteração de status competitivo;

usar comportamento conservador.

## Não usar atualização otimista

A UI não deve assumir que a operação foi aceita antes da resposta do backend.

## Após sucesso

```text
mutation
  ↓
sucesso HTTP
  ↓
invalidateQueries
  ↓
refetch do estado relacionado
  ↓
renderização do estado confirmado
```

## Erros principais

```text
400 -> validação/regra de negócio
401 -> sessão inválida/expirada
403 -> sem permissão
404 -> recurso inexistente
405 -> ação não suportada pelo contrato
409 -> conflito/integridade/concorrência
500 -> falha inesperada
```

Mensagens devem ser úteis para o operador sem expor stack trace.

---

# 17. Concorrência e múltiplos operadores

O sistema pode ser operado por mais de uma pessoa.

Portanto:

- nunca assumir que o estado carregado há vários minutos ainda é atual;
- após mutações críticas, refazer a consulta;
- tratar `409` como conflito real e não como erro genérico;
- desabilitar botão enquanto a própria requisição estiver em andamento;
- não confiar apenas no bloqueio de botão para garantir unicidade;
- backend continua responsável pela integridade final.

Para ações irreversíveis ou competitivamente sensíveis, usar confirmação explícita quando fizer sentido.

---

# 18. Design System compartilhado com a Landing

A Gestão será construída primeiro, mas sua identidade visual deve gerar uma base reutilizável pela Landing.

Primeiro compartilhar conceitualmente:

- logo;
- paleta;
- tipografia;
- tokens de espaçamento;
- raio de borda;
- estados de botões;
- badges de status;
- ícones;
- linguagem de feedback.

Não criar pacote compartilhado entre apps antes de existir duplicação real.

O frontend de Gestão pode definir os tokens iniciais em:

```text
src/shared/styles/tokens.css
```

A Landing replica o contrato visual e, se a duplicação se tornar relevante, o repositório pode evoluir depois para um pacote compartilhado.

---

# 19. Estados obrigatórios de interface

Toda tela ligada à API deve prever:

```text
loading
success com dados
success vazio
erro
mutation em andamento
```

Telas de operação ao vivo devem também prever:

```text
estado desatualizado/refetch
sessão expirada
conflito de concorrência
```

---

# 20. Critério de qualidade de uma feature

Uma feature só é concluída quando:

- consome o endpoint correto;
- usa tipos/DTOs alinhados à API;
- possui loading;
- possui estado vazio quando necessário;
- trata erros relevantes;
- impede dupla submissão local;
- não reproduz regra de negócio do backend;
- respeita perfil/ownership;
- invalida/refaz consultas após mutações críticas;
- funciona em desktop e largura móvel razoável;
- possui fluxo principal testado manualmente;
- deixa claro quando uma ação impacta dados que podem aparecer publicamente.

---

# 21. Ordem de implementação derivada do design

## GESTÃO 0 — Fundação técnica

- Vite + React + TypeScript;
- roteamento;
- QueryClient;
- cliente HTTP;
- estrutura feature-based;
- tokens visuais mínimos;
- páginas técnicas de loading/erro/404.

## GESTÃO 1 — Auth + shell

- login;
- registro do participante;
- `/auth/me`;
- sessão;
- guards;
- layouts por perfil.

## GESTÃO 2 — Fluxo do participante

```text
Equipe -> Competidores/Robôs -> Inscrição -> Status
```

## GESTÃO 3 — Cadastros da organização

- instituições;
- equipes;
- competidores;
- robôs;
- competições;
- categorias/configurações.

## GESTÃO 4 — Aprovação de inscrições

Primeiro fluxo administrativo completo.

## GESTÃO 5 — Operação Follow Line

- tentativas;
- ranking;
- atualização pós-mutação.

## GESTÃO 6 — Operação Sumô

- inspeção;
- geração de chave;
- partidas;
- rounds;
- resultado automático;
- progressão.

## GESTÃO 7 — Revisão de publicação

Conferir o que cada ação da Gestão produz nos contratos públicos que alimentarão a Landing.

## GESTÃO 8 — Consolidação visual e operacional

- responsividade;
- acessibilidade;
- erros;
- conflitos;
- feedback;
- 403/404;
- revisão de UX de competição ao vivo.

---

# 22. Decisão final deste marco

O desenvolvimento do frontend começa pela Gestão.

A Landing fica temporariamente em espera para que:

1. o fluxo operacional defina os componentes e a identidade visual reais;
2. os estados públicos necessários sejam identificados a partir de ações reais;
3. a Landing seja projetada depois como uma visualização pública do mesmo domínio, e não como um site institucional desconectado da competição.

Próxima etapa após este documento:

```text
GESTÃO 0 — Fundação técnica
```

Nenhuma tela de negócio deve ser criada antes de a fundação seguir este desenho.
