# Continuidade — Landing Page / Site Público RAS UFRB

> Documento principal de continuidade da aplicação pública em `landing-page/`.
> Atualizar este arquivo ao concluir cada janela da Home.

---

# 1. Identidade correta

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Home é o site institucional da RAS UFRB. O RRC ganha destaque quando houver contexto competitivo, mas não domina a identidade da página durante todo o ano.

Camunda está fora do projeto.

---

# 2. Direção visual aprovada

Referência de arquitetura/ritmo: ERBASE, sem copiar código, textos ou assets.

Direção:

- fundo branco dominante;
- aparência institucional, leve e tecnológica;
- roxo como estrutura institucional;
- rubro para CTAs, competição e destaques;
- cinzas claros para separar áreas;
- bastante espaço em branco;
- fotografia real quando o acervo oficial estiver disponível;
- transições suaves;
- evitar cyberpunk, aparência de dashboard e excesso de cards pequenos.

Imagens, logos e números podem permanecer como placeholders até o material oficial ser fornecido.

---

# 3. Método de desenvolvimento — CONGELADO

A Home será construída janela por janela.

Cada janela precisa de:

```text
1. implementação em landing-page/
2. atualização deste arquivo
3. demo visual
4. revisão de fidelidade: demo aprovada = alvo da implementação
```

Podem divergir temporariamente apenas:

- fotografias oficiais;
- logos/assets oficiais;
- números institucionais ainda não confirmados;
- conteúdo dinâmico cujo contrato do backend ainda não esteja consolidado.

Estrutura, proporções, hierarquia, comportamento, tabs, sliders, cards e distribuição visual devem seguir a demo aprovada o mais de perto possível.

---

# 4. Ordem oficial da Home — ATUALIZADA

A sequência conceitual oficial agora é:

```text
HEADER
│
├── HERO / PAINEL DE DESTAQUES
│
├── SOBRE IEEE + RAS
│
├── EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES
│
├── GALERIA
│
├── EVENTOS DA RAS
│
├── [CONDICIONAL] COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR
│
└── FOOTER INSTITUCIONAL
```

Decisões desta revisão:

1. `Equipe / Diretoria / Robôs / Premiações` fica antes da Galeria;
2. não haverá uma janela independente de edições anteriores na Home;
3. `Competição atual`, `Cronograma` e `Acompanhar` deixam de ser janelas separadas e passam a compor **uma única grande janela competitiva condicional**;
4. essa janela competitiva só aparece quando houver uma competição pública da RAS gerenciada pelo RasComp.

Narrativa institucional:

```text
quem somos
   ↓
quem faz parte / o que construímos / o que conquistamos
   ↓
registros visuais dessa trajetória
   ↓
eventos e atuação da RAS
   ↓
competição atual, quando existir
```

---

# 5. JANELA 1 — HEADER ✅

Arquivos:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
```

Estrutura:

```text
[ IEEE RAS UFRB ]   Início   Sobre   Competição⌄   Calendário   Eventos   Contato   [ Inscrições ]
```

Dropdown `Competição`:

```text
Competição atual
Cronograma
Resultados
Chaveamento
```

O item de edições anteriores foi removido.

Com competição em andamento:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

Fidelidade revisada contra a demo:

- faixa ativa rubra;
- linha inferior rubra no item ativo;
- roxo em hover/estrutura;
- CTA `Inscrições` rubro;
- fundo branco;
- mobile com hambúrguer + identidade + CTA;
- menu aberto completo.

Logo oficial IEEE RAS/UFRB será substituído depois.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Arquivos:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

Estrutura final baseada na demo:

```text
┌─────────────────────────────────────────────┬──────────────────────┐
│       SLIDE VISUAL PRINCIPAL                │ ÚLTIMAS NOVIDADES    │
│       foto + overlay                        │ item 1               │
│       categoria / título / resumo           │ item 2               │
│       [ CTA ] [ CTA ]                       │ item 3               │
│       ‹             dots              ›     │                      │
└─────────────────────────────────────────────┴──────────────────────┘

[ preview 1 ] [ preview 2 ] [ preview 3 ] [ preview 4 ]
```

Conteúdo preparado:

- apresentação RAS UFRB;
- competição atual quando aplicável;
- RAS nas Escolas;
- oficinas/formação;
- premiações/conquistas.

Comportamento:

- autoplay ~7s;
- pausa em interação/hover;
- setas;
- dots;
- previews clicáveis;
- painel lateral de novidades;
- responsivo.

RRC só aparece com contexto competitivo real.

---

# 7. JANELA 3 — SOBRE IEEE + RAS ✅

Arquivos:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
```

Estrutura:

```text
[ galeria/collage visual ]         [ O QUE É O IEEE ] [ O QUE É A RAS UFRB ]
                                   conteúdo alternável

[ membros ] [ robôs ] [ prêmios ] [ eventos ] [ escolas visitadas ]
```

Implementado próximo da demo com:

- mídia principal;
- miniaturas;
- tabs largas;
- blocos explicativos com ícones;
- faixa inferior de cinco indicadores.

Fotos e números ainda são placeholders.

---

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ✅ IMPLEMENTAÇÃO INICIAL

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

Já inserida antes da Galeria no `App.vue`:

```text
<InstitutionalAbout />
<TeamRobotsAwards />
<InstitutionalGallery />
```

## Estrutura implementada

```text
PESSOAS, PROJETOS E CONQUISTAS

┌─────────────────────────────────────┬──────────────────────────────┐
│ [ EQUIPE ] [ DIRETORIA ]            │ ROBÔS                        │
│                                     │ item expansível              │
│ [pessoa][pessoa][pessoa][pessoa]    │ item expansível              │
│ hover/toque expande integrante      │ item expansível              │
│ nome + área + cargo quando houver   ├──────────────────────────────┤
│                                     │ PREMIAÇÕES                    │
│                                     │ item expansível              │
│                                     │ item expansível              │
└─────────────────────────────────────┴──────────────────────────────┘
```

## Equipe / Diretoria

- alternância por tabs;
- cards verticais de integrantes;
- ao passar o mouse, focar ou tocar, o integrante cresce horizontalmente;
- nome e área/modalidade aparecem no destaque;
- diretoria mostra também função/cargo;
- no mobile o mesmo conceito funciona por toque e scroll horizontal;
- fotos reais ainda serão adicionadas.

Os nomes atuais são placeholders editoriais até o cadastro oficial da equipe/diretoria.

## Robôs

Lista expansível à direita.

Ao abrir um robô:

- mídia/foto;
- nome;
- modalidade;
- ano/status;
- descrição;
- competições;
- resultado/destaque.

Os dados ainda são parcialmente placeholders e serão substituídos pelo histórico oficial do capítulo.

## Premiações

Lista expansível independente.

Ao abrir:

- título/colocação;
- evento;
- data;
- modalidade;
- equipe;
- robô;
- descrição da conquista.

## Visual

- fundo branco;
- painel de pessoas com bastante área fotográfica;
- roxo para identidade institucional;
- rubro para conquistas/detalhes;
- expansões suaves;
- sem aparência de tabela ou CRUD;
- desktop em duas colunas;
- tablet empilha legado em dois painéis;
- mobile em uma coluna.

## Próxima ação desta janela

Gerar a demo visual e comparar com a implementação, fazendo o mesmo refinamento de fidelidade usado nas Janelas 1–5 antes de avançar.

---

# 9. JANELA 5 — GALERIA ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

Posição oficial: imediatamente após a Janela de Equipe/Robôs/Premiações.

Estrutura aprovada:

```text
MEMÓRIAS E REGISTROS
Galeria

[ Todos ] [ RRC ] [ Oficinas ] [ RAS nas Escolas ] [ Premiações ] [ Eventos ]

[ álbum ] [ álbum ] [ álbum ]
 foto      foto      foto
 minis     minis     minis
 título    título    título
 fotos     fotos     fotos
 data      data      data
 Ver álbum Ver álbum Ver álbum
```

Cada álbum usa:

- foto principal;
- três miniaturas;
- categoria;
- título;
- quantidade de fotos;
- data;
- descrição;
- ação `Ver álbum`.

Ao clicar, abrir prévia flutuante com mídia, próximo, contador, dots e fechar.

Fotos, quantidades e datas atuais são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS ⏭ APÓS EQUIPE/GALERIA

Conceito:

Cards/barras horizontais expansíveis.

Eventos iniciais:

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
- edições/realizações do evento quando relevante;
- link específico quando existir.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR (CONDICIONAL)

**Esta passa a ser uma única janela.**

Só aparece quando existir competição pública da RAS gerenciada pelo RasComp.

Estrutura planejada:

```text
COMPETIÇÃO ATUAL
RRC 20XX                           [ status ]

resumo / modalidades / equipes / robôs / inscrições

CRONOGRAMA
Inscrições → Homologação → Chaves → Inspeção → Eliminatórias → Finais

ACOMPANHAR
[ Ao vivo ] [ Partidas ] [ Chave ] [ Ranking ] [ Resultados ]

próxima partida / chave / ranking / resultados recentes

[ Acompanhar competição ]
```

Regras:

- se não houver competição pública da RAS/RasComp aplicável, **a janela não renderiza**;
- quando existir, o Hero/Header podem oferecer atalho direto para ela;
- backend/RasComp são fonte de verdade;
- Landing é somente leitura pública;
- frontend não decide vencedor, não gera chave e não calcula classificação oficial.

---

# 12. JANELA 8 — FOOTER INSTITUCIONAL

Seguir a lógica institucional da ERBASE, sem copiar código/visual.

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
Chaveamento

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

Fundo roxo profundo com detalhes rubros discretos.

---

# 13. Conteúdo estático x dinâmico

## Estático/editorial inicialmente

- apresentação da RAS UFRB;
- IEEE;
- história;
- equipe;
- diretoria;
- robôs históricos;
- premiações;
- eventos;
- projetos;
- parceiros;
- textos institucionais.

## Dinâmico via backend público

- competição atual;
- status;
- inscrições;
- categorias;
- equipes/robôs quando aplicável;
- ranking Follow Line;
- chaveamentos Sumô;
- partidas;
- resultados;
- campeões.

```text
Gestão → Backend Spring Boot → /api/v1/public/** → Landing
```

A Landing nunca gera chave, decide vencedor, calcula ranking oficial, altera inscrição ou escreve resultado oficial.

---

# 14. Imagens e mídia — pendente

Durante construção, placeholders são permitidos.

Antes da publicação definir:

- acervo oficial;
- autorização;
- armazenamento;
- créditos;
- legendas;
- otimização;
- lazy loading.

---

# 15. Checklist técnico antes de publicar

- [ ] TypeScript/typecheck;
- [ ] build;
- [ ] mobile;
- [ ] navegação por teclado;
- [ ] foco visível;
- [ ] contraste;
- [ ] alt text;
- [ ] `prefers-reduced-motion`;
- [ ] SEO;
- [ ] Open Graph;
- [ ] favicon/manifest;
- [ ] sitemap/robots;
- [ ] performance;
- [ ] loading/erro/vazio;
- [ ] 404 pública.

---

# 16. Estado atual

```text
JANELA 1 — Header                          ✅ implementada + demo + fidelidade revisada
JANELA 2 — Hero/Destaques                 ✅ implementada + demo + fidelidade revisada
JANELA 3 — Sobre IEEE/RAS                  ✅ implementada + demo + fidelidade revisada
JANELA 4 — Equipe/Diretoria/Robôs/Prêmios ✅ implementação inicial; demo agora
JANELA 5 — Galeria                         ✅ implementada + demo + fidelidade revisada
JANELA 6 — Eventos                         ⬜
JANELA 7 — Competição/Cronograma/Acompanhar ⬜ janela única condicional
JANELA 8 — Footer                          ⬜
```

---

# 17. Próximo passo

```text
1. gerar demo da Janela 4
2. comparar implementação x demo
3. refinar fidelidade
4. seguir para Eventos da RAS
```
