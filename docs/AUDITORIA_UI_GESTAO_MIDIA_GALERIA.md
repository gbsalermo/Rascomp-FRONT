# Auditoria pré-implementação — Gestão de Mídia e Galeria (13/10/2026)

**Tipo:** leitura de código e documentação; **sem alteração de funcionalidades.** **Branch:** `v1-pos-cloud-gestao-midia`. **Próximo gate:** aprovação visual dos esboços antes de desenvolver interfaces.

## Verificação objetiva
| Área | Evidência no código | Estado / decisão |
|---|---|---|
| Administração MIDIA | `gestao/src/store.ts`, `gestao/src/views/ShellLayout.vue` | `canManageMedia` já permite DEV/MIDIA; navegação de MIDIA hoje tem somente "Painel" e `DashboardView` exibe placeholder "Perfil de mídia ativo". |
| Rotas da Gestão | `gestao/src/router.ts` | Ausência de rota administrativa própria de mídia; criar rota(s) com `meta.capability='manageMedia'`; DEV também deve acessar o módulo na sidebar, sem herdar toda a operação competitiva para MIDIA. |
| Galeria existente | `photo-gallery/src/router.ts`, `views/GalleryHomeView.vue`, `views/AlbumView.vue` | App Vue independente na porta local 5175, índice/álbum, categorias e lightbox com anterior/próxima; CSS responsivo em `photo-gallery/src/styles.css`. Reutilizar experiência, não recomeçar do zero. |
| Catálogo da galeria | `photo-gallery/src/data/albums.ts` | Cinco álbuns demonstrativos com `count` editorial (48/32/27/41/36), 12 placeholders por álbum, sem fotos reais; números não representam acervo real. Não expor como métricas reais. |
| Entrada pública da Galeria | `landing-page/src/components/InstitutionalGallery.vue`, `landing-page/.env.cloud` | Prévia é `import.meta.glob` em `assets/gallery-preview`. Link “Ver galeria completa” depende de `VITE_GALERIA_URL`; no cloud está vazio, CTA desabilitado. |
| Arquitetura pública | `photo-gallery/README.md`, `docs/ETAPAS_POS_PROJETO.md` | Preferência documentada: absorver experiência da galeria na Landing, evitando terceiro frontend/deploy. A Landing `src/App.vue` atualmente trata URLs fora de / como 404, portanto integração por rota exige adequação explícita, não simples cópia de componente. |
| Imagens Intro | `landing-page/src/content/homeMedia.ts`, `components/HighlightsHero.vue` | Quatro slots institucionais estáticos (ras/schools/workshops/awards), legenda/texto mantidos no código. Adicionar Hero competitivo como item opcional/editorial, sem editor irrestrito. |
| Outras mídias | `TeamRobotsAwards.vue`, `InstitutionalEvents.vue`, `InstitutionalGallery.vue` | Diretoria/voluntários e patrocinadores via imports locais; patrocinadores hoje reutilizam imagens de parceiros do Footer; eventos são catálogo estático. Migração deve ser gradual e preservar apresentação. |
| Controle antigo de modo | `landing-page/src/App.vue`, `landing-page/.env.cloud` | `VITE_LANDING_MODE=institutional` e `institutional/auto/competitive` definem gates para competições; não remover sem substituição de regra segura de publicação. **Decisão nova:** sem modo global; seção Competição e Hero competitivo têm visibilidade explícita. |
| Backend de mídia | Pesquisa em `gbsalermo/Rascomp` por `MediaAsset` e documentação de R2 | Não há evidência de entidade CMS `MediaAsset` implementada. R2 e `R2QuotaService` existem, categoria `gallery` para prefixos `gallery/` e `landing/`; Flyway V32 limita orçamento interno dessa categoria a 5,4 GB. |
| Regras e segurança | `gestao/src/store.ts` | DEV/MIDIA gerenciam mídia, GESTAO por padrão não. Na API, validar autoridade independentemente da visibilidade das telas; não liberar operações CMS a participantes. |

## Direção de desenho das duas interfaces (para aprovação)
### Interface A — Gestão de Mídia, dentro de `gestao/`
- Preservar Shell/sidebar da Gestão, com entrada **Gestão de Mídia** para DEV/MIDIA e submenu **Visão geral | Biblioteca | Álbuns | Landing | Publicações**.
- Tela inicial deve priorizar **Biblioteca** (grid fotos), filtros **Todas / Sem álbum / Álbuns**, busca, seleção múltipla, **Adicionar fotos**, **Novo álbum**, painel lateral da foto selecionada.
- Modal de upload permite 1/n fotos e `Sem álbum | Selecionar álbum(s) | Criar álbum`; mesma imagem pode aparecer em vários álbuns sem duplicação.
- `Landing` mostra cartões de seções; **Sobre** permite somente foto, **Patrocinadores** apenas logos/ordem/link opcional, **Competição** gere apresentação e Hero competitivo opcional.
- Editor de uso de imagem (não destrutivo) com zoom/posição/altura/largura dentro de presets e prévia responsiva.

### Interface B — Galeria pública
- Identidade IEEE RAS UFRB e navegação de retorno à Landing; hero compacto, filtros por tipo de álbum, grid de álbuns com foto real e contador **calculado**, dentro do álbum mosaico de fotos e lightbox.
- Preferir rota da Landing (`/galeria`, `/galeria/:slug`) reutilizando a interface `photo-gallery/`; a escolha final é validada antes da implementação.
- Somente álbuns/fotos publicados, sem mostrar fotos avulsas sem publicação. A biblioteca não é acessível ao público.

## Ordem curta aprovada pelo responsável
0. Auditar código + aprovar esboços;
1. Implementar visual das duas interfaces com dados mockados, testar 720p/1440p/mobile;
2. Persistência e 8 fluxos de upload/álbuns;
3. Enquadramento/recorte;
4. Conectar Landing **seção por seção** (Intro, Sobre imagem, Equipe, Robôs, Eventos, Patrocinadores, Competição);
5. Conectar Galeria ao acervo;
6. Segurança/QA/documentação + aprovação + PR/merge `main` + deploy.

**Bloqueante de escopo:** não criar alternância global institucional vs competitivo. O comportamento atual da flag cloud deve ser substituído por regras de visibilidade explícita apenas quando a integração competitiva estiver testada.
