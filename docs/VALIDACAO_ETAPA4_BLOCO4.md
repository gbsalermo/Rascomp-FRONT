# Validação — ETAPA 4 / BLOCO 4 — Portal do Participante

Última atualização: **03/10/2026**

Status:

```text
4.1 — Equipe e associação            ✅ implementado
4.2 — Robôs/responsáveis             ✅ implementado / regras revisadas
4.3 — Inscrições participante/robô   🧪 implementação revisada / AGUARDANDO BUILD + VALIDAÇÃO MANUAL
4.4 — Polimento + bateria final      ⏳ NÃO INICIADO
```

Esta bateria valida **somente o escopo alterado até o 4.3**. Não iniciar 4.4 antes deste checklist.

Documento funcional complementar:

```text
docs/REGRAS_PARTICIPANTE.md
```

---

# 1. Cenário QA

Banco:

```text
rascomp_b4_validation
```

Senha de todas as contas:

```text
Rascomp@2026
```

Contas:

```text
DEV       dev.b4@rascomp.local
GESTAO    gestao.b4@rascomp.local
LÍDER     lider.b4@rascomp.local
MEMBRO    membro.b4@rascomp.local
APOIO     apoio.b4@rascomp.local
```

Equipe:

```text
B4 · Equipe Portal
```

Ownership e responsabilidade:

```text
B4 · Vespa
createdByUser = Membro B4
RobotResponsible:
├─ Membro B4
└─ Apoio B4

B4 · Atlas
createdByUser = Apoio B4
RobotResponsible:
└─ Apoio B4

Apoio B4
→ responsável por Vespa + Atlas
→ criador somente do Atlas
```

Competition:

```text
ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES
status = INSCRICOES_ABERTAS
janela ativa
```

Categorias:

```text
B4 · Follow Line
B4 · Mini Sumô RC
B4 · Sumô 3 kg RC
```

Nenhuma inscrição pessoal ou de Robot é pré-criada.

---

# 2. Preparação

Backend:

```bash
cd rascomp
export SPRING_PROFILES_ACTIVE=testdata
mvn spring-boot:run
```

Frontend:

```bash
cd gestao
npm run dev -- --host 0.0.0.0
```

Para repetir uma bateria destrutiva do zero, recriar somente o banco `rascomp_b4_validation` e subir novamente o profile.

---

# 3. Bateria A — fluxo principal

## Grupo A — visibilidade, ownership e N:N

### Teste 1 — Membro

Login:

```text
membro.b4@rascomp.local
```

Esperado:

- Team = `B4 · Equipe Portal`;
- vê Vespa;
- Vespa informa que foi cadastrado por Membro B4;
- não vê Atlas em **Meus robôs**;
- confirma `1 Competitor → Robot`.

### Teste 2 — Apoio

Login:

```text
apoio.b4@rascomp.local
```

Esperado:

- vê Vespa;
- vê Atlas;
- confirma `1 Competitor → N Robots`;
- Vespa foi cadastrado pelo Membro;
- Atlas foi cadastrado pelo Apoio.

### Teste 3 — Vespa com vários responsáveis

Como líder, abrir responsáveis do Vespa.

Esperado:

```text
Membro B4
Apoio B4
```

Confirma `1 Robot → N Competitors`.

### Teste 4 — responsável não vira dono da inscrição

Como Apoio:

- Vespa continua visível;
- **Inscrever robô** deve oferecer Atlas, mas não Vespa.

Esperado:

- ser responsável pelo Vespa não dá ao Apoio direito de iniciar a Registration dele;
- request direto tentando inscrever Vespa deve ser negado.

### Teste 5 — líder administra todos

Como `lider.b4`:

- vê Vespa e Atlas;
- pode iniciar inscrição de qualquer um após cumprir a própria etapa individual;
- não se torna automaticamente criador histórico dos dois Robots.

---

## Grupo B — sequência Minha inscrição → Robot

### Teste 6 — Robot bloqueado antes da inscrição individual

Como Membro, sem inscrição pessoal:

Esperado:

- **Inscrever robô** bloqueado;
- texto orienta fazer **Minha inscrição**;
- backend também bloqueia request direto.

### Teste 7 — enviar Minha inscrição

Como Membro:

1. clicar **Fazer minha inscrição**;
2. selecionar Competition;
3. anexar PDF/JPG/PNG/WEBP;
4. enviar.

Esperado:

```text
Minha inscrição = PENDENTE
```

- comprovante aparece;
- Team/RobotResponsible não mudam.

### Teste 8 — liberação imediata do Robot

Ainda como Membro, sem aprovação da GESTAO:

Esperado:

- **Inscrever robô** é liberado;
- não foi necessário esperar aprovação;
- somente Vespa aparece no seletor porque é o Robot cadastrado pelo Membro.

### Teste 9 — Apoio faz inscrição individual

Como Apoio:

- enviar Minha inscrição;
- status = PENDENTE;
- Inscrever robô libera;
- seletor oferece Atlas, não Vespa.

### Teste 10 — comprovantes independentes

Conferir:

- comprovante individual do Membro;
- comprovante individual do Apoio;
- depois, comprovante do Robot.

Esperado: três documentos/metadata independentes.

---

## Grupo C — inscrição do Robot e elegibilidade parcial

### Teste 11 — Membro inscreve Vespa

Como Membro:

```text
Robot = B4 · Vespa
Category = B4 · Follow Line
```

Esperado:

- não existe seletor arbitrário de colegas;
- a tela explica **Composição automática**;
- enviar comprovante do Robot;
- Registration = PENDENTE.

### Teste 12 — Gestão vê os dois responsáveis

Como GESTAO, abrir detalhes do Vespa.

Com Membro e Apoio ainda PENDENTE:

Esperado:

```text
Membro B4 → RobotResponsible → inscrição individual PENDENTE
Apoio B4  → RobotResponsible → inscrição individual PENDENTE
```

Nenhum ainda pertence à composição oficial.

### Teste 13 — aprovação precoce bloqueada

Tentar aprovar Vespa sem ninguém pessoalmente aprovado.

Esperado:

- frontend informa que falta ao menos um responsável APROVADO;
- request forçado também é bloqueado;
- Vespa permanece PENDENTE.

### Teste 14 — aprovar somente Membro

Aprovar inscrição individual de Membro.

Esperado:

```text
Membro → APROVADA
Apoio  → PENDENTE
Vespa  → PENDENTE
```

Composição oficial do Vespa passa a incluir Membro automaticamente.

### Teste 15 — aprovar Robot com apenas um elegível

Agora aprovar Vespa.

Esperado:

```text
Vespa → APROVADA
Composição oficial:
└─ Membro B4
```

Apoio PENDENTE **não bloqueia** o Robot.

### Teste 16 — Apoio aprovado depois

Aprovar inscrição individual do Apoio.

Esperado:

- Apoio entra automaticamente na composição oficial do Vespa;
- Vespa continua APROVADA;
- não volta para PENDENTE;
- aparece aviso/auditoria de alteração de composição na GESTAO.

---

## Grupo D — alterações de composição e veto

> Executar antes de iniciar a Competition.

### Teste 17 — manter adição automática

Na fila **Alterações de responsáveis**, localizar a entrada do Apoio no Vespa.

Escolher **Manter**.

Esperado:

- evento sai da fila pendente;
- Vespa continua APROVADA;
- Membro + Apoio permanecem na composição oficial.

### Teste 18 — líder remove responsável

Mais tarde, após a troca de liderança do Grupo E ou usando o líder atual antes dela, remover Membro do Vespa.

Esperado:

- vínculo permanente é alterado;
- Membro sai automaticamente da composição oficial;
- se Apoio continua APROVADO, Vespa permanece APROVADA;
- GESTAO recebe evento `REMOVIDO`.

### Teste 19 — Gestão mantém remoção

Escolher **Manter**.

Esperado:

- remoção fica auditada;
- nenhuma nova aprovação completa do Robot é exigida.

### Teste 20 — líder adiciona Membro novamente

Reassociar Membro ao Vespa.

Como Membro está pessoalmente APROVADO:

- entra automaticamente na composição;
- Vespa permanece APROVADA;
- nova proposta `ADICIONADO` aparece para GESTAO.

### Teste 21 — Gestão veta a adição

Selecionar **Vetar** e informar justificativa.

Esperado:

- Membro pode continuar como RobotResponsible permanente;
- fica fora da composição oficial **desta Competition**;
- Vespa continua APROVADA com Apoio;
- justificativa fica auditada.

### Teste 22 — veto não fica eterno

O líder:

1. remove Membro do vínculo permanente;
2. salva;
3. associa Membro novamente;
4. salva.

Esperado:

- nasce **nova** proposta de alteração;
- o veto anterior não impede uma tentativa futura;
- GESTAO pode decidir novamente.

---

## Grupo E — proteção da liderança

### Teste 23 — líder faz Minha inscrição

Login como:

```text
lider.b4@rascomp.local
```

Enviar inscrição individual.

Esperado: PENDENTE.

### Teste 24 — rejeição direta do líder bloqueada

Como GESTAO, tentar rejeitar definitivamente a inscrição do líder.

Esperado:

- frontend não permite rejeição direta;
- backend também rejeita tentativa forçada;
- mensagem oferece:
  - solicitar correção;
  - DEV transferir liderança.

### Teste 25 — solicitar correção ao líder

GESTAO seleciona **Solicitar correção** e informa motivo.

Esperado:

```text
PENDENTE
→ CORRECAO_SOLICITADA
```

- líder continua líder;
- equipe não fica órfã.

### Teste 26 — líder reenvia correção

Como líder:

- aparece motivo;
- anexar novo comprovante;
- reenviar.

Esperado:

```text
CORRECAO_SOLICITADA
→ PENDENTE
```

Histórico preservado.

### Teste 27 — DEV transfere liderança

Pré-condição: Apoio está APROVADO.

Como DEV:

- abrir ação **Trocar líder** na inscrição do líder;
- escolher Apoio;
- informar justificativa.

Esperado:

```text
Líder anterior = Líder B4
Novo líder     = Apoio B4
```

Auditoria registra:

- Team;
- Competition;
- líder anterior;
- novo líder;
- DEV;
- justificativa;
- data/hora.

### Teste 28 — rejeição do ex-líder agora permitida

Como GESTAO, rejeitar inscrição individual do antigo Líder B4.

Esperado:

- REJEITADA;
- Team continua liderada pelo Apoio;
- Robot.createdByUser dos robôs não muda;
- ownership/histórico não é reescrito.

---

## Grupo F — permissões após associação

### Teste 29 — membro associado vê, mas não administra Registration alheia

Usar um Robot em que um participante é responsável mas não criador.

Esperado:

- consegue visualizar contexto relacionado;
- não pode cancelar/reativar/iniciar Registration daquele Robot;
- líder e criador continuam sendo os administradores do fluxo do Portal.

### Teste 30 — duplicidade

Tentar repetir:

```text
Competition + Category + Robot
```

Esperado: bloqueio backend/frontend.

### Teste 31 — incompatibilidade física Sumô

Para o mesmo Robot/Competition:

1. criar Mini Sumô RC;
2. tentar Sumô 3 kg RC.

Esperado: bloqueio preservado.

---

## Grupo G — congelamento no início da competição

Executar por último no cenário principal.

### Teste 32 — iniciar competição

Alterar a Competition para `EM_ANDAMENTO` pelo fluxo administrativo adequado.

### Teste 33 — líder tenta mudar responsáveis durante a prova

No Portal, tentar alterar responsáveis de Robot inscrito.

Esperado:

- operação bloqueada;
- mensagem informa que responsáveis/composição estão congelados durante a competição;
- request direto também falha;
- `Registration.competitors` não muda.

### Teste 34 — decisões pessoais normais também congeladas

Tentar aprovar/rejeitar/corrigir inscrição individual pelo fluxo normal depois do início.

Esperado: backend bloqueia alteração normal.

---

# 4. Bateria B — rejeição automática e reinscrição

**Recriar o banco `rascomp_b4_validation` antes deste grupo.**

Objetivo: provar o caso “todos os responsáveis ficaram inelegíveis”.

### Teste 35 — Apoio inicia sua inscrição

Como Apoio:

- fazer Minha inscrição;
- PENDENTE.

### Teste 36 — Apoio inscreve Atlas

Atlas foi cadastrado pelo Apoio e possui somente Apoio como RobotResponsible.

Enviar inscrição do Atlas.

Esperado:

```text
Atlas = PENDENTE
Apoio = PENDENTE
```

### Teste 37 — Gestão rejeita Apoio

Apoio não é o líder inicial da Team, então a rejeição definitiva é permitida.

Esperado:

```text
Apoio = REJEITADA
Atlas = REJEITADA automaticamente
```

Motivo do Atlas indica ausência de responsável elegível.

RobotResponsible permanente de Apoio **não é apagado**.

### Teste 38 — preparar novo responsável

Como Membro:

- fazer Minha inscrição → PENDENTE.

Como Líder:

- fazer Minha inscrição → PENDENTE;
- associar Membro como responsável do Atlas.

Esperado:

- Atlas continua REJEITADA;
- associação por si só não reabre Registration automaticamente.

### Teste 39 — líder reinscreve Atlas

Como líder atual:

- usar **Reinscrever** no Atlas.

Esperado:

```text
REJEITADA
→ PENDENTE
```

- mesmo registro é reutilizado;
- histórico preservado;
- nenhuma Registration duplicada;
- basta existir responsável com inscrição PENDENTE/APROVADA para reinscrição.

### Teste 40 — aprovar Membro e depois Atlas

GESTAO:

1. aprovar Membro;
2. confirmar Membro na composição do Atlas;
3. aprovar Atlas.

Esperado:

```text
Membro = APROVADA
Atlas  = APROVADA
```

---

# 5. Aceite técnico do 4.3

Só marcar o 4.3 como validado quando:

```text
[ ] backend inicia com Flyway V26
[ ] frontend typecheck/build passa
[ ] Minha inscrição antecede Inscrever robô
[ ] PENDENTE individual já libera inscrição do Robot
[ ] comprovantes são independentes
[ ] Robot.createdByUser está correto
[ ] membro só inicia Registration de Robot criado por ele
[ ] líder pode iniciar Registration de qualquer Robot da Team
[ ] RobotResponsible continua N:N
[ ] responsável não criador não ganha administração automática
[ ] composição do Robot é automática
[ ] 1 aprovado já basta para aprovar Robot
[ ] PENDENTE não bloqueia outro aprovado
[ ] aprovação posterior adiciona responsável automaticamente
[ ] Robot não volta a PENDENTE só porque ganhou outro aprovado
[ ] mudanças geram aviso/auditoria
[ ] GESTAO pode manter/vetar alteração
[ ] veto exige justificativa
[ ] nova proposta após veto é possível
[ ] todos inelegíveis rejeitam Robot automaticamente
[ ] rejeição automática não apaga RobotResponsible
[ ] Robot REJEITADO pode ser reinscrito conscientemente
[ ] reinscrição preserva histórico/unicidade
[ ] CORRECAO_SOLICITADA funciona
[ ] líder atual não pode ser rejeitado diretamente
[ ] DEV transfere liderança para membro elegível
[ ] troca de líder é auditada
[ ] troca de líder não muda autoria dos Robots
[ ] responsáveis/composição congelam durante competição
[ ] request adulterado não burla ownership/elegibilidade
[ ] duplicidade continua bloqueada
[ ] regra Mini 500 g x Sumô 3 kg continua preservada
```

---

# 6. Cobertura automatizada preparada

A suíte foi atualizada para cobrir:

- criação de inscrição individual;
- correção solicitada;
- proteção da rejeição do líder;
- transferência DEV de liderança;
- ownership do Robot;
- gate da inscrição individual antes do Robot;
- composição derivada;
- 1 aprovado + 1 pendente;
- rejeição automática quando todos ficam inelegíveis;
- sincronização N:N;
- auditoria das alterações;
- cenário MySQL/Flyway com V26.

O job `portal-testdata` também foi revisado para validar:

```text
Membro cria Vespa
Apoio é responsável pelo Vespa, mas não pode inscrevê-lo
Apoio cria Atlas
inscrição individual antecede Robot
Membro aprovado + Apoio pendente → Vespa pode ser aprovado
Apoio aprovado depois → entra automaticamente
alteração aparece para GESTAO
líder não pode ser rejeitado diretamente
DEV transfere liderança
ex-líder pode então ser rejeitado
```

**Não considerar esse checkpoint verde até existir execução real da suíte/build nos heads atuais.**


---

# 7. Regressão pós-bateria 1–40 — 03/10/2026

A bateria manual principal foi **executada integralmente até o Teste 40**.

Resultado:

- testes 35–40: validados;
- fluxo principal de inscrição pessoal/Robot: validado;
- rejeição automática e reinscrição: validadas;
- ownership e N:N: validados;
- congelamento no início: validado;
- foram encontrados ajustes de UX e três comportamentos de composição que exigiram correção antes do fechamento do 4.3.

## Achados corrigidos

1. Robot passou a ter ações de **Editar** e **Remover** no Portal para criador/líder.
2. Remoção é bloqueada enquanto houver Registration PENDENTE/APROVADA.
3. Duplicidade por nome dentro da mesma Team já era protegida no backend/banco; Portal agora antecipa o aviso quando possível.
4. Nome e descrição simples do Robot podem ser editados.
5. V27 adiciona snapshot opcional de descrição do Robot à Registration.
6. Seção **Inscrições dos robôs** recebeu maior contraste/tamanho.
7. Avisos pendentes/dependências receberam maior destaque.
8. Cards da GESTAO agora deixam explícito que contam **inscrições dos robôs**, não inscrições pessoais.
9. Filtro de Competition da página Inscrições foi movido para o topo.
10. Título da aba do navegador passou a variar por perfil:
    - Participante;
    - Gestão;
    - Administração/DEV.
11. Reincluir responsável gera um novo aviso de composição para a GESTAO.
12. Vetar remoção restaura o RobotResponsible.
13. Vetar adição desfaz a nova responsabilidade.
14. Alteração sem decisão da GESTAO não exige aprovação: ao iniciar a Competition, pendências de revisão são consolidadas automaticamente como MANTIDA.
15. Motivo da proteção do líder ficou visível na interface.
16. Status da Competition não pode mais ser alterado pela edição comum.
17. Fluxo operacional explícito:
    ```text
    INSCRICOES_ABERTAS
    → Encerrar inscrições
    → INSCRICOES_ENCERRADAS
    → Iniciar competição
    → EM_ANDAMENTO
    ```
18. Líder da Team passou a ser identificado na visão do participante e da GESTAO.
19. Seed Postman foi isolado do profile `testdata`, permitindo recriar `rascomp_b4_validation` do zero.

## Entrada excepcional durante a competição

Já existe camada excepcional DEV:

```text
Entrada manual DEV
→ PARTICIPANTE existente
→ já associado a Team
→ Robot novo
→ responsabilidade formalizada
→ Registration APROVADA
→ justificativa + auditoria
```

Ela funciona inclusive em `EM_ANDAMENTO`.

Isso **não é autorização para aprovar inscrições normais atrasadas durante a prova**. O fluxo normal permanece congelado.

A criação completamente manual de **pessoa/competidor sem conta/vínculo prévio**, como contingência operacional, continua no roadmap DEV e não deve ser confundida com a entrada manual atualmente implementada.

---

# 8. Bateria curta de regressão dos achados

Não é necessário repetir os 40 testes. Validar apenas os pontos abaixo após atualizar backend/frontend.

### R1 — Editar Robot

Como Membro, no Vespa:

- editar nome;
- editar descrição;
- salvar;
- restaurar o nome original ao final.

Esperado: alteração aparece no Portal.

### R2 — Duplicidade de Robot

Tentar cadastrar outro Robot com nome `B4 · Vespa` na mesma Team.

Esperado:

- Portal pode antecipar o aviso;
- backend bloqueia definitivamente;
- nenhum Robot duplicado é criado.

### R3 — Remoção segura

Em um Robot sem Registration ativa:

- remover cadastro.

Esperado:

- deixa de aparecer no Portal;
- histórico permanece.

Em Robot com Registration PENDENTE/APROVADA:

- tentar remover.

Esperado:

- bloqueio;
- orientação para regularizar/cancelar a Registration.

### R4 — Descrição da inscrição

Inscrever Robot e alterar o campo **Descrição do robô nesta inscrição** antes do envio.

Esperado:

- comprovante + descrição são enviados;
- GESTAO vê a descrição em **Detalhes da inscrição**;
- editar depois a descrição geral do Robot não altera o snapshot da Registration.

### R5 — Destaque visual do Portal

Conferir:

- seção **Inscrições dos robôs**;
- banner/aviso de pendência.

Esperado: leitura clara, sem aparência apagada.

### R6 — Cards da GESTAO

Na página Inscrições, conferir:

```text
Robôs inscritos
Robôs pendentes
Robôs aprovados
Robôs rejeitados
```

Esperado: ficar explícito que os cards não contam inscrições pessoais.

### R7 — Competition no topo

Na página Inscrições:

- seletor/contexto de Competition aparece no início da página;
- filtro inferior fica somente com busca/status das Registrations.

### R8 — Título da aba

Testar logins:

```text
PARTICIPANTE → RasComp · Participante
GESTAO       → RasComp · Gestão
DEV          → RasComp · Administração
```

### R9 — Reinclusão gera aviso

Antes do início:

1. líder remove responsável;
2. GESTAO mantém ou veta;
3. líder associa novamente.

Esperado: nova linha `ADICIONADO` aparece para GESTAO.

### R10 — Veto realmente desfaz a mudança

Caso A:

```text
líder remove João
→ GESTAO veta remoção
→ João volta a aparecer como responsável
```

Caso B:

```text
líder adiciona João
→ GESTAO veta adição
→ João deixa de aparecer como responsável
```

Justificativa fica auditada.

### R11 — Gestão não é gargalo

Criar uma alteração de responsável e **não clicar Manter nem Vetar**.

Depois:

```text
Encerrar inscrições
→ Iniciar competição
```

Esperado:

- Competition inicia;
- alteração é consolidada automaticamente como MANTIDA;
- composição congela;
- não sobra decisão pendente impedindo a operação.

### R12 — Proteção do líder explicada

Na inscrição pessoal do líder:

- botão Rejeitar permanece protegido;
- tela explica o motivo;
- DEV continua vendo **Trocar líder**.

### R13 — Ciclo operacional da Competition

Com Competition em `INSCRICOES_ABERTAS`:

- edição comum não permite trocar status;
- tentativa direta de `INSCRICOES_ABERTAS → EM_ANDAMENTO` é rejeitada;
- botão **Encerrar inscrições** funciona;
- somente depois aparece/funciona **Iniciar competição**.

### R14 — Líder visível

Conferir:

- Portal do Participante mostra líder da Team;
- tabela de competidores do Portal marca `Líder`;
- GESTAO / Competidores marca `Líder`;
- GESTAO / Inscrições pessoais marca `Líder`.

### R15 — Exceção DEV em competição iniciada

Com Competition `EM_ANDAMENTO`, como DEV:

- abrir **Entrada manual DEV**;
- confirmar que a interface explica que é operação excepcional;
- participante disponível precisa já possuir conta PARTICIPANTE + Team;
- justificar entrada.

Esperado:

- fluxo excepcional permanece auditado;
- fluxo normal de aprovação/alteração continua congelado.

---

# 9. Critério revisado para fechar o 4.3

```text
[✓] bateria 1–40 executada
[✓] testes 35–40 validados
[ ] regressão R1–R15 validada
[ ] backend compila/testes automatizados passam
[ ] frontend build/typecheck passa
[ ] Flyway V27 aplica
[ ] documentação final sincronizada
```

Somente após a regressão e builds o BLOCO 4.3 será marcado como CONCLUÍDO.
