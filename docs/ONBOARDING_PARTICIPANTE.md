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
    ├── robô
    ├── 1 competidor responsável
    └── 0..N competidores de suporte
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

A busca visual já pode usar `/api/v1/public/equipes`, que expõe apenas dados sanitizados de identificação. A criação e decisão da solicitação dependem da evolução pós-Swagger descrita no backend em:

```text
rascomp/docs/POS_SWAGGER_USUARIOS_EQUIPES_INSCRICAO.md
```

Não substituir esse fluxo futuro por duplicação manual de dados de usuário.

## Participação competitiva

Regra revisada em 30/09/2026:

- uma conta `PARTICIPANTE` representa uma pessoa competidora;
- ao criar uma equipe, o próprio usuário é automaticamente criado/vinculado como `Competitor` da equipe;
- ao ingressar em uma equipe existente, a aprovação do vínculo deverá criar o `Competitor` correspondente;
- contas de gestão interna continuam separadas e não viram competidores;
- a inscrição competitiva continua sendo a associação do robô + categoria + competidores daquela equipe.

Experiência desejada:

```text
Nova inscrição
    ↓
selecionar competição
    ↓
selecionar categoria
    ↓
selecionar robô existente OU cadastrar robô dentro do fluxo
    ↓
selecionar 1 RESPONSÁVEL
    ↓
selecionar 0..N SUPORTES
    ↓
confirmar
```

### Responsável e suporte

`RESPONSAVEL` e `SUPORTE` são papéis da pessoa naquela inscrição/robô, não tipos permanentes de usuário.

Exemplo:

```text
Robot Vespa
├── Gabriel — RESPONSAVEL
├── João    — SUPORTE
└── Maria   — SUPORTE
```

A mesma pessoa pode assumir outro papel em outra inscrição quando a regra da competição permitir.

Um mesmo robô pode possuir dois, três ou mais integrantes associados. Isso representa melhor equipes acadêmicas em que várias pessoas desenvolvem e operam o mesmo robô.

## Robô

O `Robot` continua persistente no backend, mas o frontend não precisa exigir uma tela isolada de cadastro antes da inscrição.

O robô pode ser cadastrado dentro do wizard de inscrição e, após persistido, seu `robotId` é usado na `Registration`.

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
