# Site Público — IEEE RAS UFRB

Aplicação pública institucional e competitiva da **RAS UFRB**, construída em **Vue 3 + TypeScript + Vite**.

## Nomenclatura

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento/competição de robótica
RasComp  = plataforma de software
```

A Landing não deve apresentar o evento RRC como se ele se chamasse RasComp.

## Estado atual

A Home possui estrutura institucional com:

```text
Header
Hero / destaques
Sobre IEEE + RAS UFRB
Equipe / diretoria / robôs / premiações
Galeria
Eventos
Competição ativa / acompanhamento
Footer
404 pública
```

A parte competitiva consome a API pública do backend. Conteúdo institucional ainda hardcoded/placeholder será substituído pelo CMS/Mídia da ETAPA 7.

Referências visuais/históricas úteis:

```text
../docs/STATUS_LANDING_PAGE.md
../docs/CONTINUIDADE_LANDING_PAGE.md
```

Esses arquivos são snapshots de subsistema, não roadmap.

## Fluxo de dados

```text
Backend Spring Boot
→ /api/v1/public/**
→ Landing pública
```

A Landing não calcula oficialmente ranking, vencedor, chaveamento ou progressão.

## Variáveis principais

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_GALERIA_URL=http://localhost:5175
VITE_REFRESH_MS=20000
```

## Rodar localmente

```powershell
cd landing-page
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Porta padrão: `http://localhost:5174`.

## Galeria

Hoje a Landing pode apontar para `photo-gallery/`, mas a decisão definitiva de manter a galeria separada ou absorvê-la na experiência pública pertence à ETAPA 11.

## Conteúdo ainda não definitivo

Fotos, diretoria, projetos, premiações, agenda, contatos, parceiros e demais conteúdo editorial devem ser administráveis pelo futuro CMS em vez de depender de alterações manuais no Vue.

## Documentação global

Comece em `../docs/README.md` e consulte o roadmap canônico antes de alterar comportamento ou estrutura.