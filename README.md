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

### 1. Estabilização

- corrigir riscos encontrados na revisão estrutural;
- consolidar CSS/código redundante;
- manter CI verde;
- limpar artefatos antigos.

### 2. Permissões

Implementar `DEV`, `GESTAO`, `MIDIA`, `PARTICIPANTE`.

### 3. Ajustes Gerais DEV

Painel DEV-only para operações estruturais que hoje exigiriam banco:

- alterar role;
- transferir competidor/equipe;
- transferir robô;
- trocar responsável;
- corrigir inscrição;
- ativar/desativar entidades;
- manutenção com auditoria.

### 4. Gestor de mídia

Dentro de `gestao/`:

- tópicos;
- textos;
- imagens/mídias;
- slots/janelas da Landing;
- ordem;
- publicação;
- galeria.

A Landing deixa de depender de conteúdo institucional hardcoded.

### 5. Regras

Cards expansíveis para:

- Follow Line;
- Sumô e subcategorias;
- Futebol de Robôs;
- Ambiente/Vestimenta.

Os textos precisam ser confirmados contra o regulamento oficial antes de publicação.

### 6. Futebol de Robôs

Nova modalidade competitiva em que a RAS fornece os robôs. O participante poderá se inscrever sem possuir robô próprio. Esse requisito exige mudança real no backend porque `Registration.robot` é obrigatório hoje.

### 7. Participante completo + Landing consolidada

Completar fluxos de equipe/inscrição e integrar conteúdo/mídia públicos.

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

API padrão:

```text
VITE_API_URL=http://localhost:8080
```

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

- `docs/DOSSIE_PROJETO_RASCOMP.md` — **mapa mestre de arquitetura, manutenção, riscos e roadmap**
- `docs/CONTINUIDADE_FRONTEND.md` — checkpoint de continuidade
- `docs/SYSTEM_DESIGN_GESTAO.md` — desenho histórico da gestão
- `docs/STATUS_LANDING_PAGE.md` — acompanhamento específico da Landing

Para descobrir **qual arquivo alterar quando uma regra muda**, comece pelo dossiê mestre.