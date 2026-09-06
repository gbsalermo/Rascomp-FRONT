# Continuidade — RasComp Frontend

Última atualização: **06/09/2026**

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

Em 04/09/2026 foi feito um checkpoint documental para remover material obsoleto, corrigir divergências e atualizar os documentos vivos.

Em 06/09/2026 foi criado `docs/CONTRATO_REGRAS_COMPETITIVAS.md`, consolidando as regras aprovadas de inscrições, Competition, Follow, Sumô, inspeção, rounds, juízes, chaves e integridade.

Também em 06/09/2026 o bloco **`Competition + Registration`** foi concluído no backend e refletido no frontend, incluindo:

- transições protegidas de Competition;
- `DESISTENTE`;
- cancelamento solicitado de inscrição aprovada;
- prorrogação/reabertura auditável;
- suporte ao conceito de robô híbrido por classe física de Sumô.

**A ETAPA 1 continua aberta.** O próximo bloco é Follow; depois permanecem Sumô, chaves e testes integrados.

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
Follow Line                                 ✅ base atual
Histórico por tomadas                       ✅
Operação da tomada                          ✅ base atual
Sumô                                        ✅ base atual
Chave visual                                ✅
Arena da partida                            ✅
2 penalidades = derrota automática          ✅
Suicídio/WO                                 ✅
Histórico de chaves                         ✅
Fotos dos robôs                             ✅
404 personalizada                           ✅
```

Na tela de competição, a organização possui uma operação explícita para:

```text
INSCRICOES_ABERTAS
→ Prorrogar inscrições

INSCRICOES_ENCERRADAS
→ Reabrir inscrições
```

O formulário exige nova data final e motivo. O histórico de alterações é exibido na própria operação. Em reabertura, a UI informa que o backend bloqueará a ação se já houver atividade competitiva e que uma chave atual ainda não utilizada será preservada no histórico e invalidada como atual.

Na tela de inscrições, solicitações de cancelamento aprovadas pelo participante aparecem em uma fila própria para a organização:

```text
motivo
solicitante/data
→ APROVAR
→ REJEITAR
```

## Robôs híbridos

O frontend não classifica o próprio `Robot` como Mini ou 3 kg. A nova metadata vem da categoria:

```text
Category.sumoPhysicalClass
├─ MINI_500G
└─ SUMO_3KG
```

`gestao/src/types.ts` expõe `SumoPhysicalClass` e `AdminCatalogView.vue` mostra a coluna **Classe física**:

```text
MINI_500G → Mini 500 g
SUMO_3KG  → Sumô 3 kg
FOLLOW    → —
```

A regra de compatibilidade é validada pelo backend; a UI apenas representa o contrato.

Ainda pendente na ETAPA 1:

```text
Follow
→ 3 tomadas × 3 tentativas como regra RRC
→ cronômetro operacional por tentativa
→ penalidades temporais claras
→ estado de tomada perdida por ausência
→ UX focada no robô/tomada

Sumô
→ inspeção humana APTO/INAPTO
→ rounds extras justificados
→ decisão/identificação de juiz
→ falha de inicialização

Chaves
→ agenda/pistas separadas da estrutura lógica
→ correção segura de resultado antes da dependência iniciar
→ bloqueio após dependência competitiva iniciada
```

## Participante

Primeira versão em `/minha-equipe` agora inclui:

- equipe;
- competidores;
- robôs/fotos;
- inscrições;
- Follow/histórico;
- acompanhamento de Sumô;
- cancelamento direto de inscrição `PENDENTE`;
- solicitação de cancelamento para inscrição `APROVADA` com motivo obrigatório;
- indicação de solicitação de cancelamento já pendente;
- reativação de inscrição `CANCELADA` quando o backend permitir.

Fluxo de cancelamento aprovado:

```text
APROVADA
→ participante solicita cancelamento
→ continua APROVADA enquanto aguarda
→ organização aprova/rejeita
```

O portal ainda não é completo; conclusão geral permanece na etapa prevista pelo roadmap.

## Landing

```text
Landing institucional inicial          ✅
API pública competitiva                ✅
Competição ativa                       ✅
Follow público                          ✅
Sumô/chave público                      ✅
404 personalizada                      ✅
CMS/Mídia                              ⏳ etapa futura
Consolidação Landing/Galeria           ⏳ etapa futura
```

## Galeria

`photo-gallery/` continua protótipo separado. Consultar o roadmap canônico para a etapa atual de consolidação Landing/Galeria.

---

# 4. Qualidade conhecida

Checkpoint atual confirmado em 06/09/2026:

```text
Frontend Gestão     ✅ typecheck + build
Backend             ✅ 73 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V9   ✅
Profile testdata    ✅
```

A contagem acima vem do CI real; não atualizar por inferência em checkpoints futuros.

A ETAPA 1 ainda deverá adicionar testes automatizados de fluxo que simulem competições completas, além dos testes unitários existentes.

---

# 5. Segurança

Modelo atual:

```text
ORGANIZACAO
PARTICIPANTE
```

Helpers atuais refletem `isOrganization` e `isParticipant`.

ETAPA 3:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Ao evoluir, preferir capacidades semânticas na UI, mas a autorização real continuará no backend.

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

Arquivos relevantes alterados no bloco `Competition + Registration`:

```text
gestao/src/types.ts
→ cancelamentos, histórico da janela e SumoPhysicalClass

gestao/src/api.ts
→ contratos HTTP de cancelamento, reativação e prorrogação

gestao/src/views/CompetitionsView.vue
→ prorrogação/reabertura + histórico

gestao/src/views/RegistrationsView.vue
→ fila de análise de cancelamentos

gestao/src/views/ParticipantView.vue
→ cancelar PENDENTE / solicitar APROVADA / reativar CANCELADA

gestao/src/views/AdminCatalogView.vue
→ exibe classe física das categorias Sumô
```

---

# 7. Regras de UX competitiva já aprovadas

Consultar o contrato para a regra completa. Direções de frontend já registradas:

## Follow

Ao escolher o robô que fará a tomada, abrir experiência focada naquele robô com:

```text
foto
equipe/categoria
tomada atual
3 tentativas
cronômetro
penalidades
tempo bruto/final
histórico
observações
```

Ações previstas:

```text
INICIAR
PARAR
SALVAR TEMPO
APLICAR PENALIDADE
MARCAR NÃO PAROU
INVALIDAR
MARCAR NÃO CONCLUIU
ENCERRAR TOMADA
```

## Sumô

A UI não calcula inspeção física. A organização informa `APTO/INAPTO`.

Rounds extras só aparecem quando o backend permitir e devem exigir justificativa. Decisão do juiz deve mostrar claramente vencedor, juiz e justificativa.

## Chaveamento

A UI deve distinguir:

```text
estrutura lógica da chave
≠
agenda real de execução/pista/horário
```

Assim uma partida pode ser adiada/adiantada operacionalmente sem reescrever a árvore.

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

Frontend reflete `DEV | GESTAO | MIDIA | PARTICIPANTE`; backend permanece fonte de autorização.

## ETAPA 4 — Avisos + Telegram

O trabalho será conjunto:

```text
GESTAO/DEV
→ seleciona competição
→ publica aviso
→ Aviso IN_APP persistido
→ Telegram recebe a mesma comunicação quando integração estiver habilitada
```

Decisões consolidadas:

- IN_APP é fonte de verdade;
- Telegram é canal complementar;
- frontend não chama Telegram diretamente;
- falha do Telegram não invalida o aviso;
- vínculo entre `UserAccount` e Telegram **não é obrigatório inicialmente**;
- futuro código competitivo da `Registration` pode identificar opcionalmente quem recebe avisos, sem bloquear a primeira versão.

## Ajustes Gerais futuros

Área DEV-only com operações explícitas e auditáveis; inclui futura possibilidade de rollback competitivo excepcional, não editor genérico de banco.

## CMS/Mídia futuro

Painel para `MediaAsset`, `ContentSlot` e `ContentItem`; Landing deixa de depender de commits para conteúdo comum.

## Regras públicas

O futuro regulamento público deve ser derivado de `CONTRATO_REGRAS_COMPETITIVAS.md`, removendo detalhes internos de implementação e preservando as regras que os competidores precisam conhecer.

## Futebol

Frontend vem após alteração real do domínio no backend, porque `Registration.robot` é obrigatório hoje.

## Participante completo

Completar fluxos e criar identificador competitivo por `Registration` aprovada na etapa prevista pelo roadmap.

---

# 10. Landing e referências históricas

`docs/STATUS_LANDING_PAGE.md` permanece como snapshot visual de 26/08/2026, não como estado global.

`CONTINUIDADE_LANDING_PAGE.md` e `CONTINUIDADE_GALERIA_FOTOS.md` permanecem como históricos específicos de subsistema.

Documentos de demonstração/MVP redundantes foram removidos no checkpoint documental de 04/09/2026 para evitar que fossem confundidos com documentação viva.

---

# 11. Próximo passo

```text
Competition + Registration              ✅ CONCLUÍDO
├─ cancelamento/prorrogação             ✅
└─ robôs híbridos / classe física       ✅
        ↓
Follow                                  ← PRÓXIMO
        ↓
Sumô
        ↓
Chaves
        ↓
testes automatizados de fluxo completo
```

Não iniciar ETAPA 2 sem confirmação explícita.

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
