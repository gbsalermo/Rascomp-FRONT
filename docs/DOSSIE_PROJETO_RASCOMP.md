# Dossiê Mestre — Projeto RASCOMP

Última revisão estrutural: **26/08/2026**

Este documento é o mapa canônico do projeto. Ele serve para responder quatro perguntas:

1. **onde está cada coisa?**
2. **quem é responsável por cada regra?**
3. **qual arquivo deve ser alterado quando uma regra/tela muda?**
4. **quais riscos, bugs, dívidas e decisões ainda precisam ser resolvidos?**

---

## 1. Identidade do projeto

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

O RasComp possui hoje dois repositórios principais:

```text
gbsalermo/Rascomp
└─ backend Java / Spring Boot / MySQL

gbsalermo/Rascomp-FRONT
├─ gestao/        → aplicação autenticada
├─ landing-page/  → site institucional público RAS UFRB + RRC
└─ photo-gallery/ → protótipo separado da galeria pública
```

> Atenção: o frontend já possui **três aplicações**, não duas. Documentos antigos que dizem que a Landing ainda não existe estão desatualizados.

---

# PARTE A — BACKEND

## 2. Estrutura principal

Código principal:

```text
Rascomp/rascomp/src/main/java/br/edu/ufrb/rascomp/
```

Pacotes:

```text
config/      configuração Spring, segurança auxiliar e R2
controller/  endpoints HTTP
 dto/        contratos de entrada/saída
exception/   tradução global de exceções HTTP
model/       entidades JPA e enums
repository/  acesso ao MySQL
security/    JWT e autenticação
service/     regras de negócio
storage/     abstração de object storage/R2
teste/       initializers opt-in de cenários de teste/demo
```

Banco:

```text
src/main/resources/db/migration/
V1 ... V7
```

Toda mudança de schema futura deve entrar em **V8+**. Migration aplicada nunca deve ser reescrita.

---

## 3. Fluxo de uma chamada

Padrão predominante:

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

Regra de projeto: **resultado oficial nunca deve ser decidido somente pelo frontend**.

O frontend pode antecipar visualmente uma regra para UX, mas o backend precisa revalidá-la. Exemplo já correto:

```text
2 penalidades no Sumô
frontend → mostra derrota imediatamente
backend  → força o adversário como vencedor
```

---

## 4. Segurança atual e refatoração aprovada

### Estado atual

Hoje existem somente:

```java
PARTICIPANTE
ORGANIZACAO
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

A segurança atual é ampla:

```text
/api/v1/public/**       → público
/api/v1/participante/** → PARTICIPANTE
/api/v1/**              → ORGANIZACAO
```

A conta desativada já é invalidada corretamente: `JwtService.tokenValido()` consulta `usuario.isEnabled()`.

### Nova matriz aprovada para o roadmap

```text
DEV
├─ acesso total
├─ criar/editar/desativar competição
├─ alterar permissões
├─ edição estrutural de inscrições
├─ mover competidor entre equipes
├─ mover robô entre equipes
├─ operações de manutenção
└─ Ajustes Gerais

GESTAO
├─ operação do evento
├─ análise operacional permitida
├─ Sumô: inspeção / round / batalha
├─ Follow: tomadas / tentativas
├─ consultar chaves/resultados
└─ NÃO cria competição nem executa manutenção destrutiva

MIDIA
├─ gestor editorial
├─ tópicos/blocos da landing
├─ upload de mídia
├─ associação mídia ↔ janela/slot
└─ conteúdo institucional

PARTICIPANTE
├─ própria equipe
├─ competidores da equipe
├─ robôs
├─ fotos
├─ inscrições
└─ acompanhamento competitivo
```

### Como implementar depois

Não basta esconder botões no Vue. A autorização precisa existir no backend.

Arquivos mínimos afetados:

```text
UserRole.java
SecurityConfig.java
UserAccountController.java
UserAccountService.java
controllers administrativos
router.ts
store.ts
types.ts
ShellLayout.vue
```

Recomendação: usar **roles para áreas grandes + regras explícitas por endpoint/método**. Não transformar DEV em um conjunto de `if` espalhados pelos services.

---

## 5. Usuário, competidor e líder de equipe não são a mesma entidade

Este ponto é crítico para os futuros **Ajustes Gerais**.

```text
UserAccount
→ login / senha / role / ativo

Competitor
→ pessoa que compete
→ possui Team obrigatória
→ pode opcionalmente apontar para um UserAccount

Team.responsibleUser
→ usuário participante responsável/líder pela equipe
```

Arquivos:

```text
model/UserAccount.java
model/Competitor.java
model/Team.java
service/AccessPolicyService.java
service/ParticipantPortalService.java
```

Portanto, “mudar participante de equipe” pode significar coisas diferentes:

1. mover um `Competitor.team`;
2. trocar `Team.responsibleUser`;
3. mover uma pessoa que é simultaneamente usuário e competidor;
4. transferir responsabilidade de uma equipe inteira.

O DEV UI deve apresentar essas ações separadamente para não corromper ownership.

---

## 6. Competição e categorias

### Competition

Responsáveis:

```text
model/Competition.java
controller/CompetitionController.java
service/CompetitionService.java
repository/CompetitionRepository.java
dto/CompetitionDTO.java
```

Regras atuais principais:

- nome único;
- período de inscrição consistente;
- inscrições terminam até o início da competição;
- exclusão lógica via `ativo=false`.

**Futuro:** criar/alterar competição será DEV-only.

### CompetitionCategory

Arquivos:

```text
model/CompetitionCategory.java
controller/CompetitionCategoryController.java
service/CompetitionCategoryService.java
model/Enum/Modalidade.java
```

A categoria é um **catálogo global**, não pertence diretamente a uma edição. A participação em uma edição acontece por `Registration`.

Hoje:

```text
Modalidade
├─ SUMO
└─ FOLLOW_LINE
```

Configuração específica:

```text
CompetitionCategory 1:1 ConfigSumo
CompetitionCategory 1:1 ConfigFollow
```

---

## 7. Inscrições

Arquivos centrais:

```text
model/Registration.java
dto/RegistrationDTO.java
dto/ParticipantRegistrationRequest.java
controller/RegistrationController.java
service/RegistrationService.java
repository/RegistrationRepository.java
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

### Risco confirmado

`RegistrationService.reativar()` reativa uma inscrição como `PENDENTE`, porém hoje não chama `validarInscricoesAbertas()`.

Consequência possível:

```text
competição encerrada
→ DEV/organização reativa inscrição antiga
→ inscrição volta para PENDENTE fora do período
```

**Classificação:** P1 — corrigir antes de ampliar a administração de inscrições.

### Outro ponto a definir

O participante atualmente consegue cancelar uma inscrição da própria equipe pelo portal. É necessário fechar a regra de negócio:

```text
Pode cancelar depois de APROVADA?
Pode cancelar depois de gerar chave?
Pode cancelar com a competição EM_ANDAMENTO?
```

Hoje ownership é verificado, mas o estado competitivo não bloqueia todos esses cenários.

---

## 8. Nova modalidade: Futebol de Robôs

Requisito aprovado para roadmap:

```text
FUTEBOL
2 competidores
2 robôs disponibilizados pela RAS
participante NÃO precisa cadastrar robô próprio
Team continua desejável/obrigatória no desenho atual
```

Exibição pretendida:

```text
Gabriel       ×       João
Robô A                Robô B
```

### Por que não cabe no schema atual

Hoje:

```text
Registration.robot           → nullable=false
ParticipantRegistrationRequest.robotId → @NotNull
RegistrationService          → sempre busca/valida Robot
unicidade                     → baseada em robotId
```

Portanto futebol exige alteração real de domínio/migration; não deve ser implementado colocando um “robô fake” para cada participante.

### Caminho recomendado

```text
Modalidade += FUTEBOL
Registration.robot → opcional somente para modalidade que permite
regra de duplicidade → estratégia por modalidade
ConfigFutebol → criar somente se houver parâmetros realmente configuráveis
Match/MatchResult → reaproveitar motor genérico onde possível
```

O `MatchResultService` já é um bom candidato para futebol porque resultados manuais são proibidos especificamente para FOLLOW_LINE e SUMO; porém a edição de um resultado que já avançou uma chave precisará ser endurecida antes de DEV poder alterá-lo.

---

## 9. Follow Line

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

Domínio atual:

```text
Registration
└─ Tomada 1..N
   └─ Tentativa 1..N
```

Ranking:

```text
tentativas válidas + concluídas + com tempo
→ melhor tentativa da tomada
→ melhor tomada do robô
→ ranking por tempo final
```

Tempo final:

```text
tempoSegundos + penalidadeSegundos
```

### Parte ainda não fechada

`checkpointsAlcancados` é validado, armazenado e exibido, mas **não afeta ranking**. Só alterar após confirmação oficial do regulamento.

### Risco de consistência a revisar

O DTO permite `tempoSegundos=null`, inclusive com combinações de `concluida/valida`. O ranking se protege ignorando tentativa sem tempo, mas falta definir formalmente quais combinações são válidas, por exemplo:

```text
concluida=true + tempo=null      ?
valida=true + concluida=false    ?
valida=true + tempo=null         ?
```

**Classificação:** P2 de código, P1 de decisão de regra antes do evento oficial.

---

## 10. Sumô

Arquivos:

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
→ MatchResult automático
→ BracketProgressionService
```

### Categorias

RC/Autônomo e Mini/3 kg continuam como **categorias**, não motores diferentes.

O isolamento competitivo ocorre por:

```text
competitionId + categoryId
```

### Penalidades

Regra consolidada:

```text
0 → normal
1 → normal
2 → derrota automática do round
```

Motivos suportados:

```text
DISPUTA
SUICIDIO_WO
PENALIDADES
```

### Chaves

`BracketGenerationService`:

- aprovadas + ativas + aptas;
- embaralha participantes;
- próxima potência de 2;
- cria árvore inteira;
- avança BYEs;
- chave anterior vira histórica.

### Risco a definir

A geração hoje valida ativo/categoria, mas não restringe explicitamente status da competição. Tecnicamente é possível tentar gerar chave numa edição em estado indevido se o endpoint estiver autorizado.

Com a futura divisão DEV/GESTAO, definir estados permitidos para:

```text
gerar chave
regenerar chave
registrar round
editar agendamento
```

---

## 11. Histórico de chaves

Arquivos:

```text
model/Bracket.java
service/BracketService.java
service/BracketGenerationService.java
V6__support_bracket_history.sql
```

Regra:

```text
nova chave  → atual=true
anterior    → atual=false
```

`ativo` é diferente de `atual`:

```text
atual  = versão vigente
ativo  = não arquivada/cancelada administrativamente
```

Histórica é read-only para rounds/resultados e não é publicada como chave atual pela API pública.

---

## 12. Fotos de robôs e storage

### Fluxo atual de robôs

```text
RobotImageService
→ RobotImageStorageService
→ filesystem local ./uploads/robots
```

Arquivos:

```text
model/RobotImage.java
service/RobotImageService.java
service/RobotImageStorageService.java
controller/RobotImageController.java
```

Valida:

- JPEG/PNG/WEBP pela assinatura;
- 5 MB;
- múltiplas fotos;
- uma principal;
- ownership do participante;
- leitura pública.

### R2 já existe, mas está paralelo

Também existem:

```text
storage/ObjectStorageService.java
storage/R2ObjectStorageService.java
config/R2StorageConfiguration.java
config/R2StorageProperties.java
```

Hoje o fluxo de foto do robô **não usa** essa abstração. O R2 está reservado/configurável para mídia/galeria futura.

Isso deve ser resolvido conscientemente no módulo de MÍDIA:

```text
Opção recomendada:
CMS/Mídia → ObjectStorageService/R2
RobotImage → manter local inicialmente OU migrar depois de forma explícita
```

Não criar um terceiro mecanismo de upload.

---

# PARTE B — FRONTEND AUTENTICADO (`gestao`)

## 13. Arquivos-base

```text
gestao/src/main.ts     imports globais/CSS e bootstrap Vue
gestao/src/router.ts   rotas e guardas de role
gestao/src/store.ts    sessão + competição em foco
gestao/src/api.ts      cliente HTTP inteiro
gestao/src/types.ts    contratos TS inteiros
```

### Risco de crescimento

`api.ts` e `types.ts` centralizam todos os domínios. Com FUTEBOL + MÍDIA + DEV eles ficarão difíceis de manter.

Refatoração recomendada antes/depois das novas features:

```text
api/
├─ auth.ts
├─ admin.ts
├─ participant.ts
├─ competition.ts
├─ sumo.ts
├─ follow.ts
├─ media.ts
└─ dev.ts

types/
├─ auth.ts
├─ competition.ts
├─ registration.ts
├─ sumo.ts
├─ follow.ts
├─ media.ts
└─ common.ts
```

Não precisa ser feita toda de uma vez; faça ao tocar em cada domínio.

---

## 14. Shell, navegação e permissões

Arquivos:

```text
views/ShellLayout.vue
router.ts
store.ts
```

Hoje o frontend entende apenas:

```text
isOrganization
isParticipant
```

Nova evolução:

```text
isDev
isGestao
isMidia
isParticipant
```

Melhor ainda: além dos helpers, definir capacidades de UI, por exemplo:

```text
canManageCompetition
canOperateCompetition
canManageMedia
canUseDevTools
```

Isso evita espalhar `role === 'DEV'` em dezenas de componentes.

---

## 15. Mapa das telas atuais

```text
DashboardView.vue       visão geral da edição
CompetitionsView.vue    central/crud da competição
RegistrationsView.vue   revisão de inscrições
AdminCatalogView.vue    equipes/robôs/modalidades
FollowView.vue          ranking + histórico de tomadas
FollowRunView.vue       operação de uma tomada
SumoView.vue            inspeção + chave visual
SumoMatchView.vue       operação de uma batalha
BracketHistoryView.vue  versões históricas de chaves
MatchesView.vue         lista operacional de partidas
ResultsView.vue         resultados consolidados
UsersView.vue           usuários ativo/inativo
SettingsView.vue        configurações atuais
ParticipantView.vue     portal do participante
```

### Arquivos grandes a decompor gradualmente

- `ParticipantView.vue` ~27 KB;
- `SumoMatchView.vue` ~23 KB;
- `FollowView.vue` ~18 KB;
- `FollowRunView.vue` ~18 KB;
- `CompetitionsView.vue` ~14 KB.

Não é bug, mas já passou do ponto em que adicionar features sem extração aumenta risco de regressão.

---

## 16. Dívida de CSS

O `main.ts` importa uma sequência histórica de folhas:

```text
main.css
management-ui.css
login-ui.css
auth-onboarding.css
participant-onboarding.css
registrations-ui.css
login-viewport-fix.css
admin-consolidation.css
admin-refinement.css
competition-hub.css
bracket-history.css
```

Esse modelo de “CSS que corrige CSS anterior” já provocou regressão real na topbar.

Recomendação P1 de manutenção:

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

Ao consolidar, remover regras substituídas em vez de manter cascatas corretivas.

---

# PARTE C — LANDING PÚBLICA

## 17. Estado real da Landing

A landing **já existe** em:

```text
landing-page/
```

Componentes:

```text
InstitutionalHeader.vue
HighlightsHero.vue
InstitutionalAbout.vue
TeamRobotsAwards.vue
InstitutionalGallery.vue
InstitutionalEvents.vue
ActiveCompetition.vue
InstitutionalFooter.vue
```

`App.vue` consome dados competitivos públicos e atualiza periodicamente a competição em andamento.

### Conteúdo ainda hardcoded

`HighlightsHero.vue` contém no código:

- slides institucionais;
- RAS nas Escolas;
- oficinas;
- premiações;
- novidades;
- textos;
- labels de mídia/placeholders.

Esse é o principal alvo do novo gestor **MIDIA**.

---

## 18. Novo módulo de MÍDIA / CMS

Objetivo aprovado:

```text
usuário MIDIA
→ entra no gestao
→ gerencia conteúdo da landing
```

Conceitos recomendados:

```text
MediaAsset
├─ arquivo
├─ tipo
├─ título/alt
├─ storageKey/url
└─ metadados

ContentSlot
├─ chave estável: HERO_MAIN, HERO_PREVIEW, NEWS, GALLERY...
├─ ordem
└─ regras do slot

ContentItem
├─ tópico
├─ título
├─ descrição
├─ CTA
├─ mídia associada
├─ publicação
├─ início/fim opcional
└─ ordem
```

A Landing deve ler conteúdo publicado por API pública. O MIDIA nunca deve editar arquivo `.vue` para trocar foto/texto.

### “janelas”

No dossiê, “janela” significa um slot visual estável da Landing. Exemplo:

```text
Hero principal
Cards de preview
Últimas novidades
Galeria institucional
Eventos
Destaques/premiações
```

Isso evita acoplar o banco ao layout por coordenadas CSS.

---

## 19. `photo-gallery/`

Atualmente é uma terceira aplicação separada e seus álbuns estão hardcoded em:

```text
photo-gallery/src/data/albums.ts
```

São placeholders estáticos.

Decisão a tomar durante o CMS:

```text
A) manter photo-gallery como aplicação pública própria, mas alimentada pela API de mídia;
ou
B) absorver a galeria dentro de landing-page e remover a aplicação separada.
```

Não continuar cadastrando álbuns diretamente em TypeScript.

---

# PARTE D — REGRAS

## 20. Nova área “Regras”

Requisito aprovado para roadmap: cards expansíveis com regras oficiais.

Grupos iniciais:

```text
Follow Line
├─ vitória/classificação
├─ validade/desclassificação
├─ tomadas/tentativas
└─ demais regras oficiais

Sumô
├─ gerais
├─ RC
├─ Autônomo, se houver texto específico
└─ penalidades / WO / desclassificações

Futebol de Robôs
└─ regras da modalidade

Ambiente / Vestimenta
├─ não consumir alimento na área de competição
├─ não portar/consumir líquidos na área
├─ restrição de sandálias
├─ restrição de shorts
└─ demais regras de segurança equivalentes ao ambiente de laboratório
```

> Os textos acima são requisitos recebidos, não uma transcrição de regulamento oficial. Antes da publicação, confirmar redação e sanções com a organização.

### Arquitetura recomendada

Não hardcodar essas regras em Vue se MIDIA/DEV precisar mantê-las.

Criar posteriormente conteúdo versionável/editável, com:

```text
escopo = CATEGORIA | AMBIENTE
categoria opcional
seção
título
conteúdo
ordem
ativo/publicado
```

Definir depois se edição será DEV-only ou DEV + MIDIA.

---

# PARTE E — AJUSTES GERAIS DEV

## 21. Objetivo

Rota futura visível somente a DEV:

```text
/ajustes-gerais
```

Ela substitui alterações manuais no banco para tarefas legítimas de manutenção.

Ações previstas:

- trocar role/permissão;
- ativar/desativar entidades;
- mover competidor entre equipes;
- trocar responsável da equipe;
- mover robô entre equipes;
- corrigir inscrição;
- operações administrativas excepcionais.

### Regra importante

“Ajustes Gerais” não deve virar um editor genérico de tabelas.

Cada ação crítica deve ser uma operação de domínio explícita, por exemplo:

```text
transferirCompetidor(competitorId, destinationTeamId)
transferirRobo(robotId, destinationTeamId)
alterarRole(userId, role)
transferirResponsabilidade(teamId, userId)
```

Assim cada operação pode validar dependências, registrar auditoria e impedir inconsistências.

### Auditoria

Antes de liberar DEV destrutivo, adicionar trilha de auditoria para operações sensíveis:

```text
quem
quando
ação
entidade
id
antes/depois ou resumo
```

---

# PARTE F — ACHADOS DA REVISÃO

## 22. P0 — limpar antes de produção

### 22.1 `rascomp/bin/` versionado no backend

O repositório contém um diretório `rascomp/bin/` com cópias de arquivos Maven, código/artefatos compilados `.class` e estrutura antiga.

Isso é build/IDE output e não deveria ser fonte oficial.

Ação:

```bash
git rm -r rascomp/bin
```

Adicionar `bin/` ao `.gitignore`.

Não removi automaticamente nesta revisão porque é uma exclusão ampla de arquivos; fazer em um commit de limpeza isolado e validar CI.

### 22.2 documentação divergente

Encontrados exemplos:

- README frontend dizia que existiam apenas duas aplicações; há três;
- documentação dizia Landing futura/pausada, mas ela já está implementada;
- backend README ainda tinha contagem antiga de testes e texto antigo de penalidade em versões anteriores;
- comentários `TODO` em ConfigFollow/ConfigSumo descrevem módulos já implementados.

A documentação deve passar a apontar este dossiê como referência arquitetural.

---

## 23. P1 — bugs/riscos funcionais

1. **Reativação de inscrição fora da janela** — `RegistrationService.reativar()` não revalida período de inscrições.
2. **Cancelamento do participante sem política competitiva explícita** — definir bloqueio após aprovação/chave/início.
3. **Geração de chave sem estado de competição explicitamente restringido** — definir estados válidos.
4. **Edição de MatchResult após progressão** — perigosa para futura modalidade Futebol/DEV; alterar vencedor depois de alimentar a fase seguinte exige rollback/reprocessamento de progressão ou proibição.
5. **Permissão atual é tudo-ou-nada** — ORGANIZACAO tem acesso global; precisa ser corrigido antes de criar contas GESTAO/MIDIA reais.
6. **CSS sobreposto** — já causou regressão de topbar; consolidar.

---

## 24. P2 — manutenção/clareza

1. `api.ts` e `types.ts` crescerão demais com novos módulos.
2. grandes views Vue precisam ser quebradas em componentes/composables.
3. `AccessPolicyService` tem nome genérico, mas hoje cuida basicamente de ownership do participante; não misturar futura política DEV/GESTAO nele sem reorganização.
4. R2 e storage local de fotos coexistem em arquiteturas paralelas; definir estratégia única para mídia.
5. `photo-gallery` é protótipo estático e pode duplicar responsabilidade da Landing.
6. vários `.gitkeep` permanecem em diretórios já preenchidos; limpeza opcional.
7. arquivos `.classpath/.project` no repositório devem ser avaliados; o `.gitignore` já os ignora, então provavelmente são legado já rastreado.

---

# PARTE G — REGRAS AINDA NÃO CLARAS

## 25. Decisões que precisam de confirmação antes de codificar

### Follow

- efeito oficial de checkpoints;
- combinações permitidas de `concluida`, `valida` e tempo nulo;
- critérios oficiais de desclassificação além de tempo/validade.

### Sumô

- redação oficial das infrações;
- subregras específicas de RC a publicar em “Regras”;
- se todas as sanções precisam de motivo estruturado além de observação.

### Futebol

- equipe é obrigatória ou apenas recomendada? O requisito atual diz que o ideal é ter equipe e pode competir sem robô;
- a RAS atribui Robô A/B antes da partida ou no momento da arena?
- quantidade de rounds/tempo/gols/empate/desempate;
- formato: chave eliminatória, grupos ou partida isolada;
- inspeção existe?

### Mídia

- MIDIA pode publicar diretamente ou precisa de aprovação DEV?
- exclusão física ou somente arquivamento de mídia?
- quais slots da Landing serão editáveis na primeira versão?
- galeria externa continuará aplicação separada?

### Regras

- quem edita: DEV, MIDIA ou ambos?
- regras são globais ou podem variar por edição do RRC?
- redação oficial das regras de vestimenta/ambiente.

---

# PARTE H — “QUERO ALTERAR X: ONDE MEXO?”

## 26. Cookbook de manutenção

### Login/JWT/roles

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

### Criar/editar competição

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

### Inscrição

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

### Equipe/competidor/robô

```text
Backend:
Team*, Competitor*, Robot*
AccessPolicyService.java
ParticipantPortalService.java

Frontend:
AdminCatalogView.vue
ParticipantView.vue
RobotPhoto.vue
```

### Foto do robô

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

### Follow

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

### Sumô / penalidades / WO

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

### Chave / BYE / progressão

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

### Landing competitiva pública

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

### Conteúdo institucional da Landing

Hoje:

```text
HighlightsHero.vue
InstitutionalAbout.vue
InstitutionalEvents.vue
InstitutionalGallery.vue
TeamRobotsAwards.vue
```

Depois do CMS:

```text
MIDIA frontend
→ API CMS
→ ContentItem/ContentSlot/MediaAsset
→ landing API pública
```

### Galeria pública

Hoje:

```text
photo-gallery/src/data/albums.ts
```

Deve deixar de ser fonte manual quando o CMS for criado.

---

# PARTE I — ROADMAP PÓS-APROVAÇÃO

## 27. Ordem recomendada

### Fase 0 — estabilização e dívida técnica

1. corrigir bugs P1 encontrados nesta revisão;
2. remover `rascomp/bin/` e metadados IDE rastreados desnecessários;
3. consolidar comentários/documentação obsoletos;
4. consolidar CSS mais crítico;
5. manter CI verde.

### Fase 1 — novo modelo de permissões

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Esta fase vem antes de liberar qualquer novo painel, pois define o limite de acesso das demais.

### Fase 2 — Ajustes Gerais DEV

Criar operações explícitas de manutenção + auditoria.

### Fase 3 — Gestor de Mídia

- MediaAsset;
- ContentSlot;
- ContentItem;
- upload R2;
- publicação;
- painel MIDIA dentro de `gestao`;
- Landing consumindo API em vez de conteúdo hardcoded.

### Fase 4 — Regras

Criar modelo/API/tela pública/autenticada para regras oficiais e ambientais.

### Fase 5 — Futebol de Robôs

- migration para Registration sem robô quando permitido;
- modalidade FUTEBOL;
- regra específica de elegibilidade/duplicidade;
- interface de inscrição;
- operação da partida;
- exibição pública.

### Fase 6 — completar participante

- convites/entrada em equipe;
- CRUD refinado;
- inscrições completas;
- futebol sem robô próprio;
- UX final.

### Fase 7 — consolidação pública

- integrar galeria/mídia;
- remover placeholders;
- tipar contratos da Landing;
- revisar performance/acessibilidade/responsividade.

---

## 28. Regra de ouro para manutenção futura

Antes de mudar uma regra competitiva:

```text
1. localizar a entidade/DTO
2. localizar o Service que é fonte de verdade
3. criar/alterar teste do Service
4. alterar endpoint se necessário
5. alterar frontend para refletir a regra
6. atualizar este dossiê se a arquitetura mudou
```

Antes de uma alteração estrutural de banco:

```text
1. modelar impacto
2. nova migration V8+
3. nunca alterar migration já aplicada
4. atualizar testes
5. validar profile testdata contra MySQL
```

---

## 29. Referência rápida de qualidade atual

```text
Backend Tests    → 48 testes verdes no último checkpoint validado
Demo profile     → MySQL + Flyway + testdata validado em CI
Frontend Checks → typecheck + build em CI
Landing Checks  → workflow próprio
Gallery Checks  → workflow próprio
```

O próximo ciclo não deve priorizar quantidade de funcionalidades acima dessa base. O projeto foi aprovado; agora a maior vantagem é evoluir sem perder previsibilidade.