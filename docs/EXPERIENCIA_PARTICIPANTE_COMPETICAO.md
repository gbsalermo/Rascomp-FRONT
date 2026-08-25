# Experiência do Participante em Competição — RASCOMP

Status: **PLANEJADO / REFERÊNCIA OFICIAL DE UX DO PERFIL PARTICIPANTE**

## 1. Princípio

A aplicação autenticada `gestao/` possui duas experiências diferentes dentro do mesmo frontend:

```text
ORGANIZACAO  -> operar e administrar a competição
PARTICIPANTE -> acompanhar sua própria participação em tempo real
```

Não criar um segundo repositório/frontend apenas para o competidor. O Vue deve trocar navegação, dashboard e ações conforme o `role` autenticado.

---

## 2. Perguntas que o painel do participante deve responder

Ao abrir o sistema durante o RRC, o participante deve conseguir responder imediatamente:

- qual é minha próxima partida/tentativa?
- que horas será?
- com qual robô estou inscrito?
- qual categoria/modalidade?
- contra quem jogo no Sumô?
- minha partida já terminou?
- fui eliminado ou continuo na chave?
- qual é minha colocação no Follow Line?
- qual foi meu melhor resultado oficial?
- quais inscrições ainda estão pendentes/aprovadas?
- quem faz parte da minha equipe?

---

## 3. Navegação alvo

```text
PARTICIPANTE

GERAL
├── Meu painel
└── Minha equipe

MEUS RECURSOS
├── Meus robôs
└── Minhas inscrições

COMPETIÇÃO
├── Próximas partidas
├── Minha chave        // quando houver Sumô
├── Minha colocação    // quando houver Follow Line
└── Histórico
```

A navegação pode ser adaptativa conforme as inscrições do usuário. Não exibir uma seção competitiva sem utilidade real.

---

## 4. Dashboard alvo do participante

### Cabeçalho

```text
Olá, Gabriel.
RRC 2026 · sua competição
```

### Card principal — próximo compromisso

Para Sumô:

```text
PRÓXIMA PARTIDA
Sumô RC · Semifinal

VESPA x ATLAS
14:30

Status: AGENDADA
[ Ver chave ]
```

Para Follow Line:

```text
PRÓXIMA ATIVIDADE
Follow Line

Robô: Flash
Tomada/Tentativa conforme agenda disponível
Horário: 15:20
```

Não inventar horário quando o backend não possuir agendamento.

### Resumo competitivo

```text
Minhas inscrições
Meus robôs
Próximos compromissos
Resultados concluídos
```

### Situação dos robôs

Exemplo Sumô:

```text
Vespa
Sumô RC
APROVADA
Na competição
Próxima partida: 14:30
```

Exemplo Follow Line:

```text
Flash
Follow Line
3º lugar
Melhor tempo oficial: 18.42 s
```

---

## 5. Sumô — experiência do participante

O participante deve poder consultar:

- chave da sua categoria;
- sua posição atual na chave;
- partidas em que sua inscrição participa;
- adversário, quando definido;
- rodada;
- horário `dataHora`, quando existente;
- status da partida;
- rounds concluídos;
- resultado oficial;
- próxima partida depois de uma vitória;
- situação competitiva: aguardando, em disputa, avançou, eliminado ou campeão.

O frontend **não decide** vencedor, progressão ou eliminação oficial.

O backend atual já fornece `MatchDTO` com:

```text
registrationAId
registrationBId
robotANome
robotBNome
rodada
ordem
dataHora
status
```

Isso permite identificar partidas relacionadas às inscrições do participante e mostrar agenda/horário.

Enquanto não existir uma projeção autenticada específica, a Gestão pode cruzar IDs das inscrições próprias com projeções públicas oficiais para exibição.

Porém, estados semânticos como `ELIMINADO`, `CLASSIFICADO` ou `CAMPEAO` devem preferencialmente ser projetados pelo backend na evolução pós-Swagger, evitando regra oficial implícita no cliente.

---

## 6. Follow Line — experiência do participante

O ranking público já é calculado pelo backend e contém `registrationId` + `posicao`.

O frontend pode localizar a inscrição do usuário dentro desse ranking oficial e mostrar:

```text
Minha colocação: 3º
Robô: Flash
Melhor tempo: 18.42 s
Penalidade: 0 s
Tomada: 2
Tentativa: 1
```

Isso não constitui cálculo de ranking no cliente; é apenas seleção da linha oficial correspondente à inscrição autenticada.

Também deve existir acesso ao ranking completo da categoria.

---

## 7. Inscrições e robôs

O participante deve poder visualizar por inscrição:

- competição;
- categoria;
- robô;
- status da inscrição;
- responsável;
- suportes, quando o backend pós-Swagger suportar os papéis;
- observação;
- resultado competitivo quando a competição estiver em andamento/finalizada.

Um robô pode aparecer em apenas uma inscrição por categoria/competição conforme a regra atual de unicidade do backend.

---

## 8. Atualização em tempo de competição

Estratégia inicial:

```text
polling leve
```

Durante competição ativa, atualizar periodicamente:

- partidas;
- resultados;
- chave;
- ranking;
- status das inscrições.

SSE/WebSocket só deve ser introduzido se a experiência real exigir atualização mais imediata e o backend oferecer suporte.

---

## 9. Contratos atuais reutilizáveis

Hoje já é possível combinar:

```text
/api/v1/participante/equipes
/api/v1/participante/equipes/{teamId}/robos
/api/v1/participante/equipes/{teamId}/inscricoes

/api/v1/public/chaveamentos
/api/v1/public/partidas
/api/v1/public/resultados
/api/v1/public/ranking/seguidor-linha
```

Isso é suficiente para um primeiro painel competitivo útil.

---

## 10. Evolução pós-Swagger recomendada no backend

Avaliar projeções autenticadas específicas para reduzir junções no frontend e oferecer semântica pronta:

```text
GET /api/v1/participante/competicao-atual
GET /api/v1/participante/minhas-partidas
GET /api/v1/participante/minha-situacao-sumo
GET /api/v1/participante/minhas-colocacoes-follow
```

Os nomes não são contratos congelados.

Essas projeções podem retornar dados como:

```text
registrationId
competitionId
categoryId
robotId
modalidade
proximaPartida
ultimoResultado
situacaoCompetitiva
posicaoRanking
melhorResultado
```

---

## 11. Estados de UX importantes

O painel deve tratar explicitamente:

```text
sem equipe
aguardando aprovação na equipe
sem inscrição
inscrição pendente
inscrição aprovada
aguardando chave
aguardando adversário
partida agendada
partida em andamento
avançou
eliminado
campeão
sem tentativa registrada
classificado no ranking
```

Não mostrar estado definitivo sem respaldo do backend.

---

## 12. Ordem futura no frontend

Depois dos fluxos administrativos centrais:

```text
PARTICIPANTE 1 — dashboard competitivo
PARTICIPANTE 2 — equipe/membros
PARTICIPANTE 3 — robôs
PARTICIPANTE 4 — inscrições
PARTICIPANTE 5 — Sumô pessoal
PARTICIPANTE 6 — Follow pessoal
PARTICIPANTE 7 — histórico
```

A experiência participante deve ser validada separadamente da experiência ORGANIZACAO.
