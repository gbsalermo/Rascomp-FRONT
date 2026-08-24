# RASCOMP Frontend

Frontend do projeto RASCOMP/RRC, organizado em duas aplicações independentes dentro do mesmo repositório:

- **Landing Page**: área pública e institucional da RAS/UFRB e da competição.
- **Gestão**: área autenticada para operação e administração da competição.

## Estrutura do repositório

```text
Rascomp-FRONT/
├── landing-page/
│   └── README.md
├── gestao/
│   └── README.md
├── docs/
│   └── CONTINUIDADE_FRONTEND.md
├── .gitignore
└── README.md
```

A estrutura interna de cada aplicação (`src`, `components`, `pages`, `services`, `routes`, `assets` etc.) será criada na etapa de inicialização técnica de cada frontend. Isso evita instalar ou duplicar dependências antes de definirmos o primeiro fluxo real de cada aplicação.

## 1. Landing Page

Responsável pela presença pública do projeto.

Escopo previsto:

- apresentação da RAS/UFRB e do RASCOMP;
- apresentação da competição;
- modalidades;
- eventos;
- cronograma;
- diretoria/organização;
- contato;
- informações e chamada para inscrições.

A landing deve ser leve, responsiva, visualmente consistente e independente da área administrativa.

## 2. Gestão

Responsável pelos fluxos autenticados do sistema da competição.

Escopo previsto:

- autenticação e controle de acesso;
- dashboard;
- equipes;
- participantes;
- robôs;
- modalidades;
- inscrições;
- pagamentos/status;
- competições;
- chaves/confrontos;
- resultados e ranking.

## Arquitetura

Os dois frontends compartilham a mesma identidade visual e consomem a mesma API REST, porém permanecem separados para evitar que regras, autenticação e dependências da gestão afetem a landing page.

A intenção técnica do projeto é utilizar **React** no frontend, com uma camada de serviços responsável pela comunicação com a API. A adoção/configuração de TailwindCSS e demais bibliotecas será feita durante a inicialização de cada aplicação, de forma controlada e documentada.

## Documentação de continuidade

O desenvolvimento deve seguir o arquivo:

```text
docs/CONTINUIDADE_FRONTEND.md
```

Ele registra decisões, etapas concluídas, próximos passos e critérios de qualidade para que as duas aplicações evoluam sem perder o contexto do projeto.

## Backend

Este repositório contém apenas os frontends. Regras de negócio, persistência, autenticação e processamento da competição pertencem à API/backend do RASCOMP/RRC.
