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

Ser membro da equipe não torna o usuário automaticamente competidor.

A participação é definida por inscrição de robô.

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
