# Dossiê Mestre — Projeto RasComp

Última revisão estrutural: **31/08/2026**

Este é o documento canônico **cross-repo** de arquitetura, domínio, decisões e manutenção do RasComp.

Ele responde:

1. o que é o RasComp;
2. onde está cada parte do sistema;
3. qual camada é responsável por cada regra;
4. quais decisões já foram tomadas;
5. quais riscos e decisões continuam abertas;
6. onde mexer quando uma funcionalidade muda.

> **Este documento não define a ordem do roadmap.** A única fonte de verdade para etapa atual e sequência de execução é `docs/ETAPAS_POS_PROJETO.md`.

Para uma IA começando do zero, ler primeiro `docs/README.md`.

---

# 1. Estado global em 31/08/2026

```text
Projeto apresentado à equipe                  ✅ aprovado
ETAPA 0 — baseline/congelamento               ✅ concluída e validada
ETAPA 1 — correções de lógica                 🚧 etapa atual
ETAPA 2+                                       ⏳ não iniciadas
Backend — último checkpoint documentado       48 testes / 0 falhas / 0 erros
Migrations                                    V1–V7
Próxima migration estrutural                  V8+
Roles implementadas                           ORGANIZACAO | PARTICIPANTE
Roles futuras aprovadas                       DEV | GESTAO | MIDIA | PARTICIPANTE
Página 404 gestão + landing                    ✅ implementada em 30/08/2026
Deploy cloud                                   ⏳ ETAPA 14
```

A página 404 é um ajuste isolado pós-aprovação e **não alterou a etapa atual**.

Não considerar uma etapa concluída por inferência a partir de commits. O roadmap só deve ser atualizado após o checkpoint ser efetivamente validado.

---

# 2. Identidade do projeto

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição de robótica
RasComp  = plataforma de software
```

O RasComp não é apenas a Landing nem apenas o sistema de competição. Ele conecta:

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

Camunda não faz parte do RasComp.

---

# 3. Repositórios e aplicações

## Backend

```text
gbsalermo/Rascomp
└─ rascomp/
   └─ Spring Boot + MySQL + Flyway
```

Código principal:

```text
rascomp/src/main/java/br/edu/ufrb/rascomp/
```

## Frontend

```text
gbsalermo/Rascomp-FRONT
├─ gestao/        → aplicação autenticada + portal participante
├─ landing-page/  → site público RAS UFRB + RRC
└─ photo-gallery/ → protótipo público separado de galeria
```

A existência de **três aplicações frontend** é o estado atual. Documentos antigos que descrevem somente duas estão desatualizados.

---

# 4. Hierarquia de responsabilidade

Fluxo predominante:

```text
Frontend
   ↓ HTTP
Controller
   ↓ DTO
Service
   ↓ regra de negócio
Repository
   ↓
MySQL
```

## Regra central

O **backend é fonte de verdade** para:

- autorização real;
- ownership;
- elegibilidade;
- ranking;
- inspeção;
- BYE;
- vencedor;
- progressão;
- campeão;
- resultados competitivos.

O frontend pode antecipar uma regra por UX, mas nunca substituí-la.

Exemplo já consolidado:

```text
2 penalidades no Sumô
frontend → mostra derrota do round
backend  → força a regra e define o adversário como vencedor
```

---

# PARTE A — BACKEND

# 5. Estrutura principal

```text
config/      configuração Spring, segurança e R2
controller/  endpoints HTTP
dto/         contratos de entrada/saída
exception/   tradução global de erros HTTP
model/       entidades JPA e enums
repository/  acesso ao MySQL
security/    JWT/autenticação
service/     regras de negócio
storage/     abstração de object storage/R2
teste/       initializers opt-in para demonstração/testes
```

Banco:

```text
src/main/resources/db/migration/
V1 ... V7
```

Regra congelada:

```text
migration já aplicada → nunca reescrever
próxima mudança estrutural → V8+
```

---

# 6. Segurança atual e modelo futuro

## Estado implementado hoje

```text
UserRole
├─ PARTICIPANTE
└─ ORGANIZACAO
```

Política ampla atual:

```text
/api/v1/public/**       → público
/api/v1/participante/** → PARTICIPANTE
/api/v1/**              → ORGANIZACAO
```

Arquivos centrais:

```text
model/Enum/UserRole.java
model/UserAccount.java
config/SecurityConfig.java
security/JwtAuthenticationFilter.java
security/JwtService.java
service/UserAccountService.java
controller/UserAccountController.java
```

Conta desativada já invalida autenticação nas requisições seguintes porque `JwtService.tokenValido()` depende de `usuario.isEnabled()`.

## Modelo aprovado para a ETAPA 3

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

### DEV

- acesso integral;
- criação/alteração estrutural de competição;
- roles/permissões;
- manutenção excepcional;
- futuros Ajustes Gerais.

### GESTAO

- operação competitiva;
- Follow;
- Sumô;
- inspeções;
- tentativas/tomadas;
- rounds/batalhas;
- chaves/resultados permitidos;
- sem manutenção estrutural DEV.

### MIDIA

- conteúdo institucional;
- mídia;
- slots/tópicos da Landing;
- galeria;
- sem operação competitiva automática.

### PARTICIPANTE

- própria equipe;
- competidores autorizados;
- robôs/fotos;
- inscrições;
- acompanhamento.

O frontend também deve refletir permissões, mas esconder menu nunca será considerado segurança.

---

# 7. UserAccount, Competitor e responsável da Team são conceitos diferentes

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

Arquivos:

```text
model/UserAccount.java
model/Competitor.java
model/Team.java
service/AccessPolicyService.java
service/ParticipantPortalService.java
```

Consequência para futuros Ajustes Gerais:

```text
mover Competitor
≠ trocar responsável da Team
≠ mover Robot
≠ trocar role de UserAccount
```

Essas operações devem permanecer explícitas e separadas.

---

# 8. Competition e CompetitionCategory

## Competition

Arquivos principais:

```text
model/Competition.java
controller/CompetitionController.java
service/CompetitionService.java
repository/CompetitionRepository.java
dto/CompetitionDTO.java
```

Regras atuais relevantes:

- nome único;
- janela de inscrições consistente;
- fim das inscrições até o início da competição;
- exclusão lógica via `ativo=false`.

No futuro, criação/alteração estrutural será DEV-only.

## CompetitionCategory

```text
model/CompetitionCategory.java
controller/CompetitionCategoryController.java
service/CompetitionCategoryService.java
model/Enum/Modalidade.java
```

A categoria é catálogo global. A participação em uma edição acontece via `Registration`.

Modalidades atuais:

```text
SUMO
FOLLOW_LINE
```

Configurações:

```text
CompetitionCategory 1:1 ConfigSumo
CompetitionCategory 1:1 ConfigFollow
```

---

# 9. Registration — núcleo de inscrição competitiva

Arquivos:

```text
model/Registration.java
dto/RegistrationDTO.java
dto/ParticipantRegistrationRequest.java
controller/RegistrationController.java
service/RegistrationService.java
repository/RegistrationRepository.java
service/ParticipantPortalService.java
```

Modelo atual:

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

## Riscos atuais da ETAPA 1

### Reativação fora da janela

`RegistrationService.reativar()` reativa como `PENDENTE`, mas não revalida a janela de inscrições.

### Cancelamento

Ownership do participante existe, porém ainda precisa existir política explícita para cancelamento depois de:

- aprovação;
- geração de chave;
- início da competição;
- criação de histórico competitivo.

Essas regras não devem ser inventadas pelo frontend.

---

# 10. Follow Line

Arquivos principais:

```text
model/ConfigFollow.java
model/TentativaSeguidorLinha.java
controller/ConfigFollowController.java
controller/TentativaSeguidorLinhaController.java
controller/RankingFollowController.java
service/ConfigFollowService.java
service/TentativaSeguidorLinhaService.java
service/RankingFollowService.java
repository/TentativaSeguidorLinhaRepository.java
```

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

## Decisões ainda abertas

- efeito oficial de `checkpointsAlcancados`;
- combinações válidas de `concluida`, `valida` e `tempoSegundos=null`;
- demais critérios oficiais de invalidação/desclassificação.

`checkpointsAlcancados` é armazenado/exibido, mas atualmente **não altera ranking**.

---

# 11. Sumô, chaves e resultados

Arquivos principais:

```text
model/ConfigSumo.java
model/InspecaoSumo.java
model/RoundSumo.java
model/Match.java
model/MatchResult.java
service/InspecaoSumoService.java
service/BracketGenerationService.java
service/BracketProgressionService.java
service/RoundSumoService.java
service/MatchResultService.java
```

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

Categorias Mini/3 kg e RC/Autônomo usam o mesmo motor e ficam isoladas por:

```text
competitionId + categoryId
```

Regras consolidadas:

```text
0 penalidade → normal
1 penalidade → normal
2 penalidades → derrota automática do round
SUICIDIO_WO  → adversário vence o round
BYE          → avanço automático
```

Motivos estruturados atuais:

```text
DISPUTA
SUICIDIO_WO
PENALIDADES
```

## Histórico de chaves

```text
nova chave → atual=true
anterior   → atual=false
```

`ativo` e `atual` são conceitos diferentes. Chave histórica é read-only para resultados/rounds e não é publicada como chave vigente.

## Riscos da ETAPA 1

- geração/regeneração ainda precisa estados de `Competition` explicitamente permitidos;
- alterar `MatchResult` depois de progressão pode deixar a fase seguinte inconsistente.

A estratégia de correção de resultado deve ser bloqueio ou rollback/reprocessamento explícito; nunca alteração silenciosa.

---

# 12. Fotos de robôs e storage

Fluxo atual:

```text
RobotImageService
→ RobotImageStorageService
→ filesystem local ./uploads/robots
```

Suporta:

- JPEG/PNG/WEBP validados por assinatura;
- limite de 5 MB;
- múltiplas fotos;
- uma principal;
- ownership;
- leitura pública.

Em paralelo existe a abstração preparada para R2:

```text
storage/ObjectStorageService.java
storage/R2ObjectStorageService.java
config/R2StorageConfiguration.java
config/R2StorageProperties.java
```

Decisão para o futuro CMS:

```text
CMS/Mídia → ObjectStorageService/R2
```

RobotImage pode permanecer local inicialmente ou ser migrado depois de forma explícita. **Não criar terceiro mecanismo de upload.**

---

# PARTE B — FRONTEND AUTENTICADO (`gestao`)

# 13. Arquivos-base

```text
gestao/src/main.ts     → bootstrap/CSS
gestao/src/router.ts   → rotas/guards
gestao/src/store.ts    → sessão + competição em foco
gestao/src/api.ts      → cliente HTTP central atual
gestao/src/types.ts    → contratos TS centrais atuais
```

A ETAPA 2 prevê quebra gradual de `api.ts` e `types.ts` por domínio, sem refatoração big-bang.

---

# 14. Navegação e permissões

Hoje o frontend trabalha com a distinção legada:

```text
isOrganization
isParticipant
```

Na ETAPA 3 a direção é:

```text
isDev
isGestao
isMidia
isParticipant
```

Preferir capacidades semânticas quando a refatoração ocorrer:

```text
canManageCompetition
canOperateCompetition
canManageMedia
canUseDevTools
```

Isso evita espalhar condicionais de role pelo sistema inteiro.

---

# 15. Telas principais atuais

```text
DashboardView.vue       → visão geral
CompetitionsView.vue    → competição
RegistrationsView.vue   → revisão de inscrições
AdminCatalogView.vue    → equipes/robôs/modalidades
FollowView.vue          → ranking/histórico
FollowRunView.vue       → operação da tomada
SumoView.vue            → inspeção/chave
SumoMatchView.vue       → batalha
BracketHistoryView.vue  → histórico de chaves
MatchesView.vue         → partidas
ResultsView.vue         → resultados
UsersView.vue           → usuários
SettingsView.vue        → configurações
ParticipantView.vue     → portal participante
NotFoundView.vue        → 404 da gestão
```

Views grandes devem ser decompostas gradualmente durante a ETAPA 2/ao tocar no domínio.

---

# 16. Dívida de CSS

A gestão acumulou folhas corretivas em sequência histórica. Isso já causou regressão visual.

Direção da ETAPA 2:

```text
styles/
├─ tokens.css
├─ shell.css
├─ auth.css
├─ competition.css
├─ sumo.css
├─ follow.css
├─ participant.css
└─ utilities.css
```

Ao consolidar, remover regras substituídas; não adicionar uma nova camada apenas para corrigir a anterior.

---

# PARTE C — LANDING PÚBLICA

# 17. Estado atual

A Landing já existe em:

```text
landing-page/
```

Componentes principais:

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

`App.vue` consome a API pública competitiva e atualiza dados da competição ativa.

A página 404 pública foi implementada em 30/08/2026.

Conteúdo institucional ainda possui hardcodes/placeholders. Isso é alvo da ETAPA 7, não motivo para editar Vue manualmente indefinidamente.

---

# 18. CMS / Mídia

Objetivo futuro:

```text
MIDIA/DEV
→ gestao
→ API CMS
→ conteúdo publicado
→ Landing
```

Modelo de referência:

```text
MediaAsset
ContentSlot
ContentItem
```

`ContentSlot` representa uma janela lógica estável, não coordenada CSS.

Exemplos:

```text
HERO_MAIN
HERO_NEWS
ABOUT
TEAM
AWARDS
GALLERY
EVENTS
COMPETITION_HIGHLIGHT
```

A Landing deve deixar de exigir commit para atualização editorial comum.

---

# 19. `photo-gallery/`

Estado atual:

```text
photo-gallery/src/data/albums.ts
→ álbuns/placeholders estáticos
```

Na ETAPA 11 decidir definitivamente:

```text
A. manter aplicação separada alimentada pela API
B. absorver galeria na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de deploy/URL independente.

---

# PARTE D — EVOLUÇÕES JÁ APROVADAS

# 20. Avisos

ETAPA 4:

```text
Aviso persistido IN_APP = fonte de verdade
Telegram = canal complementar opcional futuro
```

Não depender exclusivamente de Telegram para comunicação operacional.

---

# 21. Ajustes Gerais DEV

ETAPA 5.

Rota futura prevista:

```text
/ajustes-gerais
```

Operações devem ser específicas:

```text
alterarRole
transferirCompetidor
transferirRobo
transferirResponsabilidade
corrigirInscricao
ativar/desativar
```

Nunca transformar em editor bruto de tabelas/SQL.

Ações críticas exigem auditoria:

```text
quem
quando
ação
entidade
antes/depois
motivo quando aplicável
```

---

# 22. Portabilidade institucional

ETAPA 6.

Estratégia aprovada:

```text
1 instalação = 1 instituição organizadora
```

Não é multi-tenant.

Não reutilizar `Institution` das equipes participantes para representar a organização hospedeira. Criar conceito próprio, por exemplo `PlatformInstanceConfig`.

---

# 23. Regras públicas

ETAPA 8.

Grupos iniciais:

```text
Follow Line
Sumô geral/RC/penalidades/WO
Futebol de Robôs
Ambiente/Vestimenta
```

Os textos atuais em documentação são requisitos preliminares, **não transcrição de regulamento oficial**. Redação e sanções precisam ser validadas antes da publicação.

---

# 24. Futebol de Robôs

ETAPA 9.

Requisito:

```text
competidor A × competidor B
robôs fornecidos pela organização
participante não precisa de robô próprio
```

Incompatibilidade atual:

```text
Registration.robot                    obrigatório
ParticipantRegistrationRequest.robotId obrigatório
unicidade                              baseada em robot
```

Logo, exige alteração real de domínio/migration.

**Não criar robô fake para satisfazer FK.**

Ainda decidir:

- Team obrigatória ou não;
- atribuição dos robôs;
- tempo/placar;
- empate/desempate;
- formato competitivo;
- inspeção/penalidades.

---

# 25. Portal do Participante completo + identificação competitiva

ETAPA 10.

Além de completar convites, integrantes, robôs, inscrições, avisos e acompanhamento, existe decisão aprovada de criar um identificador competitivo curto para cada **Registration aprovada**.

Esse código pertence à `Registration`, não ao `Robot`, porque:

- o mesmo robô pode aparecer em categorias/edições diferentes;
- modalidades futuras podem não usar robô próprio.

QR Code pode ser representação futura, mas não é obrigatório na primeira versão.

---

# 26. Deploy

Deploy é ETAPA 14.

Decisão congelada:

```text
modo local continua funcionando
+
modo cloud é adicionado
```

Arquitetura planejada:

```text
Cloudflare DNS/TLS
Workers Static Assets → frontend
Containers + Docker → Spring Boot
R2 → mídia/uploads
MySQL gerenciado externo → banco inicial
GitHub Actions/Cloudflare → CI/CD
```

D1 não é requisito do primeiro deploy.

Consultar:

```text
docs/DECISAO_DEPLOY_CLOUD.md
docs/DEPLOY_CLOUDFLARE.md
```

---

# PARTE E — RISCOS E PENDÊNCIAS

# 27. P0/P1/P2 conhecidos

## ETAPA 1 — lógica/integridade

1. `RegistrationService.reativar()` não revalida inscrições abertas.
2. Cancelamento precisa política por estado competitivo.
3. Geração/regeneração de chave precisa estados de Competition permitidos.
4. MatchResult após progressão precisa bloqueio ou rollback/reprocessamento.
5. Combinações válidas de tentativa Follow precisam formalização.

## ETAPA 2 — manutenção

1. `rascomp/bin/` ainda está rastreado no backend.
2. `.classpath/.project/.gitkeep` legados devem ser avaliados.
3. `api.ts` e `types.ts` estão centralizados demais para os módulos futuros.
4. views grandes precisam decomposição gradual.
5. CSS corretivo sobreposto precisa consolidação.
6. `AccessPolicyService` não deve virar depósito de toda autorização futura apenas por ter nome genérico.
7. storage local de RobotImage e R2 são estratégias paralelas e precisam continuar conscientemente separadas até decisão de migração.

---

# 28. Decisões abertas

Não inventar resposta sem validação da regra.

## Follow

- impacto oficial de checkpoints;
- estados válidos de tentativa;
- desclassificações oficiais adicionais.

## Sumô

- redação oficial das infrações/regras públicas;
- regras específicas de RC a publicar;
- necessidade de motivos estruturados adicionais.

## Inscrição

- cancelamento após aprovação/chave/início;
- reativação administrativa em cenários excepcionais futuros.

## Futebol

- equipe;
- robôs A/B;
- placar/tempo/desempate;
- formato;
- inspeção.

## Mídia

- publicação direta por MIDIA ou aprovação DEV;
- arquivamento vs exclusão física;
- slots da primeira versão.

## Regras

- DEV, MIDIA ou ambos;
- global ou por edição.

## Galeria

- manter separada ou absorver na Landing.

---

# PARTE F — QUERO ALTERAR X: ONDE MEXO?

# 29. Cookbook

## Login/JWT/roles

```text
Backend:
UserRole.java
UserAccount.java
SecurityConfig.java
JwtService.java
UserAccountService.java

Frontend:
types.ts
store.ts
router.ts
ShellLayout.vue
```

## Competition

```text
Backend:
Competition.java / CompetitionDTO.java
CompetitionController.java
CompetitionService.java
CompetitionRepository.java

Frontend:
CompetitionsView.vue
api.ts
types.ts
competition-hub.css
```

## Registration

```text
Backend:
Registration.java
RegistrationDTO.java
ParticipantRegistrationRequest.java
RegistrationController.java
RegistrationService.java
ParticipantPortalService.java

Frontend:
RegistrationsView.vue
ParticipantView.vue
api.ts
types.ts
```

## Team / Competitor / Robot

```text
Backend:
Team*
Competitor*
Robot*
AccessPolicyService.java
ParticipantPortalService.java

Frontend:
AdminCatalogView.vue
ParticipantView.vue
RobotPhoto.vue
```

## Foto de Robot

```text
Backend:
RobotImage.java
RobotImageService.java
RobotImageStorageService.java
RobotImageController.java

Frontend:
RobotPhoto.vue
ParticipantView.vue
FollowRunView.vue
SumoMatchView.vue
```

## Follow

```text
Backend:
ConfigFollow*
TentativaSeguidorLinha*
RankingFollowService.java

Frontend:
FollowView.vue
FollowRunView.vue
FollowTakeHistory.vue
```

## Sumô / penalidades / WO

```text
Backend:
ConfigSumo*
RoundSumo*
InspecaoSumo*
RoundSumoService.java
MatchResultService.java

Frontend:
SumoView.vue
SumoMatchView.vue
TournamentBracket.vue
```

## Chave / BYE / progressão

```text
Backend:
BracketGenerationService.java
BracketProgressionService.java
BracketService.java
MatchService.java
MatchResultService.java

Frontend:
TournamentBracket.vue
BracketHistoryView.vue
MatchesView.vue
ResultsView.vue
```

## Landing competitiva pública

```text
Backend:
PublicController.java
PublicQueryService.java
DTOs Public*

Frontend:
landing-page/src/App.vue
landing-page/src/api.ts
ActiveCompetition.vue
```

## Conteúdo institucional da Landing

Hoje:

```text
HighlightsHero.vue
InstitutionalAbout.vue
InstitutionalEvents.vue
InstitutionalGallery.vue
TeamRobotsAwards.vue
```

Futuro:

```text
MIDIA/DEV
→ API CMS
→ MediaAsset/ContentSlot/ContentItem
→ API pública
→ Landing
```

## Galeria

Hoje:

```text
photo-gallery/src/data/albums.ts
```

Depois do CMS não deve continuar como fonte manual dos álbuns.

## 404

```text
gestao/src/views/NotFoundView.vue
landing-page/src/components/PublicNotFound.vue
landing-page/src/not-found.css
assets públicos relacionados
```

---

# 30. Regras de manutenção para qualquer IA

Antes de uma regra competitiva:

```text
1. localizar entidade/DTO
2. localizar Service fonte de verdade
3. entender estado competitivo envolvido
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

Antes de começar uma etapa:

```text
1. ler docs/README.md
2. ler docs/ETAPAS_POS_PROJETO.md
3. permanecer na etapa marcada como atual
4. não criar novo roadmap
5. não avançar sem validação
```

O RasComp já tem uma base aprovada. A prioridade do ciclo atual é evoluir sem perder integridade, rastreabilidade e previsibilidade.