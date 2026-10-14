# RasComp Gestão

Aplicação autenticada de operação do RasComp, construída em **Vue 3 + TypeScript + Vite**.

## Responsabilidades atuais

```text
DEV
→ acesso integral ao painel autenticado
→ operação competitiva
→ administração de usuários
→ configurações de sistema

GESTAO
→ competições
→ revisão de inscrições
→ equipes/robôs/modalidades
→ Follow Line
→ Sumô
→ chaves/resultados
→ sem administração estrutural de usuários/sistema

MIDIA
→ painel autenticado próprio
→ sem acesso automático à operação competitiva
→ ferramentas editoriais permanecem reservadas às etapas de mídia

PARTICIPANTE
→ /minha-equipe
→ própria equipe/competidores/robôs
→ fotos e inscrições
→ acompanhamento competitivo
```

A matriz atual é `DEV | GESTAO | MIDIA | PARTICIPANTE`. A UI usa capacidades semânticas para navegação e proteção de rotas, enquanto a autorização oficial permanece no backend.

## Integração com backend

```text
VITE_API_URL
→ Spring Boot
→ /api/v1/auth/**
→ /api/v1/**
→ /api/v1/participante/**
→ /api/v1/public/**
```

JWT é enviado pelo cliente HTTP central. A autorização oficial pertence ao backend.

## Arquivos centrais

```text
src/main.ts
src/router.ts
src/store.ts
src/api.ts
src/types.ts
src/api/**
src/types/**
```

`api.ts` e `types.ts` funcionam como fachadas compatíveis; os domínios internos foram separados durante a ETAPA 2.

## Chaveamento

O bracket é renderizado a partir do estado retornado pela API. O frontend pode organizar e destacar a árvore visual, mas **não calcula progressão oficial**.

```text
backend avança vencedor
→ frontend faz refetch
→ UI apresenta estado atualizado
```

## Avisos futuros

Na ETAPA 11 a gestão ganhará seção de Avisos por competição. O backend persistirá o aviso IN_APP e, quando configurado, fará a entrega complementar via Telegram. A UI não chamará a Telegram Bot API diretamente.

## Verificação local dos perfis da ETAPA 3

Suba o backend com o profile local de demonstração:

```powershell
cd rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

Depois rode o `gestao/` normalmente e compare os quatro perfis:

```text
DEV            organizacao.demo@rascomp.local   / Rascomp@2026
GESTAO         gestao.demo@rascomp.local        / Rascomp@2026
MIDIA          midia.demo@rascomp.local         / Rascomp@2026
PARTICIPANTE   lider.demo@rascomp.local         / Rascomp@2026
MEMBRO          membro.demo@rascomp.local        / Rascomp@2026
```

O `lider.demo` é responsável pela equipe e vê Chronos + Titan. O `membro.demo` pertence à mesma equipe, participa somente da inscrição do Chronos e deve enxergar apenas esse robô/essa participação. O profile `testdata` é somente para ambiente local/testes e nunca deve ser habilitado em produção.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Validação:

```bash
npm run typecheck
npm run build
```

Documentação global: `../docs/README.md`.

## Roadmap atual

As ETAPAS 0–4 estão concluídas/validadas.

O próximo trabalho pertence ao **TRILHO V1 BETA**:

```text
V1-BETA A → Landing pública finalizada/polida
V1-BETA B → cloud + banco + storage/secrets
V1-BETA C → cadastro/acesso/inscrições reais
V1-BETA D → smoke + estabilização
```

Depois da Beta, o roadmap oficial é retomado. Ajustes Gerais DEV avançados ficam para o pós-go-live e não bloqueiam a primeira publicação.

Produção recebe somente versões validadas em ambiente não-prod.

## Estado de responsividade mobile

Antes da ETAPA 4, o login é a única interface que já recebeu otimização responsiva dedicada e correções específicas de breakpoint.

As demais telas de `gestao/` ainda devem ser revisadas para uso em celular/tablet.

Esse trabalho pertence ao **checkpoint transversal de Otimização Mobile do MVP**. Ele começa junto da revisão das telas existentes na ETAPA 4 e acompanha os módulos alterados/criados na PRIORIDADE 1 até ser concluído antes da ETAPA 10.

A ETAPA 14 fará apenas a validação física final em aparelhos reais.


## Checkpoint de início da ETAPA 4 — 22/09/2026

Branch de trabalho:

```text
etapa-4-consolidacao-mvp
```

Estado:

- ETAPA 4 autorizada e iniciada;
- BLOCO 1 em andamento;
- baseline técnico, autenticação, Shell e UX global são o escopo atual;
- ETAPA 5 permanece bloqueada;
- nenhuma nova funcionalidade estrutural deve ser antecipada.


## ETAPA 4

O BLOCO 1 da ETAPA 4 foi concluído e validado em 22/09/2026.

Estado técnico final:

```text
Frontend Checks #97 ✅
Backend Tests #329  ✅ 142 testes verdes
MySQL + Flyway V14 + testdata ✅
```

O próximo trabalho é o BLOCO 2 — Gestão administrativa, começando pela revisão do Dashboard/Central e seguindo interface por interface.


## BLOCO 2 — implementação concluída

A gestão administrativa da ETAPA 4 foi concluída e validada pelo usuário em 23/09/2026.

Inclui:

- contexto DEV foco local x competição vigente global;
- Usuários separados entre Organização/Diretoria e Participantes;
- edição cadastral e regras de ativação/permissão;
- tela própria de Competidores;
- Equipes/Robôs/Fotos contextualizados;
- Inscrições com aprovação, cancelamento e reativação;
- restrições DEV x GESTAO aplicadas também no backend.

Checkpoint: Frontend Checks #137 ✅; Backend Tests #371 ✅ com 155 testes; MySQL/Flyway V15/testdata ✅.

O BLOCO 2 foi encerrado e o BLOCO 3 — Operação competitiva foi implementado integralmente.


### Checkpoint atual

```text
BLOCO 1 ✅
BLOCO 2 ✅ CONCLUÍDO / VALIDADO
BLOCO 3 🧪 IMPLEMENTADO / AGUARDANDO VALIDAÇÃO
```

Último checkpoint: Frontend Checks #170 ✅; Backend Tests #415 ✅; Flyway V17/testdata ✅.


### BLOCO 3 — checkpoint de implementação

```text
3A Follow Line                 ✅ implementado
3B Sumô                        ✅ implementado
3C Chaves/Agenda/Resultados    ✅ implementado
BLOCO 3                        🧪 aguardando validação manual
```

Agenda unificada disponível em `/agenda`; Partidas permanece como detalhe das chaves e Resultados consolida vencedores por categoria.

Checkpoint: Frontend Checks #213 ✅; Backend Tests #493 ✅; 166 testes backend; MySQL/Flyway V18/testdata ✅.


## Checkpoint visual — Gestão de Mídia (13/10/2026)

Na branch `v1-pos-cloud-gestao-midia`, as rotas protegidas por `manageMedia` estão disponíveis para DEV/MIDIA:

- `/midia`: Biblioteca, filtros, detalhes, upload local simulado e associação a álbuns.
- `/midia/albuns`: cartões de álbuns, criação, renomeação, exclusão sem apagar fotos.
- `/midia/landing`: seções editoriais e prévia de publicação no Hero vinculada a eventos/galeria.

Execute `npm ci && npm run dev` na pasta `gestao` (com backend local disponível para autenticação). As fotos de exemplo são **simuladas em memória** e arquivos selecionados ficam apenas no navegador; nenhuma operação grava banco/R2. A alteração de conteúdo do Hero e o editor de enquadramento são somente prévias visuais. A `main` não foi alterada por este checkpoint.

## Validação dos editores específicos da Landing
Na branch `v1-pos-cloud-gestao-midia`, navegue em `/midia/landing`: Intro / Heroes (imagem e publicação), Sobre (sequência de fotos), Equipe e Conquistas (cargos fixos, voluntários limitados a 12 e conquistas editáveis), Robôs (banner e quatro categorias), Eventos (foto, data, detalhes e ordem), Patrocinadores (até 12 logos) e Competição (imagem e Hero editorial, sem interferir na API). O seletor de foto permite enviar arquivo diretamente para a prévia local da Biblioteca. A opção de exibição pública é um controle ilustrativo — **não envia imagens à Galeria independente**. Em `/midia/albuns`, testar capa manual ou automática e visualização sem recorte. O PR #7 segue em rascunho, pendente de validação manual.

## Padrão de exibição das imagens na prévia local
Em `/midia` → **Adicionar fotos**, escolha para o lote `Privadas` ou `Públicas` e defina separadamente o **padrão para novos envios**. A preferência do usuário DEV/MIDIA é memorizada somente neste navegador por ID de conta; cada novo modal usa esse padrão inicialmente, mas permite sobrescrever para o lote corrente. O upload direto das seções da Landing também respeita o padrão. Depois de adicionar as fotos, o campo **Exibir na Galeria pública (após integração)** no detalhe permite modificar uma foto individualmente. **Tudo permanece em memória e não sincroniza com a Galeria pública nesta fase.**

## Edição de conteúdos já existentes — checkpoint visual
O editor de `/midia/landing` agora inicia **Intro / Heroes** com os quatro slides institucionais originais (`ras`, `schools`, `workshops`, `awards`) e permite selecionar, editar, trocar fotos, ativar/ocultar, mover na ordem, adicionar, remover e restaurar o Hero original. Eventos e conquistas já existentes são inicializados a partir do inventário editorial versionado em `src/content/landingEditorialSeeds.ts`. Os arquivos de robôs/categorias, diretoria, voluntários e logos vêm das pastas de assets da Landing como imagens de prévia, permitindo alterações nas listas sem alterar os arquivos de origem. **Nenhuma mudança é publicada**: é um snapshot de interface em memória, que será migrado ao CMS persistente após validação. Para validar, abra `/midia/landing` com conta DEV/MIDIA e teste edições nos itens marcados `Já existe na Landing`.

## Testes adicionais do editor (13/10)
Faça login local e abra `/midia/landing`: no Hero, edite qualquer slide atual, altere campos/imagem, clique **Restaurar original** e confira o aviso; marque/desmarque **Hero com botão**; remova um original e teste **Recuperar originais removidos**. Em **Sobre**, agora devem aparecer as fotos existentes de `landing-page/src/assets/about/`. Em **Robôs**, o banner deve ficar contido em sua prévia sem bloquear abas ou ações. Todos os arquivos públicos antigos dos Heroes são servidos localmente pelo plugin Vite dev `/__rascomp_landing_media/`; arquivos inválidos geram fallback. Fotos internas versionadas começam privadas por padrão. Reinicie `npm run dev` após atualizar a branch, pois `vite.config.ts` mudou.

## Gestão de Mídia — Hero competitivo e Footer
Em `/midia/landing`, abra **Competição** para testar o Hero competitivo: foto, subtítulo, texto extra, ativo/inativo e botão secundário opcional. Os valores “API” são apenas indicadores da fonte dos dados oficiais (nome, situação, lote, categorias e CTA principal). Abra **Footer** para editar, visualizar e restaurar contatos, localização, textos de apoio e URLs de instituições. Os dados iniciais são padrões encontrados no código da Landing, não valores buscados ao vivo. Nada nessa versão muda os dados da competição ou publica alterações no Footer real.

## QA — enquadramento e Hero competitivo
Em `/midia/landing` abra **Competição**: ao desativar o Hero, sua prévia some e uma mensagem explica que a seção principal continua independente; ao ativar, volta a prévia. Esta regra ainda exige integração ao CMS para surtir efeito na Landing pública. Em **Robôs**, escolha uma foto da categoria, edite o nome mostrado e escolha legenda sobre ou abaixo da foto. Teste **Ajustar foto** e altere zoom, largura, altura, posição e encaixe; repita com banner, Hero, Sobre, diretoria, conquistas, eventos, patrocinadores e competição. Os ajustes não alteram o arquivo original e ainda são exclusivamente da sessão local. Botões pequenos ganharam tamanho maior.

## Prévia da Landing real (somente desenvolvimento local)
Inicie dois terminais no repositório `Rascomp-FRONT`:
```powershell
cd gestao
npm ci
npm run dev
```
```powershell
cd landing-page
npm install
npm run dev
```
Com o backend de autenticação disponível, entre com perfil DEV/MIDIA em `http://localhost:5173/midia/landing`, edite um slide e clique **Prévia do site**. Isso abrirá a Landing verdadeira em `http://localhost:5174/?rascomp_media_preview=1`, identificada com a faixa **PRÉVIA LOCAL — NÃO PUBLICADA**. Ao modificar algo na Gestão, clique **Aplicar na prévia local** para atualizar a aba aberta. A navegação para links externos/inscrição é bloqueada no modo de prévia. Se a janela for bloqueada, permita pop-ups do localhost. Esse fluxo não grava banco, R2, arquivos estáticos ou publicações e não funciona em produção; o estado atual só existe na sessão do navegador.


## Nova prévia da Galeria e publicação independente
Na Biblioteca, um arquivo pode ser usado na Landing e permanecer **privado** na Galeria. O upload individual/em lote tem seleção Pública/Privada e padrão do usuário; cada foto mantém seu próprio switch de visibilidade. Os filtros **Na Galeria** e **Privadas** ajudam a revisar o acervo. Em **Biblioteca** ou **Álbuns**, clique **Prévia da Galeria** para abrir `localhost:5175` com **somente fotos públicas** desta sessão, inclusive imagens sem álbum. Clique novamente para atualizar após mudar o estado das imagens. Nenhuma ação altera a Galeria publicada: é prévia local segura, como a Prévia do site. Somente depois do backend CMS o usuário poderá Salvar rascunho/Publicar alterações de verdade.
