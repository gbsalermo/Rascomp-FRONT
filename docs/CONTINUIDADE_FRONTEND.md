# Continuidade — RasComp Frontend

Última atualização: **07/09/2026**

Este arquivo registra o checkpoint funcional de `gestao/`, `landing-page/` e `photo-gallery/`. Não define roadmap próprio.

Fontes canônicas:

```text
docs/ETAPAS_POS_PROJETO.md
→ ordem e etapa atual

docs/DOSSIE_PROJETO_RASCOMP.md
→ arquitetura, domínio e decisões cross-repo

docs/CONTRATO_REGRAS_COMPETITIVAS.md
→ regras competitivas aprovadas e base dos testes da ETAPA 1

docs/README.md
→ índice e hierarquia documental
```

---

# 1. Situação atual

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual — lógica, integridade e testes de fluxo
ETAPA 2+ ⏳ não iniciadas
```

Checkpoint interno da ETAPA 1:

```text
Bloco 1 — Competition + Registration     ✅ CONCLUÍDO
Bloco 2 — Follow Line                    ✅ CONCLUÍDO
Bloco 3 — Sumô                           🚧 ATUAL
Bloco 4 — Chaves                         ⏳
Bloco 5 — Fluxos integrados completos    ⏳
```

Em 06/09/2026 o bloco `Competition + Registration` foi concluído no backend e refletido no frontend.

Entre 06 e 07/09/2026 o bloco **Follow Line** foi concluído, incluindo:

- perfil RRC `3 tomadas × 3 tentativas`;
- estados válidos de tentativa;
- cronômetro operacional por tentativa;
- entrada manual de tempo preservada;
- penalidade temporal configurável;
- ação operacional `Não parou`;
- cronômetro de apresentação;
- tomada perdida por ausência;
- ausência sem criação de tentativas fictícias;
- histórico auditável de ausências;
- checkpoints apenas informativos para ranking;
- progresso da prova considerando tentativas e ausências.

**A ETAPA 1 continua aberta. O bloco atual é Sumô.**

---

# 2. Aplicações

```text
gestao/
→ aplicação autenticada
→ operação da organização
→ portal do participante
→ futuras áreas DEV/MIDIA

landing-page/
→ site público institucional e competitivo
→ consome API pública

photo-gallery/
→ protótipo separado de galeria
→ conteúdo ainda estático
```

---

# 3. Checkpoint funcional conhecido

## Gestão

```text
Autenticação JWT                            ✅
Dashboard / shell                           ✅
Central da competição                       ✅
Transições de Competition protegidas        ✅
Prorrogação/reabertura de inscrições        ✅
Histórico da janela de inscrições           ✅
Inscrições                                  ✅
Solicitações de cancelamento APROVADA       ✅
Equipes / robôs / modalidades               ✅
Classe física das categorias de Sumô        ✅
Ativo/inativo                               ✅
Usuários                                    ✅
Follow Line                                 ✅ bloco competitivo alinhado
Histórico por tomadas                       ✅ tentativas + ausências
Operação da tomada                          ✅ cronômetros + penalidades
Sumô                                        ✅ base atual; Bloco 3 em alinhamento
Chave visual                                ✅ base atual
Arena da partida                            ✅ base atual
2 penalidades = derrota automática          ✅
Suicídio/WO                                 ✅
Histórico de chaves                         ✅
Fotos dos robôs                             ✅
404 personalizada                           ✅
```

## Follow — implementação consolidada

Ao escolher uma inscrição aprovada, a gestão abre a operação focada naquele robô/tomada.

A experiência atual suporta:

```text
foto/equipe/categoria
3 tomadas × 3 tentativas
cronômetro de tentativa
PARAR → preenche o tempo
ajuste manual de tempo
penalidade em segundos
NÃO PAROU → aplica penalidade padrão configurada
INVALIDAR
NÃO CONCLUIU
cronômetro de apresentação
tomada perdida por ausência
histórico/auditoria
```

Regras representadas pela UI, mas validadas pelo backend:

```text
concluída + válida + tempo      → classificável
concluída + inválida + tempo    → histórico, fora do ranking
não concluída + inválida        → sem tempo
```

A ausência encerra a tomada sem criar três tentativas artificiais.

O painel e o histórico consideram tomadas perdidas por ausência. O ranking continua sendo calculado pelo backend e checkpoints não influenciam a classificação.

Arquivos principais alterados no bloco:

```text
gestao/src/types.ts
→ ConfigFollow estendida + FollowTakeAbsence

gestao/src/api.ts
→ leitura/gravação de ausências do Follow

gestao/src/views/FollowRunView.vue
→ cronômetros, penalidade, ausência e operação da tomada

gestao/src/views/FollowView.vue
→ progresso considerando ausências

gestao/src/components/FollowTakeHistory.vue
→ auditoria de tentativas e tomadas perdidas por ausência
```

## Sumô — bloco atual

A base atual já possui:

```text
inspeções
configuração de rounds
partidas
rounds
2 penalidades = derrota automática
SUICIDIO_WO
progressão
BYE
```

O Bloco 3 deve alinhar a base ao contrato competitivo:

```text
inspeção humana APTO/INAPTO
peso apenas informativo
rounds extras apenas quando realmente necessários
justificativa obrigatória para round extra
decisão de juiz auditável
identificação de juiz
FALHA_INICIALIZACAO formalizada
motivos de resultado explícitos
```

## Robôs híbridos

O frontend não classifica o próprio `Robot` como Mini ou 3 kg. A metadata vem da categoria:

```text
Category.sumoPhysicalClass
├─ MINI_500G
└─ SUMO_3KG
```

`AdminCatalogView.vue` mostra a classe física e o backend continua sendo autoridade da compatibilidade.

## Participante

Primeira versão em `/minha-equipe` inclui:

- equipe;
- competidores;
- robôs/fotos;
- inscrições;
- Follow/histórico;
- acompanhamento de Sumô;
- cancelamento direto de inscrição `PENDENTE`;
- solicitação de cancelamento para inscrição `APROVADA`;
- indicação de solicitação pendente;
- reativação de inscrição `CANCELADA` quando permitida.

O portal ainda não é completo; conclusão geral permanece na ETAPA 10.

## Landing

```text
Landing institucional inicial          ✅
API pública competitiva                ✅
Competição ativa                       ✅
Follow público                          ✅
Sumô/chave público                      ✅
404 personalizada                      ✅
CMS/Mídia                              ⏳ ETAPA 7
Consolidação Landing/Galeria           ⏳ ETAPA 11
```

## Galeria

`photo-gallery/` continua protótipo separado. A decisão definitiva de absorção/manutenção independente pertence à ETAPA 11.

---

# 4. Qualidade conhecida

Checkpoint confirmado após o Bloco 2:

```text
Frontend Gestão     ✅ typecheck + build
Backend             ✅ 86 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V10  ✅
Profile testdata    ✅
```

A contagem vem do CI real. Não atualizar por inferência em checkpoints futuros.

A ETAPA 1 ainda deverá adicionar os testes automatizados de fluxo completo no Bloco 5.

---

# 5. Segurança

Modelo atual:

```text
ORGANIZACAO
PARTICIPANTE
```

ETAPA 3:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Ao evoluir, preferir capacidades semânticas na UI, mantendo autorização real no backend.

---

# 6. Arquivos-base da gestão

```text
gestao/src/main.ts
gestao/src/router.ts
gestao/src/store.ts
gestao/src/api.ts
gestao/src/types.ts
```

Telas centrais:

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

---

# 7. Regras de UX competitiva aprovadas

## Follow — implementado no Bloco 2

```text
INICIAR CRONÔMETRO
PARAR
SALVAR/AJUSTAR TEMPO
APLICAR PENALIDADE
MARCAR NÃO PAROU
INVALIDAR TENTATIVA
MARCAR NÃO CONCLUIU
CRONÔMETRO DE APRESENTAÇÃO
MARCAR TOMADA PERDIDA POR AUSÊNCIA
```

A fonte de verdade permanece no backend.

## Sumô — direção do Bloco 3

A UI não deve decidir inspeção física por cálculo de peso. A organização informa `APTO/INAPTO`.

Rounds extras só devem aparecer quando o backend permitir e devem exigir justificativa.

Decisão do juiz deve mostrar claramente:

```text
vencedor
juiz
justificativa
data/hora
```

## Chaveamento — Bloco 4

A UI deve distinguir:

```text
estrutura lógica da chave
≠
agenda real de execução/pista/horário
```

---

# 8. Dívida técnica reservada à ETAPA 2

- `api.ts` e `types.ts` centralizados;
- views grandes;
- CSS corretivo sobreposto;
- duplicações/componentes extraíveis;
- responsabilidade potencialmente duplicada da `photo-gallery`.

Não antecipar refatoração ampla durante a ETAPA 1.

---

# 9. Decisões futuras relevantes

## ETAPA 3 — permissões

Frontend refletirá `DEV | GESTAO | MIDIA | PARTICIPANTE`; backend permanece fonte de autorização.

## ETAPA 4 — Avisos IN_APP + Telegram

Roadmap canônico atual reúne os dois canais na mesma etapa:

```text
GESTAO/DEV
→ seleciona Competition
→ publica Aviso IN_APP
→ backend persiste
→ Telegram recebe a mesma comunicação quando habilitado
```

Regras:

- IN_APP é fonte de verdade;
- Telegram é canal complementar;
- frontend não chama Telegram diretamente;
- falha externa não invalida o aviso;
- vínculo individual Telegram não é obrigatório na primeira versão;
- futuro código competitivo da `Registration` pode ser reutilizado opcionalmente.

## ETAPA 5 — Ajustes Gerais

Área DEV-only com operações explícitas e auditáveis; nunca editor genérico de banco.

## ETAPA 7 — CMS/Mídia

Painel para conteúdo e mídia, reutilizando `ObjectStorageService`/R2.

## ETAPA 8 — Regras públicas

Derivar texto público do contrato competitivo, sem detalhes internos de implementação.

## ETAPA 9 — Futebol

Frontend vem após alteração real do domínio, pois `Registration.robot` é obrigatório hoje.

## ETAPA 10 — Participante completo

Completar os fluxos e criar identificador competitivo por `Registration` aprovada.

---

# 10. Landing e referências históricas

`docs/STATUS_LANDING_PAGE.md` permanece como snapshot visual, não como estado global.

`CONTINUIDADE_LANDING_PAGE.md` e `CONTINUIDADE_GALERIA_FOTOS.md` permanecem históricos específicos de subsistema.

Se algum documento histórico apresentar numeração diferente das etapas, prevalece `docs/ETAPAS_POS_PROJETO.md`.

---

# 11. Próximo passo

```text
Competition + Registration              ✅ CONCLUÍDO
        ↓
Follow                                  ✅ CONCLUÍDO
        ↓
Sumô                                    ← BLOCO ATUAL
        ↓
Chaves
        ↓
fluxos automatizados completos
```

Não iniciar ETAPA 2 sem conclusão e validação explícita da ETAPA 1.

---

# 12. Handoff

Outra IA deve:

```text
1. ler docs/README.md
2. conferir a etapa atual no roadmap
3. ler o Dossiê Mestre
4. ler CONTRATO_REGRAS_COMPETITIVAS.md antes de alterar competição
5. ler esta continuidade
6. conferir código real
7. permanecer na etapa atual
8. regra de negócio → backend primeiro
9. transformar regra em teste
10. atualizar documentação quando o estado realmente mudar
```
