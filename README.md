# RASCOMP Frontend

Frontend da plataforma **RasComp**, separado em duas aplicações:

```text
gestao/
└─ sistema autenticado para ORGANIZACAO e PARTICIPANTE

landing-page/
└─ experiência pública RAS UFRB + RRC
```

## Nomenclatura

- **RAS UFRB** — organização/instituição;
- **RRC** — evento/competição;
- **RasComp / RASCOMP** — plataforma de software.

## Stack — Gestão

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios

## Estado atual

### ADMIN / Organização

```text
Dashboard + Sidebar                    ✅
Login / persistência JWT               ✅
Central da competição                  ✅
Inscrições                             ✅
Catálogos                              ✅
Histórico de chaves                    ✅
Chave visual de Sumô                   ✅
Tela operacional da partida            ✅
Penalidades + Suicídio/WO               ✅
Follow Line                             ✅
Tela operacional de tomada             ✅
Histórico de tomadas                    ✅
Fotos nas telas de arena                ✅
Consolidação visual final               ⏳
```

### PARTICIPANTE

Existe uma primeira interface funcional e demonstrável em `/minha-equipe`:

- equipe do líder;
- competidores;
- robôs;
- foto principal do robô;
- upload de foto;
- inscrições;
- cartões de participação competitiva;
- Follow: ranking, melhor tomada, progresso e histórico de tomadas;
- Sumô: vitórias/derrotas, última partida e próxima partida quando disponível.

Fluxos completos de convite/entrada em equipe e refinamento final permanecem no roadmap.

### LANDING

Ainda não iniciada como etapa principal. Ela será construída depois do ADMIN e PARTICIPANTE para consumir os resultados públicos já consolidados pelo backend.

## Rotas principais

```text
/login
/cadastro

ADMIN
/
/competicoes
/inscricoes
/equipes
/robos
/modalidades
/follow-line
/follow-line/tomada/:registrationId
/sumo
/sumo/partida/:matchId
/chaves
/partidas
/resultados
/configuracoes

PARTICIPANTE
/minha-equipe
```

## Follow Line

A interface segue o domínio do backend:

```text
Registrar tomada
      ↓
selecionar inscrição
      ↓
tela do robô
      ↓
Tomada 1
├─ Tentativa 1
├─ Tentativa 2
└─ Tentativa 3
```

O ranking mostra a **melhor tomada**, representada pela melhor tentativa válida e concluída daquela tomada.

A tela geral apresenta:

- ranking oficial;
- histórico agrupado por tomadas;
- expansão das tentativas de cada tomada;
- tempo bruto;
- penalidade;
- tempo final;
- checkpoints;
- validade/conclusão.

A tela operacional apresenta:

- foto do robô;
- tomada atual;
- tomadas restantes;
- tentativas restantes;
- histórico daquela tomada;
- formulário rápido para a próxima tentativa.

## Sumô

A visão principal apresenta chave de campeonato real.

Ao abrir uma partida:

```text
/sumo/partida/:matchId
```

é exibido um painel de arena com:

- fotos dos robôs;
- placar;
- equipes;
- rounds já registrados;
- vitória A/B;
- penalidades;
- Suicídio/WO;
- empate;
- anulação;
- cancelamento;
- observação.

A progressão e o vencedor continuam sendo responsabilidade do backend.

Partidas encerradas/históricas abrem a mesma tela em modo de consulta.

## Fotos dos robôs

Foi criado o componente reutilizável:

```text
gestao/src/components/RobotPhoto.vue
```

Ele busca a foto principal pela API pública e usa fallback por iniciais quando não há imagem.

A foto atualmente aparece em:

- portal do participante;
- operação de Follow;
- arena de Sumô.

No portal participante também existe upload JPEG/PNG/WEBP para os próprios robôs.

## Executar Gestão

```powershell
cd gestao
npm install
npm run dev
```

Validação:

```powershell
npm run typecheck
npm run build
```

Foi adicionado workflow GitHub Actions:

```text
Frontend Checks
→ npm ci
→ npm run typecheck
→ npm run build
```

## Backend local

Por padrão:

```text
VITE_API_URL=http://localhost:8080
```

Para usar outra API:

```powershell
$env:VITE_API_URL="http://localhost:8080"
npm run dev
```

## Demonstração

No backend, suba com:

```powershell
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

### Organização

```text
organizacao.demo@rascomp.local
Rascomp@2026
```

### Participante

```text
lider.demo@rascomp.local
Rascomp@2026
```

### Cenários preparados

**RRC 2026 · Demonstração ao vivo**

- evento EM_ANDAMENTO;
- progresso visual próximo de 50%;
- inscrições pendentes para aprovação;
- ranking Follow pronto;
- Chronos Demo com 2/3 tomadas preenchidas;
- Titan Demo com vitória em Sumô;
- chave Sumô parcial;
- penalidade e Suicídio/WO;
- categoria com BYEs.

**RRC 2025 · Histórico completo**

- evento FINALIZADO;
- chave de 32 robôs;
- 16 avos até final;
- resultados históricos.

O roteiro completo está em:

```text
docs/ROTEIRO_DEMO_2026-08-27.md
```

## Direção do projeto

```text
1. ADMIN / ORGANIZAÇÃO
   └─ consolidar e validar

2. PARTICIPANTE
   └─ completar fluxos de equipe/inscrição

3. LANDING PAGE RAS UFRB + RRC
   └─ consumir dados públicos do backend
```

## Regra arquitetural

O frontend **não decide**:

- elegibilidade;
- vencedor;
- campeão;
- progressão de chave;
- BYE;
- ranking oficial;
- inspeção;
- resultado oficial.

Ele apresenta e opera contratos do backend, que permanece como fonte de verdade.
