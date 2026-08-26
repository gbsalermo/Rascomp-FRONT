# Revisão para demonstração — Landing Page RAS UFRB

Data: **26/08/2026**

## Resultado geral

A Landing foi revisada de ponta a ponta pensando na demonstração.

Estado:

```text
Estrutura das 8 janelas              OK
Ordem da Home                        OK
Identidade RAS / RRC / RasComp       OK
Paleta rubro + roxo                  OK
Janela 7 condicional                 OK
Follow Line                          OK estruturalmente
Sumô                                 OK estruturalmente
Footer rubro + faixa roxa            OK implementado
Typecheck da Landing                 OK em CI
Build da Landing                     OK em CI
Validação visual no navegador local  PENDENTE
Conteúdo institucional definitivo    PENDENTE
```

## Correções feitas na revisão

1. Footer principal alterado de branco para **rubro**, mantendo faixa final em roxo profundo.
2. `@types/node` adicionado para evitar erro em `node:url`.
3. `tsconfig.json` passou a incluir tipos Node.
4. `index.html` corrigido para identidade pública `IEEE RAS UFRB`.
5. Header passou a usar o asset IEEE RAS já existente no projeto.
6. Bootstrap da Landing deixou de depender de `/equipes` e `/robos` sem necessidade.
7. Panorama da Janela 7 passou a exibir inscrições aprovadas.
8. Anchor de `Chaveamento` foi movido para um elemento sempre existente.
9. Evento demonstrativo que já estava no passado foi reposicionado para data futura.
10. README e continuidade foram atualizados para o estado real atual.
11. Landing ganhou workflow de CI dedicado.

## Validação técnica

O job `landing` no GitHub Actions executou com sucesso:

```text
Install dependencies  PASS
Typecheck             PASS
Build                 PASS
```

O workflow combinado que rodou junto ficou vermelho apenas porque o job `gestao` falhou no build; o job da Landing foi concluído com sucesso. Depois disso, os checks foram separados em workflows distintos.

## Cenário recomendado para a demo

Backend:

```powershell
cd Rascomp\rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\run-local.ps1
```

O profile `testdata` cria uma competição `EM_ANDAMENTO`, Follow Line, Sumô, BYEs, resultados e histórico.

Landing:

```powershell
cd Rascomp-FRONT\landing-page
Copy-Item .env.example .env
npm install
npm run dev
```

Abrir:

```text
http://localhost:5174
```

## Percurso sugerido durante a apresentação

```text
1. Header institucional
2. Hero / Destaques
3. Sobre IEEE + RAS UFRB
4. Equipe / Diretoria / Robôs / Premiações
5. Galeria
6. Eventos
7. Competição atual
   7.1 Panorama geral
   7.2 Follow Line
   7.3 Sumô
   7.4 Ranking completo
   7.5 Chaveamento
8. Footer rubro
```

## Pendências que NÃO bloqueiam a demo

- fotos oficiais;
- membros reais;
- diretoria real;
- premiações oficiais;
- números institucionais confirmados;
- contatos e redes reais;
- parceiros finais;
- newsletter real;
- páginas de Privacidade e Termos;
- asset IEEE RAS ainda referenciado temporariamente pelo arquivo existente em `gestao/public/`;
- limpeza de CSS legado.

## Pendências antes da publicação oficial

- copiar asset IEEE RAS para `landing-page/public/`;
- substituir todos os placeholders editoriais;
- revisar mobile/tablet em dispositivo real;
- acessibilidade por teclado;
- SEO/Open Graph/favicon/sitemap;
- lazy loading e otimização das imagens;
- 404 pública;
- páginas legais;
- revisão final de conteúdo com a RAS UFRB.

## Conclusão

A Landing está **tecnicamente compilável e estruturalmente pronta para demonstração**.

O único passo obrigatório antes de apresentar é subir o cenário local e fazer uma passagem visual rápida no navegador para detectar qualquer ajuste de espaçamento, proporção ou conteúdo que só aparece em runtime.
