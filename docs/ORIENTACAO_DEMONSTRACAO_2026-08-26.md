# Orientação para Demonstração — RasComp / RRC

Data da demonstração: **26/08/2026**

Objetivo: apresentar à equipe, de forma curta e segura, o que já está funcional no RasComp para ORGANIZAÇÃO e PARTICIPANTE, usando dados preparados para demonstração e evitando depender de cadastros manuais durante a reunião.

---

## 1. Antes da reunião

### Backend

```powershell
cd D:\Projetos\Java\Rascomp
git pull origin main
cd rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

Confirmar no terminal:

```text
RASCOMP · CENARIO COMPLETO DE DEMONSTRACAO PRONTO
```

### Frontend

Em outro terminal:

```powershell
cd D:\Projetos\Java\Rascomp-FRONT
git pull origin main
cd gestao
npm install
npm run typecheck
npm run build
npm run dev
```

Deixar backend e frontend abertos durante toda a demonstração.

---

## 2. Credenciais

### Organização

```text
E-mail: organizacao.demo@rascomp.local
Senha:  Rascomp@2026
```

### Participante / líder de equipe

```text
E-mail: lider.demo@rascomp.local
Senha:  Rascomp@2026
```

---

## 3. Mensagem de abertura

Explicação sugerida em uma frase:

> O RRC é a competição; o RasComp é a plataforma que organiza inscrição, equipe, robô, prova, ranking, chaveamento, resultado e histórico.

Ponto importante: **o backend é a fonte de verdade** para as regras competitivas. O frontend apenas opera e apresenta essas regras.

---

## 4. Ordem recomendada da demonstração

### 4.1 Login da ORGANIZAÇÃO

Entrar com a conta de organização e selecionar:

```text
RRC 2026 · Demonstração ao vivo
```

### 4.2 Dashboard

Mostrar:

- competição em andamento;
- percentual temporal do evento;
- inscrições aprovadas e pendentes;
- equipes e robôs participantes;
- últimas movimentações;
- atalhos administrativos.

Explique que o percentual representa o avanço do período da competição, não uma estimativa arbitrária de partidas concluídas.

### 4.3 Inscrições

Abrir **Inscrições**.

Mostrar estados diferentes:

```text
PENDENTE
APROVADA
REJEITADA
```

Escolher uma inscrição pendente e aprovar ao vivo.

Explique:

- participante solicita;
- organização aprova ou rejeita;
- revisor e data/hora ficam registrados;
- participante não consegue aprovar a própria inscrição.

### 4.4 Equipes e Robôs — ativo/inativo

Abrir **Equipes** e depois **Robôs**.

Agora a organização pode:

```text
Ativo    → Desativar
Inativo  → Reativar
```

A desativação é lógica: não apaga histórico, resultados nem registros antigos.

Para não interferir no restante da apresentação, prefira demonstrar a função em um registro criado apenas para teste ou apenas explicar o botão.

### 4.5 Usuários

Abrir:

```text
Sistema → Usuários
```

Mostrar as abas:

```text
Participantes
Organização
```

A organização pode desativar e reativar contas.

A conta que está atualmente logada fica protegida na interface para evitar desativação acidental durante a demonstração.

### 4.6 Follow Line

Abrir **Follow Line** e usar:

```text
RRC 2026 · Demonstração ao vivo
DEMO · Seguidor de Linha
```

Mostrar:

- ranking já preenchido;
- melhor tomada;
- tempo bruto;
- penalidade;
- tempo final;
- histórico de tentativas.

Destaque:

```text
Chronos Demo
Tomada 1 → preenchida
Tomada 2 → preenchida
Tomada 3 → disponível
```

Abrir a operação de Chronos e registrar uma tentativa na Tomada 3.

Para não alterar muito o ranking, pode usar:

```text
Tempo:       50.000
Penalidade:  0
Checkpoints: 5
Concluída:   sim
Válida:      sim
```

### 4.7 Sumô — chave em andamento

Abrir **Sumô** e selecionar:

```text
RRC 2026 · Demonstração ao vivo
DEMO · Mini Sumô RC
```

Mostrar:

- chave visual;
- partidas já concluídas;
- partidas ainda abertas;
- progressão automática;
- Titan Demo com vitória já registrada.

### 4.8 Sumô — tela da partida

Abrir uma partida ainda disponível.

Mostrar:

- fotos dos robôs;
- placar;
- histórico de rounds;
- vitória de A/B;
- penalidades;
- Suicídio/WO;
- empate;
- anulação;
- cancelamento.

#### Regra de penalidades

A regra agora é efetiva no backend e na interface:

```text
0 penalidades → normal
1 penalidade  → normal
2 penalidades → derrota automática no round
```

Exemplo para demonstrar:

```text
Atlas HC = 2 penalidades
Dardo HC = 0 penalidades
```

Resultado esperado imediatamente na tela:

```text
Atlas HC perdeu o round
Dardo HC selecionado como vencedor automaticamente
Motivo: PENALIDADES
```

Mesmo que alguém tente enviar Atlas como vencedor diretamente pela API, o backend substitui pelo adversário.

Não é permitido terminar um mesmo round com 2 penalidades para os dois robôs, porque o round deve ser encerrado quando um deles atinge a segunda penalidade.

#### Suicídio / WO

Exemplo:

```text
Suicídio/WO de A
→ vitória automática de B
```

### 4.9 BYE

Selecionar:

```text
DEMO · Sumô 3 kg RC · BYEs
```

Existem 10 participantes em chave de 16.

Mostrar que o backend resolve os espaços vazios com BYEs e avança automaticamente os participantes correspondentes.

### 4.10 Histórico completo

Trocar para:

```text
RRC 2025 · Histórico completo
```

Usar a categoria com 32 robôs.

Mostrar:

```text
32 robôs
31 partidas
16 avos
8 oitavas
4 quartas
2 semifinais
1 final
```

As chaves antigas permanecem em modo somente leitura.

### 4.11 Fotos dos robôs

Explique o fluxo:

```text
participante envia foto
→ backend valida arquivo e ownership
→ define foto principal
→ mesma foto aparece no portal participante, Follow e Sumô
```

Formatos aceitos:

```text
JPEG
PNG
WEBP
até 5 MB
```

### 4.12 Portal do PARTICIPANTE

Fazer logout e entrar com:

```text
lider.demo@rascomp.local
Rascomp@2026
```

Mostrar:

```text
Equipe Demo RAS
├─ Líder Demo
├─ Suporte Demo
├─ Chronos Demo
└─ Titan Demo
```

Chronos deve apresentar:

- inscrição Follow aprovada;
- foto;
- ranking;
- melhor tomada;
- histórico;
- tomadas realizadas.

Titan deve apresentar:

- inscrição Sumô aprovada;
- foto;
- vitória já registrada;
- situação na chave.

---

## 5. O que vale destacar tecnicamente

Se perguntarem sobre arquitetura:

```text
Frontend Vue 3
      ↓
API REST Spring Boot
      ↓
Services com regras de negócio
      ↓
JPA / Hibernate
      ↓
MySQL + Flyway
```

Segurança:

```text
JWT
BCrypt
PARTICIPANTE / ORGANIZACAO
ownership de equipe/robô
```

Regras que ficam no backend:

- aprovação de inscrição;
- validade das tentativas;
- ranking Follow;
- inspeção Sumô;
- BYE;
- vencedor de round;
- derrota por 2 penalidades;
- progressão da chave;
- histórico.

---

## 6. O que NÃO precisa ser demonstrado amanhã

Evite gastar tempo com:

- criação completa de uma competição do zero;
- criação manual de dezenas de equipes;
- Landing Page, que ainda não é a etapa atual;
- recuperação de senha;
- detalhes internos de Camunda;
- alterações destrutivas em dados principais da demo.

A apresentação deve mostrar o fluxo e a maturidade atual, não provar cada endpoint individualmente.

---

## 7. Plano B se algo falhar

### Frontend não sobe

```powershell
npm install
npm run typecheck
npm run dev
```

### Backend não sobe

Confirmar:

```text
MySQL iniciado
DB_URL correto
DB_USERNAME correto
DB_PASSWORD correto
SPRING_PROFILES_ACTIVE=testdata
```

### Dados da demo não aparecem

Reiniciar o backend mantendo:

```powershell
$env:SPRING_PROFILES_ACTIVE="testdata"
```

### Uma operação ao vivo der erro

Não fique preso nela. Volte para os dados já preparados e mostre:

- histórico;
- ranking existente;
- chave encerrada;
- portal participante.

---

## 8. Checklist final — 10 minutos antes

```text
[ ] git pull no backend
[ ] git pull no frontend
[ ] MySQL iniciado
[ ] backend iniciado com profile testdata
[ ] mensagem CENARIO COMPLETO DE DEMONSTRACAO PRONTO apareceu
[ ] frontend abriu
[ ] login ORGANIZACAO testado
[ ] RRC 2026 · Demonstração ao vivo selecionável
[ ] Dashboard carregando
[ ] Inscrições pendentes presentes
[ ] Follow com Chronos e histórico presente
[ ] Sumô com chave parcial presente
[ ] regra de 2 penalidades conferida em uma partida de teste
[ ] categoria BYE presente
[ ] histórico de 32 robôs presente
[ ] tela Sistema → Usuários carregando
[ ] login PARTICIPANTE testado
[ ] Chronos e Titan aparecem no portal
[ ] fotos carregam
[ ] backend e frontend permanecem abertos em terminais separados
```

---

## 9. Encerramento sugerido

> Hoje o RasComp já cobre o núcleo de gestão da competição e começou a experiência do participante. A próxima consolidação é terminar o painel autenticado e depois conectar os resultados produzidos pelo sistema à experiência pública da RAS UFRB e do RRC.
