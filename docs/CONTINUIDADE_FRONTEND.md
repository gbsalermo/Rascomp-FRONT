# Continuidade — RasComp Frontend

Última atualização: **04/09/2026**

Este arquivo registra o checkpoint funcional de `gestao/`, `landing-page/` e `photo-gallery/`. Não define roadmap próprio.

Fontes canônicas:

```text
docs/ETAPAS_POS_PROJETO.md
→ ordem e etapa atual

docs/DOSSIE_PROJETO_RASCOMP.md
→ arquitetura, domínio e decisões cross-repo

docs/README.md
→ índice e hierarquia documental
```

---

# 1. Situação atual

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual — lógica e integridade
ETAPA 2+ ⏳ não iniciadas
```

Em 04/09/2026 foi feito um checkpoint documental para remover material obsoleto, corrigir divergências e atualizar os documentos vivos. **Não houve avanço de etapa nem alteração funcional do frontend.**

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
404 personalizada                      ✅
```

## Participante

Primeira versão em `/minha-equipe`:

- equipe;
- competidores;
- robôs/fotos;
- inscrições;
- Follow/histórico;
- acompanhamento de Sumô.

O portal ainda não é completo; conclusão na ETAPA 10.

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

`photo-gallery/` continua protótipo separado. A ETAPA 11 decide manutenção separada ou incorporação à Landing; direção preferencial atual é incorporar salvo necessidade real de deploy/URL independente.

---

# 4. Qualidade conhecida

Último checkpoint registrado:

```text
Frontend checks  ✅ typecheck + build
Backend          ✅ 48 testes / 0 falhas / 0 erros
Testdata         ✅ MySQL + Flyway
```

Não atualizar a contagem de testes por inferência.

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

---

# 7. Dívida técnica reservada à ETAPA 2

- `api.ts` e `types.ts` centralizados;
- views grandes;
- CSS corretivo sobreposto;
- duplicações/componentes extraíveis;
- responsabilidade potencialmente duplicada da `photo-gallery`.

Não antecipar refatoração ampla durante a ETAPA 1.

---

# 8. Decisões futuras relevantes

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

## ETAPA 5 — Ajustes Gerais

Área DEV-only com operações explícitas e auditáveis; não editor genérico de banco.

## ETAPA 7 — CMS/Mídia

Painel para `MediaAsset`, `ContentSlot` e `ContentItem`; Landing deixa de depender de commits para conteúdo comum.

## ETAPA 8 — Regras

Publicação de regras oficiais validadas.

## ETAPA 9 — Futebol

Frontend vem após alteração real do domínio no backend, porque `Registration.robot` é obrigatório hoje.

## ETAPA 10 — participante completo

Completar fluxos e criar identificador competitivo por `Registration` aprovada.

## ETAPA 11 — Landing/Galeria

Fechar consolidação pública.

---

# 9. Landing e referências históricas

`docs/STATUS_LANDING_PAGE.md` permanece como snapshot visual de 26/08/2026, não como estado global.

`CONTINUIDADE_LANDING_PAGE.md` e `CONTINUIDADE_GALERIA_FOTOS.md` permanecem como históricos específicos de subsistema.

Documentos de demonstração/MVP redundantes foram removidos no checkpoint documental de 04/09/2026 para evitar que fossem confundidos com documentação viva.

---

# 10. Próximo passo

Depois desta revisão documental:

```text
retomar ETAPA 1
→ corrigir riscos de Registration
→ estados de chave
→ integridade de MatchResult
→ regras válidas do Follow
→ testar e validar
```

Não iniciar ETAPA 2 sem confirmação explícita.

---

# 11. Handoff

Outra IA deve:

```text
1. ler docs/README.md
2. conferir a etapa atual no roadmap
3. ler o Dossiê Mestre
4. ler esta continuidade
5. conferir código real
6. permanecer na etapa atual
7. atualizar documentação somente quando o estado realmente mudar
```

Se a tarefa alterar regra de negócio, backend primeiro.