# Continuidade — Landing Page / Site Público RAS UFRB

> Documento principal para continuar o desenvolvimento da aplicação pública em `landing-page/`.
> Estado sincronizado após a revisão para demonstração de 26/08/2026.

---

## 1. Identidade — não alterar

```text
RAS UFRB = site/identidade institucional
RRC      = evento/competição
RASCOMP  = software/plataforma de gestão
```

A Home é da **IEEE RAS UFRB**. O RRC aparece com força apenas quando houver contexto competitivo. RasComp é citado como plataforma/fonte dos dados competitivos, não como nome do evento.

Camunda não faz parte do projeto.

---

## 2. Direção visual congelada

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

Regras:

- fundo branco dominante nas janelas de conteúdo;
- rubro para títulos, competição, alertas e CTA principal;
- roxo para estrutura, hover, sublinhados e CTA secundário;
- visual institucional, leve e tecnológico;
- evitar cyberpunk/dashboard pesado;
- fotografias reais entram depois;
- Footer é exceção: **bloco principal rubro + faixa final roxo profundo**.

Referência de ritmo/arquitetura: ERBASE, sem copiar código, textos ou assets.

---

## 3. Método de desenvolvimento

A Home foi construída janela por janela.

Regra mantida:

```text
Demo aprovada
      ↓
Implementação o mais fiel possível
      ↓
Validação integrada no navegador
      ↓
Conteúdo/assets definitivos
```

A fase de criação isolada das janelas está encerrada. A fase atual é **REVISÃO INTEGRADA**.

---

## 4. Ordem final da Home

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

`Edições anteriores` foi removido da Home.

---

# 5. Janelas concluídas

## Janela 1 — Header ✅

Arquivos:

```text
landing-page/src/components/InstitutionalHeader.vue
landing-page/src/header.css
landing-page/src/header-identity.css
```

Implementado:

- identidade IEEE RAS UFRB;
- Início;
- Sobre;
- Competição com dropdown;
- Calendário;
- Eventos;
- Contato;
- Inscrições quando abertas;
- aviso rubro de competição em andamento;
- mobile.

Correção final: o bloco textual `RAS` foi substituído pelo asset IEEE RAS já existente no projeto.

## Janela 2 — Hero / Destaques ✅

Arquivos:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/highlights-hero.css
```

Estrutura:

```text
[ slide visual principal ] [ últimas novidades ]
[ preview ] [ preview ] [ preview ] [ preview ]
```

Inclui autoplay, setas, dots e competição quando aplicável.

## Janela 3 — Sobre IEEE + RAS ✅

Arquivos:

```text
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/about.css
```

Estrutura:

```text
[ galeria/collage ] [ IEEE | RAS UFRB ]
[ indicadores ]
```

## Janela 4 — Equipe / Diretoria / Robôs / Premiações ✅

Arquivos:

```text
landing-page/src/components/TeamRobotsAwards.vue
landing-page/src/team-robots-awards.css
```

Demo 1 aprovada:

- Equipe em lista;
- Diretoria em mosaico;
- Robôs em cards;
- Premiações;
- indicadores.

## Janela 5 — Galeria ✅

Arquivos:

```text
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/gallery.css
```

Álbuns por categoria com preview flutuante.

## Janela 6 — Eventos ✅

Arquivos:

```text
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/events.css
```

Estrutura final:

```text
[ filtros ]
[ próximos eventos ] [ agenda ]
[ eventos anteriores ] [ fique por dentro ]
[ indicadores ]
```

Correção de revisão: o evento Arduino foi reposicionado para data futura no conteúdo demonstrativo.

## Janela 7 — Competição atual + acompanhamento ✅

Arquivos:

```text
landing-page/src/components/ActiveCompetition.vue
landing-page/src/active-competition.css
```

Regra crítica:

```text
competition.status === 'EM_ANDAMENTO'
```

Se não houver competição ativa, esta janela não renderiza e não deixa espaço vazio.

Estrutura aprovada:

```text
COMPETIÇÃO ATUAL

[ PANORAMA GERAL ] [ FOLLOW LINE ] [ SUMÔ ]

PRÓXIMOS DESTAQUES
[ próxima partida ] [ último resultado ] [ ranking Follow ]
```

Follow Line usa `tempoFinalSegundos` oficial.

Sumô apenas representa dados do backend; não gera chave nem avança vencedor.

Correções finais:

- inscrições do panorama = inscrições aprovadas;
- `#chaveamento` existe no card de Sumô mesmo antes da expansão;
- Header consegue navegar até a área correta.

## Janela 8 — Footer ✅

Arquivos:

```text
landing-page/src/components/InstitutionalFooter.vue
landing-page/src/footer.css
landing-page/src/footer-ruby.css
```

Versão final aprovada:

```text
BLOCO PRINCIPAL RUBRO
IEEE RAS UFRB | Navegação | Links úteis | Apoio/Parceiros | Fale conosco

FAIXA ROXO PROFUNDO
identidade | missão | copyright | ♥ | privacidade | termos | ↑
```

O fundo branco da versão anterior foi rejeitado.

A implementação atual preserva a base responsiva de `footer.css` e aplica o tema final em `footer-ruby.css`.

---

## 6. Integração pública

Fluxo:

```text
Gestão → Backend Spring Boot → /api/v1/public/** → Landing
```

Endpoints usados pela Home competitiva:

```http
GET /api/v1/public/competicoes
GET /api/v1/public/categorias
GET /api/v1/public/inscricoes?competitionId=
GET /api/v1/public/ranking/seguidor-linha?competitionId=&categoryId=
GET /api/v1/public/chaveamentos?competitionId=
GET /api/v1/public/partidas?bracketId=
GET /api/v1/public/resultados?bracketId=
```

O `App.vue` não depende mais de `/equipes` e `/robos` no bootstrap porque esses dados não eram usados na Home e aumentavam o risco de falha desnecessária.

Refresh competitivo:

```text
VITE_REFRESH_MS=20000
```

---

## 7. Correção TypeScript preventiva

`vite.config.ts` usa `node:url`.

Para evitar `TS2307`, foi adicionado:

```json
"@types/node": "^24.3.0"
```

E:

```json
"types": ["vite/client", "node"]
```

Depois de puxar a `main`, é obrigatório executar `npm install` novamente.

---

## 8. Cenário de demonstração

O backend possui profile:

```text
SPRING_PROFILES_ACTIVE=testdata
```

Ele habilita um cenário idempotente com:

- competição ao vivo;
- Follow Line;
- Sumô;
- BYEs;
- resultados;
- histórico;
- usuários demonstrativos.

Subir no PowerShell:

```powershell
cd Rascomp\rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\run-local.ps1
```

Credenciais:

```text
PARTICIPANTE
lider.demo@rascomp.local
Rascomp@2026

ORGANIZAÇÃO
organizacao.demo@rascomp.local
Rascomp@2026
```

---

## 9. Pendências

### Antes da demonstração

```text
[ ] git pull origin main
[ ] npm install em landing-page/
[ ] npm run typecheck
[ ] npm run build
[ ] backend com profile testdata
[ ] npm run dev
[ ] conferir desktop no navegador
[ ] confirmar Janela 7
[ ] confirmar Footer rubro
```

### Antes da publicação oficial

- fotos oficiais;
- integrantes reais;
- diretoria real;
- robôs/projetos reais;
- premiações reais;
- números institucionais;
- agenda oficial;
- contatos e redes;
- parceiros oficiais;
- newsletter real ou remoção;
- Privacidade e Termos;
- asset IEEE RAS copiado para `landing-page/public/`;
- mobile/tablet;
- acessibilidade;
- SEO/Open Graph/favicon/sitemap;
- lazy loading/performance;
- página 404 pública.

### Limpeza pós-demo

- remover CSS legado de `styles.css` sem uso;
- consolidar `header-identity.css` e `footer-ruby.css` nos CSS principais;
- substituir `any` por tipos públicos;
- decidir fonte/CMS para conteúdo editorial.

---

## 10. Estado atual

```text
JANELA 1 — Header                           ✅
JANELA 2 — Hero/Destaques                  ✅
JANELA 3 — Sobre IEEE/RAS                   ✅
JANELA 4 — Equipe/Diretoria/Robôs/Prêmios  ✅
JANELA 5 — Galeria                          ✅
JANELA 6 — Eventos                          ✅
JANELA 7 — Competição/Acompanhamento        ✅
JANELA 8 — Footer rubro                     ✅

Revisão estrutural para demo               ✅
Typecheck local após últimas alterações     ⬜
Build local após últimas alterações         ⬜
Validação visual integrada no navegador     ⬜
Conteúdo institucional definitivo           ⬜
```

---

## 11. Próxima ação

Não criar novas janelas agora.

Sequência:

```text
VALIDAR LOCALMENTE
      ↓
CORRIGIR EVENTUAIS ERROS
      ↓
AJUSTES VISUAIS FINOS
      ↓
SUBSTITUIR PLACEHOLDERS
      ↓
PUBLICAÇÃO
```

Documentos auxiliares:

```text
docs/STATUS_LANDING_PAGE.md
landing-page/README.md
```
