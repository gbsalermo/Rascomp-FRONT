# Status consolidado — Landing Page / Site Público RAS UFRB

**Snapshot principal da demonstração: 26/08/2026**  
**Revisão documental: 31/08/2026**

Este arquivo preserva o estado detalhado da Landing no marco da demonstração aprovada. Ele é uma **fotografia histórica de subsistema**, não a fonte da etapa atual do projeto.

Para estado global/roadmap:

```text
docs/ETAPAS_POS_PROJETO.md
```

Para continuidade viva da Landing:

```text
docs/CONTINUIDADE_LANDING_PAGE.md
```

Mudança posterior ao snapshot: a página 404 pública foi implementada em **30/08/2026**.

---

## 1. Identidade

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RasComp  = plataforma/software de gestão
```

A Landing é o site institucional da **IEEE RAS UFRB**. O RRC aparece como conteúdo de destaque quando houver competição, sem dominar a Home durante o ano inteiro.

Camunda está fora do projeto.

---

## 2. Stack e execução do snapshot

```text
Vue 3
TypeScript 5.9
Vite 7
Axios
```

Portas locais:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

Variáveis:

```text
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

---

## 3. Paleta oficial

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
- Home não deve ficar monocromática;
- Footer aprovado: bloco principal rubro + faixa final roxo profundo.

---

## 4. Ordem aprovada da Home

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

`Edições anteriores` não faz parte da Home.

A Janela 7 só aparece quando:

```text
competition.status === 'EM_ANDAMENTO'
```

---

## 5. Estado por janela no snapshot de 26/08

```text
Janela 1 — Header                           ✅
Janela 2 — Hero / Destaques                ✅
Janela 3 — Sobre IEEE + RAS                ✅
Janela 4 — Equipe/Diretoria/Robôs/Prêmios  ✅
Janela 5 — Galeria                         ✅
Janela 6 — Eventos                         ✅
Janela 7 — Competição/Acompanhamento       ✅
Janela 8 — Footer                          ✅
```

### Header

- identidade IEEE RAS UFRB;
- navegação institucional;
- CTA de inscrições quando aplicável;
- aviso de competição em andamento;
- dropdown competitivo;
- mobile.

### Hero

- slide visual principal;
- novidades laterais;
- previews;
- autoplay/setas/dots;
- conteúdo competitivo quando aplicável.

### Sobre

- mídia/collage;
- tabs IEEE/RAS UFRB;
- texto institucional;
- indicadores.

### Equipe/Diretoria/Robôs/Premiações

- equipe em lista;
- diretoria em mosaico;
- robôs em cards;
- premiações;
- indicadores.

Parte dos dados ainda era demonstrativa.

### Galeria

- filtros;
- álbuns;
- capa/miniaturas;
- preview.

O acervo real ainda não estava integrado.

### Eventos

- filtros;
- próximos eventos;
- agenda;
- anteriores;
- newsletter demonstrativa;
- redes/indicadores.

### Competição atual

Estrutura aprovada:

```text
[ Panorama geral ] [ Follow Line ] [ Sumô ]
[ Próxima partida ] [ Último resultado ] [ Ranking Follow ]
```

Correções do snapshot:

- panorama usa inscrições aprovadas;
- Follow usa `tempoFinalSegundos` oficial;
- `#chaveamento` existe no card de Sumô mesmo recolhido;
- Header navega corretamente ao bloco competitivo.

### Footer

```text
BLOCO PRINCIPAL RUBRO
IEEE RAS UFRB | Navegação | Links úteis | Apoio/Parceiros | Fale conosco

FAIXA ROXO PROFUNDO
identidade | missão | copyright | feito com ♥ | privacidade | termos | ↑
```

---

## 6. Integração competitiva pública

Fluxo:

```text
Gestão
→ Backend Spring Boot
→ /api/v1/public/**
→ Landing
```

A Landing representa os resultados do backend. Não calcula oficialmente ranking, BYE, vencedor ou progressão.

---

## 7. Conteúdo que ainda era provisório

No marco da demonstração ainda existiam placeholders/hardcodes para itens como:

- fotos;
- integrantes/diretoria;
- robôs/projetos;
- premiações;
- números institucionais;
- eventos;
- parceiros;
- textos/editorial.

Esses itens serão substituídos pelo CMS/Mídia na **ETAPA 8** do roadmap canônico.

---

## 8. Alteração posterior: página 404

Em **30/08/2026**, depois deste snapshot de demonstração, a Landing recebeu página 404 personalizada.

Arquivos principais:

```text
landing-page/src/components/PublicNotFound.vue
landing-page/src/not-found.css
landing-page/src/App.vue
```

Portanto, listas antigas deste documento que tratavam 404 como pendência devem ser consideradas superadas.

---

## 9. Como usar este documento

Use como referência para:

- identidade visual aprovada;
- ordem da Home;
- comportamento das janelas;
- estado apresentado em 26/08/2026.

Não use para:

- determinar a etapa atual;
- decidir a próxima implementação;
- afirmar que placeholders continuam iguais sem verificar o código;
- decidir a arquitetura final da galeria.

Para continuidade atual:

```text
docs/README.md
docs/ETAPAS_POS_PROJETO.md
docs/DOSSIE_PROJETO_RASCOMP.md
docs/CONTINUIDADE_LANDING_PAGE.md
```


---

## Atualização para V1-BETA A — 03/10/2026

Este arquivo continua sendo snapshot histórico da versão apresentada em agosto.

A evolução da V1-BETA A foi concluída em:

```text
branch concluída: v1-beta-a-landing
fonte viva: docs/CONTINUIDADE_LANDING_PAGE.md
roadmap: docs/ETAPAS_POS_PROJETO.md
status: ✅ concluída / validada
```

A V1-BETA A revisará cada janela para substituir conteúdo demonstrativo por conteúdo real e validar a experiência em desktop/mobile.

Integração obrigatória nova:

```text
Landing → CTA "Inscrever-se" → aplicação Gestão/Participante
```

A URL será configurável por ambiente.


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
