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
ETAPA 4  🚧 EM ANDAMENTO — Consolidação funcional e polimento do MVP — BLOCO 3 implementado / aguardando validação
ETAPA 5  ⏳ NÃO INICIADA — Ajustes Gerais DEV + auditoria
ETAPA 6  ⏳ NÃO INICIADA — Futebol de Robôs
ETAPA 7  ⏳ NÃO INICIADA — Portal do Participante completo + identificação competitiva
ETAPA 8  ⏳ NÃO INICIADA — Gestor de Mídia / CMS
ETAPA 9  ⏳ NÃO INICIADA — Landing + Galeria + conteúdo público real
CHECKPOINT MOBILE ⏳ NÃO INICIADO — Otimização Mobile do MVP
ETAPA 10 ⏳ NÃO INICIADA — Validação e fechamento do MVP

PRIORIDADE 2 — ADIÇÕES, TESTES E PORTABILIDADE
ETAPA 11 ⏳ NÃO INICIADA — Avisos IN_APP + Telegram
ETAPA 12 ⏳ NÃO INICIADA — Portabilidade institucional
ETAPA 13 ⏳ NÃO INICIADA — Regras, Ajuda e Segurança
ETAPA 14 ⏳ NÃO INICIADA — Hardening + preparação para uso externo
ETAPA 15 ⏳ NÃO INICIADA — Validação final completa
ETAPA 16 ⏳ NÃO INICIADA — Deploy em nuvem / Cloudflare

**Etapa atual: ETAPA 4 — EM ANDAMENTO. BLOCO 1 e BLOCO 2 concluídos e validados; BLOCO 3 — Operação competitiva com 3A/3B/3C implementados e aguardando validação manual final. Não avançar para a ETAPA 5 sem confirmação explícita.**

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
- comportamento atual de esquecimento/recuperação de senha, sem simular envio enquanto o fluxo seguro ainda não existir;
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
- bugs de viewport, overflow, tabelas, diálogos e formulários;
- uso com banco local reaproveitado e banco limpo quando aplicável.

Melhorias cabíveis nesta etapa são correções/polimentos que **não criam um novo grande domínio**.

### Relação da ETAPA 4 com o eixo mobile

A ETAPA 4 pode revelar e corrigir problemas de responsividade encontrados durante o polimento, mas **não é definida nem encerrada exclusivamente pelo trabalho mobile**.

A otimização mobile possui um checkpoint transversal próprio na PRIORIDADE 1, descrito abaixo, e deve evoluir junto com as telas alteradas nas ETAPAS 4, 7, 8 e 9 antes do fechamento do MVP na ETAPA 10.

Critério de saída:

- fluxos atuais percorridos manualmente;
- bugs encontrados classificados e corrigidos ou documentados;
- interfaces principais consolidadas;
- responsividade básica validada;
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

# CHECKPOINT TRANSVERSAL — Otimização Mobile do MVP

**Natureza:** entrega transversal da PRIORIDADE 1, sem criar uma nova numeração artificial de etapa.

**Objetivo:** garantir que o MVP seja realmente utilizável em celular/tablet e não apenas um layout desktop que encolhe.

Estado conhecido ao criar o checkpoint:

```text
Login                         ✅ tratamento responsivo dedicado
Shell administrativo          ⏳ revisar
Dashboard/Central             ⏳ revisar
Usuários                      ⏳ revisar
Inscrições                    ⏳ revisar
Follow                        ⏳ revisar
Sumô / Chaves                 ⏳ revisar
Portal do Participante        ⏳ revisar
Tabelas / filtros / diálogos  ⏳ revisar
Landing pública               ⏳ revisar
CMS/Mídia                     ⏳ revisar quando existir
```

Fluxo lógico:

```text
ETAPA 4
→ identificar/corrigir quebras e gargalos mobile do sistema atual

ETAPA 7
→ Portal do Participante nasce/consolida já responsivo

ETAPA 8
→ CMS/Mídia deve ser utilizável em telas menores quando fizer sentido operacional

ETAPA 9
→ Landing/Galeria devem fechar responsividade pública

CHECKPOINT MOBILE
→ consolidar o conjunto
→ validar que os fluxos essenciais funcionam em smartphone/tablet

ETAPA 10
→ só fecha o MVP com esse checkpoint concluído

ETAPA 14
→ revalidação física/hardening em aparelhos reais
```

Critérios do checkpoint:

- navegação utilizável por toque;
- menus e shell adaptados;
- cards e métricas reorganizados quando necessário;
- tabelas substituídas/transformadas quando não couberem em telas estreitas;
- filtros e ações sem overflow;
- formulários e diálogos utilizáveis sem zoom manual;
- textos e densidade visual adequados;
- nenhum fluxo essencial do participante depende de desktop;
- telas administrativas críticas mantêm operação segura em mobile quando fizer sentido;
- Landing e conteúdo público responsivos;
- orientação portrait e landscape considerada quando relevante.

Este checkpoint deve estar **concluído antes da ETAPA 10 — Validação e fechamento do MVP**.

A ETAPA 14 não cria a experiência mobile; ela apenas faz a validação física final e o hardening do que já foi construído.

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

### Recuperação e redefinição segura de senha

A ETAPA 13 também deve fechar o tratamento definitivo de credenciais e recuperação de acesso.

Validar e implementar:

- alteração de senha por usuário autenticado, exigindo confirmação adequada da credencial atual quando aplicável;
- fluxo de "esqueci minha senha" para usuário não autenticado;
- solicitação de recuperação sem revelar se o e-mail informado existe ou não;
- token/código de recuperação de uso único e expiração curta;
- invalidação de tokens antigos após nova solicitação ou redefinição concluída;
- armazenamento seguro do token de recuperação, sem persistir o segredo reutilizável em texto puro;
- nova senha respeitando a política de senha vigente;
- encerramento/invalidação das sessões anteriores quando a senha for redefinida, conforme decisão de segurança validada;
- proteção contra abuso/repetição excessiva da solicitação;
- canal real de entrega da recuperação, preferencialmente e-mail configurável, sem acoplar o domínio a um fornecedor específico;
- feedback de sucesso/erro que não permita enumeração de contas;
- recuperação assistida pelo DEV como fallback para casos excepcionais: após solicitação do usuário e verificação de identidade pela organização, o DEV pode emitir uma credencial temporária de uso único ou curta duração;
- a credencial temporária deve expirar, ser invalidada após o primeiro uso e obrigar o usuário a cadastrar e confirmar uma nova senha antes de continuar;
- a senha definitiva deve ser definida somente pelo usuário e nunca ficar visível para o DEV;
- a emissão de credencial temporária deve ser auditada com responsável, usuário afetado, data/hora e motivo;
- o fluxo assistido não substitui a recuperação automática; o caminho preferencial continua sendo recuperação direta por canal configurável, como e-mail;
- testes automatizados dos casos de expiração, reutilização, conta inativa e token inválido.

Na ETAPA 4, a responsabilidade é apenas garantir que a interface atual não prometa um fluxo inexistente e registrar a pendência. A implementação definitiva fica nesta ETAPA 13 para ser revisada novamente no hardening da ETAPA 14 e exercitada na validação final da ETAPA 15.

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
CHECKPOINT MOBILE  Otimização Mobile do MVP
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

---

## Checkpoint de início da ETAPA 4 — 22/09/2026

A ETAPA 4 foi autorizada e iniciada em branch própria nos dois repositórios:

```text
etapa-4-consolidacao-mvp
```

Execução aprovada:

```text
BLOCO 1 — Baseline + autenticação + Shell + UX global          ✅ CONCLUÍDO
BLOCO 2 — Gestão administrativa                               ✅ CONCLUÍDO / VALIDADO
BLOCO 3 — Operação competitiva                                🧪 IMPLEMENTADO / AGUARDANDO VALIDAÇÃO
BLOCO 4 — Portal do Participante                              ⏳
BLOCO 5 — Landing/Galeria atuais                              ⏳
BLOCO 6 — Regressão integrada + documentação                  ⏳
```

Subordem do BLOCO 1:

1. baseline técnico e saneamento de resíduos temporários;
2. autenticação/sessão/redirecionamento;
3. Shell administrativo e navegação global;
4. UX compartilhada e responsividade básica das interfaces globais;
5. regressão do bloco + validação prática.

A ETAPA 5 permanece bloqueada até fechamento e validação explícita da ETAPA 4.


---

## Checkpoint prático parcial do BLOCO 1 — 22/09/2026

A primeira validação manual encontrou regressões e oportunidades reais de polimento.

Correções incorporadas ao BLOCO 1:

- `Lembrar de mim` passa a preservar o e-mail sem armazenar senha;
- Shell responsivo corrigido para não deslocar conteúdo ao cruzar o breakpoint;
- menu mobile força sidebar expandida e fecha corretamente ao retornar ao desktop;
- navegação reorganizada com Operação ao vivo priorizada;
- Configurações retirada do menu enquanto não existir configuração própria útil;
- sessão simultânea tratada com política de uma sessão ativa por conta;
- V14 introduz `user_accounts.session_version`;
- novo login invalida sessão anterior;
- logout invalida a sessão no backend.

Checkpoint automatizado após as correções:

```text
Frontend Checks #91 ✅ typecheck + build
Backend Tests #325  ✅ 142 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V14 + testdata ✅
```

Itens registrados para revisão interface por interface no BLOCO 2:

- Dashboard: hierarquia, ocupação da viewport, cards acionáveis e atividade recente ampliada;
- redefinir o significado do progresso do evento;
- sincronização da competição em foco como filtro default;
- regra de escopo: DEV alterna edições; GESTAO opera apenas a edição vigente, com backend como fonte de verdade;
- Usuários: separar Participantes de Organização/Diretoria;
- edição de dados cadastrais de participante sem conversão de role;
- revisão de Partidas para representar tomadas de Follow e batalhas de Sumô;
- Resultados orientado a vencedores por categoria;
- revisão sistemática de cada interface, sequência de ações, nomenclaturas, responsividade e densidade visual.

O BLOCO 1 foi validado pelo usuário e está formalmente concluído. O próximo passo é o BLOCO 2 — Gestão administrativa.


### Checkpoint manual complementar do BLOCO 1 — 22/09/2026

Reteste do usuário:

```text
Lembrar de mim                                  ✅ validado
Breakpoint desktop → reduzido → desktop         ✅ sem regressão aparente
Menu mobile em janela reduzida                  ✅
Organização/ícones da navegação                 ✅ aprovada
Recuperação de senha                            ⚠️ texto ajustado por UX
Sessão única em dois navegadores                ✅ validada
Logout                                          ✅ validado
Celular físico                                  ⏳ conexão/bug intermitente pendente
```

O problema observado em aparelho físico, que deixou de conseguir acessar o servidor após a desconexão, não reproduziu na janela responsiva do desktop. Ele permanece registrado no CHECKPOINT MOBILE e deverá ser revalidado em aparelho real antes do fechamento do MVP, além da bateria física da ETAPA 14.


---

## Fechamento formal do BLOCO 1 — 22/09/2026

O BLOCO 1 da ETAPA 4 foi validado pelo usuário e está concluído.

Escopo encerrado:

- baseline técnico;
- login válido/inválido;
- `Lembrar de mim`;
- logout;
- sessão única;
- redirecionamento e expiração de sessão;
- Shell administrativo;
- navegação global;
- reorganização inicial do menu;
- responsividade básica do Shell;
- recuperação de senha tratada de forma não enganosa;
- documentação e roadmap sincronizados.

Checkpoint automatizado final:

```text
Frontend Checks #97 ✅ typecheck + build
Backend Tests #329  ✅ 142 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V14 + testdata ✅
```

Checkpoint manual:

```text
Login válido/inválido              ✅
Lembrar de mim                      ✅
Logout                              ✅
Sessão única em dois navegadores    ✅
Shell desktop                       ✅
Transição desktop ↔ reduzido        ✅
Menu mobile em viewport reduzida    ✅
Nova organização da navegação       ✅
Recuperação de senha                ✅
```

Pendência transversal preservada, sem bloquear o fechamento do bloco:

- comportamento intermitente em aparelho físico, incluindo perda de acesso ao servidor após desconexão;
- não reproduzido em viewport reduzida no desktop;
- manter no CHECKPOINT MOBILE e revalidar em dispositivo físico antes da ETAPA 10 e novamente na ETAPA 14.

Próximo passo:

```text
BLOCO 2 — Gestão administrativa
→ começar pelo Dashboard/Central
→ depois revisar interface por interface
```


---

## Início do BLOCO 2 — 22/09/2026

BLOCO 2 autorizado e iniciado.

Ordem desta revisão:

```text
2.1 Dashboard / Central ✅ validado
2.2 Competições e contexto da edição ✅ implementação consolidada / regressão pendente no fechamento
2.3 Usuários e permissões administrativas ✅ validado
2.4 Equipes / competidores / robôs / fotos / modalidades ✅ validado
    - criar visão administrativa própria de Competidores;
    - permitir navegar Equipe → Competidores;
    - detalhe do competidor deve mostrar equipe e participações/inscrições;
    - robôs relacionados ao competidor devem ser derivados das inscrições em que ele participa, pois o domínio atual não possui Competitor → Robot direto;
2.5 Inscrições / cancelamentos / reativação ✅ validado
```

A revisão será feita interface por interface, preservando backend como fonte de verdade e transformando achados funcionais em testes quando aplicável.

Primeiro alvo: Dashboard/Central, com foco em:

- melhor ocupação da viewport;
- prioridade ao que exige ação da gestão;
- cards de dados também funcionando como atalhos;
- remoção/redefinição de métricas ambíguas;
- atividade recente mais útil;
- sincronização com a competição em foco;
- responsividade da própria tela.


### Pendência estrutural — Agenda unificada da competição

O Dashboard revelou que "agenda" não pode ser sinônimo de partidas de Sumô.

No domínio atual:

```text
Sumô
→ Match
→ dataHora / pista / ordemExecucao / statusConvocacao

Follow Line
→ tomada existe como conceito competitivo
→ NÃO existe agenda/horário/pista/ordem para a tomada
```

Decisão de planejamento:

- a agenda da competição deve representar atividades competitivas de todas as modalidades;
- Sumô deve expor batalhas/partidas agendadas;
- Follow Line deve expor tomadas de tempo agendadas por categoria;
- uma tomada do Follow é uma atividade coletiva da categoria, não uma "partida" individual;
- o Dashboard deve consumir uma visão unificada de próximas atividades;
- enquanto a agenda do Follow não existir, não rotular a lista parcial de Sumô como "Agenda da competição".

Alocação:

- modelagem e operação da agenda competitiva unificada entram no **BLOCO 3C — Chaves / Agenda / Resultados**, pois afetam o domínio operacional;
- o Dashboard da 2.1 será reconciliado com essa agenda quando o contrato estiver disponível;
- não criar entidade de agenda duplicada apenas para satisfazer o Dashboard.

### Pendência funcional — Gestão de competidores

O backend já possui `CompetitorController`/`CompetitorService`, incluindo listagem geral, por equipe, busca por id, atualização, desativação e reativação.

O frontend administrativo ainda não possui tela própria de Competidores.

Tratar no **BLOCO 2.4**:

- item/rota própria "Competidores";
- listagem por competição/equipe quando aplicável;
- busca e filtro;
- detalhe do competidor;
- equipe atual;
- instituição;
- contato;
- conta PARTICIPANTE vinculada quando existir;
- situação ativo/inativo;
- inscrições em que participa;
- robô(s) utilizados nessas inscrições;
- acesso Equipe → ver competidores;
- acesso Competidor → ver equipe e participações.

Importante: no modelo atual o competidor pertence diretamente à equipe, mas não possui um robô próprio. A relação Competidor ↔ Robot ocorre através da Registration. A interface não deve inventar ownership direto de robô.


### Agenda competitiva — contrato funcional definido

A agenda deve representar chamadas competitivas reais, e não apenas partidas de Sumô.

#### Follow Line

A unidade de agenda é uma **chamada geral de tomada**:

```text
Categoria
→ Tomada N
→ data/hora
→ pista
→ ordem/posição na agenda
→ estado da chamada
```

Dentro dessa chamada geral, as inscrições/robôs da categoria são convocados individualmente para executar sua tomada.

Fluxo operacional esperado:

```text
Tomada 1 — 09:00 — Pista A
→ chamar inscrição/robô 1
→ executa tentativa(s) da tomada
→ chamar inscrição/robô 2
→ ...
→ inscrição não comparece à sua convocação
→ registrar ausência da tomada
→ aplicar a consequência já prevista para perda da tomada
```

A ausência continua sendo registrada no domínio competitivo da tomada, não como partida fictícia.

#### Sumô

A unidade agendada é a **batalha/partida** (`Match`).

Os rounds são internos à partida e não precisam, por padrão, de horário individual na agenda.

#### Onde a agenda será criada e operada

A implementação deve possuir três pontos complementares:

1. **Operação ao vivo → Agenda**
   - visão unificada de todas as atividades;
   - Follow + Sumô no mesmo calendário/lista;
   - data/hora, pista, ordem e estado;
   - filtros por modalidade/categoria/pista;
   - principal lugar para organizar/reordenar a programação.

2. **Follow Line → categoria/tomada**
   - criar/editar a chamada da tomada;
   - definir data/hora, pista e ordem;
   - visualizar fila de inscrições/robôs;
   - convocar individualmente;
   - registrar ausência da tomada quando aplicável.

3. **Sumô / Partidas**
   - editar agenda da batalha;
   - data/hora, dohyo/pista, ordem e convocação;
   - rounds continuam dentro da batalha.

O Dashboard apenas consumirá a visão unificada de próximas atividades. Ele não será o local principal de edição da agenda.

A implementação estrutural continua alocada no **BLOCO 3C — Chaves / Agenda / Resultados**.


### Checkpoint 2.2 — competição vigente

Implementação concluída e aguardando validação prática.

Regra:

```text
DEV
→ administra todas as edições
→ escolhe competição em foco
→ cria/edita/desativa/reativa

GESTAO
→ enxerga somente a competição vigente
→ não troca edição
→ não cria nem edita estrutura da edição
→ opera o ciclo da vigente
```

Resolução da vigente pelo backend:

```text
DEV define explicitamente qual edição é VIGENTE
→ escolha persistida no backend
→ GESTAO recebe exatamente essa edição
→ status não escolhe automaticamente outra edição
```

Ações operacionais explícitas:
- abrir inscrições;
- encerrar inscrições;
- iniciar competição;
- finalizar competição;
- prorrogar/reabrir inscrições quando permitido.

Proteção de acesso histórico e aplicação da mesma regra aos recursos internos será consolidada progressivamente em 2.4/2.5 e nos blocos competitivos usando `CompetitionContextService`.


#### Correção após validação da 2.2

A validação prática mostrou que "vigente" não deve ser inferida pelo status.

Decisão final:

- DEV define explicitamente a edição vigente;
- essa escolha é global e persistida;
- ao DEV usar a ação explícita **Definir vigente**, GESTAO passa a receber aquela edição; trocar apenas o foco local do DEV não altera o contexto da GESTAO;
- criar uma edição nova não troca a vigente automaticamente;
- a troca é uma ação explícita do DEV;
- V15 adiciona `competitions.vigente`;
- a migration inicializa um contexto compatível para bancos existentes, mas depois a escolha é explícita;
- GESTAO não pode finalizar oficialmente a competição;
- finalização é DEV-only;
- GESTAO pode abrir inscrições, encerrar inscrições e iniciar a competição vigente;
- quando a edição está `EM_ANDAMENTO`, GESTAO não recebe ação de finalização.

Próxima migration estrutural após essa decisão: V16+.


#### Semântica final — foco x vigente

Para evitar ambiguidade:

```text
COMPETIÇÃO EM FOCO
→ contexto local do DEV
→ serve para navegar/consultar/editar qualquer edição
→ trocar o foco NÃO altera o que a GESTAO está operando

COMPETIÇÃO VIGENTE
→ contexto global da organização
→ definida explicitamente pelo DEV
→ persistida no backend
→ é a única edição operacional visível à GESTAO
```

GESTAO não possui seletor entre edições. A troca de vigente é responsabilidade do DEV.

Permissões de ciclo:

```text
Criar competição       → DEV
Abrir inscrições       → DEV | GESTAO
Encerrar inscrições    → DEV | GESTAO
Iniciar competição     → DEV | GESTAO
Finalizar competição   → DEV
Definir vigente        → DEV
```


---

## Checkpoint de implementação do BLOCO 2 — 23/09/2026

A implementação planejada do BLOCO 2 foi concluída. O bloco **não está fechado**: aguarda bateria manual única do usuário e resolução das decisões pendentes abaixo.

### 2.3 — Usuários e permissões

Implementado:

- separação visual entre **Organização / Diretoria** e **Participantes**;
- busca e filtro de contas internas;
- criação de conta interna permanece DEV-only;
- edição cadastral DEV-only de nome, e-mail e telefone para contas internas e PARTICIPANTE;
- PARTICIPANTE continua identidade separada e nunca é convertido em DEV/GESTAO/MIDIA;
- mudança de role apenas entre perfis internos;
- conta autenticada não pode alterar a própria role nem se desativar;
- backend protege o último DEV ativo;
- alteração de e-mail invalida a sessão anterior;
- desativação invalida a sessão da conta;
- e-mail duplicado continua proibido.

### 2.4 — Equipes, Competidores, Robôs, Fotos e Modalidades

Implementado:

- nova rota/tela administrativa **Competidores**;
- contexto padrão baseado na competição em foco (DEV) ou vigente (GESTAO);
- DEV pode alternar para catálogo global quando aplicável;
- GESTAO não recebe catálogos históricos globais;
- Equipe → Competidores;
- detalhe do competidor mostra equipe, instituição, contato, conta PARTICIPANTE vinculada, situação e participações;
- robôs do competidor são derivados das Registration em que participa;
- equipes mostram responsável e quantidade de inscrições no contexto;
- robôs mostram equipe, descrição, inscrições e drawer de fotos;
- consulta de fotos da GESTAO é validada no contexto da competição;
- mutações estruturais de Team, Competitor, Robot, CompetitionCategory e RobotImage são DEV-only no namespace administrativo;
- Portal do Participante continua usando seus endpoints próprios;
- transferências de competidor/robô/responsabilidade continuam reservadas à ETAPA 5.

### 2.5 — Inscrições, cancelamentos e reativação

Implementado:

- Inscrições abrem no contexto atual;
- DEV pode trocar apenas o filtro local da tela;
- GESTAO permanece na competição vigente;
- listagens globais de inscrições são DEV-only;
- aprovação/rejeição preservadas;
- cancelamento direto administrativo de PENDENTE/APROVADA;
- APROVADA sem atividade competitiva → CANCELADA;
- APROVADA com atividade competitiva → DESISTENTE;
- CANCELADA/REJEITADA podem ser reativadas quando a janela/regras permitirem;
- reativação retorna para PENDENTE e nova análise;
- solicitações de cancelamento do participante continuam com aprovação/rejeição pela organização;
- GESTAO só pode analisar inscrições/solicitações da competição vigente;
- backend aplica CompetitionContextService, não apenas filtros visuais.

### Checkpoint automatizado

```text
Frontend Checks #137 ✅
Typecheck ✅
Build ✅

Backend Tests #371 ✅
155 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V15 + testdata ✅
```

### Decisões de produto do BLOCO 2 — RESOLVIDAS

D1, D2 e D3 foram decididas na validação de 23/09/2026:

- **D1:** `CompetitionCategory` permanece catálogo global; não criar `Competition ↔ Category`;
- **D2:** UserAccount PARTICIPANTE e Competitor vinculado sincronizam identidade e ativo/inativo; Team/Robot/Registration são preservados e a ausência de competidores ativos gera aviso ao DEV;
- **D3:** administração do catálogo de categorias permanece DEV-only.

Os detalhes e consequências estão registrados no checkpoint de reteste abaixo.


---

## Reteste final do BLOCO 2 — correções 23/09/2026

A validação manual do BLOCO 2 aprovou a maior parte do escopo e revelou correções concentradas em catálogos contextuais, responsividade do gerenciador de edições, auditoria de decisões e dependência PARTICIPANTE ↔ Competitor.

### Correções aplicadas

- `CompetitionAdminCatalogService.buscar()` agora executa em transação read-only para permitir a montagem segura dos DTOs com relações LAZY;
- Equipes/Robôs/Competidores limpam os dados anteriores antes de carregar novo escopo, evitando manter catálogo global quando o contexto falha;
- "Gerenciar edições" deixou de usar drawer lateral e passou para modal central responsivo;
- seletor superior do DEV continua alterando apenas **Competição em foco**;
- somente a ação explícita **Definir vigente** altera a competição global da GESTAO;
- rejeição de inscrição passa a exigir e persistir motivo próprio;
- V16 adiciona `registrations.review_reason`;
- histórico de solicitações de cancelamento passa a exibir motivo, solicitante, decisão, revisor, data e resposta;
- rejeitar solicitação de cancelamento exige justificativa;
- reativação administrativa de CANCELADA/REJEITADA depende do status `INSCRICOES_ABERTAS`, sem bloquear por datas antigas inconsistentes;
- reativação pelo participante continua respeitando status + janela temporal;
- conta PARTICIPANTE e Competitor vinculado passam a sincronizar nome, e-mail, telefone e ativo/inativo;
- ao desativar o último competidor ativo de uma equipe, o sistema informa que a equipe ficou sem competidores ativos;
- equipe/robôs não são inativados automaticamente: decisão continua com DEV;
- competidor vinculado a UserAccount não pode ser ativado/desativado diretamente no catálogo; deve ser gerenciado pela conta PARTICIPANTE;
- reativar PARTICIPANTE é bloqueado se a equipe ou instituição vinculada estiver inativa.

### Decisões D1/D2/D3 encerradas

**D1 — Categorias por competição**

Decisão: manter `CompetitionCategory` como catálogo global.

Justificativa: as competições RasComp usam o mesmo conjunto de categorias. Não será criada relação estrutural Competition ↔ Category nesta etapa.

A interface continua podendo indicar quais categorias estão **em uso** na edição a partir das Registration existentes.

**D2 — UserAccount PARTICIPANTE x Competitor**

Decisão: Competitor vinculado é dependente da conta PARTICIPANTE.

```text
Editar nome/e-mail/telefone da conta
→ sincroniza Competitor

Desativar conta PARTICIPANTE
→ invalida sessão
→ desativa UserAccount
→ desativa Competitor vinculado
→ preserva Team, Robot, Registration e histórico

Se a equipe ficar sem competidores ativos
→ informar DEV
→ DEV decide entre recompor a equipe ou inativar equipe/robôs
```

Não há cascata destrutiva automática para Team/Robot.

**D3 — Gestão das categorias**

Decisão: catálogo de categorias permanece responsabilidade exclusiva de DEV.

GESTAO é perfil de operação ativa da competição e não administra estrutura de categorias.

### DESISTENTE x DESCLASSIFICADA

- `DESISTENTE`: saída/cancelamento após existir atividade competitiva registrada;
- `DESCLASSIFICADA`: consequência de regra competitiva;
- Sumô já aplica DESCLASSIFICADA automaticamente quando o robô esgota as tentativas de inspeção sem aprovação;
- demais casos e eventual desclassificação manual serão tratados no BLOCO 3 — Operação competitiva, com motivo, responsável e contexto operacional.

Próxima migration estrutural após V17: V18+.


### Checkpoint automatizado pós-correções

```text
Frontend Checks #149 ✅
Typecheck ✅
Build ✅

Backend Tests #388 ✅
161 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V16 + testdata ✅
```

O reteste manual concentrado foi concluído e o BLOCO 2 foi formalmente validado.


---

## Acabamento final do BLOCO 2 — 23/09/2026

Após o segundo reteste manual, foram aplicados os últimos ajustes de UX e auditoria:

- espaçamento do card **Competição em foco/vigente** corrigido especificamente em Equipes, Competidores, Robôs e Modalidades;
- ações **Usar como foco**, **Definir vigente** e **Editar** do modal Gerenciar edições ganharam destaque rubro;
- competidor vinculado a UserAccount PARTICIPANTE continua sendo gerenciado pela conta, inclusive para DEV;
- a tela Competidores agora oferece **Gerenciar conta**, abrindo Usuários → Participantes já filtrado na conta vinculada;
- V17 cria `registration_status_history`;
- o detalhe da inscrição exibe linha do tempo auditável de:
  - criação;
  - aprovação;
  - rejeição;
  - cancelamento;
  - desistência;
  - reativação;
  - desclassificação;
- cada evento guarda status anterior/novo, tipo, responsável quando disponível, motivo e data;
- cancelamento originado por solicitação do participante propaga o motivo original para a auditoria;
- desclassificação automática do Sumô por limite de inspeções também gera evento;
- dados anteriores à V17 não recebem transições históricas inventadas; a auditoria detalhada começa a partir da implantação da V17.

### Checkpoint automatizado

```text
Frontend Checks #164 ✅
Typecheck ✅
Build ✅

Backend Tests #414 ✅
161 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V17 + testdata ✅
```

Os últimos ajustes foram validados pelo usuário e o BLOCO 2 está formalmente encerrado.


### Ajuste complementar — detalhe da inscrição

A validação manual mostrou que o **Histórico de cancelamentos** aparecia na tela principal, mas não dentro dos Detalhes da própria inscrição.

Correção:

- Detalhes da inscrição agora exibem duas auditorias complementares:
  1. **Histórico de status** — transições persistidas em `registration_status_history` a partir da V17;
  2. **Solicitações de cancelamento** — registros de `RegistrationCancellationRequest`, incluindo registros anteriores à V17.
- não é feito backfill fictício de status;
- solicitações antigas continuam visíveis no detalhe mesmo quando não possuem evento correspondente na tabela V17.

Checkpoint: Frontend Checks #168 ✅.


---

## Fechamento formal do BLOCO 2 — 23/09/2026

O usuário concluiu a validação manual final e aprovou o fechamento do BLOCO 2.

### Estado

```text
BLOCO 2 — Gestão administrativa
✅ CONCLUÍDO
✅ VALIDADO
✅ DOCUMENTAÇÃO SINCRONIZADA
```

### Escopo validado

- Dashboard/Central;
- Competições e contexto foco/vigente;
- Usuários e permissões;
- Organização/Diretoria x Participantes;
- Equipes;
- Competidores;
- Robôs;
- Fotos;
- Modalidades;
- Inscrições;
- aprovação/rejeição;
- cancelamento/desistência;
- reativação;
- solicitações de cancelamento;
- auditoria de status V17;
- permissões DEV/GESTAO/MIDIA/PARTICIPANTE;
- responsividade dos componentes alterados;
- contexto administrativo por competição.

### Decisões finais incorporadas

- categorias permanecem catálogo global;
- administração estrutural de categorias é DEV-only;
- UserAccount PARTICIPANTE é fonte de verdade do Competitor vinculado para identidade e ativo/inativo;
- Team/Robot/Registration não sofrem cascata automática;
- equipe sem competidores ativos gera aviso ao DEV;
- foco local do DEV é independente da competição vigente global;
- somente `Definir vigente` altera o contexto operacional da GESTAO;
- DESISTENTE representa saída após atividade competitiva;
- DESCLASSIFICADA permanece consequência de regra competitiva e terá complementos no BLOCO 3.

### Checkpoint final

```text
Frontend Checks #170 ✅
Backend Tests #415 ✅
161 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V17 + testdata ✅
```

### Próximo bloco

```text
BLOCO 3 — Operação competitiva
⏳ PRÓXIMO
⛔ NÃO INICIADO
```

O início do BLOCO 3 deve ocorrer em novo checkpoint de trabalho, preservando as regras já consolidadas no BLOCO 2.


---

## Início do BLOCO 3 — Operação competitiva — 23/09/2026

BLOCO 3 autorizado e iniciado após o fechamento formal do BLOCO 2.

### Estrutura interna

```text
3A — Follow Line
3B — Sumô
3C — Chaves / Agenda / Resultados
```

### 3A — Follow Line

Objetivo:

- revisar operação completa da tomada;
- alinhar contexto DEV foco local x GESTAO vigente;
- proteger backend com CompetitionContextService;
- revisar convocação operacional e ausência;
- revisar ranking/classificação;
- revisar histórico/auditoria;
- revisar navegação e retorno;
- revisar estados vazios/loading/erro;
- revisar responsividade desktop/tablet/mobile;
- preservar o contrato 3 tomadas × 3 tentativas e demais regras competitivas já aprovadas.

A modelagem estrutural da **Agenda Follow** não entra na 3A. Ela permanece na 3C, onde a chamada geral da tomada será criada junto da agenda unificada Follow + Sumô.

### 3B — Sumô

Após validação da 3A:

- inspeção;
- juízes;
- rounds;
- penalidades;
- WO/falha de inicialização;
- decisão de juiz;
- desclassificação e auditoria;
- contexto de competição;
- UX/responsividade.

### 3C — Chaves / Agenda / Resultados

Após 3A e 3B:

- chave vigente/histórica;
- progressão/correção;
- Agenda unificada;
- chamada geral de tomada do Follow;
- convocações individuais;
- agenda das batalhas de Sumô;
- pistas/dohyos;
- ordem operacional;
- estados de convocação;
- Resultados por categoria/vencedores;
- consumo da agenda no Dashboard.

### Regra de execução

Não antecipar a Agenda na 3A/3B. Cada frente deve ser validada antes do fechamento do BLOCO 3.


---

## Implementação completa do BLOCO 3 — 24/09/2026

As três frentes do BLOCO 3 foram implementadas. O bloco **não está formalmente encerrado** até a validação manual do usuário.

### 3A — Follow Line ✅ implementado

- contexto DEV = foco local / GESTAO = competição vigente;
- `CompetitionContextService` aplicado a tentativas, ausências e ranking administrativo;
- operação 3 tomadas × 3 tentativas preservada;
- cronômetro, penalidade, checkpoints e estados válidos preservados;
- ausência por convocação continua sem criar tentativas fictícias;
- histórico/auditoria preservados;
- chamada geral da tomada integrada à operação quando existe Agenda;
- operação aberta pela fila respeita a tomada convocada;
- fila é atualizada automaticamente para execução/conclusão/ausência;
- resultados do Follow só declaram vencedor quando o programa de todos os participantes ativos/aprovados está encerrado;
- ranking parcial continua visível durante a prova.

### 3B — Sumô ✅ implementado

- inspeção humana APTO/INAPTO;
- tentativa máxima de inspeção com desclassificação automática auditada;
- desclassificação manual com motivo obrigatório e auditoria;
- ação de desclassificação disponível também no console do Sumô;
- juízes por competição;
- rounds regulares;
- penalidades;
- SUICIDIO/WO;
- falha de inicialização justificada;
- rounds extras justificados;
- decisão final de juiz;
- resolução administrativa de partida quando exatamente um participante fica DESCLASSIFICADO/DESISTENTE;
- nenhuma resolução administrativa cria round fictício;
- contexto DEV/GESTAO protegido no backend;
- partida encerrada passa a aparecer como FINALIZADA na Agenda.

### 3C — Chaves / Agenda / Resultados ✅ implementado

- chave vigente e histórico;
- geração/regeneração preservando as regras já aprovadas;
- BYE;
- progressão;
- correção protegida;
- Agenda unificada em **Operação ao vivo → Agenda**;
- V18 cria `follow_take_schedules` e `follow_take_schedule_entries`;
- Follow agenda uma chamada geral por categoria/tomada;
- fila individual de inscrições por chamada;
- convocação individual;
- horário, pista e ordem operacional;
- Sumô reutiliza `Match.dataHora/pista/ordemExecucao/statusConvocacao`;
- rodadas futuras `AGUARDANDO_PARTICIPANTES` não aparecem como atividade real da Agenda;
- chamadas Follow encerradas são somente leitura;
- fila preserva registros indisponíveis para histórico, mas não permite operá-los;
- Dashboard consome a Agenda unificada;
- Resultados consolida vencedores por categoria;
- Follow não declara campeão enquanto existirem tomadas abertas;
- Sumô usa o vencedor da final da chave atual;
- Partidas permanece como detalhe operacional das chaves e não como item principal do Dashboard/sidebar.

### Testes integrados adicionados/expandidos

`CompetitionOperationFlowTest` cobre:

- criação de chamada Follow;
- fila automática;
- bloqueio de conclusão manual da convocação;
- conclusão da tomada sincronizando fila/chamada;
- ausência sincronizando fila/chamada sem tentativa fictícia;
- ranking parcial sem declarar campeão;
- campeão Follow somente após programa completo;
- Agenda Sumô ocultando rodada futura sem participantes;
- agenda de batalha;
- desclassificação auditada;
- resolução administrativa sem round fictício;
- Agenda refletindo batalha FINALIZADA;
- vencedor de Sumô refletido em Resultados.

### Checkpoint automatizado

```text
Frontend Checks #213 ✅
Backend Tests #493 ✅
166 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V18 + testdata ✅
```

V1–V18 são imutáveis. Próxima migration estrutural: **V19+**.

### Decisões deixadas para o fechamento manual

1. **Janela operacional do Follow:** o backend hoje exige inscrição ativa/aprovada e contexto autorizado, mas não força `Competition.status == EM_ANDAMENTO`. Decidir se tentativas/ausências devem ser bloqueadas fora de `EM_ANDAMENTO`.
2. **Follow sem tentativa classificável:** se todas as tomadas forem encerradas mas nenhum robô possuir tentativa válida/classificável, o resultado continua `PENDENTE`. Decidir se deve existir estado explícito como `SEM_VENCEDOR`.

Após a bateria manual final e essas decisões, o BLOCO 3 poderá ser marcado como CONCLUÍDO/VALIDADO.
