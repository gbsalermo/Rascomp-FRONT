# RasComp Frontend

Frontend da plataforma **RasComp**.

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

## Estado atual — 04/09/2026

O projeto foi apresentado e aprovado. O ciclo atual é de estabilização e evolução controlada.

```text
ETAPA 0  ✅ baseline concluída / validada
ETAPA 1  🚧 atual — correções de lógica e integridade
ETAPA 2+ ⏳ não iniciadas
```

Em 04/09/2026 foi realizado um checkpoint de revisão/limpeza **documental** antes da retomada da ETAPA 1. Isso não antecipa a limpeza técnica da ETAPA 2.

Roadmap oficial:

```text
docs/ETAPAS_POS_PROJETO.md
```

Ponto de entrada da documentação:

```text
docs/README.md
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
→ Java 21 + Spring Boot + MySQL + Flyway
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
Follow Line                            ✅
Histórico e operação de tomadas        ✅
Sumô / inspeção / batalha              ✅
Chave visual / BYE / progressão        ✅
Histórico de chaves                    ✅
Fotos de robôs                         ✅
404 personalizada                      ✅
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
4. docs/CONTINUIDADE_FRONTEND.md
5. documentos específicos do domínio necessário
```

Após o checkpoint documental atual, o próximo trabalho é **retomar a ETAPA 1**.