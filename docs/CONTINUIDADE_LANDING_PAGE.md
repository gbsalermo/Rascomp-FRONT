# Continuidade — Landing Page / Site Público RAS UFRB

> Documento principal de continuidade da aplicação pública em `landing-page/`.
> Atualizar este arquivo ao concluir ou revisar cada janela da Home.

---

# 1. Identidade correta

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Home é o **site institucional da RAS UFRB**. O RRC ganha destaque quando houver contexto competitivo, mas não domina a identidade do site durante todo o ano.

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

A Home será construída **janela por janela**.

Cada janela precisa de:

```text
1. implementação em landing-page/
2. atualização deste arquivo
3. demo visual
4. revisão de fidelidade
```

Regra principal:

```text
Demo aprovada
      ↓
Implementação o mais fiel possível
      ↓
Ajustes finos posteriores no navegador
```

A demo aprovada é o alvo visual, não apenas inspiração.

Podem divergir temporariamente apenas:

- fotografias oficiais;
- logos/assets oficiais;
- números institucionais ainda não confirmados;
- conteúdo dinâmico cujo contrato do backend ainda não esteja consolidado.

---

# 4. Ordem oficial da Home

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

Decisões congeladas:

1. `Equipe / Diretoria / Robôs / Premiações` fica antes da Galeria;
2. **Edições anteriores foi removido do esqueleto da Home**;
3. `Competição atual`, `Cronograma` e `Acompanhar` formam **uma única janela competitiva condicional**;
4. a janela competitiva só aparece quando houver competição pública da RAS gerenciada pelo RasComp;
5. competição não faz parte da janela de Equipe/Robôs/Premiações.

Narrativa:

```text
quem somos
   ↓
quem faz parte / o que construímos / o que conquistamos
   ↓
registros visuais dessa trajetória
   ↓
eventos e atuação da RAS
   ↓
competição atual, somente quando existir
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

`Edições anteriores` foi removido.

Quando houver competição em andamento:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

Fidelidade revisada:

- faixa ativa rubra;
- linha inferior rubra no item ativo;
- roxo em hover/estrutura;
- CTA Inscrições rubro;
- fundo branco;
- mobile com hambúrguer + identidade + CTA;
- menu aberto completo.

Logo oficial IEEE RAS/UFRB ainda será substituído pelo asset definitivo.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Arquivos:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

Estrutura baseada na demo:

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

RRC só aparece como slide quando houver contexto competitivo real.

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

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ✅ DEMO 1 APROVADA

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

Posição no `App.vue`:

```text
<InstitutionalAbout />
<TeamRobotsAwards />
<InstitutionalGallery />
```

## Alvo visual aprovado

O usuário escolheu a **opção 1 da demo** como base definitiva desta janela.

A competição que aparecia na primeira demo foi descartada desta seção. A janela aprovada fica:

```text
┌──────────────────┬──────────────────────┬────────────────────────┐
│ NOSSA EQUIPE     │ DIRETORIA            │ NOSSOS ROBÔS           │
│ busca + filtro   │ mosaico de fotos     │ cards com mídia         │
│ lista de membros │ cargo + nome + área  │ resumo + expandir       │
│                  │                      │                        │
├──────────────────┴──────────────────────┤                        │
│ PREMIAÇÕES                              │                        │
│ cards horizontais de conquistas         │                        │
└─────────────────────────────────────────┴────────────────────────┘

[ membros ] [ robôs ] [ competições ] [ prêmios ] [ escolas visitadas ]
```

## Equipe — LISTA

A equipe é exibida simultaneamente à diretoria, sem tabs.

Inclui:

- campo de busca;
- filtro de área;
- lista vertical de integrantes;
- miniatura/foto;
- nome;
- área/modalidade;
- destaque no hover/foco;
- CTA `Ver toda a equipe`.

Isso permite comportar muitos membros sem criar uma parede de cards.

Fotos e nomes atuais são placeholders.

## Diretoria — MOSAICO

A diretoria permanece em mosaico de fotos, conforme aprovado visualmente:

- três colunas no desktop;
- seis cargos de exemplo;
- cargo/função;
- nome;
- área;
- overlay escuro sobre a mídia;
- CTA `Ver toda a diretoria`.

Equipe e Diretoria são exibidas **ao mesmo tempo**.

## Robôs — CARDS

Robôs aparecem como cards verticais à direita, próximos da demo escolhida.

Cada card contém:

- mídia/foto;
- nome;
- modalidade;
- status;
- descrição curta;
- `Saiba mais`;
- expansão para contexto/histórico adicional.

## Premiações — FAIXA DE CARDS

Premiações ficam abaixo de Equipe + Diretoria, com quatro cards compactos de destaque.

Cada card contém:

- colocação/tipo;
- título;
- evento;
- ano;
- diferenciação visual de ouro, prata, bronze e destaque.

## Indicadores

A faixa inferior permanece como parte desta janela:

```text
25+ membros ativos
7+ robôs desenvolvidos
18+ competições participadas
10+ prêmios conquistados
8+ escolas visitadas
```

Todos esses números são placeholders até confirmação oficial.

## Regra importante

**Nenhum card, cronograma ou acompanhamento de competição atual aparece nesta janela.**

Competição atual pertence exclusivamente à Janela 7, que é condicional.

---

# 9. JANELA 5 — GALERIA ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

Posição: imediatamente após a janela de Equipe/Robôs/Premiações.

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

Cada álbum:

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

# 10. JANELA 6 — EVENTOS DA RAS ⏭ PRÓXIMA

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
- realizações/edições quando relevante;
- link específico quando existir.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR (CONDICIONAL)

**Uma única janela competitiva.**

Só renderiza quando existir competição pública da RAS gerenciada pelo RasComp.

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

- sem competição pública aplicável → janela não renderiza;
- Hero/Header podem apontar diretamente para ela;
- Backend/RasComp são fonte de verdade;
- Landing é somente leitura;
- frontend não gera chave, não decide vencedor e não calcula classificação oficial.

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
JANELA 1 — Header                           ✅ implementada + demo + fidelidade revisada
JANELA 2 — Hero/Destaques                  ✅ implementada + demo + fidelidade revisada
JANELA 3 — Sobre IEEE/RAS                   ✅ implementada + demo + fidelidade revisada
JANELA 4 — Equipe/Diretoria/Robôs/Prêmios  ✅ demo 1 aprovada + implementação alinhada
JANELA 5 — Galeria                          ✅ implementada + demo + fidelidade revisada
JANELA 6 — Eventos                          ⬜ próxima
JANELA 7 — Competição/Cronograma/Acompanhar ⬜ janela única condicional
JANELA 8 — Footer                           ⬜
```

---

# 17. Próximo passo

```text
JANELA 6 — EVENTOS DA RAS
```

Antes de avançar, ajustes visuais finos da Janela 4 podem ser feitos quando o usuário estiver no PC e conseguir comparar no navegador.
