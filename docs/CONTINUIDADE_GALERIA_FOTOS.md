# Continuidade — Galeria de Fotos RAS UFRB

## Decisão arquitetural

A Janela 5 da Landing institucional permanece como vitrine leve dos álbuns. O álbum completo passa a ser aberto em um terceiro frontend dedicado:

```text
gestao/        → localhost:5173
landing-page/  → localhost:5174
photo-gallery/ → localhost:5175
```

A experiência pública pode futuramente ser publicada no mesmo domínio, por exemplo:

```text
rasufrb.com.br
rasufrb.com.br/fotos
rasufrb.com.br/fotos/albuns/rrc-2026
```

Mesmo que a implementação continue separada internamente.

## Estado atual

### Landing

- cards de álbum continuam exibidos na Home;
- clique na capa mantém uma prévia rápida;
- `Ver álbum` abre o site dedicado;
- URL externa configurável por `VITE_GALERIA_URL`;
- fallback local: `http://localhost:5175`.

### Photo Gallery

Implementado:

- Vue 3 + Vite + TypeScript;
- Vue Router;
- porta local 5175;
- página geral de álbuns;
- filtros por categoria;
- rota `/albuns/:slug`;
- página de álbum;
- grade responsiva;
- lightbox com anterior/próxima;
- placeholders prontos para serem trocados por imagens reais;
- botão para voltar ao site institucional;
- CI dedicado com typecheck + build.

## Catálogo

Arquivo central:

```text
photo-gallery/src/data/albums.ts
```

Modelo atual:

```text
Album
├── slug
├── title
├── category
├── description
├── date
├── count
├── cover
└── photos[]
    ├── id
    ├── src
    └── alt
```

## Próximo teste

Adicionar um álbum com imagens reais em:

```text
photo-gallery/public/albums/<slug>/
```

Depois preencher `cover` e `photos[].src` no catálogo e validar:

```text
Landing
→ Ver álbum
→ Photo Gallery
→ abrir foto
→ navegar no lightbox
→ voltar ao álbum
→ voltar à Landing
```

## Evolução posterior

A etapa seguinte não deve colocar upload direto no frontend sem backend/storage. O caminho recomendado é:

```text
Gestão
→ criar/editar álbum
→ upload de imagens
→ backend valida
→ storage salva originais/thumbnails
→ API pública publica metadados
→ Landing consome capas
→ Photo Gallery consome álbum completo
```

Antes dessa fase definir:

- storage de imagens;
- limite e formatos;
- compressão;
- thumbnails;
- ordenação;
- exclusão segura;
- capa do álbum;
- créditos/legendas;
- política de privacidade e direito de imagem.
