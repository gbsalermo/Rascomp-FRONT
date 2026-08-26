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

A Home é **o site institucional da RAS UFRB**, não o site do RRC.
O RRC deve ganhar destaque quando houver contexto competitivo, mas não pode dominar a identidade da página durante todo o ano.

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

A Home será construída **janela por janela**.

Cada janela só avança depois de três entregas:

```text
1. implementação em landing-page/
2. atualização deste arquivo de continuidade
3. demo visual para avaliação
```

## Regra de fidelidade visual

A demo aprovada **não é apenas inspiração**. Ela passa a ser o alvo visual da implementação.

```text
Demo aprovada
      ↓
Implementação o mais fiel possível
      ↓
Ajustes finos posteriores no navegador
```

Podem divergir temporariamente apenas:

- fotografias oficiais ainda não fornecidas;
- logos/assets oficiais ainda não adicionados;
- números institucionais ainda não confirmados;
- conteúdo dinâmico cujo contrato do backend ainda não esteja consolidado.

Estrutura, proporções, hierarquia, comportamento, tabs, sliders, cards e distribuição visual devem seguir a demo aprovada o mais de perto possível.

---

# 4. Arquitetura atual da Home

```text
HEADER                                      ✅ implementado e refinado conforme demo
│
├── HERO / PAINEL DE DESTAQUES              ✅ implementado e refinado conforme demo
│
├── SOBRE IEEE + RAS                        ✅ implementado e aproximado da demo
│
├── GALERIA                                 ✅ implementada; demo desta etapa
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
├── faixa curta de novidades                integrada principalmente ao Hero
│
└── FOOTER INSTITUCIONAL                    planejado
```

---

# 5. JANELA 1 — HEADER ✅

Componentes:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
```

Estrutura desktop:

```text
[ IEEE RAS UFRB ]   Início   Sobre   Competição⌄   Calendário   Eventos   Contato   [ Inscrições ]
```

## Competição — dropdown

```text
Competição atual
Cronograma
Resultados
Chaveamento
Edições anteriores
```

Resultados e cronograma não ficam no primeiro nível da navegação.

## Calendário

Calendário geral do capítulo, incluindo visitas em escolas, oficinas, competições e ações/eventos institucionais.

## CTA Inscrições

Só aparece quando a competição pública estiver em `INSCRICOES_ABERTAS`.

## Competição ativa

Quando existir competição `EM_ANDAMENTO`, mostrar faixa fina rubra acima do Header:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

## Refinamento de fidelidade aplicado

- faixa ativa rubra como no mockup;
- item ativo com linha inferior rubra simples;
- roxo usado como hover/estrutura institucional;
- botão `Inscrições` rubro;
- fundo branco e sombra/borda discretas;
- mobile aproximado da demo: hambúrguer + identidade + CTA;
- menu aberto mantém navegação completa e CTA contextual.

## Logo

O layout ainda usa marca temporária. Substituir pelo asset oficial IEEE RAS/UFRB quando fornecido.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Componentes:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

O Hero funciona como uma capa editorial dinâmica da RAS UFRB, não como banner permanente do RRC.

## Estrutura visual final

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

## Slides iniciais

- apresentação institucional da RAS UFRB;
- competição atual quando aplicável;
- RAS nas Escolas;
- oficinas/formação;
- premiações/conquistas.

## Painel lateral de novidades

Pode destacar competição ativa, oficinas, RAS nas Escolas, premiações e novidades institucionais.

## Comportamento

- autoplay aproximadamente a cada 7 segundos;
- pausa ao interagir/hover;
- setas laterais;
- dots;
- CTA principal rubro;
- quatro cards-preview abaixo no desktop;
- clique no preview troca o slide;
- responsivo.

## Slide competitivo condicional

Só entra quando a competição pública estiver em:

```text
EM_ANDAMENTO
INSCRICOES_ABERTAS
INSCRICOES_ENCERRADAS
```

O RRC nunca vira slide institucional permanente sem contexto atual.

---

# 7. JANELA 3 — SOBRE IEEE + RAS ✅

Componentes:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
```

## Estrutura visual-alvo

```text
[ galeria/collage visual ]         [ O QUE É O IEEE ] [ O QUE É A RAS UFRB ]
                                   conteúdo alternável

[ membros ] [ robôs ] [ prêmios ] [ eventos ] [ escolas visitadas ]
```

A implementação foi aproximada da demo, incluindo:

- grande mídia principal à esquerda;
- miniaturas inferiores;
- tabs largas no painel direito;
- blocos explicativos com ícones;
- faixa inferior de cinco indicadores.

Os números e fotos são placeholders até confirmação oficial.

---

# 8. JANELA 4 — GALERIA ✅

Componentes:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

A galeria entra imediatamente após o Sobre para dar vida visual ao site ainda na primeira metade da Home.

## Estrutura implementada

```text
GALERIA
Um pouco do que construímos, vivemos e compartilhamos.

[ Todos ] [ RRC ] [ Oficinas ] [ RAS nas Escolas ] [ Premiações ] [ Eventos ]

┌───────────────────────────┬────────────┬────────────┐
│        foto ampla         │ foto alta  │ foto       │
│                           │            │            │
├─────────────┬─────────────┼────────────┼────────────┤
│ foto        │ foto        │ foto       │ foto       │
└─────────────┴─────────────┴────────────┴────────────┘
```

O mosaico usa proporções variadas para evitar aparência de grid genérico de cards.

## Filtros

```text
Todos
RRC
Oficinas
RAS nas Escolas
Premiações
Eventos
```

Ao filtrar, a grade se reorganiza sem trocar de página.

## Conteúdo de cada item

- categoria;
- título;
- ano/data curta;
- imagem;
- resumo para visualização ampliada.

## Visualização ampliada

Ao clicar numa foto, abrir lightbox/modal com:

- imagem grande;
- categoria;
- data/ano;
- título;
- descrição.

Isso permite explorar registros sem transformar a Home em um álbum longo.

## Imagens atuais

As imagens são placeholders. A estrutura foi construída para que a troca pelo acervo oficial não exija redesenho.

Ainda será necessário definir antes da publicação:

- origem/armazenamento das fotos;
- autorização e créditos;
- legenda;
- associação com eventos;
- otimização e lazy loading.

## Responsividade

- desktop: mosaico com 12 colunas e proporções variadas;
- tablet: blocos maiores e menos colunas;
- mobile: uma coluna, com primeiro destaque podendo ocupar maior ênfase;
- filtros roláveis horizontalmente em telas pequenas;
- lightbox adaptado para celular.

## Demo

A demo gerada nesta etapa é o alvo visual da Janela 4. Após aprovação, qualquer divergência estrutural encontrada no navegador deve ser corrigida antes de considerar a galeria consolidada.

---

# 9. JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ⏭ PRÓXIMA

```text
[ Equipe ] [ Diretoria ]       ROBÔS
lista visual de integrantes    lista expansível

                               PREMIAÇÕES
                               lista expansível
```

## Equipe / Diretoria

- alternância por tabs;
- card compacto por integrante;
- hover/expansão aumenta foto;
- nome + área/modalidade;
- diretoria inclui função.

## Robôs

Ao expandir:

- foto;
- modalidade;
- ano;
- descrição;
- competições;
- resultados relevantes.

## Premiações

Ao expandir:

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

Eventos iniciais citados:

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

Só renderizar quando existir competição pública da RAS gerenciada pelo RasComp.

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

A Landing é apenas leitura pública. Backend/RasComp permanecem fonte de verdade.

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

## Estático/editorial inicialmente

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
JANELA 4 — Galeria                 ✅ implementada + demo nesta etapa
JANELA 5 — Equipe/Robôs/Prêmios    ⏭ próxima
JANELA 6 — Eventos                 ⬜
JANELA 7 — Competição atual        ⬜
JANELA 8 — Cronograma/Acompanhar   ⬜
JANELA 9 — Edições anteriores      ⬜
JANELA 10 — Footer                 ⬜
```

A implementação das janelas institucionais pode avançar visualmente mesmo antes da consolidação total do ADMIN, desde que contratos competitivos não sejam considerados definitivos antes da validação do backend/gestão.

---

# 19. Próximo passo

Após avaliar a demo da Galeria:

```text
JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES
```

Antes de avançar após cada demo, aplicar o mesmo princípio usado nas Janelas 1–4: **a estrutura aprovada na demo deve estar refletida no código o mais fielmente possível**.
