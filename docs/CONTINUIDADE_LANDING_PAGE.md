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

## Paleta institucional congelada

A Landing deve reutilizar a mesma identidade já usada no Header e não criar uma paleta paralela.

```text
Rubro principal        #D20F39
Rubro secundário       #CF1037
Rubro escuro           #B70C32
Roxo principal         #5D2281
Roxo de interação      #6B1F8A
Texto principal        #2B2230
Cinza/borda suave      #E9E2EC
Fundo principal        #FFFFFF
```

Regra visual:

- rubro = títulos, links importantes, competição e ações de destaque;
- roxo = estrutura, sublinhados, hover, CTAs secundários e fechamento institucional;
- não transformar a Landing em um site inteiramente roxo ou inteiramente vermelho.

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
3. a janela competitiva só aparece quando houver competição pública da RAS em `EM_ANDAMENTO` gerenciada pelo RasComp;
4. competição não faz parte da janela de Equipe/Robôs/Premiações;
5. Follow Line e Sumô possuem acompanhamento separado dentro da janela competitiva;
6. o Footer encerra a Home com identidade institucional, navegação, parceiros e contato.

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
   ↓
footer institucional
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
- item ativo com linha rubra;
- fundo branco;
- roxo em estrutura/hover;
- CTA Inscrições rubro;
- mobile com hambúrguer + identidade + CTA.

Logo oficial IEEE RAS/UFRB ainda será consolidado como asset definitivo da própria Landing.

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
- RAS nas Escolas;
- oficinas/formação;
- premiações/conquistas;
- competição atual quando aplicável.

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

Nenhum conteúdo da competição atual aparece nesta janela.

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

Cada álbum tem foto principal, três miniaturas, categoria, título, quantidade de fotos, data, descrição e ação `Ver álbum`.

Ao clicar, abre prévia flutuante. Fotos, datas e quantidades ainda são placeholders.

---

# 10. JANELA 6 — EVENTOS DA RAS ✅ DEMO APROVADA + IMPLEMENTAÇÃO ALINHADA

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

Inclui:

- filtros por tipo;
- quatro cards de próximos eventos;
- agenda lateral;
- eventos anteriores;
- bloco Fique por dentro;
- redes sociais;
- faixa de indicadores;
- `id="calendario"` na agenda lateral para o Header.

Imagens, datas, locais e indicadores ainda são placeholders editoriais.

---

# 11. JANELA 7 — COMPETIÇÃO ATUAL + ACOMPANHAMENTO ✅ DEMO SIMPLIFICADA APROVADA

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

`INSCRICOES_ABERTAS`, `PLANEJADA`, `FINALIZADA` e demais estados não exibem esta janela.

Se existirem duas competições simultaneamente em `EM_ANDAMENTO`, a janela permite alternar entre elas.

## Estrutura final aprovada

A primeira demo competitiva foi rejeitada por estar carregada demais.

A versão oficial é a simplificada:

```text
COMPETIÇÃO ATUAL
RRC 20XX + Em andamento
resumo

┌──────────────────────────────┬──────────────────────┬──────────────────────┐
│ PANORAMA GERAL               │ FOLLOW LINE          │ SUMÔ                 │
│ equipes / robôs              │ top 3 ranking        │ próximos confrontos  │
│ modalidades / inscrições     │ tempo oficial        │ robô A × robô B      │
│ progresso                    │ Ver ranking          │ Ver chave            │
│ [ Acompanhar competição ]    │                      │                      │
└──────────────────────────────┴──────────────────────┴──────────────────────┘

PRÓXIMOS DESTAQUES
[ próxima partida ] [ último resultado ] [ ranking Follow Line ]
```

## Panorama geral

Usa dados públicos da competição selecionada:

- equipes únicas;
- robôs únicos;
- modalidades/categorias;
- inscrições aprovadas.

A linha de progresso resume:

```text
Inscrições → Inspeção → Chaves → Partidas → Finais
```

É uma indicação visual de andamento, não uma nova fonte de regra de negócio.

## Follow Line

Acompanhamento dedicado:

- top 3 do ranking oficial;
- robô;
- equipe;
- `tempoFinalSegundos`;
- seletor quando houver mais de uma categoria Follow Line;
- botão `Ver ranking` expande a classificação oficial completa.

O frontend não recalcula ranking.

## Sumô

Acompanhamento dedicado:

- próximos confrontos da chave selecionada;
- robô A × robô B;
- status;
- seletor quando houver mais de uma chave;
- botão `Ver chave` expande o chaveamento por rodada.

O frontend não gera chave e não avança vencedor.

## Próximos destaques

Faixa curta no final da janela:

- próxima partida Sumô;
- último resultado oficial Sumô;
- líder/ranking Follow Line.

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

## Atualização automática

Enquanto a competição selecionada estiver em `EM_ANDAMENTO`, os dados são recarregados conforme `VITE_REFRESH_MS`.

Fallback atual: 20 segundos.

---

# 12. JANELA 8 — FOOTER INSTITUCIONAL ✅ DEMO FINAL APROVADA + IMPLEMENTAÇÃO ALINHADA

Arquivos:

```text
landing-page/src/components/InstitutionalFooter.vue
landing-page/src/footer.css
```

Integração no final do `App.vue`:

```text
<ActiveCompetition ... />
<InstitutionalFooter />
```

O footer provisório do RasComp foi removido da Home.

## Alvo visual final

A versão final aprovada segue a lógica institucional da ERBASE, mas sem copiar código ou assets.

O footer possui duas camadas:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ÁREA BRANCA                                                                 │
│                                                                             │
│ IEEE RAS UFRB | NAVEGAÇÃO | LINKS ÚTEIS | APOIO/PARCEIROS | FALE CONOSCO │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│ FAIXA ROXO PROFUNDO                                                         │
│ RAS/IEEE | missão | copyright + feito com ♥ | privacidade | termos | ↑    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Área branca

Identidade:

- IEEE RAS UFRB;
- Robotics & Automation Society;
- UFRB Student Chapter;
- descrição institucional curta;
- localização;
- contato;
- redes sociais.

Navegação:

- Início;
- Sobre a RAS;
- Equipe;
- Robôs;
- Eventos;
- Competição;
- Galeria;
- Contato.

Links úteis:

- IEEE RAS Global;
- IEEE Brasil;
- IEEE Xplore;
- Eventos;
- recursos para estudantes;
- guias e materiais;
- código de conduta.

Apoio e parceiros:

- UFRB;
- IEEE;
- IEEE RAS;
- CETEC;
- CTA `Seja um parceiro`.

Contato:

- E-mail;
- Instagram;
- mensagem/formulário futuro.

Contatos não confirmados continuam marcados como placeholders, sem inventar informação oficial.

## Tipografia aprovada

O usuário rejeitou letras pequenas/fracas.

Regra:

- títulos fortes e legíveis;
- links com peso alto;
- corpo com tamanho confortável;
- evitar microtexto decorativo;
- manter respiro entre colunas.

## Uso de rubro e roxo

A área branca não deve virar monocromática.

Aprovado:

- **rubro** em títulos, ícones e links principais;
- **roxo** em sublinhados, hover, CTA de parceiro e detalhes;
- texto descritivo em grafite para manter leitura;
- faixa final em **roxo profundo**, não preto puro;
- linha superior da faixa final em roxo.

Essa combinação deve permanecer alinhada à identidade visual usada no Header.

## Faixa final

A faixa final é obrigatória e funciona como fechamento visual da Home.

Inclui:

- identidade IEEE RAS UFRB;
- frase institucional curta;
- copyright dinâmico pelo ano atual;
- `Feito com ♥ por membros da RAS UFRB`;
- Privacidade;
- Termos de Uso;
- botão circular `↑` para voltar ao topo.

## Asset institucional

A implementação usa o asset original de IEEE RAS já existente no repositório, em vez de gerar uma nova logo.

Enquanto o asset não for duplicado fisicamente para `landing-page/public/`, a Landing referencia temporariamente o arquivo original existente no projeto de gestão. Antes da publicação definitiva, mover/copiar o asset oficial para a própria pasta pública da Landing para eliminar dependência externa.

## Responsividade

Desktop:

- cinco colunas na área branca;
- faixa inferior horizontal.

Tablet:

- colunas reorganizadas;
- contato passa para uma linha própria quando necessário.

Mobile:

- blocos empilhados;
- tipografia mantém legibilidade;
- parceiros em grade reduzida;
- faixa final empilhada;
- botão voltar ao topo permanece acessível.

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
- textos institucionais;
- Footer.

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

Antes da publicação definir:

- acervo oficial;
- autorização;
- armazenamento;
- créditos;
- legendas;
- otimização;
- lazy loading;
- logos institucionais e de parceiros;
- cópia local do asset oficial IEEE RAS para `landing-page/public/`.

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
- [ ] 404 pública;
- [ ] copiar asset oficial IEEE RAS para o `public/` da Landing;
- [ ] substituir contatos e parceiros placeholders por dados confirmados.

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
JANELA 8 — Footer                           ✅ demo final aprovada + implementação alinhada
```

---

# 17. Próximo passo

A arquitetura visual das 8 janelas da Home está fechada.

Próxima fase:

```text
REVISÃO INTEGRADA DA LANDING
```

Quando houver acesso local:

```bash
cd landing-page
npm run typecheck
npm run build
npm run dev
```

Revisar no navegador:

1. transições entre as janelas;
2. consistência da paleta rubro + roxo;
3. espaçamento vertical;
4. mobile/tablet;
5. links internos;
6. estados com e sem competição `EM_ANDAMENTO`;
7. placeholders de imagens, contatos, parceiros e números;
8. Footer final e retorno ao topo.

Depois disso, substituir assets e conteúdo editorial temporário pelo material oficial antes da publicação.
