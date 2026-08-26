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

Direção final:

- fundo branco dominante;
- aparência institucional, leve e tecnológica;
- roxo como estrutura institucional;
- rubro para CTAs, competição e destaques;
- cinzas claros para separar áreas;
- bastante espaço em branco;
- fotografia real quando o acervo oficial estiver disponível;
- transições suaves;
- evitar visual cyberpunk, dashboard ou excesso de cards pequenos.

Imagens temporárias/placeholder são permitidas durante a construção. Assets oficiais serão substituídos depois.

---

# 3. Método de desenvolvimento — CONGELADO

A Home será construída janela por janela.

Cada janela só avança depois de três entregas:

```text
1. implementação em landing-page/
2. atualização deste arquivo de continuidade
3. demo visual para avaliação
```

## Regra de fidelidade visual

A demo aprovada não é apenas inspiração: ela é o alvo visual da implementação.

```text
Demo aprovada
      ↓
Implementação o mais fiel possível
      ↓
Ajustes finos posteriores no navegador
```

Só podem divergir temporariamente:

- fotografias oficiais ainda não fornecidas;
- logos/assets oficiais ainda não adicionados;
- números institucionais ainda não confirmados;
- conteúdo dinâmico cujo contrato do backend ainda não esteja consolidado.

Estrutura, proporções, hierarquia, comportamento, tabs, sliders, cards e distribuição visual devem seguir a demo aprovada o mais de perto possível.

---

# 4. Arquitetura atual da Home

```text
HEADER                                      ✅ implementado + fidelidade revisada
│
├── HERO / PAINEL DE DESTAQUES              ✅ implementado + fidelidade revisada
│
├── SOBRE IEEE + RAS                        ✅ implementado + fidelidade revisada
│
├── GALERIA                                 ✅ implementada + fidelidade revisada
│
├── EQUIPE / DIRETORIA / ROBÔS / PRÊMIOS   ⏭ próxima janela
│
├── EVENTOS DA RAS                          planejado
│
├── [CONDICIONAL] COMPETIÇÃO ATUAL          planejado
│       ├── CRONOGRAMA DA COMPETIÇÃO
│       └── ACOMPANHAR / AO VIVO
│
├── EDIÇÕES ANTERIORES                      planejado
│
└── FOOTER INSTITUCIONAL                    planejado
```

---

# 5. JANELA 1 — HEADER ✅

Arquivos:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
```

Estrutura desktop:

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

Com competição em andamento, faixa rubra acima do Header:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

Refinamentos de fidelidade já aplicados:

- faixa ativa rubra;
- item ativo com linha inferior rubra simples;
- roxo usado para hover/estrutura institucional;
- CTA `Inscrições` rubro;
- fundo branco e sombra/borda discretas;
- mobile próximo da demo com hambúrguer + identidade + CTA;
- menu aberto mantém navegação completa.

Logo oficial IEEE RAS/UFRB ainda será substituído quando o asset definitivo for fornecido.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Arquivos:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

Estrutura visual final:

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

Slides preparados:

- apresentação institucional da RAS UFRB;
- competição atual quando aplicável;
- RAS nas Escolas;
- oficinas/formação;
- premiações/conquistas.

Comportamento:

- autoplay ~7s;
- pausa em interação/hover;
- setas laterais;
- dots;
- CTA principal rubro;
- quatro cards-preview no desktop;
- painel lateral de últimas novidades;
- responsivo.

O RRC só entra como slide quando houver contexto competitivo real.

---

# 7. JANELA 3 — SOBRE IEEE + RAS ✅

Arquivos:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
```

Estrutura visual-alvo:

```text
[ galeria/collage visual ]         [ O QUE É O IEEE ] [ O QUE É A RAS UFRB ]
                                   conteúdo alternável

[ membros ] [ robôs ] [ prêmios ] [ eventos ] [ escolas visitadas ]
```

Já aproximado da demo com:

- mídia principal à esquerda;
- miniaturas inferiores;
- tabs largas no painel direito;
- blocos explicativos com ícones;
- faixa inferior de cinco indicadores.

Fotos e números atuais são placeholders.

---

# 8. JANELA 4 — GALERIA ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

A primeira implementação ainda carregava CSS da ideia antiga em mosaico. Após comparação com a demo aprovada, foi corrigida para o conceito definitivo de álbuns por evento/categoria.

## Estrutura visual aprovada e implementada

```text
MEMÓRIAS E REGISTROS
Galeria
texto institucional curto

[ Todos ] [ RRC ] [ Oficinas ] [ RAS nas Escolas ] [ Premiações ] [ Eventos ]

┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ foto principal       │ │ foto principal       │ │ foto principal       │
│                     │ │                     │ │                     │
├──────┬──────┬───────┤ ├──────┬──────┬───────┤ ├──────┬──────┬───────┤
│mini  │mini  │mini   │ │mini  │mini  │mini   │ │mini  │mini  │mini   │
└──────┴──────┴───────┘ └──────┴──────┴───────┘ └──────┴──────┴───────┘
 categoria                categoria                categoria
 título                   título                   título
 qtd. fotos · data        qtd. fotos · data        qtd. fotos · data
 descrição                descrição                descrição
 Ver álbum →              Ver álbum →              Ver álbum →
```

## Filtros

```text
Todos
RRC
Oficinas
RAS nas Escolas
Premiações
Eventos
```

## Álbuns temporários preparados

- RRC 2026;
- Oficina de Robótica;
- RAS nas Escolas;
- Conquistas e Premiações;
- Eventos Institucionais.

Os dados atuais de quantidade/data são placeholders editoriais e devem ser substituídos por dados reais depois.

## Prévia do álbum

Ao clicar em um álbum, abre uma prévia flutuante no canto inferior direito, próxima da demo aprovada:

- título `Prévia do álbum`;
- mídia grande;
- botão de próxima foto;
- contador `1 / N`;
- dots;
- botão fechar.

Quando o acervo real for conectado, essa estrutura pode evoluir para navegação completa sem redesenhar a Home.

## Imagens

Atualmente são placeholders visuais. A troca por fotos reais não deve exigir mudança estrutural.

Antes da publicação ainda definir:

- armazenamento/origem do acervo;
- autorização;
- créditos;
- legendas;
- associação das fotos a cada álbum/evento;
- otimização/lazy loading.

## Responsividade

- desktop: 3 colunas de álbuns;
- tablet: 2 colunas;
- mobile: 1 coluna;
- filtros roláveis em telas pequenas;
- prévia flutuante adaptada à largura do dispositivo.

A demo aprovada desta janela é o alvo visual.

---

# 9. JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ⏭ PRÓXIMA

Conceito aprovado:

```text
[ Equipe ] [ Diretoria ]       ROBÔS
lista visual de integrantes    lista expansível

                               PREMIAÇÕES
                               lista expansível
```

Equipe/Diretoria:

- tabs;
- card compacto por integrante;
- hover/expansão aumenta foto;
- nome + área/modalidade;
- diretoria inclui função.

Robôs ao expandir:

- foto;
- modalidade;
- ano;
- descrição;
- competições;
- resultados relevantes.

Premiações ao expandir:

- colocação;
- evento;
- data;
- equipe;
- robô;
- modalidade;
- descrição.

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

Quando existir:

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

Landing = leitura pública. Backend/RasComp permanecem fonte de verdade.

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

Histórico por edição/ano com resumo, campeões, modalidades, fotos, resultados e chaveamento quando houver dados.

---

# 14. JANELA 10 — FOOTER INSTITUCIONAL

Seguir a lógica institucional observada na ERBASE, sem copiar código/visual.

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

Estático/editorial inicialmente:

- apresentação RAS UFRB;
- IEEE;
- história;
- eventos;
- projetos;
- diretoria;
- equipe;
- robôs históricos;
- premiações;
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

# 16. Imagens e mídia — pendente

Durante construção, placeholder ou nenhuma imagem é permitido.

Antes de publicação definir acervo oficial, autorização, fonte/armazenamento, créditos, legendas, otimização e lazy loading.

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
- [ ] tratamento de erro/loading/vazio;
- [ ] 404 pública.

---

# 18. Estado atual

```text
JANELA 1 — Header                  ✅ implementada + demo + fidelidade revisada
JANELA 2 — Hero/Destaques         ✅ implementada + demo + fidelidade revisada
JANELA 3 — Sobre IEEE/RAS          ✅ implementada + demo + fidelidade revisada
JANELA 4 — Galeria                 ✅ implementada + demo + fidelidade revisada
JANELA 5 — Equipe/Robôs/Prêmios    ⏭ próxima
JANELA 6 — Eventos                 ⬜
JANELA 7 — Competição atual        ⬜
JANELA 8 — Cronograma/Acompanhar   ⬜
JANELA 9 — Edições anteriores      ⬜
JANELA 10 — Footer                 ⬜
```

A implementação das janelas institucionais pode avançar visualmente antes da consolidação total do ADMIN, desde que contratos competitivos não sejam considerados definitivos antes da validação do backend/gestão.

---

# 19. Próximo passo

```text
JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES
```
