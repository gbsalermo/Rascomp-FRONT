# Exemplo de Prompt — Dossiê Mestre de Projeto

Use este prompt como modelo reutilizável para pedir a outro chat/agente uma revisão completa de qualquer projeto e a criação de um **Dossiê Mestre técnico**.

> Este arquivo é um exemplo de prompt. Não é o dossiê do RasComp.

---

```text
Quero que você faça uma revisão completa deste projeto e crie um documento chamado:

docs/DOSSIE_PROJETO.md

A ideia é seguir o mesmo conceito de um “Dossiê Mestre”:

- mapa completo do sistema;
- documentação técnica de manutenção;
- guia de arquitetura;
- guia de “onde mexer quando quero alterar X”;
- registro de regras de negócio;
- registro de riscos, bugs e dívidas técnicas;
- referência para qualquer pessoa que for continuar o projeto no futuro.

IMPORTANTE:

Não faça um resumo superficial.
Não invente funcionalidades.
Não altere código antes de terminar a análise.
Não crie um novo roadmap se já existir um planejamento oficial.
Não considere README ou documentação antiga como verdade absoluta: confronte sempre com o código atual.
Quando documentação e código divergirem, registre a divergência.

==================================================
1. PRIMEIRO: ENTENDA TODO O PROJETO
==================================================

Antes de escrever o dossiê:

1. leia o README;
2. leia todos os arquivos de documentação;
3. identifique documentos de:
   - continuidade;
   - roadmap;
   - arquitetura;
   - entidades;
   - deploy;
   - regras;
   - API;
   - banco;
   - frontend;
   - backend;
   - mobile, se existir;
4. analise a estrutura real do repositório;
5. verifique código atual;
6. identifique stacks e versões;
7. identifique aplicações existentes;
8. identifique módulos;
9. identifique responsabilidades;
10. identifique integrações externas.

Se o projeto possuir mais de um repositório, analise todos.

==================================================
2. OBJETIVO DO DOSSIE
==================================================

O arquivo precisa conseguir responder claramente:

1. O que é este projeto?
2. Qual problema ele resolve?
3. Quais aplicações fazem parte dele?
4. Qual a arquitetura?
5. Onde fica cada funcionalidade?
6. Quem é responsável por cada regra?
7. Onde devo alterar se quiser mudar determinado comportamento?
8. Como os dados trafegam pelo sistema?
9. Como funciona o banco?
10. Como funcionam autenticação e permissões?
11. Quais regras de negócio existem?
12. Quais partes ainda estão incompletas?
13. Quais bugs ou riscos existem?
14. Quais trechos possuem dívida técnica?
15. Quais decisões ainda precisam ser tomadas?
16. O que NÃO deve ser alterado sem cuidado?
17. Como outro desenvolvedor consegue continuar o projeto?

==================================================
3. ESTRUTURA ESPERADA
==================================================

Adapte os títulos ao projeto, mas use aproximadamente esta estrutura:

# Dossiê Mestre — [NOME DO PROJETO]

## 1. Identidade do projeto

Explique:

- nome;
- objetivo;
- público;
- contexto;
- problema resolvido;
- aplicações existentes;
- repositórios envolvidos.

Inclua um mapa simples, por exemplo:

Projeto
├─ Backend
├─ Frontend
├─ Mobile
└─ Integrações

somente se essas partes realmente existirem.

--------------------------------------------------

## 2. Stack tecnológica

Documentar:

BACKEND
- linguagem;
- framework;
- versão;
- ORM;
- build;
- segurança.

FRONTEND
- framework;
- linguagem;
- bibliotecas principais;
- gerenciamento de estado;
- roteamento.

BANCO
- banco utilizado;
- migrations;
- estratégia de schema.

INFRA
- Docker;
- cloud;
- storage;
- CI/CD;
- serviços externos.

--------------------------------------------------

## 3. Estrutura dos repositórios

Explique a estrutura real:

src/
docs/
config/
controller/
service/
repository/
model/
dto/
etc.

Não apenas liste pastas.

Explique o papel de cada uma.

--------------------------------------------------

## 4. Arquitetura do sistema

Documente o fluxo predominante.

Exemplo:

Frontend
   ↓ HTTP
Controller
   ↓ DTO
Service
   ↓ regra de negócio
Repository
   ↓
Banco

Se o projeto usar outra arquitetura, documente a arquitetura REAL.

Defina também:

- o que é fonte de verdade;
- onde ficam regras;
- o que o frontend pode ou não decidir;
- responsabilidades entre aplicações.

--------------------------------------------------

## 5. Domínio e entidades

Para cada entidade principal:

### Entidade X

Responsabilidade:
...

Relacionamentos:
...

Campos importantes:
...

Regras:
...

Arquivos relacionados:
...

Exemplo:

User
├─ id
├─ email
├─ role
└─ ativo

Relacionamentos:
User 1:N ...

Não precisa copiar todos os getters/setters.
Documente o que é relevante para entender o sistema.

--------------------------------------------------

## 6. Relacionamentos importantes

Criar mapas textuais quando forem úteis.

Exemplo:

User
  ↓
Team
  ↓
Project
  ↓
Task

Explique:

- cardinalidade;
- ownership;
- dependências;
- consequências de alterar relacionamento.

--------------------------------------------------

## 7. Autenticação e autorização

Explicar:

- login;
- JWT/session;
- roles;
- permissões;
- guards;
- filtros;
- ownership;
- endpoints públicos;
- endpoints privados.

Identifique diferenças entre:

autenticação
≠
autorização
≠
ownership

Liste os arquivos responsáveis.

--------------------------------------------------

## 8. Principais módulos do sistema

Criar uma seção para cada domínio relevante.

Exemplo:

## Clientes
## Estoque
## Vendas
## Agenda
## Relatórios
## Notificações

Para cada módulo:

- objetivo;
- fluxo;
- entidades;
- services;
- controllers;
- telas;
- endpoints relevantes;
- regras;
- riscos.

--------------------------------------------------

## 9. Fluxos principais

Documentar os principais fluxos ponta a ponta.

Exemplo:

Usuário
→ cria pedido
→ backend valida
→ service processa
→ banco salva
→ gestor analisa
→ status muda
→ usuário acompanha

Mostrar os arquivos envolvidos quando isso ajudar.

--------------------------------------------------

## 10. API

Não precisa copiar Swagger inteiro.

Documentar:

- grupos de endpoints;
- divisão público/admin/usuário;
- controllers responsáveis;
- contratos importantes;
- regras de autorização;
- endpoints críticos.

--------------------------------------------------

## 11. Frontend

Documentar:

- entrypoint;
- router;
- store;
- API client;
- layouts;
- principais views;
- principais componentes.

Criar algo como:

Tela X
→ finalidade
→ API consumida
→ componentes
→ arquivos relacionados

--------------------------------------------------

## 12. Banco de dados

Explicar:

- banco atual;
- migrations;
- versão atual das migrations;
- dados que não podem ser perdidos;
- soft delete;
- constraints;
- índices relevantes;
- unicidade;
- concorrência, se houver.

Regra:

Migration já aplicada NÃO deve ser modificada.
Nova alteração deve gerar nova migration.

Somente escreva isso se realmente for o padrão do projeto.

--------------------------------------------------

## 13. Arquivos/uploads/storage

Se houver:

- imagens;
- documentos;
- vídeos;
- anexos;

explicar:

- onde são armazenados;
- limite;
- tipos permitidos;
- relação banco ↔ arquivo;
- comportamento local;
- comportamento cloud.

--------------------------------------------------

## 14. Integrações externas

Exemplo:

Telegram
Cloudflare
Email
IA
Google
APIs externas

Para cada integração:

- objetivo;
- ponto de entrada;
- segredo necessário;
- arquivos responsáveis;
- comportamento em caso de falha.

--------------------------------------------------

## 15. Configurações e variáveis de ambiente

Mapear apenas variáveis relevantes.

Exemplo:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
STORAGE_PROVIDER

Separar:

LOCAL
STAGING
PRODUÇÃO

Nunca colocar segredos reais no documento.

--------------------------------------------------

## 16. Testes

Documentar:

- testes existentes;
- o que eles cobrem;
- CI;
- comandos para executar;
- áreas sem cobertura adequada.

Não inventar número de testes.
Confira o projeto/CI antes.

--------------------------------------------------

## 17. Deploy

Se existir documentação específica de deploy:

não duplicar tudo.

Explique resumidamente e aponte para o documento específico.

Exemplo:

Deploy detalhado:
docs/DEPLOY.md

--------------------------------------------------

## 18. Riscos encontrados

Durante a revisão, procure ativamente por:

- bug de lógica;
- validação ausente;
- risco de concorrência;
- regra apenas no frontend;
- falta de autorização;
- null indevido;
- relacionamento perigoso;
- exclusão física que deveria ser lógica;
- código duplicado;
- comentário desatualizado;
- TODO antigo;
- classe não usada;
- hardcode;
- arquivo grande demais;
- responsabilidade misturada;
- endpoint inseguro;
- inconsistência entre frontend/backend;
- divergência documentação/código;
- artefato de build versionado.

Classifique quando possível:

P0 — crítico
P1 — importante
P2 — manutenção
P3 — melhoria

Não corrija automaticamente.
Primeiro documente.

--------------------------------------------------

## 19. Dívida técnica

Separar bug de dívida técnica.

Exemplos:

- arquivo muito grande;
- API client monolítico;
- CSS acumulado;
- service com responsabilidades demais;
- estrutura que funciona mas dificulta evolução.

Explique:

Problema
→ impacto
→ direção recomendada

--------------------------------------------------

## 20. Decisões ainda abertas

Crie uma seção clara:

DECISÃO PENDENTE
├─ contexto
├─ alternativas
└─ impacto

Não escolha silenciosamente regras de negócio que o código/documentação não definem.

--------------------------------------------------

## 21. O que NÃO fazer

Com base no projeto real, registre cuidados.

Exemplos:

- não alterar migration antiga;
- não decidir regra oficial só no frontend;
- não apagar histórico;
- não versionar segredos;
- não manipular diretamente tabela X;
- não misturar duas entidades conceitualmente diferentes.

--------------------------------------------------

# 22. MAPA DE MANUTENÇÃO — PARTE MAIS IMPORTANTE

Criar uma seção:

# QUERO ALTERAR X — ONDE MEXO?

Essa é uma das partes mais importantes do documento.

Exemplos:

Quero alterar LOGIN
→ arquivo X
→ service Y
→ controller Z
→ frontend A

Quero alterar regra de cadastro
→ DTO
→ Service
→ Entity
→ migration, se necessário
→ tela correspondente

Quero alterar uma regra de negócio
→ Service responsável
→ testes
→ frontend apenas para refletir a regra

Quero alterar banco
→ Entity
→ Repository
→ Migration

Quero alterar menu
→ Layout
→ Router
→ permissões

Quero alterar uma tela
→ View
→ Components
→ API client

Quero alterar upload
→ controller
→ service
→ storage
→ frontend

Faça isso para TODAS as áreas importantes do projeto.

A intenção é alguém poder pesquisar no Dossiê:

“Quero mudar X”

e descobrir rapidamente onde começar.

--------------------------------------------------

# 23. CHECKLIST PARA NOVO DESENVOLVEDOR

Crie um fluxo curto:

1. leia README;
2. leia Dossiê;
3. leia Continuidade;
4. veja roadmap;
5. configure ambiente;
6. rode testes;
7. entenda módulo que vai alterar;
8. crie branch;
9. implemente;
10. teste;
11. atualize documentação.

Adapte ao padrão real do projeto.

==================================================
4. REVISÃO DE CÓDIGO
==================================================

Durante a criação do Dossiê, faça também uma revisão estrutural.

Procure:

TODO
FIXME
HACK
comentários obsoletos
classes não utilizadas
imports inúteis
código duplicado
artefatos de build
hardcodes
regras espalhadas
views muito grandes
services muito grandes
controllers fazendo regra
queries ineficientes
possíveis N+1
problemas de ownership
falhas de autorização
estado inconsistente
migrations estranhas
configurações duplicadas.

Não faça alterações destrutivas automaticamente.

Registre no Dossiê:

PROBLEMA
LOCAL
IMPACTO
PRIORIDADE
RECOMENDAÇÃO

==================================================
5. DOCUMENTAÇÃO DESATUALIZADA
==================================================

Compare documentação com código.

Se encontrar algo como:

README diz:
“funcionalidade ainda não existe”

mas o código mostra que já existe:

registre:

DOCUMENTAÇÃO DESATUALIZADA

e indique o documento que precisa ser corrigido.

Faça o mesmo para TODOs antigos.

==================================================
6. COMENTÁRIOS NO CÓDIGO
==================================================

Identifique trechos cuja intenção não esteja clara.

Não encha o projeto de comentários óbvios.

Sugira comentários somente para:

- regra de negócio não trivial;
- algoritmo;
- decisão arquitetural;
- workaround;
- comportamento que parece estranho mas é intencional.

==================================================
7. RESULTADO ESPERADO
==================================================

Ao terminar, quero:

1. `docs/DOSSIE_PROJETO.md` criado;
2. mapa completo do sistema;
3. lista priorizada de problemas;
4. lista de decisões pendentes;
5. mapa “Quero alterar X — onde mexo?”;
6. divergências entre código/documentação;
7. cuidados de manutenção;
8. visão suficiente para outro desenvolvedor continuar o projeto.

Depois de criar o arquivo, me entregue um resumo com:

- estado geral do projeto;
- principais pontos positivos;
- principais riscos;
- P0/P1 encontrados;
- dívidas técnicas;
- documentos desatualizados;
- quais partes você NÃO alterou por dependerem de decisão de negócio.

==================================================
8. IMPORTANTE
==================================================

O Dossiê deve descrever o projeto QUE EXISTE.

Não o projeto que você acha que deveria existir.

Quando fizer uma recomendação, marque claramente:

ESTADO ATUAL
vs.
RECOMENDAÇÃO

Quando algo não puder ser confirmado:

NÃO CONFIRMADO

Quando uma regra depender de decisão:

DECISÃO PENDENTE

Quando identificar bug:

RISCO/BUG

Quando for apenas melhoria:

DÍVIDA TÉCNICA

Agora comece lendo toda a documentação e a estrutura real do projeto antes de escrever qualquer parte do Dossiê.
```

---

## Uso recomendado

Ao reutilizar este modelo em outro projeto:

1. informe os repositórios que devem ser analisados;
2. informe quais documentos são fonte de verdade, se já houver;
3. mantenha a seção **“QUERO ALTERAR X — ONDE MEXO?”**;
4. peça que o agente confronte documentação com código real;
5. não permita que o Dossiê invente roadmap ou regra de negócio sem evidência.
