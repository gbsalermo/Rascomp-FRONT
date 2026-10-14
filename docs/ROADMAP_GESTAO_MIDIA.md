# Roadmap funcional — Gestão de Mídia e Galeria

**Revisão:** 13/10/2026 | **Branch:** `v1-pos-cloud-gestao-midia` | **Estado:** checkpoint UI-first implementado na branch de desenvolvimento, aguardando teste manual e aceite. Sem backend CMS/persistência e sem merge na main.

## Decisões consolidadas
- **Construir PRIMEIRO as duas interfaces**: Gestão de Mídia (administração) e Galeria (consulta pública), com navegação, layout, responsividade, estados vazios e dados fictícios locais. Após validar visualmente, integrar cada capacidade por vez.
- **Não existe alternância global institucional/competitivo.** A Landing permanece com suas seções institucionais; a seção **Competição** terá seu próprio editor e poderá habilitar/adicionar **Hero competitivo na Intro**. Exibição de competição permanece independente da existência de competição vigente; não mostrar dados por acidente. Dados oficiais competitivos são controlados pela Gestão competitiva.
- Textos institucionais estáveis, especialmente **Sobre**, identidade visual e estrutura geral do Footer, permanecem no código; **Sobre** permite trocar foto e enquadramento. Patrocinadores: logos, ordem, enquadramento e link opcional, sem editor genérico de texto.
- Biblioteca simples de **todas as fotos**; fotos podem estar sem álbum e pertencer a múltiplos álbuns, sem duplicação física de arquivo. A Galeria consome o mesmo acervo, mas mostra apenas o que está publicado.
- Editor contextual de imagens semelhante aos ajustes de rótulos do SGL: **largura/altura controladas pelo componente, zoom, posição X/Y, recorte e prévia mobile/desktop**; preservar original e armazenar configuração por uso/slot.
- Desenvolvimento e testes exclusivamente locais/isolados; aprovação explícita; documentação sincronizada; PR/merge na `main`; depois deploy e smoke em produção.

## Etapa 0 — Auditoria rápida e contratos mínimos
1. Inventariar UI atual da Landing e da Galeria (`photo-gallery/`), imagens em `landing-page/public/media/assets/`, `HOME_MEDIA` e APIs existentes.
2. Definir navegação da Gestão de Mídia: **Biblioteca, Álbuns, Landing (Intro/Hero, Sobre, Equipe, Robôs, Eventos, Patrocinadores, Competição)**; sem menu separado de Publicações nem controles globais de modo. Os destaques editoriais ficam no editor de **Intro / Hero**.
3. Registrar contratos mínimos de `MediaAsset`, `Album`, `AlbumMedia`, `ContentSlot` e permissões (DEV/MIDIA, GESTAO conforme autorização explícita).
**Aceite:** mapa das duas interfaces, limites editáveis e contratos sem migração prematura.

## Etapa 1 — Interfaces primeiro (checkpoint visual)
**Gestão de Mídia:** layout com menu, Biblioteca em grid, visão de Álbuns, painel de upload em lote, seleção de foto, estados vazios/loading/erro, editor de enquadramento e entradas das seções editoriais; dados locais simulados.
**Galeria pública:** grade de **todas as fotos publicadas** como visualização inicial, independente de vínculo com álbum; opção **Álbuns** como filtro/agrupamento, com capa, navegação pelo álbum, visualização ampliada e responsividade; conteúdo demonstrativo local.
**Aceite:** navegar e validar ambas as interfaces em desktop (inclusive 720p/1440p) e mobile **antes da implementação backend**. Sem risco à produção.

## Etapa 2 — Biblioteca e álbuns persistentes
- Backend + Flyway + metadata MySQL, armazenamento local para QA e R2 apenas em ambiente/bucket apropriado; quota/segurança existentes preservadas.
- Grid de todas as imagens e filtros `Todas | Sem álbum | Álbum selecionado`; álbuns são associações N:N, não pastas físicas.
- **Matriz obrigatória de operações**:
  1. Foto única sem álbum.
  2. Várias fotos sem álbum.
  3. Foto única em álbum existente.
  4. Várias fotos em álbum existente.
  5. Foto única criando um álbum.
  6. Várias fotos criando um álbum.
  7. Várias fotos destinadas a vários álbuns, com associação por foto ou em lote.
  8. Associar fotos existentes a outros álbuns sem reupload.
- Criar/renomear álbum, capa, ordenação, desvincular sem apagar, excluir com prevenção de referências; erros parciais por arquivo, MIME/tamanho, autorização.
**Aceite:** oito cenários de upload + persistência e exclusão segura, aprovados localmente.

## Etapa 3 — Enquadramento e ajuste visual de fotos
- Foto selecionada → escolha do uso (Hero, Sobre, equipe, evento, patrocinador etc.) → zoom, posição, recorte, largura/altura permitidas para o componente → prévia real desktop/mobile → salvar.
- Configuração por vínculo com slot, **não destrutiva**; original inalterado; mesma foto com apresentações diferentes.
- Limitar alterações para não quebrar altura/estrutura das seções ou legibilidade.
**Aceite:** aplicar/editar/restaurar transformações em mais de um slot sem afetar outros usos da foto.

## Etapa 4 — Aplicação progressiva nas seções da Landing
Executar **uma seção por vez**, com teste e aceite ao final de cada uma:
1. **Intro / Hero e destaques editoriais (Publicações)** — além dos slides institucionais, permitir divulgar atividades (oficinas, participações, eventos e competições) em novos slides com imagem, enquadramento, título, descrição, CTA e **destino escolhido**: Galeria geral, álbum específico, evento cadastrado ou âncora/seção da Landing. Destinos internos devem usar referências/IDs quando aplicável, sem duplicar conteúdo. Prévia, reordenação, ativar/desativar e hero competitivo opcional, sem depender de modo global.
2. Sobre — **somente foto e enquadramento**.
3. Equipe/Conquistas — imagens editoriais, conquistas e fotos, respeitando fontes oficiais.
4. Robôs — apresentação de fotos, sem duplicar cadastros do domínio.
5. Eventos — administrar os dados dinâmicos dos eventos (datas, informações e imagens), que poderão ser **referenciados** pelo Hero editorial. Não duplicar o mesmo evento como Publicação.
6. Patrocinadores — logos, ordenação, dimensões/zoom e links opcionais; apoiadores institucionais separados.
7. **Competição** — editor da apresentação da seção, escolha/configuração do hero competitivo na Intro, sem alterar o status, regra, inscrições e resultados oficiais.
- Publicação intencional, prévia e rollback por versão; Landing pública busca somente conteúdo publicado via API com fallback controlado.
**Aceite:** mudar conteúdo na Gestão local e verificar na Landing local **sem recompilar**, seção por seção.

## Etapa 5 — Galeria real conectada ao acervo
- Substituir dados fictícios por fotos publicadas da biblioteca persistente. **Todas** mostra todas as fotos publicadas, inclusive sem álbum; **Álbuns** agrupa/filtra fotos por álbum selecionado. Capa, ordem, filtros e fotos compartilhadas entre álbuns.
- Não exibir imagens privadas ou não publicadas, ainda que tenham sido associadas a álbuns; publicação explícita por foto (e visibilidade do álbum quando aplicável). Integração pública somente leitura.
**Aceite:** criar álbum/fotos na Gestão local e visualizar na Galeria local sem novo deploy.

## Etapa 6 — Segurança e fechamento
- Permissões e auditoria de uploads/publicações, falhas/retries/quota R2, limpeza/reconciliação, sanitização, cache, responsividade, testes automatizados e regressões.
- Preservar backup/restore e teste de carga como gates de homologação para inscrições reais, separados desta entrega.
- Atualizar README, continuidade e roadmap nos dois repositórios; PRs, CI verde, aprovação explícita, merge na `main`, deploy Render/Cloudflare e smoke.

## Checkpoints com o responsável
1. Interfaces de Gestão de Mídia + Galeria (sem backend).
2. Biblioteca/álbuns e matriz de 8 operações.
3. Editor de recorte e enquadramento.
4. Integração por seção (Intro → Sobre → Equipe → Robôs → Eventos → Patrocinadores → Competição).
5. Galeria conectada ao acervo.
6. Regressão e aceite final.

**Decisão de aprovação dos esboços — 13/10/2026:** as duas interfaces foram aprovadas com alteração de Galeria: a opção **Todas** apresenta diretamente todas as fotos publicadas e **Álbuns** é filtro/agrupamento. **Publicações não é menu separado:** é o conteúdo de destaque do **Intro / Hero**, com chamadas contextuais (ex.: Oficina de Arduino → "Ver fotos" → álbum dessa oficina). Eventos permanecem como entidades editáveis à parte, podendo ser associados ao Hero sem duplicação. Próximo passo: Etapa 1, interfaces visuais antes do backend. Não começar por migrações ou regras de modo institucional/competitivo.


## Checkpoint técnico — interfaces locais construídas, 13/10/2026

**Implementação:** rotas `/midia`, `/midia/albuns` e `/midia/landing` (DEV/MIDIA), seleção e filtros de mídia, upload simulado na memória do navegador, associação N:N simulada a álbuns, gestão de álbuns, enquadramento demonstrativo e editor mock de Hero/Publicação para apontar a álbum, Galeria, evento ou seção. `photo-gallery/` passou a mostrar **Todas as fotos** como padrão e **Álbuns** como filtro, com categorias e lightbox. Dataset visual de demonstração SVG explícito: não são fotos reais nem banco/R2.

**CI:** GitHub Actions do commit `aa351fe410eaff0384592aaca229961b9528b367`: **Frontend Checks = success** e **Photo Gallery Checks = success**. PR **#7 DRAFT**, exclusivamente para CI e revisão, não apto a merge até teste visual e autorização explícita do responsável.

**Teste manual:** iniciar backend local para login da Gestão, `cd gestao && npm ci && npm run dev` (5173), `cd photo-gallery && npm install && npm run dev` (5175). A Galeria ainda executa como app isolada para a prévia; a absorção em `landing-page/galeria` será uma implementação posterior conforme decisão previamente aprovada.

**Próximo gate:** o responsável validar UX desktop/mobile, biblioteca, álbum, editor de imagem e navegação da Galeria. Depois implementar a camada persistente, API e integração seção a seção. Nada desta branch foi publicado em produção.


## Regra de ambiente para perfil DEV — 13/10/2026
- Todo usuário **DEV** mantém acesso total à Gestão DEV e à **Gestão de Mídia**, sem troca de perfil/conta/token.
- Dentro da sidebar, um seletor **AMBIENTE DEV** com as opções **Gestão DEV** e **Gestão de Mídia** faz a navegação entre `/` e `/midia`.
- Em rotas `/midia/**`, a sidebar do DEV exibe apenas Biblioteca, Álbuns e Landing. Fora delas, exibe os recursos tradicionais de administração/competição. O contexto de competição e alertas operacionais não devem ocupar a interface editorial.
- O perfil **MIDIA** continua com acesso exclusivamente editorial, sem opção de entrar em Gestão DEV; GESTAO e PARTICIPANTE não ganham acesso ao CMS. Autorização de backend permanece obrigatória quando a API do CMS for implementada.
- Teste local: login DEV -> alternar repetidamente ambientes -> navegar Biblioteca/Álbuns/Landing -> voltar à Gestão DEV sem relogin. Conferir sidebar recolhida, mobile, menu e negativa de acesso por usuário GESTAO.

## Rodada de validação visual 2 — feedback 13/10/2026 (em implementação)
**Observações testadas pelo responsável e correções feitas na branch, sem publicação:**
- Hero editorial: adicionada escolha de imagem própria do destaque e upload local diretamente no seletor, além dos campos e CTA existentes.
- Sobre: sequência de fotos com reordenação e exclusão (somente fotos; texto fixo).
- Equipe: diretoria com seis cargos imutáveis (presidente, vice-presidente, tesoureiro, secretário, marketing e orientador), escolha de fotos individual; voluntários (limite visual inicial 12); conquistas editáveis com ano, título, detalhes, foto e ordem, adição/remoção.
- Robôs: banner principal e subcoleções por Sumô, Mini Sumô, Hockey e Follow Line, com upload/seleção direta na categoria escolhida.
- Eventos: título, data, descrição, foto, adicionar/remover/reordenar.
- Patrocinadores: logos com inclusão, substituição, exclusão, ordenação, URL opcional e zoom (limite visual inicial 12).
- Competição: imagem/editorial da seção e Hero competitivo opcional; dados oficiais permanecem exclusivos da API operacional.
- Álbuns: capa escolhida entre fotos associadas, ou foto automática estável durante a prévia; card usa arquivo real enviado quando disponível.
- Biblioteca: miniaturas e prévias com `object-fit: contain` para não cortar as imagens; recorte intencional reservado para slots/componentes.
- Publicação: antigo switch **Visibilidade** recebeu nome explicativo **Exibir na Galeria pública (após integração)**; privado significa somente Biblioteca. No protótipo esta opção **não sincroniza** a aplicação Galeria.
- Galeria: acabamento dos cards e exibição integral da foto com `object-fit: contain`, layouts responsivos.

**Limites do checkpoint atual:** os conteúdos ficam em memória, inclusive os arquivos selecionados via object URLs; não são persistidos, não chegam ao R2 e **não aparecem automaticamente em `photo-gallery/`**. Essa integração entre aplicações exige a API do acervo (etapas seguintes). O projeto em `photo-gallery/` ainda usa dataset ilustrativo, não fotos enviadas à Gestão.

**Próximos testes visuais:** escolher imagem do Hero; Sobre sequência; fotos de cada cargo; limites e ordem de voluntários; CRUD de conquistas/eventos; Robôs por categoria/banner; logos e zoom; banner e hero de Competição; capa manual/automática; imagens completas e clareza da opção de publicação; validar Galeria em mobile e desktop. CI deve permanecer verde; PR #7 DRAFT e sem merge até aceite.

## Ajuste solicitado — visibilidade definida no upload e padrão do usuário (13/10/2026)
- No modal **Adicionar fotos à Biblioteca**, o usuário define **exibição do lote**: `Privadas — apenas na Biblioteca` ou `Públicas — Galeria após integração`. A escolha se aplica a todas as fotos enviadas no lote, independentemente do álbum.
- O usuário configura o **padrão para novos envios** independentemente da escolha do lote atual; o modal é iniciado com esse padrão ao ser aberto novamente.
- Na fase de prévia, a preferência é mantida em `localStorage` com chave isolada pelo ID de usuário e pelo navegador, não em MySQL. A implementação persistente futura deverá armazenar a preferência por usuário no backend, se exigida por múltiplos dispositivos.
- Cada foto pode ter a publicação alterada individualmente depois na Biblioteca, sem mudar o padrão definido para futuros uploads.
- Upload direto de arquivos pelo editor da Landing usa o padrão dessa conta. Não há publicação real nem ligação com a Galeria demonstrativa independente nesta fase.
- Testar: upload público/privado, lotes múltiplos, alterar padrão e reabrir modal, trocar usuário, mudar publicação posterior e reiniciar frontend, sem publicar em produção.

## Regra confirmada — conteúdo atual editável (13/10/2026)
**O CMS é gerenciamento do que já existe, não uma tela somente para novas inclusões.**
- Intro: a prévia é inicializada com os **4 Heroes institucionais reais** extraídos de `landing-page/src/components/HighlightsHero.vue` e `landing-page/src/content/homeMedia.ts`; lista de slides com seleção, edição do existente, substituição de imagem, restaurar original, reordenar, incluir, retirar, ativar/desativar e CTA/destino. Slide competitivo dinâmico continua governado pela API; sua apresentação permanece no editor Competição.
- Eventos: os registros existentes da constante `LANDING_EVENTS` são sementes editáveis com títulos, categorias, local, início/fim, descrição e fotos importadas da pasta `landing-page/src/assets/`; também permitem adicionar, retirar, ordenar e ativar/desativar.
- Conquistas: quatro registros originais de `TeamRobotsAwards.vue` aparecem com ano, título, colocação, evento, detalhes, imagem opcional, ordenação, remoção e visibilidade.
- Robôs: imagens preexistentes em `landing-page/src/assets/robots/<categoria>/` aparecem na categoria correspondente, com troca de imagem, edição de nome, remoção, inclusão e ordem. Banner de `assets/robots/banners/` entra na prévia.
- Diretoria, voluntários e logos de parceiros são carregados a partir das pastas existentes para permitir troca/organização no editor.
- A cópia original está registrada em `gestao/src/content/landingEditorialSeeds.ts` com identificador `sourceId` para a migração posterior; a visualização de arquivos versionados é temporariamente feita com `import.meta.glob`.
- **ATENÇÃO:** o componente da Gestão ainda é **prévia local em memória**, não lê conteúdo de produção ao vivo, nem escreve nos arquivos estáticos, na API ou no R2. Alterações não aparecem na Landing real até implementarmos camada persistente, migração idempotente dos dados existentes, leitura pública e fluxo de publicação. Não promover listas estáticas duplicadas a duas fontes definitivas da verdade.
- Gate seguinte: aprovar visualmente edição de Heros, eventos, conquistas e robôs preexistentes. Só depois API, Flyway e publicação gradual por seção; não substituir nem apagar conteúdo atual antes de migrar e validar.

## Ajustes de validação do editor e privacidade da Galeria — 13/10/2026
- **Hero — restaurar original:** volta chamada, título, descrição, botão/CTA, destino, imagem original, ativação e demais campos do slide existente; comunica sucesso. Há também ação para recuperar os slides originais que tenham sido removidos da prévia.
- **Hero — botão opcional:** cada Hero define se exibe CTA ou não, mantendo a possibilidade de editar texto e destino quando habilitado.
- **Imagens dos Heroes na Gestão local:** `gestao/vite.config.ts` serve SOMENTE imagens públicas em `landing-page/public/media/assets/` pelo prefixo de desenvolvimento `/__rascomp_landing_media/`; não há redirecionamento de edição para a produção. Arquivo legado inexistente ou inválido resulta em mensagem de indisponibilidade, sem ícone quebrado.
- **Sobre:** as fotografias que já estão em `landing-page/src/assets/about/` aparecem desde a abertura; a lista admite mudanças na prévia local, mantendo textos institucionais intactos.
- **Robôs:** corrigido layout do banner de prévia com dimensão fixa, `overflow:hidden` e `object-fit:contain` para evitar que a imagem amplie a seção e sobreponha controles.
- **Botões vermelhos:** garantir contraste branco nos botões preenchidos; botões de contorno preservam estilo próprio.
- **Competição:** manter a proposta já validada pelo responsável, sem adicionar módulos desnecessários.
- **Biblioteca / privacidade:** mídia importada dos assets institucionais é tratada como `private` por padrão na prévia. Importar uma imagem interna ao editor não significa publicá-la.
- **Galeria:** apenas mídia marcada explicitamente como `published:true` entra na listagem e páginas dos álbuns; mosaico público não apresenta nome do arquivo nem legendas sobrepostas. O identificador textual pode permanecer como `alt` descritivo para acessibilidade. O catálogo SVG atual é demonstração com autorização explícita, **não está conectado à Biblioteca**.
- Limites: alterações em editores/galeria ainda são protótipos locais em memória ou fixtures; os dados e a visibilidade reais serão servidos pela API após migração segura com estado de publicação e permissões. Nenhum commit foi mesclado na `main` ou publicado em Cloudflare/Render.
- **Teste manual antes do gate:** modificar um Hero existente e restaurar; remover original e recuperar; desabilitar/reativar botão; mostrar sequência prévia do Sobre; verificar banner Robôs sem invadir outras seções; galeria todas/álbum/lightbox sem nomes de fotos; foto marcada privada não entrar no resultado público quando backend for implementado.

## Novos editores solicitados antes do teste — 13/10/2026
### Competição → Hero competitivo (editor local)
- O Hero da competição continua derivado dos dados oficiais da API: **nome da competição, status das inscrições, lote atual, categorias, CTA principal e destino** não podem ser sobrescritos pelo CMS.
- `Landing → Competição` apresenta área editorial separada, com foto escolhida na Biblioteca (ou upload direto), subtítulo, descrição complementar, habilitar/ocultar Hero e botão **secundário opcional** com destino limitado a Competição, Galeria ou Eventos.
- Há prévia em formato de Hero com **rótulos explícitos “API”** nos dados somente leitura. São placeholders estruturais enquanto não houver integração real; não constituem fatos nem dados de uma competição específica.
- A edição da imagem/descrição complementares da seção Competição permanece separada do Hero.
- Critério de aceite: não duplicar título/lote/status cadastrados na competição; foto e textos adicionais podem ser alterados sem efeitos nas entidades operacionais. Não publicar uma competição automaticamente, respeitar a elegibilidade de exibição vigente.

### Landing → Footer (editor local)
- Adicionada seção **Footer** no menu das seções editoriais, com `gestao/src/components/MediaFooterEditor.vue`.
- Editáveis: e-mail, Instagram (URL e identificador), WhatsApp (URL e rótulo), localização apresentada, texto de contato, mensagem/chamada de apoio, **destino** dos links UFRB/IEEE/IEEE RAS/IEEE Brasil. Links são validados como HTTP(S), e-mail e URL WhatsApp têm validação básica ao testar.
- Não editáveis: nomes institucionais e identidade visual, logos oficiais, composição/layout do Footer, direito autoral e crédito dev.
- Os campos iniciam com defaults do código de `landing-page/src/components/InstitutionalFooter.vue`; a produção também pode usar variáveis `VITE_*` no build, portanto valores do preview não são um fetch de produção.
- Prévia local simplificada, restaurar padrões e validar campos; **nenhum dado é persistido** na API ou publicado.
- Critério de aceite: alterar campos, visualizar prévia, restaurar, validar URLs e manter créditos e instituições protegidos.

**Fluxo preservado:** interfaces → validação manual local → backend/CMS persistente por etapa e testes → aprovação explícita → merge na `main` → deploy/smoke. Não iniciar merge em PR #7 draft.


## Ajuste de estilo — botões na Gestão de Mídia (13/10/2026)
- Botões de ação vermelhos preenchidos em **Biblioteca, Álbuns, Landing, Competição e Footer** passam a ter letras/ícones **brancos por padrão**, inclusive hover, foco e estado pressionado. O vermelho institucional é controlado centralmente em `gestao/src/styles/media-button-colors.css`, carregado por último no `src/main.ts`.
- Botões secundários e neutros **não** ficam com letras brancas em fundo branco: preservam contraste escuro. Alertas/remoção e estados desabilitados mantêm identidade própria.
- Modais da Biblioteca, álbuns, ajuste de imagem e seleção de mídia usam classes específicas no `el-dialog` para preservar o tema mesmo ao renderizar via Teleport no `body`.
- Critério de aceite: texto branco nos botões preenchidos em todas as seções, inclusive ao passar o mouse; texto legível nos botões de contorno/neutros; nenhuma alteração global no restante da Gestão operacional.

## Nova validação — Hero competitivo, enquadramento em todas as imagens e nomes dos robôs (13/10/2026)
- **Controle editorial do Hero competitivo:** quando **desativado**, o Hero não entra na Intro, mesmo que exista competição vigente/inscrições abertas; **não altera a seção Competição nem as regras/dados da API**. Quando ativado, ele só poderá ser mostrado quando a competição estiver apta a aparecer. Esta é a **regra-alvo para a integração persistente**, não uma alteração já aplicada na Landing de produção. No mock local, a prévia esconde o Hero desativado e explica a consequência.
- **Enquadramento não destrutivo em todas as imagens editáveis:** componente reutilizável `gestao/src/components/MediaImageAdjustment.vue`, com ajustes de zoom, largura, altura, posição X/Y e encaixe (`cover/contain`), restaurar padrão e confirmar. Usos previstos: Hero editorial (inclusive imagem original versionada), Sobre (cada foto), cargos da diretoria, voluntários, conquistas, banner de Robôs, fotos por categoria, Eventos, logos de Patrocinadores e banner/Hero da Competição. Armazenar no futuro por **slot / associação de mídia**, não na imagem física; uma mesma foto pode apresentar enquadramentos diferentes em cada posição.
- **Robôs:** título editável individualmente, com prévia de nome **abaixo** (padrão, como na Landing atual) ou **sobre** a fotografia e ferramenta de enquadramento de cada foto. O nome hoje exibido pela Landing deriva do arquivo `RobotsShowcase.vue`; o CMS futuro deverá substituir essa derivação pelo texto editorial salvo, **não confiar no nome original do arquivo**. Não há sincronização automática entre Gestão e Landing neste checkpoint.
- **Acessibilidade e UX:** ações `el-button size=small` dos editores ganharam altura/padding de alvos mais confortáveis; botões de categorias ficaram maiores. Aplicar estilo somente no módulo, sem alterar controles operacionais da Gestão DEV.
- **Testes locais:** (1) desativar Hero competitivo e confirmar que a prévia mostra estado oculto, sem mudar seção; (2) ativar Hero e ajustar imagem com zoom e posicionamento, restaurar; (3) escolher uma foto de categoria, alterar nome e posicionar legenda sobre/abaixo; (4) trocar imagem e confirmar enquadramento independente por slot; (5) repetir ajustes em Sobre, diretoria, conquistas, patrocinadores e outras seções; (6) confirmar que nada persiste após atualizar e não modifica a Landing pública.
- **Bloqueio para deploy/merge:** integração API/CMS, migração dos dados existentes e publicação devem implementar visibilidade como `competitionHeroEnabled && competicaoElegivel`; ainda não realizado. O controle não deve suprimir inscrições ou a seção Competição, nem alterar status, título oficial ou lote.

## Checkpoint — Prévia real da Landing local (13/10/2026, UI-first)
- Botão **Prévia do site** em `Gestão → Mídia → Landing` abre **`http://localhost:5174/?rascomp_media_preview=1`** em janela/aba local. A Landing precisa estar rodando separadamente em `landing-page/npm run dev` (5174), e a Gestão em 5173.
- `Aplicar na prévia local` envia o estado atual dos editores para a aba que já estiver aberta, sem precisar salvar no MySQL/R2 ou fazer build/deploy. O botão Prévia do site também envia o rascunho mais recente ao abrir.
- Transporte via `window.postMessage` limitado aos origins localhost do projeto e à janela aberta pela Gestão, com nonce único para a aba. **Somente DEV**: nunca executar esse canal em produção. O rascunho é mantido apenas em memória; imagens temporárias `blob:` são clonadas como Blob no canal e recriadas na Landing. Não há endpoint para buscar rascunhos privados.
- A Landing real lê snapshots de **Intro/Hero (editar, ordem, CTA/visibilidade, enquadramento), Sobre, diretoria, voluntários, conquistas, Robôs por categoria com nomes, eventos, patrocinadores e Footer**, sem alterar os componentes permanentes da produção. Uma faixa fixa **PRÉVIA LOCAL — NÃO PUBLICADA** identifica o modo. Links externos e URLs de inscrições são bloqueados na prévia para evitar ações involuntárias.
- Competição: o Hero só pode aparecer na prévia se `heroEnabled=true` **e houver competição elegível retornada pela API**. O estado editorial não modifica API, lote nem inscrições. A seção competitiva continua sob gates atuais; modo institucional não inventa competição.
- A prévia não transforma o catálogo demonstrativo `photo-gallery/` num acervo público. Galeria e biblioteca real continuam sujeitas à futura integração CMS/backend.
- QA manual: start Gestão em 5173 e Landing em 5174; editar Hero existente e abrir Prévia do site; conferir carrossel, foto e CTA; voltar à Gestão, alterar ordem, nome de robô, texto de evento e Footer, clicar Aplicar na prévia local e conferir a aba atualizando sem reload; testar imagens carregadas pelo upload local, bloqueio de links de inscrição, faixa de não-publicação e desligamento/ligamento de Hero competitivo com competição elegível. Fechar a prévia ou recarregar Gestão perde o rascunho em memória — esperado.
- Não realizar merge do PR #7 draft ou deploy antes do aceite e API CMS persistente.

## Aceite manual parcial — Prévia da Landing (13/10/2026)
- O responsável testou e confirmou que o fluxo de **Prévia do site** funciona localmente: Gestão de Mídia (5173) → Landing real em modo prévia (5174), com as alterações do rascunho.
- **Validado apenas o fluxo de pré-visualização local**. Isso não equivale à aprovação de todos os editores, da publicação online ou da integração do CMS.
- Próximo checkpoint: **testes e acabamento da Galeria pública**, com fotografias publicadas explicitamente, ausência de nomes de arquivos/etiquetas sobrepostas e navegação Todas/Álbuns.
- Ainda pendentes: armazenamento persistente de rascunhos, controle de publicação, prévia autenticada online, API/CMS/R2, smoke em produção e aprovação explícita antes do merge. PR #7 permanece draft; manter `main` e produção intactas.


## Galeria pública — revisão e integração de prévia local, 13/10/2026
- **Separação obrigatória de finalidade:** usar uma foto em Hero, equipe, evento, robô, patrocinador, Sobre ou qualquer seção **não equivale a publicá-la na Galeria**. A publicação é uma decisão independente por foto, com escolha por lote no upload, preferência padrão por usuário e alteração posterior na Biblioteca. Uma mesma foto pode servir vários slots e continuar privada na Galeria; estar em um álbum tampouco a torna pública.
- A Biblioteca recebeu filtros **Na Galeria** e **Privadas** além de Todas/Sem álbum/Álbum. Imagens originais importadas da Landing continuam privadas por padrão.
- **Prévia real de conteúdo da Galeria em desenvolvimento:** botão **Prévia da Galeria** na Biblioteca e em Álbuns abre a aplicação da Galeria em `localhost:5175/?rascomp_gallery_preview=1` e envia somente fotos explicitamente públicas e seus álbuns por `postMessage` restrito ao origin e à aba/token. Fotos privadas não entram nem no payload; uploads temporários são transportados como `Blob` local. A ação pode ser repetida para atualizar o conteúdo sem recarregar a página. Não armazena/publica nada.
- **Galeria pública UI-first:** `Todas` mostra fotografias públicas com ou sem álbum; `Álbuns` é filtro/coleção. Só aparecem álbuns com fotos públicas; a capa manual é usada apenas quando for uma foto publicada do álbum, caso contrário escolhe-se a primeira foto pública. Fotos compartilhadas por vários álbuns aparecem uma vez em Todas. Visitantes não veem nomes de arquivos nem dados internos.
- **Acabamento:** novo mosaico responsivo tipo masonry que preserva fotos inteiras (`height:auto`, sem cortes), cabeçalho editorial, capas de álbum, contagem, navegação acessível, visualizador ampliado compartilhado com Escape/setas e fechamento, estados vazios e responsividade 720p/1440p/mobile. Arquivos `photo-gallery/src/gallery-polish.css`, `components/GalleryLightbox.vue`, `data/localGalleryPreview.ts`.
- **Sem confundir protótipo com produção:** acesso normal ao app local 5175 ainda pode mostrar exemplos SVG explicitamente identificados como ilustrações; a janela iniciada na Gestão mostra apenas fotos marcadas públicas, sem importar arquivos privados do filesystem institucional. O CMS real deverá aplicar as permissões **na API e no serviço de mídia**, impedir vazamentos via endpoints, cache/CDN e links R2, armazenar estados e incorporar Galeria à Landing em `/galeria` somente após aceite visual.
- **Bateria manual:** enviar foto A para Hero como privada; confirmar A ausente na prévia da Galeria; foto B pública sem álbum deve aparecer em Todas; mudar B para privada → atualizar prévia → B some; associar foto C pública a dois álbuns → apenas um resultado em Todas, aparece nos dois álbuns; definir capa de álbum usando foto privada → fallback para foto pública; verificar lightbox com teclado, fotos verticais/horizontais sem cortes e mobile. Recarregar sessões perde o estado em memória, como esperado.
- Sem merge na main ou deploy; o PR #7 permanece draft até aprovação e backend.

## Fechamento de refinamentos da Galeria — seleção múltipla e destaques (14/10/2026)
- **Biblioteca:** adicionado modo explícito **Selecionar várias** por clique simples (Ctrl+clique permanece suportado), com ações selecionar todas as visíveis, limpar seleção, **Adicionar a álbuns** e **Excluir selecionadas**. Associação em lote faz união de álbuns, sem substituir vínculos existentes nem duplicar arquivos. Exclusão exige confirmação, retira referências de capa/destaques e ocorre exclusivamente em memória local; a implementação persistente deverá verificar referências a slots da Landing e políticas de exclusão no backend.
- **Destaques da Intro da Galeria:** botão **Destaques da Galeria**, acessível de Biblioteca/Álbuns, abre três posições ordenadas com miniaturas e seletores independentes, sem repetição. Apenas fotografias explicitamente públicas e com arquivo de imagem podem ser elegíveis. Alterações ficam no rascunho local, e a prévia da Galeria em 5175 recebe os IDs na ordem escolhida. Se imagens deixarem de ser públicas ou forem removidas, são descartadas e substituídas por fotos públicas disponíveis; menos de três fotos gera layout adaptado.
- **Separação reforçada:** arquivos carregados por editores de seções da Landing **sempre iniciam privados na Galeria**, mesmo que o padrão dos uploads explícitos da Biblioteca tenha sido configurado como Público. Quem quiser exibir na Galeria deve ir à Biblioteca e autorizá-los individualmente.
- **Situação da fonte:** abrir `http://localhost:5175` diretamente ainda apresenta imagens SVG ilustrativas independentes (o contador 40/5 pertence ao exemplo). Somente o botão **Prévia da Galeria** da Gestão abre a janela vinculada à Biblioteca em `?rascomp_gallery_preview=1` e mostra fotografias reais marcadas públicas naquela sessão. Ao alterar imagens, destaque ou associações, clicar novamente nesse botão para transmitir o novo rascunho. Integração do catálogo vivo e publicação automática online continuam **pendentes do CMS/API/MySQL/R2**, sem deploy.
- **QA pendente de aceite manual:** Selecionar várias por clique, associar N fotos aos álbuns mantendo os anteriores, testar exclusão cancelada/confirmada, restaurar recarregando; escolher 3 fotos públicas diferentes e verificar ordem na Intro da Galeria aberta via Gestão; tornar uma escolhida privada e confirmar fallback; testar foto pública sem álbum; conferir que fotos novas de Hero permanecem privadas; validar 720p/mobile. Não interpretar CI verde como aprovação funcional do navegador.


## Gate de produção — aceite visual concedido em 14/10/2026; implantação bloqueada por persistência

**Autorização do responsável:** depois de validar os últimos ajustes da Galeria e da Gestão, solicitou expressamente colocar o módulo em produção. Isso encerra a rodada de aceite **visual**, mas não comprova prontidão da funcionalidade de publicação.

**Não realizar o merge do PR #7 nem o deploy do CMS/Galeria enquanto os seguintes gates não estiverem verdes:**

1. **Backend CMS persistente (Java + MySQL/Flyway):** modelos e API autenticada para arquivos, álbuns N:N, capas, destaques, seções editoriais, rascunhos/versionamento e publicação; migração segura das imagens existentes da Landing, sem alterar fontes oficiais de competição.
2. **R2/segurança:** uploads reais por perfis DEV/MIDIA, limite de tamanho/tipo, validação de conteúdo, URL segura, quota e auditoria. O endpoint público deve listar e servir **apenas fotos explicitamente publicadas**, sem vazar imagens privadas mesmo que sejam usadas em Heroes ou álbuns. Proteção também em URLs de origem/CDN e no cache.
3. **Frontend integrado à API:** remover o caráter demonstrativo da Gestão em produção; exibir status e erros reais de salvamento; implementar Salvar rascunho → Prévia autenticada → Publicar alterações com confirmação/rollback; consumir conteúdo publicado na Landing e na Galeria sem redeploy por alteração de foto/texto.
4. **Galeria integrada ao domínio público:** substituir definitivamente as 40 imagens SVG de demonstração, publicar a experiência no site real (decisão anterior: preferir rota /galeria na Landing, sem exigir Worker independente) e configurar links internos, favicon, SEO e estados vazios.
5. **QA + rollout/rollback:** testes backend com MySQL/Flyway e integração/storage; checks do frontend/landing/galeria; teste manual de gravar/recarregar e verificar persistência, publicar/despublicar, conta sem permissão, arquivos privados sem acesso externo, fallback e rollback; confirmar backup/restore; verificar health da API/DB R2 em cloud antes de ativar. Fazer deploy explícito de Render e Cloudflare após smoke de homologação.

**Estado em 14/10:** interface visual aprovada e PR #7 com CI frontend/landing/galeria verde; backend CMS inexistente, uploads/edições ainda em memória, prévia limitada a localhost e Galeria direta mostrando imagens ilustrativas. Por isso o deploy da funcionalidade foi **adiado por bloqueio técnico**, não por ausência de autorização. Preservar produção atual sem regressões. GitHub Actions deste frontend executam checks, não efetuam deploy automaticamente.

**Próximo trabalho de engenharia:** iniciar Etapa 2 do roadmap (biblioteca/álbuns backend) em branch isolada no backend e integrar de forma incremental até cumprir o gate, então realizar rollout de produção autorizado com smoke e rollback.
