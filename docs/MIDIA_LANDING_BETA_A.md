# Mídia da Landing — ponte V1-BETA A → Gestão de Mídia

Última revisão: **04/10/2026**

Este documento define como a Landing usa imagens **antes** da implementação da
ETAPA 8 — Gestor de Mídia / CMS.

## Decisão

Durante a V1-BETA A, imagens editoriais reais ficam versionadas em:

```text
landing-page/public/media/assets/
```

A Home não deve usar `photo-gallery/` como repositório de mídia.

A galeria é uma **consumidora/apresentação do acervo**, não a origem canônica
dos arquivos utilizados pela Landing.

## Estrutura manual

```text
landing-page/
├─ public/
│  └─ media/
│     └─ assets/
│        ├─ institutional/
│        ├─ events/
│        ├─ competitions/
│        ├─ awards/
│        └─ robots/
└─ src/
   └─ content/
      └─ homeMedia.ts
```

### Responsabilidades

`public/media/assets/`
: guarda os arquivos físicos temporários.

`src/content/homeMedia.ts`
: associa arquivos aos slots editoriais da Home e concentra texto alternativo.

Os componentes visuais não devem espalhar caminhos de imagens pelo código.

## Slots iniciais da Home

```text
HOME_HERO_RAS
HOME_HERO_SCHOOLS
HOME_HERO_WORKSHOPS
HOME_HERO_AWARDS

HOME_NEWS_WORKSHOP
HOME_NEWS_SCHOOLS
HOME_NEWS_ACHIEVEMENT
```

No código atual, esses slots são representados pelas chaves de `HOME_MEDIA`.

## Regra de reutilização

Um `MediaAsset` pode aparecer em vários contextos:

```text
mesma foto
├─ Hero
├─ notícia
├─ Sobre
└─ Galeria
```

Não duplicar o arquivo apenas porque ele aparece em outro bloco.

## Evolução planejada — ETAPA 8

A estrutura manual é deliberadamente compatível com o modelo já planejado:

```text
MIDIA/DEV
→ gestao
→ API CMS
→ ContentSlot
→ ContentItem
→ MediaAsset
→ storage persistente / R2
→ Landing / Galeria
```

Correspondência:

```text
arquivo em public/media/assets/  → MediaAsset
chave em homeMedia.ts            → ContentSlot
associação + conteúdo editorial  → ContentItem
```

Quando o CMS entrar:

1. preservar nomes/semântica dos slots;
2. substituir caminhos estáticos por respostas da API;
3. mover binários para storage persistente/R2;
4. manter MySQL com metadados e relações editoriais;
5. permitir publicação/despublicação e ordenação pela conta MIDIA/DEV;
6. fazer Landing e Galeria consumirem o mesmo acervo quando aplicável;
7. remover o mapa estático somente depois da migração dos slots reais.

## Relação com a Galeria

A decisão futura de absorver ou manter `photo-gallery/` separada pertence à
consolidação Landing/Galeria. Independentemente dessa decisão:

```text
MediaAsset central
├─ Hero
├─ notícias
├─ páginas institucionais
└─ Galeria
```

Logo, a Galeria não deve virar a pasta-fonte das imagens do site.

## Regra da Beta A

Até a Gestão de Mídia existir:

- novas fotos reais entram em `public/media/assets/`;
- a Home referencia os slots por `homeMedia.ts`;
- nenhuma UI de upload/admin é antecipada;
- nenhuma dependência de domínio temporário ou storage pessoal é criada.
