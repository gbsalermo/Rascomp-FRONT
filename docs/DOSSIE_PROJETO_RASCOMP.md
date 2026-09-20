# Dossiê Mestre — Projeto RasComp

Última revisão estrutural: **19/09/2026**

Este é o documento canônico **cross-repo** de arquitetura, domínio, decisões e manutenção do RasComp.

> A ordem das etapas não é definida aqui. A única fonte de verdade para planejamento é `docs/ETAPAS_POS_PROJETO.md`.

Para começar do zero, ler primeiro `docs/README.md`.

---

# 1. Estado global

```text
Projeto apresentado/aprovado                  ✅
ETAPA 0 — baseline                            ✅ concluída / validada
ETAPA 1 — lógica e integridade                ✅ concluída / validada
Bloco 1 — Competition + Registration           ✅ concluído / validado
Bloco 2 — Follow Line                          ✅ concluído / validado
Bloco 3 — Sumô                                 ✅ concluído / validado
Bloco 4 — Chaves                               ✅ concluído / validado
Bloco 5 — Fluxos integrados                    ✅ concluído / validado
ETAPA 2                                        ✅ concluída / validada
ETAPA 3                                        ✅ concluída / validada
ETAPA 4                                        ⏳ próxima / não iniciada — consolidação do MVP
Backend — último checkpoint funcional          135 testes / 0 falhas / 0 erros / 0 skipped
Frontend Gestão                                typecheck + build ✅
Banco ativo                                    MySQL
Migrations                                     V1–V13
Próxima migration estrutural                   V14+
Profile testdata                               ✅ contra MySQL real
Roles atuais                                   DEV | GESTAO | MIDIA | PARTICIPANTE
ETAPA 3                                        backend ✅ / frontend ✅ / validada ✅
Deploy cloud                                   ⏳ ETAPA 16
```

Em 04/09/2026 foi executado um checkpoint de **limpeza/revisão documental**, sem mudança de etapa. A limpeza técnica de código/artefatos foi iniciada em 13/09/2026 na ETAPA 2.

Em 08/09/2026 o Bloco 3 da ETAPA 1 foi encerrado após alinhamento do backend, frontend, seeds, testes, MySQL/Flyway V11 e documentação competitiva.

Em 09/09/2026 o Bloco 4 da ETAPA 1 foi encerrado após proteção da geração/regeneração, separação da agenda operacional, correção segura da progressão, Flyway V12, frontend alinhado e validação com 98 testes + `testdata` contra MySQL real.

Em 12/09/2026 o Bloco 5 encerrou a ETAPA 1 com cinco suítes de fluxo integrado usando services/repositories reais em H2, validação explícita de rollback e **111 testes verdes**; o `testdata` também permaneceu verde contra MySQL real + Flyway V12.

Em 13/09/2026 foi iniciado o **checkpoint inicial da ETAPA 2**, com limpeza estrutural do backend e divisão incremental de `api.ts`/`types.ts` no frontend, preservando compatibilidade e sem refatoração big-bang. Backend Tests #297 e Frontend Checks #57 ficaram verdes.

Ainda em 13/09/2026, os domínios Follow e Sumô/chaves foram extraídos do `adminApi` monolítico para módulos próprios, com `types/follow.ts` e `types/sumo.ts`; Frontend Checks #58 e #59 ficaram verdes.

Na sequência, competições, inscrições e catálogos também foram modularizados. `api.ts` passou a ser somente uma fachada de composição, `types.ts` uma fachada de tipos e os CSS administrativos adjacentes foram consolidados em `admin-ui.css`. Com Frontend Checks #60–#62 verdes e o escopo técnico confirmado, a ETAPA 2 ficou concluída/validada. Smoke visual e testes práticos ficam reservados para etapas funcionais posteriores.

Em 13/09/2026 a ETAPA 3 foi iniciada em abordagem backend-first. Flyway V13 migrou `ORGANIZACAO → DEV`, a autorização passou para a matriz `DEV | GESTAO | MIDIA | PARTICIPANTE` e os checks competitivos passaram a usar capacidades semânticas. Na sequência, o frontend Gestão foi alinhado às mesmas capacidades, com rotas/menu separados para DEV, GESTAO, MIDIA e PARTICIPANTE. A matriz passou a ter validação HTTP real por `SecurityAuthorizationFlowTest`, seed dos quatro perfis coberto por `DemoShowcaseDataInitializerTest`, 120 testes verdes e profile `testdata` validado contra MySQL + Flyway V13.

---

# 2. Identidade e escopo

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição de robótica
RasComp  = plataforma de software
```

O RasComp conecta:

```text
operação administrativa
+
competição
+
participante
+
publicação pública
+
conteúdo institucional
```

**Camunda não faz parte da arquitetura atual.** Referências antigas a Camunda pertenciam a documentação histórica removida/obsoleta e não representam o código atual.

**PostgreSQL também não faz parte da arquitetura ativa. O banco atual é MySQL.**

---

# 3. Repositórios e aplicações

## Backend

```text
gbsalermo/Rascomp
└─ rascomp/
   └─ Java 21 + Spring Boot + MySQL + Flyway
```

Código principal:

```text
rascomp/src/main/java/br/edu/ufrb/rascomp/
```

## Frontend

```text
gbsalermo/Rascomp-FRONT
├─ gestao/        → aplicação autenticada + portal participante
├─ landing-page/  → site público institucional/competitivo
└─ photo-gallery/ → protótipo público separado de galeria
```

A existência de três aplicações frontend é o estado atual. A ETAPA 9 decidirá se `photo-gallery/` permanece independente ou é absorvida pela Landing.

---

# 4. Fluxo técnico e fonte de verdade

Fluxo predominante:

```text
Frontend
   ↓ HTTP/JSON
Controller
   ↓ DTO
Service
   ↓ regra de negócio / transação
Repository
   ↓ JPA/Hibernate
MySQL
```

O frontend **nunca acessa o banco diretamente**.

O backend é fonte de verdade para:

- autorização real;
- ownership;
- elegibilidade;
- estado de inscrições;
- ranking;
- inspeção;
- BYE;
- vencedor;
- progressão;
- campeão;
- resultados competitivos;
- validação de rounds;
- decisão de juiz;
- integridade de geração/regeneração de chaves;
- proteção da árvore competitiva e correção de dependências.

O frontend pode antecipar regras para UX, mas nunca substituí-las.

---

# PARTE A — BACKEND

# 5. Estrutura

```text
config/      Spring, segurança e R2
controller/  endpoints HTTP
dto/         contratos de entrada/saída
exception/   tradução de erros HTTP
model/       entidades JPA e enums
repository/  persistência Spring Data
security/    JWT/autenticação
service/     regras de negócio
storage/     abstração de object storage/R2
teste/       initializers opt-in de demonstração/teste
```

## Banco e migrations

Banco ativo: **MySQL**.

```text
src/main/resources/db/migration/
V1 ... V12
```

Resumo atual:

```text
V1  — schema competitivo principal
V2  — inspeções de Sumô
V3  — rounds de Sumô
V4  — remoção de estrutura legada Follow/chaves
V5  — usuários / ownership / fotos
V6  — histórico de chaves
V7  — regras estendidas de round/penalidades
V8  — solicitações de cancelamento + histórico da janela de inscrições
V9  — classe física de Sumô nas categorias
V10 — Follow 3×3 + parâmetros operacionais + ausência de tomada
V11 — modo de controle Sumô + rounds extras + auditoria de inspeção + juízes/decisão
V12 — separação da agenda operacional da estrutura lógica das partidas
```

Regra congelada:

```text
V1–V12 nunca são reescritas
próxima mudança estrutural = V13+
```

PostgreSQL não faz parte da configuração ativa. Referências antigas dentro de artefatos legados não definem a arquitetura atual.

---

# 6. Segurança

## Estado atual

```text
UserRole
├─ DEV
├─ GESTAO
├─ MIDIA
└─ PARTICIPANTE
```

Política predominante:

```text
/api/v1/public/**       → público
/api/v1/participante/** → PARTICIPANTE
/api/v1/usuarios/**     → DEV
/api/v1/**              → DEV | GESTAO
```

`MIDIA` não herda operação competitiva.

Conta desativada invalida autenticação nas requisições seguintes porque a validação JWT depende também de `usuario.isEnabled()`.

## Política de criação de contas

```text
cadastro público → PARTICIPANTE
criação interna DEV-only → DEV | GESTAO | MIDIA
```

O cliente público não escolhe privilégios. Mesmo que envie um campo `role`, o fluxo de cadastro cria `PARTICIPANTE`.

Uma mesma pessoa pode manter uma conta pessoal de participante e outra institucional. Como `email` é o identificador único de autenticação, essas contas usam e-mails distintos.

A edição de permissão entre contas internas `DEV | GESTAO | MIDIA` está consolidada; identidades PARTICIPANTE permanecem separadas.

## ETAPA 3 — matriz implementada

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Direção de responsabilidades:

- **DEV:** acesso integral, estrutura, roles, manutenção excepcional e Ajustes Gerais;
- **GESTAO:** operação competitiva;
- **MIDIA:** conteúdo institucional, mídia e publicação;
- **PARTICIPANTE:** própria equipe, robôs, inscrições, acompanhamento e avisos.

O frontend deve refletir capacidades, mas menu oculto nunca será segurança.

---

# 7. Identidades de domínio que não devem ser confundidas

```text
UserAccount
→ login, senha, role e ativo

Competitor
→ pessoa que compete
→ pertence a Team
→ pode opcionalmente estar ligado a UserAccount

Team.responsibleUser
→ usuário responsável pela equipe no portal

Robot
→ robô físico cadastrado da equipe
```

Consequência para Ajustes Gerais:

```text
transferirCompetitor
≠ transferirResponsabilidade
≠ transferirRobo
≠ alterarRole
```

Operações administrativas devem permanecer explícitas e auditáveis.

---

# 8. Competition / Category / Registration — Bloco 1 consolidado

## Competition

O ciclo normal é:

```text
PLANEJADA
→ INSCRICOES_ABERTAS
→ INSCRICOES_ENCERRADAS
→ EM_ANDAMENTO
→ FINALIZADA
```

`CANCELADA` permanece saída administrativa permitida conforme regras de domínio.

A janela de inscrições pode ser prorrogada/reaberta por operação explícita e auditável, respeitando estado competitivo e histórico.

## CompetitionCategory

Modalidades técnicas atuais:

```text
SUMO
FOLLOW_LINE
```

Metadata de Sumô:

```text
sumoPhysicalClass
├─ MINI_500G
└─ SUMO_3KG

sumoControlMode
├─ AUTONOMO
└─ RC
```

Classe física e modo pertencem à categoria, não ao `Robot`.

## Registration

```text
Registration
├─ Competition obrigatória
├─ CompetitionCategory obrigatória
├─ Team obrigatória
├─ Robot obrigatório no domínio atual
├─ Competitor(s)
├─ status
├─ requestedByUser
├─ reviewedByUser
└─ ativo
```

Unicidade atual:

```text
competition + category + robot
```

Estados:

```text
PENDENTE
APROVADA
REJEITADA
CANCELADA
DESISTENTE
DESCLASSIFICADA
```

Regras consolidadas no Bloco 1:

- reativação revalida janela e compatibilidade;
- participante cancela diretamente apenas `PENDENTE`;
- cancelamento de `APROVADA` passa por solicitação analisada pela organização;
- histórico competitivo diferencia `CANCELADA` de `DESISTENTE`;
- prorrogação/reabertura possui histórico auditável;
- robô híbrido pode coexistir em Follow + Sumô e em Auto/R/C da mesma classe física;
- Mini + 3 kg para o mesmo robô na mesma edição é bloqueado.

---

# 9. Follow Line — Bloco 2 consolidado

Estrutura RRC atual:

```text
3 tomadas
×
3 tentativas por tomada
```

Estados válidos:

```text
CLASSIFICÁVEL
concluida=true
valida=true
tempoSegundos!=null

CONCLUÍDA INVALIDADA
concluida=true
valida=false
tempoSegundos!=null

NÃO CONCLUÍDA
concluida=false
valida=false
tempoSegundos=null
```

Ranking:

```text
tempoFinal = tempoSegundos + penalidadeSegundos
→ melhor tentativa classificável da tomada
→ melhor tomada da inscrição
→ menor tempo final
```

`checkpointsAlcancados` permanece informativo e **não altera ranking**.

Operação também suporta:

- cronômetro por tentativa;
- ajuste manual autorizado;
- penalidade temporal configurável;
- ação `NÃO PAROU`;
- cronômetro de apresentação;
- tomada perdida por ausência;
- ausência auditável sem criar tentativas fictícias.

A ausência conta como atividade competitiva para regras de desistência e reabertura.

---

# 10. Sumô — Bloco 3 consolidado

Fluxo principal:

```text
Registration APROVADA
→ inspeção humana APTO/INAPTO
→ Bracket
→ Match
→ RoundSumo
→ MatchResult
→ progressão
```

Categorias compartilham o mesmo motor e ficam isoladas por:

```text
competitionId + categoryId
```

## 10.1 Inspeção

A inspeção é decisão humana:

```text
aprovada=true  → APTO
aprovada=false → INAPTO
```

`pesoMedido` é opcional e auditável. Ele **não aprova ou reprova automaticamente**.

O registro preserva tentativa, observação, responsável e data/hora.

## 10.2 Autônomo e R/C

`CompetitionCategory.sumoControlMode` diferencia:

```text
AUTONOMO
RC
```

Autônomos usam a orientação regulamentar de atraso de 5 segundos após autorização/ativação. Esse atraso não é falha.

R/C inicia ao comando do juiz e não usa o atraso de 5 segundos.

`FALHA_INICIALIZACAO` é motivo explícito, porém a consequência é decisão humana. O sistema não escolhe automaticamente entre penalidade e perda do round.

## 10.3 Rounds

Perfil operacional:

```text
3 rounds regulares
2 vitórias necessárias
```

Regras preservadas:

```text
0 penalidades → normal
1 penalidade  → normal
2 penalidades → derrota automática do round
SUICIDIO_WO  → adversário vence
BYE          → avanço automático
```

Motivos explícitos:

```text
DISPUTA
SUICIDIO_WO
PENALIDADES
FALHA_INICIALIZACAO
DECISAO_JUIZ
```

## 10.4 Rounds extras

`ConfigSumo.maxRoundsExtras` limita os extras.

Round extra somente quando:

- não existe vencedor;
- rounds regulares foram consumidos;
- desempate está permitido;
- limite ainda não foi atingido;
- justificativa foi informada.

## 10.5 Juiz e decisão final

```text
CompetitionJudge
├─ Competition
├─ nome
├─ ativo
└─ UserAccount opcional

MatchJudgeDecision
├─ Match
├─ winnerRegistration
├─ judge
├─ justificativa
└─ data/hora
```

A decisão específica de juiz só é aceita após esgotar os rounds regulares + extras disponíveis sem vencedor.

A operação valida vencedor, juiz ativo da mesma competição, chave atual/ativa, ausência de decisão duplicada e justificativa obrigatória. O resultado oficial entra na progressão normal.

## 10.6 Frontend operacional

`gestao/` representa o contrato com:

- APTO/INAPTO explícito;
- peso opcional;
- metadata `AUTONOMO/RC`;
- orientação de 5 s para autônomo;
- falha de inicialização;
- rounds extras com justificativa;
- cadastro/lista de juízes;
- decisão de juiz identificada e justificada.

O frontend não toma decisões competitivas que pertencem ao backend/juiz.

---

# 11. Chaves e progressão — Bloco 4 consolidado

Histórico de chaves:

```text
nova chave → atual=true
anterior   → atual=false
```

`ativo` e `atual` são conceitos distintos. Chave histórica permanece read-only para operação competitiva.

## 11.1 Geração/regeneração

Fluxo comum:

```text
INSCRICOES_ENCERRADAS ✅ geração/regeneração comum
demais estados       ❌
```

`BracketIntegrityService` centraliza a proteção.

Uma chave apenas montada, inclusive com avanço automático por BYE, ainda pode ser regenerada. A regeneração comum é bloqueada depois de round, resultado ou partida competitiva efetivamente iniciada/finalizada.

## 11.2 Estrutura lógica x agenda operacional

```text
estrutura lógica
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

A edição de agenda não altera quem enfrenta quem. O backend expõe operação específica de agenda em `PATCH /api/v1/partidas/{id}/agenda`.

Depois da geração, o fluxo comum não deve reescrever rodada, ordem lógica ou participantes por uma edição genérica de partida.

## 11.3 Progressão e correção segura

Ao começar disputa real, a chave passa para `EM_ANDAMENTO`.

Correção de resultado propagado:

```text
próxima partida ainda sem atividade
→ correção permitida
→ remover/substituir vencedor anterior no slot dependente

próxima partida já iniciou, possui round ou resultado
→ correção comum bloqueada
→ histórico não é reescrito silenciosamente
```

Rollback competitivo excepcional fica reservado às futuras ferramentas administrativas auditáveis.

## 11.4 Testdata

Os seeds respeitam a mesma invariante de produção:

```text
montar competição em INSCRICOES_ENCERRADAS
→ criar participantes/inspeções
→ gerar chave
→ preparar disputas/histórico
→ restaurar estado demonstrativo EM_ANDAMENTO ou FINALIZADA
```

O cenário Mini Sumô ao vivo monta 16 participantes antes da primeira geração para não depender de regeneração após atividade competitiva.

---

# 12. Qualidade e testes

Checkpoint funcional confirmado após o Bloco 5 / encerramento da ETAPA 1:

```text
Backend Tests
→ 111 testes
→ 0 falhas
→ 0 erros
→ 0 skipped

MySQL + Flyway V12
→ ✅

Profile testdata contra MySQL real
→ ✅

Frontend Gestão
→ typecheck ✅
→ build ✅
```

Esse checkpoint cobre unitários + fluxos integrados reais de Competition, Registration, Follow, Sumô e integridade cross-domain, além do smoke completo de inicialização do `testdata`.

O Bloco 5 concluiu a camada integrada de competição completa com repositories reais e invariantes ponta a ponta.

---

# 13. Fotos e storage

Fotos de robôs hoje:

```text
RobotImageService
→ RobotImageStorageService
→ ./uploads/robots
```

Em paralelo existe a abstração para mídia futura:

```text
ObjectStorageService
R2ObjectStorageService
R2StorageConfiguration
R2StorageProperties
```

Decisão:

```text
CMS/Mídia → ObjectStorageService/R2
```

Não criar um terceiro mecanismo de upload.

---

# PARTE B — FRONTEND

# 14. Gestão autenticada

Arquivos-base:

```text
gestao/src/main.ts
gestao/src/router.ts
gestao/src/store.ts
gestao/src/api.ts
gestao/src/types.ts
```

Telas principais atuais:

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

A gestão usa capacidades semânticas sobre `DEV | GESTAO | MIDIA | PARTICIPANTE`; a autorização real permanece no backend.

A dívida prevista de `api.ts`, `types.ts` e CSS administrativo foi tratada na ETAPA 2; views grandes permanecem intactas quando não há ganho real em decompô-las.

---

# 15. Landing pública

Aplicação:

```text
landing-page/
```

Consome `/api/v1/public/**` para dados competitivos.

Componentes principais incluem:

```text
InstitutionalHeader.vue
HighlightsHero.vue
InstitutionalAbout.vue
TeamRobotsAwards.vue
InstitutionalGallery.vue
InstitutionalEvents.vue
ActiveCompetition.vue
InstitutionalFooter.vue
PublicNotFound.vue
```

Conteúdo institucional ainda possui hardcodes/placeholders. A ETAPA 8 criará CMS/Mídia para remover a necessidade de commits em atualizações editoriais comuns.

---

# 16. Galeria

`photo-gallery/` continua protótipo separado e utiliza catálogo estático.

ETAPA 9 decidirá:

```text
A. manter aplicação separada
B. absorver na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de URL/deploy independente.

---

# PARTE C — EVOLUÇÕES APROVADAS

# 17. ETAPA 11 — Avisos IN_APP + Telegram

Avisos e Telegram serão tratados **na mesma etapa**.

Fluxo conceitual:

```text
GESTAO/DEV
→ seção Avisos
→ seleciona Competition
→ escreve/publica
→ backend persiste Aviso IN_APP
→ participante consulta no RasComp
→ se Telegram habilitado, backend também distribui a comunicação
```

Regras congeladas:

- `IN_APP` é a fonte de verdade e histórico oficial;
- Telegram é canal complementar;
- frontend não chama a Telegram Bot API diretamente;
- falha do Telegram não invalida o aviso persistido;
- token do bot nunca é versionado;
- integração deve poder ser desligada por configuração;
- distribuição precisa respeitar a competição selecionada.

## Identificação Telegram

Na primeira versão **não é obrigatório vincular UserAccount à conta Telegram**.

Uma opção futura/inicialmente opcional é solicitar no bot o **identificador competitivo da Registration aprovada**, planejado para a ETAPA 7, apenas para identificar quem está recebendo avisos.

Consequências:

- ETAPA 11 não pode depender de identificador externo adicional; o código competitivo já planejado na ETAPA 7 pode ser reutilizado para funcionar;
- não criar identificador Telegram paralelo se o código competitivo puder ser reutilizado depois;
- `@username` do Telegram não deve virar identidade oficial do domínio.

A política exata de distribuição será fechada na implementação da ETAPA 11.

---

# 18. Ajustes Gerais / portabilidade / CMS

## ETAPA 5 — Ajustes Gerais DEV

Operações específicas, não editor bruto de SQL/tabelas. Ações críticas exigem auditoria.

## ETAPA 12 — Portabilidade

```text
1 instalação = 1 instituição organizadora
```

Não reutilizar `Institution` das equipes para representar a instituição hospedeira. Criar conceito próprio de configuração da instância.

## ETAPA 8 — CMS/Mídia

Modelo de referência:

```text
MediaAsset
ContentSlot
ContentItem
```

Conteúdo institucional deve deixar de depender de commit Vue.

---

# 19. Regras e Futebol

## ETAPA 13 — Regras, Ajuda e Segurança

Publicação de regulamentos oficiais de Follow, Sumô, Futebol e ambiente/vestimenta. O contrato competitivo técnico será a base para produzir a versão pública simplificada.

## ETAPA 6 — Futebol de Robôs

Requisito:

```text
competidor A × competidor B
robôs fornecidos pela organização
```

Incompatibilidade atual:

```text
Registration.robot obrigatório
ParticipantRegistrationRequest.robotId obrigatório
unicidade baseada em robot
```

A solução deve permitir inscrição legítima sem robô próprio conforme modalidade.

**Não criar robô fake para satisfazer FK.**

---

# 20. Portal participante e identificação competitiva

ETAPA 7 completa equipe, integrantes, robôs, inscrições, desempenho e acompanhamento. Avisos entram depois na ETAPA 11.

Decisão aprovada: cada **Registration aprovada** terá identificador competitivo curto.

Esse código pertence à `Registration`, não ao `Robot`, porque o mesmo robô pode aparecer em categorias/edições diferentes e modalidades futuras podem não exigir robô próprio.

O código poderá ser reutilizado por conferência física e, opcionalmente, para identificação no Telegram.

---

# 21. Deploy

Deploy passa a ser a ETAPA 16 e permanece a última etapa do ciclo.

Decisão congelada:

```text
LOCAL continua funcionando
+
CLOUD é adicionado
```

Arquitetura planejada:

```text
Cloudflare DNS/TLS
Workers Static Assets → frontend
Containers/Docker → Spring Boot
R2 → mídia/uploads
MySQL gerenciado externo → banco
GitHub Actions/Cloudflare → CI/CD
```

D1 não é requisito do primeiro deploy.

---

# PARTE D — PENDÊNCIAS E DECISÕES ABERTAS

# 22. Pendências atuais

## Follow

- checkpoints continuam sem impacto no ranking até regra oficial diferente ser aprovada;
- eventuais desclassificações adicionais ficam dependentes do regulamento da edição.

## Futebol

- equipe obrigatória;
- atribuição dos robôs;
- placar/tempo/desempate;
- formato;
- inspeção/penalidades.

## Mídia/Regras

- política de publicação MIDIA vs DEV;
- arquivamento vs exclusão física;
- slots iniciais;
- responsáveis por editar/publicar Regras.

## Telegram

- formato inicial de distribuição;
- estados de inscrição elegíveis;
- identificação individual opcional ou não na primeira versão;
- estratégia de rastreabilidade/reenvio necessária.

## Galeria

- manter separada ou absorver na Landing.

---

# PARTE E — QUERO ALTERAR X: ONDE MEXO?

# 23. Mapa rápido

## Login/JWT/roles

```text
Backend: UserRole, UserAccount, SecurityConfig, JwtService, UserAccountService
Frontend: types.ts, store.ts, router.ts, ShellLayout.vue
```

## Competition

```text
Backend: Competition*, CompetitionService, CompetitionRepository
Frontend: CompetitionsView.vue, api.ts, types.ts
```

## Registration

```text
Backend: Registration*, RegistrationService, ParticipantPortalService
Frontend: RegistrationsView.vue, ParticipantView.vue, api.ts, types.ts
```

## Team / Competitor / Robot

```text
Backend: Team*, Competitor*, Robot*, AccessPolicyService, ParticipantPortalService
Frontend: AdminCatalogView.vue, ParticipantView.vue, RobotPhoto.vue
```

## Follow

```text
Backend: ConfigFollow*, TentativaSeguidorLinha*, AusenciaTomadaSeguidorLinha*, RankingFollowService
Frontend: FollowView.vue, FollowRunView.vue, FollowTakeHistory.vue
```

## Sumô

```text
Backend: CompetitionCategory.sumoControlMode, ConfigSumo*, InspecaoSumo*, RoundSumo*, CompetitionJudge*, MatchJudgeDecision*
Frontend: SumoView.vue, SumoMatchView.vue, AdminCatalogView.vue, api.ts, types.ts
```

## Chave / resultados / agenda

```text
Backend: BracketGenerationService, BracketIntegrityService, BracketProgressionService, BracketService, MatchService, MatchResultService
Frontend: TournamentBracket.vue, BracketHistoryView.vue, MatchesView.vue, ResultsView.vue
```

## Landing pública

```text
Backend: PublicController, PublicQueryService, Public* DTOs
Frontend: landing-page/src/api.ts, App.vue, ActiveCompetition.vue
```

## Avisos / Telegram (ETAPA 11)

```text
Backend: novo domínio de Aviso + serviço de comunicação + adapter Telegram
Frontend: futura seção Avisos em gestao/
```

---

# 24. Regras de manutenção para qualquer IA

Antes de regra competitiva:

```text
1. localizar entidade/DTO
2. localizar Service fonte de verdade
3. entender estado competitivo
4. criar/alterar teste
5. alterar endpoint se necessário
6. refletir no frontend
7. atualizar documentação se responsabilidade mudou
```

Antes de schema:

```text
1. modelar impacto
2. criar migration V13+
3. nunca reescrever V1–V12
4. atualizar testes
5. validar MySQL/Flyway/testdata
```

Antes de uma etapa/bloco:

```text
1. ler docs/README.md
2. conferir docs/ETAPAS_POS_PROJETO.md
3. permanecer na etapa/bloco atual; após ETAPA 1, aguardar autorização para iniciar ETAPA 2
4. não criar roadmap paralelo
5. não avançar sem validação explícita
```

O RasComp já possui base aprovada. A prioridade é evoluir sem perder integridade, rastreabilidade e previsibilidade.


### Liderança e visibilidade no portal participante

`Team.responsibleUser` representa liderança/gestão da equipe no portal. `Competitor.userAccount` representa a pessoa participante vinculada à equipe.

A visibilidade não é equivalente:

```text
responsibleUser
→ equipe inteira

Competitor.userAccount
→ própria participação
→ Registration em que está associado
→ Robot dessas Registration
```

Assim, pertencer à mesma equipe não concede automaticamente acesso administrativo ou visão de todos os robôs. A regra é aplicada no backend e apenas refletida no frontend.


## Fechamento da matriz de permissões — 19/09/2026

A ETAPA 3 foi validada em uso prático e encerrada.

A matriz vigente permanece:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

A separação entre identidade institucional e participante permanece obrigatória, assim como a distinção entre líder da equipe e membro comum.

Por decisão de planejamento, haverá uma **validação final de permissões imediatamente antes do deploy**, depois que os demais módulos e a futura reorganização do roadmap estiverem consolidados.


## Roadmap reorganizado — 19/09/2026

O planejamento oficial agora segue duas prioridades:

- **PRIORIDADE 1 / ETAPAS 4–10:** consolidação funcional, Ajustes Gerais, Futebol, Portal do Participante, CMS, Landing/Galeria e validação do MVP;
- **PRIORIDADE 2 / ETAPAS 11–15:** Avisos+Telegram, portabilidade, Regras/Ajuda/Segurança, hardening com testes físicos mobile e validação final completa;
- **ETAPA 16:** deploy, última etapa.

A próxima etapa é a ETAPA 4 — Consolidação funcional e polimento do MVP, ainda não iniciada.


## Mobile e responsividade — decisão de roadmap

A responsividade é tratada como **checkpoint transversal da PRIORIDADE 1**, e não como redefinição da ETAPA 4.

```text
ETAPA 4
→ encontra/corrige problemas mobile do sistema atual durante o polimento

ETAPA 7
→ Portal do Participante deve nascer/consolidar responsivo

ETAPA 8
→ CMS/Mídia considera uso em telas menores

ETAPA 9
→ Landing/Galeria fecham responsividade pública

CHECKPOINT MOBILE
→ consolidação obrigatória antes do fechamento do MVP

ETAPA 10
→ só fecha o MVP depois do checkpoint mobile

ETAPA 14
→ testes físicos/hardening em smartphones/tablets reais
```

No checkpoint atual, apenas o login recebeu tratamento responsivo dedicado e validação visual específica.
