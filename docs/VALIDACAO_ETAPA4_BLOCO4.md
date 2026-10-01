# Validação — ETAPA 4 / BLOCO 4 — Portal do Participante

Última atualização: **01/10/2026**

Status:

```text
4.1 — Equipe e associação          ✅ implementado
4.2 — Responsáveis por robô        ✅ base funcional implementada
4.3 — Inscrição pelo Portal        🧪 implementado / AGUARDANDO VALIDAÇÃO MANUAL
4.4 — Polimento + bateria final    ⏳ NÃO INICIADO
```

Este documento é o checklist prático do BLOCO 4. O checkpoint atual deve validar **somente o 4.3** antes de autorizar 4.4.

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

# 4. Critério de aprovação do 4.3

Marcar 4.3 como validado somente se:

```text
[ ] membro responsável consegue inscrever seu robô
[ ] membro não consegue administrar robô de que não é responsável
[ ] líder consegue administrar todos os robôs da equipe
[ ] responsáveis do robô vêm pré-selecionados
[ ] composição da Registration é ajustável sem alterar RobotResponsible
[ ] Registration nasce PENDENTE
[ ] mensagem "Aguardando aprovação da organização" está clara
[ ] GESTAO aprova/rejeita no fluxo existente
[ ] PENDENTE não é participação oficial
[ ] APROVADA passa a alimentar projeções/fluxos oficiais
[ ] duplicidade é bloqueada
[ ] competitor fora da equipe é bloqueado
[ ] incompatibilidade física Sumô continua bloqueada
[ ] cancelamento/reactivação continuam coerentes
[ ] nenhuma regressão visual impeditiva foi encontrada
```

Se qualquer item falhar, corrigir dentro do 4.3 e repetir o teste afetado.

**Não iniciar 4.4 antes da confirmação manual do usuário.**

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
