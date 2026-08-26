# Status consolidado — Landing Page / Site Público RAS UFRB

> Snapshot técnico e visual da Landing ao concluir as 8 janelas da Home.
> Este arquivo complementa `docs/CONTINUIDADE_LANDING_PAGE.md` e serve como checklist de retomada, validação e publicação.

---

# 1. Identidade e escopo

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Landing é o site institucional da **RAS UFRB**. O RRC aparece como conteúdo de destaque quando houver contexto competitivo, mas não domina a Home durante todo o ano.

A Landing fica em:

```text
landing-page/
```

Stack atual:

```text
Vue 3
TypeScript 5.9
Vite 7
Axios
```

Scripts atuais:

```bash
npm run dev        # Vite na porta 5174
npm run typecheck  # vue-tsc --noEmit
npm run build      # vue-tsc --noEmit && vite build
npm run preview    # Vite preview na porta 5174
```

Variáveis de ambiente:

```env
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

---

# 2. Direção visual congelada

A referência de ritmo/arquitetura é a ERBASE, **sem copiar código, textos ou assets**.

Direção aprovada:

- fundo branco dominante;
- visual institucional, leve e tecnológico;
- roxo como estrutura institucional;
- rubro para CTAs, competição e destaques;
- cinzas claros para respiro e divisões;
- fotografias reais quando o acervo oficial estiver disponível;
- transições suaves;
- evitar cyberpunk, excesso de contraste escuro ou aparência de dashboard.

## Paleta oficial da Landing

```text
Rubro principal        #D20F39
Rubro secundário       #CF1037
Rubro escuro           #B70C32
Roxo principal         #5D2281
Roxo interação         #6B1F8A
Texto principal        #2B2230
Cinza/borda suave      #E9E2EC
Fundo principal        #FFFFFF
```

Regra:

```text
rubro = títulos, links importantes, competição, alertas e CTA principal
roxo  = estrutura, hover, sublinhados, CTA secundário e fechamento institucional
```

Não criar uma paleta paralela em futuras alterações.

---

# 3. Ordem final da Home

A ordem atual no `App.vue` é:

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

Componentes:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/components/HighlightsHero.vue
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/components/ActiveCompetition.vue
landing-page/src/components/InstitutionalFooter.vue
```

CSS por janela:

```text
landing-page/src/header.css
landing-page/src/highlights-hero.css
landing-page/src/about.css
landing-page/src/team-robots-awards.css
landing-page/src/gallery.css
landing-page/src/events.css
landing-page/src/active-competition.css
landing-page/src/footer.css
```

Todos são importados por `landing-page/src/main.ts`.

---

# 4. Estado de cada janela

## Janela 1 — Header ✅

Implementado:

- identidade IEEE RAS UFRB;
- Início;
- Sobre;
- Competição com dropdown;
- Calendário;
- Eventos;
- Contato;
- CTA de inscrições;
- faixa rubra de competição em andamento;
- navegação responsiva/mobile.

Dropdown competição:

```text
Competição atual
Cronograma
Resultados
Chaveamento
```

`Edições anteriores` foi removido do escopo da Home.

Pendência principal:

- consolidar asset oficial da identidade dentro do `landing-page/public/`.

---

## Janela 2 — Hero / Painel de Destaques ✅

Estrutura atual:

```text
[ SLIDE VISUAL GRANDE ] [ ÚLTIMAS NOVIDADES ]
[ preview ] [ preview ] [ preview ] [ preview ]
```

Slides preparados:

- RAS UFRB;
- RAS nas Escolas;
- Oficinas;
- Premiações;
- Competição, quando aplicável.

Comportamento:

- autoplay de aproximadamente 7 s;
- pausa em hover/interação;
- setas;
- dots;
- previews clicáveis;
- competição entra dinamicamente quando o status for aplicável.

Pendências:

- substituir placeholders por fotos oficiais;
- revisar textos finais e links oficiais.

---

## Janela 3 — Sobre IEEE + RAS ✅

Estrutura:

```text
[ galeria/collage ] [ O que é IEEE | O que é RAS UFRB ]
[ indicadores institucionais ]
```

Implementado:

- mídia principal com thumbnails;
- slider automático;
- tabs IEEE / RAS UFRB;
- blocos explicativos;
- indicadores.

Indicadores atuais são placeholders editoriais:

```text
25+ membros
7+ robôs
18+ prêmios
10+ eventos
8+ escolas
```

Pendências:

- confirmar números oficiais;
- inserir fotos oficiais;
- revisar texto institucional com a equipe antes de publicar.

---

## Janela 4 — Equipe / Diretoria / Robôs / Premiações ✅

Alvo visual aprovado: **opção 1**.

Estrutura atual:

```text
[ EQUIPE EM LISTA ] [ DIRETORIA EM MOSAICO ] [ ROBÔS ]
[ PREMIAÇÕES ]
[ indicadores ]
```

Equipe:

- busca;
- filtro por área;
- lista de integrantes.

Diretoria:

- mosaico visual;
- cargo;
- nome;
- área.

Robôs:

- cards;
- status;
- modalidade;
- resumo;
- detalhe expansível.

Premiações:

- cards de ouro/prata/bronze/destaque.

Dados que ainda são placeholders:

- integrantes;
- cargos/nome da diretoria;
- robô `Projeto 03`;
- premiações;
- parte dos indicadores.

Robôs já citados editorialmente:

```text
Vespa
PIPETA
```

Pendências:

- substituir lista genérica pelos membros reais;
- inserir fotos;
- confirmar diretoria;
- confirmar robôs e projetos oficiais;
- confirmar premiações e anos.

---

## Janela 5 — Galeria ✅

Estrutura atual:

```text
[ Todos ] [ RRC ] [ Oficinas ] [ RAS nas Escolas ] [ Premiações ] [ Eventos ]

[ álbum ] [ álbum ] [ álbum ]
```

Cada álbum possui:

- foto principal placeholder;
- 3 miniaturas;
- categoria;
- título;
- quantidade;
- data;
- descrição;
- `Ver álbum`;
- prévia flutuante.

Álbuns editoriais atuais:

```text
RRC 2026
Oficina de Robótica
RAS nas Escolas
Conquistas e Premiações
Eventos Institucionais
```

Pendências:

- criar/definir armazenamento real das fotos;
- trocar datas e quantidades por valores reais;
- implementar navegação real de imagens no preview;
- autorização/créditos de imagem;
- otimização + lazy loading.

---

## Janela 6 — Eventos da RAS ✅

Demo final aprovada e implementação alinhada.

Estrutura:

```text
EVENTOS DA RAS

[ filtros ]

[ PRÓXIMOS EVENTOS ] [ PRÓXIMOS NA AGENDA ]
[ EVENTOS ANTERIORES ] [ FIQUE POR DENTRO ]

[ indicadores ]
```

Filtros:

```text
Todos os eventos
Organizados pela RAS
Participações
Oficinas
Palestras
Competições
```

Atualmente há conteúdo editorial temporário para:

- RRC 2026;
- Oficina Arduino;
- Palestra IA na Robótica;
- RAS nas Escolas;
- Robodori;
- competição externa.

O bloco `Fique por dentro` possui comportamento demonstrativo local.

Pendências:

- newsletter real ainda não existe;
- URLs de redes ainda não estão confirmadas;
- datas, locais, fotos e números precisam ser oficiais;
- decidir se eventos serão estáticos, CMS ou endpoint público futuramente.

---

## Janela 7 — Competição atual + acompanhamento ✅

Demo simplificada aprovada e implementação alinhada.

### Regra crítica

A janela só aparece quando:

```text
competition.status === 'EM_ANDAMENTO'
```

Sem competição em andamento:

```text
EVENTOS
↓
FOOTER
```

Ela **não deixa espaço vazio**.

Se houver mais de uma competição simultânea em `EM_ANDAMENTO`, há seletor de competição.

### Estrutura final

```text
COMPETIÇÃO ATUAL
RRC 20XX + EM ANDAMENTO

[ PANORAMA GERAL ] [ FOLLOW LINE ] [ SUMÔ ]

[ PRÓXIMA PARTIDA ] [ ÚLTIMO RESULTADO ] [ RANKING FOLLOW ]
```

Panorama:

- equipes únicas;
- robôs únicos;
- categorias/modalidades;
- inscrições aprovadas;
- progresso visual.

Follow Line:

- top 3 oficial;
- robô;
- equipe;
- `tempoFinalSegundos`;
- categoria selecionável;
- expansão do ranking completo.

Sumô:

- próximos confrontos;
- status;
- chave selecionável;
- expansão do chaveamento por rodada.

Atualização automática:

```text
VITE_REFRESH_MS
fallback = 20000 ms
```

Fonte de verdade:

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

Pendências:

- validar todos os contratos públicos contra o backend rodando;
- testar cenário sem competição ativa;
- testar uma competição ativa;
- testar duas competições ativas simultaneamente;
- testar Follow sem ranking;
- testar Sumô sem chave;
- testar chave completa e resultados reais;
- validar refresh de 20 s sem flicker ou chamadas duplicadas perceptíveis.

---

## Janela 8 — Footer institucional ✅

Demo final aprovada e implementação alinhada.

Visual final:

```text
ÁREA BRANCA
IEEE RAS UFRB | Navegação | Links úteis | Apoio/Parceiros | Fale Conosco

FAIXA ROXO PROFUNDO
identidade | missão | copyright + ♥ | privacidade | termos | ↑
```

Direção final:

- branco na área principal;
- rubro em títulos, links e ícones principais;
- roxo em sublinhados, hover, CTA de parceiro e detalhes;
- faixa final em roxo profundo;
- tipografia mais forte e maior para evitar aparência de microtexto;
- visual inspirado na lógica institucional da ERBASE, sem copiar código/assets.

Pendências:

- contatos reais;
- links reais de redes sociais;
- páginas reais de Privacidade e Termos de Uso;
- logos oficiais dos parceiros;
- parceiros/patrocinadores confirmados;
- asset IEEE RAS local na Landing.

---

# 5. Integração com API pública

Arquivo:

```text
landing-page/src/api.ts
```

Endpoints consumidos hoje:

```http
GET /api/v1/public/competicoes
GET /api/v1/public/categorias
GET /api/v1/public/equipes
GET /api/v1/public/robos
GET /api/v1/public/inscricoes?competitionId=
GET /api/v1/public/ranking/seguidor-linha?competitionId=&categoryId=
GET /api/v1/public/chaveamentos?competitionId=
GET /api/v1/public/partidas?bracketId=
GET /api/v1/public/resultados?bracketId=
```

O `App.vue` seleciona o foco nesta ordem:

```text
1. EM_ANDAMENTO
2. INSCRICOES_ABERTAS
3. primeira competição disponível
```

A Janela 7 continua escondida caso o foco não esteja `EM_ANDAMENTO`.

---

# 6. O que já está concluído

```text
✅ arquitetura visual das 8 janelas
✅ ordem final da Home
✅ identidade RAS/RRC/RASCOMP separada corretamente
✅ paleta rubro + roxo congelada
✅ Header responsivo
✅ Hero editorial/slider
✅ seção Sobre IEEE/RAS
✅ Equipe/Diretoria/Robôs/Premiações
✅ Galeria em álbuns
✅ Eventos + agenda
✅ Janela competitiva condicional
✅ acompanhamento separado Follow Line / Sumô
✅ Footer institucional final
✅ integração inicial com API pública
✅ atualização automática durante competição
✅ documentação de continuidade por janela
```

A fase de **construção visual por janelas está encerrada**.

---

# 7. Pendências obrigatórias antes de publicação

## P0 — Bloqueadores técnicos

- [ ] rodar `npm install` no ambiente local atualizado;
- [ ] rodar `npm run typecheck`;
- [ ] rodar `npm run build`;
- [ ] corrigir qualquer erro TypeScript/Vite;
- [ ] testar API pública real com backend local;
- [ ] testar a Home sem backend disponível;
- [ ] testar a Janela 7 com/sem competição ativa;
- [ ] confirmar que todos os anchors do Header/Footer existem;
- [ ] copiar o asset oficial IEEE RAS para `landing-page/public/` e remover referência temporária externa.

## P1 — Conteúdo/editorial

- [ ] fotos oficiais da RAS;
- [ ] membros reais;
- [ ] diretoria atual;
- [ ] robôs/projetos oficiais;
- [ ] premiações reais;
- [ ] números institucionais confirmados;
- [ ] eventos/datas/locais reais;
- [ ] contatos oficiais;
- [ ] redes sociais oficiais;
- [ ] parceiros e patrocinadores confirmados;
- [ ] revisar textos institucionais com a organização.

## P1 — Experiência/responsividade

- [ ] revisar desktop 1920/1440/1366;
- [ ] tablet;
- [ ] mobile;
- [ ] transições entre janelas;
- [ ] espaçamento vertical global;
- [ ] consistência de cards/bordas/radius;
- [ ] verificar sticky Header;
- [ ] testar scroll para anchors;
- [ ] testar previews/expandir/recolher;
- [ ] testar teclado e foco.

## P2 — Acessibilidade e qualidade

- [ ] `alt` definitivo para fotos reais;
- [ ] contraste WCAG;
- [ ] foco visível;
- [ ] navegação por teclado;
- [ ] `prefers-reduced-motion`;
- [ ] semântica de headings;
- [ ] aria-label onde necessário.

## P2 — Publicação/SEO

- [ ] title/meta description;
- [ ] Open Graph;
- [ ] favicon;
- [ ] manifest;
- [ ] sitemap;
- [ ] robots.txt;
- [ ] página 404 pública;
- [ ] páginas Privacidade e Termos de Uso;
- [ ] performance/Lighthouse;
- [ ] compressão de imagens;
- [ ] lazy loading;
- [ ] estratégia de deploy/domínio.

---

# 8. Pontos que ainda NÃO devem ser considerados reais

Os seguintes itens são demonstrativos até confirmação oficial:

- números de membros/robôs/prêmios/eventos/escolas;
- nomes genéricos de membros e diretoria;
- parte dos robôs/projetos;
- premiações;
- fotos;
- datas de eventos;
- quantidades de fotos da Galeria;
- contatos;
- URLs de redes;
- parceiros;
- newsletter;
- políticas legais.

Não publicar esses dados como fatos sem validação.

---

# 9. Roteiro de validação local

Quando voltar ao PC:

```powershell
cd Rascomp-FRONT
git pull origin main

cd landing-page
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Abrir:

```text
http://localhost:5174
```

Ordem da revisão visual:

```text
1. Header
2. Hero
3. Sobre IEEE/RAS
4. Equipe/Diretoria/Robôs/Premiações
5. Galeria
6. Eventos
7. Competição ativa (se aplicável)
8. Footer
```

Para a Janela 7 fazer dois testes obrigatórios:

```text
CENÁRIO A — nenhuma competição EM_ANDAMENTO
Eventos → Footer

CENÁRIO B — competição EM_ANDAMENTO
Eventos → Janela 7 → Footer
```

---

# 10. Critério para considerar a Landing consolidada

Só marcar a Landing como pronta para publicação quando:

```text
TYPECHECK ✅
BUILD ✅
DESKTOP ✅
TABLET ✅
MOBILE ✅
API PÚBLICA ✅
SEM COMPETIÇÃO ATIVA ✅
COM COMPETIÇÃO ATIVA ✅
ASSETS OFICIAIS ✅
CONTEÚDO OFICIAL ✅
CONTATOS/PARCEIROS ✅
ACESSIBILIDADE BÁSICA ✅
SEO/PUBLICAÇÃO ✅
```

---

# 11. Estado atual resumido

```text
FASE: CONSTRUÇÃO VISUAL POR JANELAS     ✅ ENCERRADA
FASE: REVISÃO INTEGRADA                 ⏭ PRÓXIMA
FASE: CONTEÚDO/ASSETS OFICIAIS          ⏳ PENDENTE
FASE: VALIDAÇÃO TÉCNICA                 ⏳ PENDENTE
FASE: PUBLICAÇÃO                        ⏳ PENDENTE
```

A próxima sessão deve começar pela **revisão integrada local da Landing**, não por criar novas janelas.
