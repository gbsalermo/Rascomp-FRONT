# Prévia da Galeria na Landing

Esta pasta alimenta o carrossel de prévia da section **Galeria**.

Adicione aqui as imagens que devem aparecer na Home:

```text
landing-page/src/assets/gallery-preview/
├── 01.jpg
├── 02.jpg
├── 03.jpg
└── ...
```

Formatos aceitos:

```text
.jpg
.jpeg
.png
.webp
.avif
```

A ordem é alfabética/numérica pelo nome do arquivo.

A Landing usa estas imagens apenas como **vitrine**. O acervo completo permanece destinado à interface separada de Galeria, acessada pelo botão **Ver galeria completa**.

Durante o desenvolvimento, novas imagens entram automaticamente via `import.meta.glob`. Se um arquivo recém-criado não aparecer imediatamente, reinicie o `npm run dev`.
