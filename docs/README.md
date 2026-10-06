# RasComp — Índice da Documentação

Última revisão: **05/10/2026**

Este é o ponto de entrada para qualquer pessoa ou IA que precise entender ou continuar o RasComp.

A documentação foi revisada para evitar roadmaps paralelos, snapshots de demonstração tratados como estado atual e referências históricas que já não correspondem ao código.

---

# 1. Ordem obrigatória de leitura

```text
1. docs/ETAPAS_POS_PROJETO.md
   → única fonte de verdade para ordem, etapa atual e critérios de saída

2. docs/DOSSIE_PROJETO_RASCOMP.md
   → arquitetura, domínio, decisões, riscos e mapa de alteração cross-repo

3. docs/CONTRATO_REGRAS_COMPETITIVAS.md
   → regras competitivas aprovadas, invariantes e base dos testes da ETAPA 1

4. docs/REGRAS_PARTICIPANTE.md
   → regras canônicas de equipe, inscrição individual, ownership de Robot, responsáveis e inscrição do Robot

5. docs/CONTINUIDADE_FRONTEND.md
   → checkpoint vivo de gestao, landing-page e photo-gallery

6. gbsalermo/Rascomp/rascomp/docs/CONTINUIDADE.md
   → checkpoint vivo do backend
```

Estado oficial em 05/10/2026:

```text
ETAPAS 0–4    ✅ concluídas / validadas
V1-BETA A     ✅ concluída / validada — Landing pública
V1-BETA B     ⏭️ próxima — planejar identidade/e-mail + infraestrutura de produção
V1-BETA C     ⏳ cadastro/acesso/inscrições reais
V1-BETA D     ⏳ smoke + estabilização
```

O roadmap oficial é retomado depois da V1 Beta. Produção receberá apenas versões validadas em ambiente não-prod.

A ETAPA 1 foi concluída em 12/09/2026 após os cinco blocos funcionais e a validação integrada. O checkpoint final possui **111 testes verdes**, fluxos integrados com services/repositories reais e smoke do `testdata` contra MySQL + Flyway V12. A ETAPA 2 foi concluída/validada em 13/09/2026. A ETAPA 3 também está concluída/validada após integração, testes HTTP e validação prática dos perfis.

---

# 2. Hierarquia de autoridade

Quando houver divergência:

```text
ORDEM / ETAPA ATUAL
→ ETAPAS_POS_PROJETO.md

ARQUITETURA / DOMÍNIO / DECISÕES CROSS-REPO
→ DOSSIE_PROJETO_RASCOMP.md

REGRA COMPETITIVA APROVADA / INVARIANTE DE FLUXO
→ CONTRATO_REGRAS_COMPETITIVAS.md

ESTADO IMPLEMENTADO
→ código atual + migrations + testes

CHECKPOINT DE REPOSITÓRIO/SUBSISTEMA
→ CONTINUIDADE correspondente

DECISÃO ARQUITETURAL ESPECÍFICA
→ DECISAO_*.md

SNAPSHOT HISTÓRICO
→ serve apenas como contexto do momento em que foi escrito
```

O código atual prevalece sobre documentação histórica para afirmar o que realmente está implementado. Quando o código divergir de uma regra competitiva já aprovada no contrato, isso representa uma pendência de consistência a ser registrada e tratada explicitamente no roadmap; não altera automaticamente a regra nem o escopo da etapa atual.

---

# 3. Repositórios

```text
gbsalermo/Rascomp
└─ backend Java 21 / Spring Boot / MySQL / Flyway

gbsalermo/Rascomp-FRONT
├─ gestao/        → aplicação autenticada + portal participante
├─ landing-page/  → site público institucional/competitivo
└─ photo-gallery/ → protótipo separado de galeria
```

Identidade:

```text
RAS UFRB = organização
RRC      = evento/competição
RasComp  = plataforma de software
```

O backend é fonte de verdade de autorização, ownership e regras/resultados competitivos.

---

# 4. Documentos canônicos e vivos

## `ETAPAS_POS_PROJETO.md`

Planejamento único do ciclo. Define o estado das ETAPAS 0–16 e o trilho prioritário V1 Beta. As ETAPAS 0–4 e a V1-BETA A estão concluídas; o próximo trabalho é discutir e aprovar a V1-BETA B antes da implementação.

## `DOSSIE_PROJETO_RASCOMP.md`

Arquitetura e decisões cross-repo. Deve ser atualizado quando mudar uma responsabilidade, fluxo estrutural ou decisão de domínio.

## `CONTRATO_REGRAS_COMPETITIVAS.md`

Contrato funcional das regras competitivas aprovadas.

Serve para:

- guiar alterações do backend;
- orientar UX operacional do frontend;
- definir invariantes dos testes automatizados de fluxo;
- separar regra RoboCore de adaptação própria do RRC;
- servir de fonte para a futura central de Regras, Ajuda e Segurança da ETAPA 13.

Não é um segundo roadmap.

## `CONTINUIDADE_FRONTEND.md`

Checkpoint vivo deste repositório.

## Backend `rascomp/docs/CONTINUIDADE.md`

Checkpoint vivo do backend.

## Deploy

```text
DECISAO_DEPLOY_CLOUD.md
DEPLOY_CLOUDFLARE.md
```

Referências técnicas do primeiro deploy. Desde 03/10/2026, o primeiro go-live pertence ao TRILHO V1 BETA; ETAPA 16 representa consolidação final.

---

# 5. Referências específicas que permanecem úteis

## Landing/Galeria

```text
STATUS_LANDING_PAGE.md
→ snapshot visual da apresentação de 26/08/2026

CONTINUIDADE_LANDING_PAGE.md
→ histórico específico da Landing

CONTINUIDADE_GALERIA_FOTOS.md
→ histórico específico da galeria
```

Esses arquivos não definem roadmap.

## Gestão/Participante

```text
SYSTEM_DESIGN_GESTAO.md
→ referência arquitetural/UX; conferir contra código atual

ONBOARDING_PARTICIPANTE.md
EXPERIENCIA_PARTICIPANTE_COMPETICAO.md
→ referências para evolução do Portal do Participante
```

---

# 6. Decisões consolidadas

```text
Banco ativo                           MySQL
Migrations                            V1–V30 por evolução incremental
Próxima migration                     V31+
Roles atuais                          DEV | GESTAO | MIDIA | PARTICIPANTE
ETAPA 3                               ✅ concluída / validada
ETAPA 1                               ✅ contrato + correções + fluxos integrados concluídos
Follow                                3 tomadas × 3 tentativas
Ranking Follow                        menor (tempo + penalidades)
Inspeção Sumô                         decisão humana APTO/INAPTO
Robôs híbridos                        Auto/R/C e Follow compatíveis conforme classe física
Mini + 3 kg no mesmo robô/edição      bloqueado
Rounds Sumô                           3 regulares / 2 vitórias + extras justificados
Decisão do juiz                       vencedora + juiz + justificativa
Prorrogação inscrições                operação explícita
Cancelamento APROVADA                 solicitação analisada pela organização
Avisos + Telegram                     ETAPA 11
Telegram                              canal complementar ao IN_APP
Vínculo RasComp ↔ Telegram            não obrigatório inicialmente
Código de Registration no Telegram    opção futura/inicialmente opcional
Landing + Galeria                     Landing entra agora na V1-BETA A; ETAPA 9 será deduplicada/replanejada
Primeiro go-live                      TRILHO V1 BETA
Deploy/hardening definitivo           ETAPA 16 reinterpretada
```

Camunda não faz parte da arquitetura atual.

---

# 7. O que foi removido na revisão documental

Foram classificados como obsoletos documentos de preparação da demonstração, prompts auxiliares e referências antigas do backend que já conflitavam com a arquitetura/código atuais.

A intenção não é apagar decisões válidas: o estado consolidado foi preservado no roadmap, Dossiê Mestre e continuidades.

A limpeza técnica de `rascomp/bin/`, `.classpath/.project`, código morto, CSS e estrutura de packages foi tratada posteriormente na ETAPA 2, já concluída.

---

# 8. Protocolo para continuidade

```text
1. identificar a etapa atual no roadmap
2. ler o Dossiê Mestre
3. se a tarefa tocar competição, ler CONTRATO_REGRAS_COMPETITIVAS.md
4. ler a continuidade do repositório afetado
5. conferir código real
6. trabalhar somente na etapa autorizada pelo roadmap
7. regra de negócio → backend primeiro
8. atualizar testes
9. integrar frontend
10. validar
11. atualizar documentação se necessário
12. parar no checkpoint e aguardar validação
```

No estado atual, as **ETAPAS 0–3 estão encerradas/validadas**. A **ETAPA 4 — Consolidação funcional e polimento do MVP** está em andamento; os **BLOCOS 1, 2 e 3 estão concluídos/validados** e o **BLOCO 4 — Portal do Participante** está em andamento. O 4.1 (equipe/associação) e a base funcional do 4.2 (responsáveis por robô) estão implementados. O **4.3 — inscrição normal pelo Portal** também está implementado e aguarda validação manual. **Não iniciar 4.4 antes desse checkpoint.**

## Checkpoint pessoal opcional

`CHECKPOINT_ASSINATURA_PESSOAL.md`
→ acabamento autoral opcional, sem etapa própria; se adotado, é preparado no fechamento da ETAPA 15 antes do deploy final da ETAPA 16.


## Checkpoint Portal do Participante — 01/10/2026

Fonte específica do domínio:

```text
docs/REGRAS_PARTICIPANTE.md
```

Estado atual:

- V24: associação de equipe + responsáveis N:N;
- V25: inscrição individual + comprovantes separados;
- V26: `Robot.createdByUser`, auditoria de composição, histórico pessoal e troca de liderança;
- membro comum vê Robots pelos quais é responsável, mas só inicia/administra Registration de Robot que ele cadastrou;
- líder administra qualquer Robot da Team;
- **Minha inscrição** PENDENTE/APROVADA libera **Inscrever robô**;
- composição é automática, baseada em responsáveis + elegibilidade pessoal;
- ao menos um responsável APROVADO já permite aprovação do Robot;
- responsáveis PENDENTE não bloqueiam outro aprovado;
- mudanças antes da prova sincronizam automaticamente e geram aviso/veto auditável;
- responsabilidade/composição ficam bloqueadas durante competição iniciada;
- líder possui proteção contra rejeição definitiva sem correção ou transferência DEV;
- Robot sem elegíveis é rejeitado automaticamente e pode ser conscientemente reinscrito;
- bateria vigente: `VALIDACAO_ETAPA4_BLOCO4.md`.

```text
BLOCO 4.3 = implementação revisada / aguardando build + validação manual
BLOCO 4.4 = NÃO INICIADO
```


## Checkpoint pós-bateria manual — 03/10/2026

O BLOCO 4.3 teve a bateria 1–40 executada e recebeu correções focais de QA. A fonte funcional continua sendo `REGRAS_PARTICIPANTE.md`; a regressão curta R1–R15 está em `VALIDACAO_ETAPA4_BLOCO4.md`. Migrations atuais: V1–V27. O 4.4 ainda não foi iniciado.


## Fechamento ETAPA 4 — 03/10/2026

```text
ETAPA 4                 ✅ CONCLUÍDA / VALIDADA
Bateria Portal 1–40     ✅
Regressão R1–R17        ✅
Migrations              V1–V27
Próxima migration       V28+
```

Fonte funcional do Portal: `REGRAS_PARTICIPANTE.md`.

Histórico de validação: `VALIDACAO_ETAPA4_BLOCO4.md`.

O antigo BLOCO 4.4 foi retirado desta etapa. O polimento da Landing será consolidado futuramente com a entrega já prevista de Landing/Galeria; planejamento definitivo será feito após o merge da ETAPA 4.


## Fechamento formal da V1-BETA A — 05/10/2026

Status: **✅ CONCLUÍDA / VALIDADA / PRONTA PARA MERGE**

Escopo fechado:

- Landing institucional pública revisada e polida;
- responsividade desktop/tablet/mobile validada;
- Header, Hero, Sobre, Equipe, Robôs, Premiações, Galeria, Eventos e Footer;
- competição pública integrada ao ciclo real;
- ranking Follow, agenda/tomadas, chaveamento, BYE, 3º lugar e pódios;
- regra pública: histórico durante disputa e somente Top 3 após pódio completo;
- logos públicas de equipes com fallback;
- chave read-only no Portal do Participante;
- lotes de inscrição integrados e validados;
- Hero mostrando lote vigente real;
- documentação e regras sincronizadas;
- modo local preservado.

Pendência deliberadamente movida para o roadmap original:

- Hero pós-competição destacando campeões por categoria na etapa final de fechamento do MVP.

A branch `v1-beta-a-landing` não deve receber novos requisitos após o merge, salvo correção de regressão.

## Gate de planejamento antes da V1-BETA B

A B ainda **não está iniciada**. Antes do primeiro commit, discutir e aprovar:

```text
identidade real de conta
→ verificação de e-mail
→ ativação
→ login
→ recuperação segura de senha
```

Princípios já aceitos para discussão:

- coletar somente o mínimo necessário;
- posse do e-mail deve ser verificada;
- reduzir contas falsas/descartáveis sem introduzir coleta excessiva de dados pessoais;
- recuperação de senha deve funcionar por token/código de uso único, com expiração;
- resposta de recuperação não pode revelar se a conta existe;
- senha definitiva nunca deve ser visível ao DEV;
- fluxo assistido pelo DEV pode existir apenas como fallback auditado;
- escolher provedor de e-mail antes da implementação;
- acesso remoto de homologação deve estar disponível já no início da B, sem confundir isso com produção aberta;
- modo local e Cloudflare Tunnel permanecem como contingência oficial.
