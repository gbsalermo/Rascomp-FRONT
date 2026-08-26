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

A seção `Equipe / Diretoria / Robôs / Premiações` foi movida para antes da Galeria por decisão conceitual.

Fluxo oficial:

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
├── [CONDICIONAL] COMPETIÇÃO ATUAL
│       ├── CRONOGRAMA DA COMPETIÇÃO
│       └── ACOMPANHAR / AO VIVO
│
├── EDIÇÕES ANTERIORES
│
└── FOOTER INSTITUCIONAL
```

Justificativa conceitual:

```text
quem somos
   ↓
quem faz parte / o que construímos / o que conquistamos
   ↓
registros visuais dessa trajetória
```

Isso cria uma narrativa institucional mais natural antes de entrar em eventos e competição.

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
Edições anteriores
```

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

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ⏭ PRÓXIMA

**Esta é agora a próxima janela da Home e deve entrar antes da Galeria no `App.vue`.**

Conceito aprovado:

```text
[ Equipe ] [ Diretoria ]        ROBÔS
lista visual de integrantes     lista expansível

                                PREMIAÇÕES
                                lista expansível
```

## Equipe / Diretoria

- alternância por tabs;
- cards visuais de integrantes;
- hover/expansão aumenta a foto;
- mostrar nome + área/modalidade;
- diretoria mostra função/cargo;
- evitar tabela ou visual de cadastro.

## Robôs

Lista expansível. Ao abrir:

- foto;
- nome;
- modalidade;
- ano;
- descrição;
- competições;
- resultados relevantes.

## Premiações

Lista expansível. Ao abrir:

- colocação;
- evento;
- data;
- equipe;
- robô;
- modalidade;
- descrição.

A demo desta janela deverá ser criada e depois implementada com alta fidelidade antes de avançar.

---

# 9. JANELA 5 — GALERIA ✅ IMPLEMENTADA

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

A Galeria já está implementada, porém sua posição oficial agora é **depois de Equipe / Diretoria / Robôs / Premiações**.

No momento, como a nova Janela 4 ainda não existe em código, ela pode aparecer logo após `Sobre` no `App.vue`. Ao implementar a Janela 4, a ordem deve ficar obrigatoriamente:

```text
<InstitutionalAbout />
<TeamRobotsAwards />
<InstitutionalGallery />
```

## Estrutura aprovada da Galeria

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

Ao clicar, abrir prévia flutuante com:

- título;
- mídia grande;
- próximo;
- contador;
- dots;
- fechar.

Fotos, quantidades e datas atuais são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS

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
- edições;
- link específico quando existir.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL (CONDICIONAL)

Só aparece quando existir competição pública da RAS gerenciada pelo RasComp.

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

A Landing é somente leitura pública. Backend/RasComp permanecem fonte de verdade.

---

# 12. JANELA 8 — CRONOGRAMA + ACOMPANHAR

Só aparece no contexto de competição atual.

```text
Inscrições → Homologação → Chaves → Inspeção → Eliminatórias → Finais
```

Área de acompanhamento:

```text
[ Ao vivo ] [ Partidas ] [ Chave ] [ Ranking ] [ Resultados ]
```

---

# 13. JANELA 9 — EDIÇÕES ANTERIORES

Histórico por edição/ano:

- resumo;
- campeões;
- modalidades;
- fotos;
- resultados;
- chaveamento quando houver dados.

---

# 14. JANELA 10 — FOOTER INSTITUCIONAL

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

Fundo roxo profundo com detalhes rubros discretos.

---

# 15. Conteúdo estático x dinâmico

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

# 16. Imagens e mídia — pendente

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

# 17. Checklist técnico antes de publicar

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

# 18. Estado atual

```text
JANELA 1 — Header                          ✅ implementada + demo + fidelidade revisada
JANELA 2 — Hero/Destaques                 ✅ implementada + demo + fidelidade revisada
JANELA 3 — Sobre IEEE/RAS                  ✅ implementada + demo + fidelidade revisada
JANELA 4 — Equipe/Diretoria/Robôs/Prêmios ⏭ próxima
JANELA 5 — Galeria                         ✅ implementada + demo + fidelidade revisada
JANELA 6 — Eventos                         ⬜
JANELA 7 — Competição atual                ⬜
JANELA 8 — Cronograma/Acompanhar           ⬜
JANELA 9 — Edições anteriores              ⬜
JANELA 10 — Footer                         ⬜
```

---

# 19. Próximo passo

```text
JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES
```

Ao implementar, inserir o componente **entre `InstitutionalAbout` e `InstitutionalGallery`** no `App.vue`.
