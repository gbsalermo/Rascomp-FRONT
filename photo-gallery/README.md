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

## Privacidade e visualização pública — checkpoint local (13/10)
A Galeria **não é a Biblioteca interna**: para uma foto aparecer aqui, deve estar explicitamente marcada como publicada e autorizada para exibição pública no catálogo. Os componentes do índice e dos álbuns filtram itens `published === true`; não exibem nome de arquivo, textos de legenda por foto nem metadados internos sobrepostos. O texto alternativo descritivo permanece para acessibilidade. As imagens SVG atuais são **exemplos exclusivamente para testar o layout**, não vieram da Gestão. A sincronização real exige backend e revisão de permissões.


## Teste local da Galeria com fotos da Biblioteca (13/10/2026)
A interface pública agora mostra todas as fotos autorizadas em mosaico responsivo, sem recortar retratos/paisagens e sem exibir nomes internos, com Álbuns como filtro, capa autorizada e lightbox com Esc/←/→.

**Fluxo de teste sem backend CMS:** mantenha `gestao/` em `localhost:5173` (autenticação local) e `photo-gallery/` em `localhost:5175`. Na Gestão, abra **Biblioteca**, envie uma ou várias fotos escolhendo **Públicas** ou **Privadas** independentemente dos álbuns e do uso em Heroes. Clique **Prévia da Galeria**. A nova janela exibe **somente fotos públicas**; fotos privadas não são sequer enviadas a ela. Para testar mudanças de visibilidade, volte à Gestão e clique no botão de prévia novamente. Fotos públicas sem álbum aparecem em **Todas**; fotos em álbuns também aparecem no filtro **Álbuns**, sem duplicação em Todas. O album cover escolhido só pode aparecer publicamente se também for uma das fotos publicadas.

O modo normal de acesso a `localhost:5175` ainda contém imagens SVG **meramente ilustrativas** para revisar layout; ele não representa o catálogo real. O botão da Gestão abre `?rascomp_gallery_preview=1` e substitui as ilustrações pelo conteúdo local autorizado, sem enviar uploads ao servidor. As sessões são temporárias; nada é persistido em API/MySQL/R2. O estado público efetivo deverá ser controlado no backend no checkpoint posterior.
