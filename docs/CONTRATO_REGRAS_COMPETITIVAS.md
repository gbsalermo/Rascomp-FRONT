# RasComp — Contrato de Regras Competitivas

Última revisão: **13/09/2026**

Este documento consolida as **regras competitivas e invariantes de domínio aprovadas durante a ETAPA 1** do RasComp.

Ele possui dois objetivos simultâneos:

1. servir como contrato para backend, frontend e testes automatizados;
2. preservar uma redação explícita o suficiente para futuramente gerar o regulamento público entregue aos competidores na etapa de Regras.

> Este documento é a referência de regras competitivas já decididas. O roadmap continua sendo `docs/ETAPAS_POS_PROJETO.md` e a arquitetura geral continua sendo `docs/DOSSIE_PROJETO_RASCOMP.md`.

---

# 1. Fontes e princípio de adaptação

As regras da RoboCore são usadas como **base técnica e competitiva**, principalmente para Seguidor de Linha e Sumô.

Referências consultadas em 06/09/2026:

```text
RoboCore Event Manager — Rules
https://events.robocore.net/rules

RoboCore — Regras Seguidor de Linha
https://www.robocore.net/upload/attachments/robocore__regras_seguidor_de_linha_108.pdf

RoboCore — Regras Sumô
https://www.robocore.net/upload/attachments/robocore__regras_sumo_165.pdf

RoboCore Event Manager — RSM 2026 / inscrições
https://events.robocore.net/rsm-2026/registration_info
```

Essas fontes **não substituem as decisões do RRC/RasComp**.

Quando este documento definir uma adaptação própria, vale a regra explicitamente registrada aqui para implementação do sistema.

Exemplos de adaptações próprias já aprovadas:

- Follow com 3 tomadas e 3 tentativas por tomada;
- alterações físicas/de código proibidas durante uma tomada, mas permitidas entre tomadas;
- penalidade temporal configurável no Follow;
- inspeção de Sumô decidida por pessoa da organização, não calculada automaticamente pelo sistema;
- robôs híbridos podem competir em mais de um modo compatível;
- rounds extras de Sumô somente em situações justificadas;
- prorrogação/reabertura de inscrições como operação explícita;
- edição operacional da agenda de partidas separada da estrutura lógica da chave.

---

# 2. Categorias competitivas

## 2.1 Modalidades técnicas do backend

O backend pode continuar trabalhando com as modalidades técnicas:

```text
FOLLOW_LINE
SUMO
```

Mini/3 kg e Auto/R/C são **categorias competitivas distintas**, mas compartilham o mesmo motor de Sumô.

## 2.2 Categorias de Sumô previstas

```text
Mini Sumô 500 g — Autônomo
Mini Sumô 500 g — R/C
Sumô 3 kg — Autônomo
Sumô 3 kg — R/C
```

O sistema não precisa validar dimensões físicas. O enquadramento físico ocorre presencialmente em gabarito fixo durante a inspeção.

---

# 3. Classe física e robôs híbridos

Um `Robot` representa o mesmo robô físico da equipe.

O sistema separa:

```text
robô físico
≠
modo de funcionamento
≠
classe física da categoria de Sumô
```

Modos de funcionamento podem variar sem duplicar o robô cadastrado.

Exemplo permitido:

```text
TITÃ
├─ Mini Sumô Auto   ✅
├─ Mini Sumô R/C    ✅
└─ Follow Line      ✅
```

Outro exemplo permitido:

```text
ATLAS
├─ Sumô 3 kg Auto   ✅
├─ Sumô 3 kg R/C    ✅
└─ Follow Line      ✅
```

Incompatibilidade física na mesma edição:

```text
mesmo Robot
├─ Mini 500 g
└─ 3 kg
   ❌ não permitido
```

A trava ocorre pela **classe física de Sumô**, não pelo modo Auto/R/C e não por dimensões armazenadas no software.

Modelo implementado na ETAPA 1:

```text
CompetitionCategory.sumoPhysicalClass
├─ MINI_500G
├─ SUMO_3KG
└─ null para categorias não-SUMO

CompetitionCategory.sumoControlMode
├─ AUTONOMO
├─ RC
└─ null para categorias não-SUMO
```

A classe física e o modo de controle pertencem à `CompetitionCategory`, e não ao `Robot`. Dessa forma, um único robô físico pode ser inscrito em mais de uma categoria compatível sem ser duplicado no cadastro.

Regras de integridade implementadas no `RegistrationService`:

```text
mesmo Robot + mesma Competition
├─ Follow + Mini                         ✅
├─ Follow + 3 kg                         ✅
├─ Mini Auto + Mini R/C                  ✅
├─ 3 kg Auto + 3 kg R/C                  ✅
└─ Mini + 3 kg                           ❌
```

A comparação considera inscrições `PENDENTE` e `APROVADA`, inclusive ao reativar uma inscrição antiga. Categoria `SUMO` sem classe física ou modo de controle não aceita configuração normal compatível com o contrato atual.

A migration V9 introduziu a coluna `sumo_physical_class` e fez o backfill das categorias Sumô existentes a partir do `peso_max` já armazenado em `ConfigSumo`. Esse uso de peso é apenas uma estratégia de migração de dados legados; **o runtime não infere a classe pelo nome da categoria nem pelo peso medido na inspeção**.

---

# 4. Inscrições

## 4.1 Regra geral

Inscrições comuns só podem ser criadas enquanto a competição estiver com inscrições abertas e dentro da janela de datas vigente.

Fluxo normal:

```text
Competition
PLANEJADA
   ↓
INSCRICOES_ABERTAS
   ↓
Registration PENDENTE
   ↓
Organização analisa
   ├─ APROVADA
   └─ REJEITADA
```

## 4.2 Permissões e transições

### Participante

Pode, dentro da janela válida:

- criar inscrição;
- editar inscrição `PENDENTE` nos campos permitidos;
- cancelar inscrição `PENDENTE`;
- reativar inscrição cancelada quando a janela ainda estiver aberta, retornando para `PENDENTE`;
- solicitar cancelamento de uma inscrição `APROVADA`.

Não pode:

- aprovar/rejeitar inscrição;
- reabrir uma inscrição `REJEITADA`;
- cancelar diretamente uma inscrição `APROVADA`;
- alterar histórico competitivo já consumido.

### Organização

Pode:

- aprovar/rejeitar inscrições;
- reabrir uma inscrição `REJEITADA` para correção;
- analisar solicitação de cancelamento de inscrição `APROVADA`;
- executar correções administrativas permitidas pelo estado competitivo.

## 4.3 Cancelamento de inscrição aprovada

Uma inscrição `APROVADA` **não é cancelada diretamente pelo participante**.

Fluxo:

```text
PARTICIPANTE
→ solicita cancelamento
→ Registration permanece APROVADA enquanto a solicitação está pendente
→ ORGANIZAÇÃO analisa
   ├─ aceita
   └─ rejeita
```

A solicitação é representada separadamente do status competitivo principal da inscrição.

Modelo implementado na ETAPA 1:

```text
RegistrationCancellationRequest
├─ registration
├─ requestedByUser
├─ dataCadastro
├─ motivo
├─ status: PENDENTE | APROVADA | REJEITADA
├─ reviewedByUser
├─ reviewedAt
└─ resposta
```

Invariantes implementadas:

- somente inscrição ativa e `APROVADA` pode receber solicitação;
- a inscrição continua `APROVADA` enquanto a solicitação está `PENDENTE`;
- não pode existir uma segunda solicitação pendente para a mesma inscrição;
- competição `FINALIZADA` ou `CANCELADA` não aceita nova solicitação;
- somente a organização conclui a análise;
- aprovação executa o cancelamento dentro do fluxo de domínio;
- rejeição preserva a inscrição `APROVADA`.

## 4.4 CANCELADA x DESISTENTE

```text
CANCELADA
→ retirada antes de comprometimento competitivo relevante

DESISTENTE
→ inscrição que já entrou no contexto competitivo e não seguirá na competição
```

Depois de existir histórico competitivo relevante, o sistema não deve apagar nem simplesmente cancelar a inscrição como se ela nunca tivesse participado.

Histórico relevante inclui, conforme modalidade:

```text
Follow
→ tentativa registrada
ou
→ tomada perdida por ausência

Sumô
→ inspeção utilizada como elegibilidade
→ inclusão em chave
→ partida
→ round
→ resultado
```

Uma desistência depois da entrada em chave deve preservar a árvore e usar WO/resultado administrativo quando necessário.

## 4.5 Reativação

Reativação comum só pode ocorrer quando:

- a competição está ativa;
- a janela de inscrições está aberta;
- a data atual está dentro da janela;
- as demais entidades necessárias continuam ativas/compatíveis;
- a reativação não cria conflito de classe física para robô híbrido.

Ao reativar:

```text
status → PENDENTE
revisão anterior → limpa
```

Fora da janela, a operação normal é bloqueada. Exceções administrativas futuras pertencem às ferramentas DEV/Ajustes Gerais e devem ser auditadas.

## 4.6 Pagamento — invariante futuro

O sistema ainda não implementa pagamento, mas a regra já deve ser preservada no desenho da aprovação.

Quando pagamento estiver habilitado para a competição:

```text
Registration só pode virar APROVADA
se a cobrança exigida estiver regular
```

A cobrança poderá consolidar valores como:

- inscrição do participante/equipe;
- inscrição do robô/categoria;
- combinação dos valores em uma cobrança única quando essa for a política do evento.

Estados candidatos futuros:

```text
PENDENTE
CONFIRMADO
ISENTO
CANCELADO
ESTORNADO
```

A ETAPA 1 não precisa implementar pagamento, mas nenhuma regra nova deve impedir essa integração futura.

---

# 5. Estado da competição e prorrogação

Fluxo normal:

```text
PLANEJADA
   ↓
INSCRICOES_ABERTAS
   ↓
INSCRICOES_ENCERRADAS
   ↓
EM_ANDAMENTO
   ↓
FINALIZADA
```

`CANCELADA` é uma saída administrativa possível antes da finalização conforme política da organização.

Mudanças arbitrárias de enum não são consideradas operação segura.

Exemplos bloqueados no fluxo comum:

```text
FINALIZADA → INSCRICOES_ABERTAS  ❌
FINALIZADA → EM_ANDAMENTO        ❌
EM_ANDAMENTO → PLANEJADA         ❌
```

## 5.1 Prorrogação antes do fechamento

Enquanto ainda estiver em `INSCRICOES_ABERTAS`, a organização pode prorrogar a data final.

Operação de domínio implementada:

```text
prorrogarInscricoes(novaData, motivo)
```

A nova data deve ser posterior à data final atual, não pode estar no passado e deve continuar consistente com o início da competição.

## 5.2 Reabertura após fechamento

`INSCRICOES_ENCERRADAS → INSCRICOES_ABERTAS` só pode ocorrer por operação explícita de prorrogação/reabertura, com:

- nova data final;
- motivo obrigatório;
- autorização da organização;
- histórico persistido com responsável e data/hora.

Reabertura normal é bloqueada depois de atividade competitiva.

Se já existir chave de Sumô:

- sem atividade competitiva: a chave atual é preservada historicamente, deixa de ser `atual` e recebe estado `CANCELADO`; uma nova chave deverá ser gerada após o novo fechamento;
- com partida/round/resultado já iniciado: reabertura comum é bloqueada.

A verificação de atividade competitiva considera atualmente:

- tentativas Follow;
- tomadas Follow perdidas por ausência;
- rounds de Sumô;
- resultados;
- partidas `EM_ANDAMENTO/FINALIZADA`.

Histórico implementado:

```text
CompetitionRegistrationWindowChange
├─ competition
├─ tipo: PRORROGACAO | REABERTURA
├─ dataFimAnterior
├─ novaDataFim
├─ motivo
├─ realizadoPor
└─ dataCadastro
```

---

# 6. Seguidor de Linha — regra competitiva

## 6.1 Estrutura

Cada inscrição possui:

```text
3 TOMADAS

cada TOMADA possui exatamente
3 TENTATIVAS
```

Não existe janela total obrigatória para a tomada. O limite de tempo é aplicado individualmente a cada tentativa.

Parâmetros padrão recomendados:

```text
numeroTomadas = 3
tentativasPorTomada = 3
maxTempoTentativa = 120 segundos
```

O limite de tentativa deve continuar configurável pela organização.

## 6.2 Alterações no robô

Durante uma mesma tomada, entre o início da primeira tentativa e o encerramento da terceira:

```text
alteração física      ❌
alteração de código   ❌
```

Entre tomadas:

```text
alteração física      ✅ permitida
alteração de código   ✅ permitida
```

Essa é uma regra própria do RRC/RasComp.

## 6.3 Cronometragem

Cada tentativa pode ser cronometrada pela interface da organização.

Fluxo operacional:

```text
[ INICIAR ]
→ cronômetro roda
→ [ PARAR ]
→ tempo é preenchido
→ organização confirma/ajusta antes de salvar
```

O cronômetro do frontend é ferramenta operacional; o backend continua validando e persistindo o resultado oficial.

Entrada manual de tempo permanece possível para correção operacional autorizada.

## 6.4 Penalidades de tempo

Fórmula oficial:

```text
tempoFinalTentativa
=
tempoCronometrado
+
somaDasPenalidades
```

Penalidades são registradas em segundos.

Valor comum de referência:

```text
+10 s
```

O valor não é rigidamente fixado no código. A configuração da categoria fornece a penalidade padrão e a organização pode ajustar o valor da tentativa conforme ocorrência e regulamento da edição.

### Falha em parar corretamente

Se o robô completar o percurso mas não parar corretamente na área definida entre chegada/partida, a tentativa não precisa ser invalidada automaticamente.

Regra do RRC:

```text
percurso concluído
+
não parou corretamente
→ tentativa pode continuar válida
→ aplica penalidade temporal
```

A UI possui ação `NÃO PAROU`, preenchendo a penalidade padrão configurada antes da confirmação da organização.

## 6.5 Estados válidos de tentativa

### Classificável

```text
concluida = true
valida = true
tempoSegundos != null
```

### Concluiu, mas foi invalidada

```text
concluida = true
valida = false
tempoSegundos != null
```

### Não concluiu

```text
concluida = false
valida = false
tempoSegundos = null
```

Combinações proibidas:

```text
concluida = false + valida = true       ❌
valida = true + tempoSegundos = null    ❌
concluida = true + tempoSegundos = null ❌
```

Essas combinações são bloqueadas pelo service do backend.

`checkpointsAlcancados` é informativo/operacional e não altera o ranking enquanto não houver regra competitiva específica aprovada.

## 6.6 Ranking

Para cada tomada:

```text
melhorTentativaDaTomada
=
menor tempoFinal entre as tentativas classificáveis
```

Para o robô:

```text
resultadoDoRobo
=
menor tempoFinal entre as melhores tentativas de suas tomadas
```

Classificação final:

```text
menor tempoFinal
→ melhor posição
```

Em empate, o sistema pode manter os critérios técnicos atuais de desempate até que um regulamento específico determine outra regra, desde que sejam documentados no regulamento publicado.

## 6.7 Ausência na chamada

Quando o competidor/robô é chamado para uma tomada:

```text
cronômetro de apresentação inicia
```

Tempo padrão recomendado:

```text
60 segundos
```

Esse valor é configurável.

Se o competidor não comparecer dentro do limite:

```text
TOMADA → PERDIDA_POR_AUSENCIA
```

A perda é da tomada, não da inscrição inteira.

A ausência possui registro próprio com responsável, observação e data/hora. Não são criadas três tentativas fictícias para representá-la, e uma tomada marcada por ausência não aceita tentativas posteriormente.

## 6.8 Inspeção

Seguidor de Linha **não entra na inspeção de Sumô** descrita neste documento.

---

# 7. UX operacional do Follow

A gestão abre uma experiência focada no robô/tomada selecionado.

Informações e ações implementadas no Bloco 2:

```text
foto do robô
equipe/categoria
tomada atual
3 tentativas
cronômetro da tentativa
cronômetro de apresentação
penalidades
tempo bruto/final
histórico
observações

INICIAR CRONÔMETRO
PARAR
SALVAR/AJUSTAR TEMPO
APLICAR PENALIDADE
MARCAR NÃO PAROU
INVALIDAR TENTATIVA
MARCAR NÃO CONCLUIU
MARCAR TOMADA PERDIDA POR AUSÊNCIA
```

A fonte de verdade continua sendo o backend.

---

# 8. Sumô — inspeção

## 8.1 Escopo

A inspeção se aplica às categorias de Sumô.

Follow não usa esse fluxo.

## 8.2 Decisão humana

As medidas físicas são verificadas presencialmente com gabarito fixo e demais instrumentos da organização.

O RasComp não decide automaticamente aprovação por dimensão ou peso.

Fluxo implementado no Bloco 3:

```text
organização realiza inspeção física
→ informa APTO ou INAPTO
→ RasComp registra resultado
```

Dados possíveis apenas para informação/auditoria:

- peso medido;
- número da tentativa de inspeção;
- observação;
- responsável pela inspeção;
- data/hora.

`pesoMedido` não determina sozinho o resultado. O backend recebe explicitamente `aprovada=true|false` e persiste a decisão humana.

Reinspeções podem existir conforme decisão da organização.

A elegibilidade para chave depende de existir inspeção considerada `APTA` quando a categoria exigir inspeção.

---

# 9. Sumô — partida e rounds

## 9.1 Regra base

```text
2 robôs por partida
3 rounds regulares
2 vitórias necessárias para vencer a partida
```

Um round `FINALIZADO` deve possuir vencedor.

Rounds `ANULADO` ou `CANCELADO` não concedem vitória.

## 9.2 Penalidades

Regra operacional consolidada do RasComp/RRC:

```text
0 penalidades → disputa normal
1 penalidade  → disputa normal
2 penalidades → derrota automática do round para o robô penalizado
```

As penalidades devem continuar registradas para auditoria do resultado.

## 9.3 Suicídio / WO

```text
SUICIDIO_WO
→ adversário vence o round
```

Quando a desistência ocorrer antes da disputa de uma partida já comprometida na chave, o resultado administrativo deve preservar o histórico da chave.

## 9.4 BYE

```text
BYE
→ único participante avança automaticamente
```

BYE não recebe resultado manual comum.

---

# 10. Sumô — Autônomo x R/C

O modo de controle é persistido em `CompetitionCategory.sumoControlMode`:

```text
AUTONOMO
RC
```

Categorias `SUMO` devem possuir um modo de controle; categorias não-Sumô não usam essa metadata.

## 10.1 Autônomo

Após autorização do juiz e ativação pelo competidor, existe atraso regulamentar antes da movimentação.

Referência adotada:

```text
5 segundos
```

Esse atraso não é uma falha.

Após o período regulamentar, o robô deve entrar em funcionamento conforme o julgamento operacional da partida.

Se não iniciar adequadamente, a organização/juiz pode registrar:

```text
FALHA_INICIALIZACAO
```

A consequência pode ser, conforme decisão do juiz/regulamento da edição:

- penalidade;
- perda do round.

O backend não escolhe automaticamente entre essas consequências. Quando a falha for usada como motivo do resultado do round, a justificativa é obrigatória.

Se existir um tempo de tolerância adicional para considerar a falha definitiva, ele deve ser configurável/documentado pela competição.

## 10.2 R/C

Robôs R/C iniciam ao comando do juiz.

Não existe o atraso regulamentar de 5 segundos aplicado aos autônomos.

Falhas de partida/inicialização continuam podendo ser registradas pelo juiz conforme a situação competitiva.

---

# 11. Rounds extras

A partida não é um "melhor de cinco" por padrão.

Existem:

```text
3 rounds regulares
+
rounds extras somente se necessários
```

Exemplo:

```text
Round 1 → A venceu
Round 2 → B venceu
Round 3 → ANULADO

placar = 1 x 1
→ Round 4 pode ser autorizado
```

Um round extra só pode ser criado quando:

- a partida ainda não possui vencedor;
- os rounds regulares já foram consumidos;
- um ou mais rounds não produziram vitórias suficientes para atingir 2 vitórias;
- a categoria permite round de desempate;
- o limite configurado ainda não foi atingido;
- o juiz/organização autoriza;
- existe justificativa registrada.

Configuração inicial consolidada:

```text
numeroRoundsRegulares = 3
roundsParaVencer = 2
maxRoundsExtras = 2
```

Se um participante já alcançou 2 vitórias:

```text
round extra ❌
```

Se o limite de rounds extras for atingido e ainda não houver vencedor, a partida deve ser decidida pela operação específica de decisão de juiz.

---

# 12. Decisão dos juízes

O sistema suporta resultado por decisão de juiz quando os rounds regulares e extras disponíveis foram esgotados sem vencedor.

A decisão é uma operação específica e **não é registrada como um round artificial**.

Registro implementado:

```text
MatchJudgeDecision
├─ partida
├─ winnerRegistrationId
├─ judgeId
├─ justificativa obrigatória
└─ data/hora
```

A decisão não pode existir sem vencedor e justificativa.

Regras implementadas:

- somente chave atual e ativa;
- partida ativa e com os dois participantes;
- rounds regulares + extras disponíveis já esgotados;
- nenhum participante já pode ter atingido as vitórias necessárias;
- vencedor deve participar da partida;
- juiz precisa estar ativo e pertencer à mesma competição;
- apenas uma decisão de juiz por partida;
- justificativa obrigatória, com limite de tamanho;
- resultado oficial e progressão criados pelo fluxo de backend.

## 12.1 Cadastro de juiz

Um juiz é cadastrado no contexto da competição:

```text
CompetitionJudge
├─ nome
├─ competition
├─ ativo
└─ userAccount opcional
```

O juiz pode ser:

- integrante da organização com conta no RasComp;
- pessoa cadastrada apenas como juiz, sem login próprio.

A organização consegue identificar quem tomou a decisão registrada.

---

# 13. Motivos de resultado do Sumô

A implementação representa de forma auditável:

```text
DISPUTA
SUICIDIO_WO
PENALIDADES
FALHA_INICIALIZACAO
DECISAO_JUIZ
```

`DECISAO_JUIZ` pertence ao fluxo específico `MatchJudgeDecision`, e não deve ser enviado como round comum.

Não usar um motivo genérico quando a causa real tiver impacto na compreensão do resultado.

---

# 14. Geração e regeneração de chave

## 14.1 Geração normal

Regra recomendada:

```text
PLANEJADA              ❌
INSCRICOES_ABERTAS     ❌
INSCRICOES_ENCERRADAS  ✅
EM_ANDAMENTO           ❌ geração comum
FINALIZADA             ❌
CANCELADA              ❌
```

Somente inscrições:

- ativas;
- aprovadas;
- da categoria correta;
- aptas na inspeção quando exigida;

podem entrar na chave.

## 14.2 Regeneração

Permitida somente enquanto nenhuma atividade competitiva dependente tiver começado.

```text
chave atual
+
nenhuma partida/round/resultado iniciado
→ pode regenerar
```

Depois do início competitivo:

```text
regeneração comum ❌
```

Correções excepcionais devem usar operação específica e auditável, não gerar uma nova chave aleatória por cima do histórico.

---

# 15. Estrutura da chave x agenda de execução

A posição lógica de uma partida na chave não é a mesma coisa que a ordem real em que ela será disputada.

Separar:

```text
ESTRUTURA LÓGICA
rodada
ordem na árvore
origem dos participantes
próxima partida
```

De:

```text
AGENDA OPERACIONAL
pista
ordem de execução
horário previsto
status de convocação
```

Isso permite situações reais como:

```text
Partida lógica 1 adiada por força maior
Partida lógica 2 acontece primeiro
outra pista executa Partida 3 em paralelo
```

sem alterar a árvore competitiva.

## 15.1 Permissões futuras

Direção aprovada para a matriz de roles futura:

```text
GESTAO
→ pode reorganizar agenda/pista/horário dentro das regras permitidas

DEV
→ pode realizar correção estrutural excepcional quando necessária e segura
```

Uma permissão específica poderá ser concedida a GESTAO para determinados ajustes estruturais, mas nunca como edição irrestrita da árvore.

---

# 16. Correção de resultado após progressão

## 16.1 Próxima partida ainda não começou

Se o resultado anterior foi corrigido e a próxima partida ainda não iniciou:

```text
corrigir resultado
→ remover vencedor anterior do slot dependente
→ inserir vencedor correto
→ recalcular status da próxima partida
```

A operação deve ocorrer em **uma única transação**, sem deixar a chave em estado intermediário.

## 16.2 Próxima partida já começou

Se a partida dependente já está `EM_ANDAMENTO`, `FINALIZADA` ou possui rounds/resultados:

```text
correção comum do resultado anterior ❌ bloqueada
```

Não executar rollback automático silencioso em cadeia.

Uma futura operação DEV de rollback competitivo poderá existir nos Ajustes Gerais, com:

- cadeia afetada explícita;
- motivo obrigatório;
- auditoria;
- confirmação administrativa;
- reconstrução consistente dos estados dependentes.

Até essa ferramenta existir, bloquear é a regra de integridade.

---

# 17. Matriz de implementação da ETAPA 1

Legenda:

```text
✅ implementado/alinhado
⚠️ alteração necessária
🆕 capacidade nova necessária
```

| Regra | Estado atual conhecido | Ação |
|---|---|---|
| Reativação só com inscrições abertas | janela, estado e compatibilidade física revalidados | ✅ implementado |
| Cancelamento PENDENTE | participante restrito a PENDENTE | ✅ implementado |
| Cancelamento APROVADA por solicitação | solicitação persistida + análise da organização | ✅ implementado |
| CANCELADA x DESISTENTE | tentativa/ausência Follow e atividade Sumô contam como histórico | ✅ implementado |
| Pagamento antes de aprovação quando habilitado | não existe | futuro, preservar invariante |
| Prorrogação/reabertura explícita | operação auditável + histórico persistido | ✅ implementado |
| Reabertura depois de atividade competitiva | inclui ausência Follow nas verificações | ✅ implementado |
| Chave atual ao reabrir sem disputa | preservada historicamente e invalidada como atual | ✅ implementado |
| Classe física explícita das categorias Sumô | `CompetitionCategory.sumoPhysicalClass` + Flyway V9 | ✅ implementado |
| Robô híbrido na mesma classe física | Auto/R/C compatíveis compartilham o mesmo Robot | ✅ implementado |
| Mini + 3kg no mesmo robô/edição | conflito detectado em criação/edição/reativação | ✅ bloqueado |
| Follow coexistindo com Sumô no mesmo Robot | Follow ignorado na trava de classe física | ✅ implementado |
| Follow 3 tomadas × 3 tentativas | `ConfigFollow` protegido no perfil RRC + normalização V10 | ✅ implementado |
| Tempo máximo por tentativa | `maxTempoSegundos` aplicado por tentativa | ✅ implementado |
| Penalidade temporal | entrada em segundos + padrão configurável | ✅ implementado |
| Estados válidos Follow | combinações impossíveis bloqueadas no service | ✅ implementado |
| Perda de tomada por ausência | entidade/serviço próprios; sem tentativas fictícias | ✅ implementado |
| Cronômetro operacional frontend | tentativa + apresentação integrados à operação | ✅ implementado |
| Inspeção Sumô humana APTO/INAPTO | decisão humana explícita persistida e auditável | ✅ implementado no Bloco 3 |
| Peso apenas informativo | `pesoMedido` opcional e sem decisão automática | ✅ implementado no Bloco 3 |
| Mini/3kg Auto/R/C no mesmo motor | classe física + `sumoControlMode` por categoria | ✅ implementado no Bloco 3 |
| 3 rounds / 2 vitórias | configurável e protegido pelo motor | ✅ |
| Round anulado sem vitória | suportado | ✅ |
| Rounds extras justificados | condição, limite e justificativa validados no service | ✅ implementado no Bloco 3 |
| Decisão do juiz | `MatchJudgeDecision` + operação específica | ✅ implementado no Bloco 3 |
| Juiz identificado | `CompetitionJudge` vinculado à competição | ✅ implementado no Bloco 3 |
| Falha de inicialização | motivo explícito + justificativa; consequência humana | ✅ implementado no Bloco 3 |
| Geração só com inscrições encerradas | `BracketIntegrityService` exige `INSCRICOES_ENCERRADAS` | ✅ implementado no Bloco 4 |
| Regeneração só antes da atividade | round, resultado ou partida real iniciada/finalizada bloqueiam regeneração; BYE isolado não bloqueia | ✅ implementado no Bloco 4 |
| Agenda separada da árvore | horário, pista, ordem de execução e convocação separados da estrutura lógica | ✅ implementado no Bloco 4 |
| Correção segura antes da próxima partida | vencedor propagado pode ser removido/substituído enquanto a dependência está intacta | ✅ implementado no Bloco 4 |
| Correção depois de dependência iniciada | round, resultado ou estado iniciado/finalizado bloqueiam correção comum | ✅ implementado no Bloco 4 |

Checkpoint automatizado após a conclusão do Bloco 5 — encerramento da ETAPA 1:

```text
111 testes
0 falhas
0 erros
0 skipped
H2 flowtest com services/repositories reais ✅
MySQL + Flyway V12 + testdata ✅
Frontend Gestão preserva o último typecheck + build verde ✅
```

O `demo-profile` também inicializa o cenário completo contra MySQL real com os seeds alinhados ao contrato de inspeção humana e modo de controle.

---

# 18. Testes automatizados derivados deste contrato

A ETAPA 1 transformou as regras centrais em testes unitários e fluxos integrados.

## 18.1 Fluxo de inscrição/Competition

Cobrir:

- abertura de inscrições;
- criação PENDENTE;
- aprovação/rejeição;
- reativação dentro/fora da janela;
- solicitação de cancelamento de APROVADA;
- desistência com histórico;
- prorrogação antes do fechamento;
- reabertura após fechamento sem atividade;
- bloqueio após início competitivo;
- robô híbrido em duas categorias da mesma classe física;
- coexistência Follow + Sumô no mesmo robô;
- bloqueio Mini + 3 kg na mesma edição.

Os cenários unitários permanecem e o Bloco 5 adicionou `RegistrationFlowTest` com repositories reais para criação, aprovação, cancelamento e DESISTENTE após atividade competitiva.

## 18.2 Fluxo Follow

O Bloco 2 já possui testes unitários derivados das invariantes de:

```text
3 tomadas × 3 tentativas
estados válidos
limite de tempo
penalidade
não concluiu
perda por ausência
bloqueio de tentativa em tomada ausente
integração da ausência com desistência/reabertura
ranking preservado
```

O Bloco 5 adicionou `FollowCompetitionFlowTest`, cobrindo de forma integrada:

- tempo válido;
- penalidade;
- não parou corretamente;
- tentativa inválida;
- não concluiu;
- tempo acima do limite;
- perda de tomada por ausência;
- ranking pela melhor tentativa e melhor tomada.

## 18.3 Fluxo Sumô

O Bloco 3 preserva sua cobertura unitária e o Bloco 5 adicionou `SumoCompetitionFlowTest`; o profile `testdata` continua comprovando inicialização completa contra MySQL/Flyway V12.

A camada integrada do Sumô cobre diretamente:

- inspeção humana APTO/INAPTO;
- geração de chave;
- BYE;
- disputa normal;
- 2 penalidades;
- SUICIDIO_WO;
- falha de inicialização;
- round anulado;
- round extra justificado;
- decisão do juiz;
- progressão;
- campeão.

## 18.4 Integridade

Testar tentativas de quebra:

- gerar chave em estado inválido;
- incluir inscrição inapta;
- regenerar após competição iniciada;
- alterar resultado cujo vencedor já alimentou partida iniciada;
- registrar combinações impossíveis de Follow;
- registrar tentativa em tomada perdida por ausência;
- cadastrar o mesmo robô em classes físicas Mini e 3 kg na mesma edição;
- reabrir inscrições após atividade competitiva.

Para cada operação rejeitada, verificar:

```text
erro esperado
+
estado anterior preservado
+
nenhuma persistência parcial
```

---

# 19. Base para o futuro regulamento dos competidores

Na etapa de Regras, este contrato deve ser transformado em um documento público mais simples, sem detalhes de implementação.

O regulamento público deverá possuir pelo menos:

```text
1. inscrições, pagamento, cancelamento e desistência
2. identificação de equipe/robô
3. Seguidor de Linha
   - 3 tomadas
   - 3 tentativas
   - limite por tentativa
   - penalidades
   - alterações permitidas/proibidas
   - ausência
   - ranking
4. Mini Sumô Auto
5. Mini Sumô R/C
6. Sumô 3 kg Auto
7. Sumô 3 kg R/C
8. inspeção
9. rounds, penalidades e WO
10. rounds anulados/extras
11. decisão dos juízes
12. convocação, agenda e pistas
13. chaveamento e progressão
14. conduta e regras adicionais da edição
```

O texto público deve informar claramente o que o competidor pode esperar da organização, enquanto este contrato continua sendo a referência técnica do sistema.

---

# 20. Regra de manutenção

Ao alterar uma regra competitiva:

```text
1. alterar este contrato
2. revisar impacto no backend
3. revisar testes automatizados
4. revisar frontend operacional
5. revisar futuro texto público quando aplicável
```

Não manter regra competitiva importante somente em código, somente em interface ou somente em conversa.


---

# 21. Fechamento da ETAPA 1 — Bloco 5

O Bloco 5 não adicionou regra competitiva nova. Ele validou a composição dos contratos dos Blocos 1–4 usando Spring Boot, services reais e repositories JPA reais.

Suítes integradas adicionadas:

```text
CompetitionLifecycleFlowTest
RegistrationFlowTest
FollowCompetitionFlowTest
SumoCompetitionFlowTest
CompetitionIntegrityFlowTest
```

Cobertura integrada confirmada:

- ciclo normal de Competition e rejeição de transição inválida sem alteração persistida;
- criação/aprovação de Registration, cancelamento sem histórico e DESISTENTE após atividade;
- Follow com ranking, penalidade, ausência e rejeição de estado impossível;
- Sumô com inspeção humana, geração de chave, BYE, rounds, penalidades, resultado e campeão;
- correção de vencedor bloqueada quando a dependência seguinte já iniciou;
- batalha multi-round inválida com rollback integral, sem round ou resultado parcial persistido.

A suíte completa encerrou a ETAPA 1 com:

```text
111 testes
0 falhas
0 erros
0 skipped
```

O profile `flowtest` usa H2 em memória exclusivamente para os fluxos integrados rápidos. O job separado `demo-profile` continua validando MySQL real + Flyway V1–V12 + initializers.

A ETAPA 1 está concluída e validada. A ETAPA 2 permanece não iniciada até autorização explícita.
