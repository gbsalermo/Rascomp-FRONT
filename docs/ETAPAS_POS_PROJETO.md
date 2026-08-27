# RasComp — Etapas Pós-Projeto

Última atualização: **26/08/2026**

Este documento reúne o ciclo de evolução do RasComp após a aprovação da versão atual. Ele é o roteiro de trabalho para corrigir, endurecer, generalizar e expandir o sistema sem perder as regras que já foram validadas.

O objetivo deste ciclo não é reescrever o projeto. A base atual será preservada e evoluída por etapas pequenas, testáveis e reversíveis.

Documentos complementares:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
→ mapa técnico: onde está cada coisa e o que alterar

docs/CONTINUIDADE_FRONTEND.md
→ estado funcional do frontend

backend: rascomp/docs/CONTINUIDADE.md
→ estado funcional do backend
```

---

# 1. Direção pós-aprovação

O RasComp passa a ter cinco frentes principais:

```text
1. estabilização e correção da base atual
2. segurança e administração por permissões
3. expansão funcional
4. gestão de conteúdo e comunicação
5. portabilidade para outras instituições
```

O backend continua sendo a fonte de verdade para regras competitivas, permissões, elegibilidade, resultados, ranking e progressão.

O frontend não deve ganhar atalhos que permitam contornar essas regras apenas escondendo ou exibindo botões.

---

# 2. Escopo de aplicações

Hoje o projeto possui:

```text
BACKEND
Rascomp/rascomp/
→ Spring Boot + MySQL + Flyway + JWT

FRONTEND AUTENTICADO
gestao/
→ DEV + GESTAO + MIDIA + PARTICIPANTE

SITE PÚBLICO
landing-page/
→ site institucional + acompanhamento do RRC

GALERIA
photo-gallery/
→ protótipo público separado, a ser consolidado futuramente
```

Objetivo de portabilidade desta rodada:

```text
backend + gestao
→ utilizáveis por outras instituições
```

A Landing pode continuar sendo uma experiência institucional personalizada, mas deve consumir dados e conteúdo por contratos que não dependam de regras exclusivas da RAS UFRB.

---

# 3. Estratégia de portabilidade institucional

A primeira meta NÃO é transformar o RasComp em um SaaS multi-tenant.

Estratégia inicial:

```text
1 instalação do RasComp
=
1 instituição organizadora
```

A instituição hospedeira deve poder configurar a instância sem alterar código-fonte.

Informações que devem deixar de ficar hardcoded onde forem relevantes para backend/gestão:

```text
nome da instituição organizadora
sigla
nome público da plataforma/evento quando configurável
logos
contatos
links institucionais
identidade visual permitida
informações administrativas
parâmetros operacionais gerais
```

Não confundir essa configuração com `Institution`, que hoje representa instituições associadas às equipes participantes.

Criar no futuro um conceito separado, por exemplo:

```text
SystemOrganizationConfig
ou
PlatformInstanceConfig
```

O nome definitivo deve ser decidido na implementação.

Multi-tenancy compartilhando o mesmo banco pode ser estudado no futuro, mas fica explicitamente fora deste ciclo.

---

# ETAPA 0 — Baseline e congelamento da versão aprovada

Objetivo: manter uma referência confiável antes das mudanças pós-projeto.

- preservar o comportamento atualmente aprovado;
- manter CI de backend e frontend obrigatória;
- manter migrations já aplicadas imutáveis;
- usar o Dossiê Mestre como mapa técnico;
- qualquer nova migration entra após a versão atual;
- não misturar correção estrutural com nova funcionalidade no mesmo commit quando puder ser separado.

Resultado esperado:

```text
uma base conhecida
+
roadmap congelado
+
mudanças rastreáveis
```

---

# ETAPA 1 — Correções de lógica e riscos encontrados na revisão

Resolver antes das grandes funcionalidades novas.

## 1.1 Reativação de inscrição

Revisar `RegistrationService.reativar()`.

Hoje é possível reativar uma inscrição e devolvê-la para `PENDENTE` sem a mesma validação completa da janela de inscrições usada na criação.

Definir e implementar a regra correta.

## 1.2 Cancelamento de inscrição pelo participante

Fechar comportamento para:

```text
PENDENTE
APROVADA
CHAVE GERADA
COMPETIÇÃO EM ANDAMENTO
COMPETIÇÃO FINALIZADA
```

Uma inscrição que já interfere em chave, partida ou resultado não pode simplesmente desaparecer do fluxo competitivo.

## 1.3 Estados permitidos para geração/regeneração de chave

Definir em quais estados da competição é permitido:

```text
gerar chave
regenerar chave
operar chave
```

Não depender apenas de `ativo=true`.

## 1.4 Correção de resultado após progressão

Criar uma regra segura para resultado que já alimentou a próxima fase.

Não permitir que a simples edição de um vencedor deixe a próxima partida com participante incorreto.

Possíveis caminhos:

```text
bloquear edição após progressão
ou
operação DEV explícita de correção + reprocessamento
```

## 1.5 Estados de tentativa Follow

Formalizar combinações válidas de:

```text
concluida
valida
tempoSegundos
checkpoints
penalidade
```

Exemplos que precisam de regra explícita:

```text
concluida=true + tempo=null
valida=true + concluida=false
valida=true + tempo=null
```

## 1.6 Proteções administrativas futuras

Quando DEV existir:

- impedir que a instância fique sem nenhum DEV ativo;
- impedir desativação acidental do último DEV;
- validar operações estruturais no backend, não só na interface.

---

# ETAPA 2 — Limpeza técnica e organização de código

Objetivo: reduzir dívida antes de o sistema crescer.

## Backend

- remover artefatos de build/legado já rastreados no Git, incluindo `rascomp/bin/`;
- revisar comentários/TODOs antigos que contradizem implementação atual;
- revisar código morto e classes não utilizadas;
- revisar queries repetidas e fluxos redundantes;
- manter services como responsáveis por regra de negócio;
- não introduzir acesso direto a repository a partir de controllers para acelerar features.

## Frontend gestão

Refatoração gradual, sem big-bang.

Hoje `api.ts`, `types.ts` e algumas views concentram responsabilidades demais.

Direção sugerida:

```text
api/
├─ auth.ts
├─ competition.ts
├─ registration.ts
├─ participant.ts
├─ follow.ts
├─ sumo.ts
├─ football.ts
├─ notices.ts
├─ media.ts
└─ dev.ts

types/
├─ auth.ts
├─ competition.ts
├─ participant.ts
├─ follow.ts
├─ sumo.ts
├─ football.ts
├─ notices.ts
└─ media.ts
```

Views grandes devem ser quebradas somente quando a separação trouxer ganho real de manutenção.

## CSS

Revisar sobreposição entre folhas globais/corretivas e reduzir dependência de regras que sobrescrevem outras por ordem de importação.

---

# ETAPA 3 — Nova matriz de permissões

Substituir o modelo atual de duas roles pela matriz aprovada.

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

## DEV

Pode:

- acessar todas as áreas;
- criar, editar, desativar e corrigir competições;
- alterar permissões de usuários;
- editar/desativar inscrições conforme regras estruturais;
- transferir competidor entre equipes;
- trocar responsável da equipe;
- transferir robô entre equipes;
- acessar Ajustes Gerais;
- executar operações de manutenção;
- acessar ferramentas de Mídia e Gestão.

## GESTAO

Foco operacional do evento.

Pode, conforme regra do módulo:

- operar Follow Line;
- lançar tomadas/tentativas;
- operar Sumô;
- inspeções;
- lançar rounds/batalhas;
- acompanhar chave/resultados;
- revisar informações operacionais permitidas;
- publicar avisos operacionais quando autorizado.

Não pode:

- criar competição;
- conceder DEV;
- executar manutenção estrutural reservada a DEV.

## MIDIA

Foco editorial.

Pode:

- acessar Gestor de Mídia;
- criar/editar tópicos e conteúdo público;
- subir mídia;
- associar mídia a janelas/slots;
- gerir galeria e conteúdo institucional permitido.

Não ganha automaticamente acesso à operação competitiva.

## PARTICIPANTE

Pode somente os fluxos próprios:

- equipe sob sua responsabilidade;
- integrantes permitidos;
- robôs;
- fotos;
- inscrições;
- desempenho;
- avisos direcionados ao participante.

## Implementação

Segurança deve existir em duas camadas:

```text
backend
→ autorização real

frontend
→ navegação/UX compatível
```

Nunca considerar esconder um menu como segurança.

---

# ETAPA 4 — Ajustes Gerais DEV + auditoria

Criar uma área exclusiva de DEV para operações que hoje exigiriam acesso direto ao banco.

Exemplos:

```text
alterar role
ativar/desativar usuário
transferir competidor
transferir robô
trocar responsável da equipe
corrigir inscrição
reativar entidade
corrigir associação administrativa
```

Não criar uma interface genérica do tipo:

```text
editar tabela
editar coluna
executar SQL
```

Cada ação deve ter endpoint/service específico com validações de domínio.

## Auditoria

Toda operação estrutural DEV relevante deve registrar, quando aplicável:

```text
quem executou
o que foi alterado
entidade afetada
valor anterior
valor novo
data/hora
motivo/observação
```

Criar uma trilha consultável para manutenção e responsabilização técnica.

---

# ETAPA 5 — Portabilidade do backend + gestão para outras instituições

Objetivo: permitir reutilização sem fork estrutural.

## 5.1 Perfil da instância

Criar configuração da instituição que hospeda o RasComp sem reutilizar `Institution` das equipes.

Avaliar:

```text
nome
sigla
logos
contatos
links
identidade visual
nome do evento padrão
textos administrativos
```

## 5.2 Remover hardcodes institucionais do núcleo

Revisar backend e `gestao/` procurando textos, imagens, regras e defaults específicos da RAS UFRB que deveriam ser configuração.

Não é necessário remover identidade RAS da Landing institucional atual quando ela fizer parte do conteúdo público daquela instalação.

## 5.3 Configuração inicial

Planejar uma instalação nova com fluxo claro:

```text
subir backend
configurar banco
configurar JWT/storage
criar primeiro DEV
configurar instituição hospedeira
subir gestão
```

## 5.4 Documentação de instalação

Criar documentação suficientemente clara para uma equipe de outra instituição instalar e operar sem editar código Java/Vue para mudar nome e identidade básica.

---

# ETAPA 6 — Avisos ao participante

Novo módulo de comunicação operacional.

Objetivo inicial:

```text
GESTAO/DEV publica aviso
↓
participante visualiza em /minha-equipe ou área Avisos
```

Exemplos de uso:

- atraso de partida;
- mudança de arena;
- pausa técnica;
- alteração temporária de cronograma;
- chamada de equipe;
- problema de equipamento/infraestrutura;
- aviso geral da organização.

## 6.1 Versão inicial — in-app

Criar domínio próprio, sem depender do Telegram.

Modelo inicial sugerido:

```text
Notice / Aviso
├─ id
├─ titulo
├─ mensagem
├─ prioridade/tipo
├─ escopo
├─ competitionId? 
├─ categoryId?
├─ ativo/publicado
├─ publicadoPor
├─ publicadoEm
├─ expiraEm?
└─ dataCadastro
```

Escopos que podem ser úteis:

```text
GLOBAL
COMPETICAO
CATEGORIA
```

Escopo por equipe/participante pode ser adicionado depois somente se houver necessidade real.

Interface participante:

```text
Avisos
├─ não lidos/destaques
├─ avisos atuais
└─ histórico recente
```

A primeira versão não precisa de WebSocket. Pode usar atualização ao abrir a página e polling moderado durante competição em andamento.

## 6.2 Futuro — Telegram

A arquitetura do aviso não deve nascer acoplada ao Telegram.

Fluxo futuro recomendado:

```text
Aviso publicado
↓
NoticeDispatchService
├─ canal IN_APP
└─ canal TELEGRAM
```

Duas alternativas de Telegram:

### Canal/grupo institucional

Mais simples para broadcast geral.

### Bot associado à conta do participante

Permite mensagens direcionadas.

Fluxo possível:

```text
participante solicita vinculação
↓
sistema gera token temporário
↓
usuário inicia bot Telegram
↓
bot recebe token
↓
chatId fica associado ao UserAccount
```

Cuidados futuros:

- opt-in do participante;
- possibilidade de desvincular Telegram;
- não armazenar token do bot no frontend;
- segredo somente no backend/ambiente;
- log de falha de envio;
- retry controlado;
- rate limit;
- Telegram é canal complementar, nunca fonte de verdade do aviso.

---

# ETAPA 7 — Gestor de Mídia / CMS da Landing

Criar uma área autenticada dentro de `gestao/`, acessível a MIDIA e DEV.

Objetivo:

```text
editar a Landing sem alterar arquivo Vue
```

## Conteúdo

O usuário de mídia poderá:

- criar/editar tópico;
- publicar/despublicar;
- ordenar conteúdo;
- subir imagem/mídia;
- escolher onde a mídia será exibida;
- editar título/texto/CTA;
- gerir galeria;
- gerir conteúdos institucionais permitidos.

## Modelo sugerido

```text
MediaAsset
→ arquivo físico / ObjectStorageService / R2

ContentSlot
→ janela lógica da Landing

ContentItem
→ conteúdo editorial associado ao slot
```

Exemplos de slots:

```text
HERO_MAIN
HERO_NEWS
ABOUT
TEAM
AWARDS
GALLERY
EVENTS
COMPETITION_HIGHLIGHT
```

Não armazenar posição como seletor CSS ou nome de componente Vue.

A Landing consulta a API pública e renderiza conteúdo publicado.

## Storage

A infraestrutura de `ObjectStorageService` + Cloudflare R2 já existente deve ser reaproveitada.

Evitar criar um terceiro mecanismo de upload.

---

# ETAPA 8 — Módulo de Regras

Criar área pública de regras com cards/quadrados expansíveis.

Estrutura inicial:

```text
REGRAS
├─ Follow Line
├─ Sumô
│  ├─ geral
│  ├─ RC
│  ├─ penalidades
│  └─ desclassificação/WO
├─ Futebol de Robôs
└─ Ambiente / Vestimenta
```

Conteúdos esperados incluem:

- funcionamento;
- condições de vitória;
- penalidades;
- desqualificação;
- regras específicas RC;
- regras de segurança e ambiente.

Regras ambientais relatadas para futura redação oficial:

```text
não consumir alimentos na área de competição
não entrar com líquidos quando proibido pela área
regras de vestimenta compatíveis com ambiente técnico/laboratorial
restrições de sandália/short quando definidas oficialmente
cuidados para não danificar robôs/equipamentos
não interferir na operação de outras equipes
```

Importante: antes da publicação final, o texto deve ser validado pela organização. O software não deve inventar sanções ou redação oficial.

A gestão editorial dessas regras pode ficar sob MIDIA/DEV, mas mudanças de regras competitivas que afetam lógica do sistema devem passar também por revisão técnica do backend.

---

# ETAPA 9 — Futebol de Robôs

Adicionar nova modalidade:

```text
FUTEBOL
```

Conceito:

```text
participante A × participante B
robô fornecido pela organização A × robô fornecido pela organização B
```

A inscrição não deve exigir que o participante possua robô próprio.

## Impacto no domínio atual

Hoje a inscrição exige `Robot`.

Portanto será necessário alterar schema e regra de negócio, não criar robôs fictícios apenas para satisfazer FK.

Direção:

```text
Registration.robot
→ opcional quando a modalidade permitir

regra de duplicidade
→ varia por modalidade
```

Equipe:

- idealmente o participante continua associado a uma equipe;
- confirmar se equipe será obrigatória ou apenas recomendada antes da migration.

## Pontos ainda a decidir antes da implementação

```text
equipe obrigatória?
quantidade de participantes por inscrição?
robô A/B atribuído antecipadamente ou na arena?
formato de placar?
duração da partida?
empate/desempate?
penalidades?
chave eliminatória?
inspeção do participante/equipamento?
```

Reaproveitar `Match`/`MatchResult` onde fizer sentido, mas somente depois de corrigir a edição segura de resultados que já avançaram chave.

---

# ETAPA 10 — Completar Portal do Participante

Depois da nova segurança e das mudanças de domínio.

Completar:

- convite/aceite real para equipe;
- gestão de integrantes;
- gestão de robôs;
- inscrição em categorias;
- adaptação da inscrição para Futebol;
- gestão de fotos;
- avisos;
- histórico competitivo;
- responsividade;
- estados vazios/erros/feedback de ações.

Manter ownership validado no backend.

---

# ETAPA 11 — Consolidar Landing + Galeria + conteúdo público

Integrar o que hoje está separado entre:

```text
landing-page/
photo-gallery/
```

Decidir formalmente:

```text
A. manter Galeria como aplicação pública separada
ou
B. absorver Galeria na Landing
```

Direção preferencial para manutenção: absorver na Landing, salvo necessidade real de deploy/URL independentes.

A Landing passa a consumir:

```text
API pública competitiva
+
API pública de conteúdo/CMS
+
API pública de regras
+
mídias publicadas
```

Nenhum conteúdo editorial comum deveria exigir commit no frontend depois da consolidação do CMS.

---

# ETAPA 12 — Hardening, manutenção e preparação para uso externo

Antes de entregar o backend + gestão para outra instituição:

- revisar autorização endpoint por endpoint;
- revisar mensagens de erro;
- revisar logs;
- revisar CORS e configurações de ambiente;
- revisar upload/storage;
- revisar migrations do zero em banco limpo;
- revisar migrations em banco existente;
- revisar backup/restore;
- revisar configuração do primeiro DEV;
- revisar documentação de instalação;
- revisar documentação de atualização de versão;
- revisar seed/testdata para garantir que nunca rode em produção;
- revisar dados institucionais hardcoded;
- revisar acessibilidade e responsividade básica;
- revisar tratamento de indisponibilidade da API;
- revisar política de auditoria;
- revisar comportamento quando Telegram/R2 estiverem indisponíveis.

---

# 4. Ordem recomendada de execução

```text
ETAPA 0  baseline
    ↓
ETAPA 1  bugs/riscos de regra
    ↓
ETAPA 2  limpeza técnica
    ↓
ETAPA 3  DEV / GESTAO / MIDIA / PARTICIPANTE
    ↓
ETAPA 4  Ajustes Gerais + auditoria
    ↓
ETAPA 5  portabilidade institucional
    ↓
ETAPA 6  Avisos
    ↓
ETAPA 7  Gestor de Mídia
    ↓
ETAPA 8  Regras
    ↓
ETAPA 9  Futebol de Robôs
    ↓
ETAPA 10 Participante completo
    ↓
ETAPA 11 Landing/Galeria/CMS
    ↓
ETAPA 12 hardening para uso externo
    ↓
BATERIA MANUAL FINAL
```

A ordem pode receber pequenos ajustes conforme dependências descobertas, mas a nova matriz de permissões deve entrar antes das áreas MIDIA/DEV definitivas.

---

# 5. Critério para concluir cada etapa

Uma etapa só deve ser marcada como concluída quando tiver, conforme aplicável:

```text
regra definida
backend implementado
migration aplicada quando necessária
testes automatizados relevantes
frontend integrado
tratamento de erro
permissão correta
documentação atualizada
validação local
CI verde
```

Evitar marcar funcionalidade como concluída apenas porque a tela apareceu.

---

# 6. Bateria final de testes manuais — OBRIGATÓRIA

Após concluir as etapas pós-projeto, executar uma bateria manual ampla simulando o uso real do sistema.

Não detalhar os casos neste momento; apenas manter como requisito obrigatório de encerramento.

A bateria deverá incluir, entre outras áreas:

```text
instalação/configuração de uma instância
cadastros
logins
perfis e permissões
equipes
participantes
robôs
inscrições
aprovações/rejeições/cancelamentos
competições em diferentes estados
Follow Line
Sumô
Futebol de Robôs
chaves e progressões
resultados
históricos
Ajustes Gerais
avisos in-app
Telegram quando implementado
mídias/uploads
CMS/Landing
galeria
regras
ativação/desativação/reativação
simulações de erros e contratempos
uso concorrente em operações importantes
cenários completos de competição
cenários completos de participante
cenários de DEV/GESTAO/MIDIA
instalação com identidade de outra instituição
```

O objetivo final é validar o RasComp como **produto operacional**, não apenas como conjunto de endpoints/telas isoladas.

---

# 7. Regra de continuidade

A partir deste documento, trabalhar uma etapa por vez.

Quando uma etapa for iniciada:

1. revisar a regra no Dossiê;
2. confirmar decisões ainda abertas;
3. implementar backend primeiro quando houver regra de negócio;
4. adicionar/ajustar testes;
5. integrar frontend;
6. validar localmente;
7. atualizar este documento e a continuidade correspondente.

Não avançar silenciosamente para a próxima etapa deixando decisões de domínio pendentes na anterior.
