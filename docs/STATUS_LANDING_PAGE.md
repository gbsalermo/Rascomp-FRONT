# Status consolidado — Landing Page / Site Público RAS UFRB

> Snapshot atualizado para a demonstração de 26/08/2026.
> Fonte de verdade de estado atual da Landing. Complementa `CONTINUIDADE_LANDING_PAGE.md`.

---

## 1. Identidade do projeto

```text
RAS UFRB = identidade institucional pública
RRC      = evento/competição de robótica
RASCOMP  = plataforma/software de gestão
```

A Landing é o site institucional da **IEEE RAS UFRB**. O RRC aparece como conteúdo de destaque quando houver competição, mas não domina a Home durante todo o ano.

Camunda está fora do projeto.

---

## 2. Stack e execução

```text
Vue 3
TypeScript 5.9
Vite 7
Axios
```

Scripts:

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

Portas padrão:

```text
Gestão   http://localhost:5173
Landing  http://localhost:5174
Backend  http://localhost:8080
```

Variáveis:

```env
VITE_API_URL=http://localhost:8080
VITE_GESTAO_URL=http://localhost:5173
VITE_REFRESH_MS=20000
```

---

## 3. Paleta oficial congelada

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
- não transformar a Home em uma interface monocromática.

Exceção aprovada: **Footer com bloco principal rubro e faixa final roxo profundo**.

---

## 4. Ordem oficial da Home

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

A Janela 7 só existe quando:

```text
competition.status === 'EM_ANDAMENTO'
```

Sem competição ativa:

```text
Eventos → Footer
```

---

## 5. Estado por janela

### Janela 1 — Header ✅

- identidade IEEE RAS UFRB;
- Início, Sobre, Competição, Calendário, Eventos e Contato;
- CTA Inscrições quando inscrições estiverem abertas;
- faixa rubra quando houver competição em andamento;
- dropdown competitivo;
- versão mobile;
- marca visual corrigida para usar a identidade IEEE RAS em vez do bloco textual `RAS`.

### Janela 2 — Hero / Destaques ✅

- slide visual principal;
- painel lateral de novidades;
- previews inferiores;
- autoplay;
- setas e dots;
- destaque de competição quando aplicável.

Fotos continuam como placeholders até o acervo oficial.

### Janela 3 — Sobre IEEE + RAS ✅

- slider de mídia;
- tabs IEEE / RAS UFRB;
- explicação institucional;
- indicadores.

Fotos e números ainda são temporários.

### Janela 4 — Equipe / Diretoria / Robôs / Premiações ✅

- Equipe em lista com busca/filtro;
- Diretoria em mosaico;
- Robôs em cards expansíveis;
- Premiações em cards;
- indicadores institucionais.

Membros, diretoria, parte dos robôs e premiações ainda precisam ser substituídos pelos dados reais.

### Janela 5 — Galeria ✅

- filtros por categoria;
- álbuns;
- foto principal + miniaturas;
- metadados;
- preview flutuante.

Ainda falta o acervo real e navegação real das fotos.

### Janela 6 — Eventos ✅

- filtros;
- próximos eventos;
- agenda lateral;
- eventos anteriores;
- newsletter demonstrativa;
- redes;
- indicadores.

Na revisão de 26/08 foi corrigida uma data que já estava no passado dentro de `Próximos Eventos`.

### Janela 7 — Competição atual + acompanhamento ✅

Versão simplificada aprovada:

```text
[ Panorama geral ] [ Follow Line ] [ Sumô ]
[ Próxima partida ] [ Último resultado ] [ Ranking Follow ]
```

Panorama:

- equipes;
- robôs;
- modalidades;
- inscrições aprovadas;
- progresso visual.

Follow Line:

- ranking oficial;
- `tempoFinalSegundos`;
- seletor de categoria;
- expansão da classificação.

Sumô:

- próximos confrontos;
- seletor de chave;
- expansão do chaveamento.

Correções da revisão:

- contador passou a mostrar inscrições **aprovadas**;
- `#chaveamento` agora existe mesmo antes de expandir a chave;
- Header consegue navegar corretamente para o bloco de Sumô.

### Janela 8 — Footer ✅

Versão final aprovada:

```text
BLOCO PRINCIPAL RUBRO
IEEE RAS UFRB | Navegação | Links úteis | Apoio/Parceiros | Fale conosco

FAIXA ROXO PROFUNDO
identidade | missão | copyright | feito com ♥ | privacidade | termos | ↑
```

Características:

- fundo rubro em gradiente suave;
- textos principais brancos;
- roxo preservado em detalhes, hover e CTA secundário;
- cards claros de parceiros/contato para contraste;
- faixa final roxo profundo;
- tipografia forte e legível;
- responsivo.

---

## 6. Integração competitiva

Arquivo:

```text
landing-page/src/api.ts
```

Endpoints consumidos:

```http
GET /api/v1/public/competicoes
GET /api/v1/public/categorias
GET /api/v1/public/inscricoes?competitionId=
GET /api/v1/public/ranking/seguidor-linha?competitionId=&categoryId=
GET /api/v1/public/chaveamentos?competitionId=
GET /api/v1/public/partidas?bracketId=
GET /api/v1/public/resultados?bracketId=
```

Na revisão de demo, o bootstrap deixou de depender de `/equipes` e `/robos`, pois esses dados não eram usados no `App.vue`. Isso reduz o risco de um endpoint secundário impedir a Landing inteira de carregar.

Fonte de verdade:

```text
Gestão → Spring Boot → /api/v1/public/** → Landing
```

A Landing não:

- gera chave;
- avança vencedor;
- decide resultado;
- recalcula ranking;
- altera inscrições;
- registra rounds/partidas.

---

## 7. Correções técnicas feitas para a demo

### TypeScript / Vite

O `vite.config.ts` usa:

```ts
import { fileURLToPath, URL } from 'node:url'
```

Foi adicionado:

```text
@types/node
```

E o `tsconfig.json` agora inclui:

```json
"types": ["vite/client", "node"]
```

Isso evita o mesmo erro `TS2307: Cannot find module 'node:url'` encontrado anteriormente no outro front.

### Identidade HTML

O `index.html` foi corrigido de `RASCOMP` para:

```text
IEEE RAS UFRB · Robotics & Automation Society
```

### Header

A marca deixou de ser um bloco textual genérico e passou a usar o asset IEEE RAS já existente no projeto.

### Footer

Foi criado `footer-ruby.css`, importado após `footer.css`, contendo a versão rubra aprovada sem destruir a base responsiva anterior.

---

## 8. Cenário oficial de demonstração

O backend já possui profile local opt-in:

```text
SPRING_PROFILES_ACTIVE=testdata
```

Arquivo:

```text
rascomp/src/main/resources/application-testdata.properties
```

Ele habilita:

```text
rascomp.test-data.bracket-history-enabled=true
rascomp.test-data.follow-line-enabled=true
rascomp.test-data.demo-showcase-enabled=true
```

O inicializador `DemoShowcaseDataInitializer` cria:

- competição `EM_ANDAMENTO` com datas relativas ao dia atual;
- Follow Line com ranking e histórico;
- Sumô parcialmente executado;
- BYEs;
- resultados;
- competição histórica;
- contas de demonstração.

Credenciais:

```text
PARTICIPANTE
lider.demo@rascomp.local
Rascomp@2026

ORGANIZAÇÃO
organizacao.demo@rascomp.local
Rascomp@2026
```

---

## 9. Roteiro para a demonstração de hoje

### Backend

```powershell
cd Rascomp\rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\run-local.ps1
```

Aguardar no terminal a mensagem de cenário de demonstração pronto.

### Gestão

```powershell
cd Rascomp-FRONT\gestao
npm install
npm run dev
```

### Landing

```powershell
cd Rascomp-FRONT\landing-page
Copy-Item .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Abrir:

```text
http://localhost:5174
```

Percurso sugerido:

```text
Header
→ Hero
→ Sobre
→ Equipe/Diretoria/Robôs/Premiações
→ Galeria
→ Eventos
→ Janela 7
   → Panorama
   → Follow Line
   → Sumô
   → Ver ranking
   → Ver chave
→ Footer
```

---

## 10. Pendências

### P0 — antes da demo

- [ ] executar `npm install` após a inclusão de `@types/node`;
- [ ] executar `npm run typecheck`;
- [ ] executar `npm run build`;
- [ ] subir backend com profile `testdata`;
- [ ] abrir a Landing e conferir visualmente Header → Footer;
- [ ] confirmar que a Janela 7 aparece;
- [ ] conferir o Footer rubro em desktop.

### P1 — antes da publicação oficial

- [ ] fotos oficiais;
- [ ] membros reais;
- [ ] diretoria real;
- [ ] robôs/projetos reais;
- [ ] premiações oficiais;
- [ ] números institucionais confirmados;
- [ ] agenda real;
- [ ] contatos e URLs sociais;
- [ ] parceiros confirmados;
- [ ] newsletter real ou remoção do formulário;
- [ ] páginas de Privacidade e Termos;
- [ ] asset IEEE RAS copiado fisicamente para `landing-page/public/`;
- [ ] alt texts definitivos;
- [ ] revisão mobile/tablet completa;
- [ ] acessibilidade e teclado;
- [ ] SEO/Open Graph/favicon/sitemap;
- [ ] performance/lazy loading de imagens;
- [ ] 404 pública.

### P2 — limpeza técnica

- [ ] remover CSS legado de `styles.css` que não é mais usado;
- [ ] consolidar arquivos de override (`header-identity.css`, `footer-ruby.css`) depois da validação visual;
- [ ] substituir `any` por tipos públicos do domínio;
- [ ] decidir fonte editorial futura para eventos, galeria, equipe e premiações.

---

## 11. Conclusão atual

```text
Arquitetura visual das 8 janelas       ✅
Fluxo institucional                    ✅
Janela competitiva condicional         ✅
Follow Line + Sumô públicos            ✅
Footer rubro + faixa roxa               ✅
Cenário de demonstração no backend     ✅
Correção preventiva de node:url        ✅
Typecheck/build executados localmente  ⬜
Conteúdo institucional definitivo      ⬜
```

A Landing está **estruturalmente pronta para demonstração**, mas só deve ser chamada de tecnicamente validada depois de `npm run typecheck` + `npm run build` no computador local e uma passagem visual pelo navegador.
