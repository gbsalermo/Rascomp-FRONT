# RasComp — Etapas Pós-Projeto

Última revisão: **13/09/2026**

Este é o **único documento canônico para ordem de execução, etapa atual e critério de conclusão** do ciclo pós-projeto do RasComp.

Se qualquer README, continuidade, dossiê, documento datado ou registro histórico apresentar outra sequência, **este arquivo prevalece para planejamento**.

Documentos complementares:

```text
docs/README.md
→ índice e hierarquia da documentação

docs/DOSSIE_PROJETO_RASCOMP.md
→ arquitetura, domínio, decisões e riscos cross-repo

docs/CONTINUIDADE_FRONTEND.md
→ checkpoint funcional do frontend

backend: rascomp/docs/CONTINUIDADE.md
→ checkpoint funcional do backend
```

---

# 1. Estado de execução em 13/09/2026

```text
ETAPA 0   ✅ CONCLUÍDA / VALIDADA
ETAPA 1   ✅ CONCLUÍDA / VALIDADA
ETAPA 2   ⏭️ PRÓXIMA / NÃO INICIADA
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
```

## Checkpoint documental pré-ETAPA 1

Em 04/09/2026 foi autorizada uma revisão documental antes da retomada das correções da ETAPA 1, limitada a:

- remover documentação obsoleta/redundante;
- atualizar README, índices, dossiê e continuidades;
- corrigir divergências entre documentos e código atual;
- organizar referências ativas e históricas.

Esse trabalho **não representa avanço para a ETAPA 2**, pois não inclui refatoração técnica ampla nem limpeza de código/artefatos reservada àquela etapa.

Regra operacional após este checkpoint:

```text
retomar ETAPA 1
→ implementar correções
→ testar/validar
→ apresentar checkpoint
→ não iniciar ETAPA 2 sem confirmação explícita
```

## Checkpoint interno da ETAPA 1

A ETAPA 1 está sendo executada em blocos funcionais para reduzir risco e preservar validação incremental:

```text
Bloco 1 — Competition + Registration     ✅ CONCLUÍDO / VALIDADO
Bloco 2 — Follow Line                    ✅ CONCLUÍDO / VALIDADO
Bloco 3 — Sumô                           ✅ CONCLUÍDO / VALIDADO
Bloco 4 — Chaves                         ✅ CONCLUÍDO / VALIDADO
Bloco 5 — Fluxos integrados completos    ✅ CONCLUÍDO / VALIDADO
```

O Bloco 2 consolidou:

- perfil RRC de `3 tomadas × 3 tentativas`;
- estados válidos de tentativa;
- limite por tentativa;
- penalidade temporal configurável;
- cronômetro operacional;
- tomada perdida por ausência sem tentativas fictícias;
- checkpoints apenas informativos para ranking;
- integração da ausência com integridade de cancelamento/reabertura;
- Flyway V10;
- backend com 86 testes verdes;
- frontend Gestão com typecheck + build verdes.

O Bloco 3 consolidou:

- inspeção de Sumô como decisão humana `APTO/INAPTO`;
- peso medido apenas informativo/auditável;
- categorias de Sumô com modo de controle `AUTONOMO | RC`;
- 3 rounds regulares / 2 vitórias preservados como perfil operacional;
- rounds extras somente quando necessários, limitados e com justificativa obrigatória;
- `FALHA_INICIALIZACAO` formalizada sem decisão automática do sistema;
- cadastro de juízes por competição;
- decisão de juiz identificada, justificada e auditável após esgotar rounds regulares/extras;
- motivos de resultado explícitos;
- Flyway V11;
- backend com 87 testes, 0 falhas/erros/skipped e `demo-profile` verde contra MySQL real;
- frontend Gestão com typecheck + build verdes e operação alinhada ao novo contrato.

O Bloco 4 consolidou:

- geração/regeneração de chave permitida pelo fluxo comum somente em `INSCRICOES_ENCERRADAS`;
- BYE automático diferenciado de atividade competitiva real;
- regeneração bloqueada após round, resultado ou partida efetivamente iniciada/finalizada;
- chave marcada `EM_ANDAMENTO` quando a disputa real começa;
- árvore lógica protegida contra edição estrutural comum após geração;
- agenda operacional separada da árvore, com horário, pista, ordem de execução e convocação;
- correção de vencedor propagado permitida apenas quando a dependência seguinte ainda não começou;
- correção bloqueada quando a partida dependente já possui atividade competitiva;
- frontend Gestão alinhado ao estado permitido de geração e à nova agenda;
- `testdata` ajustado para montar as chaves em estado válido antes de avançar os cenários demonstrativos;
- Flyway V12;
- backend com 98 testes, 0 falhas/erros/skipped e `demo-profile` verde contra MySQL real;
- frontend Gestão com typecheck + build verdes.

O Bloco 5 consolidou o fechamento integrado da ETAPA 1:

- cinco suítes de fluxo com services + repositories reais usando H2 em memória no profile `flowtest`;
- `CompetitionLifecycleFlowTest` para ciclo completo e preservação de estado em transição inválida;
- `RegistrationFlowTest` para criação, aprovação, cancelamento e DESISTENTE após atividade competitiva;
- `FollowCompetitionFlowTest` para tentativas, ranking, ausência e rejeição de estados impossíveis;
- `SumoCompetitionFlowTest` para inspeção → chave → rounds → resultado → campeão e regra de penalidades;
- `CompetitionIntegrityFlowTest` para ausência de persistência parcial e rollback transacional;
- backend com **111 testes**, 0 falhas/erros/skipped;
- profile `testdata` novamente validado contra MySQL real + Flyway V12;
- frontend sem mudança funcional no Bloco 5, preservando o último typecheck + build verde.

**A ETAPA 1 está concluída e validada. A ETAPA 2 é a próxima etapa, mas permanece NÃO INICIADA até confirmação explícita.**

---

# 2. Regras gerais do ciclo

```text
não criar roadmap paralelo
não pular etapas
não reescrever o projeto do zero
não quebrar o modo local
backend = fonte de verdade do domínio
mudanças pequenas, testáveis e reversíveis
migrations aplicadas nunca são reescritas
status só muda após implementação + validação + confirmação
```

O projeto foi apresentado e aprovado. O objetivo do ciclo é **estabilizar primeiro e evoluir depois**.

Portabilidade prevista:

```text
1 instalação do RasComp = 1 instituição organizadora
```

Não é multi-tenant neste ciclo.

---

# ETAPA 0 — Baseline e congelamento da versão aprovada ✅

**Objetivo:** preservar uma referência confiável da versão aprovada.

Resultado consolidado:

- versão funcional preservada;
- documentação centralizada;
- ordem pós-projeto congelada;
- migrations aplicadas protegidas contra reescrita;
- decisões de deploy registradas sem antecipar implantação.

**Status:** concluída e validada.

---

# ETAPA 1 — Correções de lógica e integridade ✅

**Objetivo:** fechar riscos que podem comprometer competição, histórico ou consistência antes da limpeza técnica e das novas funcionalidades.

## 1.1 Reativação de inscrição

Problema confirmado originalmente:

```text
RegistrationService.reativar()
→ reativava como PENDENTE
→ não revalidava a janela de inscrições
```

Situação atual:

```text
✅ corrigido no Bloco 1
```

## 1.2 Cancelamento de inscrição

Política explícita implementada para:

- PENDENTE;
- APROVADA;
- histórico competitivo;
- cancelamento solicitado pelo participante;
- distinção entre `CANCELADA` e `DESISTENTE`.

Ownership não substitui validação de estado do domínio.

Situação atual:

```text
✅ corrigido no Bloco 1
```

## 1.3 Geração/regeneração de chave

Definir estados de `Competition` permitidos para geração/regeneração e aplicar a regra em:

```text
BracketGenerationService
BracketService
BracketProgressionService
```

Contrato consolidado:

```text
INSCRICOES_ENCERRADAS
→ geração/regeneração comum permitida

chave somente gerada / apenas BYE automático
→ regeneração ainda permitida

round, resultado ou disputa real iniciada
→ regeneração comum bloqueada
```

Situação atual:

```text
✅ corrigido no Bloco 4
```

## 1.4 Correção de resultado após progressão

Evitar:

```text
resultado alterado
→ vencedor anterior já alimentou próxima fase
→ árvore inconsistente
```

Direção aprovada e implementada:

```text
próxima dependência ainda não iniciada
→ correção transacional segura
→ vencedor propagado anterior é removido/substituído

próxima dependência já iniciada
→ bloqueio da correção comum
→ histórico competitivo não é reescrito silenciosamente
```

Situação atual:

```text
✅ corrigido no Bloco 4
```

## 1.5 Estados válidos de tentativa Follow

Formalizar combinações permitidas de:

```text
concluida
valida
tempoSegundos
checkpointsAlcancados
```

O efeito oficial dos checkpoints no ranking não deve ser inventado.

Situação atual:

```text
✅ corrigido no Bloco 2
```

O Bloco 2 também fechou a regra 3×3, cronômetros, penalidade configurável e tomada perdida por ausência.

## 1.6 Invariantes administrativas futuras

Mapear invariantes que os futuros Ajustes Gerais não poderão quebrar, inclusive proteção para manter ao menos um DEV ativo quando a nova matriz de roles existir.

Situação atual:

```text
✅ invariante mapeada na ETAPA 1; implementação administrativa permanece reservada à ETAPA 5
```

## 1.7 Sumô — Bloco 3 concluído

O Bloco 3 alinhou o motor existente ao contrato competitivo aprovado:

```text
inspeção humana APTO/INAPTO                         ✅
peso apenas informativo                            ✅
modo de controle AUTONOMO | RC                     ✅
3 rounds regulares / 2 vitórias                    ✅
rounds extras necessários + limite + justificativa ✅
falha de inicialização formalizada                 ✅
identificação/decisão de juiz auditável            ✅
motivos de resultado explícitos                    ✅
```

Foram preservadas as regras já funcionais:

```text
2 penalidades → derrota automática do round
SUICIDIO_WO  → adversário vence
BYE          → avanço automático
```

Checkpoint do bloco:

```text
Backend Tests        ✅ 87 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V11   ✅
Profile testdata     ✅ cenário completo sobe contra MySQL real
Frontend Gestão      ✅ typecheck + build
```

## 1.8 Chaves — Bloco 4 concluído

O Bloco 4 separou a estrutura competitiva da agenda operacional e protegeu a progressão:

```text
geração em estado inválido                           → bloqueada
regeneração após atividade competitiva               → bloqueada
BYE automático sem disputa                           → não bloqueia regeneração
estrutura da árvore após geração                     → protegida
agenda (horário/pista/ordem operacional/convocação)  → editável separadamente
correção antes da próxima disputa                    → propagação corrigida com segurança
correção após dependência iniciada                   → bloqueada
```

Checkpoint do bloco:

```text
Backend Tests        ✅ 98 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V12   ✅
Profile testdata     ✅ cenário completo sobe contra MySQL real
Frontend Gestão      ✅ typecheck + build
```

## 1.9 Fluxos integrados — Bloco 5 concluído

O Bloco 5 validou a composição ponta a ponta das regras dos Blocos 1–4 sem adicionar nova funcionalidade competitiva.

```text
CompetitionLifecycleFlowTest  → ciclo e transições
RegistrationFlowTest          → inscrição/aprovação/cancelamento/desistência
FollowCompetitionFlowTest     → tentativas/ranking/ausência
SumoCompetitionFlowTest       → inspeção/chave/rounds/resultado/campeão/BYE
CompetitionIntegrityFlowTest  → rollback e proteção cross-domain
```

Checkpoint final da ETAPA 1:

```text
Backend Tests        ✅ 111 testes / 0 falhas / 0 erros / 0 skipped
H2 flowtest          ✅ services + repositories JPA reais
MySQL + Flyway V12   ✅
Profile testdata     ✅ cenário completo sobe contra MySQL real
Frontend Gestão      ✅ último typecheck + build verde preservado
```

O Bloco 5 comprovou também que operações rejeitadas preservam o estado anterior e não deixam persistência parcial.

## Critério de saída

- regras decididas;
- correções implementadas;
- testes automatizados relevantes;
- frontend ajustado quando contrato/erro mudar;
- CI verde;
- documentação atualizada;
- validação explícita.

---

# ETAPA 2 — Limpeza técnica e organização de código

**Objetivo:** reduzir dívida técnica antes dos novos módulos.

## Backend

- remover `rascomp/bin/` rastreado em commit isolado;
- avaliar `.classpath`, `.project` e `.gitkeep` remanescentes;
- remover TODOs/comentários obsoletos;
- revisar código morto/duplicado;
- manter regra de negócio nos services;
- reorganizar packages somente com ganho real.

## Frontend gestão

- dividir `api.ts` e `types.ts` gradualmente por domínio;
- decompor views grandes ao tocar nelas;
- remover código morto/duplicado;
- consolidar CSS corretivo e reduzir dependência da ordem de imports.

Não fazer refatoração big-bang.

---

# CHECKPOINT PÓS-ETAPA 2 — README + screenshots

Não é uma etapa nova.

Após ETAPAS 1 e 2 validadas:

- revisar README como vitrine pública;
- capturar telas reais e atualizadas;
- incluir Dashboard/Central, inscrições, Follow, Sumô/chaves e Portal do Participante;
- não expor dados sensíveis.

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

Acesso integral, estrutura de competição, roles/permissões e manutenção excepcional.

## GESTAO

Operação competitiva: inscrições permitidas, Follow, Sumô, inspeções, tentativas, rounds, chaves e resultados; sem manutenção estrutural DEV.

## MIDIA

Conteúdo institucional, mídia, galeria e publicação editorial; sem acesso automático à operação competitiva.

## PARTICIPANTE

Própria equipe, integrantes autorizados, robôs/fotos, inscrições, acompanhamento e avisos.

Segurança obrigatória:

```text
backend → autorização real
frontend → navegação/UX compatível
```

Menu oculto nunca é segurança.

---

# ETAPA 4 — Avisos IN_APP + integração Telegram

**Objetivo:** implementar em um único trabalho a comunicação operacional da competição dentro do RasComp e sua entrega complementar pelo Telegram.

## 4.1 Aviso persistido

Fluxo base:

```text
GESTAO/DEV
→ seção Avisos
→ seleciona uma competição
→ escreve aviso/anúncio
→ publica
→ backend persiste Aviso
→ participante pode consultar no RasComp
```

O aviso `IN_APP` é sempre a **fonte de verdade e histórico oficial**.

## 4.2 Telegram como canal complementar

No mesmo fluxo de publicação, quando a integração estiver habilitada:

```text
Aviso persistido
→ backend seleciona destino Telegram da competição
→ bot publica/envia a comunicação
→ resultado da tentativa é rastreado quando aplicável
```

O frontend nunca deve chamar a Telegram Bot API diretamente.

```text
gestao
→ API RasComp
→ serviço de Avisos/Comunicação
→ persistência
→ integração Telegram
```

Falha no Telegram não pode cancelar nem apagar o aviso IN_APP.

## 4.3 Escopo por competição

Avisos de uma competição não devem ser disparados indiscriminadamente para todos os usuários.

A etapa deve definir a forma inicial de distribuição do Telegram e a política de destinatários. O caminho pode começar com canal/grupo/bot associado à competição e evoluir para identificação individual quando necessário.

## 4.4 Identificação do participante no Telegram — opcional inicialmente

**Não é obrigatório vincular a conta RasComp à conta Telegram na primeira versão.**

Uma evolução possível é o bot solicitar o **código competitivo da inscrição (`Registration`)** para identificar o participante/inscrição que está recebendo avisos.

Esse identificador competitivo é planejado para a ETAPA 10. Portanto:

- a ETAPA 4 não deve depender dele para existir;
- a identificação individual pode ficar opcional na primeira versão;
- quando o código existir, pode ser reutilizado sem criar um segundo identificador paralelo;
- não usar `@username` do Telegram como identidade oficial do domínio.

## 4.5 Segurança e disponibilidade

Prever:

- `TELEGRAM_ENABLED` para desligar a integração;
- token do bot somente por segredo/variável de ambiente;
- timeout e indisponibilidade da Bot API;
- rate limit;
- prevenção de envio duplicado;
- registro de falha quando necessário;
- autorização real no backend para publicação.

Telegram nunca será a única cópia de um aviso.

## Critério de saída

- Aviso persistido e consultável IN_APP;
- seleção por competição;
- permissões corretas;
- integração Telegram funcional e desligável;
- segredo fora do repositório;
- falha do Telegram não afeta o aviso persistido;
- política inicial de distribuição definida;
- identificação por código, se adotada inicialmente, tratada como opcional;
- testes relevantes;
- frontend integrado;
- CI verde e documentação atualizada.

---

# ETAPA 5 — Ajustes Gerais DEV + auditoria

Criar operações administrativas seguras, específicas e auditáveis, por exemplo:

```text
alterarRole
ativar/desativar usuário
transferirCompetidor
transferirRobo
transferirResponsabilidade
corrigirInscricao
reativar entidade
```

Não criar editor genérico de tabelas nem console SQL.

Ações críticas devem registrar, quando aplicável:

```text
quem
ação
entidade
antes/depois
data/hora
motivo/observação
```

---

# ETAPA 6 — Portabilidade institucional

Permitir instalar **backend + gestão** para outra instituição sem editar Java/Vue apenas para trocar identidade básica.

Estratégia:

```text
uma instalação = uma instituição organizadora
```

Criar conceito próprio para configuração da instância, por exemplo `PlatformInstanceConfig`, sem reutilizar `Institution` das equipes participantes.

Inclui identidade, contatos/links, logos, parâmetros realmente institucionais, fluxo do primeiro DEV e documentação de instalação limpa.

**Multi-tenancy fica fora deste ciclo.**

---

# ETAPA 7 — Gestor de Mídia / CMS + Landing real

Criar área editorial em `gestao/` para `MIDIA`/`DEV`.

Modelo de referência:

```text
MediaAsset
ContentSlot
ContentItem
```

A Landing deve consumir conteúdo publicado em vez de exigir commits para alterações editoriais comuns.

Reutilizar `ObjectStorageService` + Cloudflare R2. Não criar terceiro mecanismo de upload.

---

# ETAPA 8 — Módulo de Regras

Criar área pública/editorial para regras de:

```text
Follow Line
Sumô geral/RC/penalidades/WO
Futebol de Robôs
Ambiente/Vestimenta
```

Validar texto oficial antes de publicar. Diferenciar regra editorial de regra executável pelo backend e não inventar sanções.

---

# ETAPA 9 — Futebol de Robôs

Nova modalidade com competidores usando robôs fornecidos pela organização.

Impacto crítico:

```text
Registration.robot
→ hoje obrigatório
→ deverá ser opcional conforme modalidade
```

Antes da migration, definir equipe, atribuição de robôs, placar, duração, empate/desempate, formato, inspeção e penalidades.

**Não criar robô fictício para satisfazer FK.**

---

# ETAPA 10 — Completar Portal do Participante + identificação competitiva

Completar:

- convite/aceite de equipe;
- integrantes;
- robôs/fotos;
- inscrições permitidas;
- Futebol;
- avisos;
- histórico e acompanhamento competitivo;
- estados vazios/loading/erro;
- responsividade e feedback de ações.

## Identificador competitivo

Criar código curto e único por **Registration aprovada**, não por Robot.

```text
inscrição aprovada
→ backend gera código
→ participante e GESTAO visualizam
→ conferência física pode usar o mesmo código
```

Esse código poderá também ser reutilizado futuramente como identificação opcional em integrações externas, incluindo Telegram. Não substitui ownership, elegibilidade ou inspeção.

---

# ETAPA 11 — Consolidar Landing + Galeria + conteúdo público

Decidir definitivamente:

```text
A. manter photo-gallery como aplicação independente
ou
B. absorver a galeria na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de URL/deploy separado.

A experiência pública consolidada deve consumir API pública competitiva + CMS + Regras + mídias publicadas.

---

# ETAPA 12 — Hardening e preparação para uso externo

Revisar sistematicamente:

- autorização endpoint a endpoint;
- erros/logs/auditoria;
- CORS e segredos;
- upload/storage;
- migrations do zero e sobre banco existente;
- backup/restore;
- primeiro DEV;
- instalação/upgrade;
- `testdata` bloqueado em produção;
- hardcodes institucionais;
- acessibilidade/responsividade;
- falhas de API/Telegram/R2;
- concorrência crítica e rollback administrativo.

---

# ETAPA 13 — Bateria final de testes manuais

Simular uso real de ponta a ponta:

```text
instalação/configuração
login/perfis/permissões
equipes/participantes/robôs/fotos
inscrições
Follow
Sumô
Futebol
chaves/BYE/progressão
resultados/histórico
Avisos IN_APP + Telegram
Ajustes Gerais/auditoria
CMS/mídia
Landing/galeria/regras
falhas e recuperação
uso concorrente
instalação com outra identidade institucional
competição completa
```

Objetivo: validar o RasComp como produto operacional, não apenas conjunto de telas.

---

# ETAPA 14 — Deploy em nuvem / Cloudflare

Adicionar modo cloud sem remover o modo local.

Arquitetura planejada:

```text
Cloudflare DNS/TLS
Workers Static Assets → gestao + landing
Containers/Docker → backend Spring Boot
R2 → mídias/uploads persistentes
Secrets → segredos
MySQL gerenciado externo → banco persistente
GitHub Actions/Cloudflare → CI/CD
```

Cloudflare D1 não é requisito do primeiro deploy.

**Deploy só começa depois da ETAPA 13 passar.**

---

# 3. Ordem congelada

```text
ETAPA 0  Baseline ✅
    ↓
ETAPA 1  Correções de lógica e integridade ✅
    ↓
ETAPA 2  Limpeza técnica
    ↓
CHECKPOINT README + screenshots
    ↓
ETAPA 3  Permissões
    ↓
ETAPA 4  Avisos IN_APP + Telegram
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
ETAPA 11 Landing + Galeria
    ↓
ETAPA 12 Hardening
    ↓
ETAPA 13 Testes manuais completos
    ↓
ETAPA 14 Deploy Cloudflare
```

---

# 4. Critério para concluir qualquer etapa

Conforme aplicável:

```text
regra definida
backend implementado
migration nova quando necessária
testes automatizados
frontend integrado
permissão correta
tratamento de erro
documentação atualizada
validação local
CI verde
validação explícita do checkpoint
```

Não marcar uma etapa como concluída por commit parcial ou apenas porque uma tela apareceu.

---

# 5. Protocolo de continuidade

Ao continuar o RasComp:

```text
1. ler docs/README.md
2. conferir a etapa atual neste arquivo
3. ler docs/DOSSIE_PROJETO_RASCOMP.md
4. ler a continuidade do repositório afetado
5. confirmar estado real no código
6. permanecer na etapa atual
7. implementar backend primeiro para regra de negócio
8. adicionar/ajustar testes
9. integrar frontend
10. validar e atualizar documentação
11. parar no checkpoint e aguardar validação
```

Se houver conflito de **ordem de execução**, este arquivo é a autoridade.