## PLANEJAMENTO CANÔNICO ATUALIZADO — 09/10/2026

> **Correção de calendário:** a meta do MVP funcional era **04/10/2026**, não 04/11/2026. O escopo que o responsável esperava desse marco já foi atendido, mas isso **não significa que cloud, operação completa, documentação e validação final estejam concluídas**. Menções anteriores a "MVP de produção — 04/11" são histórico superado, não prazo vigente. A competição de novembro continua como marco operacional; não assumir que todas as entregas abaixo precisam aguardar a semana do evento.

### Ordem prioritária aprovada

1. **Até 14/10/2026 — fechar a V1-BETA B / Cloud:** MySQL persistente com backup/restore, Flyway, API/HTTPS, Gestão e Portal remotos, verificação de e-mail/recuperação de senha, storage R2 persistente, secrets, acesso local/contingência preservados e smoke cloud. Prazo-alvo, sujeito aos gates de segurança e verificação; não liberar inscrições reais sem cumprir os bloqueantes.
2. **Após cloud — Gestão de Mídia da Landing (P1):** CRUD editorial de textos/fotos/heros, eventos e calendário, galeria, robôs, patrocinadores, publicações, controle institucional/competitivo e auditoria. MIDIA/DEV administra conteúdo sem deploy manual.
3. **Em seguida — Futebol de Robôs (P2):** inscrição sem robô próprio (robôs eventualmente fornecidos pela organização), atribuição e regras, cronômetro/placar de gols, estados da partida, chaveamento, resultados, operação na Gestão e acompanhamento público. Validar regulamento e casos de empate/penalidades antes de fechar regras.
4. **Depois — Central de Ajuda e manuais por perfil (P3):**
   - **Ajuda administrativa dentro da Gestão:** como criar/gerir competição, inscrições e aprovações, equipes/robôs, Follow, Sumô/Mini Sumô, Futebol, tempo/placar/chaves/resultados, contingência, além de operar o Gestor de Mídia. Manual contextual por tela, navegação acessível e conteúdo versionado/revisável.
   - **Ajuda do participante integrada ao Portal:** regras da competição, regras do ambiente de competição, inscrição pessoal/de equipe/de robô conforme modalidade, comprovantes, aprovação, como acompanhar situação, cronograma, chamadas, resultados, chaves, Follow e Sumô. Orientações práticas claras e acessíveis, incluindo estados de erro e dúvidas frequentes.
   - **Fonte oficial:** regulamento e regras de ambiente validados pela organização; a documentação não inventará normas. Distinguir orientações gerais de regras específicas por edição/categoria; versionar/publicar atualizações com controle editorial.
   - **Manter permissões:** informações administrativas apenas para perfis autorizados; materiais públicos/participante disponíveis sem conceder acesso a funções operacionais.
5. **Fechamento do MVP ampliado:** concluir fluxos e manuais, testar ponta a ponta todos os perfis, categorias e cenários cloud/local. Só marcar concluído após validação.
6. **Depois do MVP — revisão do roadmap original:** auditar pendências reais, classificar somente o indispensável, priorizar manutenção, estabilidade, correções, usabilidade, testes, segurança, desempenho e polimento. Novas funcionalidades deixam de ser o foco; requisitos restantes do roteiro original permanecem registrados e serão reavaliados, não apagados.

**Princípio:** continuar desenvolvimento em homologação, liberar para produção apenas versões aprovadas; preservar modo local. A Etapa 13 (Regras, Ajuda e Segurança) passa a ter seu núcleo de **manuais e ajuda por perfil** antecipado para P3, sem necessariamente antecipar todos os seus outros itens.

---

## PRIORIDADE IMEDIATA APÓS V1-BETA B CLOUD — 09/10/2026

**Decisão de priorização (MVP de produção de 04/11/2026):** assim que estiver concluído o fluxo de MySQL persistente → backend/API cloud → Gestão e Portal autenticados → e-mail transacional/validação de contas → R2/uploads persistentes → smoke cloud, iniciar, nesta ordem, **(P1) Gestão de Mídia da Landing** e **(P2) Categoria Futebol de Robôs**. Ambas são prioridade máxima do ciclo seguinte, antes de polimentos não bloqueantes e funcionalidades pós-produção, sem apagar o roadmap original. Se necessário, poderão avançar em paralelo após os contratos e a infraestrutura cloud estarem estáveis.

### P1 — Gestão de Mídia da Landing (prioridade máxima)
- Interface administrativa para editar conteúdo público sem modificar/republicar o frontend manualmente: heros, banners, seção Sobre, equipe/diretoria, conquistas, robôs, galeria, notícias, eventos, patrocinadores e apoiadores.
- Upload e gerenciamento de imagens persistentes via R2/storage, metadados, ordenação, ativação/desativação, prévia e publicação controlada; permissões e auditoria.
- Eventos com título, texto, imagens, localização, datas de início/fim e fuso; estados automáticos próximo / acontecendo / encerrado; histórico de eventos e possível vínculo explícito com competição RasComp.
- Gestão do modo institucional/competitivo da Landing **independente de haver competição vigente**, impedindo exposição acidental de dados; publicação intencional e reversível.
- Patrocinadores do carrossel em cadastro próprio; apoiadores institucionais permanecem separados no footer. Substituir imagens provisórias por marcas reais somente quando cadastradas/autorizadas.
- Compatibilizar alterações com cache/invalidação e endpoints públicos sem prejudicar performance e disponibilidade.

### P2 — Categoria Futebol de Robôs (prioridade máxima)
- Consolidar regras próprias da modalidade: partidas entre robôs/equipes, gols por lado e placar, duração configurável com valor usual de referência **2 minutos** (não hardcode), cronômetro e comandos da organização.
- Persistir placar e eventos de partida no backend, com validação de estado, retomada/finalização, histórico/auditoria e tratamento de correções administrativas.
- Exibir andamento em tempo real ou atualização periódica confiável na Gestão e na Landing pública, além de resultados e progressão de chaveamento aplicáveis.
- Tratar empate, prorrogação/desempate e critérios oficiais como regras a validar antes de implementá-los, sem pressupor regulamento inexistente.
- Testes automatizados e manuais: início/pausa/fim, gols, sincronização, atualização pública, recuperação após falha e controle de acesso.

**Critério de saída:** Gestão de Mídia opera conteúdo real publicado na Landing sem deploy; Futebol permite operar e acompanhar partidas completas com placar/tempo persistentes e refletidos nas interfaces.

---

# RasComp — Roadmap Pós-Projeto

Última revisão: **06/10/2026**

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

## TRILHO PRIORITÁRIO — V1 BETA EM PRODUÇÃO

A partir de 03/10/2026, o RasComp adota um trilho temporário de publicação antecipada para colocar uma **V1 Beta utilizável no ar antes da primeira competição oficial**, sem abandonar o roadmap principal.

Sequência aprovada:

```text
Landing pública finalizada/polida
→ infraestrutura de produção
→ banco de produção
→ cadastro/login/acesso real
→ inscrições reais
→ smoke e estabilização da V1 Beta
→ retorno ao roadmap oficial
```

Depois da publicação da V1 Beta, produção deixa de ser ambiente de desenvolvimento. A evolução continua em branch própria + ambiente não-prod + testes; somente depois ocorre merge/deploy em produção.

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
6. consolidação/hardening final da produção depois da Beta.

---

# 2. Estado atual

ETAPA 0  ✅ CONCLUÍDA / VALIDADA — Baseline e congelamento da versão aprovada
ETAPA 1  ✅ CONCLUÍDA / VALIDADA — Correções de lógica e integridade
ETAPA 2  ✅ CONCLUÍDA / VALIDADA — Limpeza técnica e organização de código
ETAPA 3  ✅ CONCLUÍDA / VALIDADA — Nova matriz de permissões
ETAPA 4  ✅ CONCLUÍDA / VALIDADA — Consolidação funcional do MVP atual

TRILHO PRIORITÁRIO — V1 BETA EM PRODUÇÃO
V1-BETA A  ✅ CONCLUÍDA / VALIDADA — Landing pública finalizada
V1-BETA B  🚧 EM ANDAMENTO — Bloco 1 ✅; Bloco 2 Landing remota ✅ / Gestão Tunnel diagnosticado; base cloud em preparação
V1-BETA C  ⏳ — Abertura controlada: cadastro/login + inscrições reais + acesso ao sistema
V1-BETA D  ⏳ — Smoke de produção + estabilização inicial

ROADMAP OFICIAL — RETOMADA APÓS V1 BETA
CAMADA COMPETITIVA PÓS-BETA  ⏳ — Dupla eliminação para Sumô/Mini Sumô
ETAPA 5  ⏳ PÓS-BETA — Ajustes Gerais DEV + auditoria; não bloqueia a publicação inicial
ETAPA 6  ⏳ NÃO INICIADA — Futebol de Robôs
ETAPA 7  ⏳ NÃO INICIADA — Portal do Participante completo + identificação competitiva
ETAPA 8  ⏳ NÃO INICIADA — Gestor de Mídia / CMS
ETAPA 9  ⚠️ REPLANEJAR — Landing/Galeria/conteúdo público será deduplicado após V1-BETA A
CHECKPOINT MOBILE ⏳ NÃO INICIADO — Otimização Mobile do MVP
ETAPA 10 ⏳ NÃO INICIADA — Validação e fechamento do MVP

PRIORIDADE 2 — ADIÇÕES, TESTES E PORTABILIDADE
ETAPA 11 ⏳ NÃO INICIADA — Avisos IN_APP + Telegram
ETAPA 12 ⏳ NÃO INICIADA — Portabilidade institucional
ETAPA 13 ⏳ NÃO INICIADA — Regras, Ajuda e Segurança
ETAPA 14 ⏳ NÃO INICIADA — Hardening de segurança + preparação de carga
ETAPA 15 ⏳ NÃO INICIADA — Validação final + testes de carga pré-competição
ETAPA 16 ⚠️ REINTERPRETADA — consolidação/hardening da produção definitiva; não é mais o primeiro deploy

**Trabalho atual: estruturar a base cloud da V1-BETA B após validar a Landing externamente por Quick Tunnel. Próximo gate: conectar a conta Cloudflare temporária, publicar os dois frontends e depois integrar API/Container + MySQL + e-mail + storage. O modo local/LAN permanece preservado.**

A V1 Beta não encerra o roadmap. Ela cria uma linha estável de produção para divulgação, cadastro e inscrições enquanto o restante do produto continua evoluindo em ambiente não-prod.
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
- a V1 Beta antecipa o primeiro deploy operacional;
- produção nunca é ambiente de desenvolvimento;
- após a Beta, toda evolução relevante passa por branch + ambiente não-prod + testes + merge;
- a antiga etapa final de deploy passa a representar consolidação/hardening da produção definitiva, não o primeiro go-live.

---

# 3.1. Trilho V1 Beta

## V1-BETA A — Landing pública pronta para divulgação

Objetivo: transformar a Landing na porta de entrada real da versão Beta.

Escopo mínimo:
- revisão visual final;
- responsividade desktop/mobile;
- textos institucionais reais;
- identidade visual consistente;
- CTA de cadastro/login/inscrição;
- links e informações públicas essenciais;
- integração somente com APIs públicas necessárias;
- remoção de placeholders e dados demo visíveis;
- SEO/meta/título/favicon básicos;
- estados de erro/carregamento do conteúdo público.

Saída: Landing pronta para divulgação externa.

### Integração obrigatória Landing → sistema autenticado

A Landing deve funcionar como porta pública e conter CTA principal **Inscrever-se** no menu/sidebar/navegação principal.

Fluxo:

```text
Landing pública
→ Inscrever-se
→ aplicação Gestão/Participante
→ cadastro ou login
→ Portal
→ inscrição
```

A URL de destino deve ser configurável por ambiente. Não hardcodar localhost nem domínio temporário.

### Gate 0 — identidade e acesso antes da infraestrutura

Antes do primeiro commit da V1-BETA B, definir e validar a arquitetura mínima de identidade:

- verificação de posse do e-mail;
- ativação de conta;
- recuperação segura de senha;
- política para reduzir contas falsas/descartáveis sem coletar dados pessoais desnecessários;
- provedor de e-mail transacional;
- tokens/códigos de uso único e expiração;
- resposta anti-enumeração;
- fluxo excepcional DEV auditado sem acesso à senha definitiva;
- ambiente remoto de homologação acessível externamente já no início da fase;
- preservação do modo local e da contingência via Cloudflare Tunnel.

A decisão deve ser documentada antes da implementação.

## V1-BETA B — Infraestrutura de produção

Objetivo: criar uma V1 real, persistente e reproduzível fora do ambiente local.

Separação mínima:

```text
LOCAL / DEV
→ desenvolvimento individual

STAGING / HOMOLOGAÇÃO
→ banco e serviços separados
→ migrations testadas
→ QA manual + automatizado

PRODUÇÃO
→ usuários reais
→ inscrições reais
→ dados reais
→ somente versões validadas
```

### Gate obrigatório de infraestrutura antes de qualquer inscrição real

Todos os itens abaixo são **bloqueantes**:

- frontend público e aplicação autenticada publicados;
- backend/API publicado e acessível por HTTPS;
- **MySQL de produção persistente e separado de local/staging**;
- **backup real do banco configurado e pelo menos um procedimento de restore documentado/testável**;
- **Flyway executando sobre o banco de produção de forma controlada, com histórico de migrations íntegro**;
- secrets/variáveis fora do código;
- CORS/URLs/domínios corretos;
- bootstrap seguro do primeiro DEV;
- logs e healthcheck mínimos;
- rollback operacional documentado;
- nenhum profile `testdata`, usuário demo ou senha demo em produção;
- **banco cloud novo deve nascer sem massa de teste**: nenhum Team, Competitor, Robot, Competition, Registration, Match, Bracket ou Round demo;
- primeiro boot permite somente schema/Flyway + primeiro DEV real via bootstrap; demais contas internas são criadas pelo DEV;
- **storage persistente dos comprovantes de inscrição**, sem depender do filesystem efêmero/local;
- storage persistente de outros uploads que já forem usados pela Beta.

Se qualquer item bloqueante falhar, a V1 pode continuar tecnicamente publicada para smoke interno, mas **não pode abrir inscrições reais**.

### Gate de identidade e operação

Antes da abertura também devem existir:

- **contas verificadas reais** para DEV/GESTAO e demais perfis internos que realmente serão usados;
- dados reais da organização exibidos publicamente;
- contatos/e-mails reais de suporte/operação;
- permissões dessas contas conferidas manualmente.

Não usar a expressão 'contas institucionais' como requisito: o critério é serem **contas reais e verificadas para a operação**, independentemente do domínio de e-mail.

### Portabilidade obrigatória da primeira infraestrutura

A V1-BETA B pode ser hospedada inicialmente em uma **conta temporária do mantenedor** para acelerar a publicação.

Porém a solução deve nascer pronta para migração futura para uma **conta própria do RasComp/organização e domínio próprio**.

Obrigatório:

- URLs frontend/API configuráveis;
- DNS/domínio desacoplados da conta temporária;
- secrets externos;
- MySQL exportável/migrável;
- storage exportável/migrável;
- inventário dos recursos cloud;
- procedimento documentado de migração/transferência;
- nenhum identificador da conta temporária hardcoded na aplicação.

A migração futura não pode exigir reescrever o sistema.

### Regra permanente — modo local e contingência de competição

O deploy em nuvem **não pode remover nem degradar o modo local**.

O RasComp deve continuar podendo operar com:

```text
Landing/Vite local ou build estático local
+
Gestão/Participante local
+
Spring Boot local
+
MySQL local/rede local
+
storage local configurável
```

Objetivos:

- desenvolvimento sem dependência da cloud;
- homologação local;
- demonstrações;
- contingência operacional no dia da competição.

Cloudflare é infraestrutura de publicação/proteção, não requisito funcional do domínio.

#### Cloudflare e quotas

Na V1-BETA B, revalidar limites e preços vigentes antes do provisionamento.

Diretriz arquitetural:

- Landing/assets estáticos podem aproveitar CDN/static hosting;
- evitar arquitetar toda chamada dinâmica da API como execução obrigatória de Worker com quota diária;
- backend Spring Boot e MySQL devem continuar acessíveis/operáveis independentemente dessa quota;
- nenhum limite comercial específico deve ser assumido permanentemente no código ou na documentação operacional sem nova conferência.

#### Contingência local de evento

Antes da primeira competição oficial, executar um ensaio de operação sem cloud:

```text
backup/snapshot recente da produção
→ restore em MySQL local
→ arquivos necessários disponíveis localmente
→ URLs/API configuradas para rede local
→ Gestão + Portal + operação competitiva funcionando
```

Regras:

- documentar passo a passo do cutover;
- testar acesso por outros computadores/celulares na rede local;
- validar Follow, Sumô, chaves, ranking e inscrições já existentes;
- evitar operação simultânea cloud + local com escritas independentes;
- durante contingência, definir explicitamente qual ambiente é a fonte de verdade;
- ao retornar à cloud, executar procedimento controlado de reconciliação/restauração, nunca copiar dados manualmente sem rastreabilidade.

O plano local é uma **contingência**, não substitui backup, observabilidade ou infraestrutura de produção adequada.

## V1-BETA C — Cadastro, acesso e inscrições reais

Objetivo: permitir uso real do sistema antes da primeira competição oficial.

Liberar na Beta:
- cadastro público PARTICIPANTE;
- login;
- equipes;
- Minha inscrição;
- cadastro/associação de Robot para modalidades que usam Robot próprio;
- inscrição do Robot;
- comprovantes;
- análise da GESTAO;
- páginas públicas necessárias para divulgação/acompanhamento;
- **inscrição simples em Futebol de Robôs**.

### Gate obrigatório antes de abrir a janela real

Além do gate da V1-BETA B, confirmar obrigatoriamente:

- **Competition real criada e revisada**;
- **categorias reais corretas**;
- **janela de inscrições correta** (`inicioInscricoes` / `fimInscricoes`);
- valores/textos/taxas aplicáveis revisados;
- contas verificadas reais de DEV/GESTAO prontas;
- storage de comprovantes persistente e leitura/download testados;
- backup do banco confirmado;
- Flyway sem divergência;
- nenhuma massa demo/testdata misturada com produção;
- **smoke completo criando uma conta nova do zero**.

O smoke do zero deve percorrer pelo menos:

```text
cadastro PARTICIPANTE
→ login
→ criação/entrada em equipe
→ Minha inscrição
→ envio de comprovante
→ cadastro/associação de Robot quando aplicável
→ inscrição competitiva
→ análise pela GESTAO
→ aprovação
→ leitura pública/Portal refletindo o estado correto
```

Somente depois desse smoke ser aprovado a organização pode divulgar oficialmente que as inscrições estão abertas.

### Futebol de Robôs — inscrição simples da V1 Beta

A Beta deve permitir **inscrição na modalidade Futebol de Robôs sem exigir Robot próprio do participante/equipe**.

Decisão já preservada:

```text
Futebol de Robôs
→ robôs podem ser fornecidos/atribuídos pela organização
→ não criar Robot fictício apenas para satisfazer Registration.robot
```

Escopo desta Beta:
- participante/equipe escolhe a Competition + categoria Futebol;
- informa/seleciona os competidores exigidos pelo formulário simples;
- envia dados/comprovante quando o evento exigir;
- inscrição nasce PENDENTE e pode ser aprovada/rejeitada pela GESTAO;
- nenhum Robot próprio é obrigatório nessa inscrição;
- atribuição do Robot da organização pode ficar para a operação posterior.

Fora da V1 Beta:
- regra da partida;
- placar/gols;
- cronômetro de 2 minutos;
- empate/desempate;
- chaveamento específico;
- inspeção;
- penalidades;
- fluxo operacional da partida.

Esses itens continuam na **ETAPA 6 — Futebol de Robôs** depois do site estar no ar.

## V1-BETA D — Estabilização inicial

Depois da abertura:
- corrigir bugs críticos/hotfixes da Beta;
- registrar feedback de usuários reais;
- acompanhar erros de API/banco;
- confirmar persistência de inscrições e comprovantes;
- manter mudanças estruturais maiores fora de produção até validação em staging.

Após estabilização:

```text
V1 Beta permanece online
+
retorno ao roadmap oficial
+
desenvolvimento em ambiente não-prod
+
merge/deploy somente após testes
```


## CAMADA COMPETITIVA PÓS-BETA — Dupla eliminação de Sumô/Mini Sumô

**Status:** modelagem aprovada em 06/10/2026; implementação somente após deploy e estabilização da V1 Beta.

Esta camada entra **antes da retomada funcional normal do roadmap**, sem alterar o objetivo atual da V1-BETA B/C/D.

### Regra estrutural

Categorias de Sumô/Mini Sumô que usam chave passam do modelo atual de eliminação simples para **dupla eliminação**.

O sistema gera um único chaveamento competitivo com duas seções coordenadas:

```text
CHAVE PRINCIPAL / WINNERS
→ participante permanece enquanto estiver invicto
→ primeira derrota envia para a Chave dos Perdedores

CHAVE DOS PERDEDORES / LOSERS
→ recebe participantes após a primeira derrota
→ derrota nesta seção = segunda derrota = eliminação
```

Não modelar Winners e Losers como campeonatos independentes. Elas pertencem ao mesmo `Bracket` e compartilham progressão, histórico, agenda e resultado final.

### Final da chave principal

A final da Winners **não define campeão nem vice**.

Ela define apenas o representante invicto da chave principal para a Final Geral.

A final da Losers define o representante da chave dos perdedores para a Final Geral.

### Final Geral + Reset

```text
Vencedor da Winners (0 derrotas)
×
Vencedor da Losers (1 derrota)
→ GRAND_FINAL
```

Se o representante da Winners vencer:

```text
adversário recebe a 2ª derrota
→ campeonato encerrado
→ vencedor da Winners = campeão
```

Se o representante da Losers vencer:

```text
representante da Winners recebe a 1ª derrota
→ ambos passam a possuir 1 derrota
→ GRAND_FINAL_RESET é criada/ativada automaticamente
```

A Final de Reset é **obrigatória quando necessária**; não depende de escolha manual da organização.

O vencedor da Final de Reset é o campeão e o perdedor é o vice.

Cada Final Geral/Reset continua sendo uma partida normal de Sumô, obedecendo ao mesmo contrato de rounds, penalidades, WO, rounds extras e decisão de juiz.

### Pódio aprovado

Na dupla eliminação:

```text
1º lugar
→ vencedor da Final Geral decisiva
   (GRAND_FINAL quando não houver reset,
    ou GRAND_FINAL_RESET quando houver)

2º lugar
→ perdedor da Final Geral decisiva

3º lugar
→ perdedor da Final da Chave dos Perdedores
```

Não criar disputa extra de terceiro lugar para este formato.

A regra atual de disputa específica de 3º lugar permanece somente enquanto o chaveamento de eliminação simples ainda estiver em uso.

### Invariantes de domínio

```text
0 derrotas → permanece na Winners
1 derrota  → permanece vivo na Losers
2 derrotas → ELIMINADO
```

Exceção estrutural da Final Geral:

- o campeão da Winners pode sofrer sua primeira derrota na `GRAND_FINAL`;
- nesse caso ele não é eliminado;
- o `GRAND_FINAL_RESET` resolve a segunda eliminação de um dos dois finalistas.

Invariante central:

> Nenhuma Registration pode ser eliminada de uma chave de dupla eliminação com apenas uma derrota.

### Evolução de modelo prevista

Conceitos esperados:

```text
BracketFormat
├─ SINGLE_ELIMINATION
└─ DOUBLE_ELIMINATION

BracketSection
├─ WINNERS
├─ LOSERS
├─ GRAND_FINAL
└─ GRAND_FINAL_RESET
```

A progressão de uma partida deve suportar destinos distintos:

```text
winnerNextMatchId
loserNextMatchId
```

Na Winners:

```text
vencedor → próxima partida da Winners
perdedor → slot correspondente da Losers
```

Na Losers:

```text
vencedor → próxima partida da Losers
perdedor → segunda derrota → eliminado
```

Slots devem guardar/derivar sua origem competitiva, por exemplo:

```text
WINNER(matchId)
LOSER(matchId)
```

Isso evita reconstrução ambígua da progressão.

### BYE, correção e auditoria

- BYE continua sendo avanço automático e não conta como vitória disputada/derrota;
- geração deve funcionar com quantidades não-potência de dois;
- correção de resultado precisa recalcular tanto o caminho do vencedor quanto o destino do perdedor;
- correção fica bloqueada quando dependências posteriores já tiverem atividade, seguindo a proteção já existente;
- ferramentas DEV excepcionais devem preservar histórico das duas seções;
- contagem de derrotas deve ser derivável/auditável, não um número solto sem origem.

### Frontend e exposição pública

Gestão, Portal e Landing devem poder representar:

```text
Chave Principal
Chave dos Perdedores
Final Geral
Final de Reset — somente quando necessária
```

A UI deve deixar explícito que:

- vencer a final da Winners não significa ser campeão;
- participante com uma derrota ainda está vivo;
- a Final de Reset aparece apenas quando a primeira Final Geral igualar ambos em uma derrota.

### Testes mínimos obrigatórios

Cobrir pelo menos:

- 4, 8, 16 e quantidade não-potência de dois participantes;
- BYEs nas duas rotas de progressão;
- primeira derrota Winners → Losers;
- segunda derrota → eliminação;
- Winners vence Grand Final sem reset;
- Losers vence Grand Final → reset obrigatório;
- cada lado podendo vencer o reset;
- pódio 1º/2º/3º derivado corretamente;
- correção antes/depois de dependências;
- histórico e agenda preservados;
- nenhuma eliminação com apenas uma derrota.

Esta camada **não bloqueia o deploy atual**. Ela é a primeira grande evolução competitiva já aprovada para a retomada pós-Beta.

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
- smoke básico da Landing/Galeria atual, sem polimento profundo ou duplicação da ETAPA 9;
- estados vazios, loading, erros e feedbacks;
- consistência de nomenclatura e textos;
- navegação e retorno entre fluxos;
- responsividade desktop/tablet/mobile;
- bugs de viewport, overflow, tabelas, diálogos e formulários;
- uso com banco local reaproveitado e banco limpo quando aplicável.

Melhorias cabíveis nesta etapa são correções/polimentos que **não criam um novo grande domínio**.

### Fronteira interna da ETAPA 4 após o BLOCO 3

Para impedir que a ETAPA 4 volte a crescer como um roadmap paralelo:

- **BLOCO 3 — Operação competitiva:** encerra Follow, Sumô, Chaves, Agenda, Resultados e contingências DEV diretamente ligadas à competição.
- **BLOCO 4 — Portal do Participante:** consolida o fluxo básico de equipe/participante necessário para o produto atual, incluindo convite/aceite, associação automática a Competitor, responsáveis por robô e visibilidade "Meus robôs".
- recursos avançados do Portal permanecem na **ETAPA 7**.
- Landing/Galeria continuam apenas no smoke geral; implementação/polimento completo permanece na **ETAPA 9**.

### BLOCO 4 — Portal do Participante ✅ CONCLUÍDO / VALIDADO

Escopo congelado em quatro sub-blocos:

**4.1 — Equipe e associação**
- líder envia convite por e-mail/login da conta PARTICIPANTE;
- participante aceita/recusa;
- participante pode solicitar entrada em equipe existente;
- líder aprova/rejeita;
- aceite/aprovação cria automaticamente `UserAccount PARTICIPANTE → Competitor → Team`;
- uma conta PARTICIPANTE possui um único vínculo competitivo de equipe.

**4.2 — Responsáveis por robô**
- `Robot` continua pertencendo à equipe;
- vínculo N:N `Robot ↔ Competitor responsável`;
- quem cadastra o robô vira responsável inicial;
- líder administra todos os robôs e pode alterar responsáveis;
- membro comum vê/edita somente os robôs pelos quais é responsável.

**4.3 — Portal e inscrições**
- inscrição individual separada da inscrição do Robot;
- comprovantes separados;
- Minha inscrição PENDENTE/APROVADA libera Inscrever robô;
- `Robot.createdByUser` diferencia ownership de responsabilidade N:N;
- membro comum só inicia/administra Registration de Robot que cadastrou;
- líder administra qualquer Robot da Team;
- composição competitiva automática, sem seleção arbitrária de colegas;
- ao menos um responsável pessoalmente APROVADO já permite aprovação do Robot;
- responsáveis PENDENTE não bloqueiam outro elegível;
- sincronização automática de composição antes da prova;
- aviso/auditoria e veto da GESTAO para mudanças de composição;
- rejeição automática do Robot quando não existir elegível/recuperável;
- reinscrição consciente de Robot REJEITADO;
- proteção da rejeição do líder, `CORRECAO_SOLICITADA` e transferência DEV;
- responsáveis/composição congelados durante competição iniciada;
- V25 + V26 sustentam o domínio revisado;
- validação manual canônica em `VALIDACAO_ETAPA4_BLOCO4.md`.

**4.4 — REMOVIDO DA ETAPA 4 / ABSORVIDO PELO EIXO FUTURO DE LANDING**
- não será executado como bloco separado;
- polimento da Landing será consolidado com a etapa já existente de Landing/Galeria/conteúdo público;
- definição final dessa etapa consolidada ocorrerá somente após o merge da ETAPA 4.

Checkpoint final — 03/10/2026:
- 4.1 — equipe e associação: ✅ validado;
- 4.2 — responsáveis/ownership por Robot: ✅ validado;
- 4.3 — inscrição individual + Robot: ✅ validado;
- bateria manual 1–40: ✅ concluída;
- regressão focal R1–R17: ✅ concluída;
- documentação funcional: `REGRAS_PARTICIPANTE.md`;
- validação histórica: `VALIDACAO_ETAPA4_BLOCO4.md`;
- ETAPA 4: ✅ CONCLUÍDA / VALIDADA;
- antigo 4.4: removido como bloco independente e reservado para consolidação futura com Landing/Galeria.

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

**Prioridade:** pós-publicação. Esta etapa **não bloqueia a V1 Beta**; o conjunto DEV já existente é suficiente para o primeiro go-live. Melhorias administrativas avançadas serão retomadas depois que o site estiver no ar e estabilizado.

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

**Objetivo:** completar a modalidade competitiva após a Beta. A inscrição simples já terá sido antecipada na V1-BETA C; esta etapa trata o domínio funcional da competição.

Ponto crítico já identificado:

- a inscrição de Futebol não deve exigir Robot próprio;
- os robôs podem ser fornecidos/atribuídos pela organização;
- não criar Robot fictício apenas para satisfazer FK;
- a V1 Beta resolve somente o contrato mínimo de inscrição sem Robot próprio;
- esta etapa fecha atribuição de robô, partida, placar, duração, empate/desempate, chaveamento, inspeção e penalidades.

Antes da migration, fechar regras de equipe, atribuição de robôs, placar, duração, empate/desempate, formato, inspeção e penalidades.

## ETAPA 7 — Portal do Participante completo + identificação competitiva

**Objetivo:** ampliar e fechar o Portal após a consolidação básica feita no BLOCO 4 da ETAPA 4.

> O BLOCO 4 da ETAPA 4 é responsável pelo fluxo básico indispensável: associação a equipe, convite/aceite, responsabilidade por robô e visibilidade correta de líder x membro. A ETAPA 7 amplia esse portal para a experiência completa do MVP.

Completar/consolidar:

- refinamentos do fluxo de equipe já consolidado no BLOCO 4;
- integrantes e papéis avançados da equipe;
- robôs, responsáveis e fotos;
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

**Objetivo:** permitir alimentar e controlar a apresentação do conteúdo público sem editar Vue nem realizar commit para cada mudança editorial.

Área editorial para MIDIA/DEV, com conceitos como:

- MediaAsset;
- ContentSlot;
- ContentItem;
- publicação/despublicação;
- ordem/destaque;
- créditos e metadados;
- imagens e mídia reutilizáveis;
- **modo editorial global da Landing: INSTITUCIONAL | COMPETITIVO**.

### Controle editorial do modo da Landing

O Gestor de Mídia deve permitir que `MIDIA | DEV` alterem a apresentação pública entre:

```text
MODO INSTITUCIONAL
→ Landing exibe somente conteúdo institucional/editorial
→ conteúdo competitivo atual fica oculto da Home
→ não altera Competition.vigente
→ não altera status da competição
→ não fecha/reabre inscrições
→ não altera chaves, resultados, ranking ou operação

MODO COMPETITIVO
→ Landing pode exibir a Competition vigente quando ela também estiver ativa e em status público
→ sem Competition vigente/publicável, a Landing permanece institucional
```

A configuração é **editorial e independente da semântica competitiva**. Seu objetivo é permitir retirar temporariamente informações competitivas da Landing — por revisão, correção, manutenção ou decisão de comunicação — sem desmontar o contexto operacional usado pela GESTAO.

Requisitos previstos:

- fonte de verdade no backend/MySQL, não em `localStorage` ou variável de build;
- leitura pública do modo atual pela Landing;
- alteração permitida somente a `MIDIA | DEV`;
- mudança sem novo build/deploy;
- registrar quem alterou e quando; justificativa pode ser incluída no histórico editorial;
- a UI deve deixar claro que **MODO INSTITUCIONAL não pausa inscrições nem a competição**;
- o modo `COMPETITIVO` nunca força publicação de competição inexistente, não vigente, inativa ou fora dos status públicos;
- preservar o comportamento atual de segurança: ausência de vigente publicável sempre resulta em apresentação institucional.

Modelo conceitual esperado:

```text
LandingPublicationMode
├─ INSTITUTIONAL
└─ COMPETITIVE

Competition.vigente
→ contexto esportivo/operacional

LandingPublicationMode
→ decisão editorial de exposição pública
```

Os dois conceitos não devem ser acoplados.

Reutilizar `ObjectStorageService` + Cloudflare R2 quando aplicável. Não criar um terceiro mecanismo de upload.

Esta etapa é parte do MVP porque hoje a permissão MIDIA existe, mas o site ainda não possui fluxo real de alimentação e controle editorial.

## ETAPA 9 — Landing + Galeria + conteúdo público real — ⚠️ SERÁ CONSOLIDADA/REPLANEJADA

> Decisão de 03/10/2026: esta entrega absorverá também o polimento da Landing que antes aparecia como BLOCO 4.4. Antes de iniciar o próximo trabalho, serão decididos nome, numeração, posição e escopo definitivo da etapa única. Este trecho permanece como inventário funcional, não como ordem final já aprovada.

**Objetivo-base:** consolidar a experiência pública usando API pública + CMS + mídia real.

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

### Fechamento público da competição — Hero de campeões

Na parte final do roadmap original, validar e concluir também a transição editorial do Hero de introdução da competição depois que os resultados oficiais forem consolidados.

Regra planejada:

```text
categoria ainda em disputa
→ Hero mantém foco em competição/status/acompanhamento

categoria com 1º + 2º + 3º definidos
→ resultado continua disponível na section competitiva

edição com resultados consolidados
→ Hero de introdução pode destacar os campeões por categoria
→ mostrar somente informação final/oficial
→ não substituir a section detalhada de resultados
```

Objetivo visual:

- transformar o Hero em uma vitrine final da edição depois da definição dos resultados;
- destacar os campeões das categorias sem carregar histórico de partidas no Hero;
- consumir exclusivamente o resultado oficial consolidado pelo backend;
- preservar responsividade e legibilidade quando houver várias categorias;
- definir na ETAPA 10 o comportamento quando apenas parte das categorias já estiver concluída;
- não hardcodar campeão, equipe ou categoria.

Essa melhoria é preservada no **roadmap original** e não é requisito para reabrir o fechamento visual já aprovado da V1-BETA A.

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

## ETAPA 14 — Hardening de segurança + preparação de carga

**Objetivo:** preparar o RasComp para exposição real e para o pico operacional de uma competição.

### Segurança obrigatória

Revisar e testar, entre outros:

- SQL injection e manipulação de filtros/parâmetros;
- queries sempre parametrizadas via JPA/repositories, sem concatenação insegura;
- validação de payloads e limites de tamanho;
- autenticação, JWT, expiração e autorização por role/ownership;
- brute force/login abusivo;
- rate limiting por IP/usuário/endpoint sensível;
- proteção contra rajadas de requisições que possam saturar API ou banco;
- limites de upload e tipos de arquivo;
- timeouts, connection pool e limites de concorrência;
- CORS, headers de segurança e HTTPS;
- secrets fora do código;
- usuário do banco com menor privilégio necessário;
- logs/auditoria de eventos suspeitos;
- respostas 429/4xx sem derrubar o processo;
- proteção no edge/WAF quando disponível;
- nenhum endpoint administrativo exposto sem autenticação/autorização.

### Teste de carga genérico

Preparar uma suíte reproduzível para medir:

- leitura pública;
- login/autenticação;
- APIs do participante;
- APIs da GESTAO;
- operações de escrita;
- uploads controlados;
- picos curtos e carga sustentada;
- recuperação depois do pico.

Registrar pelo menos:

```text
throughput
latência p50 / p95 / p99
taxa de erro
CPU
memória
pool de conexões
uso do MySQL
timeouts
429/5xx
tempo de recuperação
```

O teste deve rodar em ambiente autorizado de staging/homologação equivalente à produção. Não executar carga destrutiva contra serviços de terceiros ou produção real sem janela/controladoria específica.

## ETAPA 15 — Validação final + testes de carga pré-competição

**Objetivo:** provar que a versão candidata à primeira competição oficial está funcional, segura e suporta a escala prevista.

### 15.1 Validação funcional final

Reexecutar fluxos críticos e permissões com dados próximos do real.

### 15.2 Carga genérica

Executar a suíte genérica definida na ETAPA 14 e estabelecer baseline da versão candidata.

### 15.3 Cenário específico — competição com 300 a 500 participantes

Criar massa sintética representativa de uma edição real com **300–500 pessoas**, equipes, Robots, categorias e Registrations.

A simulação deve cobrir o ciclo completo, incluindo tráfego concorrente representativo de:

```text
cadastro / login
→ criação/entrada em equipe
→ Minha inscrição
→ comprovantes
→ cadastro/associação de Robot
→ inscrições competitivas
→ análise/aprovação pela GESTAO
→ consultas públicas/Portal
→ geração e leitura de chaves
→ atualizações de partidas
→ Follow: tomadas/tentativas/tempos/ranking
→ Sumô: partidas/rounds/resultados/progressão
→ atualização de ranking/resultados públicos
→ múltiplos usuários consultando enquanto a GESTAO grava resultados
```

Não basta cadastrar 500 registros e fazer uma única requisição. O cenário precisa reproduzir:

- carga sustentada;
- concorrência de leituras e escritas;
- picos após divulgação de resultado/chave/ranking;
- operações administrativas simultâneas;
- atualização pública frequente durante a competição.

A quantidade exata de usuários simultâneos/RPS deve ser calibrada para um evento de 300–500 participantes e revisada com métricas da Beta, em vez de assumir que todos estarão enviando requisições ao mesmo tempo.

### 15.4 Critério de aceite

Definir limites objetivos antes do teste, incluindo:

- zero corrupção/perda de dados;
- zero duplicidade causada por concorrência;
- integridade de chaves/progressão;
- rankings coerentes;
- operações críticas concluídas dentro de latência aceitável;
- ausência de crescimento descontrolado de memória/conexões;
- taxa de erro dentro do limite aprovado;
- recuperação automática após pico;
- proteção/rate limiting funcionando sem bloquear o uso legítimo.

Qualquer gargalo encontrado volta para correção em ambiente não-prod e o teste é repetido.

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
BLOCO 3 — Operação competitiva                                🛠️ CORREÇÕES FINAIS / AGUARDANDO RE-SMOKE
BLOCO 4 — Portal do Participante atual                        ⏳
FECHAMENTO — Smoke geral do sistema + Landing/Galeria básica  ⏳
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
169 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V19 + testdata ✅
```

V1–V19 são imutáveis. Próxima migration estrutural: **V20+**.

### Decisões deixadas para o fechamento manual

1. **Janela operacional do Follow:** o backend hoje exige inscrição ativa/aprovada e contexto autorizado, mas não força `Competition.status == EM_ANDAMENTO`. Decidir se tentativas/ausências devem ser bloqueadas fora de `EM_ANDAMENTO`.
2. **Follow sem tentativa classificável — RESOLVIDO:** ao encerrar o programa normal sem nenhuma tentativa classificável, o resultado não escolhe vencedor automaticamente. A organização decide entre criar uma **Tomada Extra** excepcional ou registrar uma **decisão administrativa** escolhendo o robô que chegou mais perto de completar o percurso.

Após a bateria manual final e essas decisões, o BLOCO 3 poderá ser marcado como CONCLUÍDO/VALIDADO.


### Decisão 2 do fechamento — Follow sem tentativa classificável — RESOLVIDA

Contrato aprovado em 24/09/2026:

```text
programa normal encerrado
+
nenhuma tentativa válida/classificável

→ resultado continua pendente
→ a organização escolhe UMA saída:

A) Tomada Extra
   → chamada competitiva real
   → agenda/horário/pista/fila
   → número excepcional = numeroTomadas + 1
   → não altera ConfigFollow.numeroTomadas
   → aceita tentativas/ausência apenas após autorização explícita
   → se produzir tentativa classificável, ranking normal define o vencedor

OU

B) Decisão da organização
   → DEV/GESTAO escolhe uma Registration elegível
   → checkpoints máximos podem ser exibidos como evidência de apoio
   → o sistema NÃO escolhe automaticamente por checkpoints
   → justificativa obrigatória
   → responsável e data/hora auditados
   → não inventa tempo classificável
```

Se uma Tomada Extra já tiver sido aberta, a decisão administrativa só fica disponível após essa chamada ser encerrada/cancelada e continuar sem tentativa classificável.

Implementação:

- V19 cria `follow_manual_results`;
- `FollowResolutionService` centraliza elegibilidade de Tomada Extra/decisão;
- `POST /api/v1/agenda-follow/tomada-extra`;
- `POST /api/v1/resultados-competicao/follow/decisao-organizacao`;
- Resultados oferece as duas ações quando elegíveis;
- Follow/console/Agenda reconhecem a Tomada Extra sem alterar o formato oficial da categoria;
- Resultado manual guarda vencedor, responsável, justificativa e data/hora.

Checkpoint:

```text
Frontend Checks #224 ✅
Backend Tests #517 ✅
169 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V19 + testdata ✅
```

Resta apenas a decisão 1 do fechamento manual do BLOCO 3: definir se tentativa/ausência de Follow deve ser bloqueada pelo backend quando a Competition não estiver `EM_ANDAMENTO`.


## Correções finais do BLOCO 3 — 30/09/2026

A bateria manual 1–56 foi concluída e gerou uma rodada concentrada de correções antes do re-smoke.

Entraram no BLOCO 3, por serem necessidades operacionais imediatas do cliente:

- pódio oficial 1º/2º/3º em Resultados;
- Follow normal/extra: pódio derivado do ranking;
- Follow sem tempo classificável: decisão administrativa passa a registrar pódio ordenado e auditado;
- Sumô: disputa automática de 3º lugar entre os dois perdedores das semifinais;
- estado competitivo derivado `ELIMINADO` sem converter a inscrição em `DESCLASSIFICADA`;
- tela Chaves mais independente: árvore, histórico, geração/regeneração e auditoria no próprio módulo;
- correção excepcional de vencedor pelo DEV, com justificativa, auditoria e bloqueio se a dependência seguinte já iniciou;
- BYE explicitado como avanço automático;
- Resultados com histórico de partidas do Sumô + tomadas/tentativas do Follow, filtrável por categoria;
- campeões/pódio já definidos passam a aparecer também no Dashboard;
- hardening do carregamento da arena para evitar loading indefinido.

### Entrada manual / robô avulso — necessidade do cliente incorporada

Fluxo aprovado e implementado:

```text
participante cria a própria conta PARTICIPANTE
→ DEV abre Inscrições > Adicionar robô avulso
→ seleciona a conta do participante
→ associa/cria o Competitor na equipe correta
→ cria o Robot vinculado à equipe
→ cria Registration APROVADA com histórico ENTRADA_MANUAL
```

Regras:

- operação exclusiva do DEV;
- justificativa obrigatória;
- não reabre inscrições públicas;
- a conta PARTICIPANTE deve existir e estar ativa;
- se já existir Competitor para a conta, o vínculo de equipe é respeitado;
- Follow: o novo robô pode ser sincronizado nas próximas chamadas e tomar tempo normalmente;
- Sumô: a inscrição é criada, mas a inspeção APTO continua obrigatória;
- depois da inspeção, o DEV pode gerar uma nova chave pelo módulo Chaves;
- se a competição já estiver `EM_ANDAMENTO`, a regeneração é excepcional, exige justificativa e arquiva a chave anterior;
- a regeneração excepcional continua **bloqueada se a chave vigente já possuir disputa competitiva real**; não se apaga nem reescreve uma chave já disputada.

Essa implementação antecipa apenas essa necessidade concreta. A ETAPA 5 continua responsável pelas demais operações gerais DEV e auditoria.


### Revisão 01/10/2026 — aprovação dupla no BLOCO 4.3

Antes da validação manual, o fluxo foi refinado:

- inscrição pessoal por Competition, com dados + comprovante + PENDENTE/APROVADA/REJEITADA;
- inscrição do Robot por Competition/Category, também com comprovante e aprovação própria;
- Team/Competitor/RobotResponsible continuam independentes da aprovação competitiva;
- competidores da inscrição do Robot devem ser RobotResponsible daquele Robot;
- líder não é competidor automático do Robot;
- Robot pode ser enviado enquanto participantes associados estão PENDENTE; para ser APROVADO, precisa existir pelo menos um responsável pessoalmente APROVADO na mesma Competition;
- GESTAO deve visualizar Robot ↔ Competitor nos dois sentidos durante a análise;
- backend bloqueia aprovação cruzada incoerente;
- 4.4 permanece bloqueado até implementação + bateria manual do novo 4.3.

Checkpoint de implementação do mesmo dia:

- V25 implementa a base persistente da inscrição pessoal e os comprovantes das duas inscrições;
- Portal recebeu Minha inscrição pessoal + comprovantes;
- Registration do Robot passou a aceitar somente RobotResponsible;
- aprovação do Robot exige pelo menos um responsável com inscrição pessoal APROVADA; responsáveis PENDENTE/REJEITADA não bloqueiam o Robot, apenas não entram na composição oficial;
- GESTAO recebeu visão cruzada Competitor → Robots e Robot → Competitors;
- N:N está coberto no testdata com Vespa → Membro + Apoio e Apoio → Vespa + Atlas;
- alterações de RobotResponsible antes do início da Competition sincronizam automaticamente a composição competitiva;
- CI/testdata foi preparado para o fluxo duplo, mas o checkpoint automatizado ainda não foi executado nos heads atuais;
- 4.3 permanece aberto até build + bateria manual;
- 4.4 permanece NÃO INICIADO.


### Sequenciamento obrigatório — inscrição pessoal antes do robô

Para garantir cadastro separado e em ordem sem obrigar o participante a aguardar análise administrativa:

```text
1. PARTICIPANTE envia Minha inscrição
   → ParticipantCompetitionRegistration = PENDENTE

2. A existência da inscrição pessoal PENDENTE ou APROVADA
   → libera Inscrever robô

3. PARTICIPANTE envia Registration do Robot
   → Registration = PENDENTE

4. GESTAO analisa
   → primeiro aprova as pessoas
   → depois pode aprovar o Robot
```

Regras:

- antes de existir inscrição pessoal `PENDENTE` ou `APROVADA` na Competition, o botão de inscrição de Robot fica bloqueado;
- não é necessário aguardar a aprovação pessoal para criar a inscrição do Robot;
- cada responsável considerado para a competição precisa possuir inscrição pessoal na mesma Competition;
- para aprovar o Robot, é suficiente existir **pelo menos um** responsável com inscrição pessoal `APROVADA`;
- responsáveis `PENDENTE` não bloqueiam a aprovação do Robot, mas ainda não entram na composição oficial;
- responsáveis `REJEITADA` ou `CANCELADA` não entram na composição oficial e também não bloqueiam o Robot enquanto existir pelo menos um responsável `APROVADA`;
- inscrição pessoal `REJEITADA` ou `CANCELADA` não libera nova inscrição de Robot;
- o backend repete todas essas validações, independentemente da interface.


### Regra revisada — sincronização automática da composição competitiva

A regra anterior que exigia nova aprovação completa do Robot após alteração de responsáveis foi descartada.

Fluxo canônico:

```text
Competition ainda não iniciou
+
líder altera RobotResponsible
↓
sistema sincroniza Registration.competitors automaticamente
↓
Registration APROVADA permanece APROVADA
↓
GESTAO recebe aviso/auditoria
↓
GESTAO pode vetar a mudança específica com justificativa
```

Elegibilidade:

- responsável com inscrição pessoal `APROVADA` entra automaticamente na composição oficial;
- responsável com inscrição pessoal `PENDENTE` pode permanecer associado ao Robot, porém só entra oficialmente na composição competitiva quando sua inscrição pessoal for aprovada;
- responsável removido antes do início da competição sai automaticamente da composição daquela Registration;
- se a composição ficar sem nenhum competidor elegível, aplicam-se as regras de rejeição/regularização da Registration do Robot.

Limite temporal:

```text
Competition.status == EM_ANDAMENTO
OU
data atual >= Competition.dataInicio

→ Registration.competitors congelado
→ líder/participantes não alteram composição pelo fluxo normal
```

A Gestão não precisa reaprender/reaprovar o Robot inteiro a cada ajuste. O controle é por **notificação + auditoria + veto justificado da alteração específica**.

O veto administrativo é contextual à Competition/Registration. Ele não precisa apagar o vínculo permanente `RobotResponsible`, pois esse vínculo pode continuar relevante para futuras competições.


### Regra consolidada — aprovação do Robot com elegibilidade parcial

A aprovação da Registration do Robot **não exige aprovação pessoal de todos os RobotResponsible**.

Exemplo:

```text
Vespa
├─ Gabriel → REJEITADA
├─ João    → PENDENTE
└─ Maria   → APROVADA
```

Resultado:

```text
Maria é responsável elegível ✅
→ Vespa pode ser APROVADO
```

Composição oficial naquele instante:

```text
Registration.competitors
└─ Maria
```

Gabriel permanece fora da composição oficial porque sua inscrição pessoal foi rejeitada.

João continua associado ao Robot como `RobotResponsible`, porém não integra a composição oficial enquanto sua inscrição pessoal estiver `PENDENTE`. Se João for aprovado antes do início da Competition, ele entra automaticamente na composição e a GESTAO recebe aviso/auditoria da alteração.

Regra de decisão:

```text
>= 1 responsável com inscrição pessoal APROVADA
→ Robot pode ser APROVADO

0 APROVADOS + existe ao menos 1 PENDENTE
→ Robot permanece PENDENTE

0 APROVADOS + todos os responsáveis REJEITADOS/CANCELADOS
→ Robot Registration é REJEITADA automaticamente
→ motivo: sem responsável elegível
```

A rejeição pessoal nunca remove automaticamente o vínculo permanente `RobotResponsible`; ela apenas retira a elegibilidade naquela Competition.


### Checkpoint V26 — regras do participante

A revisão 360 do BLOCO 4.3 consolidou ownership de Robot, elegibilidade parcial, composição automática, veto da GESTAO, rejeição/reinscrição do Robot e proteção/troca de liderança. A fonte específica passa a ser `docs/REGRAS_PARTICIPANTE.md`.

Estado: implementação revisada, **ainda não validada manualmente**. 4.4 segue bloqueado.


### Checkpoint pós-bateria 4.3 — 03/10/2026

A bateria 1–40 foi executada. Os achados originaram V27 e ajustes de UX/regra: edição/remoção segura de Robot, descrição snapshot na Registration, métricas/filtro/título mais claros, líder visível, veto de composição realmente reversível e consolidação automática de mudanças não vetadas no início da Competition.

O BLOCO 4.3 permanece aberto apenas para a regressão focal R1–R15 e confirmação de build/testes. O BLOCO 4.4 continua NÃO INICIADO.


---

## Encerramento canônico da ETAPA 4 — 03/10/2026

**Status final: ✅ CONCLUÍDA / VALIDADA MANUALMENTE / AUTORIZADA PARA MERGE.**

A ETAPA 4 foi encerrada após:

- BLOCO 1 validado;
- BLOCO 2 validado;
- BLOCO 3 validado;
- BLOCO 4.1 — equipe e associação validado;
- BLOCO 4.2 — RobotResponsible / ownership validado;
- BLOCO 4.3 — inscrição individual + inscrição de Robot validado;
- bateria manual principal **1–40 concluída**;
- regressão pós-bateria **R1–R17 concluída**;
- correções finais de status, liderança, veto, ciclo operacional e entrada manual DEV validadas pelo usuário;
- migrations atuais consolidadas até **V27**;
- documentação cross-repo revisada e sincronizada.

Decisões finais relevantes:

- Minha inscrição e inscrição do Robot são fluxos separados;
- RobotResponsible permanece N:N e separado de ownership;
- composição competitiva é automática e depende de elegibilidade;
- um responsável APROVADO já permite aprovação do Robot;
- alterações antes da prova valem automaticamente e podem ser vetadas pela GESTAO;
- mudanças não vetadas são consolidadas no início;
- composição/responsabilidade ficam congeladas durante a Competition;
- líder atual possui proteção contra rejeição definitiva;
- DEV pode transferir liderança com auditoria;
- DEV pode incluir participante/Robot de forma excepcional e auditada, inclusive durante EM_ANDAMENTO;
- Portal do Participante e GESTAO refletem o mesmo Registration.status, com atualização do Portal ao retornar à aba;
- edição/remoção segura de Robot e descrição snapshot da Registration estão consolidadas.

### Decisão de fronteira após o encerramento

O antigo **BLOCO 4.4 — polimento/landing** deixa de existir como continuação da ETAPA 4.

O trabalho de:

```text
polimento da Landing
+
Landing/Galeria/conteúdo público já previsto no roadmap
```

será tratado como **uma única etapa futura consolidada**.

A numeração, o nome definitivo, a prioridade relativa e o escopo dessa etapa única **não são definidos neste fechamento**. Eles serão decididos antes de iniciar o próximo trabalho.

### CI / build remoto

Não havia execução nova registrada do GitHub Actions nos heads finais no momento deste fechamento. Portanto, este documento **não declara CI remoto verde**.

O encerramento desta etapa é baseado na validação manual completa realizada pelo usuário e na autorização explícita de merge em 03/10/2026.


---

### Decisões futuras preservadas após a ETAPA 4

Estas decisões continuam no planejamento e **não são alteradas pelo encerramento da ETAPA 4**:

- Ajustes DEV: operação explícita/auditável para encerrar ou cancelar chave vigente e gerar outra quando uma correção estrutural exigir, preservando histórico e justificativa;
- Futebol de Robôs: cronômetro operacional com **2 minutos como referência atual/configurável**, placar por gols e persistência do resultado oficial;
- Follow: possível divisão **Pro/Júnior** somente em pós-produção e mediante confirmação da competição; no MVP atual, Follow continua categoria única.

---

## Decisão de publicação Beta — 03/10/2026

Motivação: disponibilizar o RasComp ao público e iniciar divulgação/inscrições antes da conclusão integral do roadmap.

Sequência aprovada:

```text
1. finalizar/polir Landing
2. configurar V1 de produção + cloud + banco
3. abrir cadastro/login/inscrições reais
4. validar V1 Beta em produção
5. retomar roadmap oficial
6. desenvolver etapas seguintes em ambiente não-prod
7. merge/deploy em produção somente depois de testes
```

Esta decisão não transforma produção em ambiente de testes e não elimina as etapas restantes.
---

## Gate não negociável de abertura da V1 Beta

A organização **não abre inscrições reais** até todos estes pontos estarem confirmados:

```text
[ ] MySQL de produção persistente
[ ] backup configurado + restore documentado/testável
[ ] Flyway validado no banco de produção
[ ] storage persistente dos comprovantes
[ ] contas verificadas reais de operação
[ ] Competition real correta
[ ] categorias reais corretas
[ ] janela de inscrições correta
[ ] ausência de testdata/demos na base
[ ] smoke completo com conta criada do zero
[ ] fluxo Gestão aprova inscrição real de teste
[ ] Portal/estado público refletem o resultado
```

Se um item estiver pendente, a publicação pode permanecer em smoke interno, mas **não pode ser anunciada como inscrições abertas**.

Ajustes Gerais DEV não fazem parte desse gate e serão tratados após o site estar no ar.

---

### Política de branches do trilho Beta

Cada fase é isolada:

```text
v1-beta-a-landing
v1-beta-b-producao
v1-beta-c-inscricoes
v1-beta-d-estabilizacao
```

Regra:

```text
fase atual
→ testes/validação
→ merge em main
→ próxima branch criada do novo main
```

Não criar todas as branches antecipadamente, evitando que fases futuras partam de uma base desatualizada.


---

## CHECKPOINT OBRIGATÓRIO — primeira competição oficial

A existência da V1 Beta online **não autoriza automaticamente** usar a plataforma na primeira competição oficial.

Antes da competição, confirmar:

```text
[ ] hardening de segurança concluído
[ ] testes de injection/validação/autorização aprovados
[ ] rate limiting/proteção contra rajadas configurados
[ ] carga genérica aprovada
[ ] cenário RRC 300–500 aprovado
[ ] integridade de inscrições/chaves/resultados/rankings aprovada
[ ] backup + restore novamente verificados
[ ] observabilidade/alertas operacionais disponíveis
[ ] plano de rollback/contingência documentado
[ ] versão candidata congelada e validada em staging
```

Se o cenário de carga ou segurança falhar, a primeira competição oficial não deve usar aquela versão até correção e nova validação.


---

### Duas vias aprovadas para operação da competição

A arquitetura da V1 Beta e da primeira competição oficial deve preservar duas formas válidas de operação.

#### VIA A — Cloud principal

```text
Internet
→ Cloudflare
→ frontend publicado
→ backend/API em produção
→ MySQL persistente
→ storage persistente
```

É a via preferencial quando os testes de carga, limites do provedor e estabilidade forem satisfatórios.

#### VIA B — Servidor local + Cloudflare Tunnel

```text
Internet
→ domínio Cloudflare
→ Cloudflare Tunnel
→ servidor/PC local do evento
   ├─ Landing/Gestão
   ├─ Spring Boot
   ├─ MySQL
   └─ storage local
```

Também deve ser possível acessar o mesmo servidor pela rede local/LAN quando necessário.

A VIA B pode ser adotada:

- como contingência;
- como operação principal temporária do evento;
- quando houver dúvida sobre capacidade/custo/limite da VIA A;
- quando os testes mostrarem que a máquina local oferece margem mais previsível.

A escolha final deve ser tomada após os testes de carga e o ensaio de contingência.

Não depender de reescrita do RasComp para alternar entre VIA A e VIA B.

A configuração de API, banco, storage e URLs deve permanecer por ambiente.

Se VIA B for adotada no evento, o servidor local passa a ser a fonte de verdade durante aquela operação.

Não manter VIA A e VIA B gravando em bancos independentes ao mesmo tempo sem mecanismo explícito de sincronização.


## Fechamento formal da V1-BETA A — 05/10/2026

Status: **✅ CONCLUÍDA / VALIDADA / PRONTA PARA MERGE**

Escopo fechado:

- Landing institucional pública revisada e polida;
- responsividade desktop/tablet/mobile validada;
- Header, Hero, Sobre, Equipe, Robôs, Premiações, Galeria, Eventos e Footer;
- competição pública integrada ao ciclo real;
- ranking Follow, agenda/tomadas, chaveamento, BYE, 3º lugar e pódios;
- regra pública: histórico durante disputa e somente Top 3 após pódio completo;
- logos públicas de equipes com fallback;
- chave read-only no Portal do Participante;
- lotes de inscrição integrados e validados;
- Hero mostrando lote vigente real;
- documentação e regras sincronizadas;
- modo local preservado.

Pendência deliberadamente movida para o roadmap original:

- Hero pós-competição destacando campeões por categoria na etapa final de fechamento do MVP.

A branch `v1-beta-a-landing` não deve receber novos requisitos após o merge, salvo correção de regressão.

## Gate de planejamento antes da V1-BETA B

A B ainda **não está iniciada**. Antes do primeiro commit, discutir e aprovar:

```text
identidade real de conta
→ verificação de e-mail
→ ativação
→ login
→ recuperação segura de senha
```

Princípios já aceitos para discussão:

- coletar somente o mínimo necessário;
- posse do e-mail deve ser verificada;
- reduzir contas falsas/descartáveis sem introduzir coleta excessiva de dados pessoais;
- recuperação de senha deve funcionar por token/código de uso único, com expiração;
- resposta de recuperação não pode revelar se a conta existe;
- senha definitiva nunca deve ser visível ao DEV;
- fluxo assistido pelo DEV pode existir apenas como fallback auditado;
- escolher provedor de e-mail antes da implementação;
- acesso remoto de homologação deve estar disponível já no início da B, sem confundir isso com produção aberta;
- modo local e Cloudflare Tunnel permanecem como contingência oficial.


### Checkpoint automatizado final da V1-BETA A — 05/10/2026

Validação executada no PR de fechamento:

```text
Backend Tests #527
→ 211 testes
→ 0 falhas
→ 0 erros
→ 0 skipped
→ BUILD SUCCESS
→ portal-testdata ✅

Frontend Checks #233
→ Gestão typecheck ✅
→ Gestão build ✅

Landing Checks #21
→ Landing typecheck ✅
→ Landing build ✅
```

Durante o fechamento, o primeiro run do backend revelou testes antigos desalinhados com regras já consolidadas. Os testes foram corrigidos para refletir os contratos atuais — sem relaxar as regras de negócio — e a suíte completa voltou a ficar verde.

Com validação manual + CI final verde, a V1-BETA A está autorizada para merge em `main`.


### Regra de publicação competitiva — 06/10/2026

- ausência de competição vigente é estado válido;
- GESTAO deve continuar navegável sem edição vigente;
- foco DEV é local e não publica uma edição;
- Landing e novas inscrições só enxergam a competição explicitamente vigente quando ela estiver em status público;
- remover a vigente devolve o site ao modo institucional sem apagar a edição/histórico.
