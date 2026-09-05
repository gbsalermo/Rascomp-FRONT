# RasComp — Etapas Pós-Projeto

Última revisão: **04/09/2026**

Este é o **único documento canônico para a ordem de execução** do ciclo pós-projeto do RasComp.

Se qualquer README, continuidade, dossiê antigo, revisão datada ou documento histórico apresentar uma ordem diferente, **este arquivo prevalece para planejamento e sequência de etapas**.

Documentos complementares:

```text
docs/README.md
→ índice de documentação e ordem de leitura para humanos/IA

docs/DOSSIE_PROJETO_RASCOMP.md
→ arquitetura cross-repo, decisões, regras, riscos e mapa "quero alterar X"

docs/CONTINUIDADE_FRONTEND.md
→ checkpoint funcional do frontend

backend: rascomp/docs/CONTINUIDADE.md
→ checkpoint funcional do backend

docs/DECISAO_DEPLOY_CLOUD.md
→ decisão arquitetural congelada de deploy

docs/DEPLOY_CLOUDFLARE.md
→ guia detalhado da ETAPA 15
```

---

# 1. Estado de execução em 04/09/2026

```text
ETAPA 0   ✅ CONCLUÍDA / VALIDADA
ETAPA 1   🚧 ETAPA ATUAL — EM EXECUÇÃO E VALIDAÇÃO
ETAPA 2   ⏳ NÃO INICIADA
CHECKPOINT README/SCREENSHOTS ⏳ NÃO INICIADO
ETAPA 3   ⏳ NÃO INICIADA
ETAPA 4   ⏳ NÃO INICIADA
ETAPA 5   ⏳ NÃO INICIADA
ETAPA 6   ⏳ NÃO INICIADA
ETAPA 7   ⏳ NÃO INICIADA
ETAPA 8   ⏳ NÃO INICIADA
ETAPA 9   ⏳ NÃO INICIADA
ETAPA 10  ⏳ NÃO INICIADA
ETAPA 11  ⏳ NÃO INICIADA
ETAPA 12  ⏳ NÃO INICIADA
ETAPA 13  ⏳ NÃO INICIADA
ETAPA 14  ⏳ NÃO INICIADA
ETAPA 15  ⏳ NÃO INICIADA
```

A implementação da página **404** em `gestao/` e `landing-page/`, concluída em 30/08/2026, é um ajuste isolado do frontend e **não representa avanço de etapa**.

Uma IA não deve inferir que uma etapa foi concluída porque encontrou commits relacionados. O status só muda após **implementação + testes/validação aplicável + confirmação explícita do checkpoint**.

Regra operacional atual:

```text
trabalhar somente na ETAPA 1
→ apresentar resultado
→ aguardar validação
→ não iniciar ETAPA 2 sem confirmação
```

---

# 2. Regras gerais do ciclo

```text
não criar outro roadmap
não reorganizar etapas por conta própria
não pular etapa
não reescrever o projeto do zero
não quebrar o modo local
backend continua sendo fonte de verdade do domínio
mudanças pequenas, testáveis e reversíveis
migrations aplicadas nunca são reescritas
```

O projeto foi aprovado em sua versão de demonstração. O objetivo deste ciclo é **estabilizar primeiro e evoluir depois**.

Portabilidade planejada nesta rodada:

```text
backend + gestao
→ reutilizáveis por outras instituições
```

Não é multi-tenant nesta fase:

```text
1 instalação do RasComp
=
1 instituição organizadora
```

---

# ETAPA 0 — Baseline e congelamento da versão aprovada ✅

**Objetivo:** criar uma referência confiável da versão aprovada antes de mudanças estruturais.

Inclui:

- preservar o comportamento validado;
- registrar arquitetura e estado atual;
- congelar a ordem pós-projeto;
- manter CI backend/frontend verde no checkpoint conhecido;
- não alterar migrations já aplicadas;
- separar correções de novas funcionalidades;
- registrar decisões de deploy sem iniciar o deploy.

**Resultado:** baseline conhecido, documentação centralizada e roadmap congelado.

**Status:** concluída e validada.

---

# ETAPA 1 — Correções de lógica e riscos da revisão 🚧

**Objetivo:** corrigir inconsistências que podem comprometer competição, histórico ou integridade antes de limpeza estrutural e novas permissões.

Esta é a **etapa atual**.

## 1.1 Reativação de inscrição

Problema confirmado:

```text
RegistrationService.reativar()
→ reativa como PENDENTE
→ hoje não revalida a janela de inscrições
```

Revisar e corrigir para impedir reativação indevida fora do período permitido, preservando a regra definida para ações administrativas excepcionais futuras.

## 1.2 Cancelamento de inscrição

Definir e implementar a política para cada estado competitivo, especialmente:

- PENDENTE;
- APROVADA;
- após geração de chave;
- com competição EM_ANDAMENTO;
- quando já houver histórico competitivo.

Ownership por si só não é suficiente: o backend deve validar o estado do domínio.

## 1.3 Geração/regeneração de chave

Definir explicitamente em quais estados de `Competition` a operação é permitida.

Revisar:

```text
BracketGenerationService
BracketService
BracketProgressionService
```

Evitar que uma chamada autorizada tecnicamente produza chave em estado competitivo inválido.

## 1.4 Correção de resultado após progressão

Problema de integridade:

```text
MatchResult
→ vencedor já avançou
→ resultado anterior é alterado
→ próxima fase pode ficar inconsistente
```

Decidir e implementar uma estratégia segura:

```text
A. bloquear alteração após progressão
ou
B. rollback/reprocessamento explícito e consistente
```

Não permitir edição silenciosa que deixe a árvore inválida.

## 1.5 Estados válidos de tentativa Follow

Formalizar combinações permitidas de:

```text
concluida
valida
tempoSegundos
checkpointsAlcancados
```

Exemplos que precisam de regra clara:

```text
concluida=true + tempo=null
valida=true + concluida=false
valida=true + tempo=null
```

O impacto de checkpoints no ranking **não deve ser inventado**; depende do regulamento oficial.

## 1.6 Proteções para operações administrativas futuras

Antes dos futuros Ajustes Gerais, mapear invariantes que não podem ser quebradas, inclusive proteção para não deixar a plataforma sem um DEV ativo quando a nova matriz de roles existir.

## Critério de saída da ETAPA 1

- regras decididas;
- correções implementadas no backend quando aplicável;
- testes automatizados cobrindo os riscos;
- frontend ajustado se algum contrato/erro mudar;
- CI verde;
- documentação atualizada;
- validação explícita antes da ETAPA 2.

---

# ETAPA 2 — Limpeza técnica e organização de código

**Objetivo:** reduzir dívida técnica antes de adicionar novos módulos.

## Backend

- remover `rascomp/bin/` rastreado em commit isolado;
- avaliar `.classpath`, `.project` e `.gitkeep` legados;
- remover TODOs/comentários obsoletos;
- revisar código morto;
- reduzir fluxos duplicados;
- manter regra de negócio nos services;
- reorganizar packages somente quando houver ganho real.

> Em 31/08/2026, `rascomp/bin/` ainda está rastreado. Logo esta etapa não foi concluída antecipadamente.

## Frontend gestão

- dividir gradualmente `api.ts` e `types.ts` por domínio;
- decompor views grandes ao tocar nelas;
- remover código morto;
- reduzir duplicação entre telas operacionais;
- consolidar CSS corretivo e diminuir dependência da ordem de imports.

Direção de organização, não obrigação de big-bang:

```text
api/
├─ auth
├─ competition
├─ registration
├─ participant
├─ follow
├─ sumo
├─ football
├─ notices
├─ media
└─ dev

types/
├─ auth
├─ competition
├─ registration
├─ participant
├─ follow
├─ sumo
├─ football
├─ notices
├─ media
└─ common
```

---

# CHECKPOINT PÓS-ETAPA 2 — README + screenshots

Este checkpoint **não é uma nova etapa**.

Objetivo:

```text
registrar visualmente a versão estabilizada
+
finalizar a apresentação do projeto no GitHub
```

Fazer somente após ETAPAS 1 e 2 validadas:

- capturas reais e atualizadas;
- Dashboard/Central;
- inscrições;
- Follow;
- Sumô/chaves;
- Portal do Participante;
- sem dados sensíveis;
- README revisado como vitrine do projeto.

---

# ETAPA 3 — Nova matriz de permissões

Substituir:

```text
ORGANIZACAO | PARTICIPANTE
```

por:

```text
DEV | GESTAO | MIDIA | PARTICIPANTE
```

## DEV

- acesso total;
- cria/edita/desativa competição;
- altera permissões;
- manutenção estrutural;
- correções administrativas;
- futuras ferramentas de Ajustes Gerais.

## GESTAO

- operação competitiva;
- Follow;
- Sumô;
- inspeções;
- tentativas/tomadas;
- rounds/batalhas;
- chaves e resultados permitidos;
- sem manutenção estrutural DEV;
- não cria competição.

## MIDIA

- conteúdo editorial;
- mídia/galeria;
- slots/tópicos;
- sem acesso automático à operação competitiva.

## PARTICIPANTE

- própria equipe;
- integrantes permitidos;
- robôs/fotos;
- inscrições;
- desempenho;
- avisos recebidos.

Segurança obrigatória em duas camadas:

```text
backend → autorização real
frontend → navegação/UX compatível
```

Menu oculto nunca é segurança.

---

# ETAPA 4 — Avisos ao participante

**Objetivo mínimo:** comunicação operacional persistida dentro do RasComp.

```text
GESTAO/DEV publica aviso
→ participante recebe/visualiza
→ histórico permanece no sistema
```

Modelo de canais:

```text
Aviso
├─ IN_APP — fonte de verdade
└─ TELEGRAM — canal complementar planejado para a ETAPA 11
```

Nesta etapa o aviso deve existir e funcionar integralmente dentro do RasComp. A integração de entrega automática pelo bot do Telegram será adicionada somente na ETAPA 11, após o Portal do Participante estar completo.

Telegram nunca deve ser a única cópia do aviso.

Detalhes de domínio devem ser buscados no Dossiê Mestre no momento da implementação.

---

# ETAPA 5 — Ajustes Gerais DEV + auditoria

Criar operações administrativas seguras, específicas e auditáveis.

Exemplos:

```text
alterar role
ativar/desativar usuário
transferir competidor
transferir robô
trocar responsável da equipe
corrigir inscrição
reativar entidade
corrigir associação administrativa
```

Não criar editor genérico de tabela nem console SQL.

Cada ação crítica deve ter:

```text
endpoint específico
service específico
validação de domínio
autorização DEV
auditoria
```

Auditoria, quando aplicável:

```text
quem executou
ação
entidade
antes
depois
data/hora
motivo/observação
```

---

# ETAPA 6 — Portabilidade institucional

Permitir que outra instituição instale **backend + gestão** sem editar Java/Vue apenas para trocar identidade básica.

Estratégia:

```text
uma instalação = uma instituição organizadora
```

Não confundir com `Institution`, que representa a instituição de uma equipe participante.

Criar conceito próprio, por exemplo:

```text
PlatformInstanceConfig
```

Configurações candidatas:

- nome/sigla;
- logos;
- contatos/links;
- identidade visual;
- nome de evento padrão;
- textos administrativos;
- parâmetros operacionais realmente institucionais.

Também:

- fluxo do primeiro DEV;
- instalação limpa documentada;
- variáveis de ambiente documentadas;
- teste com identidade fictícia de outra instituição.

**Multi-tenancy fica fora deste ciclo.**

---

# ETAPA 7 — Gestor de Mídia / CMS + Landing real

Criar no `gestao/` a área editorial para `MIDIA`/`DEV`.

Modelo de referência:

```text
MediaAsset
→ arquivo/metadados/storage

ContentSlot
→ janela lógica e estável da Landing

ContentItem
→ conteúdo publicado associado ao slot
```

Slots possíveis:

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

Escopo:

- criar/editar conteúdo;
- publicar/despublicar;
- ordenar;
- CTA/títulos/textos;
- upload;
- associação de mídia a slots;
- galeria/conteúdo institucional permitido;
- substituir placeholders por logos/fotos reais disponíveis;
- validar responsividade e carregamento.

Reutilizar:

```text
ObjectStorageService + Cloudflare R2
```

Não criar um terceiro mecanismo de upload.

---

# ETAPA 8 — Módulo de Regras

Criar área pública com regras em cards/sections expansíveis e fonte editorial administrável quando apropriado.

Escopos iniciais:

```text
Follow Line
Sumô
├─ geral
├─ RC
├─ penalidades
└─ desclassificação/WO
Futebol de Robôs
Ambiente / Vestimenta
```

Requisitos:

- validar texto oficial com a organização;
- diferenciar regra editorial de regra executável pelo backend;
- não inventar sanções;
- definir quem pode editar/publicar.

---

# ETAPA 9 — Futebol de Robôs

Nova modalidade com competidores usando robôs fornecidos pela organização.

Conceito:

```text
competidor A × competidor B
robô fornecido A × robô fornecido B
```

Impacto crítico atual:

```text
Registration.robot
→ hoje obrigatório
→ precisa ser opcional conforme modalidade
```

Fazer:

- adicionar `FUTEBOL`;
- definir regulamento antes da migration;
- adaptar Registration/DTO/request/validações;
- definir duplicidade por modalidade;
- decidir obrigatoriedade de equipe;
- definir placar/duração/empate/desempate/penalidades;
- reaproveitar `Match`/`MatchResult` quando fizer sentido;
- criar operação, participante e publicação pública;
- adicionar testes.

**Não criar robôs fictícios para satisfazer FK.**

---

# ETAPA 10 — Completar Portal do Participante

Transformar o portal inicial em fluxo completo:

- convite/aceite de equipe;
- integrantes;
- robôs;
- fotos;
- criação/gestão de inscrições permitidas;
- Futebol;
- avisos;
- histórico competitivo;
- acompanhamento da competição;
- estados vazios/loading/erro;
- responsividade;
- feedback de ações.

## Identificação competitiva da inscrição

Criar identificador curto e único por **Registration aprovada**, e não por Robot.

Fluxo:

```text
inscrição aprovada
→ backend gera identificador competitivo
→ participante visualiza
→ GESTAO visualiza o mesmo código
→ conferência física usa código + dados/foto quando aplicável
```

Definir:

- formato;
- unicidade/escopo;
- momento de geração;
- cancelamento/reativação/correção;
- exibição nas telas operacionais;
- possibilidade futura de QR Code;
- migration V8+ se persistido;
- testes de unicidade/preservação.

O código não substitui ownership, elegibilidade, categoria, inspeção ou outras validações.

---

# ETAPA 11 — Integração Telegram para avisos e anúncios da competição

**Objetivo:** transformar o Telegram em canal complementar de entrega dos avisos já persistidos no RasComp, permitindo que GESTAO/DEV envie comunicações relacionadas a uma competição específica diretamente aos participantes vinculados a ela.

A fonte de verdade continua sendo o aviso IN_APP criado na ETAPA 4.

Fluxo desejado na gestão:

```text
GESTAO/DEV
→ seção Avisos
→ seleciona a competição
→ escreve aviso/anúncio
→ publica
→ backend persiste o Aviso IN_APP
→ resolve participantes destinatários da competição
→ envia a mesma comunicação pelo bot do Telegram
→ registra resultado das entregas
```

O frontend **não deve chamar a API do Telegram diretamente**. O fluxo deve ser:

```text
gestao
→ API RasComp
→ AvisoService / serviço de comunicação
→ persistência do aviso
→ integração Telegram no backend
→ Telegram Bot API
→ participantes
```

## 11.1 Vínculo do participante com o Telegram

O participante precisa vincular sua conta RasComp ao Telegram antes de receber mensagens privadas do bot.

Direção preferencial:

```text
Portal do Participante
→ gerar vínculo/token temporário
→ abrir/iniciar bot
→ bot confirma vínculo
→ backend associa Telegram ao UserAccount
```

Não usar nome de usuário do Telegram como identidade confiável do participante.

Armazenar somente os identificadores necessários para a entrega, com possibilidade de:

- vincular;
- desvincular;
- refazer vínculo;
- desativar recebimento quando aplicável.

## 11.2 Segmentação por competição

Um aviso de competição não deve ser disparado indiscriminadamente para todos os usuários do sistema.

O backend deve determinar os destinatários a partir do domínio RasComp, considerando a competição selecionada e as inscrições/equipes/participantes elegíveis conforme a regra definida na implementação.

Exemplo conceitual:

```text
Competition
→ Registrations relevantes
→ participantes/usuários associados
→ vínculos Telegram ativos
→ entregas
```

Definir antes da implementação como tratar, entre outros:

- inscrição PENDENTE;
- inscrição APROVADA;
- inscrição REJEITADA/CANCELADA/DESCLASSIFICADA;
- responsável da equipe;
- múltiplos competidores da mesma equipe;
- usuário sem Telegram vinculado.

## 11.3 Persistência e rastreabilidade

O envio ao Telegram deve possuir rastreabilidade suficiente para operação e suporte.

Modelo conceitual:

```text
Aviso
└─ Entregas
   ├─ IN_APP
   └─ TELEGRAM
      ├─ destinatário
      ├─ status
      ├─ data/hora
      └─ erro resumido quando houver
```

Estados candidatos de entrega:

```text
PENDENTE
ENVIADO
FALHA
```

A modelagem definitiva deve ser decidida na etapa antes da migration.

## 11.4 Falhas e disponibilidade

Falha do Telegram **não pode apagar, cancelar ou invalidar o aviso IN_APP**.

Fluxo obrigatório:

```text
Aviso persistido no RasComp ✅
Telegram disponível          → tenta entregar
Telegram indisponível        → registra falha
RasComp continua operacional ✅
```

Prever:

- timeout;
- erros da Bot API;
- bot bloqueado pelo usuário;
- chat/vínculo inválido;
- rate limit;
- tentativa de reenvio controlada quando apropriado;
- prevenção de envio duplicado acidental.

## 11.5 Segurança e configuração

O token do bot é segredo e nunca deve ser versionado.

Configuração esperada por ambiente, por exemplo:

```text
TELEGRAM_ENABLED
TELEGRAM_BOT_TOKEN
TELEGRAM_BOT_USERNAME
```

A integração deve permanecer desligável para preservar execução local e instalações que não desejem usar Telegram.

Somente roles autorizadas podem publicar/disparar avisos. O backend continua responsável pela autorização real.

## 11.6 Critério de saída da ETAPA 11

- vínculo participante ↔ Telegram funcional;
- aviso continua persistido IN_APP;
- seleção/segmentação por competição validada;
- envio pelo bot funcional;
- entregas e falhas rastreáveis;
- segredo fora do repositório;
- integração desligável por configuração;
- testes automatizados dos serviços relevantes;
- tratamento de indisponibilidade do Telegram;
- frontend integrado na seção Avisos;
- CI verde;
- documentação atualizada;
- validação explícita antes da ETAPA 12.

---

# ETAPA 12 — Consolidar Landing + Galeria + conteúdo público

Hoje:

```text
landing-page/
photo-gallery/
```

Decisão a fechar:

```text
A. manter galeria separada
ou
B. absorver na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de deploy/URL independente.

A experiência pública consolidada deve consumir:

```text
API pública competitiva
+
API pública CMS
+
API pública regras
+
mídias publicadas
```

Conteúdo editorial comum não deve exigir commit de Vue após o CMS.

---

# ETAPA 13 — Hardening e preparação para uso externo

Revisar sistematicamente:

- autorização endpoint a endpoint;
- mensagens de erro;
- logs/auditoria;
- CORS;
- segredos;
- upload/storage;
- migrations do zero e sobre banco existente;
- backup/restore;
- primeiro DEV;
- instalação/upgrade;
- `testdata` bloqueado em produção;
- hardcodes institucionais;
- acessibilidade/responsividade;
- indisponibilidade de API/Telegram/R2;
- concorrência crítica;
- rollback administrativo.

---

# ETAPA 14 — Bateria final de testes manuais

Simular uso real de ponta a ponta, incluindo:

```text
instalação/configuração
cadastros/logins/perfis/permissões
equipes/participantes/robôs/fotos
inscrições e estados
competições
Follow
Sumô
Futebol
chaves/BYEs/progressão
resultados/histórico
Avisos IN_APP + Telegram
vínculo/desvínculo Telegram
falha e recuperação da entrega Telegram
Ajustes Gerais/auditoria
mídia/CMS
Landing/galeria/regras
ativação/desativação/reativação
falhas e recuperação
uso concorrente
fluxos DEV/GESTAO/MIDIA/PARTICIPANTE
instalação com outra identidade institucional
competição completa
```

Objetivo: validar o RasComp como produto operacional, não apenas como conjunto de telas.

---

# ETAPA 15 — Deploy em nuvem / Cloudflare

Criar uma segunda forma de execução sem remover o modo local.

```text
LOCAL continua funcionando
+
CLOUD passa a existir como configuração/deploy separado
```

Decisão congelada e guia detalhado:

```text
docs/DECISAO_DEPLOY_CLOUD.md
docs/DEPLOY_CLOUDFLARE.md
```

Arquitetura planejada:

```text
Cloudflare DNS/TLS
Workers Static Assets → gestao + landing
Cloudflare Containers + Docker → backend Spring Boot
Cloudflare R2 → mídias/uploads persistentes
Secrets/Secrets Store → segredos
MySQL gerenciado externo → banco persistente inicial
GitHub Actions/Cloudflare → CI/CD
custom domains
backup/restore
observabilidade
smoke tests
rollback
```

Cloudflare D1 não é requisito do primeiro deploy porque o RasComp atual usa MySQL + JPA/Hibernate + Flyway e D1 possui semântica SQLite.

**Deploy só começa depois da ETAPA 14 passar.**

---

# 3. Ordem congelada

```text
ETAPA 0  Baseline ✅
    ↓
ETAPA 1  Correções de lógica 🚧
    ↓
ETAPA 2  Limpeza técnica
    ↓
CHECKPOINT README + screenshots
    ↓
ETAPA 3  Permissões
    ↓
ETAPA 4  Avisos IN_APP
    ↓
ETAPA 5  Ajustes Gerais + auditoria
    ↓
ETAPA 6  Portabilidade institucional
    ↓
ETAPA 7  CMS / Mídia + Landing real
    ↓
ETAPA 8  Regras
    ↓
ETAPA 9  Futebol de Robôs
    ↓
ETAPA 10 Participante completo + identificação competitiva
    ↓
ETAPA 11 Integração Telegram — avisos/anúncios por competição
    ↓
ETAPA 12 Landing + Galeria
    ↓
ETAPA 13 Hardening
    ↓
ETAPA 14 Testes manuais completos
    ↓
ETAPA 15 Deploy Cloudflare
```

Pequenos ajustes internos de uma etapa podem ocorrer por dependência real, mas **não reordenar etapas estruturais sem decisão explícita**.

---

# 4. Critério para concluir qualquer etapa

Uma etapa só pode ser marcada como concluída quando, conforme aplicável, houver:

```text
regra definida
backend implementado
migration nova quando necessária
testes automatizados relevantes
frontend integrado
permissão correta
tratamento de erro
documentação atualizada
validação local
CI verde
validação explícita do checkpoint
```

Não marcar uma etapa como concluída apenas porque a tela apareceu ou porque existe um commit parcial.

---

# 5. Protocolo para outra IA continuar o projeto

Ao receber a tarefa de continuar o RasComp:

1. ler `docs/README.md`;
2. ler este arquivo para identificar a etapa atual;
3. ler `docs/DOSSIE_PROJETO_RASCOMP.md` para arquitetura e decisões;
4. ler a continuidade do repositório que será alterado;
5. consultar documentos específicos do domínio apenas quando relevantes;
6. confirmar no código o estado real antes de editar;
7. trabalhar **somente na etapa atual**;
8. implementar backend primeiro quando houver regra de negócio;
9. adicionar/ajustar testes;
10. integrar frontend;
11. validar;
12. atualizar documentação;
13. parar e aguardar validação antes de avançar.

Se houver conflito entre documento antigo e código atual, registrar a divergência. Se houver conflito sobre **ordem de execução**, este arquivo é a autoridade.