# RASCOMP Frontend

Frontend do projeto RASCOMP, organizado em duas aplicações independentes dentro do mesmo repositório:

- **Gestão**: aplicação autenticada para participantes e organização operarem o sistema;
- **Landing Page**: aplicação pública institucional e de acompanhamento da competição.

## Estrutura do repositório

```text
Rascomp-FRONT/
├── landing-page/
│   └── README.md
├── gestao/
│   └── README.md
├── docs/
│   ├── CONTINUIDADE_FRONTEND.md
│   └── SYSTEM_DESIGN_GESTAO.md
├── .gitignore
└── README.md
```

---

# Arquitetura geral

O backend é a única fonte de verdade.

```text
PARTICIPANTE / ORGANIZACAO
           │
           ▼
        Gestão
           │
           ▼
        Backend
       ┌───┴─────────────────────┐
       │                         │
 dados autenticados      projeção pública
                                 │
                                 ▼
                              Landing
```

A Gestão não envia dados diretamente para a Landing.

Separação prevista pela API:

```text
/api/v1/participante/**  -> PARTICIPANTE + ownership
/api/v1/**               -> ORGANIZACAO
/api/v1/public/**        -> público, somente leitura e sanitizado
```

Isso permite que ações operacionais realizadas na Gestão sejam refletidas ao público pela mesma fonte de dados, sem sincronização manual entre os dois frontends.

---

# 1. Frontend de Gestão

Será desenvolvido primeiro.

A aplicação possui dois contextos autenticados.

## PARTICIPANTE

Fluxo principal:

```text
Equipe -> Competidores/Robôs -> Inscrição -> Status
```

## ORGANIZACAO

Fluxo principal:

```text
Cadastros
-> Inscrições
-> Aprovação/Rejeição
-> execução da modalidade
-> resultados
```

As modalidades possuem operações diferentes:

```text
FOLLOW_LINE
inscrição -> tentativas -> ranking

SUMO
inscrição -> inspeção -> bracket -> partida -> rounds
-> MatchResult automático -> progressão
```

O System Design completo está em:

```text
docs/SYSTEM_DESIGN_GESTAO.md
```

Stack planejada:

```text
React
TypeScript
Vite
React Router
TanStack Query
Axios
React Hook Form
Zod
CSS variables + CSS Modules
```

---

# 2. Landing Page

A Landing não será apenas institucional.

Além de apresentar RAS/UFRB e RASCOMP, deverá funcionar como acompanhamento público da competição.

Escopo previsto:

- apresentação institucional;
- competição atual;
- modalidades/categorias;
- equipes e robôs;
- competidores quando permitidos pelo DTO público;
- ranking do Follow Line;
- chaveamento do Sumô;
- partidas;
- vencedores/resultados;
- progressão da chave;
- campeão;
- resultados históricos;
- conteúdo multimídia quando houver suporte real do backend.

Durante a competição, a Landing consumirá os contratos públicos e poderá atualizar widgets ao vivo por polling inicialmente. SSE/WebSocket só serão avaliados se houver necessidade real.

---

# Reflexo público das operações

Exemplos:

```text
Gestão registra tentativa Follow
        ↓
Backend valida/persiste
        ↓
Ranking é recalculado
        ↓
Landing lê ranking público atualizado
```

```text
Gestão registra round Sumô
        ↓
Backend consolida a partida
        ↓
MatchResult automático
        ↓
Backend progride a chave
        ↓
Landing lê bracket/resultado atualizado
```

A Landing nunca deve calcular oficialmente vencedor, ranking ou progressão.

---

# Lacunas conhecidas

## Fotos do dia

O backend atual possui foto de robô, mas não um módulo de galeria/fotos do evento. Essa funcionalidade dependerá de um contrato específico no backend.

## Pagamentos

O contrato congelado atualmente analisado não possui endpoints de pagamento. Não será criada tela falsa para isso.

---

# Documentação

Ordem de leitura:

```text
1. README.md
2. docs/SYSTEM_DESIGN_GESTAO.md
3. docs/CONTINUIDADE_FRONTEND.md
```

`CONTINUIDADE_FRONTEND.md` registra etapas concluídas, próximos passos, critérios de qualidade e a futura trilha da Landing.

---

# Estado atual

- [x] estrutura do repositório;
- [x] separação Gestão/Landing;
- [x] System Design da Gestão;
- [ ] fundação técnica da Gestão;
- [ ] autenticação;
- [ ] fluxos de participante;
- [ ] fluxos da organização;
- [ ] operação Follow Line;
- [ ] operação Sumô;
- [ ] System Design público;
- [ ] Landing Page.

Próxima etapa oficial:

```text
GESTÃO 0 — Fundação técnica
```
