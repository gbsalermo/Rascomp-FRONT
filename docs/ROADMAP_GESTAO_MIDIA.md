# Roadmap funcional — Gestão de Mídia e Biblioteca (13/10/2026)

**Branch:** `v1-pos-cloud-gestao-midia` nos repositórios backend/frontend. **Política:** implementar local, testar/validar por checkpoint, sincronizar documentação, abrir PR e só então publicar na `main`. **Status:** planejamento aprovado parcialmente; não implementado.

## Princípios de escopo
- **Não transformar a Landing em editor visual irrestrito.** Textos institucionais estáveis (como Sobre RAS/IEEE) e identidade/layout permanecem versionados; ajustar principalmente imagens e dados realmente dinâmicos.
- Gestor de Mídia deve permitir trocar imagens sem rebuild; editor contextual de enquadramento/zoom/altura/largura com limites por slot, similar ao ajuste de rótulos no SGL, sem alterar layout estrutural.
- Patrocinadores: gestão de **logos** e sua disposição no carrossel, não editor genérico de textos; apoiadores institucionais separados.
- Modalidades/resultados/inscrições continuam governados pelo domínio competitivo, nunca pelo CMS.
- Biblioteca simples primeiro: visualizar **todas as fotos**, filtros por álbum ou sem álbum, múltiplos álbuns por foto, mídia reutilizada sem duplicação física.
- Produção isolada do ambiente de testes, MySQL/Flyway + storage local ou bucket isolado; quota e controles R2 mantidos.

## B0 — Auditoria e contratos
- Inventariar arquivos da Landing `landing-page/public/media/assets/`, `HOME_MEDIA`, fontes de Galeria/Robôs/Eventos/Equipe.
- Mapear slots editáveis vs imutáveis, propor contrato de API pública e administrativa.
- Permissões: DEV e MIDIA administram conteúdo; definir explicitamente se GESTAO pode publicar. Participante somente leitura pública.
- Modelagem: `MediaAsset`, `Album`, `AlbumMedia` (N:N com ordem/capa), `ContentSlot`, `ContentItem`/versões editoriais apenas onde necessárias.
- Definir estratégias de migração/fallback, tratamento de caminhos antigos e retenção.

**Aceite:** documentação de contratos, matriz de permissões, inventário de slots e plano de migração.

## B1 — Biblioteca e upload simples (primeiro checkpoint visual)
### Tela Biblioteca
- Grid de todas as imagens, visualização grande, busca, filtros `Todos | Sem álbum | Por álbum`, seleção individual/múltipla, detalhes básicos.
- Álbum é coleção lógica, **não diretório físico**; foto pode pertencer a zero, um ou vários álbuns.
- Ações: criar/renomear/organizar álbum, escolher capa, ordenar fotos, adicionar/remover vínculo sem excluir arquivo global; exclusão definitiva com verificação de usos.

### Matriz obrigatória de upload
1. Uma foto avulsa, **sem álbum**.
2. Várias fotos avulsas, **sem álbum**.
3. Uma foto para **álbum existente**.
4. Várias fotos para **álbum existente**.
5. Uma foto **criando álbum no fluxo**.
6. Várias fotos **criando álbum no fluxo**.
7. Várias fotos distribuídas por **vários álbuns** no mesmo fluxo, permitindo selecionar vários álbuns para cada foto ou em lote.
8. Vincular fotos já armazenadas a álbuns, sem reenviar nem duplicar bytes.
- Fluxo upload: selecionar arquivo(s) → escolher `Sem álbum | Álbum existente | Criar álbum` (e/ou associação múltipla) → revisar prévia → confirmar → feedback individual de sucesso/erro.
- Upload seguro: tipo MIME real, limites de dimensão/tamanho/quantidade, autorização, nomes de objeto aleatórios, falhas parciais, quota R2; alt text e créditos opcionais no cadastro.
- Mídia privada por padrão e acesso público controlado conforme estado de publicação.

**Aceite:** executar 8 cenários, filtros, exclusão vs desvinculação, integridade banco/arquivo e persistência após reinício.

## B2 — Editor de enquadramento (largura, altura, zoom)
- Editor por **uso da imagem em um slot**, sem destruir o arquivo original nem alterar outros usos da mesma foto.
- Manipulação visual: arrastar posição X/Y, zoom, recorte, prévia responsiva desktop/mobile; parâmetros de largura/altura **dentro de limites e proporções do componente**, com ação de restaurar padrão.
- Presets para Hero da Intro, Sobre (apenas foto), Equipe/Conquistas, Robôs, Eventos, Galeria e logos de patrocinadores.
- Guardar configuração de apresentação (object-position, scale/crop/aspect ratio ou variante derivada) como metadados versionáveis ligados ao slot; evitar depender apenas de CSS ad hoc.
- Checagem de legibilidade/resolução mínima e prévia real no contexto do componente.
- Não alterar dimensões externas/estrutura de layout por usuários MIDIA.

**Aceite:** original intacto, mesma imagem com cortes diferentes em slots distintos, preview mobile/desktop igual ao resultado publicado.

## B3 — Conteúdo e slots editáveis por seção
- Intro/Heros: trocar fotos, ordem, opção de ativar/desativar slides e enquadramento; textos estáveis não se tornam editáveis automaticamente.
- Sobre: somente foto e enquadramento; texto/propósito fixos no código.
- Equipe/Conquistas: fotos de diretoria, voluntários e premiações, conforme fontes oficiais; conteúdo institucional permanente preservado.
- Robôs: imagens/apresentação sem duplicar cadastro e resultados oficiais.
- Eventos/notícias: conteúdos realmente dinâmicos (título, descrição, datas, imagem e publicação); alinhar com modelo de eventos existente.
- Patrocinadores: logos, enquadramento, ativação/ordem e links opcionais; carrossel automático. Apoiadores do rodapé permanecem distintos.
- Footer e identidade: informações institucionais fixas não são um CMS irrestrito.
- Histórico, rascunho, prévia, publicar/despublicar, restaurar versão; confirmação e autoria.

**Aceite:** edição local por seção, dados oficiais invariantes e restauração funcional.

## B4 — Integração Landing + modos
- Landing busca conteúdo publicado via API; fallback estático enquanto migra; cache/invalidação e UX resiliente quando API indisponível.
- Modo **INSTITUCIONAL | COMPETITIVO** administrado explicitamente, auditado e reversível, independente de haver competição vigente.
- Prévia antes de publicar; não revelar conteúdo de competições restritas sem seleção/autorizações.
- Testar responsividade 720p/1440p e mobile, sem regressões visuais.

**Aceite:** atualizar foto via Gestão local e enxergar Landing atualizada sem rebuild; testar alternância sem alterar Competition.

## B5 — Galeria pública e álbuns
- Galeria consume os mesmos `MediaAsset`/`Album`; apenas álbuns/fotos publicados aparecem.
- Listagem álbuns, capa, fotos, ordem, descrições e filtros; foto pode existir em vários álbuns sem cópias.
- Lançar galeria com fallback/migração gradual do acervo inicial.

**Aceite:** alterações nos álbuns aparecem localmente no público sem deploy; segurança de rascunhos validada.

## B6 — Segurança, auditoria, testes e liberação
- Testes automatizados backend e frontend (typecheck/build), autorização MIDIA/DEV/GESTAO, uploads simultâneos/interrompidos, R2 quota, orphan cleanup e exclusão com referências.
- Auditoria de publicação; restauração, concorrência, cache; sanitização de SVG/textos/HTML e imagens, restrição de arquivos.
- Primeira bateria de carga controlada em ambiente isolado conforme roadmap; gate final para 300–500 pessoas antes do evento permanece pendente.
- Checkpoints manuais: (1) biblioteca/8 uploads (2) editor zoom/recortes (3) cada seção (4) modos (5) galeria (6) regressão.
- Após aceite explícito: atualizar README, docs e continuidade nos dois repositórios, PRs da branch para main, revisar CI, merge, deploy Render/Workers na main e smoke em produção.

## Decisões pendentes de validação
- Direitos exatos de publicação de MIDIA vs GESTAO/DEV.
- Valores máximos de upload/lote, tamanhos mínimos por preset e formatos permitidos.
- Se patrocinadores deverão ter apenas logo ou também URL de destino (proposta: URL opcional).
