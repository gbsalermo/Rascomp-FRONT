# Banners das categorias de robôs

Esta pasta alimenta exclusivamente o Hero superior da section **Nossos Robôs**.

## Estrutura recomendada

Você pode usar qualquer nome de arquivo dentro da subpasta da categoria:

```text
landing-page/src/assets/robots/banners/
├── sumo/
│   └── banner.jpg
├── mini-sumo/
│   └── foto-principal.png
├── hockey/
│   └── equipe-hockey.webp
└── follow-line/
    └── destaque.jpg
```

Também continuam aceitos arquivos diretamente em `banners/` quando o nome contém a categoria:

```text
sumo.jpg
banner-mini-sumo.jpg
hockey-principal.png
follow-line.webp
```

Formatos aceitos:

```text
.jpg
.jpeg
.png
.webp
.avif
```

Essas imagens NÃO entram na galeria de robôs.

As pastas:

```text
assets/robots/sumo/
assets/robots/mini-sumo/
assets/robots/hockey/
assets/robots/follow-line/
```

continuam destinadas às fotos individuais dos robôs, e o nome de cada arquivo vira o título mostrado na Landing.

Se uma imagem nova não aparecer imediatamente durante o desenvolvimento, reinicie o `npm run dev` para o Vite reconstruir os padrões de `import.meta.glob`.
