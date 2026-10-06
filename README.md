<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/gbsalermo/Rascomp-FRONT">
    <img src="gestao/public/rascomp-logo.webp" alt="RasComp" width="360">
  </a>

  <h1 align="center">RasComp — Frontend</h1>

  <p align="center">
    <strong>Gestão da competição, portal do participante e acompanhamento público do RRC em uma única experiência integrada ao backend RasComp.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black" alt="Pinia">
    <img src="https://img.shields.io/badge/Element_Plus-409EFF?style=for-the-badge" alt="Element Plus">
    <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
  </p>

  <p align="center">
    <a href="#-sobre-o-projeto">Sobre</a> •
    <a href="#-aplicações">Aplicações</a> •
    <a href="#-arquitetura">Arquitetura</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-como-executar">Execução</a> •
    <a href="#-documentação">Documentação</a>
  </p>
</div>

---

## 📌 Sobre o Projeto

O **RasComp** é a plataforma de gestão e acompanhamento das competições de robótica realizadas no contexto da **IEEE Robotics & Automation Society — UFRB**.

Este repositório concentra as interfaces responsáveis por conectar os diferentes públicos da competição ao mesmo domínio oficial:

```text
Organização ───────────────┐
                           │
Participante ──────────────┼──► RasComp Frontend ───► Backend RasComp
                           │                            │
Público / visitantes ──────┘                            └──► MySQL
```

A interface não recalcula regras competitivas por conta própria. Ranking, elegibilidade, resultados, inspeções, BYEs, progressão e campeão continuam sendo definidos pelo backend.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 🧩 Aplicações

O repositório é organizado em três aplicações Vue independentes.

### Gestão — `gestao/`

Interface autenticada usada pela organização e pelos participantes.

```text
gestao/
├─ dashboard / central da competição
├─ competições
├─ inscrições
├─ equipes
├─ robôs
├─ modalidades
├─ Follow Line
├─ Sumô
├─ chaves e resultados
├─ usuários
└─ portal do participante
```

### Landing Page — `landing-page/`

Interface pública voltada à apresentação institucional e ao acompanhamento da competição.

```text
landing-page/
├─ conteúdo institucional
├─ competição em destaque
├─ Follow Line público
├─ Sumô e chaveamentos
├─ equipes / robôs / resultados
└─ navegação pública
```

### Galeria — `photo-gallery/`

Experiência pública dedicada à exibição de álbuns e fotos relacionados ao evento.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 🏛️ Arquitetura

O frontend trabalha sobre contratos REST fornecidos pelo backend RasComp.

```text
┌──────────────────────┐
│      Gestão          │
│ organização + portal │
└──────────┬───────────┘
           │ JWT
           ▼
 /api/v1/**
 /api/v1/participante/**
           │
           │
┌──────────┴───────────┐
│    Backend RasComp   │
│ Spring Boot + MySQL  │
└──────────┬───────────┘
           │
           │ projeção pública
           ▼
 /api/v1/public/**
           │
┌──────────┴───────────┐
│ Landing / interfaces │
│      públicas        │
└──────────────────────┘
```

### Princípios da integração

- o backend é a fonte de verdade;
- autenticação é feita com JWT;
- operações administrativas usam os contratos autenticados;
- o participante acessa recursos próprios conforme ownership validado no backend;
- a Landing utiliza somente contratos públicos e sanitizados;
- alterações competitivas realizadas na Gestão são refletidas ao público pela mesma fonte de dados.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## ✨ Funcionalidades

### Organização

- [x] Autenticação;
- [x] Dashboard / Central da competição;
- [x] Gestão de competições;
- [x] Revisão de inscrições;
- [x] Equipes, robôs e modalidades;
- [x] Gestão de usuários;
- [x] Operação de Follow Line;
- [x] Histórico de tomadas;
- [x] Operação de Sumô;
- [x] Inspeção de competidores;
- [x] Partidas e rounds;
- [x] Chave visual;
- [x] BYEs e progressão refletidos pela API;
- [x] Resultados competitivos;
- [x] Fotos de robôs.

### Participante

O portal autenticado reúne em um único espaço:

- equipe;
- competidores;
- robôs;
- fotos;
- inscrições;
- acompanhamento do Follow Line;
- acompanhamento do Sumô;
- histórico competitivo disponível para a própria equipe.

### Público

A experiência pública permite consultar informações competitivas sem autenticação, utilizando DTOs sanitizados fornecidos pelo backend.

Entre os conteúdos exibidos estão:

- informações institucionais;
- competição;
- equipes e robôs;
- ranking do Follow Line;
- chaveamento do Sumô;
- partidas e resultados;
- informações públicas de acompanhamento da competição.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 🤖 Experiência Competitiva

### Follow Line

```text
Gestão registra tentativa
        ↓
Backend valida e persiste
        ↓
Ranking oficial é recalculado
        ↓
Frontend atualiza a interface
        ↓
Landing lê a projeção pública
```

A interface apresenta tomadas, tentativas, tempos, penalidades, ausência e ranking sem assumir a responsabilidade pelo cálculo oficial.

### Sumô

```text
Inspeção
   ↓
Chave
   ↓
Partida
   ↓
Rounds
   ↓
Resultado
   ↓
Progressão
```

A Gestão orienta a operação visual da arena, enquanto o backend decide oficialmente vencedor, resultado e progressão de chave.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 🛠️ Tecnologias

### Gestão

| Tecnologia | Finalidade |
|---|---|
| Vue 3 | Framework de interface |
| TypeScript | Tipagem estática |
| Vite | Build e desenvolvimento |
| Pinia | Estado global |
| Vue Router | Navegação |
| Element Plus | Componentes de interface |
| Axios | Cliente HTTP |

### Landing e Galeria

| Tecnologia | Finalidade |
|---|---|
| Vue 3 | Interface pública |
| TypeScript | Tipagem |
| Vite | Build e desenvolvimento |
| Vue Router | Navegação quando aplicável |

### Backend relacionado

**[gbsalermo/Rascomp](https://github.com/gbsalermo/Rascomp)**

```text
Java 21
Spring Boot 3.5.x
Spring Security + JWT
JPA / Hibernate
MySQL
Flyway
Swagger / OpenAPI
```

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 📁 Estrutura do Repositório

```text
Rascomp-FRONT/
├── gestao/             # aplicação autenticada
├── landing-page/       # experiência pública institucional/competitiva
├── photo-gallery/      # galeria pública
├── docs/               # documentação técnica do frontend
├── README.md
└── .gitignore
```

Cada aplicação possui configuração e dependências próprias, permitindo execução independente durante o desenvolvimento.

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js
- npm
- backend RasComp disponível para os fluxos integrados

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

### Landing Page

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

### API

As aplicações utilizam a variável:

```text
VITE_API_URL=http://localhost:8080
```

para apontar para o backend durante a execução local.

<p align="right">(<a href="#readme-top">voltar ao topo ⬆</a>)</p>

---

## 🔐 Segurança

A segurança efetiva pertence ao backend.

A interface pode adaptar menus e rotas à experiência do usuário, mas nunca trata ocultação de componentes como controle de acesso.

```text
Frontend
   ↓
JWT
   ↓
Backend
   ↓
autorização + ownership + regra de domínio
```

Dados públicos são consumidos por contratos específicos e sanitizados.

---

## 📚 Documentação

As ETAPAS 0–4 e a **V1-BETA A** estão concluídas/validadas. O roadmap continua organizado por maturidade do produto. O próximo trabalho é a discussão arquitetural da **V1-BETA B**, antes de qualquer implementação. O roadmap também possui um **checkpoint transversal de Otimização Mobile do MVP** dentro da PRIORIDADE 1. Ele acompanha as telas revisadas/criadas nas ETAPAS 4, 7, 8 e 9 e precisa estar concluído antes do fechamento do MVP na ETAPA 10; até aqui, o login é a interface com tratamento responsivo dedicado já revisado.

A documentação técnica detalhada permanece separada da página de apresentação do projeto.

- [`docs/README.md`](docs/README.md) — índice geral da documentação;
- [`docs/ETAPAS_POS_PROJETO.md`](docs/ETAPAS_POS_PROJETO.md) — roadmap canônico e estado atual;
- [`docs/DOSSIE_PROJETO_RASCOMP.md`](docs/DOSSIE_PROJETO_RASCOMP.md) — arquitetura e visão consolidada;
- [`docs/SYSTEM_DESIGN_GESTAO.md`](docs/SYSTEM_DESIGN_GESTAO.md) — desenho técnico da Gestão;
- [`docs/CONTRATO_REGRAS_COMPETITIVAS.md`](docs/CONTRATO_REGRAS_COMPETITIVAS.md) — referência das regras competitivas.

---

<div align="center">
  <strong>RasComp</strong><br>
  Gestão e acompanhamento de competições de robótica — IEEE RAS UFRB
</div>


---

## 🚀 Próximo ciclo — V1 Beta

As ETAPAS 0–4 estão concluídas/validadas.

O trabalho imediato segue o trilho:

```text
V1-BETA A — Landing pública
V1-BETA B — cloud + banco + storage/secrets
V1-BETA C — cadastro/acesso/inscrições reais
V1-BETA D — smoke + estabilização
```

### Integração Landing → Gestão

A Landing será a porta pública do RasComp e deverá possuir CTA principal como:

```text
Inscrever-se
```

Esse CTA redireciona para a aplicação autenticada de Gestão/Participante, onde cadastro, login, equipe e inscrições são realizados.

O destino não deve ficar hardcoded para ambiente local. A URL da aplicação autenticada deve ser configurável por ambiente para suportar:

```text
local
staging/homologação
produção temporária
produção definitiva/domínio próprio
```

### Branches do trilho Beta

Cada fase terá branch própria:

```text
v1-beta-a-landing
v1-beta-b-producao
v1-beta-c-inscricoes
v1-beta-d-estabilizacao
```

A próxima branch só deve nascer a partir do `main` após merge/validação da anterior.


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
