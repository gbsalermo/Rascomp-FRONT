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

As ETAPAS 0–3 estão concluídas/validadas. A **ETAPA 4 — Consolidação funcional e polimento do MVP** está em andamento desde 22/09/2026, atualmente no **BLOCO 1**. O CMS/Mídia pertence à ETAPA 8; Avisos IN_APP + Telegram à ETAPA 11; deploy à ETAPA 16.


## Estado de responsividade mobile

Antes da ETAPA 4, o login é a única interface que já recebeu otimização responsiva dedicada e correções específicas de breakpoint.

As demais telas de `gestao/` ainda devem ser revisadas para uso em celular/tablet.

Esse trabalho pertence ao **checkpoint transversal de Otimização Mobile do MVP**. Ele começa junto da revisão das telas existentes na ETAPA 4 e acompanha os módulos alterados/criados na PRIORIDADE 1 até ser concluído antes da ETAPA 10.

A ETAPA 14 fará apenas a validação física final em aparelhos reais.


## Checkpoint de início da ETAPA 4 — 22/09/2026

Branch de trabalho:

```text
etapa-4-consolidacao-mvp
```

Estado:

- ETAPA 4 autorizada e iniciada;
- BLOCO 1 em andamento;
- baseline técnico, autenticação, Shell e UX global são o escopo atual;
- ETAPA 5 permanece bloqueada;
- nenhuma nova funcionalidade estrutural deve ser antecipada.
