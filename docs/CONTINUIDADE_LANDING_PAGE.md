# Continuidade — Landing Page / Site Público RAS UFRB

> Documento exclusivo da aplicação pública em `landing-page/`.
>
> Este arquivo deve ser a principal referência quando o desenvolvimento da Landing for retomado.

---

# 1. Identidade correta do projeto

## RAS UFRB

É a identidade institucional pública que o site deve representar.

A Landing não será somente uma página da competição. Ela deve funcionar como o **site da IEEE Robotics & Automation Society — RAS UFRB**, útil durante todo o ano.

## RRC

**RRC é o evento/competição.**

A área pública do evento deve concentrar:

- edição atual;
- inscrições;
- modalidades;
- regulamento;
- cronograma;
- equipes e robôs;
- acompanhamento ao vivo;
- ranking;
- chaveamentos;
- partidas;
- resultados;
- vencedores;
- histórico das edições.

## RASCOMP

**RASCOMP é o nome da plataforma de software**, não o nome público do evento.

Arquitetura atual:

```text
Gestão + Backend Spring Boot + experiência pública
```

Camunda foi retirado do planejamento.

---

# 2. Estado atual e decisão de pausa

Existe uma fundação Vue 3 + TypeScript + Vite em `landing-page/` e um POC capaz de consultar dados públicos do backend.

Esse código **não define o design final**. Ele deve ser tratado como:

```text
fundação técnica + prova de integração
```

A Landing está oficialmente **PAUSADA** enquanto o sistema de Gestão é concluído.

## Condição para retomada

O desenvolvimento real da Landing só começa depois de:

- [ ] sistema de Gestão consolidado;
- [ ] fluxos principais de organização validados;
- [ ] fluxos principais de participante validados;
- [ ] chaveamento/partidas/resultados do Sumô validados ponta a ponta;
- [ ] Follow Line validado ponta a ponta;
- [ ] contratos públicos do backend revisados;
- [ ] dados que precisam aparecer publicamente identificados.

---

# 3. Referência visual e estrutural

Referência escolhida:

```text
https://github.com/DouglasTeyh/erbase-2026-main
```

Usar como referência de **arquitetura de informação, ritmo visual e experiência de site de evento**, não para copiar código, textos ou assets.

Pontos de referência:

- navegação pública simples;
- navbar e footer reutilizáveis;
- hero de grande impacto;
- vídeo/imagem de fundo quando fizer sentido;
- contador para o evento;
- blocos editoriais claros;
- CTAs de inscrição;
- páginas específicas para assuntos importantes;
- programação em seção própria;
- organização, apoio e parceiros;
- animações leves de entrada/scroll.

---

# 4. Objetivo do site público

Atender cinco públicos principais:

1. visitante institucional da RAS UFRB;
2. interessado em competir no RRC;
3. competidor inscrito;
4. público acompanhando ao vivo;
5. visitante pós-evento.

Fluxo competitivo público:

```text
Home
 ↓
RRC
 ↓
modalidade
 ├── Follow Line -> ranking / tempos
 └── Sumô        -> chave / partidas / resultados
```

---

# 5. Arquitetura de informação planejada

```text
SITE RAS UFRB
│
├── /
│   ├── Hero institucional
│   ├── Destaques atuais
│   ├── Quem somos
│   ├── Projetos
│   ├── RRC em destaque
│   ├── Eventos/atividades
│   ├── Diretoria
│   ├── Parceiros/apoio
│   └── Contato
│
├── /sobre
├── /projetos
├── /eventos
├── /diretoria
├── /contato
│
└── /rrc
    ├── edição atual
    ├── sobre
    ├── modalidades
    ├── regulamento
    ├── cronograma/programação
    ├── inscrição
    ├── equipes
    ├── robôs
    ├── ao-vivo
    │   ├── follow-line
    │   └── sumo
    ├── resultados
    ├── galeria (quando houver suporte real)
    └── edições anteriores
```

---

# 6. Navegação inicial proposta

```text
Início
Sobre
Projetos
Eventos
RRC
Diretoria
```

CTAs contextuais:

```text
[ Área do participante ]
[ Inscreva-se ]
[ Ao vivo ]
```

---

# 7. Estrutura técnica alvo

A aplicação continuará em Vue 3 + TypeScript + Vite.

```text
landing-page/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── navigation/
│   │   ├── sections/
│   │   ├── cards/
│   │   ├── feedback/
│   │   └── live/
│   ├── layouts/
│   ├── pages/
│   │   ├── institutional/
│   │   └── rrc/
│   ├── features/
│   │   ├── competitions/
│   │   ├── teams/
│   │   ├── robots/
│   │   ├── follow-line/
│   │   └── sumo/
│   ├── services/public-api/
│   ├── router/
│   ├── styles/
│   ├── types/
│   ├── App.vue
│   └── main.ts
└── package.json
```

---

# 8. Conteúdo estático x dinâmico

## Editorial/institucional

Pode permanecer versionado no frontend inicialmente:

- apresentação da RAS UFRB;
- história;
- projetos;
- apresentação do RRC;
- regulamentos/documentos;
- contato;
- diretoria;
- parceiros;
- textos de modalidades.

## Dinâmico

Deve vir do backend público:

- competição/edição atual;
- status;
- categorias;
- equipes;
- robôs;
- competidores quando permitido;
- ranking Follow Line;
- chaveamentos Sumô;
- partidas;
- resultados;
- vencedores;
- campeão.

A Landing nunca será fonte oficial de regra competitiva.

---

# 9. Fluxo de dados

```text
Gestão
  ↓
Backend Spring Boot
  ↓
/api/v1/public/**
  ↓
Landing
```

A Landing:

- não escreve resultado oficial;
- não gera chave;
- não decide vencedor;
- não calcula ranking oficial;
- não altera inscrição;
- não consulta endpoints administrativos para fabricar estado público.

---

# 10. Modos da página do RRC

## Pré-evento

- identidade da edição;
- data/local;
- countdown;
- modalidades;
- regulamento;
- cronograma;
- inscrição;
- organização/apoio.

## Evento em andamento

Prioridade: **acompanhar**.

```text
● RRC AO VIVO

Follow Line
ranking atualizado

Sumô
chave e partidas
```

## Pós-evento

- campeões;
- resultados;
- pódios;
- equipes;
- robôs;
- registros da edição;
- histórico.

---

# 11. Experiência por modalidade

## Follow Line

Priorizar:

- posição;
- equipe;
- robô;
- melhor resultado público;
- ranking atualizado.

## Sumô

Priorizar:

- bracket visual;
- rodada;
- confronto;
- status;
- vencedor confirmado;
- progressão;
- campeão.

O bracket público pode seguir a mesma linguagem visual aprovada na Gestão, mas adaptado para leitura pública/mobile/telão.

---

# 12. Atualização ao vivo

MVP inicial:

```text
polling controlado
```

Regras:

- polling apenas onde necessário;
- reduzir/pausar em aba inativa quando possível;
- indicar última atualização quando útil;
- manter o último estado confirmado em falha temporária;
- nunca fabricar resultado para aparentar tempo real.

SSE/WebSocket só entram se houver benefício real.

---

# 13. Identidade visual

Base:

```text
Roxo profundo
Rubro/vermelho
Neutros claros/escuros
```

Direção:

- hero grande;
- fotografia/vídeo real de robótica;
- espaço em branco;
- títulos fortes;
- seções bem delimitadas;
- transições suaves;
- aparência institucional e tecnológica;
- mobile first.

Evitar:

- aparência de dashboard;
- excesso de cards pequenos;
- tabelas administrativas na Home;
- cyberpunk exagerado;
- poluição visual;
- confundir RASCOMP com RRC.

---

# 14. Design System público — a definir

- [ ] paleta final;
- [ ] tipografia;
- [ ] escala de títulos;
- [ ] grid/containers;
- [ ] breakpoints;
- [ ] CTAs;
- [ ] badges;
- [ ] cards;
- [ ] ranking público;
- [ ] bracket público;
- [ ] navbar;
- [ ] footer;
- [ ] hero;
- [ ] loading/erro/vazio;
- [ ] animações;
- [ ] tratamento de imagens.

---

# 15. Conteúdo institucional a levantar

- [ ] texto oficial da RAS UFRB;
- [ ] história;
- [ ] missão/objetivos;
- [ ] diretoria atual;
- [ ] projetos atuais/históricos;
- [ ] eventos/oficinas;
- [ ] redes sociais;
- [ ] contato;
- [ ] logos oficiais;
- [ ] parceiros/apoio;
- [ ] fotos autorizadas;
- [ ] informações oficiais do RRC;
- [ ] data/local;
- [ ] regulamento;
- [ ] modalidades;
- [ ] cronograma;
- [ ] premiação;
- [ ] edições anteriores.

---

# 16. Fotos e mídia

Foto de robô não equivale a galeria do evento.

Para fotos do dia, momentos da rodada e álbuns será necessário definir:

- fonte/armazenamento;
- upload;
- crédito;
- legenda;
- visibilidade;
- otimização.

---

# 17. SEO, acessibilidade e performance

Antes do lançamento:

- [ ] títulos/descriptions;
- [ ] Open Graph;
- [ ] favicon/manifest;
- [ ] sitemap/robots;
- [ ] URLs estáveis;
- [ ] headings semânticos;
- [ ] alt text;
- [ ] navegação por teclado;
- [ ] contraste;
- [ ] foco visível;
- [ ] `prefers-reduced-motion`;
- [ ] imagens responsivas/lazy loading;
- [ ] fallback de vídeo;
- [ ] bundle controlado.

---

# 18. Etapas oficiais

## LANDING P0 — pausa/preparação

Status: **EM ESPERA**.

- [x] Vue 3 + TypeScript + Vite existentes;
- [x] POC de API pública existente;
- [x] referência ERBASE escolhida;
- [x] RAS / RRC / RASCOMP definidos;
- [x] continuidade dedicada criada;
- [x] Camunda retirado da arquitetura;
- [ ] Gestão finalizada;
- [ ] contratos públicos revisados.

## LANDING 0 — auditoria pós-Gestão

- [ ] revisar backend final;
- [ ] revisar `/api/v1/public/**`;
- [ ] mapear DTOs/status finais;
- [ ] identificar lacunas de ao vivo/histórico/mídia.

## LANDING 1 — arquitetura de informação + conteúdo

- [ ] sitemap;
- [ ] navegação;
- [ ] páginas RAS/RRC;
- [ ] CTAs;
- [ ] textos/assets oficiais;
- [ ] estático x dinâmico.

## LANDING 2 — identidade + Design System

- [ ] paleta;
- [ ] tipografia;
- [ ] grid;
- [ ] navbar/footer;
- [ ] hero;
- [ ] cards;
- [ ] ranking;
- [ ] bracket;
- [ ] loaders;
- [ ] animações/mobile.

## LANDING 3 — fundação estrutural Vue

- [ ] Vue Router;
- [ ] layouts;
- [ ] páginas;
- [ ] componentes;
- [ ] API pública centralizada;
- [ ] tipos;
- [ ] erros/404/configuração.

## LANDING 4 — institucional RAS UFRB

- [ ] Home;
- [ ] Sobre;
- [ ] Projetos;
- [ ] Eventos;
- [ ] Diretoria;
- [ ] Contato;
- [ ] parceiros/apoio.

## LANDING 5 — RRC pré-evento

- [ ] edição;
- [ ] hero;
- [ ] data/local;
- [ ] countdown;
- [ ] modalidades;
- [ ] regulamento;
- [ ] cronograma;
- [ ] CTA de inscrição;
- [ ] organização/apoio.

## LANDING 6 — integração pública dinâmica

- [ ] competição/status;
- [ ] categorias;
- [ ] equipes/robôs;
- [ ] competidores quando permitido;
- [ ] loading/vazio/erro;
- [ ] cache/refetch.

## LANDING 7 — RRC ao vivo

### Follow Line
- [ ] ranking;
- [ ] melhores resultados;
- [ ] atualização automática.

### Sumô
- [ ] bracket;
- [ ] partidas;
- [ ] rodada;
- [ ] vencedor;
- [ ] progressão;
- [ ] campeão;
- [ ] atualização automática.

## LANDING 8 — pós-evento + histórico

- [ ] resultados permanentes;
- [ ] campeões/pódios;
- [ ] equipes/robôs;
- [ ] edições anteriores;
- [ ] URLs permanentes;
- [ ] galeria quando suportada.

## LANDING 9 — consolidação/publicação

- [ ] SEO;
- [ ] acessibilidade;
- [ ] performance;
- [ ] mobile;
- [ ] browsers;
- [ ] build;
- [ ] deploy.

---

# 19. Próximo gatilho

Não avançar a Landing agora.

Retomar somente após a Gestão estar funcional e validada com os fluxos reais do RRC, especialmente chaveamento, rounds, resultados e projeções públicas.
