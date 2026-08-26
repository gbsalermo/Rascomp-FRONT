# Continuidade — Landing Page / Site Público RAS UFRB

> Documento principal de continuidade da aplicação pública em `landing-page/`.
> Atualizar ao concluir ou revisar cada janela da Home.

---

# 1. Identidade

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Home é o site institucional da **RAS UFRB**. O RRC ganha destaque quando houver contexto competitivo, mas não domina a identidade do site durante todo o ano.

Camunda está fora do projeto.

---

# 2. Direção visual

Referência de arquitetura/ritmo: ERBASE, sem copiar código, textos ou assets.

Direção aprovada:

- fundo branco dominante;
- aparência institucional, leve e tecnológica;
- roxo como estrutura institucional;
- rubro para CTAs, competição e destaques;
- cinzas claros para separar áreas;
- bastante espaço em branco;
- fotografia real quando o acervo oficial estiver disponível;
- transições suaves;
- evitar cyberpunk, aparência de dashboard e excesso de cards pequenos.

Placeholders de imagem, logo, nomes e números são permitidos durante a construção.

---

# 3. Método de desenvolvimento — CONGELADO

A Home é construída janela por janela.

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

Só podem divergir temporariamente:

- fotografias oficiais;
- logos/assets oficiais;
- números/nomeações ainda não confirmados;
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

1. Equipe/Diretoria/Robôs/Premiações vem antes da Galeria;
2. **Edições anteriores foi removido do esqueleto da Home**;
3. Competição atual + Cronograma + Acompanhar formam **uma única janela competitiva condicional**;
4. essa janela só aparece quando houver competição pública da RAS gerenciada pelo RasComp;
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
- mobile com hambúrguer + identidade + CTA.

Logo oficial IEEE RAS/UFRB ainda será substituído pelo asset definitivo.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Arquivos:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

Estrutura aprovada:

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

RRC só entra como slide quando houver contexto competitivo real.

---

# 7. JANELA 3 — SOBRE IEEE + RAS ✅

Arquivos:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
```

Estrutura aprovada:

```text
[ galeria/collage visual ]         [ O QUE É O IEEE ] [ O QUE É A RAS UFRB ]
                                   conteúdo alternável

[ membros ] [ robôs ] [ prêmios ] [ eventos ] [ escolas visitadas ]
```

Implementado com:

- mídia principal;
- miniaturas;
- tabs largas;
- blocos explicativos com ícones;
- faixa inferior de cinco indicadores.

Fotos e números ainda são placeholders.

---

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ✅

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

A **Demo 1** foi escolhida como alvo visual definitivo.

Estrutura:

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

Decisões:

- Equipe = lista, com busca/filtro;
- Diretoria = mosaico de fotos;
- Equipe e Diretoria aparecem simultaneamente;
- Robôs = cards com mídia e expansão;
- Premiações = faixa de cards;
- indicadores inferiores permanecem;
- nenhum conteúdo de competição atual entra nesta janela.

Fotos, nomes e números ainda podem ser placeholders.

---

# 9. JANELA 5 — GALERIA ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

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

Cada álbum usa foto principal, três miniaturas, categoria, título, quantidade, data, descrição e `Ver álbum`.

Ao clicar, abre prévia flutuante com mídia, próximo, contador, dots e fechar.

Fotos, quantidades e datas atuais são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS ✅ IMPLEMENTAÇÃO INICIAL

Arquivos:

```text
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/events.css
```

Posição no `App.vue`:

```text
<TeamRobotsAwards />
<InstitutionalGallery />
<InstitutionalEvents />
```

## Conceito

Eventos aparecem como **barras/cards horizontais expansíveis**, evitando uma nova parede de cards e mantendo ritmo institucional.

Eventos iniciais:

```text
01 RRC
02 Robodori
03 RAS nas Escolas
04 Oficinas
```

## Estado fechado

Cada barra mostra:

- número/índice;
- categoria;
- nome do evento;
- resumo curto;
- `+` para expandir.

## Estado aberto

Ao expandir:

```text
[ mídia/foto do evento ]   [ objetivo ] [ público ] [ periodicidade ]

                           texto/histórico
                           [ CTA → ]
```

Detalhes disponíveis:

- descrição;
- objetivo;
- público;
- periodicidade;
- mídia/placeholder;
- espaço para edições/realizações;
- CTA contextual.

## Conteúdo

- RRC: tratado como competição promovida pela RAS, sem substituir a futura janela competitiva ao vivo;
- RAS nas Escolas: extensão e aproximação com estudantes/comunidade;
- Oficinas: formação e capacitação em áreas técnicas;
- Robodori: estrutura pronta, mas descrição institucional definitiva deve ser confirmada com material oficial antes da publicação.

O componente não inventa datas ou histórico oficial.

## Comportamento

- um evento pode começar expandido;
- clique alterna abrir/fechar;
- transição suave;
- desktop com resumo na própria barra;
- tablet/mobile reorganizam o conteúdo;
- link `Ver calendário` conecta a futura área de calendário institucional.

## Imagens

Por enquanto usa placeholders. Fotos reais serão adicionadas posteriormente sem mudar a estrutura.

## Demo

A demo desta etapa deve ser comparada com a implementação. Após aprovação, ela passa a ser o alvo visual definitivo da Janela 6.

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
- galeria;
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
JANELA 6 — Eventos                          ✅ implementação inicial + demo agora
JANELA 7 — Competição/Cronograma/Acompanhar ⏭ próxima; janela única condicional
JANELA 8 — Footer                           ⬜
```

---

# 17. Próximo passo

1. avaliar a demo da Janela 6;
2. alinhar diferenças entre demo e implementação;
3. depois seguir para:

```text
JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR
```
