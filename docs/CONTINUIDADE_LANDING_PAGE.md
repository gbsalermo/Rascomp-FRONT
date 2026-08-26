# Continuidade — Landing Page / Site Público RAS UFRB

> Documento principal de continuidade da aplicação pública em `landing-page/`.
> Atualizar ao concluir ou revisar cada janela da Home.

---

# 1. Identidade do projeto

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Home é o site institucional da **RAS UFRB**. O RRC ganha destaque quando houver contexto competitivo, mas não domina o site durante todo o ano.

Camunda está fora do projeto.

---

# 2. Direção visual aprovada

Referência de arquitetura/ritmo: ERBASE, sem copiar código, textos ou assets.

Direção:

- fundo branco dominante;
- visual institucional, leve e tecnológico;
- roxo como estrutura institucional;
- rubro para CTAs, competição e destaques;
- cinzas claros para separar áreas;
- bastante respiro;
- fotografia real quando houver acervo oficial;
- transições suaves;
- evitar cyberpunk, aparência de dashboard e excesso de cards pequenos.

Imagens, logos, datas e números podem permanecer como placeholders até o material oficial ser fornecido.

---

# 3. Método de desenvolvimento — CONGELADO

A Home é construída **janela por janela**.

Cada janela precisa de:

```text
1. implementação em landing-page/
2. atualização deste arquivo
3. demo visual
4. revisão de fidelidade
```

Regra:

```text
Demo aprovada
      ↓
Implementação o mais fiel possível
      ↓
Ajustes finos posteriores no navegador
```

A demo aprovada é o alvo visual, não apenas inspiração.

Podem divergir temporariamente apenas fotografias oficiais, logos/assets, datas/números não confirmados e conteúdo dinâmico cujo contrato do backend ainda esteja sendo consolidado.

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

1. Equipe/Diretoria/Robôs/Premiações fica antes da Galeria;
2. `Edições anteriores` foi removido do esqueleto da Home;
3. Competição atual + Cronograma + Acompanhar formam uma única janela competitiva condicional;
4. essa janela competitiva só aparece quando houver competição pública da RAS gerenciada pelo RasComp;
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

Dropdown Competição:

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

Estrutura:

```text
┌─────────────────────────────────────────────┬──────────────────────┐
│ SLIDE VISUAL PRINCIPAL                      │ ÚLTIMAS NOVIDADES    │
│ foto + overlay                              │ item 1               │
│ categoria / título / resumo                 │ item 2               │
│ [ CTA ] [ CTA ]                             │ item 3               │
│ ‹                dots                 ›     │                      │
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
- pausa em hover/interação;
- setas e dots;
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

Implementado próximo da demo com mídia principal, miniaturas, tabs largas, blocos explicativos com ícones e faixa inferior de indicadores.

Fotos e números ainda são placeholders.

---

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ✅

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

O usuário escolheu a **opção 1 da demo** como alvo visual.

Estrutura aprovada:

```text
┌──────────────────┬──────────────────────┬────────────────────────┐
│ NOSSA EQUIPE     │ DIRETORIA            │ NOSSOS ROBÔS           │
│ busca + filtro   │ mosaico de fotos     │ cards com mídia         │
│ lista de membros │ cargo + nome + área  │ resumo + expandir       │
├──────────────────┴──────────────────────┤                        │
│ PREMIAÇÕES                              │                        │
│ cards horizontais de conquistas         │                        │
└─────────────────────────────────────────┴────────────────────────┘

[ membros ] [ robôs ] [ competições ] [ prêmios ] [ escolas visitadas ]
```

Equipe:

- lista;
- busca;
- filtro de área;
- miniatura, nome e área;
- destaque no hover/foco;
- CTA Ver toda a equipe.

Diretoria:

- simultânea à equipe;
- mosaico de fotos;
- cargo, nome e área;
- CTA Ver toda a diretoria.

Robôs:

- cards com mídia;
- nome, modalidade, status e resumo;
- expansão/detalhe preparado.

Premiações:

- faixa inferior de cards;
- ouro, prata, bronze e destaque;
- evento e ano.

Indicadores atuais são placeholders até confirmação oficial.

**Nenhum card, cronograma ou acompanhamento de competição aparece nesta janela.**

---

# 9. JANELA 5 — GALERIA ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

Posição: após Equipe/Robôs/Premiações.

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

Cada álbum tem foto principal, três miniaturas, categoria, título, quantidade de fotos, data, descrição e ação `Ver álbum`.

Ao clicar, abre prévia flutuante com mídia, próximo, contador, dots e fechar.

Fotos, quantidades e datas atuais são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS ✅ DEMO APROVADA + IMPLEMENTAÇÃO ALINHADA

Arquivos:

```text
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/events.css
```

Posição:

```text
<TeamRobotsAwards />
<InstitutionalGallery />
<InstitutionalEvents />
```

A demo aprovada substituiu o conceito anterior de barras expansíveis. A implementação atual segue o novo alvo visual.

## Estrutura aprovada

```text
EVENTOS DA RAS
texto institucional

[ Todos os eventos ] [ Organizados pela RAS ] [ Participações ] [ Oficinas ] [ Palestras ] [ Competições ]

┌──────────────────────────────────────────────────────────┬──────────────────────┐
│ PRÓXIMOS EVENTOS                                         │ PRÓXIMOS NA AGENDA   │
│ [ RRC ] [ Oficina ] [ Palestra ] [ RAS nas Escolas ]    │ data + evento + tipo │
│                                                          │ ...                  │
│             [ Ver todos os eventos ]                     │ Ver agenda completa  │
├──────────────────────────────────────────────────────────┼──────────────────────┤
│ DESTAQUES DE EVENTOS ANTERIORES                          │ FIQUE POR DENTRO     │
│ [ evento ] [ evento ] [ evento ] [ evento ]              │ e-mail + redes       │
└──────────────────────────────────────────────────────────┴──────────────────────┘

[ eventos ] [ pessoas impactadas ] [ escolas ] [ anos ] [ estados ]
```

## Próximos eventos

Cards preparados para:

- RRC 2026;
- Oficina Arduino;
- Palestra: IA na Robótica;
- RAS nas Escolas;
- Robodori;
- participação em competição externa.

A visualização padrão mostra quatro destaques; os filtros reorganizam os cards.

Cada card possui:

- área de imagem/placeholder;
- categoria;
- título;
- data;
- local;
- resumo curto;
- status quando aplicável;
- CTA.

## Filtros

```text
Todos os eventos
Organizados pela RAS
Participações
Oficinas
Palestras
Competições
```

## Agenda

Painel lateral com os próximos eventos em formato compacto:

```text
data | nome | categoria
```

O `id="calendario"` está nesta área para que o item Calendário do Header tenha destino nesta etapa.

## Eventos anteriores

Faixa de quatro cards compactos preparada para registros como:

- RRC 2025;
- Oficina de Impressão 3D;
- Palestra: Robôs Autônomos;
- RAS nas Escolas.

Os cards apontam para a Galeria enquanto não houver página histórica própria.

## Fique por dentro

Painel lateral com:

- campo de e-mail;
- CTA de inscrição;
- feedback demonstrativo local;
- atalhos visuais para redes.

A integração real de newsletter e URLs oficiais ainda será definida.

## Indicadores

A faixa inferior da demo também foi implementada:

```text
20+ eventos realizados
5k+ participantes impactados
15+ escolas alcançadas
8+ anos de tradição
3 estados alcançados
```

**Todos são placeholders até confirmação oficial.**

## Imagens e dados

- imagens são placeholders;
- datas/localizações são exemplos editoriais temporários;
- números são placeholders;
- substituir tudo pelo material oficial antes da publicação.

## Responsividade

- desktop: conteúdo principal + agenda lateral;
- tablet: agenda/newsletter passam para duas colunas abaixo;
- mobile: uma coluna;
- filtros ganham scroll horizontal;
- cards de eventos e históricos empilham.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR (CONDICIONAL) ⏭ PRÓXIMA

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

## Atenção técnica para a próxima etapa

O `App.vue` ainda contém os blocos públicos competitivos antigos (`live-strip`, visão geral, ranking Follow Line, Sumô e robôs/equipes) abaixo das janelas institucionais.

Na Janela 7 eles devem ser **substituídos/consolidados em um componente competitivo único e condicional**, em vez de permanecerem como várias seções separadas.

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

Estático/editorial inicialmente:

- apresentação RAS UFRB;
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

Dinâmico via backend público:

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

Antes da publicação definir acervo oficial, autorização, armazenamento, créditos, legendas, otimização e lazy loading.

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
JANELA 6 — Eventos                          ✅ demo aprovada + implementação alinhada
JANELA 7 — Competição/Cronograma/Acompanhar ⏭ próxima; janela única condicional
JANELA 8 — Footer                           ⬜
```

---

# 17. Próximo passo

```text
JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR
```

Depois dela:

```text
JANELA 8 — FOOTER INSTITUCIONAL
```
