# Galeria de Fotos — IEEE RAS UFRB

Protótipo público separado para álbuns de fotos da RAS UFRB, construído em Vue 3 + TypeScript + Vite.

## Estado atual

A aplicação ainda utiliza catálogo estático em:

```text
src/data/albums.ts
```

Ela **não é a fonte editorial definitiva** da plataforma. O CMS/Mídia da ETAPA 8 deverá fornecer conteúdo publicável e a ETAPA 9 decidirá a arquitetura final:

```text
A. manter photo-gallery como aplicação independente
ou
B. absorver a galeria na Landing
```

Direção preferencial atual: **B**, salvo necessidade real de URL/deploy independente.

## Fluxo atual

```text
Landing (5174)
→ Ver álbum
→ Galeria (5175)
→ /albuns/:slug
```

## Variáveis

```text
VITE_SITE_URL=http://localhost:5174
VITE_API_URL=http://localhost:8080
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

Porta padrão: `http://localhost:5175`.

## Regra de evolução

Evitar ampliar o catálogo manual como solução definitiva. Upload, armazenamento, créditos, ordenação e publicação devem convergir para o modelo de mídia/CMS do RasComp.

Documentação global: `../docs/README.md`.

## Checkpoint visual — Galeria com fotos primeiro (13/10/2026)

Na branch `v1-pos-cloud-gestao-midia`, `http://localhost:5175/` inicia em **Todas as fotos**; **Álbuns** é opção de filtro que abre coleções. Categorias, lightbox com navegação, páginas de álbum e layout responsivo funcionam com ilustrações SVG locais geradas em `src/data/albums.ts` (não são fotografias reais). Para testar: `npm install && npm run dev` na pasta `photo-gallery`.

Esta aplicação independente é **somente o ambiente de prévia da interface**, sem persistência ou conexão com a Gestão. A decisão arquitetural permanece integrar a experiência na Landing em `/galeria` após validação visual, sem ativar outro deploy de produção. Não confundir os mocks com dados reais.

## Revisão visual da Galeria — segunda rodada
O mosaico de **Todas as fotos** preserva o enquadramento original das miniaturas (`object-fit: contain`), com cards e quebras responsivas refinados. A visualização de **Álbuns** continua separada por filtro. Esta prévia utiliza imagens demonstrativas próprias, e não recebe as fotografias selecionadas em `gestao/`: isso depende da API CMS que será implementada após aprovação das interfaces. Mudanças restritas à branch `v1-pos-cloud-gestao-midia`.
