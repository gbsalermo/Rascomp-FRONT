# RasComp Frontend

Frontend da plataforma **RasComp**.

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

## Estado atual — 08/09/2026

O projeto foi apresentado e aprovado. O ciclo atual é de estabilização e evolução controlada.

```text
ETAPA 0  ✅ baseline concluída / validada
ETAPA 1  🚧 atual — correções de lógica e integridade
ETAPA 2+ ⏳ não iniciadas

Bloco 1 — Competition + Registration  ✅
Bloco 2 — Follow Line                  ✅
Bloco 3 — Sumô                         ✅
Bloco 4 — Chaves                       ⏭️ próximo / não iniciado
Bloco 5 — Fluxos integrados            ⏳
```

Em 04/09/2026 foi realizado um checkpoint de revisão/limpeza **documental**. Em 08/09/2026 o Bloco 3 — Sumô foi concluído e validado. A limpeza técnica da ETAPA 2 continua separada.

Roadmap oficial:

```text
docs/ETAPAS_POS_PROJETO.md
```

Ponto de entrada da documentação:

```text
docs/README.md
```

Contrato competitivo:

```text
docs/CONTRATO_REGRAS_COMPETITIVAS.md
```

---

## Aplicações

```text
gestao/
├─ interface autenticada de operação
├─ portal do participante
└─ futuras áreas DEV e MIDIA

landing-page/
└─ site público institucional + competitivo

photo-gallery/
└─ protótipo separado de galeria
```

A decisão definitiva sobre incorporar `photo-gallery/` à Landing pertence à ETAPA 11.

---

## Stack

### Gestão

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios

### Landing / Galeria

- Vue 3
- TypeScript
- Vite

Backend:

```text
gbsalermo/Rascomp
→ Java 21 + Spring Boot + MySQL + Flyway V11
```

---

## Estado funcional conhecido

### Gestão

```text
Autenticação JWT                       ✅
Dashboard / Central                    ✅
Competições                            ✅
Inscrições                             ✅
Equipes / robôs / modalidades          ✅
Usuários                               ✅
Follow Line                            ✅ Bloco 2 alinhado
Histórico e operação de tomadas        ✅
Sumô / inspeção / batalha              ✅ Bloco 3 alinhado
Inspeção humana APTO/INAPTO            ✅
Modo Sumô AUTONOMO / RC                ✅
Rounds extras justificados             ✅
Falha de inicialização                 ✅
Juízes / decisão de juiz               ✅
Chave visual / BYE / progressão        ✅ base atual; Bloco 4 pendente
Histórico de chaves                    ✅
Fotos de robôs                         ✅
404 personalizada                      ✅
```

Checkpoint de qualidade do Bloco 3:

```text
Frontend Gestão                  typecheck + build ✅
Backend                          87 testes / 0 falhas / 0 erros / 0 skipped
MySQL + Flyway V11 + testdata    ✅
```

### Participante

A primeira versão funcional está em `/minha-equipe` e inclui equipe, competidores, robôs/fotos, inscrições e acompanhamento de Follow/Sumô.

A conclusão do portal é ETAPA 10.

### Landing

A Landing consome a API pública competitiva e já possui competição ativa, Follow público, Sumô/chaves e 404 personalizada.

Conteúdo institucional ainda hardcoded/placeholder será tratado pelo CMS/Mídia na ETAPA 7.

### Galeria

`photo-gallery/` ainda usa dados estáticos e é protótipo, não fonte editorial definitiva.

---

## Sumô — operação atual

A gestão representa o contrato competitivo aprovado com:

```text
inspeção física
→ APTO/INAPTO informado pela organização
→ peso opcional e apenas informativo

categoria
→ MINI_500G | SUMO_3KG
→ AUTONOMO | RC

partida
→ 3 rounds regulares / 2 vitórias
→ 2 penalidades = derrota automática
→ SUICIDIO_WO
→ FALHA_INICIALIZACAO
→ rounds extras limitados + justificativa
→ decisão final por juiz identificado quando necessária
```

O frontend orienta a operação, mas o backend continua sendo a fonte de verdade.

---

## Segurança

Modelo atual:

```text
ORGANIZACAO
PARTICIPANTE
```

Modelo aprovado para ETAPA 3:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

A autorização real pertence ao backend. Esconder menu/botão não é segurança.

---

## Avisos e Telegram — planejamento

A ETAPA 4 concentrará o trabalho de comunicação:

```text
GESTAO/DEV
→ Avisos de uma competição
→ persistência IN_APP
→ entrega complementar via Telegram quando habilitada
```

`IN_APP` será a fonte de verdade. Não será obrigatório, inicialmente, vincular a conta RasComp à conta Telegram. O futuro código competitivo da `Registration` poderá ser reutilizado como identificação opcional sem bloquear a primeira versão.

---

## Executar localmente

### Gestão

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

### Landing

```powershell
cd landing-page
npm install
npm run dev
```

### Galeria

```powershell
cd photo-gallery
npm install
npm run dev
```

API padrão:

```text
VITE_API_URL=http://localhost:8080
```

O modo local deve continuar funcional após a futura implantação cloud.

---

## Rotas principais da gestão

```text
/login
/cadastro
/recuperar-senha
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
/usuarios
/configuracoes
/minha-equipe
```

Rotas futuras serão definidas nas etapas correspondentes (`/avisos`, `/midia`, `/regras`, `/ajustes-gerais`, `/futebol`).

---

## Fonte de verdade

O frontend não decide oficialmente autorização, ownership, elegibilidade, ranking, inspeção, BYE, vencedor, progressão, campeão ou resultado competitivo. Essas regras pertencem ao backend.

---

## Documentação

Leia nesta ordem:

```text
1. docs/README.md
2. docs/ETAPAS_POS_PROJETO.md
3. docs/DOSSIE_PROJETO_RASCOMP.md
4. docs/CONTRATO_REGRAS_COMPETITIVAS.md
5. docs/CONTINUIDADE_FRONTEND.md
6. documentos específicos do domínio necessário
```

Próximo trabalho, quando explicitamente autorizado: **ETAPA 1 · Bloco 4 — Chaves**.
