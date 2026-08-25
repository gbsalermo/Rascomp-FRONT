# Site Público — RAS UFRB / RRC

Aplicação pública em **Vue 3 + TypeScript + Vite**.

## Nomenclatura oficial

- **RAS UFRB**: identidade institucional principal do site;
- **RRC**: evento/competição de robótica apresentado e acompanhado pelo público;
- **RASCOMP**: nome da plataforma de software que sustenta Gestão + Backend + experiência pública.

A Landing não deve apresentar o RRC como "RASCOMP".

---

## Estado atual

**PAUSADA / FUNDAÇÃO TÉCNICA**.

O código existente deve ser tratado como POC técnico de Vue + integração com `/api/v1/public/**`, e não como design final.

O desenvolvimento real será retomado somente depois de:

```text
Gestão consolidada
    ↓
revisão dos contratos públicos
    ↓
Landing
```

Camunda não faz mais parte da arquitetura planejada do RASCOMP.

---

## Objetivo final

A aplicação deve funcionar como o **site oficial da RAS UFRB durante todo o ano** e conter uma área forte dedicada ao **RRC**.

Direção geral:

```text
RAS UFRB
├── Início
├── Sobre
├── Projetos
├── Eventos
├── Diretoria
├── Contato
└── RRC
    ├── edição atual
    ├── modalidades
    ├── regulamento
    ├── cronograma
    ├── inscrições
    ├── equipes/robôs
    ├── ao vivo
    │   ├── Follow Line
    │   └── Sumô
    ├── resultados
    └── edições anteriores
```

---

## Referência visual/estrutural

Base conceitual escolhida:

```text
https://github.com/DouglasTeyh/erbase-2026-main
```

Usar como referência de experiência de site de evento — hero forte, navegação pública, blocos editoriais, programação, organização, parceiros, footer institucional e animações leves — sem copiar código, identidade, textos ou assets.

---

## Fluxo de dados competitivo

```text
Gestão
  ↓
Backend Spring Boot
  ↓
/api/v1/public/**
  ↓
Site público
```

A Landing não calcula oficialmente ranking, vencedor, chaveamento ou progressão.

---

## Documento principal

Toda a continuidade específica desta aplicação está em:

```text
docs/CONTINUIDADE_LANDING_PAGE.md
```

---

## Rodar o POC atual

```bash
cp .env.example .env
npm install
npm run dev
```

Porta padrão: `5174`.

> Rodar o POC serve apenas para validar a fundação e a API pública. Não usar sua aparência atual como referência do produto final.
