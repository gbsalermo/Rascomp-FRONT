# Continuidade — RasComp Frontend

Última atualização: **19/09/2026**

Este arquivo registra o checkpoint funcional de `gestao/`, `landing-page/` e `photo-gallery/`. Não define roadmap próprio.

Fontes canônicas:

```text
docs/ETAPAS_POS_PROJETO.md
→ ordem e etapa atual

docs/DOSSIE_PROJETO_RASCOMP.md
→ arquitetura, domínio e decisões cross-repo

docs/CONTRATO_REGRAS_COMPETITIVAS.md
→ regras competitivas aprovadas e base dos testes da ETAPA 1

docs/README.md
→ índice e hierarquia documental
```

---

# 1. Situação atual

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  ✅ concluída / validada
ETAPA 2   ✅ concluída / validada
ETAPA 3   ✅ concluída / validada
ETAPA 4   🚧 EM ANDAMENTO — Consolidação funcional e polimento do MVP — BLOCO 1
```

Checkpoint interno da ETAPA 1:

```text
Bloco 1 — Competition + Registration     ✅ CONCLUÍDO
Bloco 2 — Follow Line                    ✅ CONCLUÍDO
Bloco 3 — Sumô                           ✅ CONCLUÍDO
Bloco 4 — Chaves                         ✅ CONCLUÍDO
Bloco 5 — Fluxos integrados completos    ✅ CONCLUÍDO
```

Em 06/09/2026 o bloco `Competition + Registration` foi concluído no backend e refletido no frontend.

Entre 06 e 07/09/2026 o bloco **Follow Line** foi concluído, incluindo:

- perfil RRC `3 tomadas × 3 tentativas`;
- estados válidos de tentativa;
- cronômetro operacional por tentativa;
- entrada manual de tempo preservada;
- penalidade temporal configurável;
- ação operacional `Não parou`;
- cronômetro de apresentação;
- tomada perdida por ausência;
- ausência sem criação de tentativas fictícias;
- histórico auditável de ausências;
- checkpoints apenas informativos para ranking;
- progresso da prova considerando tentativas e ausências.

Em 08/09/2026 o bloco **Sumô** foi concluído e integrado ao `gestao/`, incluindo:

- inspeção humana `APTO/INAPTO`;
- peso medido opcional e apenas informativo;
- modo da categoria `AUTONOMO | RC`;
- orientação operacional do atraso regulamentar de 5 s para autônomos;
- rounds extras com limite e justificativa obrigatória;
- `FALHA_INICIALIZACAO` como motivo explícito, sem consequência automática escolhida pelo frontend/backend;
- cadastro de juiz por competição;
- decisão final por juiz identificado após esgotar rounds regulares/extras;
- justificativa obrigatória e histórico da decisão;
- visualização do modo de controle no catálogo de modalidades.

Em 09/09/2026 o bloco **Chaves** foi concluído e integrado ao `gestao/`, incluindo:

- geração/regeneração comum somente em `INSCRICOES_ENCERRADAS`;
- aviso e bloqueio visual da geração fora do estado permitido;
- regeneração protegida contra atividade competitiva real;
- BYE automático sem ser confundido com disputa iniciada;
- árvore lógica protegida após geração;
- agenda operacional separada da estrutura da chave;
- edição de horário, pista, ordem de execução e convocação sem alterar confrontos;
- correção de vencedor propagado apenas enquanto a próxima dependência ainda não começou;
- bloqueio da correção comum após início da dependência seguinte.

Em 12/09/2026 o **Bloco 5 — Fluxos integrados completos** foi concluído no backend. Ele não exigiu nova funcionalidade visual: validou, com services e repositories reais, que os contratos já refletidos no `gestao/` funcionam juntos e que falhas não deixam persistência parcial.

**As ETAPAS 1, 2 e 3 estão concluídas e validadas. O roadmap foi reorganizado em 19/09/2026. A próxima etapa é a ETAPA 4 — Consolidação funcional e polimento do MVP, ainda não iniciada.**

---

# 2. Aplicações

```text
gestao/
→ aplicação autenticada
→ operação da organização
→ portal do participante
→ perfis DEV/GESTAO/MIDIA/PARTICIPANTE ativos

landing-page/
→ site público institucional e competitivo
→ consome API pública

photo-gallery/
→ protótipo separado de galeria
→ conteúdo ainda estático
```

---

# 3. Checkpoint funcional conhecido

## Gestão

```text
Autenticação JWT                            ✅
Dashboard / shell                           ✅
Central da competição                       ✅
Transições de Competition protegidas        ✅
Prorrogação/reabertura de inscrições        ✅
Histórico da janela de inscrições           ✅
Inscrições                                  ✅
Solicitações de cancelamento APROVADA       ✅
Equipes / robôs / modalidades               ✅
Classe física das categorias de Sumô        ✅
Modo AUTONOMO / RC das categorias           ✅
Ativo/inativo                               ✅
Usuários                                    ✅
Follow Line                                 ✅ bloco competitivo alinhado
Histórico por tomadas                       ✅ tentativas + ausências
Operação da tomada                          ✅ cronômetros + penalidades
Sumô                                        ✅ Bloco 3 alinhado
Inspeção Sumô humana                        ✅ APTO/INAPTO + peso informativo
Rounds extras                               ✅ limite + justificativa
Falha de inicialização                      ✅ motivo explícito + decisão humana
Juízes por competição                       ✅
Decisão de juiz                             ✅ identificada + justificada
Chave visual                                ✅ Bloco 4 alinhado
Agenda operacional das partidas             ✅ horário + pista + ordem + convocação
Estrutura da chave protegida                ✅ sem edição comum após geração
Arena da partida                            ✅ contrato do Bloco 3 integrado
2 penalidades = derrota automática          ✅
Suicídio/WO                                 ✅
Histórico de chaves                         ✅
Fotos dos robôs                             ✅
404 personalizada                           ✅
```

## Follow — implementação consolidada

Ao escolher uma inscrição aprovada, a gestão abre a operação focada naquele robô/tomada.

A experiência atual suporta:

```text
foto/equipe/categoria
3 tomadas × 3 tentativas
cronômetro de tentativa
PARAR → preenche o tempo
ajuste manual de tempo
penalidade em segundos
NÃO PAROU → aplica penalidade padrão configurada
INVALIDAR
NÃO CONCLUIU
cronômetro de apresentação
tomada perdida por ausência
histórico/auditoria
```

Regras representadas pela UI, mas validadas pelo backend:

```text
concluída + válida + tempo      → classificável
concluída + inválida + tempo    → histórico, fora do ranking
não concluída + inválida        → sem tempo
```

A ausência encerra a tomada sem criar três tentativas artificiais.

O painel e o histórico consideram tomadas perdidas por ausência. O ranking continua sendo calculado pelo backend e checkpoints não influenciam a classificação.

Arquivos principais alterados no bloco:

```text
gestao/src/types.ts
→ ConfigFollow estendida + FollowTakeAbsence

gestao/src/api.ts
→ leitura/gravação de ausências do Follow

gestao/src/views/FollowRunView.vue
→ cronômetros, penalidade, ausência e operação da tomada

gestao/src/views/FollowView.vue
→ progresso considerando ausências

gestao/src/components/FollowTakeHistory.vue
→ auditoria de tentativas e tomadas perdidas por ausência
```

## Sumô — Bloco 3 consolidado

A experiência de gestão agora representa explicitamente:

```text
inspeção física
→ organização informa APTO/INAPTO
→ peso é opcional/informativo

categoria Sumô
→ classe física MINI_500G | SUMO_3KG
→ controle AUTONOMO | RC

partida
→ 3 rounds regulares / 2 vitórias
→ penalidades
→ SUICIDIO_WO
→ FALHA_INICIALIZACAO
→ ANULADO / CANCELADO / EMPATADO
→ rounds extras somente quando backend permitir
→ justificativa obrigatória nos extras
→ decisão de juiz após limite de rounds
```

A decisão de juiz exige:

```text
vencedor
juiz ativo da competição
justificativa
data/hora persistida pelo backend
```

Arquivos principais alterados no fechamento:

```text
gestao/src/types.ts
→ SumoControlMode, SumoInspection, CompetitionJudge, MatchJudgeDecision
→ ConfigSumo.maxRoundsExtras
→ RoundSumo.justificativa e motivos novos

gestao/src/api.ts
→ inspeções tipadas
→ juízes da competição
→ decisão de juiz
→ justificativa em rounds

gestao/src/views/SumoView.vue
→ APTO/INAPTO humano
→ peso opcional
→ cadastro/lista de juízes
→ metadata AUTONOMO/RC

gestao/src/views/SumoMatchView.vue
→ modo de controle
→ falha de inicialização
→ rounds extras justificados
→ decisão final de juiz

gestao/src/views/AdminCatalogView.vue
→ exibição do modo AUTONOMO/RC
```

## Chaves — Bloco 4 consolidado

A gestão distingue agora dois conceitos:

```text
estrutura lógica da chave
→ rodada
→ ordem lógica
→ participantes
→ progressão

agenda operacional
→ data/hora
→ pista
→ ordem de execução
→ estado de convocação
```

A geração/regeneração só é apresentada como disponível quando a competição está em `INSCRICOES_ENCERRADAS`. A agenda pode ser ajustada sem reescrever a árvore competitiva.

Arquivos principais do fechamento:

```text
gestao/src/types.ts
→ metadata operacional de Match

gestao/src/api.ts
→ atualização específica da agenda da partida

gestao/src/views/MatchesView.vue
→ edição operacional de horário, pista, ordem e convocação

gestao/src/views/SumoView.vue
→ geração/regeneração respeitando o estado da Competition
```

## Robôs híbridos

O frontend não classifica o próprio `Robot` como Mini ou 3 kg. A metadata vem da categoria:

```text
Category.sumoPhysicalClass
├─ MINI_500G
└─ SUMO_3KG

Category.sumoControlMode
├─ AUTONOMO
└─ RC
```

`AdminCatalogView.vue` mostra classe física e modo de controle; o backend continua sendo autoridade da compatibilidade.

## Participante

Primeira versão em `/minha-equipe` inclui:

- equipe;
- competidores;
- robôs/fotos;
- inscrições;
- Follow/histórico;
- acompanhamento de Sumô;
- cancelamento direto de inscrição `PENDENTE`;
- solicitação de cancelamento para inscrição `APROVADA`;
- indicação de solicitação pendente;
- reativação de inscrição `CANCELADA` quando permitida.

O portal ainda não é completo; a conclusão geral foi remapeada para a ETAPA 7.

## Landing

```text
Landing institucional inicial          ✅
API pública competitiva                ✅
Competição ativa                       ✅
Follow público                          ✅
Sumô/chave público                      ✅
404 personalizada                      ✅
CMS/Mídia                              ⏳ ETAPA 8
Consolidação Landing/Galeria           ⏳ ETAPA 9
```

## Galeria

`photo-gallery/` continua protótipo separado. A decisão definitiva de absorção/manutenção independente pertence à ETAPA 9.

---

# 4. Qualidade conhecida

Checkpoint confirmado após o Bloco 5 / encerramento da ETAPA 1:

```text
Frontend Gestão     ✅ typecheck + build
Backend             ✅ 111 testes / 0 falhas / 0 erros / 0 skipped
H2 flowtest          ✅ fluxos integrados com repositories reais
MySQL + Flyway V12  ✅
Profile testdata    ✅ cenário completo contra MySQL real
```

A contagem vem do CI real do commit backend `4561d79388cf5befbac7d59b2dbf99ce122998bc`. O frontend foi validado pelo workflow `Frontend Checks` no commit `103481cc8eb855a222ed6756cbe6eeb1458b9257`.

Os fluxos automatizados completos do Bloco 5 foram adicionados; não houve necessidade de alterar o frontend nesse bloco.

---

## Checkpoint automatizado atual da ETAPA 3

```text
Frontend Gestão                ✅ typecheck + build
Backend                        ✅ 135 testes / 0 falhas / 0 erros / 0 skipped
SecurityAuthorizationFlowTest  ✅ matriz HTTP
DemoShowcaseDataInitializerTest ✅ perfis testdata + membro comum
MySQL + Flyway V13 + testdata  ✅
```

# 5. Segurança

Modelo atual:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Capacidades atuais da UI:

```text
operateCompetition → DEV | GESTAO
manageUsers        → DEV
manageSystem       → DEV
manageMedia        → DEV | MIDIA
participant        → PARTICIPANTE
```

A UI usa capacidades semânticas, mas a autorização real continua pertencendo ao backend.

---

# 6. Arquivos-base da gestão

```text
gestao/src/main.ts
gestao/src/router.ts
gestao/src/store.ts
gestao/src/api.ts
gestao/src/types.ts
```

Telas centrais:

```text
DashboardView.vue
CompetitionsView.vue
RegistrationsView.vue
AdminCatalogView.vue
FollowView.vue
FollowRunView.vue
SumoView.vue
SumoMatchView.vue
BracketHistoryView.vue
MatchesView.vue
ResultsView.vue
UsersView.vue
SettingsView.vue
ParticipantView.vue
NotFoundView.vue
```

---

# 7. Regras de UX competitiva aprovadas

## Follow — implementado no Bloco 2

```text
INICIAR CRONÔMETRO
PARAR
SALVAR/AJUSTAR TEMPO
APLICAR PENALIDADE
MARCAR NÃO PAROU
INVALIDAR TENTATIVA
MARCAR NÃO CONCLUIU
CRONÔMETRO DE APRESENTAÇÃO
MARCAR TOMADA PERDIDA POR AUSÊNCIA
```

A fonte de verdade permanece no backend.

## Sumô — implementado no Bloco 3

A UI não decide inspeção física por cálculo de peso. A organização informa `APTO/INAPTO` e pode guardar o peso como dado informativo.

A UI identifica `AUTONOMO/RC`, mas não transforma atraso ou falha de inicialização em decisão automática.

Rounds extras só ficam registráveis dentro do limite do backend e exigem justificativa.

Depois de esgotar rounds regulares e extras sem vencedor, a UI oferece decisão de juiz identificada e justificada.

## Chaveamento — implementado no Bloco 4

A UI distingue:

```text
estrutura lógica da chave
≠
agenda real de execução/pista/horário
```

Regras representadas:

```text
Competition != INSCRICOES_ENCERRADAS
→ geração/regeneração indisponível

chave gerada
→ estrutura lógica não é editada pela agenda

agenda
→ horário, pista, ordem operacional e convocação podem ser ajustados
```

O backend continua sendo a fonte de verdade para integridade, regeneração, progressão e correção de resultado.

---

# 8. ETAPA 2 — limpeza técnica concluída

- `api.ts` e `types.ts` são fachadas compatíveis;
- HTTP/auth/público/participante e domínios administrativos foram separados internamente;
- views grandes foram preservadas quando não havia ganho real em decompô-las;
- CSS administrativo foi consolidado preservando cascata;
- código morto/artefatos/versionamento foram revisados sem remoção especulativa;
- decisões sobre `photo-gallery` continuam reservadas à ETAPA 9.

A ETAPA 2 está encerrada; não reabrir refatoração ampla sem necessidade da etapa funcional atual.

---

# 9. Decisões futuras relevantes

## ETAPA 3 — permissões

Frontend refletirá `DEV | GESTAO | MIDIA | PARTICIPANTE`; backend permanece fonte de autorização.

## ETAPA 11 — Avisos IN_APP + Telegram

Roadmap canônico atual reúne os dois canais na mesma etapa:

```text
GESTAO/DEV
→ seleciona Competition
→ publica Aviso IN_APP
→ backend persiste
→ Telegram recebe a mesma comunicação quando habilitado
```

Regras:

- IN_APP é fonte de verdade;
- Telegram é canal complementar;
- frontend não chama Telegram diretamente;
- falha externa não invalida o aviso;
- vínculo individual Telegram não é obrigatório na primeira versão;
- futuro código competitivo da `Registration` pode ser reutilizado opcionalmente.

## ETAPA 5 — Ajustes Gerais DEV + auditoria

Área DEV-only com operações explícitas e auditáveis; nunca editor genérico de banco.

## ETAPA 8 — CMS/Mídia

Painel para conteúdo e mídia, reutilizando `ObjectStorageService`/R2.

## ETAPA 13 — Regras, Ajuda e Segurança

Derivar texto público do contrato competitivo, sem detalhes internos de implementação.

## ETAPA 6 — Futebol

Frontend vem após alteração real do domínio, pois `Registration.robot` é obrigatório hoje.

## ETAPA 7 — Participante completo

Completar os fluxos e criar identificador competitivo por `Registration` aprovada.

---

# 10. Landing e referências históricas

`docs/STATUS_LANDING_PAGE.md` permanece como snapshot visual, não como estado global.

`CONTINUIDADE_LANDING_PAGE.md` e `CONTINUIDADE_GALERIA_FOTOS.md` permanecem históricos específicos de subsistema.

Se algum documento histórico apresentar numeração diferente das etapas, prevalece `docs/ETAPAS_POS_PROJETO.md`.

---

# 10.1 Checkpoint inicial da ETAPA 2

- `api/http.ts` e `api/auth.ts` extraídos;
- `api/public.ts` e `api/participant.ts` extraídos;
- `types/auth.ts` e `types/competition.ts` extraídos;
- domínio Follow extraído para `api/admin/follow.ts` + `types/follow.ts`;
- domínio Sumô/chaves extraído para `api/admin/sumo.ts` + `types/sumo.ts`;
- `api.ts` e `types.ts` mantidos como fachadas compatíveis;
- Frontend Checks #57, #58 e #59 com typecheck + build verdes;
- competições/inscrições extraídas para módulos administrativos próprios;
- catálogos/usuários extraídos para `api/admin/catalog.ts` + `types/catalog.ts`;
- `api.ts` virou fachada de composição; `types.ts` virou fachada de tipos;
- `admin-consolidation.css` + `admin-refinement.css` consolidados em `admin-ui.css` preservando a cascata;
- Frontend Checks #60, #61 e #62 com typecheck + build verdes;
- bloco de login mantido sem reordenação para evitar regressão visual.

# 11. Próximo passo

```text
ETAPA 1 — lógica/integridade             ✅ CONCLUÍDA
ETAPA 2 — limpeza/organização            ✅ CONCLUÍDA
ETAPA 3 — matriz de permissões
├─ backend                               ✅
├─ frontend                              ✅
├─ testes automatizados                  ✅
└─ checkpoint prático dos quatro perfis  ✅ validado em 19/09/2026
```

A ETAPA 4 é a próxima etapa do roadmap, mas só deve ser iniciada após autorização explícita.

---

# 12. Handoff

Outra IA deve:

```text
1. ler docs/README.md
2. conferir a etapa atual no roadmap
3. ler o Dossiê Mestre
4. ler CONTRATO_REGRAS_COMPETITIVAS.md antes de alterar competição
5. ler esta continuidade
6. conferir código real
7. permanecer na etapa atual
8. regra de negócio → backend primeiro
9. transformar regra em teste
10. atualizar documentação quando o estado realmente mudar
```

## 10.3 ETAPA 3 — política de contas

```text
Cadastro comum             → sempre PARTICIPANTE
Nova conta interna         → DEV | GESTAO | MIDIA
Quem cria conta interna    → somente DEV
Editar role interna          → DEV | GESTAO | MIDIA
Converter PARTICIPANTE       → não permitido
```

A tela `/usuarios` do DEV oferece criação explícita de conta interna e edição de permissão para contas internas. `PARTICIPANTE` não aparece entre as opções porque deve usar o cadastro comum. A própria conta logada não pode alterar sua role pela interface.

Uma mesma pessoa pode possuir uma conta participante e uma conta institucional separadas. Os e-mails precisam ser diferentes porque o e-mail é único e funciona como login.

Backend Tests #309: 125 testes verdes. Frontend Checks #68: typecheck + build verdes.

## 10.2 ETAPA 3 — checkpoint integrado

Backend:

- `DEV | GESTAO | MIDIA | PARTICIPANTE` ativos no domínio;
- V13 migra `ORGANIZACAO → DEV`;
- `DEV` administra usuários;
- `DEV/GESTAO` operam competição;
- `MIDIA` não recebe acesso competitivo;
- `PARTICIPANTE` mantém namespace próprio.

Frontend:

- capacidades semânticas integradas no store/router;
- DEV, GESTAO, MIDIA e PARTICIPANTE recebem navegação compatível;
- Frontend Checks #64 verde.

Validação:

- `SecurityAuthorizationFlowTest` cobre autorização HTTP real;
- `DemoShowcaseDataInitializerTest` cobre o seed dos quatro perfis;
- MySQL + Flyway V13 + profile `testdata` verdes.

Não tratar a UI como fonte de segurança.


## 10.4 Portal participante — líder x membro

Regra atual:

```text
Líder / responsibleUser
→ visão da equipe inteira
→ todos os robôs e inscrições
→ ações administrativas do portal

Membro / Competitor.userAccount
→ visão apenas da própria participação
→ somente inscrições em que está associado
→ somente robôs dessas inscrições
→ sem troca de foto/cancelamento/administração da equipe
```

O roster de competidores permanece visível como contexto da equipe.

Frontend:
- título do líder usa "Robôs da equipe" e "Participação da equipe";
- membro usa "Meus robôs" e "Minha participação";
- ações administrativas são ocultadas para membro;
- Frontend Checks #72 ✅.

Backend:
- filtragem real por `Registration.competitors`;
- acesso direto a robô/inscrição fora da participação é bloqueado;
- Backend Tests #315 ✅ — 135 testes.

Checkpoint prático:
- `lider.demo@rascomp.local` deve ver Chronos + Titan;
- `membro.demo@rascomp.local` deve ver somente Chronos.


## 10.5 Fechamento da matriz de permissões — 19/09/2026

A ETAPA 3 foi validada em uso prático e está formalmente concluída.

```text
DEV          ✅
GESTAO       ✅
MIDIA        ✅
PARTICIPANTE ✅
líder x membro comum ✅
```

A validação final de permissões foi incorporada à **ETAPA 15 — Validação final completa**, imediatamente antes do deploy.

A ETAPA 4 está em andamento desde 22/09/2026, atualmente no BLOCO 1.


## Responsividade do login — 19/09/2026

O breakpoint do layout institucional de duas colunas foi antecipado para `1100px`.

Abaixo desse limite:

- painel institucional lateral é removido;
- formulário passa para uma coluna centralizada;
- marca compacta é exibida;
- largura acompanha a viewport sem overflow horizontal.

Também existe tratamento para viewport desktop com altura baixa, permitindo que o card cresça conforme o conteúdo e que a página role em vez de cortar o formulário.


## 10.6 Roadmap reorganizado — 19/09/2026

O ciclo passou a ser organizado por maturidade do produto:

- PRIORIDADE 1: ETAPAS 4–10 — finalizar e polir o MVP;
- PRIORIDADE 2: ETAPAS 11–15 — adições, portabilidade, hardening e validação;
- ETAPA 16 — deploy, última etapa.

A ETAPA 4 começa pela validação real do sistema existente: fluxos, bugs, interfaces, responsividade e consistência antes de novas funcionalidades.


## 10.7 Checkpoint transversal — Otimização Mobile do MVP

O login já possui breakpoint e composição compacta dedicados e foi corrigido para manter a marca visível em larguras intermediárias.

Isso não deve ser interpretado como responsividade completa do `gestao/`.

Checkpoint atual:

```text
Login                         ✅ otimizado/revisado
Shell administrativo           ⏳ revisar
Dashboard/Central              ⏳ revisar
Usuários                       ⏳ revisar
Inscrições                     ⏳ revisar
Follow                         ⏳ revisar
Sumô / Chaves                  ⏳ revisar
Portal do Participante         ⏳ revisar
Tabelas, filtros e diálogos    ⏳ revisar
```

A otimização dessas interfaces foi registrada como **checkpoint transversal da PRIORIDADE 1**.

Ela começa a ser trabalhada conforme as telas forem revisadas na ETAPA 4, continua junto do Portal (ETAPA 7), CMS (ETAPA 8) e Landing/Galeria (ETAPA 9), e precisa estar concluída antes do fechamento do MVP na ETAPA 10.

Os testes físicos em aparelhos reais continuam previstos na ETAPA 14 como hardening final.


## Checkpoint de início da ETAPA 4 — 22/09/2026

Branch de trabalho:

```text
etapa-4-consolidacao-mvp
```

Estado:

- ETAPA 4 autorizada e iniciada;
- BLOCO 1 em andamento;
- baseline técnico, autenticação, Shell e UX global são o escopo atual;
- ETAPA 5 permanece bloqueada;
- nenhuma nova funcionalidade estrutural deve ser antecipada.


## ETAPA 4 — BLOCO 1 — checkpoint técnico 22/09/2026

Baseline consolidado na branch `etapa-4-consolidacao-mvp`:

```text
Frontend Checks #84          ✅ typecheck + build
Backend Tests #316           ✅ 139 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V13 + testdata ✅
Logins DEV/GESTAO/MIDIA/PARTICIPANTE/MEMBRO ✅
```

Correções já aplicadas no BLOCO 1:

- remoção de `.bak` e artefatos raiz acidentais do ajuste mobile;
- `*.bak` adicionado ao `.gitignore`;
- `VITE_API_URL` voltou a ser configurável, mantendo same-origin/proxy como padrão para acesso local/mobile;
- mensagem de erro do login não expõe mais diagnóstico técnico;
- recuperação de senha não simula mais um envio inexistente;
- sessão expirada passa a redirecionar para o login preservando a rota de retorno;
- seletor de competição permanece disponível no menu mobile;
- títulos de Follow/Sumô em rotas operacionais foram ajustados;
- dropdown de alertas e botão do menu receberam refinamentos para telas pequenas.

Pendência para fechar o BLOCO 1:

- validação prática/visual do usuário em desktop e celular dos fluxos de autenticação e Shell.
