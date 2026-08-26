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
- evitar cyberpunk, aparência de dashboard e excesso de informação simultânea.

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
├── [CONDICIONAL] COMPETIÇÃO ATUAL + ACOMPANHAMENTO
│
└── FOOTER INSTITUCIONAL
```

Decisões congeladas:

1. Equipe/Diretoria/Robôs/Premiações fica antes da Galeria;
2. `Edições anteriores` foi removido do esqueleto da Home;
3. competição atual e acompanhamento ficam numa única janela;
4. a janela competitiva só aparece para competição pública da RAS em `EM_ANDAMENTO` gerenciada pelo RasComp;
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
competição atual, somente quando estiver ocorrendo
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

Comportamento: autoplay, pausa em interação, setas, dots, previews e painel lateral de novidades.

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

Implementado próximo da demo com mídia principal, miniaturas, tabs largas, blocos explicativos e faixa inferior de indicadores.

Fotos e números ainda são placeholders.

---

# 8. JANELA 4 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES ✅

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

A **opção 1 da demo** é o alvo visual aprovado.

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

Equipe e Diretoria aparecem simultaneamente. Nenhum conteúdo da competição atual aparece nesta janela.

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

Ao clicar em um álbum, abre prévia flutuante. Fotos, datas e quantidades ainda são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS ✅ DEMO APROVADA + IMPLEMENTAÇÃO ALINHADA

Arquivos:

```text
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/events.css
```

A versão aprovada é a demo com cards de eventos, agenda e histórico — **não** a ideia inicial de barras expansíveis.

Estrutura oficial:

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

Já implementado:

- filtros;
- quatro próximos eventos em destaque;
- agenda lateral;
- cards de eventos anteriores;
- painel `Fique por dentro`;
- newsletter demonstrativa;
- links visuais para redes;
- faixa de indicadores;
- `id="calendario"` na agenda;
- responsividade.

Diferenças temporárias aceitas em relação à demo:

- imagens ainda são placeholders/gradientes;
- datas e locais são exemplos editoriais;
- indicadores são placeholders até confirmação oficial.

**Revisão de fidelidade: APROVADA.**

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + ACOMPANHAMENTO ✅ DEMO SIMPLIFICADA APROVADA + IMPLEMENTAÇÃO ALINHADA

Arquivos:

```text
landing-page/src/components/ActiveCompetition.vue
landing-page/src/active-competition.css
```

Integração:

```text
<InstitutionalEvents />
<ActiveCompetition ... />
```

## Regra condicional — CRÍTICA

A janela só renderiza quando:

```text
competition.status === EM_ANDAMENTO
```

Se não houver competição em andamento:

```text
Eventos da RAS
      ↓
Footer
```

Não deve existir espaço vazio ou painel competitivo inativo.

`INSCRICOES_ABERTAS`, `PLANEJADA`, `FINALIZADA`, `CANCELADA` e demais estados não exibem esta janela.

Se existirem duas competições simultaneamente em `EM_ANDAMENTO`, aparece um seletor compacto para alternar entre elas.

## Demo simplificada aprovada

A primeira demo da Janela 7 foi rejeitada por estar cheia demais. A versão oficial é a segunda demo, mais leve:

```text
COMPETIÇÃO ATUAL
RRC 20XX                             [ Em andamento ]
resumo curto

┌────────────────────────────┬───────────────────────┬───────────────────────┐
│ PANORAMA GERAL             │ FOLLOW LINE           │ SUMÔ                  │
│ equipes                    │ top 3 ranking         │ próximos confrontos   │
│ robôs                      │ robô + tempo          │ A × B                  │
│ modalidades                │                       │                        │
│ inscrições                 │ Ver ranking completo  │ Ver chave completa     │
│                            │                       │                        │
│ Inscrições → Inspeção      │                       │                        │
│ → Chaves → Partidas →      │                       │                        │
│ Finais                     │                       │                        │
│ [ Acompanhar competição ]  │                       │                        │
└────────────────────────────┴───────────────────────┴───────────────────────┘

PRÓXIMOS DESTAQUES
[ próxima partida ] [ último resultado ] [ líder/ranking Follow Line ]
```

## Panorama geral

Exibe somente dados da competição selecionada:

- equipes únicas com inscrição aprovada;
- robôs únicos com inscrição aprovada;
- quantidade de modalidades presentes;
- total de inscrições da competição.

### Progresso simplificado

```text
Inscrições → Inspeção → Chaves → Partidas → Finais
```

Os estados visuais são derivados dos dados públicos disponíveis.

O frontend não inventa resultados nem progressão oficial.

## Follow Line

Card próprio, separado do Sumô.

Mostra inicialmente:

- top 3 do ranking oficial;
- posição;
- robô;
- equipe;
- `tempoFinalSegundos`.

Quando houver mais de uma categoria Follow Line, aparece seletor compacto.

`Ver ranking completo` expande até oito posições sem transformar a Home em uma página esportiva pesada.

## Sumô

Card próprio.

Mostra inicialmente até dois próximos confrontos oficiais:

```text
ROBÔ A × ROBÔ B      Em breve / Agora
```

Quando houver mais de uma chave, aparece seletor compacto.

`Ver chave completa` expande uma representação enxuta das rodadas.

O frontend apenas representa a chave publicada pelo backend e nunca calcula avanço.

## Próximos destaques

Faixa inferior enxuta com:

- próxima partida de Sumô;
- último resultado oficial publicado;
- líder/ranking atual do Follow Line.

## Fonte de verdade

```text
Gestão → Spring Boot → /api/v1/public/** → Landing
```

A Landing nunca:

- gera chave;
- avança vencedor;
- decide resultado;
- recalcula ranking oficial;
- altera inscrição;
- registra round ou partida.

## Refatoração do App.vue

Os antigos blocos competitivos separados foram removidos:

```text
live-strip
visão geral competitiva isolada
ranking Follow Line isolado
Sumô isolado
robôs/equipes competitivos isolados
```

Todo o acompanhamento está concentrado em `ActiveCompetition.vue`.

## Atualização automática

Enquanto a competição selecionada estiver em `EM_ANDAMENTO`, os dados são recarregados conforme:

```text
VITE_REFRESH_MS
```

Fallback atual: 20 segundos.

**Revisão de fidelidade: a versão simplificada aprovada é agora a implementação oficial.**

---

# 12. JANELA 8 — FOOTER INSTITUCIONAL ⏭ PRÓXIMA

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

## Estático/editorial

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

## Dinâmico via backend público

- competição atual;
- status;
- inscrições;
- categorias;
- ranking Follow Line;
- chaveamentos Sumô;
- partidas;
- resultados;
- campeões.

```text
Gestão → Backend Spring Boot → /api/v1/public/** → Landing
```

---

# 14. Imagens e mídia — pendente

Durante a construção placeholders são permitidos.

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
JANELA 7 — Competição/Acompanhamento        ✅ demo simplificada aprovada + implementação alinhada
JANELA 8 — Footer                           ⏭ próxima
```

---

# 17. Próximo passo

```text
JANELA 8 — FOOTER INSTITUCIONAL
```

Antes de considerar a Landing consolidada, rodar no ambiente local:

```bash
npm run typecheck
npm run build
```
