# Validação — ETAPA 4 / BLOCO 4 — Portal do Participante

Última atualização: **01/10/2026**

Status:

```text
4.1 — Equipe e associação          ✅ implementado
4.2 — Responsáveis por robô        ✅ base funcional implementada
4.3 — Inscrições participante/robô 🚧 REVISÃO DE DOMÍNIO EM IMPLEMENTAÇÃO
4.4 — Polimento + bateria final     ⏳ NÃO INICIADO
```

Este documento é o checklist prático do BLOCO 4. O 4.3 foi reaberto em 01/10/2026 após o fechamento do fluxo real de inscrições. A bateria anterior de inscrição direta do robô fica suspensa até a implementação das duas inscrições independentes e das novas dependências de aprovação. **Não iniciar 4.4 antes da validação do novo 4.3.**

---

# 0. Regra canônica revisada — 01/10/2026

O BLOCO 4.3 passa a tratar **duas inscrições independentes**:

```text
Competitor + Competition
→ inscrição pessoal
→ dados + comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
```

e:

```text
Robot + Competition + Category
→ inscrição do robô
→ 1+ competidores que sejam RobotResponsible daquele Robot
→ dados + comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
```

Regras congeladas:

- associação `UserAccount PARTICIPANTE → Competitor → Team` independe da inscrição na competição;
- associação `Robot ↔ RobotResponsible` também independe da inscrição na competição;
- criar/cadastrar um Robot não requer aprovação da GESTAO;
- a inscrição pessoal do competidor requer aprovação, normalmente condicionada à conferência do pagamento;
- a inscrição do Robot também requer aprovação própria, normalmente condicionada à conferência do pagamento;
- `Registration.competitors` deve ser subconjunto dos `RobotResponsible` ativos daquele Robot;
- líder da Team pode administrar o cadastro do Robot, porém **não se torna competidor elegível daquele Robot automaticamente**;
- para aparecer como competidor de uma Registration, o líder também precisa estar explicitamente associado como `RobotResponsible`;
- o participante pode enviar a inscrição do Robot enquanto sua inscrição pessoal ainda está `PENDENTE`;
- a GESTAO só pode transformar a inscrição do Robot em `APROVADA` quando todos os competidores escolhidos naquela Registration possuírem inscrição pessoal `APROVADA` na mesma Competition;
- inscrição pessoal aprovada torna o Competitor elegível na edição, mas não o associa automaticamente a nenhum Robot;
- inscrição de Robot aprovada torna aquele Robot oficialmente inscrito na Category/Competition, com a composição validada;
- o fluxo manual DEV permanece contingência excepcional e deve preservar/auditar as relações reais em vez de criar combinações sem vínculo.

## Aprovação administrativa cruzada

A tela da GESTAO deve tornar as relações visíveis nos dois sentidos.

Ao analisar **uma inscrição pessoal**, exibir:

- Competitor;
- Team;
- status/comprovante da inscrição pessoal;
- Robots em que esse Competitor é `RobotResponsible`;
- inscrições desses Robots na mesma Competition e seus respectivos status.

Ao analisar **uma inscrição de Robot**, exibir:

- Robot;
- Team;
- Category;
- comprovante/status da inscrição do Robot;
- competidores selecionados;
- para cada competidor, status da inscrição pessoal na mesma Competition.

A interface deve destacar dependências pendentes e impedir uma aprovação incoerente. Exemplo: a GESTAO não pode aprovar a inscrição de um Robot com um competidor que não seja responsável por ele ou cuja inscrição pessoal ainda não esteja aprovada.

A relação visual é auxiliar; o **backend deve repetir todas essas validações no momento da aprovação**.

---

# 1. Cenário de QA do 4.3

O profile backend `testdata` foi dedicado ao Portal e usa um banco separado:

```text
rascomp_b4_validation
```

Initializer ativo:

```text
Block4PortalValidationDataInitializer
```

Contas:

```text
DEV
dev.b4@rascomp.local
Rascomp@2026

GESTAO
gestao.b4@rascomp.local
Rascomp@2026

PARTICIPANTE — líder
lider.b4@rascomp.local
Rascomp@2026

PARTICIPANTE — membro comum
membro.b4@rascomp.local
Rascomp@2026
```

Cenário:

```text
Competition
ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES
status = INSCRICOES_ABERTAS
janela = relativa ao dia atual

Team
B4 · Equipe Portal

Robots
B4 · Vespa
→ responsáveis: Membro B4 + Apoio B4

B4 · Atlas
→ sem responsabilidade permanente do membro comum

Categories
B4 · Follow Line
B4 · Mini Sumô RC
B4 · Sumô 3 kg RC
```

Nenhuma `Registration` é criada pelo seed. O objetivo é que a primeira inscrição nasça pelo Portal.

---

# 2. Subir o cenário

Backend:

```bash
cd rascomp
SPRING_PROFILES_ACTIVE=testdata mvn spring-boot:run
```

No Windows, a variável pode ser configurada pelo terminal usado normalmente no projeto antes de executar o Maven.

Frontend Gestão:

```bash
cd gestao
npm run dev -- --host 0.0.0.0
```

O profile `testdata` preserva o initializer do BLOCO 3 no código, mas o deixa desativado. Para repetir a bateria totalmente do zero, recriar somente o banco dedicado `rascomp_b4_validation`.

---

# 3. Bateria manual obrigatória — 4.3

## 4.3.1 — Visibilidade líder x membro

### Teste 1 — membro comum

Login:

```text
membro.b4@rascomp.local
```

Esperado:

- entra no Portal do Participante;
- equipe exibida = `B4 · Equipe Portal`;
- em **Meus robôs** aparece `B4 · Vespa`;
- `B4 · Atlas` não aparece;
- botão **Nova inscrição** está disponível.

### Teste 2 — líder

Login:

```text
lider.b4@rascomp.local
```

Esperado:

- vê `B4 · Vespa`;
- vê `B4 · Atlas`;
- pode abrir **Nova inscrição** para qualquer um dos dois.

---

## 4.3.2 — Nova inscrição como membro responsável

### Teste 3 — competição disponível

Como `membro.b4`, abrir **Nova inscrição**.

Esperado:

- aparece `ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES`;
- competição fora de janela/sem inscrições abertas não deve ser oferecida;
- robô disponível = `B4 · Vespa`.

### Teste 4 — responsáveis pré-selecionados

Selecionar `B4 · Vespa`.

Esperado:

- `Membro B4` vem pré-selecionado;
- `Apoio B4` vem pré-selecionado;
- os dois aparecem identificados como responsáveis pelo robô;
- outros competidores ativos da equipe podem ser adicionados/removidos da composição da inscrição.

Importante:

```text
RobotResponsible ≠ Registration.competitors
```

Alterar a seleção desta inscrição **não pode alterar** os responsáveis permanentes do robô.

### Teste 5 — enviar Follow

Selecionar:

```text
Competition = ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES
Robot       = B4 · Vespa
Category    = B4 · Follow Line
```

Ajustar os competidores se desejar e enviar.

Esperado:

- sucesso;
- Registration criada como `PENDENTE`;
- Portal mostra **Aguardando aprovação da organização**;
- ela aparece em **Minhas inscrições**;
- ela ainda **não** aparece como participação oficial/aprovada.

---

## 4.3.3 — Aprovação administrativa existente

### Teste 6 — GESTAO encontra a pendência

Login:

```text
gestao.b4@rascomp.local
```

Esperado:

- a Registration enviada pelo Portal aparece no fluxo administrativo de inscrições;
- organização consegue aprovar ou rejeitar pelo fluxo já existente;
- nenhuma tela separada de "aprovação do robô" existe ou é necessária.

### Teste 7 — aprovar

Aprovar a inscrição do Teste 5.

Esperado:

- status = `APROVADA`;
- solicitante/revisão permanecem auditáveis;
- a Registration passa a ser participação oficial;
- ao voltar ao Portal, ela aparece entre inscrições aprovadas;
- em Follow, passa a estar disponível nos fluxos que consomem inscrições aprovadas.

---

## 4.3.4 — Integridade e permissões

### Teste 8 — duplicidade

Tentar criar novamente:

```text
mesma Competition
mesma Category
mesmo Robot
```

Esperado:

- operação bloqueada;
- não nasce segunda Registration.

### Teste 9 — membro não administra Atlas

Como `membro.b4`:

- `B4 · Atlas` não aparece na lista de robôs do wizard;
- o membro não deve conseguir administrar uma inscrição de Atlas por acesso direto/manipulação de request.

Esperado no backend: acesso negado.

### Teste 10 — líder administra Atlas

Como `lider.b4`, criar uma inscrição para `B4 · Atlas`.

Esperado:

- permitido mesmo que o líder não seja `RobotResponsible` permanente daquele robô;
- liderança concede administração da equipe, não responsabilidade permanente.

### Teste 11 — composição da Registration não altera responsáveis

Depois de criar uma Registration para Vespa com composição diferente da pré-seleção:

Esperado:

- seção **Responsáveis** de Vespa continua com os mesmos vínculos permanentes;
- participantes específicos da Registration refletem apenas aquela inscrição.

### Teste 12 — ao menos um competidor

No wizard, remover todos os competidores.

Esperado:

- frontend impede envio;
- backend também rejeitaria payload vazio.

### Teste 13 — competidor de outra equipe

Não deve existir opção visual para escolher pessoa de outra equipe.

Se o request for adulterado:

- backend deve rejeitar o competitor fora da Team da Registration.

---

## 4.3.5 — Compatibilidade Sumô

### Teste 14 — classe física

Para o mesmo robô e Competition:

1. criar inscrição `B4 · Mini Sumô RC`;
2. enquanto ela estiver PENDENTE ou após ficar APROVADA, tentar usar `B4 · Sumô 3 kg RC`.

Esperado:

- opção incompatível deve ser filtrada quando o contexto já permite inferir a incompatibilidade;
- se for forçada via request, backend bloqueia;
- o mesmo robô não pode competir em Mini 500 g e 3 kg na mesma edição.

---

## 4.3.6 — Cancelamento/reactivação preservados

### Teste 15 — cancelar PENDENTE

Criar uma Registration ainda PENDENTE e cancelar pelo Portal.

Esperado:

- status = `CANCELADA`;
- não vira participação oficial.

### Teste 16 — reativar CANCELADA

Com inscrições ainda abertas, reativar.

Esperado:

- volta para `PENDENTE`;
- volta a aguardar análise da organização;
- não volta diretamente para `APROVADA`.

---

# 4. Critério de aprovação do 4.3 — REVISADO

A bateria antiga não deve ser usada como aceite final. O novo 4.3 só poderá ser marcado como validado quando, além dos comportamentos anteriores ainda aplicáveis, estiver comprovado que:

```text
[ ] participante consegue enviar sua própria inscrição na Competition
[ ] inscrição pessoal nasce PENDENTE e possui comprovante/dados necessários
[ ] vínculo com Team independe da inscrição pessoal
[ ] vínculo RobotResponsible independe da inscrição pessoal
[ ] Robot pode ser cadastrado sem aprovação administrativa própria de cadastro
[ ] inscrição do Robot possui aprovação independente
[ ] Registration.competitors contém somente RobotResponsible do Robot
[ ] líder não entra automaticamente como competidor de qualquer Robot
[ ] Robot Registration pode ser enviada enquanto inscrição pessoal está PENDENTE
[ ] Robot Registration só pode ser APROVADA se todos os seus competidores estiverem APROVADOS pessoalmente na mesma Competition
[ ] GESTAO vê os Robots associados ao analisar um Competitor
[ ] GESTAO vê os Competitors associados ao analisar um Robot
[ ] status cruzados aparecem de forma clara na aprovação
[ ] backend bloqueia aprovação incoerente mesmo com request adulterado
[ ] comprovante da pessoa e comprovante do Robot permanecem independentes
[ ] APROVADA pessoal não aprova Robot automaticamente
[ ] APROVADA do Robot não aprova Competitor automaticamente
[ ] auditoria preserva quem aprovou/rejeitou e motivo
[ ] fluxo manual DEV continua excepcional e auditável
```

**Não iniciar 4.4 antes desta validação.**

---

# 5. Cobertura automatizada adicionada no 4.3

Backend:

- membro responsável pode enviar inscrição sem ser líder;
- membro sem responsabilidade não pode administrar inscrição do robô;
- membro responsável pode administrar inscrição do robô;
- listagem do membro reúne inscrições em que ele participa e inscrições dos robôs sob sua responsabilidade sem duplicar;
- regras existentes de `RegistrationService` continuam cobrindo `PENDENTE`, equipe dos competidores, duplicidade, janela e compatibilidade.

CI/testdata:

- sobe MySQL + Flyway + profile `testdata`;
- valida login líder/membro/GESTAO;
- valida que membro vê apenas Vespa e líder vê os dois robôs;
- cria Registration real pelo endpoint do Portal;
- exige `PENDENTE`;
- confirma que PENDENTE não aparece na API pública;
- tenta duplicidade e exige bloqueio;
- aprova como GESTAO;
- confirma que APROVADA passa a aparecer na API pública.

Frontend:

- workflow continua responsável por `vue-tsc --noEmit` + `vite build`.

O checkpoint de CI só deve ser marcado verde após a execução real dos workflows nos commits do 4.3.
