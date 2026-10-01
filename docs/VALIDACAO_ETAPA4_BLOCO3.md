# Validação manual — ETAPA 4 / BLOCO 3

Última atualização: **29/09/2026**

Este documento registra a bateria manual do BLOCO 3 e evita repetir testes já validados.

## 1. Estado da bateria

### Validado pelo usuário

- 2 — GESTAO restrita à competição vigente;
- 5 — abertura da operação pela fila;
- 6 — tentativa válida;
- 7 — tentativa não concluída;
- 8 — tentativa concluída inválida;
- 9 — penalidade;
- 12 — fila após ausência;
- 13 — fila após tentativa;
- 15 — ranking parcial sem campeão;
- 16 — campeão normal do Follow.

### Validado com observação / correção necessária

1. **Troca de competição em foco (DEV):** os dados só atualizam após trocar de tela ou F5.
3. **Agenda Follow:** agendamento funciona. "Ordem geral" é a ordem da atividade na agenda, não a ordem dos robôs. O usuário prefere reduzir essa configuração manual e automatizar o estado da chamada. Campo de data/hora precisa de mais destaque/tamanho.
4. **Fila da tomada:** sincroniza, mas o modal corta ações/informações importantes. Deve facilitar presença/recusa. Nova chamada da mesma categoria/tomada não deve ser oferecida na UI; o backend já possui unicidade.
10. **Tentativa incompleta:** no contrato atual corresponde à tentativa "não concluída". O cronômetro de apresentação/chamada deve parar ao confirmar presença/iniciar tentativa. Correção/redo de tentativa foi solicitada como operação DEV auditável.
11. **Ausência:** funciona no console, mas deve ficar acessível diretamente na fila/Agenda. "Apresentação" precisa de nomenclatura mais clara.
14. **Encerramento/somente leitura:** durante o teste foi encontrado bug crítico: "Registrar tentativa" aceita envio sem uma tentativa efetivamente iniciada e cria tentativa zerada. Deve ser bloqueado no frontend e no backend.
16. **Resultados:** campeão normal validado. Nova necessidade: classificação final deve apresentar 1º, 2º e 3º. Follow é derivável do ranking; Sumô exige regra explícita para o 3º lugar.

### Ainda não executado

- 17–22 — resolução excepcional do Follow;
- 23 — janela operacional do Follow fora de `EM_ANDAMENTO`;
- 24–56 — Sumô, chaves, Agenda, Resultados, permissões e smoke final.

## 2. Decisões/ajustes derivados da validação

- **Ordem geral:** representa a ordem da chamada entre atividades da Agenda. Não é a ordem da fila de robôs.
- **Apresentação:** é o tempo de tolerância/espera após a convocação antes de permitir registrar ausência. A nomenclatura deve ser tornada explícita na UI.
- **Tentativa não concluída = tentativa incompleta** no contrato atual.
- Estados da chamada devem evoluir preferencialmente pelo fluxo operacional, reduzindo seleção manual:
  `AGENDADA → EM_CHAMADA → EM_ANDAMENTO → FINALIZADA`.
- A recusa/ausência deve consumir a tomada do robô sem criar tentativas fictícias.
- Edição/refação excepcional de tentativa deve ser tratada como ação DEV auditável, não como edição comum.
- Não permitir criação duplicada de chamada para a mesma competição + categoria + tomada.
- Não permitir tentativa "zerada" gerada apenas pelo clique em registrar.

## 3. Correções já aplicadas após a bateria

- troca de foco DEV no Follow agora reage ao seletor global sem exigir F5/troca de tela;
- tentativa concluída com tempo zero é bloqueada no frontend e no backend;
- iniciar o cronômetro da tentativa interrompe o temporizador de espera da chamada;
- botões rápidos do console Follow foram ampliados;
- fila da Agenda ganhou largura adequada + proteção para overflow horizontal;
- fila da Agenda ganhou ação direta **Ausente/recusou**, consumindo a tomada sem tentativa fictícia;
- nomenclatura de "Apresentação" foi simplificada para **espera após chamada**;
- criação duplicada de chamada pela Agenda é interceptada também na UI;
- estados competitivos da chamada (`EM_CHAMADA`, `EM_ANDAMENTO`, `FINALIZADA`) deixam de ser escolhas manuais no formulário comum; ficam derivados do fluxo;
- data/hora ganhou controle maior e "Ordem geral" foi renomeada para **Ordem na agenda (opcional)**.

Permanecem como decisão/escopo posterior:

- correção/refação excepcional de tentativa: ação DEV auditável, alinhada à ETAPA 5;
- pódio 1º/2º/3º: Follow pode usar ranking; Sumô ainda precisa de regra explícita para o 3º lugar;
- janela operacional do Follow fora de `EM_ANDAMENTO`: validar no teste 23.

## 3. Cenário único de dados para continuar a bateria

O profile `testdata` passa a usar banco próprio:

`rascomp_b3_validation`

Seeds antigos ficam desligados e apenas um cenário é criado:

**Competição:** `ETAPA 4 · BLOCO 3 · VALIDAÇÃO`

**Contas:**
- DEV: `dev.b3@rascomp.local` / `Rascomp@2026`
- GESTAO: `gestao.b3@rascomp.local` / `Rascomp@2026`

**Categorias:**
- `B3 · Follow Operação` — 4 robôs livres;
- `B3 · Follow Exceção` — programa normal já encerrado sem tentativa classificável, preparado para testes 17–22;
- `B3 · Mini Sumô RC` — 5 robôs aptos na chave + 2 sem inspeção.

O Sumô inicia com **uma chave histórica + uma vigente**, usando 5 participantes aptos para garantir cenário com **BYE**.

## 4. Próxima bateria — roteiro objetivo

### Follow excepcional — 17 a 22

17. Abra **Resultados** e localize `B3 · Follow Exceção`. O resultado deve estar pendente e oferecer **Tomada Extra** e **Decisão da organização**.
18. Clique em **Tomada Extra**, informe data/hora e pista. Confirme que surge a Tomada 4 sem alterar o formato oficial 3×3.
19. Abra a Tomada Extra pela Agenda. A fila deve conter os três robôs FX-01/02/03.
20. Registre uma tentativa válida em um FX, encerre o programa extra e confirme que o ranking normal passa a definir o resultado.
21. Após reset do banco ou em nova execução limpa, use **Decisão da organização** no lugar da Tomada Extra. Deve exigir vencedor + justificativa e registrar responsável/data sem inventar tempo.
22. Em outro reset limpo, crie Tomada Extra e deixe aberta. A decisão administrativa deve permanecer indisponível até a extra terminar/cancelar.

### Janela operacional — 23

23. Use `B3 · Follow Operação`. Como DEV, mude temporariamente a competição para `INSCRICOES_ENCERRADAS` e tente registrar tentativa/ausência. Registrar o comportamento atual para fechar a regra: a decisão pendente é bloquear atividade competitiva fora de `EM_ANDAMENTO`.

### Sumô — 24 a 38

24. Em `B3 · Mini Sumô RC`, use S-06 (sem inspeção) e registre APTO.
25. Use S-07 e registre INAPTO; peso não deve decidir automaticamente o resultado.
26. Exercite o limite de tentativas de inspeção com um dos reservados após reset do cenário.
27. Teste desclassificação manual e confirme motivo obrigatório/auditoria.
28. Confira `Juiz B3 · Ativo` e `Juiz B3 · Inativo`; decisão deve aceitar somente juiz ativo.
29. Agende uma batalha real da chave vigente com horário/pista.
30. Em uma batalha, dê duas vitórias ao mesmo robô; deve encerrar em 2×0 sem terceiro round.
31. Teste duas penalidades causando derrota do round.
32. Teste SUICIDIO/WO.
33. Teste FALHA_INICIALIZACAO: justificativa obrigatória e consequência humana.
34. Teste round extra somente após esgotar os regulares e com justificativa.
35. Teste decisão final do juiz somente após esgotar rounds disponíveis.
36. Desclassifique/desista exatamente um participante de uma partida e use resolução administrativa; não criar round fictício.
37. Partida encerrada deve aparecer FINALIZADA na Agenda.
38. Final da chave concluída deve alimentar Resultados.

### Chaves / Agenda / Resultados — 39 a 52

39. A chave vigente já deve existir; conferir participantes elegíveis.
40. Confirmar BYE e avanço automático sem tratá-lo como batalha real.
41. Concluir partida e verificar vencedor no slot correto da próxima rodada.
42. Corrigir resultado antes da dependência seguinte começar; propagação deve ser substituída.
43. Depois de iniciar a dependência seguinte, correção comum deve ser bloqueada.
44. Conferir separação entre chave histórica e chave vigente.
45. Agenda deve exibir Follow + Sumô com semânticas distintas.
46. Rodada futura sem dois participantes definidos não deve aparecer como atividade real.
47. Validar filtros da Agenda.
48. Alterar horário/pista/ordem operacional e atualizar página; árvore competitiva não pode mudar.
49. Convocação deve alterar somente estado operacional.
50. Dashboard deve refletir próximas atividades da Agenda.
51. Resultados Follow deve respeitar encerramento normal, Tomada Extra e decisão administrativa.
52. Resultados Sumô deve refletir a final da chave vigente.

### Permissões e smoke — 53 a 56

53. DEV pode operar a competição em foco sem alterar a vigente da GESTAO.
54. GESTAO só opera a única competição vigente, inclusive tentando IDs diretamente.
55. Refresh/voltar/avançar em Follow, Sumô, Agenda, Chaves e Resultados não deve perder contexto.
56. Reduzir viewport e confirmar que nenhuma ação crítica fica inacessível; refinamento mobile completo permanece no checkpoint transversal.

## 5. Critério de fechamento

O BLOCO 3 só será marcado como **CONCLUÍDO / VALIDADO** após:

- correção dos bugs bloqueantes encontrados;
- execução dos testes restantes;
- decisão sobre Follow fora de `EM_ANDAMENTO`;
- definição da regra de 3º lugar no Sumô;
- testes automatizados e profile `testdata` verdes;
- documentação sincronizada.


## 6. Fechamento da bateria 1–56 — 30/09/2026

A bateria manual inteira foi percorrida. O BLOCO 3 ainda não é marcado como concluído porque os testes revelaram ajustes estruturais antes do re-smoke final.

### 17–22 — Follow excepcional

- 17 ✅ cenário sem resultado classificável;
- 18 ✅ Tomada Extra;
- 19 ✅ fila da Tomada Extra;
- 20 ✅ resolução por ranking após Tomada Extra;
- 21 ✅ decisão da organização;
- 22 ✅ decisão manual bloqueada com Tomada Extra aberta.

### Explicação do seletor de Follow

O seletor que mostra `B3 · Follow Operação` e `B3 · Follow Exceção` é **seletor de categoria**, não de competição.

No seed de QA existem duas categorias Follow dentro da mesma competição apenas para separar cenários:

- `B3 · Follow Operação` — fluxo normal;
- `B3 · Follow Exceção` — cenário preparado para Tomada Extra/decisão administrativa.

Em produção, o mesmo controle selecionará as categorias reais da competição. Os nomes B3 são exclusivamente de teste.

### 23 — janela operacional do Follow

O teste demonstrou que uma competição `FINALIZADA` ainda aceitava tentativa Follow. Isso foi classificado como bug.

Regra fechada:

`Tentativa / ausência Follow → somente Competition.status == EM_ANDAMENTO`.

Backend corrigido em tentativa e ausência, com testes automatizados específicos.

### 24–38 — Sumô

Todos os fluxos principais foram validados. Ajustes derivados:

- inspeção deve permitir informar peso em **g ou kg**; backend continua persistindo kg;
- exibição de peso deve ser intuitiva para a classe física;
- área de juízes deve ser visível, não escondida apenas no modal de cadastro;
- status de convocação da batalha deve aparecer na arena e ficar claro que é estado operacional, não resultado competitivo;
- partida finalizada deve exibir seu status mesmo sem ação de reagendamento.

Correções de UX já aplicadas: seletor g/kg, formatação do peso, área visível de juízes e status de chamada na arena.

### 39–44 — Chaves

Validados geração, BYE e progressão. Pendências estruturais:

- BYE deve dizer explicitamente que o robô avançou automaticamente; ajuste visual aplicado;
- robô que perdeu deve aparecer competitivamente como **ELIMINADO**, sem mudar o status cadastral da Registration;
- Chaves precisa ganhar independência do módulo Sumô: gerar/regenerar com segurança, visualizar a árvore, consultar/operar partidas e histórico sem redirecionar toda ação para Sumô;
- correção extrema de partida/resultado deve existir para DEV, com motivo obrigatório, auditoria e bloqueio quando a dependência seguinte já tiver atividade competitiva.

### 45–56 — Agenda, Resultados, permissões e smoke

A bateria foi validada com ressalvas:

- Agenda: incluir ação explícita para limpar filtros — aplicado;
- Resultados: campeão precisa ser visualmente inequívoco — rótulo `CAMPEÃO` aplicado;
- Resultados deve evoluir de “lista de resultados” para **pódio oficial por categoria + histórico competitivo filtrável**;
- Dashboard deve poder destacar campeões já definidos;
- histórico Follow deve ser consultável em Resultados, assim como o histórico de partidas do Sumô;
- clique em partida da chave ocasionalmente fica em loading indefinido; tratar como bug de robustez e reproduzir no re-smoke.

## 7. Regra oficial de pódio definida no fechamento

### Follow Line

1. fluxo normal ou Tomada Extra com tentativas classificáveis:
   - 1º, 2º e 3º = três primeiras posições do ranking oficial;
2. cenário sem qualquer tentativa classificável:
   - a decisão da organização deve evoluir de “escolher campeão” para **definir pódio ordenado**;
   - 1º, 2º e 3º distintos entre inscrições elegíveis, conforme quantidade disponível;
   - justificativa obrigatória;
   - responsável + data/hora auditados;
   - checkpoints podem servir como evidência, nunca como decisão automática;
   - nenhum tempo fictício é criado.

### Sumô

- **Campeão:** vencedor da final;
- **Vice-campeão:** perdedor da final;
- **3º lugar:** vencedor de uma partida específica de terceiro lugar;
- essa partida é criada junto com a estrutura da chave;
- os **dois perdedores das semifinais** alimentam automaticamente a partida de 3º lugar;
- a partida de 3º lugar segue a mesma operação de uma batalha normal do Sumô;
- Resultados só considera o pódio completo quando final e disputa de 3º lugar estiverem resolvidas.

## 8. Estado de fechamento do BLOCO 3

Execução da bateria manual: **CONCLUÍDA (1–56 percorridos)**.

BLOCO 3: **AGUARDANDO CORREÇÕES + RE-SMOKE**, principalmente:

1. pódio completo Follow/Sumô;
2. partida de 3º lugar do Sumô;
3. Resultados orientado a pódio + histórico filtrável;
4. independência da interface Chaves;
5. correção excepcional DEV auditável;
6. estado competitivo “Eliminado” derivado da chave;
7. loading ocasional ao abrir partida;
8. revalidação rápida dos ajustes.


## 9. Correções finais implementadas — 30/09/2026

A rodada de correções derivada dos testes 1–56 foi implementada e agora entra em **re-smoke dirigido**.

Implementado:

- Follow bloqueia tentativa e ausência fora de `EM_ANDAMENTO`;
- pódio Follow normal/extra = três primeiras posições do ranking;
- decisão administrativa do Follow sem tempo classificável = pódio ordenado, justificativa e auditoria;
- Sumô gera disputa específica de 3º lugar e envia automaticamente os perdedores das semifinais;
- campeão/vice/3º são consolidados em Resultados;
- Resultados passa a priorizar pódio e oferece histórico filtrável de Sumô + Follow;
- Dashboard destaca campeões já definidos;
- Chaves exibe a árvore no próprio módulo e concentra geração/regeneração, histórico e correção extrema DEV;
- correção DEV de vencedor exige justificativa, preserva rounds, normaliza o placar consolidado e é bloqueada quando uma dependência já iniciou;
- situação competitiva `ELIMINADO` é derivada da chave, sem adulterar o status cadastral da Registration;
- BYE permanece visível como avanço automático no desenho e no histórico de partidas;
- arena de Sumô possui timeout de carregamento e retorno correto ao módulo Chaves quando aberta de lá;
- inspeção Sumô aceita entrada de peso em g/kg;
- área de juízes e estado de chamada ficaram explícitos;
- Agenda ganhou limpeza de filtros.

### Entrada manual / robô avulso

Também foi incorporado o fluxo solicitado pelo cliente:

```text
conta PARTICIPANTE existente
→ DEV escolhe equipe
→ cria/associa Competitor
→ cria Robot
→ cria Registration APROVADA
```

Follow: sincronizar o novo inscrito nas chamadas seguintes.

Sumô: realizar inspeção; se APTO, gerar nova chave. A regeneração excepcional durante `EM_ANDAMENTO` exige justificativa e só é permitida se a chave atual ainda não tiver disputa real.

### Re-smoke necessário

O re-smoke não repete os 56 testes. Deve cobrir somente:

1. entrada manual Follow;
2. entrada manual Sumô + inspeção + regeneração segura;
3. tentativa de regenerar depois que uma disputa real começou → deve bloquear;
4. semifinal → perdedor cai na disputa de 3º lugar;
5. final + disputa de 3º → Resultados mostra 1º/2º/3º;
6. Follow por ranking → 1º/2º/3º;
7. Follow por decisão da organização → pódio manual auditado;
8. correção DEV antes da dependência → propaga e audita;
9. correção DEV depois da dependência iniciada → bloqueia;
10. Chaves/Partidas → BYE explícito;
11. Resultados → filtros + histórico Follow/Sumô;
12. Dashboard → campeão visível;
13. abrir repetidamente partidas pela Chaves → sem loading infinito;
14. smoke responsivo das telas alteradas.

Se estes pontos passarem, o BLOCO 3 pode ser marcado como **CONCLUÍDO / VALIDADO**.


## Correções finais implementadas — aguardando re-smoke

Após a bateria 1–56, foram implementadas as correções estruturais principais:

- entrada manual DEV de participante/robô vinculada a conta PARTICIPANTE + equipe/competidor;
- inscrição manual já aprovada e auditada;
- Follow: novo robô entra nas próximas filas/tomadas após sincronização;
- Sumô: novo robô exige inspeção antes de entrar em nova chave;
- regeneração excepcional DEV de chave com justificativa e histórico, bloqueada após atividade competitiva real;
- Chaves passou a exibir a árvore no próprio módulo;
- correção excepcional DEV de resultado Sumô com justificativa, auditoria e proteção de dependências;
- pódio completo em Resultados;
- decisão administrativa Follow passou a aceitar 1º/2º/3º;
- disputa de 3º lugar Sumô criada junto da chave e alimentada pelos perdedores das semifinais;
- estado competitivo derivado (Campeão, Vice, 3º, Eliminado etc.) no Sumô;
- melhorias anteriores de g/kg, juízes, BYE, filtros, chamada e bloqueio Follow fora de EM_ANDAMENTO.

Estado: **CORREÇÕES IMPLEMENTADAS · RE-SMOKE PENDENTE**.


## Correção do roteiro de re-smoke — 30/09/2026

O teste de bloqueio de operação Follow após a competição chegar a `FINALIZADA` é **destrutivo**, porque `FINALIZADA` é estado terminal no fluxo normal.

Portanto:

- esse teste deve ser executado **por último** no re-smoke;
- nenhum roteiro deve exigir `FINALIZADA → EM_ANDAMENTO` pelo fluxo comum;
- se for necessário repetir cenários depois dele, usar reset do banco dedicado de QA;
- não adicionar reabertura comum apenas para facilitar testes.

A ordem corrigida do re-smoke mantém primeiro todos os fluxos que dependem de `EM_ANDAMENTO` e deixa a validação terminal para o encerramento.


## Achados do re-smoke — participante e Sumô

- testes 1–5 validados;
- card "Regra da categoria" considerado redundante e removido;
- troca explícita entre chave atual/histórica adicionada ao módulo Chaves;
- teste 6 revelou inconsistência central no onboarding e foi tratado:
  - conta PARTICIPANTE + equipe implica Competitor;
  - criador da equipe vira competidor automaticamente;
  - participante pode cadastrar instituição no onboarding;
  - Portal expõe cadastro normal de robô ao responsável;
  - entrada manual DEV deriva a equipe do participante e não lista todas as equipes;
- testes 8 e 9 validados;
- teste 10 revelou ausência de estado de campeão no Portal; corrigido com destaque competitivo final;
- testes 11 e 12 validados.

O fluxo de solicitação para ingressar em equipe existente permanece parte do BLOCO 4/Portal do Participante; quando aprovado, deve criar o vínculo Competitor automaticamente, seguindo a regra canônica acima.
