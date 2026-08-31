# Continuidade — Galeria de Fotos RAS UFRB

Última revisão: **31/08/2026**

Este arquivo registra o estado específico de `photo-gallery/` e as decisões técnicas de mídia já tomadas.

Ele **não define a próxima etapa global**.

Roadmap canônico:

```text
docs/ETAPAS_POS_PROJETO.md
```

Estado global atual:

```text
ETAPA 0  ✅ concluída / validada
ETAPA 1  🚧 atual
ETAPA 2+ ⏳ não iniciadas
```

Portanto, não iniciar agora o backend de álbuns/CMS apenas porque ele aparece neste documento como evolução futura.

---

# 1. Estado arquitetural atual

Existem hoje três aplicações frontend:

```text
gestao/        → localhost:5173
landing-page/  → localhost:5174
photo-gallery/ → localhost:5175
```

No estado implementado:

- a Janela 5 da Landing funciona como vitrine leve;
- `photo-gallery/` é uma aplicação pública separada;
- o catálogo ainda é estático/demonstrativo.

## Importante: isso não é mais uma decisão definitiva de arquitetura futura

A ETAPA 11 deverá fechar entre:

```text
A. manter photo-gallery como app separado, alimentado pela API
ou
B. absorver a experiência de galeria na landing-page
```

Direção preferencial atual: **B — absorver na Landing**, salvo necessidade real de deploy/URL independente.

Logo, outra IA não deve assumir que a terceira aplicação precisa existir para sempre só porque ela existe hoje.

---

# 2. Storage decidido

A estratégia de mídia futura já possui uma decisão técnica válida:

```text
Cloudflare R2
→ backend Spring Boot controla credenciais/object keys
→ MySQL guarda metadados
→ frontend nunca recebe Access Key/Secret Key
```

Infraestrutura já existente no backend:

```text
R2StorageProperties
R2StorageConfiguration
ObjectStorageService
R2ObjectStorageService
```

Configuração permanece opt-in:

```text
R2_ENABLED=false
```

Isso não altera o armazenamento local atual das fotos dos robôs.

Documentação:

```text
gbsalermo/Rascomp
rascomp/docs/CLOUDFLARE_R2.md
```

Regra: o futuro CMS deve **reaproveitar `ObjectStorageService`/R2** e não criar um terceiro mecanismo de upload.

---

# 3. Estado atual da Landing

A Landing:

- exibe cards/preview de galeria;
- possui janela institucional de galeria;
- pode apontar para a aplicação separada via configuração;
- ainda depende de placeholders/dados demonstrativos em partes do conteúdo.

A consolidação com conteúdo real pertence às ETAPAS 7 e 11, não à ETAPA 1 atual.

---

# 4. Estado atual de `photo-gallery/`

Implementado:

- Vue 3 + Vite + TypeScript;
- Vue Router;
- porta local 5175;
- página geral de álbuns;
- filtros por categoria;
- rota `/albuns/:slug`;
- página de álbum;
- grade responsiva;
- lightbox anterior/próxima;
- placeholders;
- retorno ao site institucional;
- CI dedicado com typecheck + build.

Catálogo temporário:

```text
photo-gallery/src/data/albums.ts
```

Modelo demonstrativo:

```text
Album
├─ slug
├─ title
├─ category
├─ description
├─ date
├─ count
├─ cover
└─ photos[]
   ├─ id
   ├─ src
   └─ alt
```

Esse arquivo não deve se tornar a fonte definitiva de conteúdo.

---

# 5. Evolução futura de mídia

A implementação real pertence principalmente à **ETAPA 7 — CMS/Mídia**.

Modelo de referência canônico:

```text
MediaAsset
ContentSlot
ContentItem
```

Para álbuns, a implementação pode adicionar entidades/conceitos específicos se houver necessidade real de domínio, mas não deve duplicar o CMS sem necessidade.

Fluxo esperado em alto nível:

```text
MIDIA/DEV
→ gestao
→ backend
→ R2 para arquivo
→ MySQL para metadados
→ API pública
→ Landing / galeria
```

Requisitos a considerar na etapa apropriada:

- formatos e limites;
- thumbnails/otimização;
- WebP quando aplicável;
- ordenação;
- capa;
- créditos/legendas;
- exclusão/arquivamento seguro;
- privacidade/direito de imagem;
- URLs de leitura ou pré-assinadas;
- responsividade/performance.

---

# 6. Segurança

Nunca versionar ou expor no frontend:

```text
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

O navegador recebe somente dados públicos e/ou URLs temporárias necessárias para a operação autorizada.

---

# 7. Como outra IA deve usar este documento

Use para entender:

```text
como a galeria funciona hoje
por que existe photo-gallery/
como o R2 foi preparado
quais requisitos de mídia já foram levantados
```

Não use para decidir:

```text
qual é a etapa atual
quando implementar o CMS
se photo-gallery deve permanecer separado definitivamente
```

Para essas decisões:

```text
etapa/ordem → docs/ETAPAS_POS_PROJETO.md
arquitetura cross-repo → docs/DOSSIE_PROJETO_RASCOMP.md
índice → docs/README.md
```
