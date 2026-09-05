# Dossiê Mestre — Projeto RasComp

Última revisão estrutural: **04/09/2026**

Este é o documento canônico **cross-repo** de arquitetura, domínio, decisões e manutenção do RasComp.

> A ordem das etapas não é definida aqui. A única fonte de verdade para planejamento é `docs/ETAPAS_POS_PROJETO.md`.

Para começar do zero, ler primeiro `docs/README.md`.

---

# 1. Estado global

```text
Projeto apresentado/aprovado                  ✅
ETAPA 0 — baseline                            ✅ concluída / validada
ETAPA 1 — lógica e integridade                🚧 etapa atual
ETAPA 2+                                       ⏳ não iniciadas
Backend — último checkpoint documentado       48 testes / 0 falhas / 0 erros
Banco ativo                                   MySQL
Migrations                                    V1–V7
Próxima migration estrutural                  V8+
Roles atuais                                  ORGANIZACAO | PARTICIPANTE
Roles futuras                                 DEV | GESTAO | MIDIA | PARTICIPANTE
Deploy cloud                                  ⏳ ETAPA 14
```

Em 04/09/2026 foi executado um checkpoint de **limpeza/revisão documental**, sem mudança de etapa. Limpeza técnica de código/artefatos continua reservada à ETAPA 2.

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

A existência de três aplicações frontend é o estado atual. A ETAPA 11 decidirá se `photo-gallery/` permanece independente ou é absorvida pela Landing.

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
- resultados competitivos.

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
V1 ... V7
```

Regra congelada:

```text
V1–V7 nunca são reescritas
próxima mudança estrutural = V8+
```

PostgreSQL não faz parte da configuração ativa. Referências antigas dentro de artefatos legados não definem a arquitetura atual.

---

# 6. Segurança

## Estado atual

```text
UserRole
├─ ORGANIZACAO
└─ PARTICIPANTE
```

Política predominante:

```text
/api/v1/public/**       → público
/api/v1/participante/** → PARTICIPANTE
/api/v1/**              → ORGANIZACAO
```

Conta desativada invalida autenticação nas requisições seguintes porque a validação JWT depende também de `usuario.isEnabled()`.

## ETAPA 3 — matriz futura

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
```

Consequência para Ajustes Gerais:

```text
transferirCompetidor
≠ transferirResponsabilidade
≠ transferirRobo
≠ alterarRole
```

Operações administrativas devem permanecer explícitas e auditáveis.

---

# 8. Competition / Category / Registration

## Competition

Regras atuais relevantes:

- nome único;
- janela de inscrições consistente;
- fim das inscrições até início da competição;
- exclusão lógica via `ativo=false`.

## CompetitionCategory

Catálogo global. Modalidades atuais:

```text
SUMO
FOLLOW_LINE
```

Configuração:

```text
CompetitionCategory 1:1 ConfigSumo
CompetitionCategory 1:1 ConfigFollow
```

## Registration

```text
Registration
├─ Competition obrigatória
├─ CompetitionCategory obrigatória
├─ Team obrigatória
├─ Robot obrigatório
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

Arquivos centrais:

```text
model/Registration.java
dto/RegistrationDTO.java
dto/ParticipantRegistrationRequest.java
controller/RegistrationController.java
service/RegistrationService.java
repository/RegistrationRepository.java
service/ParticipantPortalService.java
```

### Riscos atuais da ETAPA 1

1. `RegistrationService.reativar()` não revalida a janela de inscrições.
2. Cancelamento ainda precisa política por estado competitivo.
3. Geração/regeneração de chave precisa estados de `Competition` explicitamente permitidos.
4. Correção de `MatchResult` após progressão precisa bloqueio ou rollback/reprocessamento.
5. Estados válidos de tentativa Follow precisam formalização.

---

# 9. Follow Line

Estrutura:

```text
Registration
└─ Tomadas
   └─ Tentativas
```

Ranking atual:

```text
tentativa válida + concluída + com tempo
→ melhor tentativa da tomada
→ melhor tomada da inscrição
→ menor tempo final
```

```text
tempoFinal = tempoSegundos + penalidadeSegundos
```

`checkpointsAlcancados` é persistido/exibido, mas **não altera ranking atualmente**.

Decisões abertas:

- combinações válidas de `concluida`, `valida` e `tempoSegundos`;
- efeito oficial dos checkpoints;
- critérios adicionais oficiais de invalidação/desclassificação.

---

# 10. Sumô, chave e progressão

Fluxo:

```text
Registration APROVADA
→ inspeção apta
→ Bracket
→ Match
→ RoundSumo
→ MatchResult
→ progressão
```

Categorias compartilham o motor e ficam isoladas por:

```text
competitionId + categoryId
```

Regras consolidadas:

```text
0 penalidade → normal
1 penalidade → normal
2 penalidades → derrota automática do round
SUICIDIO_WO  → adversário vence
BYE          → avanço automático
```

Histórico de chaves:

```text
nova chave → atual=true
anterior   → atual=false
```

`ativo` e `atual` são conceitos distintos. Chave histórica é read-only para operação competitiva.

---

# 11. Fotos e storage

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

# 12. Gestão autenticada

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

A gestão ainda usa `isOrganization`/`isParticipant`. A ETAPA 3 migrará para a nova matriz de permissões e deve preferir capacidades semânticas (`canManageCompetition`, `canOperateCompetition`, etc.).

Dívida de `api.ts`, `types.ts`, views grandes e CSS sobreposto fica reservada à ETAPA 2.

---

# 13. Landing pública

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

Conteúdo institucional ainda possui hardcodes/placeholders. A ETAPA 7 criará CMS/Mídia para remover a necessidade de commits em atualizações editoriais comuns.

---

# 14. Galeria

`photo-gallery/` continua protótipo separado e utiliza catálogo estático.

ETAPA 11 decidirá:

```text
A. manter aplicação separada
B. absorver na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de URL/deploy independente.

---

# PARTE C — EVOLUÇÕES APROVADAS

# 15. ETAPA 4 — Avisos IN_APP + Telegram

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

Uma opção futura/inicialmente opcional é solicitar no bot o **identificador competitivo da Registration aprovada**, planejado para a ETAPA 10, apenas para identificar quem está recebendo avisos.

Consequências:

- ETAPA 4 não pode depender do código da ETAPA 10 para funcionar;
- não criar identificador Telegram paralelo se o código competitivo puder ser reutilizado depois;
- `@username` do Telegram não deve virar identidade oficial do domínio.

A política exata de distribuição (canal/grupo/bot, destinatários e estados de inscrição elegíveis) será fechada na implementação da ETAPA 4.

---

# 16. Ajustes Gerais / portabilidade / CMS

## ETAPA 5 — Ajustes Gerais DEV

Operações específicas, não editor bruto de SQL/tabelas. Ações críticas exigem auditoria.

## ETAPA 6 — Portabilidade

```text
1 instalação = 1 instituição organizadora
```

Não reutilizar `Institution` das equipes para representar a instituição hospedeira. Criar conceito próprio de configuração da instância.

## ETAPA 7 — CMS/Mídia

Modelo de referência:

```text
MediaAsset
ContentSlot
ContentItem
```

Conteúdo institucional deve deixar de depender de commit Vue.

---

# 17. Regras e Futebol

## ETAPA 8 — Regras

Publicação de regulamentos oficiais de Follow, Sumô, Futebol e ambiente/vestimenta. Textos atuais são requisitos preliminares até validação da organização.

## ETAPA 9 — Futebol de Robôs

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

# 18. Portal participante e identificação competitiva

ETAPA 10 completa equipe, integrantes, robôs, inscrições, avisos, desempenho e acompanhamento.

Decisão aprovada: cada **Registration aprovada** terá identificador competitivo curto.

Esse código pertence à `Registration`, não ao `Robot`, porque o mesmo robô pode aparecer em categorias/edições diferentes e modalidades futuras podem não exigir robô próprio.

O código poderá ser reutilizado por conferência física e, opcionalmente, para identificação no Telegram.

---

# 19. Deploy

Deploy permanece ETAPA 14.

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

# PARTE D — RISCOS E DECISÕES ABERTAS

# 20. Pendências atuais

## ETAPA 1

- reativação fora da janela;
- política de cancelamento;
- estados válidos para chave;
- alteração de resultado após progressão;
- estados de tentativa Follow.

## Follow

- impacto oficial de checkpoints;
- estados válidos de tentativa;
- desclassificações adicionais oficiais.

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

- formato inicial de distribuição (canal/grupo/bot);
- estados de inscrição que recebem comunicação;
- identificação individual opcional ou não na primeira versão;
- estratégia de rastreabilidade/reenvio necessária.

## Galeria

- manter separada ou absorver na Landing.

---

# PARTE E — QUERO ALTERAR X: ONDE MEXO?

# 21. Mapa rápido

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
Backend: ConfigFollow*, TentativaSeguidorLinha*, RankingFollowService
Frontend: FollowView.vue, FollowRunView.vue, FollowTakeHistory.vue
```

## Sumô / chave / resultados

```text
Backend: ConfigSumo*, InspecaoSumo*, RoundSumo*, Bracket*, Match*, MatchResult*
Frontend: SumoView.vue, SumoMatchView.vue, TournamentBracket.vue, BracketHistoryView.vue
```

## Landing pública

```text
Backend: PublicController, PublicQueryService, Public* DTOs
Frontend: landing-page/src/api.ts, App.vue, ActiveCompetition.vue
```

## Avisos / Telegram (futuro)

```text
Backend: novo domínio de Aviso + serviço de comunicação + adapter Telegram
Frontend: futura seção Avisos em gestao/
```

---

# 22. Regras de manutenção para qualquer IA

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
2. criar migration V8+
3. nunca reescrever V1–V7
4. atualizar testes
5. validar MySQL/Flyway/testdata
```

Antes de uma etapa:

```text
1. ler docs/README.md
2. conferir docs/ETAPAS_POS_PROJETO.md
3. permanecer na etapa atual
4. não criar roadmap paralelo
5. não avançar sem validação explícita
```

O RasComp já possui base aprovada. A prioridade é evoluir sem perder integridade, rastreabilidade e previsibilidade.