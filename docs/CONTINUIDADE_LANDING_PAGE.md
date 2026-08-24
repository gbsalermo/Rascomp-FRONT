# Continuidade — Landing Page / Site Público RAS UFRB

> Documento exclusivo da aplicação pública em `landing-page/`.
>
> Este arquivo deve ser a principal referência quando o desenvolvimento da Landing for retomado.

---

# 1. Identidade correta do projeto

## RAS UFRB

É a identidade institucional pública que o site deve representar.

A Landing não será somente uma página da competição. Ela deve funcionar como o **site da IEEE Robotics & Automation Society — RAS UFRB**, capaz de continuar útil durante todo o ano.

## RRC

**RRC é o evento/competição.**

A área competitiva pública do site deve usar RRC como nome do evento e concentrar informações como:

- edição atual;
- inscrições;
- modalidades;
- regulamento;
- cronograma;
- equipes e robôs;
- acompanhamento ao vivo;
- ranking;
- chaveamentos;
- partidas;
- resultados;
- vencedores;
- histórico das edições.

## RASCOMP

**RASCOMP é o nome do programa/plataforma de software**, não o nome público do evento.

Ele engloba a solução digital que sustenta:

```text
Gestão + Backend + Camunda + experiência pública
```

Na comunicação com o visitante, a marca principal deve ser RAS UFRB e, na área do evento, RRC.

---

# 2. Estado atual e decisão de pausa

Existe atualmente uma fundação Vue 3 + TypeScript + Vite em `landing-page/` e um POC capaz de consultar dados públicos do backend.

Esse código **não define o design final**.

Ele deve ser tratado como:

```text
fundação técnica + prova de integração
```

A Landing está oficialmente **PAUSADA** enquanto o sistema de Gestão é concluído.

## Condição para retomada

O desenvolvimento real da Landing só começa depois de:

- [ ] sistema de Gestão consolidado;
- [ ] fluxos principais de organização validados;
- [ ] fluxos principais de participante validados;
- [ ] Camunda integrado aos processos definidos para o sistema;
- [ ] contratos públicos do backend revisados após essas mudanças;
- [ ] dados que precisam aparecer publicamente identificados.

Até esse ponto, não avançar em páginas finais, identidade visual definitiva ou componentes ao vivo.

---

# 3. Referência visual e estrutural principal

Referência escolhida:

```text
https://github.com/DouglasTeyh/erbase-2026-main
```

A referência será usada para estudar **arquitetura de informação, ritmo visual e experiência de site de evento**, não para copiar código, textos ou assets.

Pontos de referência aproveitáveis conceitualmente:

- navegação pública simples e direta;
- navbar e footer reutilizáveis;
- hero de grande impacto;
- possibilidade de vídeo/imagem de fundo;
- contador para o evento;
- blocos editoriais grandes e claros;
- CTAs de inscrição;
- páginas específicas para assuntos que merecem profundidade;
- programação em seção própria;
- seção de organização, apoio e parceiros;
- rodapé institucional forte;
- animações leves de entrada/scroll;
- boa separação entre conteúdo institucional e conteúdo de evento.

## O que não copiar

- código HTML/CSS/JS do ERBASE;
- identidade visual da ERBASE;
- textos;
- logos;
- imagens;
- estrutura rígida de páginas sem avaliar a necessidade da RAS/RRC.

A aplicação continuará sendo implementada em Vue 3 + TypeScript.

---

# 4. Objetivo do site público

O site deve atender simultaneamente cinco públicos.

## 4.1 Visitante institucional

Quer entender:

- o que é a RAS;
- o que a RAS UFRB faz;
- projetos;
- atividades;
- diretoria;
- eventos;
- formas de contato/participação.

## 4.2 Interessado em competir no RRC

Fluxo esperado:

```text
Home / Evento
    ↓
RRC
    ↓
Sobre + Modalidades
    ↓
Regulamento + Cronograma
    ↓
Inscrição
    ↓
Área do Participante / Gestão
```

## 4.3 Competidor inscrito

Quer localizar rapidamente:

- cronograma;
- regulamento;
- informações da edição;
- sua modalidade;
- acompanhamento do evento;
- resultados.

A edição de dados da equipe continua no sistema de Gestão, não na Landing.

## 4.4 Público acompanhando ao vivo

Fluxo prioritário durante o evento:

```text
Home
 ↓
RRC AO VIVO
 ↓
modalidade
 ├── Follow Line -> ranking / tempos
 └── Sumô        -> chave / partidas / resultados
```

## 4.5 Visitante pós-evento

Quer consultar:

- campeões;
- pódios;
- resultados;
- equipes participantes;
- robôs;
- fotos quando houver suporte;
- edições anteriores.

---

# 5. Arquitetura de informação planejada

A estrutura final será refinada antes da implementação, mas a direção inicial é:

```text
SITE RAS UFRB
│
├── /
│   ├── Hero institucional
│   ├── Destaques atuais
│   ├── Quem somos
│   ├── Projetos
│   ├── RRC em destaque
│   ├── Eventos/atividades
│   ├── Notícias/novidades (se houver fonte real)
│   ├── Diretoria
│   ├── Parceiros/apoio
│   └── Contato
│
├── /sobre
├── /projetos
├── /eventos
├── /diretoria
├── /contato
│
└── /rrc
    ├── visão geral da edição atual
    ├── sobre
    ├── modalidades
    ├── regulamento
    ├── cronograma/programação
    ├── inscrição
    ├── equipes
    ├── robôs
    ├── ao-vivo
    │   ├── follow-line
    │   └── sumo
    ├── resultados
    ├── galeria (quando backend suportar)
    └── edições anteriores
```

Essa estrutura evita transformar todo o site da RAS em um site temporário de uma edição do RRC.

---

# 6. Navegação inicial proposta

O menu deve permanecer curto.

Primeira proposta:

```text
Início
Sobre
Projetos
Eventos
RRC
Diretoria
```

CTAs separados do menu comum:

```text
[ Área do participante ]
[ Inscreva-se ]   // quando inscrições estiverem abertas
[ Ao vivo ]       // durante a competição
```

Não adicionar itens no menu somente porque existe uma seção no backend.

---

# 7. Estrutura técnica alvo

A fundação atual é Vue 3 + TypeScript + Vite.

A organização interna deverá evoluir para algo próximo de:

```text
landing-page/
├── public/
│   ├── images/
│   ├── videos/
│   └── documents/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── navigation/
│   │   ├── sections/
│   │   ├── cards/
│   │   ├── feedback/
│   │   └── live/
│   │
│   ├── layouts/
│   ├── pages/
│   │   ├── institutional/
│   │   └── rrc/
│   │
│   ├── features/
│   │   ├── competitions/
│   │   ├── teams/
│   │   ├── robots/
│   │   ├── follow-line/
│   │   └── sumo/
│   │
│   ├── services/
│   │   └── public-api/
│   ├── router/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.vue
│   └── main.ts
│
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

Não é necessário criar todos os diretórios antes de existirem responsabilidades reais.

---

# 8. Separação de conteúdo: estático x dinâmico

## Conteúdo editorial/institucional

Inicialmente pode permanecer versionado no frontend quando fizer sentido:

- apresentação da RAS UFRB;
- história;
- descrição de projetos;
- apresentação do RRC;
- regulamentos/documentos oficiais;
- informações de contato;
- diretoria, enquanto não houver necessidade de CMS;
- parceiros/apoiadores;
- textos de modalidades.

## Conteúdo operacional/dinâmico

Deve vir do backend público:

- competição/edição atual;
- status;
- categorias relacionadas à competição;
- inscrições públicas permitidas;
- equipes;
- robôs;
- competidores quando o DTO público permitir;
- ranking Follow Line;
- chaveamentos Sumô;
- partidas;
- resultados;
- vencedores;
- campeão quando derivável diretamente do estado oficial.

A Landing nunca será fonte oficial de regra competitiva.

---

# 9. Fluxo de dados

Fluxo obrigatório:

```text
Gestão
  ↓
Backend
  ↓
regras/processos
  ├── domínio Java
  └── Camunda quando aplicável
  ↓
/api/v1/public/**
  ↓
Landing
```

A Landing:

- não escreve resultado oficial;
- não gera chave;
- não decide vencedor;
- não calcula ranking oficial;
- não altera inscrição;
- não consulta endpoints administrativos para montar página pública.

Ela apenas apresenta projeções públicas autorizadas.

---

# 10. Modos da página do RRC

A experiência da página do evento deve mudar conforme a fase da edição.

Os estados exatos serão mapeados aos enums/contratos reais do backend na retomada.

## 10.1 Pré-evento

Prioridades:

- identidade da edição;
- data/local;
- contador regressivo;
- modalidades;
- regulamento;
- cronograma;
- inscrição;
- informações para participantes;
- parceiros/organização.

Hero conceitual:

```text
RRC — edição atual
Competição de Robótica da RAS UFRB

[data] • [local]

Faltam XX dias

[ Inscreva sua equipe ]
```

## 10.2 Evento em andamento

A prioridade deixa de ser vender/apresentar o evento e passa a ser **acompanhar**.

Hero/conteúdo de destaque conceitual:

```text
● RRC AO VIVO

Follow Line
ranking atualizado

Sumô
chave e partidas

[ Acompanhar competição ]
```

## 10.3 Pós-evento

Prioridades:

- campeão/campeões;
- resultados oficiais;
- pódios;
- equipes;
- robôs;
- registros da edição;
- próxima edição quando existir.

A página da edição concluída deve continuar acessível como histórico.

---

# 11. Experiência pública por modalidade

## Follow Line

Página/área pública deve priorizar leitura rápida:

- posição;
- equipe;
- robô;
- melhor resultado público disponível;
- ranking atualizado;
- status/contexto da modalidade.

Não reproduzir toda a complexidade operacional da tela de Gestão.

## Sumô

Página/área pública deve priorizar:

- chave visual;
- rodada;
- confronto;
- status da partida;
- vencedor quando confirmado;
- progressão;
- campeão.

O bracket precisa ser legível principalmente em mobile e em telas projetadas durante o evento.

---

# 12. Atualização ao vivo

MVP inicial:

```text
polling controlado
```

A frequência será definida com base em:

- custo para o backend;
- volume de público;
- velocidade necessária por modalidade;
- estabilidade da infraestrutura no evento.

SSE ou WebSocket só entram se houver benefício comprovado.

Regras obrigatórias:

- não fazer polling em páginas que não precisam;
- pausar/reduzir polling quando a aba estiver inativa quando possível;
- apresentar horário/estado da última atualização quando útil;
- tratar falha temporária sem apagar o último estado confirmado;
- nunca fabricar resultado para aparentar tempo real.

---

# 13. Identidade visual

A identidade precisa pertencer à RAS/RRC, não parecer um admin público.

## Base cromática

Cores vindas da identidade enviada para o projeto:

```text
Roxo profundo: base institucional
Rubro/vermelho: destaque e energia
Neutros claros/escuros: leitura e contraste
```

Valores atuais usados na Gestão podem servir como ponto de partida, mas **a paleta da Landing ainda não está congelada**.

## Direção visual

Inspirada em sites de eventos públicos:

- hero grande;
- fotografia/vídeo de robótica e atividades reais;
- bastante espaço em branco;
- títulos fortes;
- seções bem delimitadas;
- cards somente quando ajudam a leitura;
- uso mais contido de gradientes;
- transições suaves;
- movimento leve;
- destaque de datas/status;
- aparência institucional e tecnológica;
- mobile first.

## Evitar

- aparência de dashboard;
- excesso de cards pequenos;
- tabelas administrativas na Home;
- neon/cyberpunk exagerado;
- animações que prejudiquem leitura;
- poluição de logos no topo;
- misturar nome RASCOMP com o nome do evento RRC.

---

# 14. Design System público — itens a definir

Quando a Landing for retomada, congelar antes das páginas finais:

- [ ] cores oficiais;
- [ ] tipografia;
- [ ] escala de títulos;
- [ ] espaçamento;
- [ ] container/grid;
- [ ] breakpoints;
- [ ] botões/CTAs;
- [ ] links;
- [ ] badges de status;
- [ ] cards;
- [ ] tabelas/ranking público;
- [ ] bracket público;
- [ ] navbar;
- [ ] footer;
- [ ] hero;
- [ ] estados loading/erro/vazio;
- [ ] animações/transições;
- [ ] tratamento de imagens.

Gestão e Landing podem compartilhar a essência da marca, mas não precisam compartilhar os mesmos componentes visuais.

---

# 15. Tópicos institucionais a levantar antes da implementação

Não preencher com conteúdo inventado.

Precisamos reunir/validar:

- [ ] texto oficial sobre a RAS UFRB;
- [ ] história do capítulo;
- [ ] missão/objetivos;
- [ ] diretoria atual;
- [ ] projetos atuais;
- [ ] projetos históricos relevantes;
- [ ] eventos/oficinas;
- [ ] redes sociais;
- [ ] e-mail/contato;
- [ ] logos oficiais permitidas;
- [ ] parceiros/apoio;
- [ ] fotos autorizadas para uso;
- [ ] informações oficiais do RRC;
- [ ] data e local da edição;
- [ ] regulamento;
- [ ] modalidades;
- [ ] cronograma;
- [ ] premiação, se aplicável;
- [ ] edições anteriores.

---

# 16. Fotos e mídia

O backend atualmente oferece suporte público a fotos de robôs.

Isso não equivale a uma galeria do evento.

Para recursos como:

```text
fotos do dia
momentos da rodada
galeria da edição
álbuns
```

será necessário definir antes:

- modelo no backend ou fonte externa oficial;
- upload;
- autoria/crédito;
- legenda;
- ordem;
- visibilidade;
- otimização;
- política de armazenamento.

Não implementar uma galeria operacional falsa com arquivos estáticos se a intenção for administração contínua.

---

# 17. SEO, compartilhamento e presença pública

Como esse será o site oficial da RAS/RRC, esta camada é obrigatória antes do lançamento.

- [ ] títulos e descriptions por página;
- [ ] Open Graph;
- [ ] favicon/manifest;
- [ ] URLs estáveis;
- [ ] sitemap;
- [ ] robots.txt;
- [ ] headings semânticos;
- [ ] texto alternativo de imagens;
- [ ] cards de compartilhamento do RRC;
- [ ] informações estruturadas do evento quando aplicável;
- [ ] links permanentes para resultados/edições.

---

# 18. Acessibilidade e performance

Critérios mínimos:

- [ ] navegação por teclado;
- [ ] contraste adequado;
- [ ] foco visível;
- [ ] alt text;
- [ ] landmarks semânticos;
- [ ] `prefers-reduced-motion`;
- [ ] animações não bloqueantes;
- [ ] imagens responsivas;
- [ ] lazy loading onde fizer sentido;
- [ ] vídeos sem áudio automático;
- [ ] fallback para hero em vídeo;
- [ ] bundle controlado;
- [ ] evitar dependências grandes apenas por efeito visual.

---

# 19. Etapas oficiais da Landing

## LANDING P0 — Preparação / congelamento atual

Status: **EM ESPERA**.

- [x] Vue 3 + TypeScript + Vite existentes;
- [x] POC de consumo da API pública existente;
- [x] referência ERBASE escolhida;
- [x] separação RAS / RRC / RASCOMP definida;
- [x] arquivo de continuidade dedicado criado;
- [x] direção inicial de arquitetura de informação definida;
- [ ] Gestão finalizada;
- [ ] Camunda integrado;
- [ ] contratos públicos revisados pós-Camunda.

### Saída

Não há desenvolvimento visual final nesta etapa.

---

## LANDING 0 — Auditoria pós-Gestão + Camunda

Primeira etapa quando a Landing for retomada.

- [ ] revisar backend final;
- [ ] revisar `/api/v1/public/**`;
- [ ] mapear DTOs finais;
- [ ] mapear status da competição;
- [ ] mapear dados RRC disponíveis;
- [ ] identificar lacunas para modo ao vivo;
- [ ] identificar lacunas de histórico;
- [ ] identificar lacunas de mídia;
- [ ] decidir o que precisa ser alterado no backend antes do frontend.

### Critério de conclusão

Nenhuma tela pública depender de endpoint imaginário.

---

## LANDING 1 — Arquitetura de informação + conteúdo

- [ ] fechar sitemap;
- [ ] fechar navegação;
- [ ] separar RAS institucional de RRC;
- [ ] definir páginas da edição atual;
- [ ] definir edições anteriores;
- [ ] definir CTAs;
- [ ] levantar textos e assets oficiais;
- [ ] definir conteúdo estático/dinâmico.

### Critério de conclusão

Wireflow textual fechado antes do visual.

---

## LANDING 2 — Identidade + Design System

- [ ] paleta final roxo/rubro;
- [ ] tipografia;
- [ ] grid;
- [ ] navbar;
- [ ] footer;
- [ ] hero;
- [ ] botões;
- [ ] cards;
- [ ] status;
- [ ] ranking;
- [ ] bracket;
- [ ] loaders;
- [ ] animações;
- [ ] mobile.

### Critério de conclusão

Uma página-laboratório deve demonstrar todos os componentes principais antes da construção em massa.

---

## LANDING 3 — Fundação estrutural Vue

Objetivo: substituir/refatorar o POC para a arquitetura final.

- [ ] Vue Router;
- [ ] layouts;
- [ ] páginas institucionais;
- [ ] páginas RRC;
- [ ] componentes compartilhados;
- [ ] service público centralizado;
- [ ] tipagens;
- [ ] tratamento de erro;
- [ ] 404;
- [ ] configuração de ambiente.

Não carregar bibliotecas de administração da Gestão sem necessidade.

---

## LANDING 4 — Site institucional RAS UFRB

- [ ] Home;
- [ ] Sobre;
- [ ] Projetos;
- [ ] Eventos;
- [ ] Diretoria;
- [ ] Contato/redes;
- [ ] parceiros/apoio quando aplicável.

### Critério de conclusão

O site deve continuar fazendo sentido mesmo sem existir uma competição em andamento.

---

## LANDING 5 — RRC pré-evento

- [ ] página da edição;
- [ ] hero;
- [ ] data/local;
- [ ] countdown;
- [ ] modalidades;
- [ ] regulamento;
- [ ] cronograma;
- [ ] informações para participantes;
- [ ] CTA de inscrição;
- [ ] link para Área do Participante;
- [ ] organização/apoio.

---

## LANDING 6 — Integração pública dinâmica

- [ ] competição atual;
- [ ] status;
- [ ] categorias;
- [ ] equipes;
- [ ] robôs;
- [ ] competidores quando permitido;
- [ ] inscrições públicas quando adequado;
- [ ] estados loading/vazio/erro;
- [ ] cache/refetch controlado.

---

## LANDING 7 — RRC ao vivo

### Follow Line

- [ ] ranking;
- [ ] melhores resultados públicos;
- [ ] atualização automática;
- [ ] responsividade para celular/telão.

### Sumô

- [ ] chave;
- [ ] partidas;
- [ ] rodada;
- [ ] vencedor confirmado;
- [ ] progressão;
- [ ] campeão;
- [ ] atualização automática.

### Geral

- [ ] estado "AO VIVO" evidente;
- [ ] última atualização quando útil;
- [ ] tolerância a falha de rede;
- [ ] polling otimizado.

---

## LANDING 8 — Pós-evento + histórico

- [ ] resultados permanentes;
- [ ] campeões/pódios;
- [ ] edição encerrada;
- [ ] equipes/robôs da edição;
- [ ] edições anteriores;
- [ ] URLs permanentes;
- [ ] galeria quando houver suporte real.

---

## LANDING 9 — Consolidação e publicação

- [ ] SEO;
- [ ] acessibilidade;
- [ ] performance;
- [ ] imagens;
- [ ] mobile;
- [ ] browsers principais;
- [ ] fallback de vídeo/animação;
- [ ] 404;
- [ ] analytics somente se aprovado/necessário;
- [ ] revisão de privacidade;
- [ ] revisão de links;
- [ ] build de produção;
- [ ] deploy.

---

# 20. Mudanças obrigatórias em relação ao POC atual

Quando o trabalho for retomado:

1. não tratar a aplicação pública como "RASCOMP Landing";
2. usar **RAS UFRB** como identidade institucional;
3. usar **RRC** para o evento;
4. manter RASCOMP como nome interno/da plataforma quando necessário;
5. substituir o layout atual de demonstração por arquitetura de site público;
6. introduzir Vue Router e páginas reais;
7. separar conteúdo institucional de widgets competitivos;
8. não concentrar toda a aplicação em `App.vue`;
9. criar componentes de navegação/footer inspirados conceitualmente na referência ERBASE;
10. criar estados pré-evento, ao-vivo e pós-evento;
11. preservar a API pública como única fonte para dados competitivos da Landing.

---

# 21. Padrões obrigatórios

## API

```text
page/component
    ↓
feature/service
    ↓
public api client
    ↓
/api/v1/public/**
```

Não espalhar Axios/fetch diretamente por componentes.

## Estados de interface

Toda seção dinâmica precisa prever:

1. loading;
2. sucesso com dados;
3. sucesso sem dados;
4. erro;
5. atualização/revalidação.

## Regra competitiva

Se a Landing precisar "deduzir" quem ganhou, qual é o próximo confronto ou qual é o ranking porque o backend não fornece isso de forma confiável, **parar e corrigir o contrato do backend**.

---

# 22. O que não fazer antes da retomada

Enquanto Gestão + Camunda não forem concluídos:

- não criar página final da RAS;
- não escolher imagens definitivas;
- não congelar tipografia;
- não desenhar bracket final;
- não criar galeria do evento;
- não inventar conteúdo institucional;
- não ampliar endpoints apenas para atender um mock visual;
- não copiar o ERBASE literalmente;
- não transformar o POC atual em produção por incrementos improvisados.

---

# 23. Próxima ação da Landing

```text
AGUARDAR
Gestão concluída
    ↓
Camunda integrado
    ↓
LANDING 0 — Auditoria pós-Gestão + Camunda
```

Até lá, este documento funciona como checkpoint oficial da Landing Page / Site Público RAS UFRB.
