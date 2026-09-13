# RasComp — Índice da Documentação

Última revisão: **13/09/2026**

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

4. docs/CONTINUIDADE_FRONTEND.md
   → checkpoint vivo de gestao, landing-page e photo-gallery

5. gbsalermo/Rascomp/rascomp/docs/CONTINUIDADE.md
   → checkpoint vivo do backend
```

Estado oficial em 13/09/2026:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  ✅ concluída / validada
ETAPA 2  ⏭️ próxima / não iniciada
ETAPA 3+ ⏳ não iniciadas
```

A ETAPA 1 foi concluída em 12/09/2026 após os cinco blocos funcionais e a validação integrada. O checkpoint final possui **111 testes verdes**, fluxos integrados com services/repositories reais e smoke do `testdata` contra MySQL + Flyway V12. A ETAPA 2 é a próxima, mas permanece não iniciada até autorização explícita.

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

Planejamento único do ciclo. Define ETAPAS 0–14, marca a ETAPA 1 como concluída e a ETAPA 2 como próxima/não iniciada.

## `DOSSIE_PROJETO_RASCOMP.md`

Arquitetura e decisões cross-repo. Deve ser atualizado quando mudar uma responsabilidade, fluxo estrutural ou decisão de domínio.

## `CONTRATO_REGRAS_COMPETITIVAS.md`

Contrato funcional das regras competitivas aprovadas.

Serve para:

- guiar alterações do backend;
- orientar UX operacional do frontend;
- definir invariantes dos testes automatizados de fluxo;
- separar regra RoboCore de adaptação própria do RRC;
- servir de fonte para o futuro regulamento público da ETAPA 8.

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

# 6. Decisões consolidadas

```text
Banco ativo                           MySQL
Migrations                            V1–V12 imutáveis
Próxima migration                     V13+
Roles atuais                          ORGANIZACAO | PARTICIPANTE
Roles futuras                         DEV | GESTAO | MIDIA | PARTICIPANTE
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

No estado atual, a **ETAPA 1 está encerrada**. O próximo trabalho é a **ETAPA 2 — Limpeza técnica e organização de código**, ainda não iniciada; ao abrir uma nova janela, confirmar o roadmap antes de começar.