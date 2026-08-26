# Continuidade — Landing Page / Site Público RAS UFRB

> Documento exclusivo da aplicação pública em `landing-page/`.
>
> Este arquivo é a referência principal para continuidade da Landing.

---

# 1. Identidade correta

## RAS UFRB

É a identidade institucional principal do site.

A Home deve representar o capítulo IEEE Robotics & Automation Society da UFRB durante todo o ano. O visitante deve entender a equipe, atuação, projetos, robôs, premiações, eventos, ações de extensão e competições promovidas pela RAS.

## RRC

RRC é o evento/competição. Deve ganhar bastante destaque quando houver edição ativa, mas **não deve dominar a identidade institucional da Home**.

## RASCOMP

RASCOMP é o software/plataforma de gestão. Não é o nome do evento e não deve substituir a identidade RAS UFRB na Landing.

```text
RAS UFRB = instituição/capítulo
RRC      = evento/competição
RASCOMP  = plataforma/software
```

Camunda permanece fora da arquitetura.

---

# 2. Estratégia atual de desenvolvimento

A Landing possui uma fundação Vue 3 + TypeScript + Vite e um POC antigo de integração pública com o backend.

O POC anterior não define o design final. A Landing começou agora uma fase de **construção visual janela por janela**, mesmo enquanto a consolidação do ADMIN continua em outro fluxo.

Regra de trabalho:

```text
1. definir uma janela
2. implementar a janela
3. registrar a decisão neste arquivo
4. gerar uma demonstração visual
5. só então seguir para a próxima janela
```

Integrações competitivas completas e validações públicas finais continuam dependentes da consolidação do Gestão/backend.

---

# 3. Referência visual

Referência estrutural escolhida anteriormente:

```text
https://github.com/DouglasTeyh/erbase-2026-main
```

Usar como referência de arquitetura de informação, navegação, ritmo, footer institucional e organização de evento — sem copiar código, textos ou assets.

Direção visual aprovada:

- fundo branco predominante;
- roxo para estrutura/institucional;
- rubro para CTA, competição e pontos de destaque;
- cinzas muito claros para separar áreas;
- bastante espaço em branco;
- aparência institucional e tecnológica;
- evitar visual cyberpunk/pesado;
- evitar aparência de dashboard;
- fotos reais serão adicionadas depois; placeholders ou ausência de imagens são aceitáveis durante a construção.

---

# 4. Arquitetura da Home — janelas aprovadas

A Home institucional será construída nesta ordem:

```text
HEADER
│
├── 1. HERO / PAINEL DE DESTAQUES
│
├── 2. SOBRE IEEE + RAS
│
├── 3. GALERIA
│
├── 4. EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES
│
├── 5. EVENTOS PROMOVIDOS PELA RAS
│
├── 6. [CONDICIONAL] COMPETIÇÃO ATUAL
│       ├── 7. CRONOGRAMA DA COMPETIÇÃO
│       └── 8. ACOMPANHAR COMPETIÇÃO
│
├── 9. EDIÇÕES ANTERIORES
│
├── faixa curta de novidades quando houver conteúdo real
│
└── 12. FOOTER INSTITUCIONAL
```

A numeração acompanha as decisões da conversa original. Notícias não terão uma grande janela própria: entram prioritariamente no Hero/painel e, no máximo, em uma faixa curta.

---

# 5. HEADER — APROVADO E IMPLEMENTADO

Status: **PRIMEIRA VERSÃO IMPLEMENTADA — aguardando validação local futura**.

Arquivos:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
landing-page/src/App.vue
landing-page/src/main.ts
```

## Estrutura aprovada

```text
[ IEEE RAS UFRB ]   Início   Sobre   Competição ▾   Calendário   Eventos   Contato   [ Inscrições ]
```

### Marca

- identidade principal: IEEE RAS UFRB;
- não exibir RRC ao lado da marca;
- não usar RasComp como marca principal do Header;
- asset oficial definitivo será substituído depois;
- por enquanto foi criada representação textual/provisória para não bloquear desenvolvimento.

### Menu principal

```text
Início
Sobre
Competição ▾
Calendário
Eventos
Contato
```

### Dropdown Competição

```text
Competição atual
Cronograma
Resultados
Chaveamento
Edições anteriores
```

Cronograma e Resultados ficam dentro de `Competição`, e não no nível principal da navegação.

### Calendário

Representa calendário institucional amplo da RAS, incluindo por exemplo:

- visitas em escolas;
- oficinas;
- competições;
- ações de extensão;
- atividades do capítulo.

### Eventos

Área para eventos promovidos ou organizados pela RAS, como:

- RRC;
- Robodori;
- RAS nas Escolas;
- oficinas;
- outros eventos futuros.

### CTA de inscrições

O botão `Inscrições` é contextual e só aparece quando a competição pública retornada pelo backend estiver com status `INSCRICOES_ABERTAS`.

### Aviso de competição ativa

Quando existir competição com status `EM_ANDAMENTO`, uma faixa institucional pequena aparece acima do Header:

```text
RRC em andamento · <nome da edição>                         Acompanhar competição →
```

Objetivo: permitir que o visitante pule para a área competitiva sem transformar o Header em um site do RRC.

### Responsividade

- desktop: navegação horizontal;
- mobile/tablet: menu hambúrguer;
- dropdown de competição adaptado ao menu mobile;
- CTA de inscrições entra no menu no mobile.

### Direção visual

- fundo branco;
- altura aproximada de 70–78px;
- borda inferior neutra clara;
- roxo como cor institucional de hover/seleção;
- rubro para CTA;
- sticky no topo;
- faixa de competição ativa usa gradiente roxo → rubro, mas é estreita e discreta.

---

# 6. PRÓXIMA JANELA — HERO / PAINEL DE DESTAQUES

Ainda não implementada.

Conceito já aprovado:

O Hero não será um banner estático do RRC. Deve funcionar como **painel editorial vivo da RAS UFRB**, semelhante ao slider existente na landing de fotografia do usuário.

Possíveis slides:

- apresentação breve da RAS;
- evento acontecendo agora;
- visita às escolas;
- oficina;
- participação em competição/evento;
- premiação;
- projeto atual;
- chamada para RRC;
- chamada de inscrição;
- notícia relevante.

Estrutura base de cada slide:

```text
categoria
Título
Resumo curto
[ Ver mais ]
+ imagem/foto quando disponível
```

Pode haver abaixo do slide principal uma faixa discreta com outros destaques recentes.

Se houver competição RAS/RasComp ativa, deve existir desde o Hero uma forma clara de pular para a janela de competição atual.

---

# 7. SOBRE — conceito aprovado

Após o Hero, a área Sobre apresentará IEEE e RAS UFRB.

Layout pretendido:

```text
[ slide quadrado de fotos ]    [ IEEE ] [ RAS UFRB ]
                               texto alternável
```

O slide da esquerda poderá mostrar:

- equipe;
- premiações;
- eventos;
- projetos;
- oficinas;
- ações em escolas.

As abas/títulos `IEEE` e `RAS UFRB` trocam o texto sem trocar de página.

---

# 8. GALERIA — posição aprovada

A galeria entra cedo na Home, após o Sobre ou imediatamente depois da área institucional inicial.

Preferência por filtros:

```text
Todos
RRC
Oficinas
RAS nas Escolas
Premiações
Eventos
```

A fonte e gestão das imagens ainda serão definidas. Imagens definitivas não são requisito para construir o layout.

---

# 9. EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES — conceito aprovado

Substitui a ideia simples de uma faixa de números.

Bloco principal:

```text
[ Equipe ] [ Diretoria ]       ROBÔS
lista visual de integrantes    lista expansível

                               PREMIAÇÕES
                               lista expansível
```

### Equipe/Diretoria

- alternância por dois botões/tabs;
- integrante em card compacto;
- hover/expansão aumenta a foto;
- mostra nome e modalidade/área;
- diretoria pode mostrar função.

### Robôs

Itens expansíveis com:

- foto;
- modalidade;
- ano;
- descrição;
- competições;
- resultados relevantes.

### Premiações

Itens expansíveis com:

- colocação;
- evento;
- data;
- equipe;
- robô;
- modalidade;
- descrição.

---

# 10. EVENTOS DA RAS — conceito aprovado

Eventos promovidos pela RAS terão cards/barras horizontais expansíveis.

Eventos citados:

```text
RRC
Robodori
RAS nas Escolas
Oficinas
```

Ao expandir:

- descrição;
- objetivo;
- público;
- periodicidade;
- fotos;
- edições;
- link para página específica quando existir.

---

# 11. COMPETIÇÃO ATUAL — CONDICIONAL

Essa janela só aparece quando existir uma competição pública da RAS gerenciada pelo RasComp.

Se não houver competição aplicável:

```text
não renderizar a seção
```

Quando houver:

```text
COMPETIÇÃO ATUAL
RRC 20XX
status
modalidades
equipes
robôs
inscrições
próximas partidas
chave
ranking
resultados
[ Acompanhar competição ]
```

A Landing nunca calcula regras competitivas oficiais.

---

# 12. CRONOGRAMA DA COMPETIÇÃO

Só aparece no contexto de competição atual quando houver dados aplicáveis.

Linha institucional simples:

```text
Inscrições → Homologação → Chaves → Inspeção → Eliminatórias → Finais
```

---

# 13. ACOMPANHAR COMPETIÇÃO

Área dinâmica ligada ao RasComp.

Tabs planejadas:

```text
Ao vivo
Partidas
Chave
Ranking
Resultados
```

Dados vêm da API pública e o backend permanece fonte de verdade.

---

# 14. EDIÇÕES ANTERIORES

Manter histórico por ano/edição.

Cada edição pode apresentar:

- resumo;
- campeões;
- modalidades;
- fotos;
- resultados;
- chaveamento quando disponível.

---

# 15. NOTÍCIAS / NOVIDADES

Não haverá inicialmente uma grande seção de notícias.

Prioridades:

1. notícias/destaques dentro do slider do Hero;
2. opcionalmente uma faixa curta de novidades em outra parte da Home;
3. só criar página/seção robusta se houver fonte real e rotina de atualização.

---

# 16. FOOTER — conceito aprovado

Seguir a lógica institucional da ERBASE, sem copiar visual ou código.

Estrutura:

```text
RAS UFRB
logo + descrição + redes

LINKS INSTITUCIONAIS
Sobre
Equipe
Diretoria
Projetos
Eventos

COMPETIÇÃO
RRC
Regulamentos
Resultados
Edições anteriores

APOIO E PARCEIROS
UFRB
IEEE
IEEE RAS
CETEC
patrocinadores futuros

CONTATO
e-mail
Instagram
localização
```

Fundo roxo profundo, com detalhes rubros discretos.

---

# 17. Conteúdo estático x dinâmico

## Institucional/editorial

Pode permanecer inicialmente no frontend:

- apresentação IEEE/RAS;
- história;
- eventos;
- projetos;
- equipe/diretoria;
- premiações;
- informações de robôs;
- parceiros;
- contato;
- textos institucionais.

## Dinâmico

Deve vir do backend público quando aplicável:

- competição ativa;
- status;
- categorias;
- inscrições;
- equipes/robôs participantes;
- ranking Follow Line;
- chaveamento Sumô;
- partidas;
- resultados;
- vencedores;
- campeão;
- histórico competitivo quando suportado.

---

# 18. Fluxo de dados competitivo

```text
Gestão
  ↓
Backend Spring Boot
  ↓
/api/v1/public/**
  ↓
Landing
```

A Landing:

- não escreve resultado;
- não gera chave;
- não decide vencedor;
- não calcula ranking oficial;
- não altera inscrição;
- não fabrica estado público.

---

# 19. Stack

```text
Vue 3
TypeScript
Vite
```

Estrutura alvo continua componentizada, com separação de componentes institucionais e áreas dinâmicas do RRC.

---

# 20. Checklist imediato

## Header

- [x] estrutura definida;
- [x] componente criado;
- [x] dropdown Competição;
- [x] Calendário/Eventos no menu principal;
- [x] CTA Inscrições contextual;
- [x] faixa condicional de competição em andamento;
- [x] responsividade inicial;
- [ ] substituir marca provisória pelo asset oficial IEEE RAS/UFRB;
- [ ] validar localmente desktop;
- [ ] validar localmente mobile;
- [ ] ajustar após feedback visual.

## Próximo

- [ ] definir e implementar Hero/painel de destaques;
- [ ] gerar demo visual do Hero;
- [ ] registrar decisão neste arquivo antes de avançar.

---

# 21. Regra de continuidade

Não pular janelas.

A próxima tarefa oficial da Landing é:

```text
JANELA 2 — HERO / PAINEL DE DESTAQUES DA RAS UFRB
```

Antes de avançar para Sobre, o Hero deve estar estruturalmente definido, implementado, documentado e demonstrado visualmente.
