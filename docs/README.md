# RasComp — Índice da Documentação

Última revisão: **04/09/2026**

Este é o ponto de entrada para qualquer pessoa ou IA que precise entender ou continuar o RasComp.

A documentação foi revisada para evitar roadmaps paralelos, snapshots de demonstração tratados como estado atual e referências históricas que já não correspondem ao código.

---

# 1. Ordem obrigatória de leitura

```text
1. docs/ETAPAS_POS_PROJETO.md
   → única fonte de verdade para ordem, etapa atual e critérios de saída

2. docs/DOSSIE_PROJETO_RASCOMP.md
   → arquitetura, domínio, decisões, riscos e mapa de alteração cross-repo

3. docs/CONTINUIDADE_FRONTEND.md
   → checkpoint vivo de gestao, landing-page e photo-gallery

4. gbsalermo/Rascomp/rascomp/docs/CONTINUIDADE.md
   → checkpoint vivo do backend
```

Estado oficial em 04/09/2026:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual — lógica e integridade
ETAPA 2+ ⏳ não iniciadas
```

O checkpoint documental de 04/09/2026 não altera a etapa atual.

---

# 2. Hierarquia de autoridade

Quando houver divergência:

```text
ORDEM / ETAPA ATUAL
→ ETAPAS_POS_PROJETO.md

ARQUITETURA / DOMÍNIO / DECISÕES CROSS-REPO
→ DOSSIE_PROJETO_RASCOMP.md

ESTADO IMPLEMENTADO
→ código atual + migrations + testes

CHECKPOINT DE REPOSITÓRIO/SUBSISTEMA
→ CONTINUIDADE correspondente

DECISÃO ARQUITETURAL ESPECÍFICA
→ DECISAO_*.md

SNAPSHOT HISTÓRICO
→ serve apenas como contexto do momento em que foi escrito
```

O código atual prevalece sobre documentação histórica para afirmar o que realmente está implementado.

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

Planejamento único do ciclo. Define ETAPAS 0–14 e marca a ETAPA 1 como atual.

## `DOSSIE_PROJETO_RASCOMP.md`

Arquitetura e decisões cross-repo. Deve ser atualizado quando mudar uma responsabilidade, fluxo estrutural ou decisão de domínio.

## `CONTINUIDADE_FRONTEND.md`

Checkpoint vivo deste repositório.

## Backend `rascomp/docs/CONTINUIDADE.md`

Checkpoint vivo do backend.

## Deploy

```text
DECISAO_DEPLOY_CLOUD.md
DEPLOY_CLOUDFLARE.md
```

Referências da ETAPA 14. Não significam que o deploy já começou.

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

# 6. Decisões consolidadas em 04/09/2026

```text
Banco ativo                           MySQL
Migrations                            V1–V7 imutáveis
Próxima migration                     V8+
Roles atuais                          ORGANIZACAO | PARTICIPANTE
Roles futuras                         DEV | GESTAO | MIDIA | PARTICIPANTE
Avisos + Telegram                     juntos na ETAPA 4
Telegram                              canal complementar ao IN_APP
Vínculo RasComp ↔ Telegram            não obrigatório inicialmente
Código de Registration no Telegram    opção futura/inicialmente opcional
Landing + Galeria                     decisão final na ETAPA 11
Deploy                                ETAPA 14
```

Camunda não faz parte da arquitetura atual.

---

# 7. O que foi removido na revisão documental

Foram classificados como obsoletos documentos de preparação da demonstração, prompts auxiliares e referências antigas do backend que já conflitavam com a arquitetura/código atuais.

A intenção não é apagar decisões válidas: o estado consolidado foi preservado no roadmap, Dossiê Mestre e continuidades.

A limpeza técnica de `rascomp/bin/`, `.classpath/.project`, código morto, CSS e estrutura de packages **não faz parte deste checkpoint documental**; permanece na ETAPA 2.

---

# 8. Protocolo para continuidade

```text
1. identificar a etapa atual no roadmap
2. ler o Dossiê Mestre
3. ler a continuidade do repositório afetado
4. conferir código real
5. trabalhar somente na etapa atual
6. regra de negócio → backend primeiro
7. atualizar testes
8. integrar frontend
9. validar
10. atualizar documentação se necessário
11. parar no checkpoint e aguardar validação
```

No estado atual, após esta revisão documental, o próximo trabalho é **retomar a ETAPA 1**.