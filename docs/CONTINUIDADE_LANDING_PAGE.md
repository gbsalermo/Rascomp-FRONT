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
4. a janela competitiva só aparece quando houver competição pública da RAS em `EM_ANDAMENTO` gerenciada pelo RasComp;
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

Implementado próximo da demo com mídia principal, miniaturas, tabs largas, blocos explicativos com ícones e faixa inferior de indicadores.

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

# 10. JANELA 6 — EVENTOS DA RAS ✅

Arquivos:

```text
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/events.css
```

A demo aprovada substituiu o conceito inicial de barras expansíveis.

Estrutura final:

```text
EVENTOS DA RAS

[ Todos ] [ Organizados pela RAS ] [ Participações ] [ Oficinas ] [ Palestras ] [ Competições ]

┌──────────────────────────────────────────────────────────┬──────────────────────┐
│ PRÓXIMOS EVENTOS                                         │ PRÓXIMOS NA AGENDA   │
│ cards de eventos                                         │ data + evento + tipo │
├──────────────────────────────────────────────────────────┼──────────────────────┤
│ DESTAQUES DE EVENTOS ANTERIORES                          │ FIQUE POR DENTRO     │
│ cards históricos                                         │ e-mail + redes       │
└──────────────────────────────────────────────────────────┴──────────────────────┘

[ eventos ] [ pessoas impactadas ] [ escolas ] [ anos ] [ estados ]
```

`id="calendario"` fica na agenda lateral para atender ao link Calendário do Header.

Imagens, datas, locais e indicadores ainda são placeholders editoriais.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + CRONOGRAMA + ACOMPANHAR ✅ IMPLEMENTAÇÃO INICIAL

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

Nenhum espaço vazio, placeholder competitivo ou painel inativo deve ocupar a Home.

`INSCRICOES_ABERTAS`, `PLANEJADA`, `FINALIZADA` e demais estados não exibem esta janela. Esses estados ainda podem alimentar Hero/Header quando fizer sentido, mas não o acompanhamento ao vivo.

Se existirem duas competições simultaneamente em `EM_ANDAMENTO`, a janela oferece seletor para alternar entre elas.

## Estrutura implementada

```text
┌───────────────────────────────────────────────────────────────┐
│ COMPETIÇÃO EM ANDAMENTO                                      │
│ RRC 20XX                                      [ acompanhar ] │
│ descrição + período                                           │
└───────────────────────────────────────────────────────────────┘

[ inscrições ] [ equipes ] [ robôs ] [ categorias ] [ partidas ]

CRONOGRAMA
Inscrições → Homologação → Chaves → Inspeção → Disputas → Finais

ACOMPANHAR
[ Ao vivo ] [ Partidas ] [ Chave ] [ Ranking ] [ Resultados ]
```

## Visão geral

Indicadores são derivados dos dados públicos da competição selecionada:

- inscrições aprovadas;
- equipes únicas;
- robôs únicos;
- categorias/modalidades;
- partidas da chave selecionada.

Não usar contagens globais de outras competições.

## Cronograma

O backend atual fornece datas oficiais para:

- início/fim das inscrições;
- início/fim da competição.

Por isso o frontend **não inventa datas** para homologação, chave, inspeção ou finais.

A timeline mostra essas etapas, mas só exibe datas específicas quando existem no cadastro oficial. Estados derivados dos dados públicos podem indicar, por exemplo, que a chave já foi publicada.

## Acompanhar

Tabs internas:

```text
Ao vivo
Partidas
Chave
Ranking
Resultados
```

### Ao vivo

Mostra:

- partida em andamento, se houver;
- caso contrário, próxima partida agendada;
- horário;
- status;
- chave atual;
- líder Follow Line;
- quantidade de resultados publicados.

### Partidas

Lista as partidas oficiais retornadas pela API pública, com rodada, ordem, confronto, horário e status.

### Chave

Organiza as partidas por rodada para apresentar o chaveamento sem recalcular progressão.

O frontend apenas representa os dados publicados pelo backend.

### Ranking

Usa o ranking Follow Line oficial e o campo correto:

```text
tempoFinalSegundos
```

Permite trocar a categoria Follow Line quando houver mais de uma.

### Resultados

Exibe os resultados oficiais da chave selecionada, vencedor e placar quando disponível.

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
- registra round/partida.

## Refatoração realizada no App.vue

Os blocos competitivos antigos foram removidos:

```text
live-strip
visão geral competitiva separada
ranking Follow Line separado
Sumô separado
robôs/equipes competitivos separados
```

Tudo foi consolidado na `ActiveCompetition.vue`.

O `App.vue` também deixou de depender de `assetUrl` para esses blocos antigos e o fluxo de troca de competição/categoria/chave ficou explícito.

## Atualização automática

Enquanto a competição selecionada estiver em `EM_ANDAMENTO`, os dados são recarregados conforme:

```text
VITE_REFRESH_MS
```

Fallback atual: 20 segundos.

## Estado da etapa

Implementação estrutural concluída. A demo desta janela deve ser avaliada e passa a ser o alvo visual para o refinamento, como nas janelas anteriores.

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
JANELA 7 — Competição/Cronograma/Acompanhar ✅ implementação inicial; demo agora
JANELA 8 — Footer                           ⬜
```

---

# 17. Próximo passo

1. avaliar a demo da Janela 7;
2. ajustar a implementação para máxima fidelidade;
3. depois seguir para:

```text
JANELA 8 — FOOTER INSTITUCIONAL
```

Antes de considerar a Landing consolidada, rodar `npm run typecheck` e `npm run build` no ambiente local.
