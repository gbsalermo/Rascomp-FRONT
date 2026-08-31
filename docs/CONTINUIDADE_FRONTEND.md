# Continuidade — RasComp Frontend

Última atualização: **31/08/2026**

Este arquivo registra o **checkpoint funcional do frontend**. Ele não possui roadmap próprio.

Para ordem de execução e etapa atual:

```text
docs/ETAPAS_POS_PROJETO.md
```

Para arquitetura e decisões cross-repo:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

Para entender a hierarquia de toda a documentação:

```text
docs/README.md
```

---

# 1. Situação atual

O RasComp foi apresentado à equipe e aprovado. O ciclo atual é de estabilização e evolução controlada.

```text
RAS UFRB = organização
RRC      = evento/competição
RasComp  = plataforma
```

Estado oficial do ciclo:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual — correções de lógica e riscos
ETAPA 2+ ⏳ não iniciadas
```

**Não iniciar ETAPA 2 sem validação explícita da ETAPA 1.**

---

# 2. Aplicações neste repositório

```text
gestao/
→ aplicação autenticada
→ operação da organização
→ portal do participante
→ futuras áreas DEV e MIDIA

landing-page/
→ site público institucional RAS UFRB + RRC
→ consome API pública competitiva

photo-gallery/
→ protótipo público separado de galeria
→ ainda usa dados estáticos
```

---

# 3. Checkpoint funcional conhecido

## Gestão / organização

```text
Autenticação JWT                       ✅
Dashboard / shell                      ✅
Central da competição                  ✅
Inscrições                             ✅
Equipes / robôs / modalidades          ✅
Ativo/inativo                          ✅
Usuários                               ✅
Follow Line                            ✅
Histórico por tomadas                  ✅
Operação da tomada                     ✅
Sumô                                   ✅
Chave visual                           ✅
Arena da partida                       ✅
2 penalidades = derrota automática     ✅
Suicídio/WO                            ✅
Histórico de chaves                    ✅
Fotos dos robôs                        ✅
Página 404 personalizada               ✅ 30/08/2026
```

## Participante

Primeira versão funcional em:

```text
/minha-equipe
```

Inclui atualmente:

- equipe;
- competidores;
- robôs;
- foto principal/upload;
- inscrições;
- acompanhamento Follow;
- histórico de tomadas;
- acompanhamento de Sumô.

O portal ainda **não é considerado completo**. Sua finalização é ETAPA 10.

## Landing

```text
Landing institucional inicial          ✅
API pública competitiva                ✅ integrada
Competição ativa                       ✅
Follow público                          ✅
Sumô/chave público                      ✅
Página 404 personalizada               ✅ 30/08/2026
Conteúdo institucional via CMS         ⏳ ETAPA 7
Fotos/logos reais completos            ⏳ ETAPA 7
Consolidação final Landing/Galeria     ⏳ ETAPA 11
```

## Galeria

`photo-gallery/` continua como protótipo separado com conteúdo estático. A decisão final de incorporá-la à Landing ou mantê-la separada fica para ETAPA 11.

---

# 4. Qualidade — último checkpoint documentado

```text
Frontend Checks  ✅ typecheck + build
Backend          ✅ 48 testes / 0 falhas / 0 erros
Demo profile     ✅ MySQL + Flyway + testdata
```

Os 48 testes representam o **último checkpoint registrado**. Não atualizar o número por inferência; registrar nova contagem somente após execução real.

---

# 5. Segurança atual

O frontend ainda foi construído sobre o modelo legado:

```text
ORGANIZACAO
PARTICIPANTE
```

Helpers/fluxos atuais ainda refletem principalmente:

```text
isOrganization
isParticipant
```

A nova matriz:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

é **planejada para a ETAPA 3**, não implementada ainda.

Quando chegar a ETAPA 3, preferir também capacidades semânticas de UI, por exemplo:

```text
canManageCompetition
canOperateCompetition
canManageMedia
canUseDevTools
```

A autorização real continuará sendo responsabilidade do backend.

---

# 6. Arquivos-base da gestão

```text
gestao/src/main.ts
→ bootstrap + imports globais/CSS

gestao/src/router.ts
→ rotas e guards

gestao/src/store.ts
→ sessão + competição em foco

gestao/src/api.ts
→ cliente HTTP central atual

gestao/src/types.ts
→ contratos TypeScript centrais atuais
```

Telas principais:

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

# 7. Dívida técnica reservada para ETAPA 2

Não antecipar como refatoração ampla durante ETAPA 1, salvo correção mínima necessária.

Pontos já mapeados:

- `api.ts` e `types.ts` cresceram e devem ser separados por domínio gradualmente;
- `ParticipantView`, `SumoMatchView`, `FollowView`, `FollowRunView` e `CompetitionsView` são grandes;
- CSS acumulou folhas corretivas em sequência;
- existe duplicação e espaço para extração de componentes/composables;
- `photo-gallery` ainda duplica responsabilidade potencial da Landing.

Direção de organização está registrada no roadmap/dossiê.

---

# 8. Estado da Landing

Referência detalhada de layout e snapshot da apresentação:

```text
docs/STATUS_LANDING_PAGE.md
```

Importante: esse documento é um snapshot consolidado em 26/08/2026, não o roadmap global.

A Landing atual possui, entre outros:

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

Parte de textos, fotos e dados institucionais continua hardcoded/placeholder e será tratada na ETAPA 7 pelo CMS.

---

# 9. Decisões futuras que afetam o frontend

## ETAPA 3 — permissões

Frontend deve refletir `DEV | GESTAO | MIDIA | PARTICIPANTE`, mas não substituir segurança do backend.

## ETAPA 4 — avisos

Criar UX para publicação/leitura conforme role. Aviso IN_APP será fonte de verdade; Telegram é futuro canal complementar.

## ETAPA 5 — Ajustes Gerais

Área DEV-only com operações explícitas; não criar editor genérico de banco.

## ETAPA 7 — CMS/Mídia

Painel em `gestao/` para administrar:

```text
MediaAsset
ContentSlot
ContentItem
```

A Landing deverá consumir conteúdo publicado em vez de exigir commits para atualizações editoriais.

## ETAPA 8 — Regras

Cards/sections públicas, com edição conforme política que ainda será definida.

## ETAPA 9 — Futebol

Frontend só deve ser implementado depois da alteração de domínio no backend, pois `Registration.robot` é obrigatório hoje.

## ETAPA 10 — participante completo

Completar fluxo de equipe, integrantes, robôs, inscrições, avisos, histórico e identificação competitiva da `Registration`.

## ETAPA 11 — Landing/Galeria

Direção preferencial atual: absorver a galeria na Landing, salvo motivo real para manter app/deploy separado.

---

# 10. Página 404 — último ajuste visual relevante

Em **30/08/2026** foi adicionada uma experiência 404 personalizada em:

```text
gestao/src/views/NotFoundView.vue
landing-page/src/components/PublicNotFound.vue
landing-page/src/not-found.css
```

A Landing detecta rotas públicas desconhecidas e apresenta a tela 404; a gestão mantém o comportamento de retorno conforme autenticação.

Essa entrega é um ajuste de UX independente e **não significa que a ETAPA 1 foi concluída**.

---

# 11. Regras de continuidade

Quando outra IA assumir o frontend:

```text
1. ler docs/README.md
2. conferir a etapa atual em ETAPAS_POS_PROJETO.md
3. ler o Dossiê Mestre
4. usar este arquivo como checkpoint do frontend
5. conferir o código real antes de editar
6. não criar roadmap paralelo
7. não avançar de etapa sem validação
```

Se a tarefa alterar regra de negócio, implementar/validar a regra no backend antes de tratar o frontend como fonte oficial.

Ao concluir um checkpoint relevante, atualizar este arquivo sem duplicar a ordem do roadmap.