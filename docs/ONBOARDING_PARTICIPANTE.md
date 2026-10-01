# Onboarding do Participante — RASCOMP Gestão

## Decisão de produto

O primeiro acesso separa claramente conta, equipe e participação competitiva.

```text
Criar conta
    ↓
UserAccount PARTICIPANTE
    ↓
Minha equipe
    ↓
Você já tem equipe?
    ├── NÃO → Criar equipe → usuário vira líder
    └── SIM → Buscar equipe → solicitar entrada → líder aprova/reprova
    ↓
Equipe pronta
    ↓
Nova inscrição
    ├── competição/categoria
    ├── robô gerenciável pelo participante
    ├── responsáveis permanentes pré-selecionados
    └── competidores daquela Registration ajustáveis
```

## Conta

O cadastro inicial cria somente o usuário.

Campos atuais suportados pelo backend:

- nome;
- e-mail;
- telefone opcional;
- senha.

O endpoint `/api/v1/auth/register` retorna JWT e permite iniciar a sessão imediatamente.

## Equipe

Se o usuário não possui equipe, o portal oferece dois caminhos.

### Criar equipe

O usuário informa nome e instituição. O criador é o responsável/líder da equipe conforme o contrato atual do backend.

### Já tenho equipe

O usuário pesquisa pelo nome da equipe ou instituição, seleciona a equipe e solicita entrada.

Fluxo alvo:

```text
buscar equipe
    ↓
selecionar
    ↓
solicitar entrada
    ↓
líder recebe solicitação
    ├── aprovar → usuário vira MEMBER
    └── rejeitar
```

A busca visual usa `/api/v1/public/equipes`, que expõe apenas dados sanitizados de identificação. O fluxo real de solicitação/convite já está implementado no BLOCO 4.1 e converge para o mesmo vínculo competitivo, sem duplicação manual de dados de usuário.

## Participação competitiva

Regra revisada em 30/09/2026:

- uma conta `PARTICIPANTE` representa uma pessoa competidora;
- ao criar uma equipe, o próprio usuário é automaticamente criado/vinculado como `Competitor` da equipe;
- ao ingressar em uma equipe existente, a aprovação do vínculo deverá criar o `Competitor` correspondente;
- contas de gestão interna continuam separadas e não viram competidores;
- a inscrição competitiva continua sendo a associação do robô + categoria + competidores daquela equipe.

Experiência implementada no BLOCO 4.3:

```text
Nova inscrição
    ↓
selecionar competição com inscrições abertas
    ↓
selecionar robô gerenciável
    ↓
selecionar categoria compatível
    ↓
responsáveis permanentes vêm pré-selecionados
    ↓
ajustar competidores específicos da Registration
    ↓
confirmar
    ↓
Registration = PENDENTE
```

### Responsabilidade permanente x composição da Registration

Não existe papel persistido `RESPONSAVEL/SUPORTE` dentro da Registration atual.

São conceitos diferentes:

```text
RobotResponsible
→ vínculo permanente Robot ↔ Competitor
→ define responsabilidade cotidiana pelo robô

Registration.competitors
→ composição daquela inscrição específica
→ pode ser ajustada entre competidores ativos da mesma equipe
```

Exemplo:

```text
Robot Vespa
responsáveis permanentes: Gabriel + João

Registration Vespa / Follow
competidores: Gabriel + Maria
```

João continua responsável permanente pelo robô mesmo sem participar daquela Registration. Maria participa daquela inscrição sem virar responsável permanente do robô.

## Robô

O `Robot` continua persistente no backend. No BLOCO 4.3, o participante cadastra o robô pelo Portal e depois o seleciona no fluxo de **Nova inscrição**.

- líder visualiza/administra todos os robôs da equipe;
- membro comum visualiza e inscreve apenas robôs pelos quais é responsável;
- quem cria um robô vira responsável inicial;
- o cadastro do robô não depende de aprovação organizacional.

## Recuperação de senha

A rota/tela existe para preservar a experiência esperada de login, porém a funcionalidade real só será ativada quando houver endpoint e política de recuperação no backend.


## Revisão de onboarding — 30/09/2026

Fluxo canônico:

```text
Criar conta PARTICIPANTE
        ↓
Criar equipe OU ingressar em equipe existente
        ↓
Conta vinculada automaticamente a Competitor da equipe
        ↓
Cadastrar robôs da própria equipe
        ↓
Inscrever robô em competição/categoria
        ↓
Selecionar competidores da mesma equipe
```

A criação de equipe não depende de uma lista fechada de instituições. O usuário pode selecionar uma instituição existente ou cadastrar a própria instituição informando nome/sigla e dados opcionais.

O cadastro manual DEV de participante/robô é exceção operacional. Ele nunca deve permitir escolher uma equipe arbitrária: a equipe é derivada do `Competitor` já associado à conta PARTICIPANTE.


## Responsabilidade por robô — regra canônica para o BLOCO 4

O robô pertence à equipe, mas pode possuir **um ou mais competidores responsáveis**.

Modelo conceitual:

```text
Team
 ├─ Competitor
 └─ Robot
      └─ RobotResponsible (N:N)
           └─ Competitor
```

Regras:
- líder da equipe administra todos os robôs, independentemente de ser responsável;
- ser líder **não** torna automaticamente o usuário responsável por todos os robôs;
- competidor comum visualiza em **Meus robôs** os robôs em que está associado como responsável;
- um robô pode ter 1, 2, 3 ou mais responsáveis da mesma equipe;
- responsabilidade pelo robô é vínculo estável da equipe;
- participação em uma inscrição é vínculo específico da competição e permanece em `RegistrationCompetitor`;
- ao criar uma inscrição, os responsáveis do robô podem vir pré-selecionados, mas a composição daquela inscrição pode ser ajustada segundo a regra da categoria.

Fluxo principal de entrada em equipe:
1. líder busca a conta do participante por login/e-mail;
2. envia convite;
3. participante aceita;
4. sistema cria `Competitor` vinculado à conta e à equipe;
5. líder pode associá-lo a robôs existentes ou novos.

Também deve existir o caminho inverso: participante encontra uma equipe e solicita entrada; o aceite do líder produz o mesmo vínculo.


## Cadastro de robô x aprovação competitiva — regra canônica do BLOCO 4

Não confundir **existência do robô na equipe** com **participação do robô em uma competição**.

Fluxo oficial:

```text
PARTICIPANTE associado a uma equipe
        ↓
cria/cadastra robô da equipe
        ↓
robô existe no catálogo da equipe
        ↓
participante escolhe competição/categoria disponível
        ↓
seleciona um robô da equipe pelo qual possui responsabilidade/permissão
        ↓
envia Registration
        ↓
Registration = PENDENTE
        ↓
GESTAO aprova/rejeita
        ↓
APROVADA → robô oficialmente alocado naquela competição/categoria
```

Regras:

- criar um `Robot` **não exige aprovação da organização**;
- o que exige aprovação da organização é a `Registration`;
- enquanto a inscrição estiver `PENDENTE`, o robô não é participante oficial daquela competição;
- somente após `APROVADA` o robô passa a integrar operação, filas, chave, ranking e resultados da competição;
- um mesmo robô pode existir no catálogo da equipe sem estar inscrito em competição alguma;
- o mesmo robô pode participar de diferentes edições/categorias conforme as regras e inscrições aprovadas;
- participante líder ou membro competitivo da equipe pode cadastrar robô conforme permissão do Portal;
- ao criar um robô, o criador pode ser associado como responsável inicial; o líder da equipe pode administrar os responsáveis;
- líder continua com visão administrativa de todos os robôs da equipe;
- membro comum vê como "Meus robôs" os robôs pelos quais é responsável;
- a organização não escolhe os responsáveis internos do robô: ela aprova a inscrição competitiva.

A entrada manual DEV permanece exceção operacional e pode criar uma `Registration` aprovada diretamente com justificativa/auditoria.


## Implementação BLOCO 4 — checkpoint 01/10/2026

Implementado:
- 4.1: fluxo real de convite/aceite;
- 4.1: fluxo real de solicitação/aprovação;
- 4.1: vínculo automático UserAccount → Competitor → Team;
- 4.2: estrutura persistida de responsáveis por robô;
- 4.2: criador como responsável inicial;
- 4.2: edição de responsáveis pelo líder;
- 4.2: visibilidade "Meus robôs" baseada em responsabilidade;
- 4.3: listagem de competições com inscrições abertas no Portal;
- 4.3: líder inscreve qualquer robô da equipe e membro comum inscreve robôs sob sua responsabilidade;
- 4.3: responsáveis permanentes vêm pré-selecionados;
- 4.3: composição da Registration pode ser ajustada entre competidores ativos da mesma equipe;
- 4.3: envio cria Registration `PENDENTE`;
- 4.3: Portal informa explicitamente **Aguardando aprovação da organização**;
- 4.3: aprovação/rejeição continua no fluxo administrativo existente;
- 4.3: somente Registration `APROVADA` é exposta como participação oficial;
- 4.3: duplicidade, janela, ownership e compatibilidade continuam validados no backend.

Estado: **4.3 implementado e aguardando validação manual. 4.4 não iniciado.**
