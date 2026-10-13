# Mídia da Landing — ponte V1-BETA A → Gestão de Mídia

Última revisão: **06/10/2026**

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
   ├─ assets/
   │  └─ about/        → descoberta automática das fotos da seção Sobre
   └─ content/
      └─ homeMedia.ts
```

### Responsabilidades

`public/media/assets/`
: guarda os arquivos físicos temporários.

`src/content/homeMedia.ts`
: associa arquivos aos slots editoriais da Home e concentra texto alternativo.

Os componentes visuais não devem espalhar caminhos de imagens pelo código.


### Exceção autoalimentada — seção Sobre

A seção Sobre usa uma estratégia específica durante a Beta A:

```text
landing-page/src/assets/about/
→ import.meta.glob
→ InstitutionalAbout.vue
→ carrossel automático
```

Regras:

- qualquer JPG/JPEG/PNG/WebP/AVIF adicionado à pasta entra automaticamente;
- não há cadastro em `homeMedia.ts`;
- a ordem é definida pelo nome do arquivo;
- usar prefixos `01-`, `02-`, `03-` quando for necessário controlar a ordem;
- em desenvolvimento, uma nova imagem é percebida pelo Vite e aparece após atualização/reload;
- em produção, novos arquivos exigem novo build/deploy;
- esta solução é temporária e será substituída pela Gestão de Mídia.

## Slots iniciais da Home

```text
HOME_HERO_RAS
HOME_HERO_SCHOOLS
HOME_HERO_WORKSHOPS
HOME_HERO_AWARDS
```

No código atual, esses slots são representados pelas chaves de `HOME_MEDIA`.


### Últimas novidades da Home

O painel **Últimas novidades** é um feed institucional próprio e não utiliza
imagem na Beta A.

Ele pode reunir:

- campeonatos e competições;
- eventos e oficinas;
- visitas e ações do RAS nas Escolas;
- nova chapa/diretoria;
- premiações e conquistas;
- comunicados institucionais.

Fontes atuais:

```text
src/content/events.ts
└─ agenda/eventos estruturados

src/content/updates.ts
└─ feed editorial de Últimas novidades
   ├─ pode reutilizar um evento existente
   └─ pode receber novidade institucional independente
```

O feed `LANDING_UPDATES` continua disponível como fonte editorial, mas a Beta A
não o renderiza dentro do Hero. A decisão foi remover o painel para preservar a
hierarquia visual da abertura institucional.

Quando uma novidade corresponde a um evento, o feed referencia o item existente
por ID e reaproveita seus dados, evitando duplicação desnecessária.

A ordem em `LANDING_UPDATES` representa prioridade/recência editorial e não
precisa seguir a ordem cronológica da agenda.

A apresentação definitiva será decidida na revisão de Eventos/Postagens.

Na Gestão de Mídia/CMS, esse feed deve evoluir para conteúdo editorial
publicável, preservando a possibilidade de relacionar uma novidade a Evento,
MediaAsset e outros conteúdos sem obrigar que toda novidade seja um evento.

## Regra de reutilização

Um `MediaAsset` pode aparecer em vários contextos:

```text
mesma foto
├─ Hero
├─ Sobre
├─ páginas institucionais
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
6. adicionar controle global `INSTITUCIONAL | COMPETITIVO` da Landing;
7. manter esse controle separado de `Competition.vigente` e do status competitivo;
8. fazer Landing e Galeria consumirem o mesmo acervo quando aplicável;
9. remover o mapa estático somente depois da migração dos slots reais.

### Modo editorial da Landing

A ETAPA 8 deve permitir:

```text
MIDIA/DEV
→ Gestor de Mídia
→ selecionar MODO INSTITUCIONAL
→ Landing deixa de expor o bloco competitivo
→ Competition vigente continua intacta

MIDIA/DEV
→ selecionar MODO COMPETITIVO
→ Landing volta a usar a Competition vigente publicável
```

Esse comando serve para revisão editorial, manutenção ou correção temporária de informação pública sem obrigar o DEV a retirar a competição vigente.

Importante: mudar para `INSTITUCIONAL` **não pausa inscrições nem a operação interna**. A interface do Gestor de Mídia deve informar isso explicitamente antes da alteração.

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

- novas fotos com slots fixos entram em `public/media/assets/`;
- o carrossel da seção Sobre recebe fotos automaticamente de `src/assets/about/`;
- a Home referencia os demais slots fixos por `homeMedia.ts`;
- nenhuma UI de upload/admin é antecipada;
- nenhuma dependência de domínio temporário ou storage pessoal é criada.
