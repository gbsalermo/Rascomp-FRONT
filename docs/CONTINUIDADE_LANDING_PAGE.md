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

Para cada janela:

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
├── GALERIA                                 ⏭ próxima janela
│
├── EQUIPE / DIRETORIA / ROBÔS / PRÊMIOS   planejado
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

Calendário geral do capítulo, incluindo:

- visitas em escolas;
- oficinas;
- competições;
- ações/eventos institucionais.

## Eventos

Apresenta eventos promovidos/participados pela RAS.

## CTA Inscrições

Só aparece quando a competição pública estiver em `INSCRICOES_ABERTAS`.

## Competição ativa

Quando existir competição `EM_ANDAMENTO`, mostrar faixa fina rubra acima do Header:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

Objetivo: permitir salto direto para competição sem transformar o site institucional em site do RRC.

## Refinamento de fidelidade aplicado

Após comparar implementação com a demo aprovada:

- faixa de competição ativa passou a ser rubra, como no mockup;
- item ativo usa linha inferior rubra simples;
- roxo fica como hover/estrutura institucional;
- botão `Inscrições` usa rubro mais direto;
- header mantém fundo branco e sombra/borda muito discretas;
- mobile aproxima a composição da demo: hambúrguer à esquerda, identidade institucional no centro/esquerda e CTA à direita quando aplicável;
- menu aberto continua contendo navegação completa e CTA contextual.

## Logo

O layout ainda usa uma marca temporária. Substituir pelo asset oficial IEEE RAS/UFRB quando o arquivo definitivo for fornecido.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅

Componentes:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

O Hero **não é um banner fixo do RRC**.
Ele funciona como uma capa editorial dinâmica da RAS UFRB.

## Objetivo

Responder rapidamente:

```text
O que a RAS UFRB está fazendo agora?
```

## Estrutura visual final baseada na demo

```text
┌─────────────────────────────────────────────┬──────────────────────┐
│                                             │ ÚLTIMAS NOVIDADES    │
│       SLIDE VISUAL PRINCIPAL                │                      │
│       foto + overlay                        │ item 1               │
│       categoria                             │ item 2               │
│       título                                │ item 3               │
│       resumo                                │                      │
│       [ CTA ] [ CTA ]                       │                      │
│       ‹             dots              ›     │                      │
└─────────────────────────────────────────────┴──────────────────────┘

[ preview 1 ] [ preview 2 ] [ preview 3 ] [ preview 4 ]
```

Essa estrutura substituiu a versão anterior de `texto à esquerda + mídia à direita`, que estava conceitualmente correta mas não suficientemente fiel à demo.

## Slides iniciais

- apresentação institucional da RAS UFRB;
- competição atual quando aplicável;
- RAS nas Escolas;
- oficinas/formação;
- premiações/conquistas.

Futuramente podem entrar:

- participação em eventos externos;
- projetos atuais;
- novas oficinas;
- chamadas institucionais;
- notícia relevante.

## Painel lateral de novidades

A demo aprovada possui uma coluna `Últimas novidades`, portanto a implementação também possui esse bloco.

Pode destacar:

- competição ativa;
- oficinas;
- RAS nas Escolas;
- premiações;
- novidades institucionais.

O conteúdo atual é temporário/editorial e pode ser substituído por fonte real posteriormente.

## Comportamento

- autoplay aproximadamente a cada 7 segundos;
- pausa ao interagir/posicionar o cursor no slide principal;
- setas laterais;
- dots na base;
- CTA principal em rubro;
- CTA secundário transparente;
- quatro cards-preview abaixo do slide em desktop;
- clique no preview troca o slide;
- responsivo: painel de novidades e previews reorganizam em tablet/mobile.

## Slide competitivo condicional

Só entra quando a competição pública estiver em:

```text
EM_ANDAMENTO
INSCRICOES_ABERTAS
INSCRICOES_ENCERRADAS
```

Quando `EM_ANDAMENTO`:

```text
[ Acompanhar competição ]
```

Quando `INSCRICOES_ABERTAS`:

```text
[ Fazer inscrição ]
```

O RRC nunca vira o slide institucional permanente sem contexto atual.

## Imagens

Enquanto não houver acervo oficial, o layout usa áreas visuais/gradientes placeholder no lugar das fotos.
A troca futura por fotografias reais não deve exigir mudança estrutural.

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

A implementação foi posteriormente aproximada da demo aprovada, incluindo:

- grande mídia principal à esquerda;
- miniaturas inferiores;
- tabs largas no painel direito;
- blocos explicativos com ícones;
- faixa inferior de cinco indicadores.

Os números e fotos são placeholders até confirmação oficial.

## Conteúdo

### IEEE

- comunidade técnica internacional;
- formação e desenvolvimento profissional;
- integração entre pesquisa, indústria e universidade.

### RAS UFRB

- projetos práticos de robótica e automação;
- competições, oficinas e ações de extensão;
- aprendizado colaborativo e desenvolvimento de equipe.

## CTAs

```text
[ Conheça nossas ações ]
[ Ver equipe ]
```

---

# 8. JANELA 4 — GALERIA ⏭ PRÓXIMA

A galeria entra cedo, após o Sobre.

Filtros desejados:

```text
Todos
RRC
Oficinas
RAS nas Escolas
Premiações
Eventos
```

Fonte/armazenamento das imagens ainda será definida.

A demo da Galeria também deverá ser implementada com alta fidelidade estrutural antes de avançar.

---

# 9. JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES

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

Cronograma institucional simples:

```text
Inscrições → Homologação → Chaves → Inspeção → Eliminatórias → Finais
```

Área de acompanhamento:

```text
[ Ao vivo ] [ Partidas ] [ Chave ] [ Ranking ] [ Resultados ]
```

---

# 13. JANELA 9 — EDIÇÕES ANTERIORES

Histórico por edição/ano.

Pode apresentar:

- resumo;
- campeões;
- modalidades;
- fotos;
- resultados;
- chaveamento quando houver dados.

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

Fluxo:

```text
Gestão → Backend Spring Boot → /api/v1/public/** → Landing
```

A Landing nunca:

- gera chave;
- decide vencedor;
- calcula ranking oficial;
- altera inscrição;
- escreve resultado oficial.

---

# 16. Imagens e mídia — pendente

Durante construção:

```text
placeholder / nenhuma imagem = permitido
```

Antes de publicação definir:

- acervo oficial;
- autorização;
- fonte/armazenamento;
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
- [ ] tratamento de erro/loading/vazio;
- [ ] 404 pública.

---

# 18. Estado atual

```text
JANELA 1 — Header                  ✅ implementada + demo + fidelidade revisada
JANELA 2 — Hero/Destaques         ✅ implementada + demo + fidelidade revisada
JANELA 3 — Sobre IEEE/RAS          ✅ implementada + demo + fidelidade revisada
JANELA 4 — Galeria                 ⏭ próxima
JANELA 5 — Equipe/Robôs/Prêmios    ⬜
JANELA 6 — Eventos                 ⬜
JANELA 7 — Competição atual        ⬜
JANELA 8 — Cronograma/Acompanhar   ⬜
JANELA 9 — Edições anteriores      ⬜
JANELA 10 — Footer                 ⬜
```

A implementação das janelas institucionais pode avançar visualmente mesmo antes da consolidação total do ADMIN, desde que contratos competitivos não sejam considerados definitivos antes da validação do backend/gestão.

---

# 19. Próximo passo

```text
JANELA 4 — GALERIA
```

Antes de avançar após cada demo, aplicar o mesmo princípio usado nas Janelas 1–3: **a estrutura aprovada na demo deve estar refletida no código o mais fielmente possível**.
