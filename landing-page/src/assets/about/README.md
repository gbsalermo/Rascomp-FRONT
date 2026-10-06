# Fotos automáticas da seção Sobre

Esta pasta é **autoalimentada** durante a V1-BETA A.

Qualquer arquivo adicionado aqui com uma destas extensões entra automaticamente
no carrossel da seção Sobre:

```text
.jpg
.jpeg
.png
.webp
.avif
```

Não é necessário editar `homeMedia.ts` nem cadastrar o nome do arquivo.

## Ordenação

As imagens são ordenadas alfabeticamente pelo nome do arquivo, com tratamento
numérico. Para controlar a ordem, use prefixos:

```text
01-equipe.jpg
02-oficina.jpg
03-ras-nas-escolas.jpg
04-competicao.jpg
```

O nome do arquivo também é convertido em legenda visual. Prefixos numéricos são
ignorados na legenda.

Exemplo:

```text
03-ras-nas-escolas.jpg
→ RAS Nas Escolas
```

## Desenvolvimento / build

O Vite descobre os arquivos desta pasta via `import.meta.glob`.

- em desenvolvimento, ao adicionar uma nova imagem, atualize/recarregue a página;
- em produção, a imagem entra no próximo build/deploy;
- não usar esta pasta como storage definitivo.

Na futura Gestão de Mídia, essa descoberta local será substituída por
MediaAsset/ContentSlot/ContentItem + storage persistente/R2.
