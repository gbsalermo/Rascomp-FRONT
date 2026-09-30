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
