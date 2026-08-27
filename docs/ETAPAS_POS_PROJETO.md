# RasComp — Etapas Pós-Projeto

Última atualização: **27/08/2026**

Este documento é o roteiro de evolução do RasComp após a aprovação da versão atual. A ideia é trabalhar **uma etapa por vez**, corrigindo a base antes de ampliar o sistema e preservando tudo que já foi validado.

Documentos complementares:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
→ mapa técnico: onde está cada coisa, regras, riscos e arquivos a alterar

docs/CONTINUIDADE_FRONTEND.md
→ estado funcional do frontend

docs/DEPLOY_CLOUDFLARE.md
→ guia detalhado de publicação em nuvem

backend: rascomp/docs/CONTINUIDADE.md
→ estado funcional do backend
```

Regra geral do ciclo:

```text
não reescrever o projeto
não quebrar o modo local
backend continua sendo fonte de verdade
mudanças pequenas, testáveis e reversíveis
```

---

# Direção pós-aprovação

O RasComp passa a ter estas frentes:

```text
1. estabilização da versão aprovada
2. correção de regras e riscos
3. organização técnica
4. segurança por permissões
5. comunicação com participantes
6. administração avançada
7. portabilidade institucional
8. conteúdo/mídia
9. novas modalidades
10. conclusão do participante e site público
11. hardening
12. testes manuais completos
13. deploy em nuvem
```

Objetivo de portabilidade desta rodada:

```text
backend + gestao
→ reutilizáveis por outras instituições
```

A primeira meta **não é multi-tenant**. A estratégia inicial é:

```text
1 instalação do RasComp
=
1 instituição organizadora
```

---

# ETAPA 0 — Baseline e congelamento da versão aprovada

**Descrição:** criar uma referência confiável do sistema que foi aprovado antes de iniciar as mudanças pós-projeto.

O que fazer:

- preservar comportamento atual;
- manter CI backend/frontend verde;
- não alterar migrations já aplicadas;
- registrar estado atual em continuidade/dossiê;
- separar correções de novas funcionalidades sempre que possível;
- criar checkpoints/commits claros antes das mudanças estruturais.

Resultado esperado:

```text
base conhecida
+
roadmap congelado
+
mudanças rastreáveis
```

---

# ETAPA 1 — Correções de lógica e riscos da revisão

**Descrição:** corrigir inconsistências que podem comprometer competição, histórico ou integridade antes de ampliar permissões e funcionalidades.

O que fazer:

- revisar reativação de inscrição fora da janela;
- definir cancelamento de inscrição em cada estado competitivo;
- definir estados permitidos para gerar/regenerar chave;
- proteger correção de resultado que já avançou participante;
- formalizar estados válidos de tentativa Follow;
- impedir que futuras operações administrativas deixem o sistema em estado inválido;
- adicionar testes automatizados para cada correção.

Pontos principais a revisar no dossiê:

```text
RegistrationService.reativar()
cancelamento após chave
BracketGenerationService
MatchResult + progressão
TentativaSeguidorLinha
proteção do último DEV ativo
```

---

# ETAPA 2 — Limpeza técnica e organização de código

**Descrição:** reduzir dívida técnica e código confuso antes de o sistema ganhar novos módulos.

Backend:

- remover artefatos antigos de build, especialmente `rascomp/bin/` rastreado;
- eliminar TODOs/comentários obsoletos;
- revisar código morto e classes não utilizadas;
- revisar consultas e fluxos repetidos;
- manter regras nos services;
- revisar organização de packages quando necessário.

Frontend gestão:

- dividir gradualmente `api.ts` e `types.ts` por domínio;
- quebrar views grandes quando houver ganho real;
- revisar código morto;
- reduzir duplicação entre páginas operacionais;
- revisar folhas CSS corretivas e dependência da ordem de importação.

Direção sugerida:

```text
api/
├─ auth
├─ competition
├─ registration
├─ participant
├─ follow
├─ sumo
├─ football
├─ notices
├─ media
└─ dev

types/
├─ auth
├─ competition
├─ participant
├─ follow
├─ sumo
├─ football
├─ notices
└─ media
```

---

# CHECKPOINT PÓS-ETAPA 2 — README e apresentação visual do projeto

Este checkpoint **não é uma nova etapa do roadmap**. Ele acontece depois da ETAPA 2, quando a revisão lógica e a limpeza técnica já estiverem concluídas, antes de iniciar a mudança estrutural de permissões da ETAPA 3.

Objetivo:

```text
registrar visualmente a versão estabilizada
+
finalizar a apresentação do projeto no GitHub
```

O que fazer:

- gerar capturas de tela atualizadas do RasComp já revisado e limpo;
- priorizar telas que representem o sistema real, como Dashboard/Central, inscrições, Follow Line, Sumô/chaves e Portal do Participante;
- selecionar imagens limpas, legíveis e sem dados sensíveis;
- organizar os arquivos em local adequado do repositório para documentação;
- adicionar as capturas ao `README.md` do frontend para apresentar visualmente o sistema;
- revisar o README como página de apresentação do projeto após inserir as imagens;
- não alterar funcionalidades apenas para produzir screenshots.

Resultado esperado:

```text
README do GitHub finalizado visualmente
+
versão estabilizada documentada com imagens reais do sistema
```

---

# ETAPA 3 — Nova matriz de permissões

**Descrição:** substituir o modelo atual de `ORGANIZACAO/PARTICIPANTE` pela divisão real de responsabilidades aprovada pela equipe.

Roles:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

## DEV

- acesso total;
- cria/edita/desativa competição;
- altera permissões;
- executa manutenção estrutural;
- corrige inscrições;
- transfere competidor/robô/responsabilidade;
- acessa Gestão, Mídia e Ajustes Gerais.

## GESTAO

- opera competição;
- Follow;
- Sumô;
- inspeções;
- tomadas/tentativas;
- rounds/batalhas;
- chaves/resultados permitidos;
- avisos operacionais quando autorizado;
- **não cria competição**;
- não executa manutenção estrutural DEV.

## MIDIA

- gestor editorial;
- conteúdo da Landing;
- mídia/galeria;
- tópicos e slots;
- sem acesso automático às operações competitivas.

## PARTICIPANTE

- própria equipe;
- integrantes permitidos;
- robôs/fotos;
- inscrições;
- desempenho;
- avisos destinados ao participante.

Implementar segurança em duas camadas:

```text
backend → autorização real
frontend → navegação e UX compatíveis
```

Nunca considerar menu oculto como segurança.

---

# ETAPA 4 — Avisos ao participante

**Descrição:** criar comunicação operacional rápida entre organização e participantes, inicialmente dentro do próprio RasComp e futuramente com Telegram.

Nesta etapa, manter o roadmap enxuto e **buscar os detalhes técnicos/regras no Dossiê Mestre**:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

Objetivo mínimo:

```text
GESTAO/DEV publica aviso
→ participante visualiza no sistema
→ histórico fica preservado
```

Futuro previsto:

```text
Aviso
├─ IN_APP
└─ TELEGRAM opcional
```

Telegram deve ser somente canal complementar; o aviso persistido no RasComp continua sendo a fonte de verdade.

---

# ETAPA 5 — Ajustes Gerais DEV + auditoria

**Descrição:** substituir intervenções diretas no banco por operações administrativas seguras e auditáveis, exclusivas de DEV.

Criar ações específicas, por exemplo:

```text
alterar role
ativar/desativar usuário
transferir competidor
transferir robô
trocar responsável da equipe
corrigir inscrição
reativar entidade
corrigir associação administrativa
```

Não criar editor genérico de tabela/SQL.

Cada ação deve possuir:

```text
endpoint específico
service específico
validação de domínio
autorização DEV
auditoria
```

Auditoria deve registrar, quando aplicável:

```text
quem executou
ação
entidade
antes
depois
data/hora
motivo/observação
```

---

# ETAPA 6 — Portabilidade para outras instituições

**Descrição:** permitir que outra universidade/instituição instale backend + gestão sem precisar editar Java/Vue para trocar identidade básica.

Estratégia:

```text
uma instalação
=
uma instituição organizadora
```

Não confundir configuração da instituição hospedeira com `Institution`, que representa a instituição de uma equipe participante.

Criar conceito próprio, por exemplo:

```text
PlatformInstanceConfig
```

Avaliar configurações:

```text
nome
sigla
logos
contatos
links
identidade visual
nome do evento padrão
textos administrativos
parâmetros operacionais
```

O que fazer:

- remover hardcodes institucionais do núcleo de backend/gestão;
- criar configuração da instância;
- criar fluxo de primeiro DEV;
- documentar instalação limpa;
- documentar variáveis de ambiente;
- validar uma instalação com identidade fictícia de outra instituição.

Multi-tenancy fica fora deste ciclo.

---

# ETAPA 7 — Gestor de Mídia / CMS

**Descrição:** permitir que MIDIA/DEV administrem a Landing sem alterar arquivos Vue ou realizar commits para cada notícia/foto e, ao final da etapa, deixar a Landing operacional com identidade e imagens reais.

Criar dentro de `gestao/`:

- tópicos;
- publicação/despublicação;
- ordenação;
- títulos/textos/CTA;
- upload de mídia;
- associação da mídia a uma janela lógica;
- galeria;
- conteúdo institucional permitido.

Também faz parte da conclusão desta etapa:

- subir as logos institucionais reais necessárias à Landing;
- subir fotos reais da RAS UFRB/RRC que serão usadas nas áreas públicas;
- substituir placeholders e imagens provisórias pelos assets definitivos disponíveis;
- cadastrar/associar essas imagens pelo fluxo de mídia/CMS sempre que o módulo já suportar o caso;
- validar Hero, áreas institucionais, equipes/robôs/premiações, eventos e galeria com conteúdo visual real;
- confirmar responsividade e carregamento dos assets;
- deixar a Landing utilizável e apresentável com logos e fotos reais, mesmo que a consolidação arquitetural completa da Landing/Galeria continue reservada para a ETAPA 11.

Modelo de referência:

```text
MediaAsset
→ arquivo / R2

ContentSlot
→ janela lógica da Landing

ContentItem
→ conteúdo associado ao slot
```

Exemplos de slots:

```text
HERO_MAIN
HERO_NEWS
ABOUT
TEAM
AWARDS
GALLERY
EVENTS
COMPETITION_HIGHLIGHT
```

Reaproveitar `ObjectStorageService` + Cloudflare R2. Não criar terceiro mecanismo de upload.

Resultado visual mínimo da etapa:

```text
Landing operacional
+
logos reais
+
fotos reais
+
conteúdo visual administrável pelo fluxo de mídia quando aplicável
```

---

# ETAPA 8 — Módulo de Regras

**Descrição:** criar área pública com regras organizadas em cards expansíveis, mantendo conteúdo editorial separado das regras executadas pelo backend.

Estrutura inicial:

```text
Follow Line
Sumô
├─ geral
├─ RC
├─ penalidades
└─ desclassificação/WO
Futebol de Robôs
Ambiente / Vestimenta
```

O que fazer:

- validar texto oficial com a organização;
- criar visual público expansível;
- permitir edição editorial por MIDIA/DEV quando adequado;
- deixar claro quando uma regra textual também exige implementação técnica no backend;
- não inventar sanções não aprovadas.

---

# ETAPA 9 — Futebol de Robôs

**Descrição:** adicionar a nova modalidade em que o participante pode competir usando robôs disponibilizados pela organização, sem exigir robô próprio cadastrado.

Conceito:

```text
participante A × participante B
robô fornecido A × robô fornecido B
```

Impacto principal:

```text
Registration.robot
→ hoje obrigatório
→ precisa se tornar opcional conforme modalidade
```

O que fazer:

- adicionar `FUTEBOL` em modalidade;
- definir regras oficiais antes da migration;
- adaptar Registration/DTO/request/validações;
- definir duplicidade por modalidade;
- decidir se equipe é obrigatória;
- decidir placar/duração/empate/desempate/penalidades;
- avaliar reaproveitamento de `Match`/`MatchResult`/chaves;
- criar interface operacional;
- integrar participante e landing;
- adicionar testes automatizados.

Não criar robôs fictícios apenas para satisfazer FK.

---

# ETAPA 10 — Completar Portal do Participante

**Descrição:** transformar a primeira versão demonstrável em um portal realmente utilizável do cadastro à competição.

Completar:

- convite/aceite para equipe;
- integrantes;
- robôs;
- fotos;
- criação de inscrições;
- adaptação para Futebol;
- avisos;
- histórico competitivo;
- acompanhamento de competição;
- estados vazios/loading/erro;
- responsividade;
- feedback das ações.

## Identificação competitiva da inscrição

Adicionar um identificador curto e único para cada **inscrição competitiva** aprovada, funcionando como número de inscrição/número de corrida para conferência operacional do participante ou robô.

A referência deve pertencer à `Registration`, e não diretamente ao `Robot`, porque o mesmo robô pode participar de categorias ou edições diferentes e modalidades futuras podem não exigir robô próprio.

Fluxo pretendido:

```text
inscrição aprovada
→ backend gera código/número competitivo único
→ participante visualiza o identificador no portal
→ GESTAO visualiza o mesmo identificador nas telas operacionais
→ conferência física pode usar nome/foto do robô + código da inscrição
```

Objetivo:

```text
cadastro no RasComp
+
identificador competitivo apresentado no evento
=
dupla conferência da inscrição correta
```

Na implementação, definir:

- formato legível e curto do código;
- unicidade e escopo do identificador;
- momento exato da geração;
- comportamento em cancelamento, reativação e correções administrativas;
- exibição no Portal do Participante;
- exibição nas telas de GESTAO de inscrição, inspeção, Follow e Sumô quando aplicável;
- possibilidade futura de representar o mesmo identificador em QR Code, sem tornar QR obrigatório nesta primeira versão;
- migration V8+ se o identificador precisar ser persistido em `Registration`;
- testes automatizados de geração, unicidade e preservação do código.

O código é uma camada adicional de conferência e **não substitui** as validações de inscrição, ownership, categoria, elegibilidade ou inspeção feitas pelo backend.

Ownership continua obrigatório no backend.

---

# ETAPA 11 — Consolidar Landing + Galeria + conteúdo público

**Descrição:** terminar a experiência pública conectando resultados competitivos, CMS, regras e galeria em uma arquitetura única e fácil de manter.

Hoje:

```text
landing-page/
photo-gallery/
```

Decidir:

```text
A. manter galeria separada
ou
B. absorver galeria na Landing
```

Direção preferencial: **B**, salvo motivo real para deploy/URL independente.

A Landing deverá consumir:

```text
API pública competitiva
+
API pública CMS
+
API pública regras
+
mídias publicadas
```

Conteúdo editorial comum não deve exigir commit depois do CMS.

---

# ETAPA 12 — Hardening e preparação para uso externo

**Descrição:** revisar segurança, operação, recuperação e documentação antes de considerar o RasComp pronto para uso real por outras instituições.

Revisar:

- autorização endpoint por endpoint;
- mensagens de erro;
- logs e auditoria;
- CORS;
- segredos/configurações;
- upload/storage;
- migrations do zero;
- migrations sobre banco existente;
- backup/restore;
- primeiro DEV;
- instalação/upgrade;
- `testdata` bloqueado em produção;
- hardcodes institucionais;
- acessibilidade/responsividade básica;
- indisponibilidade da API;
- indisponibilidade de Telegram/R2;
- concorrência em operações críticas;
- rollback de mudanças administrativas.

---

# ETAPA 13 — Bateria final de testes manuais

**Descrição:** simular o uso real do sistema inteiro antes do deploy, indo além dos testes automatizados e das telas isoladas.

Não detalhar cada caso ainda. Manter como requisito obrigatório de encerramento.

A bateria deverá envolver, entre outras áreas:

```text
instalação/configuração
cadastros
logins
perfis/permissões
equipes
participantes
robôs
fotos
inscrições
aprovação/rejeição/cancelamento
competições em vários estados
Follow Line
Sumô
Futebol de Robôs
chaves/BYEs/progressão
resultados/histórico
Avisos
Telegram quando implementado
Ajustes Gerais
auditoria
mídias/uploads
CMS
Landing
galeria
regras
ativação/desativação/reativação
simulações de falhas/contratempos
uso concorrente
competição completa
fluxo completo de participante
fluxos DEV/GESTAO/MIDIA
instalação com identidade de outra instituição
```

Objetivo:

```text
validar o RasComp como produto operacional
```

---

# ETAPA 14 — Deploy em nuvem / Cloudflare

**Descrição:** criar uma segunda forma de execução, em produção na nuvem, sem remover nem alterar o modo local que já funciona.

Regra desta etapa:

```text
LOCAL continua funcionando como hoje
+
CLOUD passa a existir como configuração/deploy separado
```

Arquitetura recomendada e passos detalhados estão em:

```text
docs/DEPLOY_CLOUDFLARE.md
```

Escopo planejado:

```text
Cloudflare DNS/TLS
Cloudflare Workers Static Assets → gestao + landing
Cloudflare Containers + Docker → backend Spring Boot
Cloudflare R2 → mídias e uploads persistentes
segredos → Worker Secrets/Secrets Store
MySQL persistente → provedor gerenciado externo inicialmente
CI/CD → GitHub Actions/Cloudflare
custom domains
backup/restore
observabilidade
smoke tests pós-deploy
rollback
```

Importante: Cloudflare D1 usa semântica SQLite, enquanto o RasComp atual usa MySQL + JPA/Hibernate + Flyway. Migrar para D1 é uma frente separada e não será requisito do primeiro deploy.

O deploy só começa **depois da bateria manual final passar**.

---

# Ordem congelada de execução

```text
ETAPA 0  Baseline
    ↓
ETAPA 1  Correções de lógica
    ↓
ETAPA 2  Limpeza técnica
    ↓
CHECKPOINT README + screenshots da versão estabilizada
    ↓
ETAPA 3  Permissões
    ↓
ETAPA 4  Avisos
    ↓
ETAPA 5  Ajustes Gerais + auditoria
    ↓
ETAPA 6  Portabilidade institucional
    ↓
ETAPA 7  Gestor de Mídia / CMS + Landing com logos/fotos reais
    ↓
ETAPA 8  Regras
    ↓
ETAPA 9  Futebol de Robôs
    ↓
ETAPA 10 Participante completo + identificação competitiva
    ↓
ETAPA 11 Landing + Galeria
    ↓
ETAPA 12 Hardening
    ↓
ETAPA 13 Bateria manual completa
    ↓
ETAPA 14 Deploy Cloudflare
```

Pequenos ajustes de ordem podem ocorrer quando uma dependência real for descoberta, mas não pular etapas estruturais para chegar mais rápido às telas novas.

---

# Critério para concluir qualquer etapa

Uma etapa só pode ser marcada como concluída quando tiver, conforme aplicável:

```text
regra definida
backend implementado
migration aplicada quando necessária
testes automatizados relevantes
frontend integrado
permissão correta
tratamento de erro
documentação atualizada
validação local
CI verde
```

Evitar marcar funcionalidade como concluída apenas porque a tela apareceu.

---

# Regra de continuidade

Quando uma etapa for iniciada:

1. revisar a etapa neste documento;
2. consultar o Dossiê Mestre;
3. confirmar decisões ainda abertas;
4. implementar backend primeiro quando houver regra de negócio;
5. adicionar/ajustar testes;
6. integrar frontend;
7. validar localmente;
8. atualizar documentação/continuidade;
9. marcar a etapa como concluída somente após validação.

Não avançar silenciosamente deixando decisões de domínio pendentes na etapa anterior.
