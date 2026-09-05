# RasComp Gestão

Aplicação autenticada de operação do RasComp, construída em **Vue 3 + TypeScript + Vite**.

## Responsabilidades atuais

```text
ORGANIZACAO
→ competições
→ revisão de inscrições
→ equipes/robôs/modalidades
→ Follow Line
→ Sumô
→ chaves/resultados
→ usuários

PARTICIPANTE
→ /minha-equipe
→ própria equipe/competidores/robôs
→ fotos e inscrições
→ acompanhamento competitivo
```

A nova matriz `DEV | GESTAO | MIDIA | PARTICIPANTE` pertence à ETAPA 3 e ainda não está implementada.

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
```

A divisão de `api.ts`/`types.ts` e decomposição de views pertence à ETAPA 2 e deve ser gradual.

## Chaveamento

O bracket é renderizado a partir do estado retornado pela API. O frontend pode organizar e destacar a árvore visual, mas **não calcula progressão oficial**.

```text
backend avança vencedor
→ frontend faz refetch
→ UI apresenta estado atualizado
```

## Avisos futuros

Na ETAPA 4 a gestão ganhará seção de Avisos por competição. O backend persistirá o aviso IN_APP e, quando configurado, fará a entrega complementar via Telegram. A UI não chamará a Telegram Bot API diretamente.

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