# RasComp — Roadmap Pós-Projeto

Última revisão: **19/09/2026**

Este é o **único documento canônico para ordem de execução, prioridade, etapa atual e critério de conclusão** do ciclo pós-projeto do RasComp.

Se qualquer README, continuidade, dossiê, snapshot histórico ou documento de subsistema apresentar outra ordem, **este arquivo prevalece para planejamento**.

Documentos complementares:

- `docs/README.md` — índice e hierarquia documental;
- `docs/DOSSIE_PROJETO_RASCOMP.md` — arquitetura, domínio, decisões e riscos cross-repo;
- `docs/CONTRATO_REGRAS_COMPETITIVAS.md` — regras competitivas aprovadas;
- `docs/CONTINUIDADE_FRONTEND.md` — checkpoint vivo do frontend;
- backend `rascomp/docs/CONTINUIDADE.md` — checkpoint vivo do backend.

---

# 1. Estratégia do ciclo

O roadmap deixa de ser uma sequência de funcionalidades isoladas e passa a seguir **maturidade do produto**.

## PRIORIDADE 1 — Finalização e polimento do MVP

Objetivo: transformar o que já existe em um produto realmente utilizável, consistente, apresentável e administrável antes de ampliar o escopo.

Direção:

1. testar o sistema atual de verdade;
2. corrigir bugs e fluxos frágeis;
3. consolidar interfaces, responsividade e feedbacks;
4. fechar operações administrativas necessárias;
5. completar o domínio competitivo que ainda falta;
6. completar o Portal do Participante;
7. criar o mecanismo real de conteúdo/mídia;
8. consolidar Landing e Galeria;
9. validar o MVP completo.

## PRIORIDADE 2 — Adições, testes, portabilidade e preparação externa

Objetivo: ampliar o produto somente depois do MVP consolidado.

Direção:

1. comunicação IN_APP + Telegram;
2. portabilidade institucional;
3. regras, ajuda e segurança para participantes;
4. hardening e testes físicos em dispositivos;
5. validação final completa, inclusive permissões;
6. deploy como última etapa do ciclo.

---

# 2. Estado atual

ETAPA 0  ✅ CONCLUÍDA / VALIDADA — Baseline e congelamento da versão aprovada
ETAPA 1  ✅ CONCLUÍDA / VALIDADA — Correções de lógica e integridade
ETAPA 2  ✅ CONCLUÍDA / VALIDADA — Limpeza técnica e organização de código
ETAPA 3  ✅ CONCLUÍDA / VALIDADA — Nova matriz de permissões

PRIORIDADE 1 — FINALIZAÇÃO E POLIMENTO DO MVP
ETAPA 4  ⏳ PRÓXIMA / NÃO INICIADA — Consolidação funcional e polimento do MVP
ETAPA 5  ⏳ NÃO INICIADA — Ajustes Gerais DEV + auditoria
ETAPA 6  ⏳ NÃO INICIADA — Futebol de Robôs
ETAPA 7  ⏳ NÃO INICIADA — Portal do Participante completo + identificação competitiva
ETAPA 8  ⏳ NÃO INICIADA — Gestor de Mídia / CMS
ETAPA 9  ⏳ NÃO INICIADA — Landing + Galeria + conteúdo público real
ETAPA 10 ⏳ NÃO INICIADA — Validação e fechamento do MVP

PRIORIDADE 2 — ADIÇÕES, TESTES E PORTABILIDADE
ETAPA 11 ⏳ NÃO INICIADA — Avisos IN_APP + Telegram
ETAPA 12 ⏳ NÃO INICIADA — Portabilidade institucional
ETAPA 13 ⏳ NÃO INICIADA — Regras, Ajuda e Segurança
ETAPA 14 ⏳ NÃO INICIADA — Hardening + preparação para uso externo
ETAPA 15 ⏳ NÃO INICIADA — Validação final completa
ETAPA 16 ⏳ NÃO INICIADA — Deploy em nuvem / Cloudflare

**Próxima etapa autorizável: ETAPA 4. Ela ainda não deve ser considerada iniciada até confirmação explícita.**

---

# 3. Regras gerais do ciclo

- não criar roadmap paralelo;
- não pular etapas;
- não reescrever o projeto do zero;
- não quebrar o modo local;
- backend é a fonte de verdade do domínio e da autorização;
- mudanças devem ser pequenas, testáveis e reversíveis;
- migrations aplicadas nunca são reescritas;
- status só muda após implementação + validação + confirmação explícita;
- uma instalação do RasComp representa uma instituição organizadora neste ciclo;
- multi-tenancy permanece fora deste ciclo;
- o deploy é a última etapa operacional do roadmap.

---

# 4. Etapas concluídas

## ETAPA 0 — Baseline e congelamento da versão aprovada ✅

Preservou a versão funcional apresentada/aprovada, centralizou documentação e congelou a referência do ciclo.

## ETAPA 1 — Correções de lógica e integridade ✅

Consolidou Competition/Registration, Follow, Sumô, Chaves e fluxos integrados, incluindo proteção de estados, rollback, BYE, progressão, ausência no Follow, inspeção/rounds/juízes no Sumô e testes ponta a ponta de domínio.

Checkpoint histórico de fechamento: **111 testes verdes** + MySQL/Flyway V12/testdata.

## ETAPA 2 — Limpeza técnica e organização de código ✅

Removeu artefatos obsoletos, modularizou APIs/tipos do frontend de forma incremental e consolidou CSS administrativo sem refatoração big-bang.

## ETAPA 3 — Nova matriz de permissões ✅

Matriz consolidada:

- DEV — administração integral, usuários, sistema e operação competitiva;
- GESTAO — operação competitiva sem administração estrutural;
- MIDIA — identidade interna voltada à futura operação editorial;
- PARTICIPANTE — portal e recursos próprios.

Também foram consolidados:

- cadastro público sempre PARTICIPANTE;
- criação explícita de contas internas DEV/GESTAO/MIDIA por DEV;
- edição segura entre roles internas;
- proteção do último DEV ativo;
- separação entre conta institucional e conta participante;
- distinção líder x membro comum no Portal do Participante;
- autorização real no backend e UX compatível no frontend.

Checkpoint final conhecido: **135 testes verdes**, MySQL + Flyway V13 + testdata e frontend typecheck/build verdes.

---

# 5. PRIORIDADE 1 — Finalização e polimento do MVP

## ETAPA 4 — Consolidação funcional e polimento do MVP

**Objetivo:** provar que o RasComp atual funciona bem antes de adicionar novos módulos.

Executar uma revisão funcional e visual do produto existente:

- login, sessão e redirecionamento por perfil;
- Dashboard/Central da competição;
- usuários e contas internas;
- equipes, competidores, robôs e fotos;
- inscrições, aprovação, cancelamento e reativação;
- Follow Line completo;
- Sumô completo;
- chaves, BYE, agenda, progressão, correção e histórico;
- Portal do Participante atual, líder e membro;
- Landing/Galeria no estado atual;
- estados vazios, loading, erros e feedbacks;
- consistência de nomenclatura e textos;
- navegação e retorno entre fluxos;
- responsividade desktop/tablet/mobile;
- **otimização específica das interfaces para celular**, hoje ainda incompleta fora do login;
- adaptação de navegação, cards, tabelas, formulários, filtros, diálogos, ações e densidade visual para telas estreitas;
- evitar depender apenas de "encolher" o layout desktop: quando necessário, reorganizar a informação e as ações para uso por toque;
- bugs de viewport, overflow, tabelas, diálogos e formulários;
- uso com banco local reaproveitado e banco limpo quando aplicável.

Melhorias cabíveis nesta etapa são correções/polimentos que **não criam um novo grande domínio**.

### Diretriz mobile da ETAPA 4

O login já recebeu tratamento responsivo dedicado, mas isso **não significa que a aplicação autenticada esteja otimizada para celular**.

Estado conhecido antes do início da ETAPA 4:

```text
Login                         ✅ tratamento responsivo dedicado
Gestão / telas administrativas ⚠️ ainda precisam revisão sistemática
Portal do Participante         ⚠️ ainda precisa revisão sistemática
Tabelas / filtros / diálogos   ⚠️ precisam adaptação para telas estreitas
Landing pública                ⚠️ precisa validação dentro do fechamento do MVP
```

Na ETAPA 4, mobile deve ser tratado como parte do polimento do MVP, não como teste cosmético final. O objetivo é tornar os fluxos essenciais utilizáveis por toque e em telas estreitas.

A ETAPA 14 continua responsável pelos **testes físicos finais em smartphones/tablets**, usando aparelhos e navegadores reais para validar o que já deverá ter sido otimizado anteriormente.

Critério de saída:

- fluxos atuais percorridos manualmente;
- bugs encontrados classificados e corrigidos ou documentados;
- interfaces principais consolidadas;
- responsividade básica validada;
- principais telas de Gestão e Participante utilizáveis em larguras típicas de smartphone e tablet;
- nenhum fluxo essencial depende de viewport desktop para ser concluído;
- testes automatizados preservados/verdes;
- documentação atualizada;
- checkpoint prático aprovado.

## ETAPA 5 — Ajustes Gerais DEV + auditoria

**Objetivo:** oferecer manutenção administrativa segura sem criar editor genérico de banco.

Operações candidatas:

- transferir competidor;
- transferir robô;
- transferir responsabilidade de equipe;
- corrigir inscrição por operação explícita;
- reativar entidades quando a regra permitir;
- ativar/desativar usuários;
- operações excepcionais necessárias descobertas na ETAPA 4.

Ações críticas devem registrar, quando aplicável:

- quem;
- ação;
- entidade;
- antes/depois;
- data/hora;
- motivo/observação.

Não criar console SQL nem CRUD genérico de tabelas.

## ETAPA 6 — Futebol de Robôs

**Objetivo:** implementar a modalidade competitiva que ainda altera o domínio estrutural.

Ponto crítico já identificado:

- `Registration.robot` hoje é obrigatório;
- no Futebol os competidores usam robôs fornecidos/atribuídos pela organização;
- a relação com robô deve ser modelada corretamente por modalidade;
- não criar robô fictício apenas para satisfazer FK.

Antes da migration, fechar regras de equipe, atribuição de robôs, placar, duração, empate/desempate, formato, inspeção e penalidades.

## ETAPA 7 — Portal do Participante completo + identificação competitiva

**Objetivo:** transformar o portal atual em uma experiência realmente autônoma e prática para o competidor.

Completar/consolidar:

- convite/aceite ou fluxo equivalente de entrada em equipe;
- integrantes e papéis da equipe;
- robôs e fotos;
- inscrições permitidas;
- integração com Futebol;
- histórico e acompanhamento competitivo;
- diferença clara líder x membro;
- estados vazios/loading/erro;
- feedback de ações;
- responsividade e navegação mobile;
- código competitivo curto e único por Registration aprovada.

O identificador competitivo não substitui ownership, elegibilidade ou inspeção.

A comunicação/avisos não bloqueia o fechamento desta etapa; ela entra formalmente na ETAPA 11.

## ETAPA 8 — Gestor de Mídia / CMS

**Objetivo:** permitir alimentar o conteúdo público sem editar Vue nem realizar commit para cada mudança editorial.

Área editorial para MIDIA/DEV, com conceitos como:

- MediaAsset;
- ContentSlot;
- ContentItem;
- publicação/despublicação;
- ordem/destaque;
- créditos e metadados;
- imagens e mídia reutilizáveis.

Reutilizar `ObjectStorageService` + Cloudflare R2 quando aplicável. Não criar um terceiro mecanismo de upload.

Esta etapa é parte do MVP porque hoje a permissão MIDIA existe, mas o site ainda não possui fluxo real de alimentação editorial.

## ETAPA 9 — Landing + Galeria + conteúdo público real

**Objetivo:** consolidar a experiência pública usando API pública + CMS + mídia real.

Fechar definitivamente:

- conteúdo institucional real;
- notícias/destaques/publicações;
- diretoria/projetos/premiações/agenda/parceiros conforme escopo aprovado;
- galeria integrada ao fluxo editorial;
- consumo da API competitiva pública;
- navegação pública e responsividade.

Decisão preferencial atual: absorver a experiência de `photo-gallery/` na Landing, salvo necessidade real de aplicação/URL independente.

## ETAPA 10 — Validação e fechamento do MVP

**Objetivo:** declarar o MVP operacional somente depois de uma bateria manual completa da PRIORIDADE 1.

Simular de ponta a ponta:

- DEV, GESTAO, MIDIA e PARTICIPANTE;
- líder e membro comum;
- equipes, robôs e inscrições;
- Follow;
- Sumô;
- Futebol;
- chaves/BYE/progressão/resultados;
- Ajustes Gerais/auditoria;
- Portal do Participante;
- CMS/Mídia;
- Landing/Galeria/conteúdo público;
- responsividade em tamanhos representativos;
- cenários de erro e recuperação usuais.

Saída da etapa: **MVP funcional, coerente, utilizável e apresentável**.

---

# 6. PRIORIDADE 2 — Adições, testes e portabilidade

## ETAPA 11 — Avisos IN_APP + integração Telegram

**Objetivo:** criar comunicação operacional persistida no RasComp e entrega complementar pelo Telegram.

Fluxo base:

- DEV/GESTAO publica aviso por competição;
- backend persiste o aviso;
- participantes consultam o histórico IN_APP;
- quando habilitado, serviço backend distribui também pelo Telegram;
- falha do Telegram nunca apaga/invalida o aviso persistido.

Regras:

- IN_APP é a fonte oficial;
- Telegram é complementar e desligável;
- token somente por segredo/variável de ambiente;
- frontend nunca chama Bot API diretamente;
- evitar envio duplicado;
- tratar timeout/rate limit;
- identificação individual via Telegram é opcional e pode reutilizar o código competitivo da Registration.

## ETAPA 12 — Portabilidade institucional

**Objetivo:** permitir instalar backend + gestão para outra instituição sem editar Java/Vue apenas para trocar identidade básica.

Modelo:

- uma instalação = uma instituição organizadora;
- configuração própria da instância, sem reutilizar Institution de equipes;
- nome, logos, contatos, links e identidade institucional configuráveis;
- fluxo limpo de primeiro DEV;
- documentação de instalação/upgrade;
- multi-tenancy fora deste ciclo.

## ETAPA 13 — Regras, Ajuda e Segurança

**Objetivo:** transformar o antigo 'Módulo de Regras' em uma central útil de orientação ao participante.

Conteúdo previsto:

- regras oficiais de Follow;
- regras oficiais de Sumô, RC, penalidades e WO;
- regras oficiais de Futebol;
- medidas e requisitos físicos relevantes;
- segurança, ambiente e vestimenta;
- ajuda por modalidade;
- dúvidas frequentes;
- orientação contextual dentro do portal quando útil.

Separar claramente:

- regra editorial/publicada;
- regra executável pelo backend;
- orientação/ajuda.

Não inventar sanções nem publicar texto não validado oficialmente.

## ETAPA 14 — Hardening + preparação para uso externo

**Objetivo:** endurecer o produto já completo antes da validação final.

Revisar sistematicamente:

- autorização endpoint a endpoint;
- erros, logs e auditoria;
- CORS e segredos;
- upload/storage;
- migrations do zero e upgrade sobre banco existente;
- backup/restore;
- primeiro DEV;
- instalação/upgrade;
- testdata bloqueado em produção;
- hardcodes institucionais remanescentes;
- acessibilidade;
- responsividade;
- falhas de API/Telegram/R2;
- concorrência crítica e rollback administrativo.

### Testes físicos em smartphones/tablets

Adicionar explicitamente testes reais pela rede local ou ambiente de teste:

- Android e iOS quando disponíveis;
- diferentes larguras/alturas e orientação;
- Chrome/Safari quando disponíveis;
- login e sessão;
- formulários, tabelas, diálogos e navegação;
- Portal do Participante;
- Gestão nas telas que fizerem sentido em mobile;
- Landing pública;
- chamadas reais ao backend usando IP/host acessível pelo dispositivo.

DevTools continuam úteis, mas não substituem o teste físico final.

## ETAPA 15 — Validação final completa

**Objetivo:** executar a bateria final do produto consolidado antes do deploy.

Inclui:

- instalação/configuração limpa;
- competição completa;
- todos os módulos da Prioridade 1 e 2;
- falhas e recuperação;
- uso concorrente representativo;
- instalação com identidade institucional alternativa;
- mobile real;
- smoke de storage/integradores.

### Validação final de permissões

Repetir a matriz completa sobre o produto final:

- DEV;
- GESTAO;
- MIDIA;
- PARTICIPANTE líder;
- PARTICIPANTE membro comum;
- rotas frontend;
- autorização HTTP real;
- acesso direto por URL/API;
- criação/edição/desativação de contas internas;
- proteção do último DEV ativo;
- isolamento entre identidade institucional e participante;
- acesso aos módulos adicionados depois da ETAPA 3.

Essa validação substitui o antigo checkpoint separado 'ETAPA 13.5'.

## ETAPA 16 — Deploy em nuvem / Cloudflare

**Objetivo:** implantar somente o produto que passou pelas validações anteriores, preservando o modo local.

Arquitetura planejada:

- Cloudflare DNS/TLS;
- Workers Static Assets para frontends quando adequado;
- backend Spring Boot em runtime/container compatível;
- R2 para mídias/uploads persistentes;
- secrets fora do repositório;
- MySQL gerenciado externo;
- CI/CD.

Cloudflare D1 não é requisito do primeiro deploy.

**O deploy é a última etapa do roadmap e só começa depois da ETAPA 15 ser concluída/validada.**

---

# 7. Ordem oficial

ETAPA 0  Baseline ✅
ETAPA 1  Lógica e integridade ✅
ETAPA 2  Limpeza técnica ✅
ETAPA 3  Matriz de permissões ✅

PRIORIDADE 1
ETAPA 4  Consolidação funcional e polimento do MVP
ETAPA 5  Ajustes Gerais DEV + auditoria
ETAPA 6  Futebol de Robôs
ETAPA 7  Portal do Participante completo
ETAPA 8  Gestor de Mídia / CMS
ETAPA 9  Landing + Galeria + conteúdo público real
ETAPA 10 Validação e fechamento do MVP

PRIORIDADE 2
ETAPA 11 Avisos IN_APP + Telegram
ETAPA 12 Portabilidade institucional
ETAPA 13 Regras, Ajuda e Segurança
ETAPA 14 Hardening + testes físicos mobile
ETAPA 15 Validação final completa + permissões
ETAPA 16 Deploy Cloudflare

---

# 8. Critério para concluir qualquer etapa

Conforme aplicável:

- regra/objetivo definidos;
- backend implementado;
- migration nova quando necessária;
- testes automatizados relevantes;
- frontend integrado;
- permissões corretas;
- tratamento de erro;
- documentação atualizada;
- validação local/prática;
- CI verde;
- validação explícita do checkpoint.

Não marcar uma etapa como concluída por commit parcial ou apenas porque uma tela apareceu.

---

# 9. Protocolo de continuidade

Ao continuar o RasComp:

1. ler `docs/README.md`;
2. conferir a etapa atual neste arquivo;
3. ler `docs/DOSSIE_PROJETO_RASCOMP.md`;
4. se tocar competição, ler `docs/CONTRATO_REGRAS_COMPETITIVAS.md`;
5. ler a continuidade do repositório afetado;
6. confirmar o estado real no código;
7. trabalhar somente na etapa autorizada;
8. implementar backend primeiro quando houver regra de negócio/segurança;
9. adicionar/ajustar testes;
10. integrar frontend;
11. validar e atualizar documentação;
12. parar no checkpoint e aguardar confirmação.

Se houver conflito de **ordem de execução**, este arquivo é a autoridade.