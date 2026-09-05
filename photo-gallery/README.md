# Galeria de Fotos — IEEE RAS UFRB

Protótipo público separado para álbuns de fotos da RAS UFRB, construído em Vue 3 + TypeScript + Vite.

## Estado atual

A aplicação ainda utiliza catálogo estático em:

```text
src/data/albums.ts
```

Ela **não é a fonte editorial definitiva** da plataforma. O CMS/Mídia da ETAPA 7 deverá fornecer conteúdo publicável e a ETAPA 11 decidirá a arquitetura final:

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