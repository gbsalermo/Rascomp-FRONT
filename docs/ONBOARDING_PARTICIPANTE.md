# Onboarding do Participante — RASCOMP Gestão

## Decisão de produto

O primeiro acesso deve separar claramente conta, equipe e participação competitiva.

```text
Criar conta
    ↓
UserAccount PARTICIPANTE
    ↓
Dashboard / Minha equipe
    ↓
Criar equipe ou ingressar em equipe
    ↓
Equipe pronta
    ↓
Nova inscrição
    ├── competição/categoria
    ├── robô
    └── membros que competirão
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

Se o usuário não possui equipe, o portal deve oferecer `Criar equipe`.

O criador é o responsável/líder da equipe conforme o contrato atual do backend.

A inclusão de outros usuários na mesma equipe ainda depende da evolução pós-Swagger descrita no backend em:

```text
rascomp/docs/POS_SWAGGER_USUARIOS_EQUIPES_INSCRICAO.md
```

Não substituir esse fluxo futuro por duplicação manual de dados de usuário.

## Participação competitiva

O participante efetivo de uma modalidade é definido no contexto da inscrição.

A experiência desejada é:

```text
Nova inscrição
    ↓
selecionar competição
    ↓
selecionar categoria
    ↓
selecionar robô existente OU cadastrar robô dentro do fluxo
    ↓
selecionar membros da equipe que competirão com o robô
    ↓
confirmar
```

Um mesmo robô pode possuir vários competidores associados por meio da inscrição.

O frontend não deve exigir uma tela isolada de cadastro de robô antes da inscrição; o cadastro pode ser incorporado ao wizard e persistido pelo endpoint existente antes da criação da `Registration`.

## Recuperação de senha

A rota/tela já existe na Gestão para preservar a experiência esperada de login, porém a funcionalidade real só deve ser ativada quando houver endpoint e política de recuperação no backend.
