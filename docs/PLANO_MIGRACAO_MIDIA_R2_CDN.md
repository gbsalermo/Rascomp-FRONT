# Migração de mídia para R2/CDN — planejamento frontend

Estado: PLANEJADO. Sem implementação, publicação ou merge.

Documento canônico, incluindo segurança, backend, rollout e critérios de aceite: [Plano de migração no backend](https://github.com/gbsalermo/Rascomp/blob/feat/futebol-inscricao-sem-robo/rascomp/docs/PLANO_MIGRACAO_MIDIA_R2_CDN.md).

## Pré-requisito obrigatório: backup de produção
Antes de qualquer deploy ou migração, executar e validar o backup consistente de MySQL/Aiven, objetos R2 públicos e privados, conteúdo editorial publicado e rascunhos, versões das aplicações e configuração sensível armazenada com segurança. Exigir **restauração testada em ambiente isolado** e estratégia de rollback que **não sobrescreva inscrições, partidas ou resultados novos** da competição em andamento. O procedimento detalhado está no plano canônico do backend. Apenas documentado nesta etapa; backup ainda **não executado**.

## Escopo frontend previsto
1. Gestão de Mídia: substituir `mediaApi.image(id)` com carregamento integral via Render por URLs GET temporárias autorizadas para imagens não publicadas. Carregar miniaturas de forma preguiçosa; baixar resolução completa só durante enquadramento/ajuste. Exibir tratamento claro de expiração/indisponibilidade e revalidar URLs sem loop de chamadas.
2. Landing: Hero, Sobre, Eventos, competição e galerias devem consumir URLs de mídia pública CDN/R2 versionadas, com reserva de espaço das imagens (aspect-ratio) para evitar saltos de layout e carregamento tardio.
3. Galeria: usar CDN para capa/destaques e álbuns; corrigir excesso de preloads; assegurar que retirar publicação remova acesso público com estratégia de invalidação de cache.
4. Preservar publicações antigas e referências por ID durante rollout; nenhum arquivo privado ou comprovante deve ser exibido por URL pública.
5. Validar desktop/mobile, compatibilidade com prévia do CMS, build `build:cloud`, falhas da API, CORS e memória no Render.

## Condição de execução
Implementar somente após definição dos namespaces público/privado, domínio de mídia, configuração de cache, autorização de acesso temporário e plano de rollback com o backend. Permanecer na branch `feat/futebol-inscricao-sem-robo`; não fazer merge antes da validação conjunta.

## Revisão para encerramento do MVP — Galeria independente

- **Decisão:** aplicação Vue 3 + Vite exclusiva de fotos e vídeos em Cloudflare Pages, proposta `galeria.rasufrb.site`; manter estilo da Galeria atual e botão da Landing como link externo. Público navega sem login; administração reaproveita autenticação RasComp com autorização própria e separada.
- **Separação:** armazenamento/distribuição R2/CDN; backend Render somente autenticação/autorização e responsabilidades do sistema de competição, não transferência de fotos. Estudar Worker + D1 para metadados da Galeria, uploads seguros e publicação. Custo, políticas e segurança devem ser validados antes da implementação.
- **Sequência de trabalho:** (0) backup mínimo verificável antes de publicar alterações da competição atual; (1) suspender temporariamente upload/edição da Galeria antiga com bloqueio reversível, sem remover visualização pública ou editor de seções; (2) concluir e testar Futebol sem robô e Regras e Ajuda/manuais na branch atual; (3) publicar apenas com janela e monitoramento; (4) backup completo e restauração isolada antes da nova arquitetura; (5) construir, migrar e testar nova Galeria; (6) redirecionar botão e rota legada, preservar rollback.
- **Escopo preservado no RasComp:** editor de Hero, Sobre, Eventos, Competição e imagens essenciais da Landing; migrar entrega de suas imagens para acesso direto autorizado/CDN quando pertinente.
- **Aceite:** não apagar acervo, compatibilidade de links, testes de build, segurança de administração e publicação, nenhuma dependência da Galeria durante operações de competição.

**Status: somente planejamento.** Nenhuma suspensão, migração, configuração DNS ou deploy executado.

## Estado da contenção pré-lote
**Implementado apenas na branch:** rota pública `/galeria` agora apresenta manutenção sem consumir a API de galeria; seção Galeria removida temporariamente da Landing; rotas administrativas `/midia` e `/midia/albuns` redirecionam a `/midia/landing` (edição das seções preservada). Carregamento do acervo limitado a duas imagens simultâneas. **Não implementado:** URLs diretas CDN/R2 para as seções, estratégia de miniaturas e desligamento completo da API legada. **Não publicado em produção; builds precisam ser validados.**


## DECISÃO DE ESCOPO — MVP V1 ENCERRADO / GALERIA V2.0 (15/10/2026)

**Decisão atual, prevalece sobre cronogramas anteriores:** o MVP V1 do RasComp fica limitado à operação da competição, inscrições (incluindo Futebol), gestão, regras/manuais do participante e Landing institucional. A **Galeria independente de fotografias e vídeos deixa de ser requisito do MVP V1**. A implementação da nova Galeria, extração do acervo e mudança para `galeria.rasufrb.site` serão tratadas **depois da competição**, em uma **feature/branch própria de V2.0**, com planejamento, testes, backup e migração sem perda de acervo.

**Até a V2.0:** manter a **prévia institucional da Galeria na Landing**, sem link no cabeçalho e sem acesso à Galeria completa; manter ocultas as entradas Biblioteca/Álbuns da Gestão. Preservar o editor das seções (Heroes, Sobre, Eventos etc.) e os arquivos operacionais de robôs, comprovantes e logos. Não apagar dados, objetos R2 nem tabelas legadas da Galeria. Contenção de memória já aplicada permanece, e a estabilidade do Render/inscrições continua prioridade operacional da V1.

**V2.0 planejada, não iniciada:** frontend Vue/Vite em Cloudflare Pages, R2/CDN para fotos/vídeos, autenticação administrativa reaproveitada do RasComp, metadados/álbuns em camada própria conforme validação de arquitetura. Nenhum deploy, agendamento automático ou migração de acervo decorre desta decisão documental.
