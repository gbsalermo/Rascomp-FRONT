# RasComp — Regras do Participante

Última revisão: **01/10/2026**

Este documento consolida as regras funcionais do Portal do Participante e serve como fonte para:

- implementação e manutenção do domínio;
- bateria de testes do Portal;
- futura interface pública **Regras do Participante**;
- textos de ajuda, onboarding e mensagens contextuais.

Ele **não é um roadmap**. A ordem de execução continua em `ETAPAS_POS_PROJETO.md`.

---

# 1. Conceitos que não devem ser misturados

O Portal trabalha com quatro relações diferentes:

```text
1. UserAccount PARTICIPANTE ↔ Team
2. Competitor ↔ inscrição individual na Competition
3. Robot ↔ RobotResponsible
4. Robot ↔ Registration na Competition/Category
```

## 1.1 Conta e equipe

Entrar em uma equipe cria/reutiliza o vínculo competitivo:

```text
UserAccount PARTICIPANTE
→ Competitor
→ Team
```

Esse vínculo não depende de pagamento ou aprovação de competição.

## 1.2 Inscrição individual

É a inscrição **da pessoa** em uma edição.

```text
Competitor + Competition
→ comprovante individual
→ PENDENTE
→ análise da GESTAO
```

## 1.3 Responsabilidade por robô

É um vínculo permanente do catálogo da equipe:

```text
Robot ↔ RobotResponsible ↔ Competitor
```

É uma relação N:N:

```text
1 Robot      → 1..N responsáveis
1 Competitor → 0..N Robots
```

## 1.4 Inscrição do robô

É a entrada do robô em uma categoria de uma edição:

```text
Robot + Competition + Category
→ comprovante do robô
→ Registration
→ PENDENTE/APROVADA/...
```

O comprovante do robô é independente do comprovante da pessoa.

---

# 2. Equipes

## 2.1 Criar equipe

Um PARTICIPANTE pode criar uma equipe quando ainda não possuir vínculo competitivo com outra equipe.

Ao criar:

- a conta torna-se líder da Team;
- é criado/reutilizado o Competitor correspondente;
- o líder administra a equipe pelo Portal.

## 2.2 Entrar em equipe existente

São suportados dois caminhos:

```text
líder convida por e-mail
→ participante aceita/rejeita
```

ou:

```text
participante solicita entrada
→ líder aprova/rejeita
```

A aprovação converge para:

```text
UserAccount → Competitor → Team
```

## 2.3 Um participante não entra automaticamente em competições

Estar na equipe não significa estar inscrito em uma Competition.

---

# 3. Minha inscrição

A área **Minha inscrição** representa somente a pessoa.

## 3.1 Ordem obrigatória

```text
PARTICIPANTE
→ faz Minha inscrição
→ envia comprovante
→ PENDENTE
```

Antes disso, o fluxo normal **Inscrever robô** fica bloqueado para aquela Competition.

## 3.2 Liberação da inscrição de robô

Não é necessário esperar a GESTAO.

```text
Minha inscrição = PENDENTE
→ já libera o cadastro da inscrição do robô
```

Também libera se estiver:

```text
APROVADA
```

Não libera se estiver:

```text
CORRECAO_SOLICITADA
REJEITADA
CANCELADA
```

## 3.3 Estados

```text
PENDENTE
APROVADA
CORRECAO_SOLICITADA
REJEITADA
CANCELADA
```

## 3.4 Correção solicitada

Quando o problema for corrigível, a GESTAO deve preferir:

```text
PENDENTE
→ CORRECAO_SOLICITADA
→ participante corrige/reenvia comprovante
→ PENDENTE
```

A correção não remove a pessoa da equipe.

---

# 4. Cadastro de robô

Cadastrar o robô e inscrevê-lo em uma competição são ações diferentes.

## 4.1 Quem cadastrou o robô

O Robot guarda:

```text
createdByUser
```

Esse dado registra historicamente quem cadastrou o robô.

Trocar o líder da equipe não altera o criador.

## 4.2 Participante comum

Quando um participante comum cadastra um robô:

```text
Robot.team = equipe atual
Robot.createdByUser = participante
RobotResponsible inicial = próprio participante
```

Os demais membros não são associados automaticamente.

## 4.3 Líder

O líder administra todos os robôs da própria Team.

Se o líder cadastrar um robô, permanece registrada a autoria daquele cadastro. Como qualquer criador Competitor, pode ser o responsável inicial e posteriormente administrar os demais responsáveis.

---

# 5. Quem pode iniciar a inscrição de um robô

## 5.1 Participante comum

Um membro comum pode iniciar a inscrição competitiva somente de Robot que ele cadastrou:

```text
Robot.createdByUser == usuário atual
```

Ser apenas `RobotResponsible` de um robô cadastrado por outra pessoa:

- permite visualizar o robô;
- permite participar dele quando elegível;
- **não** transfere o direito de iniciar/cancelar/reativar a Registration.

## 5.2 Líder

O líder pode iniciar a inscrição de qualquer Robot da própria Team.

Ainda assim, como usuário PARTICIPANTE, precisa ter iniciado sua própria inscrição individual na Competition para operar o fluxo normal de inscrição.

## 5.3 Administração de Registration pelo Portal

No fluxo do participante:

```text
administrar Registration
→ criador do Robot
OU
→ líder atual da Team
```

Responsável associado que não seja criador/líder pode visualizar o que lhe diz respeito, mas não assume automaticamente a administração da inscrição.

---

# 6. Responsáveis do robô

## 6.1 N:N

Exemplos válidos:

```text
Vespa
├─ Gabriel
├─ João
└─ Maria

Gabriel
├─ Vespa
├─ Atlas
└─ LineBot
```

## 6.2 Alteração pelo líder

O líder pode adicionar/remover responsáveis antes do início da Competition.

Essa alteração atualiza automaticamente a composição competitiva das Registrations afetadas.

---

# 7. Composição oficial de uma Registration

`RobotResponsible` e `Registration.competitors` não são a mesma coisa.

```text
RobotResponsible
= responsabilidade permanente / catálogo

Registration.competitors
= composição oficial daquela edição/categoria
```

A composição oficial é derivada dos responsáveis e da elegibilidade pessoal, com possibilidade de decisão administrativa específica da edição.

---

# 8. Elegibilidade parcial

Não é necessário que todos os responsáveis estejam aprovados para o Robot ser aprovado.

Exemplo:

```text
Vespa
├─ Gabriel → REJEITADA
├─ João    → PENDENTE
└─ Maria   → APROVADA
```

Resultado:

```text
Maria é elegível
→ Vespa pode ser APROVADO
```

Composição oficial naquele momento:

```text
Vespa / Registration
└─ Maria
```

## 8.1 Regra de decisão

```text
>= 1 responsável pessoalmente APROVADO
→ Robot pode ser APROVADO
```

```text
0 APROVADOS
+
existe responsável PENDENTE ou CORRECAO_SOLICITADA
→ Robot permanece PENDENTE
```

```text
0 APROVADOS
+
nenhum responsável recuperável
→ Robot Registration = REJEITADA automaticamente
→ motivo auditado: sem responsável elegível
```

Uma rejeição pessoal nunca apaga automaticamente o vínculo permanente `RobotResponsible`.

---

# 9. Entrada automática de novo responsável na composição

Se um responsável já vinculado ao Robot estava PENDENTE:

```text
João → PENDENTE
Vespa → APROVADO com Maria
```

e João for aprovado antes do início:

```text
João → APROVADA
→ entra automaticamente em Registration.competitors
→ Vespa continua APROVADO
→ GESTAO recebe aviso/auditoria
```

Não existe nova aprovação completa do Robot só por essa alteração.

---

# 10. Alteração de responsáveis de Robot já aprovado

Antes da competição:

```text
líder altera RobotResponsible
→ sistema sincroniza composição
→ Robot continua APROVADO quando ainda possui elegível
→ GESTAO recebe aviso
```

A organização pode:

```text
MANTER alteração
OU
VETAR alteração com justificativa
```

## 10.1 Veto de adição

Se a GESTAO veta a entrada de um novo competidor:

- o vínculo permanente pode continuar existindo para futuras edições;
- ele fica fora da composição oficial desta Registration/Competition.

## 10.2 Veto de remoção

Se a GESTAO veta uma remoção:

- a pessoa pode ser mantida no snapshot competitivo daquela edição;
- o vínculo permanente pode ter sido alterado para o futuro;
- a decisão específica da Competition fica auditada.

Por isso, depois de existir decisão administrativa, a composição oficial não precisa ser uma cópia literal instantânea de `RobotResponsible`.

---

# 11. Congelamento no início da competição

O fluxo normal deixa de alterar a composição quando:

```text
Competition.status == EM_ANDAMENTO
OU
data atual >= Competition.dataInicio
```

A partir daí:

```text
Registration.competitors
🔒 congelado
```

O líder não pode trocar competidores da prova durante a competição pelo fluxo normal.

Enquanto existir uma Competition já iniciada vinculada ao Robot, o próprio gerenciamento normal de `RobotResponsible` também fica bloqueado. Depois que a edição for FINALIZADA/CANCELADA, o catálogo permanente pode voltar a ser ajustado para competições futuras.

---

# 12. Rejeição automática e reinscrição do Robot

Se o Robot ficar sem qualquer responsável elegível:

```text
Registration
→ REJEITADA automaticamente
```

Isso não cria uma nova linha duplicada para a mesma Competition/Category/Robot.

Quando existir novamente responsável com inscrição individual `PENDENTE` ou `APROVADA`:

```text
líder
OU
criador do Robot
→ Reinscrever
→ Registration volta para PENDENTE
→ histórico preservado
```

O usuário que executa a reinscrição também precisa possuir sua própria inscrição individual iniciada na Competition.

---

# 13. Proteção especial do líder

O líder da Team não pode ter a inscrição individual rejeitada definitivamente de primeira mão sem resolver a liderança.

## 13.1 Saída A — corrigir o mesmo líder

```text
PENDENTE
→ GESTAO solicita correção
→ CORRECAO_SOLICITADA
→ líder reenvia
→ PENDENTE
```

## 13.2 Saída B — trocar o líder

A troca é exclusiva do DEV.

Novo líder precisa:

- conta PARTICIPANTE ativa;
- Competitor ativo;
- pertencer à mesma Team;
- possuir inscrição individual `PENDENTE` ou `APROVADA` na mesma Competition.

Fluxo:

```text
DEV escolhe novo líder
→ informa justificativa
→ Team.responsibleUser é alterado
→ histórico registra líder anterior, novo líder, DEV, motivo e data
→ inscrição do líder anterior pode então ser rejeitada
```

## 13.3 O que a troca de líder NÃO altera

Não muda automaticamente:

- `Robot.createdByUser`;
- histórico de autoria;
- `RobotResponsible`;
- composição já congelada;
- resultados;
- histórico de inscrições.

---

# 14. Comprovantes

Existem comprovantes separados:

```text
comprovante da pessoa
≠
comprovante da inscrição do Robot
```

Formatos atuais:

- PDF;
- JPEG;
- PNG;
- WEBP.

Limite atual:

```text
10 MB
```

---

# 15. Cancelamento

## 15.1 Inscrição do Robot PENDENTE

Pode ser cancelada diretamente pelo administrador daquela Registration no Portal.

## 15.2 Inscrição do Robot APROVADA

O participante solicita cancelamento e a organização analisa.

Se já existir atividade competitiva, o histórico pode resultar em `DESISTENTE` conforme as regras competitivas existentes.

---

# 16. Entrada manual DEV

A entrada manual continua sendo exceção operacional.

Deve:

- ser DEV-only;
- exigir justificativa;
- preservar auditoria;
- manter Team real;
- criar/reutilizar Competitor correto;
- registrar o participante selecionado como criador do Robot criado nesse fluxo;
- formalizar responsabilidade;
- preservar regras competitivas posteriores, como inspeção Sumô.

Não serve para substituir o fluxo normal do Portal.

---

# 17. Matriz resumida de permissões

| Ação | Participante comum | Líder | GESTAO | DEV |
|---|---|---|---|---|
| Fazer própria inscrição | própria | própria | — | excepcional |
| Criar Robot | equipe atual | equipe atual | — | excepcional |
| Ver Robot pelo qual é responsável | sim | sim | operação | sim |
| Iniciar Registration de Robot | somente Robot criado por ele | qualquer Robot da Team | operação administrativa | sim |
| Alterar responsáveis permanentes | não | sim | não pelo Portal | sim/admin |
| Aprovar inscrição individual | não | não | sim | sim |
| Aprovar Registration do Robot | não | não | sim | sim |
| Manter/vetar mudança de composição | não | não | sim | sim |
| Trocar líder | não | não | não | sim |

---

# 18. Mensagens recomendadas para a futura interface de regras

## Antes de Minha inscrição

> Faça sua inscrição individual para liberar a inscrição dos seus robôs. Você não precisa esperar a aprovação da organização.

## Participante associado a Robot de outra pessoa

> Você é responsável por este robô e pode acompanhar sua participação, mas a inscrição competitiva deve ser iniciada por quem cadastrou o robô ou pelo líder da equipe.

## Robot sem responsável aprovado

> Este robô está aguardando pelo menos um responsável com inscrição individual aprovada.

## Correção solicitada

> A organização solicitou uma correção na sua inscrição. Reenvie o comprovante para voltar à análise.

## Competição iniciada

> A composição desta inscrição está fechada porque a competição já começou.

---

# 19. Invariantes para implementação e testes

```text
Team membership != inscrição individual
RobotResponsible != inscrição individual
RobotResponsible != autoria do Robot
RobotResponsible != permissão automática de administrar Registration
comprovante pessoal != comprovante do Robot
```

```text
Robot.createdByUser é histórico
Team.responsibleUser é liderança atual
Registration.competitors é composição da edição
```

```text
1 aprovado já pode tornar Robot elegível
PENDENTE não bloqueia outro aprovado
REJEITADA não remove responsabilidade permanente
todos inelegíveis → Robot REJEITADO automaticamente
```

```text
antes da competição → composição sincronizável/auditável
depois do início     → composição congelada
```

---

# 20. Uso futuro

Quando for criada a interface **Regras / Ajuda do Participante**, este documento deve ser usado como fonte funcional.

A interface pública pode simplificar a linguagem, mas não deve alterar:

- ordem dos fluxos;
- permissões;
- estados;
- dependências de aprovação;
- ownership;
- congelamento da composição;
- proteção da liderança.

Mudanças futuras aprovadas no domínio devem atualizar primeiro este documento e os testes correspondentes.
