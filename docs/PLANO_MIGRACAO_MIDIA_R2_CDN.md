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
