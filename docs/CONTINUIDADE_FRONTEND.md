# Continuidade — RASCOMP Frontend

Última atualização: **26/08/2026**

## 1. Identidade

```text
RASCOMP  = plataforma/software
RRC      = evento/competição
RAS UFRB = organização/identidade institucional
```

Repositório:

```text
Rascomp-FRONT/
├── gestao/        → aplicação autenticada
└── landing-page/  → experiência pública futura
```

## 2. Roadmap macro — congelado

```text
1. ADMIN / ORGANIZAÇÃO
2. PARTICIPANTE
3. LANDING PAGE RAS UFRB + RRC
```

O ADMIN está no fechamento funcional/visual. O PARTICIPANTE ganhou uma primeira versão demonstrável para a apresentação da equipe. A Landing continua pausada.

## 3. Estado do ADMIN

```text
Dashboard + Sidebar                    ✅
Autenticação                           ✅ validada localmente
Central da competição                  ✅
Inscrições                             ✅
Catálogos                              ✅
Histórico de chaves                    ✅ validado localmente
Árvore visual de Sumô                  ✅
Tela de arena Sumô                     ✅ implementação
Penalidades + Suicídio/WO               ✅ implementação
Follow Line                             ✅ implementação
Histórico por tomadas                  ✅
Tela operacional de tomada             ✅
Fotos em Follow/Sumô                    ✅
Progresso visual da competição          ✅
Consolidação final/responsividade       ⏳
```

### Rotas ADMIN

```text
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
```

## 4. Follow Line

### Domínio visual

```text
Robô
├─ Tomada 1
│  ├─ Tentativa 1
│  ├─ Tentativa 2
│  └─ Tentativa 3
├─ Tomada 2
└─ ...
```

A tela geral apresenta **Histórico de tomadas**. Cada tomada expande suas tentativas.

Ranking oficial:

```text
melhor tentativa válida/concluída da tomada
        ↓
resultado da tomada
        ↓
melhor tomada do robô
        ↓
ranking
```

A ação principal é:

```text
Registrar tomada
→ selecionar inscrição
→ abrir operação do robô
→ registrar próxima tentativa
```

A tela operacional possui:

- foto do robô;
- equipe;
- tomada atual;
- tomadas abertas;
- tentativas restantes;
- melhor tempo;
- histórico da tomada;
- tempo;
- penalidade;
- checkpoints;
- concluída/válida;
- observação.

## 5. Sumô

### Chave

`TournamentBracket.vue` representa o chaveamento visual com fases, conectores e placar.

### Operação

```text
/sumo/partida/:matchId
```

A tela de arena contém:

- foto dos dois robôs;
- nome/equipe;
- placar;
- histórico de rounds;
- vitória A/B;
- penalidades A/B;
- Suicídio/WO;
- empate;
- anulação;
- cancelamento;
- observação.

Partida finalizada ou histórica abre a mesma interface em leitura.

### Categorias

Não criar motores diferentes para RC/Autônomo.

```text
Mini Sumô RC
Mini Sumô Autônomo
Sumô 3 kg RC
Sumô 3 kg Autônomo
```

são categorias independentes e o backend garante isolamento por `categoryId`.

## 6. Fotos dos robôs

Componente comum:

```text
gestao/src/components/RobotPhoto.vue
```

Comportamento:

```text
robotId
→ GET galeria pública
→ foto principal
→ fallback para iniciais
```

Uso atual:

```text
Portal Participante     ✅
Operação Follow         ✅
Arena Sumô              ✅
Landing futura          ⏳
```

O participante também consegue enviar foto para robôs da própria equipe.

## 7. PARTICIPANTE — primeira versão

Rota:

```text
/minha-equipe
```

Após login com role `PARTICIPANTE`, `/` redireciona para o painel participante.

Entregue para a demonstração:

- resumo da equipe;
- competidores;
- robôs;
- galeria/foto principal;
- upload de foto;
- inscrições;
- Follow:
  - posição;
  - melhor tomada;
  - melhor tempo;
  - progresso de tomadas;
  - histórico por tomada;
- Sumô:
  - vitórias/derrotas;
  - última partida;
  - resultado;
  - próxima partida quando existir.

Pendente para etapa PARTICIPANTE completa:

- convite/aceite real para equipe existente;
- CRUD visual completo de integrantes;
- CRUD visual completo de robôs;
- inscrição em nova categoria pelo portal;
- gestão mais completa de múltiplas fotos;
- refinamento visual/responsivo.

## 8. Cenário de demonstração

Backend:

```powershell
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

Frontend:

```powershell
cd gestao
npm install
npm run dev
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

### Edição ao vivo

```text
RRC 2026 · Demonstração ao vivo
```

Estado:

- EM_ANDAMENTO;
- progresso ~50%;
- aprovadas + pendentes + rejeitada;
- ranking Follow pronto;
- Chronos Demo com 2/3 tomadas preenchidas;
- Tomada 3 disponível para operação ao vivo;
- Titan Demo com vitória em Sumô;
- chave parcial;
- penalidade;
- Suicídio/WO;
- categoria com BYEs.

### Histórico

```text
RRC 2025 · Histórico completo
```

- FINALIZADA;
- 32 robôs;
- chave 16 avos → final;
- resultados já ocorridos.

Roteiro:

```text
docs/ROTEIRO_DEMO_2026-08-27.md
```

## 9. Qualidade

Workflow criado:

```text
.github/workflows/frontend-checks.yml
```

Executa:

```text
npm ci
npm run typecheck
npm run build
```

Backend no checkpoint atual:

```text
45 testes
0 failures
0 errors
```

## 10. Regras arquiteturais

O frontend não deve calcular oficialmente:

- elegibilidade;
- inspeção;
- ranking;
- BYE;
- progressão;
- vencedor;
- campeão;
- resultado.

Esses valores vêm do backend.

## 11. Próximos passos após a demo

```text
1. validar todos os cenários testdata localmente
2. corrigir qualquer ajuste visual detectado na apresentação
3. fechar consolidação final do ADMIN
4. retomar PARTICIPANTE como etapa principal
5. completar fluxo de equipe/robôs/inscrições
6. iniciar LANDING RAS UFRB + RRC
```
