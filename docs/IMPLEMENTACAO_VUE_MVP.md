# Implementação Vue MVP — RASCOMP Front

## Decisão tecnológica

A implementação prática usa **Vue 3 + TypeScript + Vite**.

Referências de UX/estrutura:
- Armour/vue-typescript-admin-template;
- PanJiaChen/vue-admin-template;
- iview/iview-admin.

O código do RASCOMP é próprio. As referências foram usadas para padrões de shell administrativo, sidebar, rotas por permissão, cliente HTTP centralizado, dashboard operacional e separação entre API, store, views e componentes.

## Gestão

Stack:
- Vue 3;
- TypeScript;
- Vue Router;
- Pinia;
- Axios;
- Element Plus;
- Vite.

Fluxos existentes no MVP:
- login JWT;
- hidratação de sessão via `/api/v1/auth/me`;
- dashboard por perfil;
- competições;
- análise de inscrições;
- Follow Line com lançamento de tentativa e ranking;
- Sumô com inspeção, geração de chave, partidas, rounds e resultados;
- portal do participante em leitura.

---

# Decisão arquitetural — Camunda removido

Camunda deixou de fazer parte do caminho oficial do RASCOMP.

Motivo: os fluxos competitivos principais já são regras de domínio implementadas no Spring Boot e não precisam de um workflow engine adicional.

Arquitetura alvo:

```text
Vue Gestão
    ↓ REST
Spring Boot
    ├── inscrições
    ├── inspeção Sumô
    ├── geração de chave
    ├── partidas
    ├── rounds
    ├── resultado automático
    ├── progressão da chave
    └── ranking Follow Line
    ↓
Banco de dados
```

Camunda só deverá ser reconsiderado futuramente se surgir um processo realmente duradouro, multiator e com esperas/timers que justifique um BPMN executável.

---

# Sumô e chaveamento

O backend já suporta o fluxo necessário:

```text
inscrição APROVADA
      ↓
inspeção APTA
      ↓
geração do bracket
      ↓
participantes sorteados
      ↓
árvore na próxima potência de dois
      ↓
BYEs avançam automaticamente
      ↓
partidas
      ↓
rounds
      ↓
MatchResult automático
      ↓
vencedor avança
      ↓
final
      ↓
bracket FINALIZADO
```

## Referência visual aprovada

A tela de chaveamento deve convergir para o protótipo aprovado na conversa do projeto.

Direção:

```text
┌──────────── QUARTAS ────────────┐
│ Equipe A      2                 │
│ Equipe B      1                 │──┐
└─────────────────────────────────┘  │
                                     ├── SEMIFINAL ──┐
┌──────────── QUARTAS ────────────┐  │              │
│ Equipe C      0                 │──┘              │
│ Equipe D      2                 │                 ├── FINAL
└─────────────────────────────────┘                 │
                                                    │
...                                                 │
```

O Vue deve somente representar o estado oficial.

### Algoritmo de apresentação

1. carregar partidas por `bracketId`;
2. agrupar por `rodada`;
3. ordenar cada grupo por `ordem`;
4. cruzar com resultados da chave;
5. marcar vencedor confirmado;
6. representar `BYE` e `AGUARDANDO_PARTICIPANTES`;
7. desenhar as colunas e conectores responsivos;
8. ao clicar na partida, abrir detalhe com rounds;
9. após registrar round, fazer refetch de rounds, partidas, resultados e bracket.

Nunca calcular no cliente quem deve ocupar a próxima partida.

## Tela da partida

A experiência aprovada deve mostrar:

- participantes A/B;
- placar consolidado;
- status;
- rodada e ordem;
- lista de rounds;
- vencedor de cada round;
- ação para registrar novo round quando permitido;
- atualização automática após a mutação.

---

# Próxima etapa da Gestão

**GESTÃO UI — convergência para o protótipo aprovado**.

Ordem sugerida:

1. Shell/sidebar/topbar;
2. Dashboard;
3. Inscrições;
4. Follow Line;
5. Sumô — inspeções;
6. Sumô — bracket visual;
7. Sumô — partida/rounds;
8. equipes/competidores/robôs/modalidades;
9. revisão responsiva e estados de erro/loading/vazio;
10. integração final com backend.

---

# Landing

A Landing Vue está pausada como fundação/POC.

Ela será retomada após:

```text
Gestão consolidada
    ↓
contratos públicos revisados
    ↓
Landing
```

O site final será institucional da RAS UFRB e terá uma área dedicada ao evento RRC, incluindo acompanhamento público de ranking, chaveamentos, partidas e resultados.

Documento específico:

```text
docs/CONTINUIDADE_LANDING_PAGE.md
```

---

# Contrato de backend usado

A implementação está alinhada à arquitetura backend onde estão presentes autenticação, ownership, API pública e serviços competitivos.

Antes da integração final, confirmar que essa arquitetura está consolidada na branch oficial do backend utilizada para produção.

---

# Paleta

Base visual aprovada:
- roxo principal: `#4F1967`;
- rubro principal: `#9F0F3B`;
- rubro de destaque: `#C31549`;
- superfícies neutras claras;
- sidebar escura.

---

# Execução

Gestão:

```bash
cd gestao
cp .env.example .env
npm install
npm run dev
```

Landing POC:

```bash
cd landing-page
cp .env.example .env
npm install
npm run dev
```

Por padrão:
- Gestão: `http://localhost:5173`
- Landing: `http://localhost:5174`
- Backend: `http://localhost:8080`
