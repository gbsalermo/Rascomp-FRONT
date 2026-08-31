# Continuidade — Landing Page / Site Público RAS UFRB

Última revisão: **31/08/2026**

Este documento é um **checkpoint específico da aplicação `landing-page/`**. Ele preserva decisões visuais/funcionais da Landing, mas não define a etapa global do RasComp.

Roadmap canônico:

```text
docs/ETAPAS_POS_PROJETO.md
```

Estado global:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual
ETAPA 2+ ⏳ não iniciadas
```

A maior parte da Landing abaixo foi consolidada para a demonstração de **26/08/2026**. Depois disso, a página 404 pública foi adicionada em **30/08/2026**.

---

# 1. Identidade — decisão preservada

```text
RAS UFRB = site/identidade institucional
RRC      = evento/competição
RasComp  = software/plataforma de gestão
```

A Home representa a **IEEE RAS UFRB**. O RRC recebe destaque quando há contexto competitivo; RasComp é a plataforma que fornece os dados.

Camunda não faz parte do projeto.

---

# 2. Direção visual congelada

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

- fundo branco dominante;
- rubro para títulos, competição, alertas e CTA principal;
- roxo para estrutura, hover, sublinhados e CTA secundário;
- visual institucional, leve e tecnológico;
- evitar estética cyberpunk/dashboard pesado;
- Footer: bloco principal rubro + faixa final roxo profundo;
- conteúdo real substituirá placeholders via CMS.

Referência visual histórica: ERBASE como inspiração de ritmo/arquitetura, sem copiar código, textos ou assets.

---

# 3. Ordem aprovada da Home

```text
1. Header
2. Hero / Painel de Destaques
3. Sobre IEEE + RAS UFRB
4. Equipe / Diretoria / Robôs / Premiações
5. Galeria
6. Eventos da RAS
7. Competição atual + acompanhamento [CONDICIONAL]
8. Footer institucional
```

`Edições anteriores` não faz parte da Home.

A janela competitiva só aparece quando:

```text
competition.status === 'EM_ANDAMENTO'
```

Sem competição ativa:

```text
Eventos → Footer
```

---

# 4. Janelas implementadas

```text
Janela 1 — Header                           ✅
Janela 2 — Hero / Destaques                ✅
Janela 3 — Sobre IEEE + RAS                ✅
Janela 4 — Equipe/Diretoria/Robôs/Prêmios  ✅
Janela 5 — Galeria                         ✅
Janela 6 — Eventos                         ✅
Janela 7 — Competição/Acompanhamento       ✅
Janela 8 — Footer                          ✅
404 pública                                ✅ 30/08/2026
```

Componentes principais:

```text
InstitutionalHeader.vue
HighlightsHero.vue
InstitutionalAbout.vue
TeamRobotsAwards.vue
InstitutionalGallery.vue
InstitutionalEvents.vue
ActiveCompetition.vue
InstitutionalFooter.vue
PublicNotFound.vue
```

---

# 5. Competição pública

Fluxo:

```text
Gestão
→ Backend Spring Boot
→ /api/v1/public/**
→ Landing
```

A Home competitiva consome endpoints públicos para:

```text
competições
categorias
inscrições aprovadas
ranking Follow
chaves
partidas
resultados
```

Regras importantes:

- Follow usa `tempoFinalSegundos` oficial do backend;
- Sumô somente representa estado do backend;
- Landing não gera chave;
- Landing não avança vencedor;
- contadores competitivos devem usar dados públicos oficiais;
- backend permanece fonte de verdade.

Refresh configurável:

```text
VITE_REFRESH_MS=20000
```

---

# 6. Execução local

Portas padrão:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

Variáveis:

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

Scripts:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

`vite.config.ts` utiliza `node:url`, portanto o projeto possui tipagem Node configurada para evitar erro `TS2307`.

---

# 7. Página 404

Implementada em 30/08/2026.

Arquivos principais:

```text
landing-page/src/components/PublicNotFound.vue
landing-page/src/not-found.css
landing-page/src/App.vue
```

A aplicação detecta pathname público desconhecido e renderiza a experiência 404 em vez de inicializar o conteúdo normal da Home.

Essa entrega não representa avanço do roadmap pós-projeto.

---

# 8. Conteúdo ainda provisório

A estrutura visual está aprovada, mas parte de conteúdo institucional continua demonstrativo/hardcoded, como:

- fotografias;
- integrantes/diretoria;
- parte de robôs/projetos;
- premiações;
- números institucionais;
- agenda/eventos;
- parceiros;
- textos/notícias;
- alguns links/contatos.

Não continuar resolvendo isso com crescimento indefinido de hardcode Vue.

A solução planejada é a **ETAPA 7 — CMS/Mídia**:

```text
MIDIA/DEV
→ gestao
→ API CMS
→ MediaAsset / ContentSlot / ContentItem
→ Landing
```

---

# 9. Galeria

A Janela 5 da Landing existe e `photo-gallery/` também existe como app separado.

Essa separação é o estado implementado, não uma obrigação arquitetural permanente.

Na ETAPA 11 decidir:

```text
A. manter photo-gallery separado
B. absorver na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de deploy/URL independente.

Consultar:

```text
docs/CONTINUIDADE_GALERIA_FOTOS.md
```

---

# 10. Pendências futuras da Landing

Não são tarefas da ETAPA 1 atual. Devem ser tratadas nas etapas apropriadas:

## ETAPA 7 — CMS/Mídia

- conteúdo real;
- fotos/logos oficiais;
- publicação editorial;
- R2;
- remoção de hardcodes editoriais.

## ETAPA 8 — Regras

- área pública com regras oficiais validadas.

## ETAPA 9/10

- exibição pública/participante de Futebol conforme domínio implementado.

## ETAPA 11 — consolidação pública

- decidir galeria;
- remover placeholders remanescentes;
- tipar contratos públicos;
- acessibilidade;
- responsividade;
- performance.

## ETAPA 12–14

- hardening;
- testes manuais;
- deploy cloud.

---

# 11. Snapshot detalhado da demonstração

Para detalhes janela a janela do estado consolidado em 26/08/2026:

```text
docs/STATUS_LANDING_PAGE.md
```

Esse arquivo deve ser tratado como snapshot histórico útil, não como planejamento global.

---

# 12. Como outra IA deve usar este arquivo

Use para:

```text
entender identidade e direção visual da Landing
entender a ordem das janelas
entender integração pública
localizar componentes centrais
saber quais conteúdos ainda são provisórios
```

Não use para:

```text
decidir qual etapa executar
iniciar CMS antecipadamente
iniciar deploy
assumir que photo-gallery continuará separado para sempre
```

Para etapa/ordem:

```text
docs/ETAPAS_POS_PROJETO.md
```

Para arquitetura cross-repo:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

Para índice completo:

```text
docs/README.md
```
