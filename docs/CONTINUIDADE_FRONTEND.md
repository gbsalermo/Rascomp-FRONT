# Continuidade — RASCOMP Frontend

## 1. Objetivo

Este arquivo é a referência de continuidade dos dois frontends do RASCOMP.

Aplicações:

- `gestao/`: aplicação autenticada para PARTICIPANTE e ORGANIZACAO;
- `landing-page/`: aplicação pública institucional e de acompanhamento da competição.

Documento arquitetural principal da Gestão:

```text
docs/SYSTEM_DESIGN_GESTAO.md
```

---

# 2. Decisões congeladas neste momento

- [x] Um único repositório com duas aplicações independentes.
- [x] Backend é a única fonte de verdade.
- [x] Gestão não envia estado diretamente para a Landing.
- [x] Gestão altera o backend; Landing lê projeções públicas sanitizadas.
- [x] Gestão será desenvolvida primeiro.
- [x] System Design da Gestão criado antes da fundação técnica.
- [x] Follow Line e Sumô terão experiências operacionais diferentes.
- [x] Resultados críticos nunca serão calculados oficialmente no cliente.
- [x] Identidade visual nasce na Gestão e depois orienta a Landing.

Separação da API já prevista pelo backend:

```text
/api/v1/participante/**  -> PARTICIPANTE + ownership
/api/v1/**               -> ORGANIZACAO
/api/v1/public/**        -> público, somente leitura e sanitizado
```

---

# 3. Relação entre Gestão e Landing

A Landing não é apenas uma página institucional.

Ela será também a camada pública de acompanhamento da competição.

Fluxo correto:

```text
Gestão
  ↓
Backend
  ├── dados administrativos/autenticados
  └── dados públicos sanitizados
             ↓
          Landing
```

A Landing deverá futuramente apresentar, conforme suporte real da API pública:

- competição atual e status;
- categorias/modalidades;
- equipes e robôs participantes;
- competidores quando o DTO público permitir;
- chaveamento do Sumô;
- partidas e seus estados;
- vencedores/resultados de partidas;
- avanço da chave;
- campeão;
- ranking de Follow Line;
- resultados históricos;
- fotos públicas suportadas pelo backend.

## Lacunas já identificadas

### Fotos do dia

O backend atual suporta foto de robô, mas não existe no contrato revisado um módulo de galeria/fotos do evento.

Antes de criar uma funcionalidade real de "fotos do dia" será necessário suporte específico no backend.

### Pagamentos

Não existe contrato de pagamento no backend congelado analisado.

Não criar tela de pagamento até existir endpoint/regra real.

---

# 4. Estado atual do repositório

```text
Rascomp-FRONT/
├── landing-page/
│   └── README.md
├── gestao/
│   └── README.md
├── docs/
│   ├── CONTINUIDADE_FRONTEND.md
│   └── SYSTEM_DESIGN_GESTAO.md
├── .gitignore
└── README.md
```

## Concluído

- [x] Repositório criado.
- [x] Estrutura inicial separada.
- [x] README raiz.
- [x] README de cada frontend.
- [x] Arquivo de continuidade.
- [x] System Design da Gestão.

## Ainda não iniciado tecnicamente

- [ ] aplicação React de Gestão;
- [ ] aplicação React da Landing;
- [ ] design system visual;
- [ ] cliente HTTP;
- [ ] autenticação no frontend;
- [ ] telas de negócio.

---

# 5. Stack planejada para Gestão

Conforme `SYSTEM_DESIGN_GESTAO.md`:

```text
React
TypeScript
Vite
React Router
TanStack Query
Axios
React Hook Form
Zod
CSS variables + CSS Modules
```

Não adicionar gerenciamento global extra de estado sem necessidade concreta.

Divisão:

```text
server state -> TanStack Query
auth/session -> contexto pequeno
form state   -> React Hook Form
UI local     -> React state
```

---

# 6. Trilha GESTÃO

## GESTÃO SD — System Design

- [x] atores definidos;
- [x] fronteira Gestão/Landing definida;
- [x] arquitetura feature-based definida;
- [x] estratégia de API definida;
- [x] estratégia de server state definida;
- [x] estratégia de autenticação definida;
- [x] rotas conceituais definidas;
- [x] fluxo Follow Line definido;
- [x] fluxo Sumô definido;
- [x] propagação pública definida;
- [x] tratamento de concorrência definido.

Documento:

```text
docs/SYSTEM_DESIGN_GESTAO.md
```

---

## GESTÃO 0 — Fundação técnica

Objetivo: transformar `gestao/` em aplicação executável seguindo o System Design.

- [ ] iniciar Vite + React + TypeScript;
- [ ] configurar React Router;
- [ ] configurar TanStack Query;
- [ ] criar `httpClient` central;
- [ ] configurar `VITE_API_URL`;
- [ ] criar estrutura feature-based;
- [ ] criar providers da aplicação;
- [ ] criar layouts técnicos iniciais;
- [ ] criar tokens CSS mínimos;
- [ ] criar páginas 404/erro técnico;
- [ ] validar execução local.

### Critério de conclusão

```text
aplicação executando
+ roteamento funcional
+ QueryClient funcional
+ cliente HTTP central
+ estrutura pronta para Auth
```

Nenhuma tela de CRUD é necessária nesta etapa.

---

## GESTÃO 1 — Autenticação + shell

Backend já define JWT e os perfis `PARTICIPANTE` e `ORGANIZACAO`.

- [ ] login;
- [ ] cadastro de participante conforme contrato;
- [ ] `/auth/me`;
- [ ] armazenamento controlado da sessão;
- [ ] envio de Bearer Token;
- [ ] logout;
- [ ] tratamento de 401;
- [ ] tratamento de 403;
- [ ] `AuthenticatedRoute`;
- [ ] `RoleRoute`;
- [ ] shell PARTICIPANTE;
- [ ] shell ORGANIZACAO.

---

## GESTÃO 2 — Fluxo do PARTICIPANTE

Fluxo prioritário:

```text
Equipe
  ↓
Competidores + Robôs
  ↓
Inscrição
  ↓
Acompanhamento de status
```

- [ ] minhas equipes;
- [ ] detalhes de equipe;
- [ ] competidores da equipe;
- [ ] robôs da equipe;
- [ ] foto de robô conforme API;
- [ ] criação de inscrição;
- [ ] minhas inscrições;
- [ ] status PENDENTE/APROVADA/REJEITADA/CANCELADA/DESCLASSIFICADA;
- [ ] ownership validado pelo backend.

---

## GESTÃO 3 — Cadastros da ORGANIZACAO

- [ ] instituições;
- [ ] equipes;
- [ ] competidores;
- [ ] robôs;
- [ ] competições;
- [ ] categorias;
- [ ] ConfigFollow;
- [ ] ConfigSumo.

CRUDs devem refletir endpoints/DTOs reais.

---

## GESTÃO 4 — Inscrições administrativas

Primeiro fluxo operacional completo da organização.

- [ ] listar inscrições;
- [ ] filtros úteis;
- [ ] detalhes;
- [ ] aprovar;
- [ ] rejeitar;
- [ ] demais mudanças permitidas pelo contrato;
- [ ] feedback claro;
- [ ] impedir dupla submissão local;
- [ ] refetch após alteração.

---

## GESTÃO 5 — Centro Operacional FOLLOW_LINE

Follow não possui chaveamento.

```text
inscrição aprovada
-> tentativa
-> backend valida
-> ranking recalculado
-> refetch
```

- [ ] contexto competição/categoria;
- [ ] inscrições aprovadas;
- [ ] tomada/tentativa;
- [ ] tempo;
- [ ] checkpoints;
- [ ] penalidade;
- [ ] concluída/válida conforme contrato;
- [ ] histórico de tentativas;
- [ ] ranking atual;
- [ ] atualização após mutação;
- [ ] indicação de impacto público.

Não calcular ranking oficial no cliente.

---

## GESTÃO 6 — Centro Operacional SUMO

```text
inscrição aprovada
-> inspeção
-> aptidão
-> bracket
-> match
-> round
-> MatchResult automático
-> progressão
```

- [ ] inspeções;
- [ ] aptidão;
- [ ] geração de chave;
- [ ] visualização do bracket;
- [ ] partidas;
- [ ] operação de rounds;
- [ ] resultado da partida somente leitura;
- [ ] progressão atualizada após refetch;
- [ ] campeão;
- [ ] indicação de impacto público.

O frontend nunca deve fabricar `MatchResult`.

---

## GESTÃO 7 — Revisão da projeção pública

Objetivo: antes de desenvolver a Landing dinâmica, verificar exatamente o que a Gestão produz para `/api/v1/public/**`.

- [ ] competição pública;
- [ ] categorias;
- [ ] equipes/robôs;
- [ ] ranking Follow;
- [ ] bracket Sumô;
- [ ] partidas;
- [ ] resultados;
- [ ] campeão;
- [ ] dados sanitizados;
- [ ] identificar endpoint faltante para experiência ao vivo.

Se houver lacunas, corrigir no backend antes de criar lógica de inferência frágil na Landing.

---

## GESTÃO 8 — Consolidação

- [ ] responsividade;
- [ ] acessibilidade básica;
- [ ] loading/skeleton;
- [ ] estados vazios;
- [ ] erros uniformes;
- [ ] 401/403/404;
- [ ] conflitos 409;
- [ ] feedback de sucesso;
- [ ] revisão de chamadas duplicadas;
- [ ] revisão de formulários;
- [ ] UX para múltiplos operadores;
- [ ] revisão do Centro Operacional.

---

# 7. Trilha LANDING

A Landing será iniciada depois de os primeiros fluxos reais da Gestão definirem o domínio visual e operacional.

## LANDING 0 — System Design público

Antes de código:

- [ ] mapear todos os DTOs `/api/v1/public/**`;
- [ ] definir páginas institucionais;
- [ ] definir página da competição atual;
- [ ] definir acompanhamento ao vivo;
- [ ] definir Follow Line público;
- [ ] definir Sumô público;
- [ ] definir equipes/robôs/competidores públicos;
- [ ] definir histórico/resultados;
- [ ] decidir atualização por polling/SSE/WebSocket conforme necessidade real;
- [ ] definir política de imagens/galeria quando backend suportar.

## LANDING 1 — Fundação técnica

- [ ] React + TypeScript/Vite conforme decisão do System Design público;
- [ ] estrutura;
- [ ] cliente público da API;
- [ ] identidade visual herdada da Gestão;
- [ ] layout responsivo.

## LANDING 2 — Institucional

- [ ] Hero;
- [ ] RAS/UFRB;
- [ ] sobre o RASCOMP;
- [ ] modalidades;
- [ ] cronograma;
- [ ] organização;
- [ ] contato;
- [ ] CTA de inscrição.

## LANDING 3 — Competição pública

- [ ] competição atual;
- [ ] categorias;
- [ ] participantes públicos;
- [ ] equipes/robôs;
- [ ] estados da competição.

## LANDING 4 — Acompanhamento ao vivo

### Follow Line

- [ ] ranking;
- [ ] melhores tempos;
- [ ] atualização periódica.

### Sumô

- [ ] bracket;
- [ ] partida(s) em andamento quando inequívoco pelo backend;
- [ ] resultados de rodada/partida conforme contrato público;
- [ ] vencedores;
- [ ] progressão;
- [ ] campeão.

## LANDING 5 — Conteúdo multimídia e histórico

- [ ] resultados históricos;
- [ ] pódios;
- [ ] galeria/fotos do evento somente após suporte real no backend;
- [ ] SEO;
- [ ] performance;
- [ ] acessibilidade;
- [ ] 404.

---

# 8. Padrões obrigatórios compartilhados

## API

```text
page/component
    ↓
feature hook
    ↓
feature api/service
    ↓
http client
    ↓
backend
```

Nunca espalhar chamadas HTTP diretamente pelas telas.

## Mutações críticas

Não usar atualização otimista para:

- aprovação/rejeição;
- tentativa Follow;
- inspeção Sumô;
- geração de bracket;
- round Sumô;
- progressão/resultado.

Fluxo:

```text
mutation
-> resposta backend
-> invalidate/refetch
-> render do estado confirmado
```

## Estados de interface

Toda tela ligada à API deve considerar:

1. loading;
2. sucesso com dados;
3. sucesso vazio;
4. erro;
5. ação em andamento.

Telas ao vivo também devem tratar estado desatualizado e conflito.

---

# 9. Próxima etapa oficial

```text
GESTÃO 0 — Fundação técnica
```

O System Design foi concluído e deve ser seguido antes da implementação dos módulos de negócio.
