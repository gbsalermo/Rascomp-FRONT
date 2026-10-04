# Dossiê Mestre — Projeto RasComp

Última revisão estrutural: **01/10/2026**

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
ETAPA 4                                        🚧 em andamento — BLOCO 4 / Portal do Participante
BLOCO 3 — Operação competitiva                 ✅ concluído / validado
BLOCO 4.1 — Equipe e associação                ✅ implementado
BLOCO 4.2 — Responsáveis por robô              ✅ base funcional implementada
BLOCO 4.3 — Inscrições participante/robô       🧪 implementação principal pronta / aguardando build + validação
BLOCO 4.4 — Polimento + bateria final           ⏳ não iniciado
Backend/Frontend                               revalidar suíte/build após alterações do BLOCO 4.3
Banco ativo                                    MySQL
Migrations                                     V1–V27
Próxima migration estrutural                   V28+
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
V1 ... V24
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
V13+ — evolução posterior de permissões, sessão e consolidação da ETAPA 4
V20–V23 — auditorias/correções finais do BLOCO 3
V24 — convites/solicitações de equipe + responsáveis por robô
```

Regra congelada:

```text
migrations aplicadas nunca são reescritas
próxima mudança estrutural = V27+
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

A consolidação básica do Portal foi antecipada no **BLOCO 4 da ETAPA 4** para tornar o MVP atual utilizável antes da expansão da ETAPA 7.

Modelo consolidado:

```text
UserAccount PARTICIPANTE
→ Competitor
→ Team

Team
→ Robot
→ RobotResponsible (N:N Robot ↔ Competitor)

Registration
→ Competition + Category + Team + Robot
→ competidores específicos daquela inscrição
→ PENDENTE → APROVADA/REJEITADA
```

Regras:
- líder administra todos os Robots e Registrations da equipe;
- membro comum pode visualizar Robots pelos quais é responsável, mas só inicia/administra Registration de Robot que cadastrou;
- `Robot.createdByUser` preserva autoria histórica;
- responsabilidade permanente não é igual à composição oficial da edição;
- composição é derivada automaticamente de responsabilidade + elegibilidade pessoal, sem seletor arbitrário de colegas;
- criar Robot não exige aprovação;
- Registration normal nasce `PENDENTE`;
- ao menos um responsável pessoalmente APROVADO já permite aprovação do Robot;
- mudanças antes da prova sincronizam composição e geram auditoria/veto da GESTAO;
- mudanças normais de responsáveis/composição ficam congeladas durante competição iniciada;
- entrada manual DEV permanece contingência operacional e não substitui o Portal.

O BLOCO 4.3 implementou esse fluxo normal. O BLOCO 4.4 permanece não iniciado até a validação manual.

A ETAPA 7 completa/refina equipe, integrantes, robôs, inscrições, desempenho e acompanhamento. Avisos entram depois na ETAPA 11.

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
Team.responsibleUser
→ equipe inteira
→ administra todos os robôs e responsáveis

Competitor.userAccount
→ identidade competitiva da pessoa
→ pertence a uma única equipe competitiva

RobotResponsible
→ define quais robôs aparecem como "Meus robôs" para o membro comum

RegistrationCompetitor
→ define quem participa daquela inscrição específica
```

O líder mantém visão administrativa da equipe inteira mesmo sem ser responsável por cada robô. O membro comum não ganha visão de todos os robôs apenas por pertencer à equipe: vê os robôs em que possui responsabilidade ativa. A responsabilidade permanente pelo robô e a composição de uma inscrição são conceitos distintos.


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


## ETAPA 4 — checkpoint 22/09/2026

BLOCO 1 da ETAPA 4 concluído em 22/09/2026.

Consolidações relevantes:

- baseline técnico revalidado;
- autenticação e sessão revisadas;
- `Lembrar de mim` preserva e-mail sem persistir senha;
- política de sessão única adicionada via Flyway V14;
- Shell administrativo e navegação global revisados;
- bug de breakpoint desktop/mobile corrigido;
- navegação reorganizada para priorizar operação ao vivo;
- recuperação de senha definitiva permanece planejada para ETAPA 13;
- fallback assistido por DEV previsto com credencial temporária, uso único/expiração e troca obrigatória;
- celular físico permanece como pendência transversal do checkpoint mobile.

Checkpoint final do bloco:
`Frontend Checks #97`, `Backend Tests #329`, 142 testes verdes, MySQL + Flyway V14 + testdata verdes.

Próximo: BLOCO 2 — Gestão administrativa.


## ETAPA 4 — BLOCO 2 — Dashboard/Central

BLOCO 2 iniciado pela revisão 2.1 do Dashboard/Central.

Direção aplicada:

- remover o indicador "Progresso do evento" baseado apenas em datas, por ser ambíguo como métrica operacional;
- remover o bloco separado de "Acesso rápido";
- transformar métricas principais em cards clicáveis que também servem como atalhos;
- ampliar de 4 para 6 cards operacionais:
  - pendências de inscrição;
  - equipes inscritas;
  - robôs inscritos;
  - categorias em uso;
  - chaves atuais;
  - partidas concluídas/total;
- manter "Competição em foco" como contexto principal;
- adicionar atalhos contextuais para Follow, Sumô e Resultados dentro do card da edição;
- substituir "Últimas inscrições" por "Atividade e agenda";
- combinar movimentações recentes de inscrição com próximas partidas agendadas;
- fazer o Dashboard reagir à troca de `competition.selectedId`;
- buscar inscrições já filtradas por `competitionId`, reduzindo carregamento global desnecessário;
- carregar chaves e partidas apenas da competição em foco;
- manter responsividade específica da tela.

A regra de escopo da competição em foco para DEV x GESTAO ainda não foi alterada nesta subetapa; ela será tratada no bloco de Competições/Contexto com backend como fonte de verdade.


## ETAPA 4 — BLOCO 2 administrativo

Implementação concluída e validação manual aprovada.

Consolidações:

- Competition focus do DEV separado da Competition vigente global;
- V15 persiste a competição vigente;
- GESTAO opera somente a vigente;
- usuários separados em Organização/Diretoria e Participantes;
- edição cadastral de contas sem conversão de identidade;
- nova visão administrativa de Competidores;
- catálogos de Equipes/Robôs/Competidores contextualizados pela competição;
- mutações estruturais administrativas DEV-only;
- fotos de robôs respeitam o contexto de competição para GESTAO;
- Inscrições consolidadas com aprovação/rejeição/cancelamento/reativação e solicitações de cancelamento;
- backend aplica o contexto da competição nas operações administrativas.

Checkpoint: Frontend Checks #137 verde; Backend Tests #371 com 155 testes verdes; MySQL/Flyway V15/testdata verde.

O bloco ainda depende de validação prática e das decisões sobre categorias por competição e efeito da desativação de UserAccount PARTICIPANTE sobre Competitor.


## ETAPA 4 — fechamento do BLOCO 2

BLOCO 2 — Gestão administrativa concluído e validado em 23/09/2026.

Checkpoint final:

- Frontend Checks #170 ✅;
- Backend Tests #415 ✅;
- 161 testes verdes;
- MySQL + Flyway V17 + testdata ✅.

Próximo: BLOCO 3 — Operação competitiva, ainda não iniciado.


## ETAPA 4 — BLOCO 3 / 3A Follow Line

BLOCO 3 iniciado em 23/09/2026.

Estrutura:

- 3A Follow Line;
- 3B Sumô;
- 3C Chaves / Agenda / Resultados.

Primeiro checkpoint da 3A:

- contexto DEV foco local x GESTAO vigente aplicado ao Follow;
- backend protegido por CompetitionContextService em tentativas/ausências;
- ranking administrativo contextualizado;
- ranking público preservado;
- FollowView diferencia foco e vigente;
- fluxo integrado cobre bloqueio da GESTAO fora da vigente.

Checkpoint de código: Frontend Checks #177 ✅; Backend Tests #429 ✅ com 162 testes; MySQL/Flyway V17/testdata ✅.


## ETAPA 4 — BLOCO 3 implementado

As frentes 3A Follow Line, 3B Sumô e 3C Chaves/Agenda/Resultados estão implementadas.

Principais entregas:

- contexto foco/vigente aplicado à operação competitiva;
- Agenda unificada Follow + Sumô;
- chamada geral e fila de tomadas Follow;
- V18 para agenda Follow;
- Dashboard consumindo próximas atividades;
- desclassificação manual/automática auditada;
- resolução administrativa de Sumô sem round fictício;
- Resultados por categoria com campeão Follow apenas após programa completo;
- chave vigente/histórica, progressão e correção preservadas.

Checkpoint: Frontend Checks #213 ✅; Backend Tests #493 ✅ com 166 testes; MySQL/Flyway V18/testdata ✅.

BLOCO 3 aguarda validação manual final.


## Atualização operacional — 30/09/2026 — fechamento técnico do BLOCO 3

O fechamento manual do BLOCO 3 resultou em quatro extensões de domínio consideradas necessárias ao MVP operacional:

1. entrada manual DEV de participante/robô, partindo de conta PARTICIPANTE existente e gerando inscrição aprovada auditada;
2. regeneração excepcional e segura de chave antes do início de atividade competitiva real;
3. pódio oficial completo, incluindo disputa de 3º lugar no Sumô e pódio manual auditado no Follow sem tempos classificáveis;
4. correção excepcional DEV de resultado Sumô, com auditoria e proteção de dependências.

Migrations adicionadas:

- V20 — auditoria da regeneração excepcional de chave;
- V21 — tipo de partida Sumô (`ELIMINATORIA / TERCEIRO_LUGAR`);
- V22 — segundo/terceiro lugar do resultado administrativo Follow;
- V23 — auditoria da correção excepcional de MatchResult.

A UI Chaves passa a ter maior independência do módulo Sumô, enquanto Resultados se torna a fonte visual principal do pódio e do histórico competitivo Follow/Sumô.


## ETAPA 4 — BLOCO 4 — Portal do Participante — checkpoint 01/10/2026

Escopo dividido para evitar crescimento descontrolado:

```text
4.1 Equipe e associação
4.2 Responsáveis por robô
4.3 Inscrição pelo Portal
4.4 Polimento + validação
```

### 4.1 — implementado

- líder envia convite por e-mail para conta PARTICIPANTE;
- participante aceita/recusa;
- participante sem equipe pode solicitar ingresso em equipe existente;
- líder aprova/rejeita;
- aceite/aprovação cria ou reaproveita `Competitor` e vincula `UserAccount → Competitor → Team`;
- conta já associada a outra equipe competitiva é bloqueada;
- criação de equipe pelo participante já cria seu Competitor automaticamente.

### 4.2 — base funcional implementada

- V24 cria `robot_responsibles`;
- `Robot ↔ Competitor` é N:N;
- qualquer competidor autorizado da equipe pode cadastrar robô;
- criador entra como responsável inicial;
- líder administra responsáveis e continua com acesso a todos os robôs;
- membro comum vê em "Meus robôs" os robôs em que possui responsabilidade;
- edição/fotos respeitam responsabilidade ou liderança.

### Regra de aprovação competitiva

Cadastro de `Robot` não representa participação em competição.

```text
Robot da equipe
→ participante escolhe competição/categoria
→ cria Registration PENDENTE
→ GESTAO aprova/rejeita
→ APROVADA = alocação oficial do robô à competição
```

`RobotResponsible` (responsabilidade permanente) e `RegistrationCompetitor` (composição daquela inscrição) não são a mesma relação.

### Próximo

Implementar **4.3 — inscrição normal pelo Portal**, usando responsáveis do robô como sugestão inicial de competidores e preservando o fluxo administrativo existente de aprovação pela GESTAO.


---

## Revisão canônica do BLOCO 4.3 — duas inscrições + aprovação cruzada — 01/10/2026

O modelo anterior de inscrição direta do Robot foi **supersedido antes da validação manual**.

Agora existem duas aprovações independentes por Competition:

```text
Competitor → ParticipantCompetitionRegistration
Robot      → Registration
```

Fluxo pessoal:

```text
Competitor
→ Competition
→ dados
→ comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
```

Fluxo do Robot:

```text
Robot
→ Competition + Category
→ 1+ competidores
→ comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
```

Invariantes:

- pertencer à Team não depende de estar inscrito em Competition;
- ser `RobotResponsible` não depende de estar inscrito em Competition;
- cadastrar Robot não exige aprovação administrativa;
- `Registration.competitors` deve conter apenas `RobotResponsible` ativos daquele Robot;
- liderança da Team concede administração do cadastro, mas não responsabilidade competitiva automática;
- o líder só pode constar como competidor de um Robot quando estiver explicitamente ligado a ele como `RobotResponsible`;
- a inscrição do Robot pode ser enviada enquanto inscrições pessoais ainda estão `PENDENTE`;
- a inscrição do Robot pode ser `APROVADA` quando existir ao menos um responsável pessoalmente `APROVADO` na mesma Competition; responsáveis `PENDENTE` não bloqueiam outro elegível;
- aprovação pessoal e aprovação do Robot nunca propagam automaticamente uma para a outra;
- comprovantes e auditorias das duas inscrições permanecem independentes.

### UX da GESTAO

Ao aprovar Competitor, mostrar os Robots pelos quais ele é responsável e o status das inscrições desses Robots na mesma Competition.

Ao aprovar Robot, mostrar seus competidores selecionados e, para cada um, o status da inscrição pessoal na mesma Competition.

A interface deve destacar dependências. O backend deve bloquear qualquer aprovação inconsistente mesmo se o request for adulterado.

Exemplo bloqueado:

```text
Robot Vespa
competidor selecionado = João
João não é RobotResponsible do Vespa
→ aprovação proibida
```

Exemplo bloqueado:

```text
Robot Vespa
competidor = Gabriel
Gabriel é RobotResponsible
inscrição pessoal de Gabriel = PENDENTE
→ Robot permanece PENDENTE
```

O fluxo manual DEV continua exceção auditável e deve formalizar as relações reais necessárias.

Estado após esta revisão:

```text
BLOCO 4.3 = REABERTO / EM IMPLEMENTAÇÃO
BLOCO 4.4 = NÃO INICIADO
```


### Cardinalidade N:N Robot ↔ Competitor

A relação de responsabilidade é obrigatoriamente **muitos-para-muitos**:

```text
1 Robot
→ 1..N RobotResponsible

1 Competitor
→ 0..N Robots como RobotResponsible
```

Exemplos válidos:

```text
Vespa
→ Gabriel
→ João
→ Maria

Gabriel
→ Vespa
→ Atlas
→ LineBot
```

As exigências de aprovação definem apenas o mínimo necessário para uma participação válida; elas **não limitam** Robot a um único Competitor nem Competitor a um único Robot.

Regras de alteração posterior:

- um Robot já cadastrado pode receber novos `RobotResponsible`;
- um Competitor pode ser associado como responsável a vários Robots da própria Team;
- antes do início da Competition, alterações feitas pelo líder em `RobotResponsible` devem refletir automaticamente na composição competitiva da Registration correspondente;
- uma `Registration` já `APROVADA` **não volta para PENDENTE** só porque a composição foi ajustada antes da competição;
- novo responsável com inscrição pessoal `APROVADA` na mesma Competition pode entrar automaticamente em `Registration.competitors`;
- novo responsável cuja inscrição pessoal ainda esteja `PENDENTE` pode existir como `RobotResponsible`, mas só passa a integrar oficialmente a composição competitiva quando sua inscrição pessoal ficar `APROVADA`;
- remover um responsável antes do início da competição remove automaticamente essa pessoa da composição competitiva daquela Registration;
- a GESTAO recebe aviso/auditoria da alteração de composição e pode **vetar a mudança competitiva específica**, com justificativa, sem obrigar o Robot inteiro a passar por nova aprovação;
- o veto da GESTAO afeta a associação competitiva daquela Competition/Registration; não precisa apagar o vínculo permanente `RobotResponsible`, que pode continuar válido para outras competições;
- quando a Competition atingir `EM_ANDAMENTO` ou sua data de início, a composição `Registration.competitors` fica congelada no fluxo normal;
- depois desse bloqueio, líder/participantes não podem ficar trocando responsáveis competitivos durante a prova.

Portanto:

```text
RobotResponsible
= vínculo permanente N:N

Registration.competitors
= recorte competitivo daquele Robot naquela Competition/Category
```


---

## Checkpoint 01/10/2026 — BLOCO 4.3 / inscrição dupla e N:N implementados

> **Histórico superado pelas regras V26/V27.** Para o comportamento vigente, usar `docs/REGRAS_PARTICIPANTE.md` e o checkpoint de 03/10/2026 abaixo.

O 4.3 foi reaberto antes da validação manual e a implementação principal foi alinhada ao fluxo real definido com o cliente.

### Migration V25

`V25__participant_competition_registration_and_payment_receipts.sql` adiciona:

- `participant_competition_registrations`;
- unicidade `Competition + Competitor`;
- status pessoal `PENDENTE | APROVADA | REJEITADA | CANCELADA`;
- solicitante/revisor/data/motivo;
- metadata do comprovante pessoal;
- metadata do comprovante da Registration do Robot.

Migrations V1–V25 permanecem imutáveis. Próxima migration estrutural: **V26+**.

### Inscrição pessoal

Fluxo:

```text
PARTICIPANTE associado a Competitor/Team
→ Competition com inscrições abertas
→ comprovante
→ ParticipantCompetitionRegistration PENDENTE
→ GESTAO aprova/rejeita
```

A associação à Team e a responsabilidade por Robot continuam independentes desta aprovação.

### Inscrição de Robot

Fluxo normal:

```text
Robot
→ Competition + Category
→ selecionar 1..N RobotResponsible
→ comprovante próprio
→ Registration PENDENTE
→ GESTAO analisa
```

A aprovação exige simultaneamente:

- pelo menos um competidor;
- todos os `Registration.competitors` são `RobotResponsible` ativos do Robot;
- todos possuem inscrição pessoal `APROVADA` na mesma Competition;
- comprovante do Robot presente;
- invariantes anteriores de Registration preservadas.

A Registration pode ser enviada enquanto as inscrições pessoais estão PENDENTE; apenas a aprovação fica bloqueada.

### Relação N:N

```text
Robot → 1..N RobotResponsible
Competitor → 0..N Robots
```

O cenário QA passa a provar os dois sentidos:

```text
Vespa → Membro B4 + Apoio B4
Apoio B4 → Vespa + Atlas
```

Adicionar responsabilidade permanente não reescreve uma Registration existente.

Remover um `RobotResponsible` usado em Registration `PENDENTE` ou `APROVADA` é bloqueado até regularização.

O fluxo manual DEV formaliza a responsabilidade escolhida antes de criar a entrada competitiva excepcional.

### Aprovação cruzada na GESTAO

A interface administrativa passa a mostrar:

```text
Competitor → Robots associados + status das inscrições dos Robots
Robot → Competitors selecionados + status da inscrição pessoal
```

Os comprovantes da pessoa e do Robot são independentes e podem ser consultados pela GESTAO.

O frontend antecipa bloqueios para UX, mas o backend repete as validações no momento da aprovação.

### Storage de comprovantes

Storage local atual:

```text
./uploads/registration-receipts
```

Formatos aceitos:

- PDF;
- JPEG;
- PNG;
- WEBP.

Limite: 10 MB.

O diretório `uploads/` já permanece ignorado pelo Git.

### QA automatizado preparado

O profile `testdata` usa:

```text
membro.b4@rascomp.local → Vespa
apoio.b4@rascomp.local  → Vespa + Atlas
lider.b4@rascomp.local  → administra a Team
gestao.b4@rascomp.local → aprovação
```

O job `portal-testdata` foi atualizado para:

1. criar duas inscrições pessoais PENDENTE com comprovante;
2. criar Vespa PENDENTE com dois RobotResponsible;
3. comprovar que aprovação precoce do Robot falha;
4. aprovar as duas pessoas;
5. confirmar contexto cruzado;
6. aprovar o Robot;
7. confirmar que apenas APROVADA entra na API pública.

Também foram adicionados/adaptados testes unitários e de fluxo para inscrição pessoal, comprovante, responsabilidade e remoção protegida.

### Estado

```text
BLOCO 4.3
→ implementação principal adiantada
→ build/CI atual ainda NÃO confirmado
→ validação manual ainda NÃO realizada

BLOCO 4.4
→ NÃO INICIADO
```

A bateria manual canônica está em `docs/VALIDACAO_ETAPA4_BLOCO4.md`.


### Sequenciamento obrigatório — inscrição pessoal antes do robô

Para garantir cadastro separado e em ordem sem obrigar o participante a aguardar análise administrativa:

```text
1. PARTICIPANTE envia Minha inscrição
   → ParticipantCompetitionRegistration = PENDENTE

2. A existência da inscrição pessoal PENDENTE ou APROVADA
   → libera Inscrever robô

3. PARTICIPANTE envia Registration do Robot
   → Registration = PENDENTE

4. GESTAO analisa
   → primeiro aprova as pessoas
   → depois pode aprovar o Robot
```

Regras:

- antes de existir inscrição pessoal `PENDENTE` ou `APROVADA` na Competition, o botão de inscrição de Robot fica bloqueado;
- não é necessário aguardar a aprovação pessoal para criar a inscrição do Robot;
- cada responsável considerado para a competição precisa possuir inscrição pessoal na mesma Competition;
- para aprovar o Robot, é suficiente existir **pelo menos um** responsável com inscrição pessoal `APROVADA`;
- responsáveis `PENDENTE` não bloqueiam a aprovação do Robot, mas ainda não entram na composição oficial;
- responsáveis `REJEITADA` ou `CANCELADA` não entram na composição oficial e também não bloqueiam o Robot enquanto existir pelo menos um responsável `APROVADA`;
- inscrição pessoal `REJEITADA` ou `CANCELADA` não libera nova inscrição de Robot;
- o backend repete todas essas validações, independentemente da interface.


### Regra revisada — sincronização automática da composição competitiva

A regra anterior que exigia nova aprovação completa do Robot após alteração de responsáveis foi descartada.

Fluxo canônico:

```text
Competition ainda não iniciou
+
líder altera RobotResponsible
↓
sistema sincroniza Registration.competitors automaticamente
↓
Registration APROVADA permanece APROVADA
↓
GESTAO recebe aviso/auditoria
↓
GESTAO pode vetar a mudança específica com justificativa
```

Elegibilidade:

- responsável com inscrição pessoal `APROVADA` entra automaticamente na composição oficial;
- responsável com inscrição pessoal `PENDENTE` pode permanecer associado ao Robot, porém só entra oficialmente na composição competitiva quando sua inscrição pessoal for aprovada;
- responsável removido antes do início da competição sai automaticamente da composição daquela Registration;
- se a composição ficar sem nenhum competidor elegível, aplicam-se as regras de rejeição/regularização da Registration do Robot.

Limite temporal:

```text
Competition.status == EM_ANDAMENTO
OU
data atual >= Competition.dataInicio

→ Registration.competitors congelado
→ líder/participantes não alteram composição pelo fluxo normal
```

A Gestão não precisa reaprender/reaprovar o Robot inteiro a cada ajuste. O controle é por **notificação + auditoria + veto justificado da alteração específica**.

O veto administrativo é contextual à Competition/Registration. Ele não precisa apagar o vínculo permanente `RobotResponsible`, pois esse vínculo pode continuar relevante para futuras competições.


### Regra consolidada — aprovação do Robot com elegibilidade parcial

A aprovação da Registration do Robot **não exige aprovação pessoal de todos os RobotResponsible**.

Exemplo:

```text
Vespa
├─ Gabriel → REJEITADA
├─ João    → PENDENTE
└─ Maria   → APROVADA
```

Resultado:

```text
Maria é responsável elegível ✅
→ Vespa pode ser APROVADO
```

Composição oficial naquele instante:

```text
Registration.competitors
└─ Maria
```

Gabriel permanece fora da composição oficial porque sua inscrição pessoal foi rejeitada.

João continua associado ao Robot como `RobotResponsible`, porém não integra a composição oficial enquanto sua inscrição pessoal estiver `PENDENTE`. Se João for aprovado antes do início da Competition, ele entra automaticamente na composição e a GESTAO recebe aviso/auditoria da alteração.

Regra de decisão:

```text
>= 1 responsável com inscrição pessoal APROVADA
→ Robot pode ser APROVADO

0 APROVADOS + existe ao menos 1 PENDENTE
→ Robot permanece PENDENTE

0 APROVADOS + todos os responsáveis REJEITADOS/CANCELADOS
→ Robot Registration é REJEITADA automaticamente
→ motivo: sem responsável elegível
```

A rejeição pessoal nunca remove automaticamente o vínculo permanente `RobotResponsible`; ela apenas retira a elegibilidade naquela Competition.


---

## Checkpoint canônico 01/10/2026 — regras do participante / V26

Fonte funcional específica: `docs/REGRAS_PARTICIPANTE.md`.

Implementação consolidada no BLOCO 4.3:

- V25 separa inscrição individual e Registration do Robot, com comprovantes independentes;
- V26 adiciona `Robot.createdByUser`, auditoria/veto de composição, histórico da inscrição individual e histórico de liderança;
- membro comum só inicia/administra Registration de Robot que ele cadastrou;
- líder pode iniciar/administra Registration de qualquer Robot da própria Team;
- responsabilidade N:N não transfere ownership da Registration;
- Minha inscrição `PENDENTE` ou `APROVADA` libera o fluxo de Robot sem esperar análise;
- composição oficial do Robot é derivada automaticamente dos responsáveis elegíveis;
- **um único responsável pessoalmente APROVADO já basta para o Robot poder ser aprovado**;
- responsáveis `PENDENTE` não bloqueiam outro aprovado;
- aprovação posterior de responsável antes da prova o adiciona automaticamente à composição;
- mudança de responsáveis antes da prova não devolve Robot aprovado para análise completa quando ainda existe elegível;
- GESTAO recebe alteração de composição e pode MANTER/VETAR a mudança específica, com auditoria e justificativa no veto;
- nova proposta posterior a veto é permitida;
- se nenhum elegível existir, Robot permanece PENDENTE quando houver caso recuperável ou é REJEITADO automaticamente quando todos forem inelegíveis;
- Robot rejeitado pode ser conscientemente reinscrito pelo líder/criador quando as condições voltarem a ser válidas;
- líder atual não pode sofrer rejeição pessoal definitiva sem correção ou transferência DEV;
- `CORRECAO_SOLICITADA` permite reenvio sem perder Team;
- DEV pode transferir liderança para participante ativo da mesma Team com inscrição individual PENDENTE/APROVADA, com histórico;
- durante Competition iniciada, mudanças normais de responsáveis/composição ficam bloqueadas.

Bateria canônica: `docs/VALIDACAO_ETAPA4_BLOCO4.md`.

Estado:

```text
4.3 → IMPLEMENTAÇÃO REVISADA / AGUARDANDO BUILD + VALIDAÇÃO MANUAL
4.4 → NÃO INICIADO
```

Não considerar suíte/build verdes sem execução real nos heads atuais.


---

## Checkpoint pós-bateria manual — 03/10/2026

A bateria principal do BLOCO 4.3 foi executada até o Teste 40. Os testes 35–40 foram validados após correção do isolamento do profile `testdata`.

Os achados da bateria geraram uma rodada focal de correções:

- V27 adiciona `registrations.robot_description` para preservar a descrição enviada com a inscrição do Robot;
- criador/líder podem editar nome e descrição simples do Robot;
- cadastro de Robot pode ser removido/desativado com segurança quando não houver Registration PENDENTE/APROVADA;
- duplicidade de nome dentro da mesma Team permanece protegida por serviço + constraint;
- seção de inscrições de Robot e alertas receberam maior destaque;
- cards da GESTAO agora identificam explicitamente métricas de **Robots**;
- filtro de Competition foi movido para o topo da página Inscrições;
- aba do navegador passou a usar título por perfil;
- líder da Team passou a ser identificado no Portal, Competidores e análise de inscrição pessoal;
- reinclusão de responsável gera novo evento de composição;
- veto de remoção restaura `RobotResponsible`;
- veto de adição desfaz a associação;
- mudanças não vetadas não exigem aprovação: são consolidadas automaticamente ao iniciar a Competition;
- edição comum da Competition não altera status;
- ciclo operacional obrigatório permanece `INSCRICOES_ABERTAS → INSCRICOES_ENCERRADAS → EM_ANDAMENTO`;
- entrada manual DEV em `EM_ANDAMENTO` continua excepcional, justificada e auditada, exigindo PARTICIPANTE já associado a Team;
- criação administrativa completa de pessoa/competidor sem vínculo prévio continua no roadmap da ferramenta DEV ampliada.

Validação focal vigente: `docs/VALIDACAO_ETAPA4_BLOCO4.md`, seção **Bateria curta de regressão dos achados (R1–R15)**.

Estado:

```text
BLOCO 4.3
→ bateria 1–40 executada
→ correções pós-bateria implementadas
→ AGUARDANDO regressão R1–R15 + build/testes automatizados

BLOCO 4.4
→ NÃO INICIADO
```

Migrations atuais: **V1–V27**. Próxima migration estrutural: **V28+**.


---

## Encerramento definitivo da ETAPA 4 — 03/10/2026

A ETAPA 4 foi encerrada após validação manual completa do Portal e das correções pós-bateria.

```text
BLOCO 1        ✅
BLOCO 2        ✅
BLOCO 3        ✅
BLOCO 4.1      ✅
BLOCO 4.2      ✅
BLOCO 4.3      ✅
Bateria 1–40   ✅
Regressão R1–R17 ✅
ETAPA 4        ✅ CONCLUÍDA
```

Migrations atuais: **V1–V27**.

O documento funcional canônico do participante é `docs/REGRAS_PARTICIPANTE.md`.

O antigo 4.4 de polimento não prossegue como bloco independente. Landing/polimento será consolidado com a etapa já prevista de Landing/Galeria/conteúdo público, cuja forma final será decidida após este merge.

Não há afirmação de CI remoto verde neste checkpoint porque não havia execução nova registrada do GitHub Actions nos heads finais.
