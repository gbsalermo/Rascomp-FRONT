# Site Público — IEEE RAS UFRB

Aplicação pública institucional e competitiva da **RAS UFRB**, construída em **Vue 3 + TypeScript + Vite**.

## Nomenclatura

```text
RAS UFRB = organização / capítulo estudantil
RRC      = evento/competição de robótica
RasComp  = plataforma de software
```

A Landing não deve apresentar o evento RRC como se ele se chamasse RasComp.

## Estado atual

As ETAPAS 0–4 e a **V1-BETA A — Landing pública** estão concluídas e validadas. A Landing passa a ser a baseline visual/pública para a próxima fase.

Branch concluída da fase:

```text
v1-beta-a-landing
```

Após o merge, novas evoluções devem nascer de `main` em branch própria.

A Home possui estrutura institucional com:

```text
Header
Hero / destaques
Sobre IEEE + RAS UFRB
Equipe / diretoria / robôs / premiações
Galeria
Eventos
Competição ativa / acompanhamento
Footer
404 pública
```

A parte competitiva consome a API pública do backend.

Na V1-BETA A, conteúdo demonstrativo/hardcoded será revisado **seção por seção** e substituído por imagens, textos, links e postagens reais sempre que o conteúdo já estiver disponível. O CMS/Mídia continua planejado para tornar essa gestão editorial dinâmica depois da Beta.

Referências visuais/históricas úteis:

```text
../docs/STATUS_LANDING_PAGE.md
../docs/CONTINUIDADE_LANDING_PAGE.md
```

Esses arquivos são snapshots de subsistema, não roadmap.

## CTA para inscrições

A Landing é a porta pública do sistema e deve possuir ação principal **Inscrever-se**.

```text
Landing
→ VITE_GESTAO_URL
→ Gestão/Participante
→ cadastro ou login
→ inscrição
```

O CTA deve funcionar em desktop e mobile e a URL deve permanecer configurável por ambiente.

## Fluxo de dados

```text
Backend Spring Boot
→ /api/v1/public/**
→ Landing pública
```

A Landing não calcula oficialmente ranking, vencedor, chaveamento ou progressão.

## Variáveis principais

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_GALERIA_URL=http://localhost:5175
VITE_REFRESH_MS=20000
```

## Rodar localmente

```powershell
cd landing-page
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Porta padrão: `http://localhost:5174`.

## Galeria

Hoje a Landing pode apontar para `photo-gallery/`, mas a decisão definitiva de manter a galeria separada ou absorvê-la na experiência pública pertence à ETAPA 9.

## Conteúdo ainda não definitivo

Fotos, diretoria, projetos, premiações, agenda, contatos, parceiros e demais conteúdo editorial devem ser administráveis pelo futuro CMS em vez de depender de alterações manuais no Vue.

## Documentação global

Comece em `../docs/README.md` e consulte o roadmap canônico antes de alterar comportamento ou estrutura.

## Processo da V1-BETA A

Cada seção será revisada individualmente:

```text
visual
→ imagem real
→ texto real
→ links/CTA
→ desktop
→ mobile
→ validação
```

Objetivo final: site público real, responsivo, intuitivo e pronto para divulgação.

A Beta A não provisiona cloud definitiva; isso pertence à V1-BETA B.


## Fechamento formal da V1-BETA A — 05/10/2026

Status: **✅ CONCLUÍDA / VALIDADA / PRONTA PARA MERGE**

Escopo fechado:

- Landing institucional pública revisada e polida;
- responsividade desktop/tablet/mobile validada;
- Header, Hero, Sobre, Equipe, Robôs, Premiações, Galeria, Eventos e Footer;
- competição pública integrada ao ciclo real;
- ranking Follow, agenda/tomadas, chaveamento, BYE, 3º lugar e pódios;
- regra pública: histórico durante disputa e somente Top 3 após pódio completo;
- logos públicas de equipes com fallback;
- chave read-only no Portal do Participante;
- lotes de inscrição integrados e validados;
- Hero mostrando lote vigente real;
- documentação e regras sincronizadas;
- modo local preservado.

Pendência deliberadamente movida para o roadmap original:

- Hero pós-competição destacando campeões por categoria na etapa final de fechamento do MVP.

A branch `v1-beta-a-landing` não deve receber novos requisitos após o merge, salvo correção de regressão.

## Gate de planejamento antes da V1-BETA B

A B ainda **não está iniciada**. Antes do primeiro commit, discutir e aprovar:

```text
identidade real de conta
→ verificação de e-mail
→ ativação
→ login
→ recuperação segura de senha
```

Princípios já aceitos para discussão:

- coletar somente o mínimo necessário;
- posse do e-mail deve ser verificada;
- reduzir contas falsas/descartáveis sem introduzir coleta excessiva de dados pessoais;
- recuperação de senha deve funcionar por token/código de uso único, com expiração;
- resposta de recuperação não pode revelar se a conta existe;
- senha definitiva nunca deve ser visível ao DEV;
- fluxo assistido pelo DEV pode existir apenas como fallback auditado;
- escolher provedor de e-mail antes da implementação;
- acesso remoto de homologação deve estar disponível já no início da B, sem confundir isso com produção aberta;
- modo local e Cloudflare Tunnel permanecem como contingência oficial.
