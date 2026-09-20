# RasComp Gestão

Aplicação autenticada de operação do RasComp, construída em **Vue 3 + TypeScript + Vite**.

## Responsabilidades atuais

```text
DEV
→ acesso integral ao painel autenticado
→ operação competitiva
→ administração de usuários
→ configurações de sistema

GESTAO
→ competições
→ revisão de inscrições
→ equipes/robôs/modalidades
→ Follow Line
→ Sumô
→ chaves/resultados
→ sem administração estrutural de usuários/sistema

MIDIA
→ painel autenticado próprio
→ sem acesso automático à operação competitiva
→ ferramentas editoriais permanecem reservadas às etapas de mídia

PARTICIPANTE
→ /minha-equipe
→ própria equipe/competidores/robôs
→ fotos e inscrições
→ acompanhamento competitivo
```

A matriz atual é `DEV | GESTAO | MIDIA | PARTICIPANTE`. A UI usa capacidades semânticas para navegação e proteção de rotas, enquanto a autorização oficial permanece no backend.

## Integração com backend

```text
VITE_API_URL
→ Spring Boot
→ /api/v1/auth/**
→ /api/v1/**
→ /api/v1/participante/**
→ /api/v1/public/**
```

JWT é enviado pelo cliente HTTP central. A autorização oficial pertence ao backend.

## Arquivos centrais

```text
src/main.ts
src/router.ts
src/store.ts
src/api.ts
src/types.ts
src/api/**
src/types/**
```

`api.ts` e `types.ts` funcionam como fachadas compatíveis; os domínios internos foram separados durante a ETAPA 2.

## Chaveamento

O bracket é renderizado a partir do estado retornado pela API. O frontend pode organizar e destacar a árvore visual, mas **não calcula progressão oficial**.

```text
backend avança vencedor
→ frontend faz refetch
→ UI apresenta estado atualizado
```

## Avisos futuros

Na ETAPA 11 a gestão ganhará seção de Avisos por competição. O backend persistirá o aviso IN_APP e, quando configurado, fará a entrega complementar via Telegram. A UI não chamará a Telegram Bot API diretamente.

## Verificação local dos perfis da ETAPA 3

Suba o backend com o profile local de demonstração:

```powershell
cd rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

Depois rode o `gestao/` normalmente e compare os quatro perfis:

```text
DEV            organizacao.demo@rascomp.local   / Rascomp@2026
GESTAO         gestao.demo@rascomp.local        / Rascomp@2026
MIDIA          midia.demo@rascomp.local         / Rascomp@2026
PARTICIPANTE   lider.demo@rascomp.local         / Rascomp@2026
MEMBRO          membro.demo@rascomp.local        / Rascomp@2026
```

O `lider.demo` é responsável pela equipe e vê Chronos + Titan. O `membro.demo` pertence à mesma equipe, participa somente da inscrição do Chronos e deve enxergar apenas esse robô/essa participação. O profile `testdata` é somente para ambiente local/testes e nunca deve ser habilitado em produção.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Validação:

```bash
npm run typecheck
npm run build
```

Documentação global: `../docs/README.md`.

## Roadmap atual

As ETAPAS 0–3 estão concluídas/validadas. A próxima etapa é a **ETAPA 4 — Consolidação funcional e polimento do MVP**, ainda não iniciada. O CMS/Mídia pertence à ETAPA 8; Avisos IN_APP + Telegram à ETAPA 11; deploy à ETAPA 16.


## Estado de responsividade mobile

Antes da ETAPA 4, o login é a única interface que já recebeu otimização responsiva dedicada e correções específicas de breakpoint.

As demais telas de `gestao/` ainda devem ser revisadas para uso em celular/tablet. A ETAPA 4 inclui explicitamente essa otimização: shell, navegação, cards, tabelas, filtros, formulários, diálogos, Follow, Sumô/chaves e Portal do Participante.

A ETAPA 14 fará a validação física final em aparelhos reais.
