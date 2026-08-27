# RASCOMP Frontend

Frontend da plataforma **RasComp**.

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento / competição
RasComp  = plataforma de software
```

## Aplicações do repositório

O repositório possui hoje **três aplicações**:

```text
gestao/
├─ interface autenticada da organização
├─ portal do participante
└─ futuro gestor de mídia + ferramentas DEV

landing-page/
└─ site institucional público RAS UFRB + RRC

photo-gallery/
└─ protótipo público separado da galeria de fotos
```

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

## Estado funcional atual

### Organização / operação

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
```

### Participante

A primeira versão funcional existe em:

```text
/minha-equipe
```

Inclui:

- equipe;
- competidores;
- robôs;
- foto principal/upload;
- inscrições;
- acompanhamento Follow;
- histórico de tomadas;
- acompanhamento de Sumô.

### Landing pública

A Landing **já existe** em `landing-page/` e consome a API pública competitiva.

Hoje parte do conteúdo institucional ainda está hardcoded nos componentes. Isso será substituído pelo futuro módulo de **MÍDIA/CMS**.

### Galeria

`photo-gallery/` ainda usa álbuns/placeholders estáticos em `src/data/albums.ts`. Na implementação do CMS será decidido se ela continua como aplicação separada ou se será absorvida pela Landing.

## Arquitetura atual de acesso

O sistema ainda está no modelo legado:

```text
ORGANIZACAO
PARTICIPANTE
```

Essa arquitetura será substituída pelo modelo aprovado pós-apresentação:

```text
DEV
├─ acesso total e manutenção estrutural

GESTAO
├─ operação competitiva
└─ sem criação de competição/manutenção estrutural

MIDIA
└─ gestão editorial da Landing

PARTICIPANTE
└─ portal da própria equipe/inscrições
```

A mudança será feita também no backend; esconder itens de menu não é considerado controle de acesso.

## Próximas frentes aprovadas

O roteiro completo, com ordem, descrição e critério de conclusão de cada etapa, está em:

```text
docs/ETAPAS_POS_PROJETO.md
```

Resumo:

```text
0  Baseline da versão aprovada
1  Correções de lógica
2  Limpeza técnica
3  DEV / GESTAO / MIDIA / PARTICIPANTE
4  Avisos ao participante + Telegram futuro
5  Ajustes Gerais DEV + auditoria
6  Portabilidade institucional
7  Gestor de Mídia / CMS
8  Regras
9  Futebol de Robôs
10 Participante completo
11 Landing + Galeria
12 Hardening
13 Bateria manual completa
14 Deploy em nuvem / Cloudflare
```

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

Novas rotas previstas:

```text
/avisos
/midia
/regras
/ajustes-gerais
/futebol
```

Os nomes finais podem mudar na implementação.

## Qualidade

Gestão possui workflow:

```text
Frontend Checks
→ npm ci
→ npm run typecheck
→ npm run build
```

Backend no último checkpoint revisado:

```text
48 testes
0 falhas
0 erros
Demo profile com MySQL/Flyway ✅
```

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

O modo local será preservado mesmo depois de existir a implantação em nuvem.

## Fonte de verdade

O frontend não decide oficialmente:

- elegibilidade;
- ranking;
- inspeção;
- BYE;
- vencedor;
- campeão;
- progressão;
- resultado competitivo;
- autorização real.

Essas regras precisam existir no backend.

## Documentação principal

- `docs/DOSSIE_PROJETO_RASCOMP.md` — **mapa mestre de arquitetura, manutenção e riscos**
- `docs/ETAPAS_POS_PROJETO.md` — **roteiro pós-projeto, etapa por etapa**
- `docs/DEPLOY_CLOUDFLARE.md` — **guia passo a passo para manter local + publicar versão cloud**
- `docs/CONTINUIDADE_FRONTEND.md` — checkpoint de continuidade
- `docs/SYSTEM_DESIGN_GESTAO.md` — desenho histórico da gestão
- `docs/STATUS_LANDING_PAGE.md` — acompanhamento específico da Landing

Para descobrir **qual arquivo alterar quando uma regra muda**, comece pelo dossiê mestre. Para saber **qual é a próxima etapa**, use `ETAPAS_POS_PROJETO.md`.
