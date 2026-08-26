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

O usuário pode revisar visualmente depois no PC; enquanto estiver longe, demos servem como referência de direção.

---

# 4. Arquitetura atual da Home

```text
HEADER                                      ✅ implementado
│
├── HERO / PAINEL DE DESTAQUES              ✅ implementação inicial
│
├── SOBRE IEEE + RAS                        ⏭ próxima janela
│
├── GALERIA                                 planejado
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

Componente:

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

Quando existir competição `EM_ANDAMENTO`, mostrar faixa fina acima do header:

```text
RRC em andamento · <edição>                Acompanhar competição →
```

Objetivo: permitir salto direto para competição sem transformar o site institucional em site do RRC.

## Responsividade

- header sticky;
- desktop horizontal;
- mobile com hambúrguer;
- dropdown adaptado no menu mobile;
- CTA entra no menu no mobile.

## Logo

O layout atual usa marca textual temporária. Substituir pelo asset oficial IEEE RAS/UFRB quando o arquivo definitivo for fornecido.

---

# 6. JANELA 2 — HERO / PAINEL DE DESTAQUES ✅ IMPLEMENTAÇÃO INICIAL

Componente:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

O Hero **não é um banner fixo do RRC**.
Ele funciona como uma capa editorial dinâmica da RAS UFRB, inspirado na lógica de slider já usada em outra landing do usuário.

## Objetivo

Responder rapidamente:

```text
O que a RAS UFRB está fazendo agora?
```

## Slides iniciais

Conteúdo editorial temporário preparado para:

1. apresentação institucional da RAS UFRB;
2. competição atual, somente quando aplicável;
3. RAS nas Escolas;
4. oficinas/formação.

Futuramente podem entrar:

- participação em eventos externos;
- premiações;
- projetos atuais;
- novas oficinas;
- chamadas institucionais;
- notícia relevante.

## Estrutura de cada slide

```text
categoria/editoria
Título
Resumo curto
[ CTA principal ] [ CTA secundário opcional ]

imagem/foto à direita
```

As imagens atuais são placeholders neutros e devem ser substituídas por acervo oficial posteriormente.

## Comportamento

- avanço automático aproximadamente a cada 7 segundos;
- botões anterior/próximo;
- índice `01 / 04`;
- cartões inferiores permitem selecionar diretamente outro destaque;
- responsivo;
- em telas pequenas reduz a quantidade de previews para não sobrecarregar.

## Slide competitivo condicional

Só entra no Hero quando a competição pública estiver em:

```text
EM_ANDAMENTO
INSCRICOES_ABERTAS
INSCRICOES_ENCERRADAS
```

Quando `EM_ANDAMENTO`:

```text
[ Acompanhar competição ]
```

Quando `INSCRICOES_ABERTAS`, também pode mostrar:

```text
[ Fazer inscrição ]
```

Nunca tornar o RRC o slide institucional permanente quando não houver motivo atual.

## Linha curta de novidades

A antiga ideia de uma seção grande de notícias foi descartada.
O Hero possui uma linha discreta de novidades/agenda, deixando o conteúdo editorial concentrado no painel inicial.

## Visual

- fundo predominantemente branco;
- roxo e rubro em detalhes;
- grande área de texto + mídia;
- sem fundo escuro pesado;
- aspecto de portal institucional/editorial, não card esportivo;
- bordas e sombras discretas.

---

# 7. JANELA 3 — SOBRE IEEE + RAS ⏭ PRÓXIMA

Conceito aprovado:

```text
[ slider quadrado de fotos ]      [ IEEE ] [ RAS UFRB ]
                                  texto alternável
```

## Mídia à esquerda

Slider quadrado pode mostrar:

- equipe;
- premiações;
- eventos;
- projetos;
- oficinas;
- ações em escolas.

## Conteúdo à direita

Dois títulos/abas:

```text
IEEE
RAS UFRB
```

Ao clicar, troca apenas o conteúdo textual, sem navegar para outra página.

Objetivo:

- explicar primeiro o ecossistema IEEE;
- explicar o que é o capítulo RAS UFRB;
- deixar claro papel, propósito, formação, tecnologia e extensão.

---

# 8. JANELA 4 — GALERIA

A galeria entra cedo, após o Sobre ou imediatamente depois da apresentação institucional.

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

---

# 9. JANELA 5 — EQUIPE / DIRETORIA / ROBÔS / PREMIAÇÕES

Substitui uma faixa simples de números.

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

Seguir a lógica de footer institucional observada na ERBASE, sem copiar código/visual.

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
- [ ] prefers-reduced-motion;
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
JANELA 1 — Header                  ✅ implementada + demo
JANELA 2 — Hero/Destaques         ✅ implementação inicial + demo pendente nesta etapa
JANELA 3 — Sobre IEEE/RAS          ⏭ próxima
JANELA 4 — Galeria                 ⬜
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

Após aprovar a demo da Janela 2:

```text
JANELA 3 — SOBRE IEEE + RAS UFRB
```
