# RasComp Frontend

Frontend da plataforma **RasComp**.

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

---

## Estado atual — 31/08/2026

O projeto foi apresentado e aprovado. O trabalho atual é o ciclo pós-projeto de estabilização e evolução controlada.

```text
ETAPA 0 — baseline/congelamento       ✅ concluída / validada
ETAPA 1 — correções de lógica         🚧 etapa atual
ETAPA 2+                              ⏳ não iniciadas
```

O roadmap oficial não é mantido neste README. Consulte:

```text
docs/ETAPAS_POS_PROJETO.md
```

**Não avançar para a etapa seguinte sem validação explícita.**

Para outra pessoa/IA começando o projeto, o ponto de entrada é:

```text
docs/README.md
```

---

## Aplicações do repositório

O repositório possui **três aplicações**:

```text
gestao/
├─ interface autenticada da organização
├─ portal do participante
└─ futuras áreas DEV/MIDIA

landing-page/
└─ site institucional público RAS UFRB + RRC

photo-gallery/
└─ protótipo público separado da galeria
```

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

Backend relacionado:

```text
gbsalermo/Rascomp
→ Java 21 + Spring Boot + MySQL + Flyway
```

---

## Estado funcional conhecido

### Gestão / operação

```text
Dashboard + Sidebar                    ✅
Autenticação JWT                       ✅
Central da competição                  ✅
Inscrições                             ✅
Equipes / robôs / modalidades          ✅
Usuários ativo/inativo                 ✅
Follow Line                            ✅
Histórico por tomadas                  ✅
Operação de tomada                     ✅
Sumô                                   ✅
Chave visual                           ✅
Arena da partida                       ✅
2 penalidades = derrota do round       ✅
Suicídio/WO                            ✅
Histórico de chaves                    ✅
Fotos de robôs                         ✅
Página 404 personalizada               ✅ 30/08/2026
```

### Participante

A primeira versão funcional está em:

```text
/minha-equipe
```

Inclui:

- equipe;
- competidores;
- robôs;
- fotos;
- inscrições;
- acompanhamento Follow;
- histórico de tomadas;
- acompanhamento de Sumô.

O portal ainda não está finalizado; sua conclusão está planejada para a **ETAPA 10**.

### Landing

A Landing já existe em `landing-page/` e consome a API pública competitiva.

```text
Home institucional inicial             ✅
Competição ativa                       ✅
Follow público                          ✅
Sumô/chaves públicos                    ✅
Página 404 pública                     ✅ 30/08/2026
CMS/Mídia                              ⏳ ETAPA 7
Assets institucionais finais           ⏳ ETAPA 7
Consolidação Landing/Galeria           ⏳ ETAPA 11
```

Parte do conteúdo institucional ainda está hardcoded/placeholder. Isso será substituído pelo futuro módulo de MÍDIA/CMS.

### Galeria

`photo-gallery/` ainda usa álbuns/placeholders estáticos. Na ETAPA 11 será fechada a decisão de mantê-la separada ou incorporá-la à Landing; a direção preferencial atual é incorporar, salvo motivo real para app/deploy independente.

---

## Segurança atual

O frontend ainda reflete o modelo legado:

```text
ORGANIZACAO
PARTICIPANTE
```

A nova matriz aprovada para a **ETAPA 3** é:

```text
DEV
GESTAO
MIDIA
PARTICIPANTE
```

Essa mudança ainda não está implementada.

A autorização real precisa existir no backend. Esconder botão/menu nunca é considerado segurança.

---

## Qualidade — último checkpoint documentado

Gestão possui workflow de:

```text
npm ci
npm run typecheck
npm run build
```

Último checkpoint documentado do backend:

```text
48 testes
0 falhas
0 erros
MySQL + Flyway + testdata ✅
```

A contagem de testes é um snapshot conhecido e só deve ser atualizada depois de nova execução real.

---

## Executar Gestão localmente

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

API padrão:

```text
VITE_API_URL=http://localhost:8080
```

---

## Executar Landing localmente

```powershell
cd landing-page
npm install
npm run dev
```

Variáveis principais:

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

O modo local deverá continuar funcionando mesmo quando existir deploy cloud.

---

## Rotas autenticadas atuais

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

Rotas futuras podem incluir:

```text
/avisos
/midia
/regras
/ajustes-gerais
/futebol
```

Os nomes finais serão definidos na implementação da etapa correspondente.

---

## Fonte de verdade

O frontend **não decide oficialmente**:

- elegibilidade;
- ranking;
- inspeção;
- BYE;
- vencedor;
- campeão;
- progressão;
- resultado competitivo;
- autorização real.

Essas regras pertencem ao backend.

---

## Documentação — ordem para começar

```text
1. docs/README.md
   → índice, autoridade dos documentos e protocolo de handoff

2. docs/ETAPAS_POS_PROJETO.md
   → único roadmap canônico + etapa atual

3. docs/DOSSIE_PROJETO_RASCOMP.md
   → arquitetura, domínio, decisões, riscos e "onde mexer"

4. docs/CONTINUIDADE_FRONTEND.md
   → checkpoint vivo deste repositório

5. documentos específicos do domínio necessário
```

Documentos importantes adicionais:

```text
docs/DECISAO_DEPLOY_CLOUD.md
→ decisão congelada do modelo local + cloud

docs/DEPLOY_CLOUDFLARE.md
→ guia futuro da ETAPA 14

docs/STATUS_LANDING_PAGE.md
→ snapshot detalhado da Landing em 26/08/2026

docs/CONTINUIDADE_LANDING_PAGE.md
→ continuidade específica da Landing

docs/CONTINUIDADE_GALERIA_FOTOS.md
→ continuidade específica da galeria

docs/SYSTEM_DESIGN_GESTAO.md
→ referência de design/arquitetura histórica da gestão
```

Arquivos datados de revisão/demonstração devem ser tratados como snapshots históricos, não como roadmap atual.

---

## Regra de continuidade

Outra IA deve:

```text
ler docs/README.md
confirmar a ETAPA atual
ler o Dossiê Mestre
verificar o código real
trabalhar somente na etapa atual
manter backend como fonte de verdade
atualizar testes/documentação quando necessário
parar no checkpoint e aguardar validação
```

No estado atual, isso significa: **continuar a ETAPA 1 e não iniciar ETAPA 2 ou novas funcionalidades antecipadamente**.