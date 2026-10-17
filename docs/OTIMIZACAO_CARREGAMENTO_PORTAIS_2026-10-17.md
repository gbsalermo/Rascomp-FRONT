# RasComp — otimização de atualizações da Gestão e do Participante

17/10/2026 — Branch `perf/refresh-pontual-gestao-participante-20261017`. Escopo: **somente frontend**; nenhuma migration, seed ou acesso ao Aiven.

## Política de atualização

- Usar o DTO devolvido pela API para modificar, adicionar ou retirar somente o item afetado. Esperar sucesso da API; nada de alterações otimistas em decisões de negócio.
- Quando a operação afeta recursos relacionados (composição, status, resultados), consultar somente os recursos impactados. Preservar a API como fonte oficial de status, elegibilidade e pontuação.
- Não bloquear a página com `v-loading` em operações pontuais. Manter indicador por ação/linha.
- Atualização completa continua permitida na **entrada**, ao **trocar competição/equipe** e no botão **Atualizar**.
- No Portal, retorno à aba: revalidação curta a partir de 60s; revisão completa dos dados da equipe a cada 5min. Fotos, responsáveis, chaves e rankings de todos os robôs não são consultados a cada retorno.
- Chave, partidas, resultados e ranking compartilhados por robôs reutilizam uma mesma Promise **somente durante uma rodada** de carregamento; nenhum cache persistente ou resultado competitivo antigo.
- Ignorar respostas obsoletas se a competição ou a equipe selecionada mudou. Preservar conteúdo em atualizações silenciosas mesmo se a rede falhar.

## Revisão por tela

| Interface | Operações otimizadas |
|---|---|
| Gestão / Inscrições | Manter/Vetar; aprovação/rejeição de participantes e robôs; cancelamento, desclassificação, reativação, pedidos de cancelamento, transferência de líder |
| Gestão / Usuários | Criação, edição de dados, alteração de papel e reatividade dos filtros |
| Gestão / Competições | Edição, criação, transição de status, gerenciamento de lotes e histórico da prorrogação |
| Gestão / Sumô | Inspeção, cadastro de juiz, desclassificação e geração de chave |
| Gestão / Arena | Atualização de partida, rounds e decisão sem reler configurações e juízes |
| Gestão / Chaves | Preview atualizado após correção e revalidação sem bloqueio após nova chave |
| Gestão / Follow | Alterações da chamada da tomada sem carregar seis listas |
| Gestão / Resultados | Atualização de resultado por categoria após tomada extra ou decisão manual |
| Gestão / Agenda | Revalidação em segundo plano sem limpar cards; proteção contra requests obsoletos e duplicados |
| Gestão / Ajuda | Publicação pontual e recarga silenciosa após upload |
| Portal / Equipe e robôs | Cadastro, edição, exclusão, logo, autorresponsabilidade do criador, inscrições, reativação, pedidos e convites |
| Portal / Acompanhamento | Reaproveitamento por ciclo de requisições de chave, partida, resultado e ranking |

Telas com ação já pontual ou exclusivamente consulta de entrada foram preservadas: Dashboard, Mídia, Catálogo, Competidores, Partidas, execução do Follow e Configurações.

## Roteiro de validação antes de publicar

1. **Inscrições — Gestão:** cinco cliques em Manter/Vetar sequenciais; a linha deve desaparecer sem overlay da tabela toda. Verificar ao vetar o vínculo de cada robô e os contadores; não repetir quatro GETs após um Manter.
2. **Decisões:** aprovar, pedir correção, rejeitar, reativar, cancelar e desclassificar; conferir filtros/contadores, histórico e alteração em outras telas ao navegar.
3. **Usuários:** criar conta, alterar nome, alterar papel e ativar/desativar; manter consistência dos filtros e proteger a conta atual.
4. **Competições:** criar, editar, alterar status, prorrogar inscrições e modificar lotes; conferir status vigente e contexto da organização.
5. **Participante:** criar robô (criador aparece como responsável), editar, fotografar, excluir, inscrever, cancelar e reinscrever; a ação não pode apagar fotos e responsáveis dos demais robôs.
6. **Equipe:** enviar/aceitar convite, trocar de equipe, alterar logo; alternar abas e conferir resumo após 60s; retornar após 5min e confirmar sincronização completa.
7. **Sumô:** registrar inspeção, gerar chave, cadastrar juiz e registrar round/decisão; placar e progressão devem permanecer corretos.
8. **Follow / Resultados / Agenda:** salvar chamadas, registrar tomadas, decisões manuais e resultados; confira a atualização ao navegar entre seções.
9. **DevTools Network:** conferir ausência de requisições não relacionadas às ações pontuais; trocar de competição/equipe deve continuar fazendo sincronização completa.
10. **Build:** GitHub Actions `vue-tsc --noEmit` e `vite build`. A Gestão ainda não possui suíte automatizada E2E configurada.

### Cuidados

Nunca adicionar `await load()` global indiscriminadamente após uma mutação; atualizar o estado mínimo de forma consistente. Evitar cache permanente de dados oficiais. Não incluir seeds de teste em produção.
