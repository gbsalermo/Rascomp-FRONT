# Continuidade — Landing Page / Site Público RAS UFRB

Última revisão: **05/10/2026**

Este documento é um **checkpoint específico da aplicação `landing-page/`**. Ele preserva decisões visuais/funcionais da Landing, mas não define a etapa global do RasComp.

Roadmap canônico:

```text
docs/ETAPAS_POS_PROJETO.md
```

Estado global:

```text
ETAPAS 0–4  ✅ concluídas / validadas
V1-BETA A   🚧 PRÓXIMA / branch própria — finalização e polimento da Landing
```

Branch de implementação da fase:

```text
v1-beta-a-landing
```

A V1-BETA A transforma a Landing já existente em um **site real, publicável, responsivo e intuitivo**, substituindo progressivamente conteúdo demonstrativo por conteúdo definitivo.

A maior parte da Landing abaixo foi consolidada para a demonstração de **26/08/2026**. Depois disso, a página 404 pública foi adicionada em **30/08/2026**.

---

# 0. Método de execução da V1-BETA A

A Beta A será executada **seção por seção**, evitando uma refatoração visual ampla sem validação.

Para cada seção:

```text
1. abrir a seção atual
2. revisar objetivo e hierarquia
3. substituir imagem/asset provisório
4. escrever/revisar texto real
5. revisar links/CTA
6. validar desktop
7. validar mobile
8. revisar acessibilidade/leitura
9. validar com o usuário
10. documentar e seguir para a próxima seção
```

Uma seção só fecha quando estiver adequada para publicação real.

Ordem-base:

```text
Header / navegação
→ Hero / destaques
→ Sobre
→ Equipe / Diretoria / Premiações
→ Robôs
→ Galeria
→ Eventos / postagens
→ Competição pública
→ Footer
→ 404 / estados auxiliares
→ revisão global desktop/mobile
```

A ordem pode ser ajustada durante a revisão, mas sem perder rastreabilidade.


## Progresso da V1-BETA A — revisão seção por seção

```text
Header / navegação       ✅ CONCLUÍDO E VALIDADO — 04/10/2026
Hero / destaques         ✅ CONCLUÍDO E VALIDADO — 04/10/2026
Sobre IEEE + RAS UFRB    ✅ CONCLUÍDO E VALIDADO — 04/10/2026
Equipe e Conquistas      ✅ CONCLUÍDO E VALIDADO — 05/10/2026
Robôs                    ✅ CONCLUÍDO E VALIDADO — 05/10/2026
Galeria                  ✅ CONCLUÍDO E VALIDADO — 05/10/2026
Footer                    ✅ CONCLUÍDO E VALIDADO — 05/10/2026
Eventos / postagens      ▶ EM REVISÃO
Competição pública       ⏳ aguardando revisão Beta A
Demais seções            ⏳ aguardando revisão Beta A
```

### Header — fechamento Beta A

O Header foi redesenhado e validado em desktop e mobile com:

- identidade IEEE RAS UFRB ampliada e legível;
- logo oficial em `/ieee-ras-official.png`;
- navegação institucional simplificada;
- itens principais: Sobre, Equipe, Robôs, Galeria, Eventos, Contato;
- área competitiva exibida quando houver competição em andamento;
- CTA permanente `Inscrever-se`;
- `VITE_GESTAO_URL` como destino configurável do CTA;
- menu mobile com CTA visível e botão hambúrguer;
- correção de conflito com CSS legado do Header;
- comportamento responsivo e escala específica da logo no mobile;
- faixa rubra condicional para competição em andamento.

Arquivos centrais:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
landing-page/src/header-identity.css
landing-page/src/App.vue
```


### Hero / Destaques — fechamento Beta A

O Hero foi redesenhado e validado em desktop com foco em hierarquia institucional e leitura simples.

Decisões finais:

- imagem real em fundo full-width, sem aparência de card flutuante;
- carrossel institucional com 4 slides:
  - IEEE RAS UFRB;
  - RAS nas Escolas;
  - Oficinas;
  - Conquistas;
- imagens centralizadas em `homeMedia.ts`;
- arquivos físicos organizados em `public/media/assets/`;
- CTA primário e secundário por slide;
- navegação por setas simples, sem círculos;
- cards inferiores de atuação mantidos como informação estática, sem redirecionamento;
- cards inferiores resumem Projetos, Oficinas, RAS nas Escolas e Competições;
- painel de `Últimas novidades` removido do Hero para evitar competição visual com a mensagem principal;
- `updates.ts` preservado para futura integração na revisão de Eventos/Postagens;
- visual final prioriza foto + mensagem + CTA + carrossel;
- responsividade do Hero preservada para revisão global final.

Arquivos centrais:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
landing-page/src/content/homeMedia.ts
landing-page/src/content/updates.ts
landing-page/public/media/assets/
```

Imagens atualmente configuradas:

```text
/media/assets/institutional/ras-ufrb-geral.jpg
/media/assets/events/ras-nas-escolas.jpg
/media/assets/events/oficina-ras.jpg
/media/assets/awards/conquista-ras.jpg
```


### Sobre IEEE + RAS UFRB — fechamento Beta A

A seção Sobre foi simplificada e validada com foco em leitura institucional e melhor encaixe na viewport.

Decisões finais:

- remoção das miniaturas secundárias e da faixa de métricas;
- composição principal em duas colunas:
  - carrossel visual institucional à esquerda;
  - conteúdo IEEE / RAS UFRB em tabs à direita;
- carrossel da seção Sobre autoalimentado por:
  `landing-page/src/assets/about/`;
- qualquer JPG/JPEG/PNG/WebP/AVIF adicionado à pasta entra automaticamente no carrossel via `import.meta.glob`;
- ordem controlável por prefixos numéricos no nome do arquivo;
- título derivado do arquivo não é exibido visualmente;
- rodapé visual fixo nas fotos: "Registro de projetos, eventos, competições e ações da IEEE RAS UFRB.";
- tipografia do painel de conteúdo ampliada para maior legibilidade;
- símbolos genéricos substituídos por ícones SVG contextuais;
- aba IEEE possui CTA único `Veja mais` apontando para `https://www.ieee.org/`;
- aba RAS UFRB mantém `Conheça nossas ações` e `Ver equipe`;
- `scroll-margin-top` aplicado para navegação correta com Header sticky;
- layout compactado para encaixar melhor em 100% de zoom;
- responsividade preservada para revisão global final.

Arquivos centrais:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
landing-page/src/assets/about/
docs/MIDIA_LANDING_BETA_A.md
```


### Equipe e Conquistas — fechamento Beta A

A antiga composição única de equipe, diretoria, robôs e premiações foi simplificada e validada como uma seção vertical de conteúdo.

Decisões finais:

- título principal: `Equipe e Conquistas`;
- seção não é forçada a caber em uma única viewport;
- Diretoria em destaque com 6 cargos:
  - Presidente;
  - Vice-presidente;
  - Tesoureiro;
  - Secretário;
  - Marketing;
  - Orientador;
- fotos da Diretoria carregadas automaticamente de:
  `landing-page/src/assets/team/board/`;
- voluntários exibidos em uma faixa horizontal automática com fotos coletivas;
- faixa de voluntários aceita múltiplas imagens de:
  `landing-page/src/assets/team/volunteers/`;
- autoplay contínuo da faixa de voluntários com pausa em hover e respeito a `prefers-reduced-motion`;
- Robôs removidos desta seção e promovidos para section própria;
- premiações reorganizadas em timeline/lista vertical;
- CTA `Ver todas as conquistas` removido;
- premiações reais atualmente registradas:
  - Vice-campeão — RCX 2024 · Hockey;
  - Campeão — ERBASE 2025 · Follow Line;
  - Campeão — IEEE 2024 · Foto Destaque;
  - Campeão — Mega Sumô 2024;
- métricas/cards antigos do rodapé removidos.

Arquivos centrais:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
landing-page/src/assets/team/board/
landing-page/src/assets/team/volunteers/
```


### Robôs — fechamento Beta A

A área de Robôs foi separada da seção de Equipe e passou a existir como section própria na Home.

Decisões finais:

- nova section com `id="robos"`;
- item `Robôs` adicionado à navegação principal do Header;
- cabeçalho institucional próprio com título `Robôs`;
- Hero superior usa uma única foto genérica fixa, independente da categoria;
- banner genérico carregado automaticamente de:
  `landing-page/src/assets/robots/banners/`;
- categorias disponíveis:
  - Sumô;
  - Mini Sumô;
  - Hockey;
  - Follow Line;
- categorias possuem ícones SVG próprios no quadrado principal do seletor;
- selecionar uma categoria altera apenas os robôs exibidos abaixo, não o banner;
- fotos individuais ficam separadas por categoria em:
  `landing-page/src/assets/robots/<categoria>/`;
- nome do arquivo define automaticamente o título do robô;
- prefixos numéricos podem ordenar arquivos sem aparecer no título;
- Hero e cabeçalho foram compactados para melhor encaixe em 100% de zoom;
- responsividade preservada para revisão global final.

Estrutura de mídia:

```text
landing-page/src/assets/robots/
├── banners/
├── sumo/
├── mini-sumo/
├── hockey/
└── follow-line/
```

Arquivos centrais:

```text
landing-page/src/components/RobotsShowcase.vue
landing-page/src/robots-showcase.css
landing-page/src/assets/robots/
landing-page/src/components/InstitutionalHeader.vue
```


### Galeria — fechamento Beta A

A seção Galeria foi redesenhada e validada como uma **vitrine de prévia** da interface completa de fotos.

Decisões finais:

- layout editorial em duas colunas;
- lado esquerdo:
  - kicker `Registros da RAS`;
  - título `Galeria`;
  - texto institucional curto;
  - CTA `Ver galeria completa`;
- lado direito:
  - carrossel de imagem grande;
  - setas discretas;
  - contador no formato `03 / 08`;
  - indicadores por pontos;
  - autoplay suave a cada ~6,5s;
  - pausa em hover;
- thumbnails adicionais não são exibidas na Landing;
- a Landing funciona apenas como vitrine, sem tentar representar todo o acervo;
- CTA aponta para a aplicação/rota completa via `VITE_GALERIA_URL`;
- em desenvolvimento, o fallback pode usar `http://localhost:5175`;
- prévias locais carregadas automaticamente de:
  `landing-page/src/assets/gallery-preview/`;
- qualquer JPG/JPEG/PNG/WebP/AVIF adicionado à pasta entra no carrossel via `import.meta.glob`;
- ordem controlável por prefixos numéricos nos arquivos;
- layout ampliado no desktop para ocupar melhor a viewport em 100% de zoom;
- mobile preservado para revisão global final.

Arquitetura definida:

```text
Landing
→ prévia visual de algumas fotos
→ Ver galeria completa
→ interface separada / acervo persistente
```

A futura Gestão de Mídia/CMS substituirá a origem local das imagens sem exigir redesenho da Home.

Arquivos centrais:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
landing-page/src/assets/gallery-preview/
landing-page/src/gallery-external.css
```


### Footer — fechamento Beta A

O Footer institucional foi simplificado e validado para publicação.

Decisões finais:

- bloco principal em fundo rubro;
- coluna institucional com logo IEEE RAS, frase institucional e referência à UFRB — Campus Cruz das Almas;
- links institucionais centrais:
  - UFRB;
  - IEEE;
  - IEEE RAS;
  - IEEE Brasil;
- bloco Apoio e parceiros com UFRB, IEEE, IEEE RAS e CETEC;
- logos de parceiros locais em:
  `landing-page/src/assets/footer/partners/`;
- contatos oficiais:
  - `ieeerasufrb@gmail.com`;
  - Instagram `@ieeerasufrb`;
  - WhatsApp `+55 73 98126-4674`;
- faixa inferior roxa reduzida a direitos autorais, crédito aos membros e crédito do desenvolvedor principal;
- `gbsalermo` aponta para o perfil GitHub;
- botão voltar ao topo removido do Footer e transformado em ação flutuante global;
- contatos podem ser sobrescritos por variáveis de ambiente em produção.

### Regra global de período de inscrições

O CTA `Inscrever-se` da Landing não deve redirecionar o visitante quando não existir competição com:

```text
status === 'INSCRICOES_ABERTAS'
```

Com inscrições abertas:

```text
Inscrever-se
→ VITE_GESTAO_URL
→ fluxo Gestão/Participante
```

Sem inscrições abertas:

```text
Inscrever-se
→ permanece na Landing
→ exibe aviso: "Não estamos no período de inscrições no momento."
```

A regra é aplicada ao Header e a CTAs de inscrição da seção Eventos.

### Competição pública — revisão Beta A em validação

A section competitiva foi redesenhada para responder quatro perguntas do visitante sem assumir aparência de dashboard administrativo:

```text
1. Que competição é essa?
2. Quem está competindo?
3. Quais categorias existem e o que está acontecendo agora?
4. Ainda posso me inscrever?
```

Comportamento atual:

- section aparece durante todo o ciclo público da competição: `INSCRICOES_ABERTAS`, `INSCRICOES_ENCERRADAS` e `EM_ANDAMENTO`;
- cabeçalho mostra nome, descrição, período, número de equipes, robôs e categorias;
- bloco de inscrição informa explicitamente se a janela está aberta/encerrada;
- lista de equipes usa apenas inscrições `APROVADA`;
- Landing passa a carregar também `/api/v1/public/equipes`;
- equipe com logo pública usa a mídia informada pelo backend;
- equipe sem logo usa `/rascomp-logo.webp` como fallback;
- fluxo integrado de logo implementado na Beta A:
  - V28 adiciona metadados de logo em `teams`;
  - líder envia/troca/remove a logo pelo Portal do Participante;
  - `PublicTeamDTO.logoUrl` abastece a Landing;
  - storage local configurável via `TEAM_LOGOS_DIR` enquanto a estratégia de produção é consolidada;
- categorias são derivadas dos dados públicos oficiais;
- card "O que está acontecendo agora?" prioriza:
  - partida `EM_ANDAMENTO`;
  - próxima partida;
  - liderança do Follow Line;
  - último resultado;
- ranking e chaveamento continuam consultáveis sob demanda;
- layout possui breakpoints específicos para tablet/mobile.

Arquivos centrais:

```text
landing-page/src/components/ActiveCompetition.vue
landing-page/src/active-competition.css
landing-page/src/App.vue
landing-page/src/api.ts
```

A section permanece **EM VALIDAÇÃO VISUAL** e só deve ser marcada como concluída após aprovação do usuário.

### Ajuste de ciclo público da competição — 05/10/2026

A competição pública não deve nascer apenas quando a Gestão muda para `EM_ANDAMENTO`.

Regra correta:

```text
PLANEJADA
→ não aparece na Landing

INSCRICOES_ABERTAS
→ section aparece
→ CTA de inscrição ativo
→ equipes/robôs aprovados começam a aparecer
→ estado principal comunica inscrições abertas

INSCRICOES_ENCERRADAS
→ section permanece
→ CTA informa inscrições encerradas
→ organização prepara participantes/chaves/agenda

EM_ANDAMENTO
→ section permanece
→ acompanhamento ao vivo, ranking, chaveamento e resultados

FINALIZADA / CANCELADA
→ sai da section ativa da Home
→ histórico ficará em fluxo próprio
```

O refresh público também permanece ativo durante os três estados visíveis, para refletir novas aprovações e participantes ainda no período de inscrição.

### Revisão especial pós-seções — modo competição

Depois da revisão individual de todas as seções da Landing, executar uma rodada específica da experiência **em época de competição**.

Objetivo:

```text
Landing institucional normal
→ modo de competição ativo
→ priorizar acompanhamento do RRC
→ avaliar mover a seção competitiva para o início da Home
→ facilitar acesso a status, cronograma, resultados e chaveamento
```

Essa decisão deve ser tomada somente depois de todas as seções estarem polidas, para comparar a hierarquia normal da Landing com a hierarquia necessária durante o evento.

## Integração com o sistema autenticado

A Landing deverá possuir CTA principal **Inscrever-se**, preferencialmente visível na navegação principal/sidebar equivalente e adaptado ao mobile.

```text
Landing
→ Inscrever-se
→ aplicação Gestão/Participante
→ cadastro/login
→ Portal
```

Usar `VITE_GESTAO_URL` ou configuração equivalente por ambiente. Nunca hardcodar domínio temporário ou localhost como destino definitivo.

## Conteúdo real nesta fase

Na V1-BETA A, quando houver material disponível, substituir placeholders por:

- fotografias reais;
- diretoria/equipe reais;
- textos reais;
- projetos/robôs reais;
- premiações reais;
- eventos/postagens reais;
- parceiros reais;
- contatos e links reais.

Não é necessário antecipar o CMS completo para publicar a Beta. Conteúdo pode permanecer versionado no frontend nesta primeira entrega, desde que seja real e organizado. O CMS continua no roadmap para retirar essa dependência posteriormente.

### Ponte temporária de mídia da Beta A

A V1-BETA A passa a usar uma estrutura manual centralizada para imagens reais:

```text
landing-page/public/media/assets/
landing-page/src/content/homeMedia.ts
```

Categorias iniciais:

```text
institutional/
events/
competitions/
awards/
robots/
```

Regras:

- a `photo-gallery/` não é a fonte canônica das imagens da Landing;
- a Galeria será consumidora/apresentação do mesmo acervo;
- componentes não devem espalhar caminhos de imagem;
- slots da Home ficam centralizados em `homeMedia.ts`;
- a futura Gestão de Mídia substituirá essa origem estática por `MediaAsset / ContentSlot / ContentItem` + storage persistente/R2;
- preservar a semântica dos slots para facilitar a migração sem redesenhar componentes.

Documento específico:

```text
docs/MIDIA_LANDING_BETA_A.md
```


### Feed de Últimas novidades

A fonte editorial continua preservada em:

```text
landing-page/src/content/updates.ts
```

Decisão visual da Beta A em 04/10/2026:

```text
Hero
→ NÃO renderiza Últimas novidades
→ prioriza foto + mensagem institucional + CTAs + carrossel
```

Motivo: o painel de novidades competia visualmente com a mensagem principal e
aproximava o Hero de uma linguagem de portal/dashboard.

O feed será retomado na revisão de **Eventos/Postagens**, onde será definida sua
posição definitiva na Landing.

Regras preservadas:

- não é simples espelho do Hero nem da seção Eventos;
- pode reaproveitar dados de `events.ts` quando a novidade corresponder a um evento;
- também aceita conteúdos sem evento associado, como nova chapa, premiação, visita, conquista ou comunicado;
- a ordem é editorial;
- no futuro, a Gestão de Mídia/CMS deverá administrar publicação, ordenação, relacionamentos e mídia opcional desse feed.

---


# 1. Identidade — decisão preservada

```text
RAS UFRB = site/identidade institucional
RRC      = evento/competição
RasComp  = software/plataforma de gestão
```

A Home representa a **IEEE RAS UFRB**. O RRC recebe destaque quando há contexto competitivo; RasComp é a plataforma que fornece os dados.

Camunda não faz parte do projeto.

---

# 2. Direção visual congelada

```text
Rubro principal        #D20F39
Rubro secundário       #CF1037
Rubro escuro           #B70C32
Roxo principal         #5D2281
Roxo interação         #6B1F8A
Texto principal        #2B2230
Cinza/borda suave      #E9E2EC
Fundo principal        #FFFFFF
```

Regras:

- fundo branco dominante;
- rubro para títulos, competição, alertas e CTA principal;
- roxo para estrutura, hover, sublinhados e CTA secundário;
- visual institucional, leve e tecnológico;
- evitar estética cyberpunk/dashboard pesado;
- Footer: bloco principal rubro + faixa final roxo profundo;
- conteúdo real substituirá placeholders via CMS.

Referência visual histórica: ERBASE como inspiração de ritmo/arquitetura, sem copiar código, textos ou assets.

---

# 3. Ordem aprovada da Home

```text
1. Header
2. Hero / Painel de Destaques
3. Sobre IEEE + RAS UFRB
4. Equipe e Conquistas
5. Robôs
6. Galeria
7. Eventos da RAS
8. Competição atual + acompanhamento [CONDICIONAL]
9. Footer institucional
```

`Edições anteriores` não faz parte da Home.

A janela competitiva aparece a partir da abertura das inscrições:

```text
INSCRICOES_ABERTAS
→ INSCRICOES_ENCERRADAS
→ EM_ANDAMENTO
```

A seção fica oculta em:

```text
PLANEJADA
FINALIZADA
CANCELADA
```

Sem competição em ciclo público:

```text
Eventos → Footer
```

---

# 4. Janelas implementadas

```text
Janela 1 — Header                           ✅
Janela 2 — Hero / Destaques                ✅
Janela 3 — Sobre IEEE + RAS                ✅
Janela 4 — Equipe/Diretoria/Robôs/Prêmios  ✅
Janela 5 — Galeria                         ✅
Janela 6 — Eventos                         ✅
Janela 7 — Competição/Acompanhamento       ✅
Janela 8 — Footer                          ✅
404 pública                                ✅ 30/08/2026
```

Componentes principais:

```text
InstitutionalHeader.vue
HighlightsHero.vue
InstitutionalAbout.vue
TeamRobotsAwards.vue
RobotsShowcase.vue
InstitutionalGallery.vue
InstitutionalEvents.vue
ActiveCompetition.vue
InstitutionalFooter.vue
PublicNotFound.vue
```

---

# 5. Competição pública

Fluxo:

```text
Gestão
→ Backend Spring Boot
→ /api/v1/public/**
→ Landing
```

A Home competitiva consome endpoints públicos para:

```text
competições
categorias
inscrições aprovadas
ranking Follow
chaves
partidas
resultados
```

Regras importantes:

- Follow usa `tempoFinalSegundos` oficial do backend;
- Sumô somente representa estado do backend;
- Landing não gera chave;
- Landing não avança vencedor;
- contadores competitivos devem usar dados públicos oficiais;
- backend permanece fonte de verdade.

Refresh configurável:

```text
VITE_REFRESH_MS=20000
```

---

# 6. Execução local

Portas padrão:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

Variáveis:

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

Scripts:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

`vite.config.ts` utiliza `node:url`, portanto o projeto possui tipagem Node configurada para evitar erro `TS2307`.

---

# 7. Página 404

Implementada em 30/08/2026.

Arquivos principais:

```text
landing-page/src/components/PublicNotFound.vue
landing-page/src/not-found.css
landing-page/src/App.vue
```

A aplicação detecta pathname público desconhecido e renderiza a experiência 404 em vez de inicializar o conteúdo normal da Home.

Essa entrega não representa avanço do roadmap pós-projeto.

---

# 8. Conteúdo ainda provisório

A estrutura visual está aprovada, mas parte de conteúdo institucional continua demonstrativo/hardcoded, como:

- fotografias;
- integrantes/diretoria;
- parte de robôs/projetos;
- premiações;
- números institucionais;
- agenda/eventos;
- parceiros;
- textos/notícias;
- alguns links/contatos.

Não continuar resolvendo isso com crescimento indefinido de hardcode Vue.

A solução planejada é a **ETAPA 8 — CMS/Mídia**:

```text
MIDIA/DEV
→ gestao
→ API CMS
→ MediaAsset / ContentSlot / ContentItem
→ Landing
```

---

# 9. Galeria

A Janela 5 da Landing existe e `photo-gallery/` também existe como app separado.

Essa separação é o estado implementado, não uma obrigação arquitetural permanente.

Na ETAPA 9 decidir:

```text
A. manter photo-gallery separado
B. absorver na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de deploy/URL independente.

Consultar:

```text
docs/CONTINUIDADE_GALERIA_FOTOS.md
```

---

# 10. Pendências futuras da Landing

Parte das pendências visuais/editoriais foi antecipada para a V1-BETA A. Funcionalidades estruturais continuam reservadas às etapas apropriadas:

## ETAPA 8 — CMS/Mídia

- conteúdo real;
- fotos/logos oficiais;
- publicação editorial;
- R2;
- remoção de hardcodes editoriais.

## ETAPA 13 — Regras, Ajuda e Segurança

- área pública com regras oficiais validadas.

## ETAPA 6/7

- exibição pública/participante de Futebol conforme domínio implementado.

## ETAPA 9 — consolidação pública

- decidir galeria;
- remover placeholders remanescentes;
- tipar contratos públicos;
- acessibilidade;
- responsividade;
- performance.

## ETAPA 14–16

- hardening;
- testes manuais;
- deploy cloud.

---

# 11. Snapshot detalhado da demonstração

Para detalhes janela a janela do estado consolidado em 26/08/2026:

```text
docs/STATUS_LANDING_PAGE.md
```

Esse arquivo deve ser tratado como snapshot histórico útil, não como planejamento global.

---

# 12. Como outra IA deve usar este arquivo

Use para:

```text
entender identidade e direção visual da Landing
entender a ordem das janelas
entender integração pública
localizar componentes centrais
saber quais conteúdos ainda são provisórios
```

Não use para:

```text
decidir qual etapa executar
iniciar CMS antecipadamente
iniciar deploy
assumir que photo-gallery continuará separado para sempre
```

Para etapa/ordem:

```text
docs/ETAPAS_POS_PROJETO.md
```

Para arquitetura cross-repo:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

Para índice completo:

```text
docs/README.md
```
