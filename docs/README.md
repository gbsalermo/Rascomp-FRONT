# RasComp — Índice da Documentação

Última revisão: **31/08/2026**

Este arquivo é o ponto de entrada para qualquer pessoa ou IA que precise entender ou continuar o RasComp.

O objetivo é evitar um problema que já ocorreu na documentação histórica: diferentes arquivos registravam roadmaps de momentos diferentes do projeto. A partir desta revisão, cada documento possui uma responsabilidade clara.

---

# 1. Leia nesta ordem

## 1 — Planejamento e etapa atual

```text
docs/ETAPAS_POS_PROJETO.md
```

É a **única fonte canônica para ordem de execução, etapa atual e critério de conclusão**.

Estado em 31/08/2026:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual — correções de lógica e riscos
ETAPA 2+ ⏳ não iniciadas
```

Não avançar para a etapa seguinte sem validação explícita.

---

## 2 — Arquitetura, decisões e mapa do sistema

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

É a referência cross-repo para:

- visão do produto;
- backend, gestão, participante, Landing e galeria;
- responsabilidades de domínio;
- entidades e fluxos críticos;
- segurança atual e matriz futura;
- decisões já tomadas;
- riscos P0/P1/P2;
- decisões ainda abertas;
- guia "quero alterar X: onde mexo?".

O dossiê **não define uma segunda ordem de etapas**. Para sequência de trabalho, sempre voltar a `ETAPAS_POS_PROJETO.md`.

---

## 3 — Checkpoint do frontend

```text
docs/CONTINUIDADE_FRONTEND.md
```

Use para saber o que já existe em:

```text
gestao/
landing-page/
photo-gallery/
```

Este arquivo registra estado, não cria roadmap próprio.

---

## 4 — Checkpoint do backend

No repositório:

```text
gbsalermo/Rascomp
rascomp/docs/CONTINUIDADE.md
```

Use para verificar implementação, migrations, testes e pendências específicas do backend.

---

# 2. Hierarquia de autoridade

Quando documentos divergirem, aplicar esta ordem:

```text
ORDEM/ETAPA ATUAL
→ docs/ETAPAS_POS_PROJETO.md

ARQUITETURA/RESPONSABILIDADES/DECISÕES CROSS-REPO
→ docs/DOSSIE_PROJETO_RASCOMP.md

ESTADO REAL IMPLEMENTADO
→ código atual + testes + migrations + commits

CHECKPOINT DE UM SUBSISTEMA
→ arquivo CONTINUIDADE/STATUS correspondente

DECISÃO CONGELADA DE UM TEMA
→ arquivo DECISAO_*.md daquele tema

DOCUMENTOS DATADOS/HISTÓRICOS
→ contexto do momento em que foram escritos, nunca roadmap atual
```

Uma IA deve verificar o código antes de concluir que uma funcionalidade existe apenas porque um documento antigo a descreve.

---

# 3. Repositórios e aplicações

```text
gbsalermo/Rascomp
└─ backend Java / Spring Boot / MySQL / Flyway

gbsalermo/Rascomp-FRONT
├─ gestao/        → aplicação autenticada + portal participante
├─ landing-page/  → site público institucional/competitivo
└─ photo-gallery/ → protótipo separado de galeria
```

Identidade:

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

O backend é a fonte de verdade para autorização real, ownership e resultados competitivos.

---

# 4. Documentos canônicos e ativos

## `ETAPAS_POS_PROJETO.md`

**Tipo:** canônico / planejamento.

Define:

- ETAPAS 0–14;
- etapa atual;
- ordem congelada;
- critérios de saída;
- protocolo de continuidade.

Não duplicar esse roadmap em outros arquivos.

## `DOSSIE_PROJETO_RASCOMP.md`

**Tipo:** canônico / arquitetura e decisões.

Atualizar quando mudar:

- responsabilidade de domínio;
- arquitetura cross-repo;
- modelo de segurança;
- fluxo importante;
- regra estrutural;
- localização de código relevante.

## `CONTINUIDADE_FRONTEND.md`

**Tipo:** checkpoint vivo do frontend.

Atualizar após mudanças relevantes no frontend ou conclusão de checkpoint.

## Backend `rascomp/docs/CONTINUIDADE.md`

**Tipo:** checkpoint vivo do backend.

Atualizar junto com alterações relevantes no backend.

## `DECISAO_DEPLOY_CLOUD.md`

**Tipo:** decisão arquitetural congelada.

Registra a decisão de manter:

```text
LOCAL funcionando
+
CLOUD como configuração adicional
```

Não significa que o deploy já começou.

## `DEPLOY_CLOUDFLARE.md`

**Tipo:** guia futuro da ETAPA 14.

Só executar depois da bateria manual da ETAPA 13.

---

# 5. Documentação específica da Landing e galeria

## `STATUS_LANDING_PAGE.md`

**Tipo:** snapshot/checkpoint de subsistema.

Foi consolidado para a demonstração de **26/08/2026**. É útil para entender layout, paleta, janelas e estado da Landing naquele marco.

Não usar sua data como indicador do estado global do projeto.

## `CONTINUIDADE_LANDING_PAGE.md`

**Tipo:** histórico e continuidade específica da Landing.

Consultar quando uma etapa tocar a experiência pública.

## `CONTINUIDADE_GALERIA_FOTOS.md`

**Tipo:** histórico e continuidade específica da galeria.

A decisão futura de manter ou absorver `photo-gallery/` está na ETAPA 11 do roadmap canônico.

## `REVISAO_DEMO_LANDING_PAGE.md`

**Tipo:** revisão datada/histórica.

Serve para recuperar decisões tomadas durante a preparação da demonstração; não substitui o dossiê atual.

---

# 6. Documentação específica da Gestão e participante

## `SYSTEM_DESIGN_GESTAO.md`

**Tipo:** referência de design/arquitetura histórica da gestão.

Útil para compreender intenção de UX e estrutura. Confirmar sempre contra o código atual antes de implementar.

## `REVISAO_ADMIN_2026-08-25.md`

**Tipo:** snapshot datado.

Registra a revisão administrativa feita antes da apresentação.

## `ONBOARDING_PARTICIPANTE.md`

**Tipo:** referência de fluxo do participante.

Consultar principalmente na ETAPA 10.

## `EXPERIENCIA_PARTICIPANTE_COMPETICAO.md`

**Tipo:** referência de experiência/UX de competição.

Ajuda a manter coerência na evolução do Portal do Participante.

## `IMPLEMENTACAO_VUE_MVP.md`

**Tipo:** referência histórica de implementação.

Não assumir que seu estado representa a arquitetura atual sem conferir `gestao/`.

---

# 7. Documentação de apresentação

## `ORIENTACAO_DEMONSTRACAO_2026-08-26.md`

**Tipo:** histórico da apresentação aprovada.

Preservar como registro do que foi demonstrado e de como a apresentação foi conduzida.

## `EXEMPLO_PROMPT_DOSSIE_MESTRE.md`

**Tipo:** apoio/documentação de processo.

Não contém decisões de domínio com autoridade superior ao dossiê real.

---

# 8. Documentos do backend

No repositório `gbsalermo/Rascomp`, os documentos abaixo continuam úteis, mas possuem escopos diferentes.

## Vivos / integração

```text
README.md
rascomp/docs/CONTINUIDADE.md
rascomp/docs/ETAPAS_POS_PROJETO.md   → ponteiro para roadmap canônico
rascomp/docs/DOSSIE_PROJETO.md       → ponteiro para dossiê canônico
rascomp/docs/DECISAO_DEPLOY_CLOUD.md
rascomp/docs/DEPLOY_CLOUDFLARE.md
rascomp/docs/CLOUDFLARE_R2.md
```

## Referência técnica/histórica

```text
rascomp/docs/CONGELAMENTO_API.md
rascomp/docs/ENDPOINTS_INTERNOS.md
rascomp/docs/ENTIDADES_E_CRUDS.md
rascomp/docs/FLUXO_DO_SISTEMA.md
rascomp/docs/JSON_EXEMPLOS.md
rascomp/docs/POS_SWAGGER_MODALIDADES_E_CATEGORIAS.md
rascomp/docs/POS_SWAGGER_USUARIOS_EQUIPES_INSCRICAO.md
rascomp/docs/TESTES_POSTMAN.md
rascomp/docs/diagrama-uml-completo.puml
```

Esses arquivos registram decisões e contratos de fases anteriores. São úteis para contexto, mas uma IA deve comparar com:

```text
código atual
migrations atuais
testes atuais
Dossiê Mestre
```

antes de reutilizar um endpoint, entidade ou fluxo descrito neles.

---

# 9. Estado conhecido importante em 31/08/2026

```text
Projeto apresentado/aprovado                  ✅
ETAPA 0 — baseline                            ✅ validada
ETAPA 1 — correções de lógica                 🚧 atual
ETAPA 2 — limpeza técnica                     ⏳ não iniciada
Roles atuais no backend                       ORGANIZACAO | PARTICIPANTE
Roles futuras                                 DEV | GESTAO | MIDIA | PARTICIPANTE
Migrations atuais                             V1–V7
Próxima migration estrutural                  V8+
Backend — último checkpoint documentado       48 testes / 0 falhas / 0 erros
rascomp/bin/ ainda rastreado                   ⚠️ sim
Página 404 gestao + landing                    ✅ implementada em 30/08/2026
Deploy cloud                                   ⏳ planejado para ETAPA 14
Modo local                                     ✅ deve ser preservado
```

O número de testes é o **último checkpoint documentado**; não afirmar que continua igual após alterações futuras sem nova execução.

---

# 10. Decisões já congeladas que não devem ser rediscutidas sem motivo novo

- backend é fonte de verdade para regras competitivas e autorização;
- migration aplicada nunca é reescrita;
- nova migration estrutural começa em V8+;
- nova matriz futura é `DEV | GESTAO | MIDIA | PARTICIPANTE`;
- Ajustes Gerais DEV será baseado em operações de domínio específicas, não CRUD bruto/SQL;
- CMS deve reaproveitar `ObjectStorageService`/R2, sem terceiro mecanismo de upload;
- Futebol de Robôs não será implementado com robô fake para satisfazer FK;
- portabilidade inicial é uma instalação por instituição, não multi-tenant;
- local continuará funcional após o deploy cloud;
- Cloudflare D1 não é requisito do primeiro deploy;
- deploy é ETAPA 14, depois da bateria manual da ETAPA 13.

---

# 11. Decisões ainda abertas

Não inventar respostas para estas questões. Resolver na etapa apropriada:

## ETAPA 1 / competição

- política exata de cancelamento de Registration após aprovação/chave/início;
- estratégia final para correção de resultado que já gerou progressão;
- combinações válidas de tentativa Follow;
- impacto oficial dos checkpoints do Follow.

## Mídia/Regras

- política de publicação MIDIA vs DEV;
- exclusão física vs arquivamento de mídia;
- quem edita/publica Regras;
- escopo global ou por edição das Regras.

## Futebol

- equipe obrigatória ou não;
- atribuição dos robôs da organização;
- placar/tempo/empate/desempate;
- formato competitivo;
- inspeção e penalidades.

## Galeria

- aplicação independente ou incorporação definitiva à Landing; direção preferencial atual é incorporar, salvo necessidade real.

---

# 12. Protocolo de handoff para outra IA

Antes de alterar código:

```text
1. identificar a ETAPA atual em ETAPAS_POS_PROJETO.md
2. ler a seção correspondente no Dossiê Mestre
3. ler CONTINUIDADE do repositório afetado
4. consultar somente os documentos específicos relevantes
5. verificar o código real
6. verificar testes/migrations afetados
7. não avançar para outra etapa
```

Durante a implementação:

```text
regra de negócio → backend primeiro
backend → testes
contrato → frontend
frontend → typecheck/build
mudança estrutural → documentação
```

Ao encerrar:

```text
validar localmente
manter CI verde
atualizar continuidade/dossiê se necessário
registrar exatamente o que foi concluído
parar no checkpoint e aguardar validação
```

Nunca criar um novo roadmap apenas porque outro modelo de organização parece melhor. O planejamento oficial já existe.