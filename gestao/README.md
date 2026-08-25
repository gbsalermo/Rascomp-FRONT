# RASCOMP Gestão

Sistema operacional da competição em **Vue 3 + TypeScript + Vite**.

## Perfis

- `ORGANIZACAO`: competições, inscrições, Follow Line e Sumô;
- `PARTICIPANTE`: acesso às próprias equipes, competidores, robôs e inscrições conforme ownership do backend.

## Integrações

- JWT via `/api/v1/auth/**`;
- API administrativa `/api/v1/**`;
- portal `/api/v1/participante/**`.

## Decisão atual

O frontend e o fluxo do MVP seguem **sem Camunda**.

As regras competitivas permanecem no backend Spring Boot. Para o Sumô, a interface usa diretamente os endpoints de inspeção, geração de chave, partidas, rounds e resultados.

## Chaveamento

O objetivo visual aprovado é um bracket em árvore como o protótipo de demonstração:

```text
Oitavas / Quartas → Semifinal → Final
```

Cada partida é renderizada a partir do estado oficial retornado pela API. O frontend pode:

- agrupar partidas por `rodada`;
- ordenar por `ordem`;
- desenhar conectores entre rodadas;
- destacar vencedor confirmado;
- mostrar BYE;
- mostrar status;
- abrir detalhes da partida;
- listar rounds e placar.

A progressão não é calculada no Vue: o backend avança o vencedor e a interface faz refetch.

## Rodar

```bash
cp .env.example .env
npm install
npm run dev
```

A interface usa o backend como fonte oficial para ranking, resultados e progressão de chave.
