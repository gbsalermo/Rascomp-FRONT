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

A ETAPA 1 — lógica e integridade está concluída/validada. O backend possui checkpoint de **111 testes verdes** com MySQL/Flyway V12 validado. A ETAPA 2 é a próxima etapa do roadmap, mas permanece não iniciada.

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
