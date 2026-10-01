# Validação — ETAPA 4 / BLOCO 4 — Portal do Participante

Última atualização: **01/10/2026**

Status:

```text
4.1 — Equipe e associação            ✅ implementado
4.2 — Responsáveis por robô          ✅ base funcional implementada
4.3 — Inscrições participante/robô   🧪 implementação principal pronta / AGUARDANDO BUILD + VALIDAÇÃO
4.4 — Polimento + bateria final      ⏳ NÃO INICIADO
```

O 4.3 foi reaberto em 01/10/2026 antes da validação manual para refletir o fluxo real de pagamento e aprovação.

**Não iniciar 4.4 antes da validação do novo 4.3.**

---

# 1. Regra canônica do 4.3

Existem duas inscrições independentes por competição.

## 1.1 Inscrição pessoal

```text
UserAccount PARTICIPANTE
→ Competitor da Team
→ Competition
→ dados + comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
→ APROVADA = pessoa habilitada naquela edição
```

Pertencer à Team **não depende** desta inscrição.

Ser responsável por um Robot **não depende** desta inscrição.

## 1.2 Inscrição do robô

```text
Robot
→ Competition
→ Category
→ 1..N RobotResponsible selecionados
→ dados + comprovante
→ PENDENTE
→ GESTAO aprova/rejeita
→ APROVADA = Robot oficialmente inscrito
```

Para a inscrição do Robot ser APROVADA:

```text
1. existe pelo menos um competidor selecionado;
2. todos os selecionados são RobotResponsible ativos do Robot;
3. todos possuem inscrição pessoal APROVADA na mesma Competition;
4. o comprovante do Robot existe;
5. demais regras de Registration continuam válidas.
```

A inscrição do Robot **pode ser enviada enquanto as inscrições pessoais ainda estão PENDENTE**. O bloqueio ocorre na aprovação.

---

# 2. Cardinalidade N:N — regra obrigatória

```text
1 Robot      → 1..N RobotResponsible
1 Competitor → 0..N Robots
```

Exemplo do cenário de QA:

```text
B4 · Vespa
├─ Membro B4
└─ Apoio B4

Apoio B4
├─ B4 · Vespa
└─ B4 · Atlas
```

Logo, a bateria precisa provar simultaneamente:

- um Robot com vários responsáveis;
- um Competitor responsável por vários Robots.

## 2.1 Responsabilidade permanente x composição competitiva

```text
RobotResponsible
= vínculo permanente N:N

Registration.competitors
= recorte dos responsáveis que competirão
  com aquele Robot naquela Competition/Category
```

Adicionar um novo responsável permanente **não altera automaticamente** uma Registration existente.

Remover um responsável usado por Registration `PENDENTE` ou `APROVADA` é bloqueado até regularização da inscrição.

---

# 3. Liderança da equipe

O líder pode administrar todos os Robots da Team:

- visualizar;
- editar;
- configurar responsáveis;
- iniciar inscrição de qualquer Robot da equipe.

Porém:

```text
ser líder
≠
ser RobotResponsible
```

Se o líder quiser constar como competidor de um Robot, precisa ser explicitamente associado como `RobotResponsible`.

Uma requisição adulterada tentando colocar o líder na Registration sem esse vínculo deve ser rejeitada pelo backend.

---

# 4. Aprovação cruzada na GESTAO

## Ao analisar participante

Exibir:

- Competitor;
- Team;
- comprovante;
- status da inscrição pessoal;
- Robots pelos quais ele é responsável;
- inscrições desses Robots na mesma Competition e seus status.

## Ao analisar Robot

Exibir:

- Robot;
- Team;
- Category;
- comprovante;
- competidores selecionados;
- indicação de que cada competidor é RobotResponsible;
- status da inscrição pessoal de cada competidor.

A interface ajuda a leitura, mas o backend é a fonte de verdade.

Exemplo obrigatório de bloqueio:

```text
Vespa PENDENTE
├─ Membro B4 → inscrição pessoal APROVADA
└─ Apoio B4  → inscrição pessoal PENDENTE

Resultado:
❌ Vespa NÃO pode ser aprovado
```

---

# 5. Cenário testdata

Banco dedicado:

```text
rascomp_b4_validation
```

Initializer:

```text
Block4PortalValidationDataInitializer
```

Senha de todas as contas:

```text
Rascomp@2026
```

Contas:

```text
DEV
dev.b4@rascomp.local

GESTAO
gestao.b4@rascomp.local

PARTICIPANTE — líder
lider.b4@rascomp.local

PARTICIPANTE — membro
membro.b4@rascomp.local

PARTICIPANTE — apoio
apoio.b4@rascomp.local
```

Equipe:

```text
B4 · Equipe Portal
```

Robôs:

```text
B4 · Vespa
→ Membro B4
→ Apoio B4

B4 · Atlas
→ Apoio B4
```

Isso significa:

```text
Membro B4 → 1 Robot
Apoio B4  → 2 Robots
Líder B4  → administra 2 Robots, mas não é responsável por nenhum no seed
```

Categorias:

```text
B4 · Follow Line
B4 · Mini Sumô RC
B4 · Sumô 3 kg RC
```

Competition:

```text
ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES
status = INSCRICOES_ABERTAS
vigente = true
janela relativa ao dia atual
```

Nenhuma inscrição pessoal e nenhuma Registration de Robot são pré-criadas.

---

# 6. Subir o cenário à noite

Backend:

```bash
cd rascomp
SPRING_PROFILES_ACTIVE=testdata mvn spring-boot:run
```

Git Bash no Windows:

```bash
export SPRING_PROFILES_ACTIVE=testdata
mvn spring-boot:run
```

Frontend:

```bash
cd gestao
npm run dev -- --host 0.0.0.0
```

Para repetir a bateria totalmente do zero, recriar somente o banco:

```text
rascomp_b4_validation
```

---

# 7. Bateria manual revisada — 4.3

## Grupo A — N:N e permissões

### Teste 1 — membro

Login:

```text
membro.b4@rascomp.local
```

Esperado:

- equipe `B4 · Equipe Portal`;
- vê `B4 · Vespa`;
- não vê `B4 · Atlas`;
- pode administrar Vespa.

### Teste 2 — apoio com vários robôs

Login:

```text
apoio.b4@rascomp.local
```

Esperado:

- vê Vespa;
- vê Atlas;
- comprova Competitor → vários Robots.

### Teste 3 — Vespa com vários responsáveis

Abrir responsáveis de Vespa como líder.

Esperado:

- Membro B4;
- Apoio B4;
- ambos ativos;
- comprova Robot → vários Competitors.

### Teste 4 — líder administra sem ser responsável

Login:

```text
lider.b4@rascomp.local
```

Esperado:

- vê Vespa e Atlas;
- administra ambos;
- não aparece automaticamente como responsável permanente.

---

## Grupo B — inscrição pessoal

### Teste 4.1 — robô bloqueado antes da inscrição pessoal

Antes de enviar **Minha inscrição**, conferir **Inscrever robô**.

Esperado:

- botão bloqueado;
- interface informa que primeiro é necessário enviar a inscrição individual;
- nenhuma espera de aprovação é exigida nesta etapa.



### Teste 5 — Membro envia inscrição pessoal

Como `membro.b4`:

1. abrir **Minha inscrição pessoal**;
2. selecionar a Competition aberta;
3. enviar PDF/JPG/PNG/WEBP válido;
4. enviar.

Esperado:

- nasce `PENDENTE`;
- comprovante aparece como enviado;
- **Inscrever robô** é liberado imediatamente, sem esperar aprovação da GESTAO;
- associação com equipe e Vespa permanece normal;
- nenhum Robot é aprovado automaticamente.

### Teste 6 — Apoio envia inscrição pessoal

Repetir como:

```text
apoio.b4@rascomp.local
```

Esperado:

- inscrição pessoal `PENDENTE`;
- continuam visíveis Vespa + Atlas.

---

## Grupo C — inscrição do Robot antes da aprovação pessoal

### Teste 7 — Membro inicia inscrição de Vespa

Como `membro.b4`:

```text
Competition = ETAPA 4 · BLOCO 4.3 · INSCRIÇÕES
Robot       = B4 · Vespa
Category    = B4 · Follow Line
```

Esperado:

- Membro B4 pré-selecionado;
- Apoio B4 pré-selecionado;
- somente responsáveis permanentes de Vespa aparecem como opções;
- usuário pode escolher um ou os dois;
- não aparece Líder B4 como opção enquanto ele não for RobotResponsible.

### Teste 8 — enviar Vespa com dois competidores

Manter:

```text
Membro B4
Apoio B4
```

Enviar comprovante do Robot.

Esperado:

- Registration = `PENDENTE`;
- comprovante disponível;
- mensagem de espera da organização;
- ainda não aparece como participação oficial.

### Teste 9 — independência dos comprovantes

Conferir:

- comprovante pessoal do Membro;
- comprovante pessoal do Apoio;
- comprovante da inscrição de Vespa.

Esperado:

- três registros independentes;
- aprovar um não altera o status dos outros.

---

## Grupo D — Gestão e aprovação cruzada

### Teste 10 — fila dos participantes

Login:

```text
gestao.b4@rascomp.local
```

Na tela Inscrições:

Esperado:

- seção **Inscrições dos participantes**;
- Membro B4 = PENDENTE;
- Apoio B4 = PENDENTE;
- comprovantes abríveis.

### Teste 11 — visão Competitor → Robots

Na linha do Membro:

Esperado:

```text
Membro B4
→ Vespa
→ Follow Line / PENDENTE
```

Na linha do Apoio:

Esperado:

```text
Apoio B4
→ Vespa
→ Follow Line / PENDENTE

→ Atlas
→ ainda sem inscrição nessa Competition
```

### Teste 12 — visão Robot → Competitors

Abrir detalhes de Vespa.

Esperado:

```text
Membro B4
→ Responsável pelo robô
→ Inscrição pessoal PENDENTE

Apoio B4
→ Responsável pelo robô
→ Inscrição pessoal PENDENTE
```

### Teste 13 — tentar aprovar Vespa cedo demais

Com ambos ainda PENDENTE, tentar aprovar Vespa.

Esperado:

- frontend avisa dependências;
- aprovação não é enviada quando detectável;
- request forçado diretamente também é rejeitado pelo backend;
- Vespa continua PENDENTE.

### Teste 14 — aprovar somente Membro

Aprovar inscrição pessoal de Membro B4.

Esperado:

```text
Membro B4 → APROVADA
Apoio B4  → PENDENTE
Vespa     → PENDENTE
```

Tentar aprovar Vespa novamente.

Esperado: bloqueado por Apoio B4.

### Teste 15 — aprovar Apoio

Aprovar Apoio B4.

Esperado:

```text
Membro B4 → APROVADA
Apoio B4  → APROVADA
Vespa     → PENDENTE
```

Nenhuma aprovação do Robot ocorre automaticamente.

### Teste 16 — aprovar Vespa

Agora aprovar Vespa.

Esperado:

- Vespa = `APROVADA`;
- revisão auditável;
- passa a aparecer nos fluxos oficiais;
- API pública/Follow passa a considerar a inscrição aprovada.

---

## Grupo E — integridade da relação

### Teste 17 — adicionar novo responsável depois da aprovação

Como líder, adicionar Líder B4 como responsável permanente de Vespa.

Esperado:

- Vespa passa a possuir três responsáveis permanentes;
- Registration já aprovada continua com a composição original Membro + Apoio;
- status da Registration continua APROVADA;
- novo responsável não entra silenciosamente na composição competitiva.

### Teste 18 — remover responsável usado pela Registration

Tentar remover Membro ou Apoio da responsabilidade permanente de Vespa.

Esperado:

- operação bloqueada;
- mensagem pede regularização da inscrição;
- Registration ativa não fica apontando para pessoa sem responsabilidade no Robot.

### Teste 19 — líder tenta competir com Atlas sem responsabilidade

Como líder, abrir inscrição de Atlas.

Esperado:

- o líder pode administrar/iniciar o fluxo;
- composição oferece apenas RobotResponsible de Atlas;
- no seed, Apoio B4;
- Líder B4 não entra automaticamente.

Se request adulterado adicionar Líder B4 sem responsabilidade:

- backend rejeita.

---

## Grupo F — proteções existentes

### Teste 20 — ao menos um competidor

Remover todos os responsáveis selecionados da inscrição.

Esperado:

- frontend bloqueia;
- backend também bloqueia payload vazio.

### Teste 21 — competidor não responsável

Forçar ID de um Competitor da mesma Team que não seja RobotResponsible daquele Robot.

Esperado:

- backend bloqueia mesmo pertencendo à equipe.

### Teste 22 — competidor de outra Team

Forçar ID externo.

Esperado:

- backend bloqueia.

### Teste 23 — duplicidade

Tentar repetir:

```text
Competition + Category + Robot
```

Esperado:

- segunda Registration não é criada.

### Teste 24 — incompatibilidade física Sumô

Para o mesmo Robot/Competition:

1. criar Mini Sumô RC;
2. tentar Sumô 3 kg RC.

Esperado:

- combinação incompatível filtrada no frontend quando possível;
- backend é barreira definitiva.

### Teste 25 — cancelamento/reactivação do Robot

Registration PENDENTE:

```text
cancelar
→ CANCELADA
→ reativar enquanto inscrições abertas
→ PENDENTE
```

Nunca retorna diretamente para APROVADA.

---

# 8. Checklist de aceite do 4.3

```text
[ ] inscrição pessoal existe separada da inscrição do Robot
[ ] comprovante pessoal funciona
[ ] comprovante do Robot funciona
[ ] associação com Team independe da inscrição pessoal
[ ] RobotResponsible independe da inscrição pessoal
[ ] Robot possui múltiplos responsáveis
[ ] Competitor possui múltiplos Robots
[ ] líder administra Robot sem virar responsável automaticamente
[ ] somente RobotResponsible pode compor Registration.competitors
[ ] Registration possui pelo menos um competidor
[ ] Robot Registration pode nascer enquanto pessoais estão PENDENTE
[ ] Robot não pode ser APROVADO com competidor pessoalmente PENDENTE
[ ] todos os competidores precisam estar pessoalmente APROVADOS
[ ] GESTAO vê Competitor → Robots
[ ] GESTAO vê Robot → Competitors
[ ] comprovantes/status aparecem na análise
[ ] aprovar pessoa não aprova Robot
[ ] aprovar Robot não aprova pessoa
[ ] adicionar responsável não reescreve Registration existente
[ ] remover responsável usado por Registration ativa é bloqueado
[ ] request adulterado não burla responsabilidade
[ ] request adulterado não burla aprovação pessoal
[ ] duplicidade permanece bloqueada
[ ] incompatibilidade Sumô permanece bloqueada
[ ] PENDENTE não entra nos fluxos oficiais
[ ] APROVADA entra nos fluxos oficiais
[ ] cancelamento/reactivação do Robot permanece coerente
[ ] nenhuma regressão visual impeditiva
```

**Somente depois desse aceite o 4.3 pode ser encerrado.**

---

# 9. Cobertura automatizada preparada

## Unitários/fluxo

Foram adicionadas/adaptadas coberturas para:

- criação de inscrição pessoal PENDENTE com comprovante;
- aprovação da inscrição pessoal pela GESTAO;
- bloqueio quando falta aprovação pessoal;
- inscrição de Robot exigindo RobotResponsible;
- Portal exigindo comprovante;
- bloqueio da remoção de RobotResponsible usado por Registration ativa;
- fluxo integrado de Registration atualizado para comprovante + aprovação pessoal.

## MySQL/testdata

O job `portal-testdata` foi preparado para executar:

```text
Membro → 1 Robot
Apoio  → 2 Robots
Vespa  → 2 responsáveis
```

Depois:

1. Membro envia inscrição pessoal PENDENTE;
2. Apoio envia inscrição pessoal PENDENTE;
3. Membro envia Vespa com os dois responsáveis + comprovante;
4. tentativa precoce de aprovar Vespa deve falhar;
5. duplicidade deve falhar;
6. GESTAO aprova Membro;
7. GESTAO aprova Apoio;
8. contexto do Robot deve mostrar 2 responsáveis + 2 APROVADAS;
9. GESTAO aprova Vespa;
10. somente então Vespa aparece na API pública.

## Frontend

Contratos e telas foram preparados para:

- `Minha inscrição pessoal`;
- upload do comprovante pessoal;
- upload do comprovante do Robot;
- fila de inscrições pessoais na GESTAO;
- visualização Competitor → Robots;
- visualização Robot → Competitors;
- bloqueio visual de aprovação com dependências pendentes.

**Checkpoint automatizado ainda não está marcado como verde:** os heads atuais não geraram execução nova de GitHub Actions até este momento. A validação real será feita antes do fechamento do 4.3.


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
- cada competidor selecionado na composição do Robot precisa ao menos possuir inscrição pessoal `PENDENTE` ou `APROVADA` na mesma Competition;
- para aprovar o Robot, todos os competidores selecionados precisam estar pessoalmente `APROVADOS`;
- inscrição pessoal `REJEITADA` ou `CANCELADA` não libera nova inscrição de Robot;
- o backend repete todas essas validações, independentemente da interface.
