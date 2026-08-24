# Continuidade — RASCOMP Frontend

## 1. Objetivo deste documento

Este arquivo é a referência de continuidade do frontend do RASCOMP/RRC.

Ele deve registrar:

- o que já foi decidido;
- o que já foi implementado;
- o que ainda falta;
- a ordem recomendada de desenvolvimento;
- responsabilidades da Landing Page e da Gestão;
- cuidados de integração com a API;
- critérios mínimos de qualidade.

A intenção é evitar desenvolvimento aleatório de telas e manter as duas aplicações coerentes entre si.

---

# 2. Estado atual

## Fundação

- [x] Repositório frontend criado.
- [x] Definido que o repositório terá dois frontends.
- [x] Separação entre Landing Page e Gestão documentada.
- [x] README raiz criado.
- [x] `.gitignore` criado.
- [x] Arquivo de continuidade criado.
- [ ] Inicializar tecnicamente a Landing Page.
- [ ] Inicializar tecnicamente a Gestão.
- [ ] Definir identidade visual compartilhada.
- [ ] Configurar comunicação com a API.

---

# 3. Visão geral da arquitetura

```text
Rascomp-FRONT/
├── landing-page/
│   └── aplicação pública
├── gestao/
│   └── aplicação autenticada
├── docs/
│   └── documentação de continuidade
├── .gitignore
└── README.md
```

As duas aplicações devem permanecer independentes.

Elas podem compartilhar conceitos visuais, padrões de nomenclatura e decisões de UX, mas não devem ser acopladas de forma que a Landing dependa da aplicação de Gestão para funcionar.

---

# 4. Responsabilidades

## 4.1 Landing Page

Área pública e institucional.

Responsabilidades previstas:

- apresentar a RAS/UFRB;
- apresentar o RASCOMP/RRC;
- explicar a competição;
- apresentar modalidades;
- divulgar eventos;
- divulgar cronograma;
- apresentar diretoria/organização;
- contato;
- chamada para inscrições;
- direcionamento para fluxos públicos disponibilizados pela API.

A Landing deve priorizar:

- carregamento rápido;
- responsividade;
- navegação simples;
- clareza das informações;
- identidade visual forte;
- acessibilidade básica;
- boa experiência em dispositivos móveis.

## 4.2 Gestão

Área operacional e administrativa, dependente de autenticação.

Responsabilidades previstas:

- login/autenticação;
- dashboard;
- gestão de equipes;
- gestão de participantes;
- gestão de robôs;
- gestão de modalidades;
- acompanhamento de inscrições;
- acompanhamento de pagamentos/status;
- gestão de competições;
- gestão de chaves e confrontos;
- registro/acompanhamento de resultados;
- ranking.

A Gestão deve priorizar:

- clareza das ações;
- consistência de formulários;
- feedback de carregamento e erro;
- prevenção de operações duplicadas;
- proteção das rotas autenticadas;
- organização por domínio de negócio.

---

# 5. Diretrizes técnicas

## 5.1 Stack pretendida

- React;
- consumo de API REST;
- CSS organizado por aplicação;
- TailwindCSS poderá ser adotado durante a inicialização técnica, conforme o padrão visual definido;
- biblioteca de rotas para a aplicação de Gestão;
- cliente HTTP centralizado para comunicação com a API.

Nenhuma biblioteca deve ser adicionada apenas por conveniência. Cada dependência nova deve ter uma função clara no projeto.

## 5.2 Organização esperada das aplicações

Quando cada frontend for inicializado, a organização deve tender a algo como:

```text
src/
├── assets/
├── components/
├── pages/
├── services/
├── routes/
├── hooks/
├── utils/
└── styles/
```

A estrutura pode variar quando houver motivo técnico, mas páginas não devem concentrar regras de comunicação com a API.

## 5.3 Comunicação com a API

O acesso à API deve ficar centralizado em `services` ou camada equivalente.

Evitar:

```text
fetch/axios diretamente espalhado por componentes e páginas
```

Preferir:

```text
pages/components -> services -> API
```

A URL da API deve vir de variável de ambiente.

Exemplo conceitual:

```text
VITE_API_URL=http://localhost:8080
```

O valor real será definido quando a aplicação for inicializada.

---

# 6. Trilha LANDING

## LANDING 0 — Fundação técnica

Objetivo: transformar `landing-page/` em aplicação executável.

- [ ] Inicializar React.
- [ ] Configurar Vite ou ferramenta escolhida.
- [ ] Configurar estrutura de pastas.
- [ ] Configurar estilos globais.
- [ ] Definir variáveis de identidade visual.
- [ ] Criar layout principal.
- [ ] Validar execução local.

### Critério de conclusão

A Landing deve iniciar localmente sem erros e apresentar uma página base limpa.

---

## LANDING 1 — Identidade visual e navegação

Objetivo: criar a base visual pública.

- [ ] Definir paleta.
- [ ] Definir tipografia.
- [ ] Definir espaçamentos e containers.
- [ ] Criar Header.
- [ ] Criar Footer.
- [ ] Criar navegação responsiva.
- [ ] Criar botões e elementos reutilizáveis essenciais.

### Critério de conclusão

A identidade deve funcionar em desktop e mobile antes das seções de conteúdo serem expandidas.

---

## LANDING 2 — Conteúdo institucional

- [ ] Hero.
- [ ] Quem somos / RAS UFRB.
- [ ] Sobre a competição.
- [ ] Modalidades.
- [ ] Diretoria/organização.
- [ ] Contato.

---

## LANDING 3 — Eventos e cronograma

- [ ] Área de eventos.
- [ ] Cronograma da competição.
- [ ] Estados vazios quando não houver conteúdo.
- [ ] Preparar integração com API se os dados forem dinâmicos.

---

## LANDING 4 — Inscrições

- [ ] CTA claro para inscrição.
- [ ] Definir se o fluxo será interno ou redirecionado.
- [ ] Integrar com endpoints disponibilizados pelo backend.
- [ ] Estados de sucesso/erro.
- [ ] Validação dos campos públicos.

Não implementar regras de negócio no frontend que pertençam ao backend.

---

## LANDING 5 — Finalização

- [ ] Revisão de responsividade.
- [ ] Revisão de acessibilidade básica.
- [ ] Revisão de performance.
- [ ] SEO básico.
- [ ] Metadados e favicon.
- [ ] Tratamento de página/rota não encontrada, caso haja roteamento.
- [ ] Teste final dos links e CTAs.

---

# 7. Trilha GESTÃO

## GESTÃO 0 — Fundação técnica

Objetivo: transformar `gestao/` em aplicação executável e preparada para múltiplas páginas.

- [ ] Inicializar React.
- [ ] Configurar Vite ou ferramenta escolhida.
- [ ] Configurar estrutura de pastas.
- [ ] Configurar roteamento.
- [ ] Criar layout administrativo base.
- [ ] Configurar cliente HTTP.
- [ ] Configurar variáveis de ambiente.
- [ ] Validar execução local.

---

## GESTÃO 1 — Autenticação e shell da aplicação

- [ ] Tela de login.
- [ ] Persistência controlada da sessão conforme o backend.
- [ ] Rotas públicas e protegidas.
- [ ] Logout.
- [ ] Tratamento de acesso não autorizado.
- [ ] Menu lateral/header da área administrativa.

A forma de autenticação deve seguir o contrato real do backend; não presumir JWT, cookies ou perfis antes de verificar a API.

---

## GESTÃO 2 — Dashboard

Objetivo: apresentar visão geral da operação.

Possíveis indicadores dependerão dos endpoints realmente disponíveis no backend.

- [ ] Criar estrutura do dashboard.
- [ ] Estados de carregamento.
- [ ] Estados vazios.
- [ ] Estados de erro.
- [ ] Cards/indicadores somente para dados suportados pela API.

---

## GESTÃO 3 — Equipes e participantes

- [ ] Listar equipes.
- [ ] Visualizar equipe.
- [ ] Criar/editar conforme endpoints disponíveis.
- [ ] Gerenciar participantes conforme regras do backend.
- [ ] Validações de formulário alinhadas aos DTOs da API.

---

## GESTÃO 4 — Robôs e modalidades

- [ ] Listar robôs.
- [ ] Visualizar dados do robô.
- [ ] Cadastro/edição conforme contrato da API.
- [ ] Listar modalidades.
- [ ] Relacionar robôs, equipes e modalidades somente conforme regras do backend.

---

## GESTÃO 5 — Inscrições e pagamentos/status

- [ ] Listagem de inscrições.
- [ ] Filtros necessários.
- [ ] Visualização de detalhes.
- [ ] Atualização de status quando permitida.
- [ ] Pagamentos/status conforme funcionalidades reais da API.

---

## GESTÃO 6 — Competição, chaves e confrontos

- [ ] Seleção/visualização da competição.
- [ ] Chaves.
- [ ] Confrontos.
- [ ] Registro de resultados conforme backend.
- [ ] Atualização visual após alterações.
- [ ] Evitar duplicidade de ações durante requisições.

A lógica de geração e progressão das chaves deve permanecer no backend. O frontend deve representar e operar os dados fornecidos pela API.

---

## GESTÃO 7 — Resultados e ranking

- [ ] Visualizar resultados.
- [ ] Visualizar ranking.
- [ ] Filtros por competição/modalidade quando suportados.
- [ ] Estados vazios e mensagens claras.

---

## GESTÃO 8 — Finalização

- [ ] Responsividade mínima para uso operacional.
- [ ] Tratamento uniforme de erros.
- [ ] Feedback de sucesso.
- [ ] Loading/skeleton onde necessário.
- [ ] Página de acesso negado.
- [ ] Página/rota 404.
- [ ] Revisão de acessibilidade básica.
- [ ] Revisão de chamadas duplicadas.
- [ ] Revisão de formulários.

---

# 8. Padrões compartilhados

## 8.1 Identidade visual

Landing e Gestão devem parecer partes do mesmo produto.

Compartilhar conceitualmente:

- cores;
- tipografia;
- logotipo;
- bordas;
- estados de botão;
- linguagem das mensagens.

Isso não exige transformar imediatamente o repositório em monorepo com pacote de UI compartilhado. Primeiro consolidar o padrão; abstrair somente quando a duplicação justificar.

## 8.2 Estados de interface

Toda tela que depende da API deve considerar, conforme aplicável:

1. carregando;
2. sucesso com dados;
3. sucesso sem dados;
4. erro;
5. ação em processamento.

## 8.3 Formulários

Todo formulário deve:

- refletir os DTOs reais da API;
- apresentar mensagens de validação compreensíveis;
- bloquear submissões duplicadas enquanto a requisição estiver em andamento;
- preservar o máximo possível dos dados preenchidos quando ocorrer erro recuperável;
- não reproduzir no navegador regras de negócio que devem ser garantidas no backend.

## 8.4 IDs e contratos

O frontend não deve assumir nomes de campos, IDs ou formatos de resposta.

Antes de implementar um CRUD, verificar:

- endpoint;
- método HTTP;
- DTO de entrada;
- DTO de saída;
- parâmetros de rota/query;
- status HTTP esperados;
- erros de validação;
- regras de permissão.

---

# 9. Critério de qualidade por funcionalidade

Uma funcionalidade só deve ser considerada concluída quando:

- [ ] compila/executa sem erro;
- [ ] consome o endpoint correto;
- [ ] possui tratamento de loading;
- [ ] possui tratamento de erro;
- [ ] possui estado vazio quando necessário;
- [ ] impede submissões duplicadas quando aplicável;
- [ ] funciona em largura mobile razoável;
- [ ] mantém padrão visual do sistema;
- [ ] não contém regra de negócio que deveria estar no backend;
- [ ] teve o fluxo principal testado manualmente.

---

# 10. Ordem recomendada de desenvolvimento

Para evitar duas aplicações incompletas crescendo ao mesmo tempo:

1. Fundação da Landing.
2. Identidade visual compartilhada.
3. Primeira versão navegável da Landing.
4. Fundação da Gestão.
5. Autenticação/layout da Gestão.
6. Implementar módulos da Gestão seguindo os endpoints reais do backend.
7. Retornar à Landing para integrar conteúdos dinâmicos e inscrições.
8. Finalização, responsividade e revisão geral das duas aplicações.

Essa ordem pode mudar se alguma funcionalidade do backend exigir validação visual antecipada, mas qualquer alteração deve ser registrada neste arquivo.

---

# 11. Próxima etapa oficial

## Próxima tarefa

**LANDING 0 — Fundação técnica da Landing Page.**

Objetivo imediato:

```text
landing-page executando localmente com React,
estrutura limpa e layout base pronto para receber a identidade visual.
```

Após essa etapa, atualizar este documento antes de avançar.
