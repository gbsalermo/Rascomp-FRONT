# Acervo estático temporário — Landing RAS UFRB

Esta pasta é a origem manual de mídia durante a **V1-BETA A**.

Ela **não é a galeria** e não deve ser tratada como banco definitivo de conteúdo.
A `photo-gallery/` é uma experiência de exibição de álbuns; o acervo editorial da
Landing deve permanecer independente.

Estrutura:

```text
media/assets/
├─ institutional/  → equipe, identidade e imagens institucionais
├─ events/         → oficinas, extensão, RAS nas Escolas e eventos
├─ competitions/   → competições e acompanhamento competitivo
├─ awards/         → premiações e conquistas
└─ robots/         → robôs, protótipos e projetos
```

## Arquivos da Home já configurados

Basta adicionar estes arquivos mantendo exatamente os nomes abaixo:

```text
institutional/
└─ ras-ufrb-geral.jpg            → Hero principal / RAS UFRB

events/
├─ ras-nas-escolas.jpg           → Hero RAS nas Escolas
└─ oficina-ras.jpg               → Hero Oficinas

awards/
└─ conquista-ras.jpg             → Hero Conquistas
```

O painel superior de **Próximos eventos** não usa imagens. Ele consome a mesma
fonte de dados da seção Eventos em `src/content/events.ts`.

## Regras de uso na Beta A

- não importar imagens diretamente em vários componentes;
- registrar o uso da Home em `src/content/homeMedia.ts`;
- um mesmo arquivo pode alimentar Hero, notícia, Sobre ou Galeria;
- evitar cópias duplicadas da mesma imagem;
- nomes de arquivo descritivos, em minúsculas e com hífen;
- preferir JPG/WebP para fotos e PNG/SVG somente quando necessário;
- manter texto alternativo no mapa de conteúdo.

Exemplo:

```text
/media/assets/events/ras-nas-escolas-2026-01.jpg
```

## Migração futura — Gestão de Mídia

Na ETAPA 8, esta estrutura será substituída progressivamente por:

```text
MIDIA/DEV
→ Gestão
→ API CMS
→ ContentSlot
→ ContentItem
→ MediaAsset
→ storage persistente / R2
→ Landing / Galeria
```

Os arquivos físicos deixam de ser referenciados diretamente pelo frontend.
Os **slots conceituais** da Home devem ser preservados para facilitar a migração.
