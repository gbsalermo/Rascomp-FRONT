# Galeria de Fotos — IEEE RAS UFRB

Frontend dedicado aos álbuns de fotos da RAS UFRB.

## Objetivo

A Landing institucional continua leve e exibe apenas capas, miniaturas e metadados dos álbuns. O conteúdo completo das fotos fica nesta aplicação.

Fluxo:

```text
Landing (5174)
  ↓ Ver álbum
Galeria (5175)
  ↓
/albuns/:slug
```

## Rodar localmente

```powershell
cd photo-gallery
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Abrir:

```text
http://localhost:5175
```

Exemplo:

```text
http://localhost:5175/albuns/rrc-2026
```

## Variável de ambiente

```env
VITE_SITE_URL=http://localhost:5174
```

Essa URL aponta de volta para a Landing institucional.

## Adicionando fotos reais

O catálogo está em:

```text
src/data/albums.ts
```

Cada álbum possui `cover` e `photos`. Nesta primeira versão eles podem ficar sem `src`, gerando placeholders visuais.

Exemplo futuro:

```ts
{
  id: 'rrc-2026-1',
  src: '/albums/rrc-2026/001.webp',
  alt: 'Robôs alinhados antes de uma partida do RRC 2026'
}
```

Arquivos podem ser organizados inicialmente em:

```text
public/
└── albums/
    └── rrc-2026/
        ├── cover.webp
        ├── 001.webp
        ├── 002.webp
        └── ...
```

## Próximas evoluções

- fotos reais e capas oficiais;
- upload pela Gestão;
- storage externo/objeto para publicação;
- compressão e geração de thumbnails;
- ordenação de fotos;
- metadados e créditos;
- download opcional;
- compartilhamento de álbum;
- SEO/Open Graph por álbum.
