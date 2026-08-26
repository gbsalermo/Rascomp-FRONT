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

## Storage definido

Decisão atual:

```text
Cloudflare R2
→ API compatível com S3
→ backend Spring Boot controla credenciais e object keys
→ MySQL guardará apenas metadados dos álbuns/fotos
→ Landing e Photo Gallery nunca recebem Access Key/Secret Key
```

O backend já possui a infraestrutura R2 opt-in:

```text
R2StorageProperties
R2StorageConfiguration
ObjectStorageService
R2ObjectStorageService
```

O R2 permanece `R2_ENABLED=false` por padrão. Portanto essa preparação não altera o armazenamento local das fotos de robô nem qualquer outro fluxo atual.

A integração dispõe de upload pelo backend e geração de URL pré-assinada para a futura tela administrativa.

Documentação de configuração no backend:

```text
Rascomp/rascomp/docs/CLOUDFLARE_R2.md
```

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

## Catálogo temporário

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

Esse catálogo permanece como fallback/demonstração até a API real de álbuns ser criada.

## Primeiro teste com imagens reais

A próxima validação será feita já pensando no R2:

```text
Cloudflare R2
→ criar bucket ras-ufrb-media
→ configurar credenciais apenas no backend
→ enviar pequeno álbum de teste
→ obter URLs públicas
→ validar Photo Gallery
→ validar prévias na Landing
```

Até esse teste, os placeholders atuais permanecem funcionando normalmente.

## Próxima etapa de desenvolvimento

```text
Gestão
→ criar/editar álbum
→ backend gera object key
→ backend gera URL pré-assinada
→ navegador envia imagem ao R2
→ backend salva metadados no MySQL
→ API pública publica metadados
→ Landing consome capas/previews
→ Photo Gallery consome álbum completo
```

Implementar nessa etapa:

- entidades `Album` e `Photo`;
- migration do banco;
- DTOs e repositories;
- endpoints administrativos;
- endpoints públicos;
- limite e formatos;
- compressão/WebP;
- thumbnails;
- ordenação;
- exclusão segura;
- capa do álbum;
- créditos/legendas;
- política de privacidade e direito de imagem.

## Regra de segurança

Nunca versionar ou expor no frontend:

```text
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

O frontend recebe somente URLs de leitura ou URLs pré-assinadas temporárias.
