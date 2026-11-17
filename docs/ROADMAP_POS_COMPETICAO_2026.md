# RasComp — Roadmap Pós-Competição (V1.1 → V2.0)

> **Criado em:** 17/11/2026  
> **Situação:** PROPOSTO PARA MODELAGEM E VALIDAÇÃO. Nenhuma etapa funcional está autorizada por esta publicação documental.  
> **Repos envolvidos:** [Rascomp — Backend](https://github.com/gbsalermo/Rascomp) e [Rascomp-FRONT](https://github.com/gbsalermo/Rascomp-FRONT).  
> **Origem:** relato da operação real da competição de 2026, incidentes em produção, planejamento e contratos já existentes.  
> **Compatibilidade documental:** preserva o roadmap e histórico anteriores em `docs/ETAPAS_POS_PROJETO.md`. Este arquivo passa a orientar o **novo ciclo pós-competição**, sem sobrescrever o histórico da V1.

## 1. Propósito e divisão em ciclos

**Objetivo:** sair de um MVP utilizado em competição real para uma plataforma reutilizável, compreensível e confiável para participantes, organização, operadores, juízes e público.

- **V1.1 — refinamento operacional:** experiência mobile-first, ergonomia, integridade competitiva, reversões auditadas, inscrições, Agenda/check-in, relatórios, comunicação, desempenho, operação local e governança de releases.
- **V2.0 — expansão funcional:** operação completa do Futebol, Galeria independente, CMS avançado, portabilidade institucional e demais demandas aprovadas posteriormente.

Não antecipar novas funcionalidades em prejuízo de problemas críticos da experiência e de integridade do produto.

### Critérios de prioridade e de situação

- **P0:** bloqueio de operação, integridade de resultados/dados, segurança ou experiência que impossibilita tarefa crítica.
- **P1:** atrito significativo na execução real, controle ou acompanhamento.
- **P2:** melhoria de qualidade/fluxo que não bloqueia a próxima competição.
- **P3:** expansão condicionada a demanda ou viabilidade.
- **PROPOSTO / EM DIAGNÓSTICO / MODELAGEM APROVADA / EM IMPLEMENTAÇÃO / EM VALIDAÇÃO / CONCLUÍDO**; um incidente histórico também pode ser **CORRIGIDO — RETESTE PENDENTE** ou **NÃO REPRODUZIDO**. Não transformar sintomas antigos em bugs vigentes sem reproduzir.

## 2. Método por etapa — espelhando o SGL

Cada etapa deverá ter um documento próprio (`docs/pos-competicao/ETAPA_NN_*.md`, quando iniciada), contendo:

1. **Situação de partida:** estado do código, incidentes, feedback do evento, funcionalidades já presentes e evidências.
2. **Discussão de requisitos:** objetivo, usuários afetados, casos normais/excepcionais, limites do escopo e escolhas a aprovar com o responsável.
3. **Modelagem antes do código:** jornadas, wireframes quando úteis, estados, fluxos, permissões, entidades, relacionamentos, API/DTO, migrations, auditoria e dependências entre backend/frontend.
4. **Plano de execução:** arquivos e componentes afetados, fases pequenas, compatibilidade, risco e estratégia de reversão.
5. **Implementação isolada:** branch/PR próprio, alterações revisáveis, sem modificar produção automaticamente.
6. **Testes:** automatizados, integração, dados, autorização, regressão, mobile físico, cloud/local quando aplicável.
7. **Validação explícita do responsável:** corrigir observações antes de considerar a etapa concluída.
8. **Fechamento:** atualizar documentação e checklist, registrar versão/PRs/evidências e só então abrir a próxima etapa.

**Gate universal:** não começar implementação estrutural sem aprovar a modelagem; não chamar implementação de etapa validada. P0 de dados/segurança pode interromper o planejamento e receber hotfix testado, mas não dispensa histórico e release controlado.

## 3. Sequência lógica do novo ciclo

| Etapa | Nome | Resultado esperado | Prioridade |
|---|---|---|---|
| **0** | Baseline pós-competição e governança | Estado real documentado, dados protegidos, backlog e decisões-base | P0 |
| **1** | Experiência e responsividade | Gestão/Portal realmente operáveis em mobile/tablet, com desktop preservado | P0 |
| **2** | Correções excepcionais e auditoria | Reversões explícitas, autorizadas e consistentes | P0 |
| **3** | Sumô, Follow, chaves e juízes | Provas mais fáceis de lançar e acompanhar | P1 |
| **4** | Cadastro e inscrições | Fluxo intuitivo, especialmente para múltiplos robôs | P1 |
| **5** | Agenda, check-in e relatórios | Coordenação operacional integrada e dados confiáveis | P1 |
| **6** | Portal, Landing, manuais e comunicação | Jornada institucional/competitiva coesa; avisos e Telegram | P1/P2 |
| **7** | Revisão da API, infraestrutura e releases | Endpoints e contingência revisados; pipeline por tag pronto | P0/P1, transversal |
| **8** | Homologação e lançamento V1.1 | Ciclo completo validado e lançado exclusivamente por tag | P0 |
| **9** | Expansões modulares V2.0 | Features adiadas com modelagem específica | P2/P3 |

**Nota sobre a ordem:** backups, configuração local, segurança básica, confiabilidade e governança de deploy são trilhas transversais desde a Etapa 0; não aguardam a Etapa 7 caso exista risco P0. Demais etapas têm ordem sugerida e podem ser detalhadas sem implementar prematuramente.

### Etapa 0 — Diagnóstico, baseline, proteção e decisões iniciais

- Fixar referências dos commits atuais dos dois repositórios, deployments vigentes, migrations e CI.
- Inventariar jornadas e dificuldades reais da competição; classificar sintomas, correções e validações pendentes, sem duplicar incidentes históricos.
- Registrar métricas e evidências agregadas reais (quando existentes), preservando privacidade, comprovantes, dados de pessoas e segredos.
- Construir matriz de testes real em mobile (320/360/390px), tablet, notebook, desktop; incluir toque e acessibilidade.
- Verificar backups do banco e arquivos R2, restauração isolada e configuração funcional de ambiente local; falhas críticas bloqueiam releases.
- Aprovar a **política de release por tags** da seção 5 antes de mudar a infraestrutura.
- Definir critérios mensuráveis: concluir tarefas sem scroll inacessível, tempo/retrabalho em inscrições, respostas de API, integridade da operação.
- **Saída:** inventário, matriz de riscos, backlog verificado, baseline e política de release aprovados.

### Etapa 1 — Experiência e responsividade operacional

**Problema observado:** experiência mobile quase inutilizável para chaves, menus e lançamento de dados.

- Rever navegação Gestão/Portal, sidebar, menus, filtros, tabelas, formulários, modais, estados vazios e feedback.
- Projetar uso de Sumô/Follow em celulares/tablets: inserir round/tentativa/penalidade/resultado sem ações cortadas ou scroll impeditivo.
- Facilitar visualização de chave extensa, rodada ativa, alternância entre participantes e operação.
- Decidir cards vs tabelas, drawer vs abas, comandos críticos fixos, modo consulta vs modo operação e comportamento responsivo.
- Validar acessibilidade, navegação por teclado, tamanhos de toque e preferência por movimento reduzido.
- **Modelagem:** jornadas reais, matriz de telas/estados, wireframes mobile-first e desktop.
- **Aceite:** as tarefas críticas são executáveis em aparelhos físicos sem zoom obrigatório, informação inalcançável ou botões ocultos; desktop continua funcional.

### Etapa 2 — Reversibilidade de resultados, tomadas e decisões

**Problema observado:** lançamentos equivocados de tomada, punição, round ou resultado são difíceis/impossíveis de corrigir com permissão.

- Catalogar tipos de correção de Follow, Sumô, inscrições/decisões e seus impactos.
- Distinguir quem arbitrou de quem lançou os dados; mapear DEV/GESTAO/operador/juiz e ações permitidas.
- Preservar histórico: valores antes/depois, autor, data/hora, justificativa, dependências, consequências e auditoria.
- Resultado com próxima partida ainda não iniciada: avaliar recálculo transacional consistente previsto no contrato atual.
- Próxima partida já iniciada: **nunca fazer rollback silencioso em cascata**; fluxo excepcional com impacto explícito, autorização e integridade garantida.
- Definir operação de compensação vs edição excepcional, conflitos concorrentes e idempotência.
- **Modelagem:** diagramas de estados, eventos de correção, permissões, APIs e testes de dependência da chave.
- **Aceite:** retificação segura de caso simples, veto a correção perigosa, histórico completo e classificação/ranking coerentes.

### Etapa 3 — Refinamento competitivo: Sumô, Follow, chaves e juízes

- Destacar rodada/confronto ativo e reduzir espaço consumido por chaves concluídas; avaliar animação sutil ao avançar e modo projetor.
- Validar Winners, Losers, Final Geral, Reset, BYEs, estado da chave e progressão em dupla eliminação.
- Tornar a operação de Follow e Sumô mais enxuta, clara e orientada a partida/tomada vigente.
- **Juízes:** já existe `CompetitionJudge` vinculado à competição e `MatchJudgeDecision`; **não recriar o cadastro**. Modelar atribuição de juiz à partida (quando necessária), juiz responsável vs usuário lançador, permissões e histórico.
- Avaliar visualização pública separada da edição operacional.
- **Modelagem:** atribuição juiz↔partida e cardinalidade; estados de chaves, telas e regras de publicação.
- **Aceite:** acompanhamento fluido sem pular inesperadamente a tela, autoria auditável e resultados íntegros.

### Etapa 4 — Cadastro e inscrição de participantes/robôs

**Problema observado:** cadastrar e inscrever diversos robôs é repetitivo e pouco intuitivo para iniciantes.

- Distinguir conta, equipe, robô, responsáveis, inscrição e modalidade com explicações e passos orientados.
- Propor assistente de inscrição e reaproveitamento seguro de dados comuns entre robôs, sem criar inscrições duplicadas.
- Rever inscrição em múltiplas categorias, elegibilidade, Futebol sem robô próprio, correção de comprovantes, reativação e aprovações.
- Avaliar upload de ficha técnica/modelo de robô como requisito **a confirmar**, não presumir concluído nem aprovado.
- **Modelagem:** fluxos, estados, regras de unicidade, UX, DTOs e segurança.
- **Aceite:** participante iniciante entende a jornada; inscrição múltipla reduz passos e preserva invariantes e histórico.

### Etapa 5 — Agenda, check-in, filas e relatórios

**Problema observado:** Agenda teve pouco impacto prático na competição; falta relatório operacional específico.

- Integração Agenda ↔ chamada ↔ tomada/partida, status deriváveis, horários/pistas, eventos simultâneos e próximos confrontos.
- Tratar ausência, presença, recusa e estado de chamada de forma contextual, aproveitando observações da validação do Bloco 3.
- Modelar **check-in**: distinguir chegada ao evento, presença da pessoa/equipe, inspeção de robô e comparecimento à partida. Não gerar WO automaticamente sem regra aprovada.
- Refinar relatórios e filtros: presença/check-in, inscrições, categoria, equipe, robôs, cancelamentos, resultados e trilha de correções.
- Reutilizar exportação CSV/PDF já implementada em vez de replicá-la.
- **Modelagem:** objetos de presença e suas relações, estados da Agenda, permissões, critérios de elegibilidade e relatórios.
- **Aceite:** organização acompanha atividades sem planilhas paralelas; check-in e relatórios refletem fatos auditáveis.

### Etapa 6 — Portal, Landing, ajuda e comunicação

- Refinar comunicação entre `rasufrb.site` e `app.rasufrb.site`: CTA, inscrições, estados da edição, regras, programação e resultados públicos.
- Revisar manuais por perfil, tutoriais e vídeos existentes, **preservando acervo válido** e biblioteca Regras e Ajuda.
- Modelar avisos **IN_APP** como fonte oficial persistente; integração Telegram opcional e resiliente, com consentimento, controle de público e trilha de entrega.
- Refinar Hero pós-competição com campeões oficiais; rever patrocinadores/apoios e conteúdo institucional.
- **Modelagem:** canais, audiência, papéis de publicação, estados de publicação e fluxo de leitura.
- **Aceite:** participante acha instruções e acompanha sua edição; falha Telegram não perde aviso; Landing não confunde edição histórica com atual.

### Etapa 7 — Revisão de endpoints, desempenho, contingência e pipeline de release

- Revisar **todos os endpoints** por módulo: contratos/DTOs, autorizações, falhas, índices, N+1, paginação, filters, queries, concorrência, cache, tempo, idempotência, uploads, segurança e observabilidade.
- Validar melhorias já integradas (status pendente sob demanda, consultas de Follow, resultados de edições finalizadas, atualização parcial), sem reimplementar sem evidência.
- Medir desempenho em ambiente controlado: requests/tela, queries/endpoint, latência p50/p95/p99, memória, conexões e taxas de erro; distinguir testes simulados de uso real.
- Produzir runbook completo **cloud → local → cloud**: ENV/perfis, MySQL, dados/arquivos R2, backup/restore isolado, acesso LAN/Tunnel, DNS/HTTPS/CORS/JWT, testes, fonte única de escrita, cutover, rollback e recuperação.
- Implementar e testar o **processo de deploy baseado exclusivamente em tags**, conforme seção 5, antes do release V1.1.
- **Aceite:** inventário de API e riscos, testes de regressão e permissão, operação local reproduzível, backup/restore verificado e pipeline tag-only homologado.

### Etapa 8 — Validação integrada e entrega V1.1

- Testar jornada completa participante → inscrição → aprovação → check-in → Agenda → Follow/Sumô → chaves → resultados → edição finalizada.
- Testar correções excepcionais, alterações concorrentes, permissões DEV/GESTAO/juiz/participante, UI mobile e desktop, falhas parciais e offline/retorno de conectividade onde aplicável.
- Simular carga realista em ambiente separado e registrar resultados **medidos**, não inventados.
- Testar contingência e recuperação sem operar dois bancos de escrita independentes.
- Criar tags de release **somente após aprovação** e publicar a partir dos artefatos gerados/pinados pelas tags correspondentes.
- **Aceite:** CI verde, relatório de testes e riscos, validação explícita, release reproduzível e documentação de mudança/rollback.

### Etapa 9 — Expansões V2.0 (subetapas independentes, não iniciadas)

- **9A — Futebol de Robôs completo:** partida, cronômetro/placar, regras, resultado, chaves, acompanhamento e autorização.
- **9B — Galeria independente:** preservar prévia institucional, separar mídia pesada da API principal e distribuir por R2/CDN com controles de publicação.
- **9C — CMS/gestão editorial avançada:** administração de seções, eventos, apoiadores e patrocinadores sem deploy manual.
- **9D — Portabilidade:** configurar uma instalação para outra instituição organizadora, distinta de instituição vinculada a equipe.
- **9E — Possíveis categorias Follow Pro/Júnior e demais hipóteses:** somente após validar regras de negócio e demanda.

Cada subetapa terá novo escopo, modelagem, gate e validação; não presume entrada automática no produto.

## 4. Matriz de rastreabilidade do relato pós-evento

| ID | Necessidade observada | Etapa | Prioridade |
|---|---|---|---|
| UX-01 | Mobile quase inutilizável: chaves, menus e lançamentos | 1 | P0 |
| OP-02 | Reverter resultados, punições e tomadas com permissão | 2 | P0 |
| INS-03 | Cadastrar/inscrever múltiplos robôs com fluxo intuitivo | 4 | P1 |
| CHV-04 | Chaves extensas; foco na rodada ativa e transições | 3 | P1 |
| JUI-05 | Relacionar juiz à competição e à partida (aproveitar cadastro existente) | 3 | P1 |
| REL-06 | Relatórios específicos de check-in e outras operações | 5 | P1 |
| AJU-07 | Manual de uso refinado | 6 | P2 |
| WEB-08 | Landing da RAS integrada à experiência RasComp | 6 | P2 |
| LOC-09 | Procedimento de troca segura para uso local | 0 e 7 | P0/P1 |
| API-10 | Revisão de todos os endpoints | 7 | P1 |
| AGE-11 | Agenda útil durante o evento | 5 | P1 |
| COM-12 | Comunicação interna + Telegram | 6 | P2 |
| REL-13 | Deploy somente a partir de tag versionada | 0, 7 e 8 | P0 (governança) |

## 5. Modelagem de release e deploy **SOMENTE POR TAG** (decisão solicitada)

**Diretriz:** produção **não deve acompanhar `main`, `release` ou qualquer branch móvel**. Uma atualização de código em branch não pode disparar deployment de produção. A produção recebe apenas uma **versão imutável e identificável por tag**, aprovada e validada.

### Fluxo lógico desejado

```text
feature/* ou fix/*
  → PR e revisão
  → merge em branch de integração (ex.: main)
  → CI de build, testes, segurança e integração
  → homologação (sem produção)
  → aprovação explícita da versão
  → tag protegida e versionada sobre commit exato (ex.: v1.1.0)
  → pipeline de release disparado por tag verificada
  → artefatos reproduzíveis pinados no commit da tag
  → smoke / métricas / aceite operacional
  → produção usando somente esse release
```

**Não basta criar tags no Git e deixar Render/Cloudflare publicarem automaticamente novos commits de `main`**. A implantação só estará conforme a política quando os gatilhos e a origem efetiva do deploy usarem exclusivamente a referência imutável aprovada, ou um artefato construído comprovadamente daquele SHA.

### Como tratar os dois repositórios

- Backend e frontend têm históricos e commits **independentes**. Tags `v1.1.0` nos dois repos, ainda que usem o mesmo nome, apontam para **SHAs diferentes**.
- A versão de produto deve ter um **manifesto de release** com versão RasComp, tag/SHA backend, tag/SHA frontend, migrations, variáveis não secretas necessárias, artefatos e links de execução da CI.
- Quando apenas um componente mudar, a versão deve apontar explicitamente para o release validado do componente que permaneceu inalterado. Não deduzir versão pelo nome da tag.
- Não reatribuir nem fazer force-push de tag publicada; para corrigir, criar nova tag (patch, ex.: `v1.1.1`), preservar release anterior e executar rollback explícito.
- Adotar convenção SemVer como proposta: `vMAJOR.MINOR.PATCH` (ex.: `v1.1.0`, `v1.1.1`); pré-releases `v1.1.0-rc.1` não publicam automaticamente em produção.
- Tags devem ser protegidas por regras/permissões de repositório; publicar preferencialmente a partir de CI com permissões mínimas, com check de assinatura/proveniência quando viável.
- Migrações Flyway, contratos de API e compatibilidade frontend/backend fazem parte do gate; rollback de código não implica reversão segura de banco: definir migrations compatíveis e plano de recuperação.

### Modelagem de infraestrutura a decidir na Etapa 0 e implementar na Etapa 7

1. Identificar os mecanismos reais de build/deploy de **Render** (API backend) e **Cloudflare** (Landing, Gestão/Portal). Conferir recursos/limites atuais antes de escolher integração concreta.
2. Desativar deploy automático de produção em push/merge de branches em todos os serviços.
3. Configurar CI para testar commits/PRs e montar artefatos de release **somente para tags válidas/aprovadas**, com proveniência SHA e logs de execução.
4. Publicar backend e frontend a partir da tag ou de artefatos gerados a partir de tag; quando o provedor só acompanhar branches, usar workflow controlado que invoque implantação pinada no SHA/artefato, jamais um deploy variável do topo da branch.
5. Separar credenciais e alvos de homologação/produção; proteger segredos, restrições de aprovação e ambiente.
6. Validar o processo de **rollback por tag anterior**, inclusive compatibilidade de DB e persistência de arquivos, com smoke após corte de tráfego.
7. Versionar `RELEASES.md` ou manifestos equivalentes em local acordado, sem duplicar versão canônica entre repos. Registrar a release efetivamente em produção.

### Critérios obrigatórios de aceite da política de tags

- Push/merge em `main` **não** altera produção.
- Tag inválida ou não aprovada **não** altera produção.
- Tag válida e aprovada gera implantação rastreável ao SHA e ao conjunto backend+frontend correto.
- É possível indicar exatamente qual release está em produção e voltar para a anterior por procedimento testado.
- Nenhuma tag de deploy é criada agora; **a infraestrutura atual não foi alterada** por este planejamento.

## 6. Fontes e registros preservados

- `docs/ETAPAS_POS_PROJETO.md`: etapas históricas e planejamento canônico original.
- `docs/DOSSIE_PROJETO_RASCOMP.md`: decisões de domínio e arquitetura.
- `docs/CONTRATO_REGRAS_COMPETITIVAS.md`: Sumô, Follow, correções de resultado e `CompetitionJudge`.
- `docs/VALIDACAO_ETAPA4_BLOCO3.md`: observações antigas sobre Agenda, fila de tomada, correções excepcionais e ergonomia.
- `docs/PROBLEMAS_E_SOLUCOES_PRODUCAO.md`: incidente visual mobile e carregamento, entre outros.
- Backend `rascomp/docs/PRODUCAO_INCIDENTES_E_LICOES.md`: relatos, soluções e hipóteses após o deploy.

**Próximo passo, quando autorizado:** abrir a documentação detalhada da **Etapa 0**; levantar baseline dos dois repositórios e registrar decisões sobre UX mobile, matriz de permissões, ambiente de teste e release tag-only. Sem implementação/merge/deploy por este documento.
