# Roadmap funcional — Gestão de Mídia e Galeria

**Revisão:** 13/10/2026 | **Branch:** `v1-pos-cloud-gestao-midia` | **Estado:** planejamento, não implementado.

## Decisões consolidadas
- **Construir PRIMEIRO as duas interfaces**: Gestão de Mídia (administração) e Galeria (consulta pública), com navegação, layout, responsividade, estados vazios e dados fictícios locais. Após validar visualmente, integrar cada capacidade por vez.
- **Não existe alternância global institucional/competitivo.** A Landing permanece com suas seções institucionais; a seção **Competição** terá seu próprio editor e poderá habilitar/adicionar **Hero competitivo na Intro**. Exibição de competição permanece independente da existência de competição vigente; não mostrar dados por acidente. Dados oficiais competitivos são controlados pela Gestão competitiva.
- Textos institucionais estáveis, especialmente **Sobre**, identidade visual e estrutura geral do Footer, permanecem no código; **Sobre** permite trocar foto e enquadramento. Patrocinadores: logos, ordem, enquadramento e link opcional, sem editor genérico de texto.
- Biblioteca simples de **todas as fotos**; fotos podem estar sem álbum e pertencer a múltiplos álbuns, sem duplicação física de arquivo. A Galeria consome o mesmo acervo, mas mostra apenas o que está publicado.
- Editor contextual de imagens semelhante aos ajustes de rótulos do SGL: **largura/altura controladas pelo componente, zoom, posição X/Y, recorte e prévia mobile/desktop**; preservar original e armazenar configuração por uso/slot.
- Desenvolvimento e testes exclusivamente locais/isolados; aprovação explícita; documentação sincronizada; PR/merge na `main`; depois deploy e smoke em produção.

## Etapa 0 — Auditoria rápida e contratos mínimos
1. Inventariar UI atual da Landing e da Galeria (`photo-gallery/`), imagens em `landing-page/public/media/assets/`, `HOME_MEDIA` e APIs existentes.
2. Definir navegação da Gestão de Mídia: **Visão geral, Biblioteca, Álbuns, Seções da Landing (Hero/Sobre/Equipe/Robôs/Eventos/Patrocinadores/Competição), Publicações**; sem controles globais de modo.
3. Registrar contratos mínimos de `MediaAsset`, `Album`, `AlbumMedia`, `ContentSlot` e permissões (DEV/MIDIA, GESTAO conforme autorização explícita).
**Aceite:** mapa das duas interfaces, limites editáveis e contratos sem migração prematura.

## Etapa 1 — Interfaces primeiro (checkpoint visual)
**Gestão de Mídia:** layout com menu, Biblioteca em grid, visão de Álbuns, painel de upload em lote, seleção de foto, estados vazios/loading/erro, editor de enquadramento e entradas das seções editoriais; dados locais simulados.
**Galeria pública:** grade de álbuns, capa, navegação pelo álbum, visualização ampliada, filtros e apresentação responsiva; conteúdo demonstrativo local.
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
1. Hero/Intro — fotos, ordenação e enquadramento; suporte a hero competitivo habilitável.
2. Sobre — **somente foto e enquadramento**.
3. Equipe/Conquistas — imagens editoriais, conquistas e fotos, respeitando fontes oficiais.
4. Robôs — apresentação de fotos, sem duplicar cadastros do domínio.
5. Eventos/Publicações — dados dinâmicos, imagens, datas e publicação, reaproveitando eventos existentes.
6. Patrocinadores — logos, ordenação, dimensões/zoom e links opcionais; apoiadores institucionais separados.
7. **Competição** — editor da apresentação da seção, escolha/configuração do hero competitivo na Intro, sem alterar o status, regra, inscrições e resultados oficiais.
- Publicação intencional, prévia e rollback por versão; Landing pública busca somente conteúdo publicado via API com fallback controlado.
**Aceite:** mudar conteúdo na Gestão local e verificar na Landing local **sem recompilar**, seção por seção.

## Etapa 5 — Galeria real conectada ao acervo
- Substituir dados fictícios por álbuns/fotos publicados da biblioteca persistente; capa, ordem, filtros, fotos compartilhadas entre álbuns.
- Não exibir imagens sem publicação; integração pública somente leitura.
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

**Próximo passo:** Etapa 0 mínima seguida da Etapa 1, priorizando interfaces. Não começar por migrações ou regras de modo institucional/competitivo.
