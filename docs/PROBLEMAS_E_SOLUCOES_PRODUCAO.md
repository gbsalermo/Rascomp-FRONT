# RasComp — Problemas e soluções em produção

Registro técnico incremental de incidentes observados no uso real. Separar **sintoma observado**, **hipótese técnica**, **alteração realizada** e **validação**, sem atribuir causas não demonstradas.

## Índice consolidado de ocorrências (14–18/10/2026)

Este histórico reúne **incidentes, sintomas, limitações da arquitetura e correções** surgidos na entrada em produção e na estabilização posterior à retirada da Galeria. Nem todo sintoma é causado pela Galeria; a retirada foi o **marco de mudança de prioridade**. Datas aproximadas quando não há timestamp de log. O estado “relatado como resolvido” não equivale a teste automatizado.

| ID | Ocorrência | Evidência / ação | Estado |
|---|---|---|---|
| P01 | Pressão de memória, queda e custo de servir Galeria no Render Free | retirada do escopo V1, planejamento R2/CDN | contenção adotada; métricas pendentes |
| P02 | Galeria e CMS: publicação, persistência e imagens estáticas divergentes | snapshots e `__editedSections`; revisão de renderização | correções parciais; migração pendente |
| P03 | Tela branca no mobile / Landing aguardando APIs | timeout e desacoplamento da renderização inicial | commits relatados; smoke mobile pendente |
| P04 | Landing mostra footer antes do hero | ordem de carregamento inicial | diagnóstico/validação final não documentados |
| P05 | Deploy frontend/backend dessincronizado e erro de build TypeScript | commits, publicação Cloudflare e ajustes de referência | incidentes tratados; validar versão efetiva |
| P06 | Login/inscrições: 401 e CORS | requisições entre app e API | observado; não confundir com falha de banco |
| P07 | Render Free: health timeout, reinícios e indisponibilidade | logs de instância; desacoplar health do Aiven, reduzir heap/pool | hotfix aplicado; estabilidade a monitorar |
| P08 | Listagem de participantes lenta/indisponível, N+1 provável | GET 8,36 s; outra tentativa cancelada em 15,04 s | correção em lote; usuário relatou melhora |
| P09 | Conexões MySQL e abortos de cliente | `ClientAbortException`, `Broken pipe`, conexões repetidas | evidência observada; causalidade aberta |
| P10 | Dashboard e login lentos/intermitentes | relatos durante operação real | investigação adicional pendente |
| P11 | Atualização total de telas após ações pontuais | política de atualização granular documentada | otimização aplicada; regressão a verificar |
| P12 | Filtros da Gestão de participantes ausentes após publicação | filtro de inscrições de robôs permaneceu | correção solicitada; confirmar deploy |
| P13 | Participante associado a 5–10 robôs amplia trabalho das consultas | relato e suspeita de expansão de relacionamentos | hipótese a medir |
| P14 | Inscrição em várias categorias / Futebol sem robô | revisão de elegibilidade e fluxo | comportamento funcional a validar |
| P15 | Aprovação administrativa cria alteração de responsáveis como se fosse usuário | inconsistência de autoria/auditoria relatada | pendente de verificação |
| P16 | Rolagem horizontal da Gestão / Inscrições no mobile | remoção de colunas fixas e contenção CSS | commitado; validação visual pendente |
| P17 | Operação local como contingência e backup consistente | Docker/Tunnel, Aiven/R2, segredos e rollback | planejamento/ensaio pendentes |
| P18 | Primeiro carregamento do Dashboard / Inscrições falha e exige F5 | relato 21/10; verificar o fluxo inicial **após** as correções de 17/10 | aberto; causa raiz e requisição falhada não identificadas |

### P02 — Publicação da mídia e divergência entre CMS e Landing

**Observado:** mudanças de fotos, ordem e enquadramento deveriam persistir, mas a interface chegou a exibir mensagem antiga de rascunho sem publicação; em outra ocasião, a Landing ignorava dados existentes no JSON público e mostrava conteúdo estático. Havia snapshot com imagens e posições, mas faltava a marca `__editedSections`.

**Tratamento registrado:** adaptação do frontend para reconhecer snapshots antigos; separação entre prévia, publicação e acervo da Galeria. **Limite:** não afirmar que toda a cadeia de publicação foi validada depois.

### P03–P04 — Renderização inicial da Landing

**Observado:** tela branca em Android ao abrir a Landing; em outra situação, o footer aparecia antes da intro/hero. O carregamento de conteúdo institucional estava condicionado a consultas remotas de mídia e identidade.

**Tratamento registrado:** timeout de 2 segundos para a consulta de mídia e desacoplamento do render inicial das APIs (commits citados em acompanhamento: `4632a76` e `6f9ced4`). A causa exata do footer inicial e a validação final no aparelho devem ser verificadas separadamente.

### P05–P07 — Publicação, autenticação e limites do Render

**Observado:** versões de frontend e backend publicadas em momentos distintos, build da Gestão com TS2339 em `ParticipantView.vue`, referência JavaScript durante inicialização de watcher, respostas 401/CORS nas inscrições e logs Render `Instance failed` com timeout de health check de 5 s.

**Tratamento registrado:** correções pontuais de compilação/inicialização e hotfix no backend (`ba819a8`) para tornar health check menos dependente do Aiven e reduzir parâmetros de heap/pool. **Importante:** 401, CORS, reinício e erro de build são problemas distintos; não atribuir todos a memória nem garantir que cada commit estava efetivamente publicado.

### P08–P10 e P13 — Consultas, latência e banco

**Observado:** endpoint `/api/v1/inscricoes-participantes/por-competicao?competitionId=3` demorou **8,36 s** em uma chamada e outra foi cancelada após **15,04 s**. Houve `ClientAbortException`/`Broken pipe` e novas conexões MySQL repetidas. Usuário relatou dashboard e login lentos/intermitentes, embora o volume fosse da ordem de apenas ~20 inscritos. Um competidor associado a 5–10 robôs pode multiplicar trabalho de montagem de DTOs.

**Diagnóstico:** N+1/expansão de relacionamentos foi apontado como **hipótese técnica**, não medição de query plan. O filtro de status no frontend não explica sozinho a lentidão do endpoint.

**Tratamento e resultado:** implementação de busca em lote no backend; após atualização, o usuário relatou que a listagem voltou a funcionar e recarregava mais rápido. **Pendente:** perfilamento de queries, contagem por request, p95, pool, carga concorrente e dashboard/login.

### P11–P12 — Excesso de requisições e regressões de interface

**Observado:** aprovar, manter ou vetar uma única linha fazia páginas inteiras recarregarem, inclusive em Gestão e Portal; filtros de inscrições de participantes deixaram de aparecer em uma publicação.

**Tratamento:** atualização pontual do item afetado, refresh apenas das seções dependentes, preservação de dados enquanto revalida e deduplicação de requisições por ciclo; detalhes em `docs/OTIMIZACAO_CARREGAMENTO_PORTAIS_2026-10-17.md`. O filtro deve ser conferido em produção e a ausência não pode ser confundida com falha da API.

### P14–P15 — Regras e auditoria expostas pelo uso real

**Observado:** dúvidas e possíveis regressões sobre inscrição do mesmo robô em categorias distintas, disponibilidade contínua do Futebol para quem ainda não se inscreveu nele, e alteração de responsáveis registrada após aprovação pela Gestão como se tivesse sido feita pelo participante.

**Situação:** tratar como **verificação funcional/auditoria**, não como correção já concluída. A aprovação administrativa não deve criar falsamente uma alteração solicitada pelo participante.

### P17 — Contingência e recuperação

**Limitação identificada:** depender exclusivamente da instância Render Free não atende à necessidade de continuidade durante a competição. Foi discutido rodar backend local em Docker e expor API por Tunnel, sem dois serviços escrevendo simultaneamente no mesmo banco. Antes da execução, guardar segredos e variáveis de ambiente em local seguro; planejar backup consistente de Aiven, R2 e restauração isolada.

**Estado:** estratégia definida em linhas gerais; não confundir com failover ou restore comprovados.

### P18 — 21/10/2026 — Pri### P18 — 21/10/2026 — Primeira entrada exige atualizar dashboard/inscrições

**Relato:** na primeira entrada, o dashboard ou a Gestão / Inscrições às vezes informa que não conseguiu carregar os dados; atualizar o navegador novamente funciona. A página continua operacional, sem a queda generalizada dos incidentes anteriores. Ainda não há captura do Network ou logs do exato momento da falha.

**Histórico que deve ser considerado antes de investigar:**
- **16–17/10:** retirada da Galeria independente e redução de pressão do backend como medida de contenção para o MVP. Não ressuscitar a hipótese da Galeria como causa atual sem evidência.
- **17/10 — `ba819a8`:** hotfix do Render isolou o health do banco, reduziu heap e pool Hikari. O estado atual é `management.health.db.enabled=false`; portanto resposta `UP` não atesta conexão com Aiven. Este estado atual prevalece sobre trechos do roadmap de 12/10 que registravam `management.health.db.enabled=true`.
- **17/10 — `394bc2f`:** timeouts de conexão Hikari com Aiven restaurados para 30 s / validação 5 s; não propor novamente alterar isso sem motivo medido.
- **17/10 — `57dc00f`:** atualização pontual substituiu recargas completas após operações administrativas e no Portal; a política **autoriza** carga completa na entrada e ao trocar de competição, não indiscriminadamente após cada ação.
- **17/10 — `105119b`:** Gestão / Inscrições já usa `Promise.allSettled`, preserva seções bem-sucedidas e deduplica `load()` por competição enquanto pendente. Não recomendar implementar novamente essas mesmas proteções.
- **17/10 — `ba48c10`:** a consulta de inscrições de participantes foi otimizada com buscas em lote e houve confirmação de melhora perceptível após o deploy. Não tratar N+1 anterior como causa persistente já confirmada.
- **Disponibilidade:** histórico registra Worker `rascomp-automation` e discussão posterior sobre manter ativo 24 h. A cadência efetivamente publicada no Worker não foi verificada pelo repositório atual; não afirmar que o Render está dormindo ou acordado com base somente nos documentos antigos.

**Observações de código que permanecem para checagem, não diagnóstico causal:** `gestao/src/api/http.ts` usa timeout Axios de 15 s; `DashboardView.vue` usa `Promise.all` com cinco leituras e falha em bloco se uma rejeitar; `RegistrationsView.vue` possui proteção parcial e mensagem para atualização manual; `ShellLayout.vue` e a página podem iniciar consultas de contexto da competição em paralelo, e a store não compartilha explicitamente uma promise em voo. São características do código, não prova de que tenham causado o incidente relatado.

**Próxima investigação antes de qualquer correção:** coletar o endpoint, status HTTP/código Axios, duração e momento da primeira falha (logo após login, primeira navegação, tempo ocioso), correlacionar com logs Render e Aiven e confirmar cron real do Worker, sem dados pessoais/tokens. Comparar com a segunda tentativa e com as requisições disparadas pelo shell. Só então escolher alteração mínima, respeitando MVP congelado, correções já aplicadas, teste e validação antes de produção.

**Situação:** em investigação, nenhuma alteração funcional implementada por este registro.

 próximo da competição

Memória e reinícios Render; duração de login/dashboard/inscrições (p50/p95); quantidade de consultas SQL por endpoint; conexões/pool; tempo de carregamento mobile; tamanho de imagens e transferência via API/CDN; concorrência real; taxas de erro; antes/depois das otimizações. Registrar capturas com data, ambiente, commit e método de medição, sem expor dados pessoais.

---

## 2026-10-14 a 2026-10-17 — Galeria, consumo de recursos e redefinição do MVP

**Sintomas relatados em produção:** após disponibilização da Galeria, foram percebidos problemas de desempenho e pressão de memória no serviço Render Free, incluindo episódio de indisponibilidade associado ao esgotamento de memória. O usuário observou diferença relevante de desempenho com e sem a Galeria; ainda não há medições instrumentadas comparáveis registradas neste histórico.

**Contexto técnico:** Render Free com memória limitada; o plano de mídia documenta que servir imagens integralmente pelo backend pode gerar carga desnecessária, e recomenda entrega direta por R2/CDN, miniaturas sob demanda e redução de preloads. Esses são fatores de risco documentados, não prova isolada da causa do incidente.

**Decisões e medidas registradas:** priorizar a estabilidade da competição; retirar a Galeria independente do escopo do MVP V1 e adiá-la para V2.0; preservar a prévia institucional na Landing; ocultar acessos à Galeria completa e à gestão de álbuns; planejar arquitetura separada para a Galeria, com distribuição de mídia por R2/CDN e sem transferência pesada pelo backend de inscrições. Não adicionar novas funcionalidades ao MVP antes da competição; focar correções e operação.

**Referências:** `docs/PLANO_MIGRACAO_MIDIA_R2_CDN.md` (decisão de 15/10/2026) e `docs/ETAPAS_POS_PROJETO.md`.

**Resultado/limitações:** o usuário relatou melhora de desempenho ao operar sem a Galeria, mas não há valores de memória, latência, throughput ou concorrência registrados. A implementação da Galeria V2.0 permanece futura. Não afirmar que a migração de arquitetura foi executada.

**Lição aprendida:** em infraestrutura limitada, funcionalidades de mídia podem competir com os recursos do fluxo crítico de inscrições; separar conteúdo pesado e limitar escopo protege a disponibilidade do MVP.

---

## 2026-10-18 — Gestão / Inscrições: tabela inacessível no mobile

**Ambiente:** interface web da Gestão, tela Inscrições, navegador mobile (captura fornecida pelo usuário).

**Sintoma observado:** a tabela exibia principalmente as colunas finais de status e ações, enquanto a barra horizontal parecia estar no início. Informações das colunas anteriores ficavam inacessíveis ou difíceis de alcançar. A captura mostra status APROVADA/REJEITADA e a ação Trocar líder, mas não as informações de identificação à esquerda.

**Diagnóstico provável:** as colunas de ações com `fixed="right"` no componente `el-table` do Element Plus criavam uma camada fixa que, em viewport estreita, podia cobrir grande parte do conteúdo. A largura/overflow dos containers também precisava ser contida. A captura, isoladamente, não comprova a causa exata do deslocamento da barra.

**Correção implementada (frontend):**
- Removido `fixed="right"` de quatro colunas de ações nas tabelas da página.
- Aplicado `min-width: 0; max-width: 100%` à página e aos cards de tabelas, com `overflow: hidden` nos cards.
- Limitada a largura de `el-table` ao container.
- Aplicado `overscroll-behavior-x: contain` aos wrappers de rolagem do Element Plus.

**Arquivo:** `gestao/src/views/RegistrationsView.vue`.

**Commit:** [a0c08ce](https://github.com/gbsalermo/Rascomp-FRONT/commit/a0c08cebef47b46ef6e7ee6333a3e952713cd539), aplicado diretamente à `main`.

**Escopo e impacto esperado:** somente apresentação e rolagem das tabelas. Nenhuma mudança no backend, banco, regras competitivas ou chamadas à API. As ações deixam de permanecer fixas na borda direita e passam a acompanhar a tabela.

**Validação:** correção commitada; confirmação visual e testes em dispositivos reais ainda não registrados neste documento. Verificar em celular pequeno e desktop se a primeira coluna aparece ao iniciar, se é possível percorrer todas as colunas, se botões continuam acessíveis e se filtros/ações funcionam. A alternativa de cards mobile **não** foi implementada.

**Lição aprendida:** colunas fixas em tabelas administrativas largas precisam ser avaliadas em viewports estreitas; priorizar acesso a todas as informações e regressão mínima durante a estabilização do MVP.
