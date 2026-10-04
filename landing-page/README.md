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

As ETAPAS 0–4 estão concluídas e a Landing entra agora na **V1-BETA A — finalização e polimento para publicação real**.

Branch da fase:

```text
v1-beta-a-landing
```

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

A parte competitiva consome a API pública do backend.

Na V1-BETA A, conteúdo demonstrativo/hardcoded será revisado **seção por seção** e substituído por imagens, textos, links e postagens reais sempre que o conteúdo já estiver disponível. O CMS/Mídia continua planejado para tornar essa gestão editorial dinâmica depois da Beta.

Referências visuais/históricas úteis:

```text
../docs/STATUS_LANDING_PAGE.md
../docs/CONTINUIDADE_LANDING_PAGE.md
```

Esses arquivos são snapshots de subsistema, não roadmap.

## CTA para inscrições

A Landing é a porta pública do sistema e deve possuir ação principal **Inscrever-se**.

```text
Landing
→ VITE_GESTAO_URL
→ Gestão/Participante
→ cadastro ou login
→ inscrição
```

O CTA deve funcionar em desktop e mobile e a URL deve permanecer configurável por ambiente.

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

Hoje a Landing pode apontar para `photo-gallery/`, mas a decisão definitiva de manter a galeria separada ou absorvê-la na experiência pública pertence à ETAPA 9.

## Conteúdo ainda não definitivo

Fotos, diretoria, projetos, premiações, agenda, contatos, parceiros e demais conteúdo editorial devem ser administráveis pelo futuro CMS em vez de depender de alterações manuais no Vue.

## Documentação global

Comece em `../docs/README.md` e consulte o roadmap canônico antes de alterar comportamento ou estrutura.

## Processo da V1-BETA A

Cada seção será revisada individualmente:

```text
visual
→ imagem real
→ texto real
→ links/CTA
→ desktop
→ mobile
→ validação
```

Objetivo final: site público real, responsivo, intuitivo e pronto para divulgação.

A Beta A não provisiona cloud definitiva; isso pertence à V1-BETA B.
