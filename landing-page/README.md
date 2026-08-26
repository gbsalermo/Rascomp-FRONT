# Site Público — IEEE RAS UFRB

Aplicação pública institucional da **IEEE Robotics & Automation Society — RAS UFRB**, construída em **Vue 3 + TypeScript + Vite**.

## Nomenclatura oficial

- **RAS UFRB** = identidade institucional principal do site;
- **RRC** = evento/competição de robótica;
- **RasComp / RASCOMP** = plataforma de software responsável por gestão, backend e dados competitivos.

A Landing nunca deve apresentar o evento RRC como “RASCOMP”.

---

## Estado atual

A arquitetura visual da Home está fechada em 8 janelas:

```text
1. Header
2. Hero / Painel de Destaques
3. Sobre IEEE + RAS UFRB
4. Equipe / Diretoria / Robôs / Premiações
5. Galeria
6. Eventos da RAS
7. Competição atual + acompanhamento [CONDICIONAL]
8. Footer institucional
```

A próxima fase é **revisão integrada no navegador**, substituição de placeholders e validação técnica.

Documentos de referência:

```text
docs/CONTINUIDADE_LANDING_PAGE.md
docs/STATUS_LANDING_PAGE.md
docs/REVISAO_DEMO_LANDING_PAGE.md
```

---

## Identidade visual

Paleta congelada:

```text
Rubro principal        #D20F39
Rubro secundário       #CF1037
Rubro escuro           #B70C32
Roxo principal         #5D2281
Roxo de interação      #6B1F8A
Texto principal        #2B2230
Cinza/borda suave      #E9E2EC
Fundo principal        #FFFFFF
```

Regra:

- rubro = títulos, competição, alertas e CTA principal;
- roxo = estrutura, hover, sublinhados, CTA secundário e fechamento institucional;
- Footer = área principal rubra + faixa final roxo profundo.

---

## Fluxo de dados competitivo

```text
Gestão
  ↓
Backend Spring Boot
  ↓
/api/v1/public/**
  ↓
Landing pública
```

A Landing não calcula oficialmente ranking, vencedor, chaveamento ou progressão.

A Janela 7 só aparece quando:

```text
competition.status === EM_ANDAMENTO
```

---

## Rodar a Landing

```powershell
cd Rascomp-FRONT\landing-page
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Porta padrão:

```text
http://localhost:5174
```

Gestão, por padrão:

```text
http://localhost:5173
```

Backend, por padrão:

```text
http://localhost:8080
```

---

## Cenário completo para demonstração

O backend possui um profile opt-in `testdata` com competição em andamento, Follow Line, Sumô, BYEs, resultados e histórico.

No PowerShell, antes de subir o backend:

```powershell
cd Rascomp\rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\run-local.ps1
```

O profile habilita:

```text
rascomp.test-data.bracket-history-enabled=true
rascomp.test-data.follow-line-enabled=true
rascomp.test-data.demo-showcase-enabled=true
```

Credenciais criadas pelo cenário de demonstração:

```text
PARTICIPANTE
lider.demo@rascomp.local
Rascomp@2026

ORGANIZAÇÃO
organizacao.demo@rascomp.local
Rascomp@2026
```

Esse cenário cria uma competição `EM_ANDAMENTO`, permitindo demonstrar a Janela 7 completa.

---

## Antes de apresentar

Executar nesta ordem:

```powershell
# backend
cd Rascomp\rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\run-local.ps1

# gestão
cd Rascomp-FRONT\gestao
npm install
npm run dev

# landing
cd Rascomp-FRONT\landing-page
npm install
npm run typecheck
npm run build
npm run dev
```

Na Landing, conferir:

```text
Header
→ Hero
→ Sobre
→ Equipe/Diretoria/Robôs/Premiações
→ Galeria
→ Eventos
→ Competição atual / Follow Line / Sumô
→ Footer
```

---

## Pendências conhecidas

Ainda não são conteúdo final:

- fotos institucionais;
- membros e diretoria;
- parte dos robôs/projetos;
- premiações;
- números institucionais;
- agenda/eventos editoriais;
- contatos e redes sociais;
- parceiros;
- newsletter;
- páginas de Privacidade e Termos;
- asset IEEE RAS ainda deve ser copiado fisicamente para `landing-page/public/` antes da publicação.

Esses itens não impedem a demonstração de layout/fluxo, mas devem ser substituídos antes da publicação oficial.
