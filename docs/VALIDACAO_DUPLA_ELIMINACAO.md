# RasComp — Homologação de Dupla Eliminação (Sumô/Mini Sumô)

**Data:** 16/10/2026  
**Branches:** `feat/sumo-double-elimination` nos repositórios `Rascomp` e `Rascomp-FRONT`.  
**Regra de publicação:** não realizar merge/deploy da `main` antes do aceite manual.

## 1. Gate técnico (banco e builds locais)

No backend, usando **banco de homologação** e as variáveis de ambiente habituais:

```bash
cd rascomp
./mvnw test -Dtest=DoubleEliminationGenerationTest,DoubleEliminationProgressionTest,DoubleEliminationPodiumTest
./mvnw test
```

> No Windows PowerShell, execute `mvnw.cmd` em vez de `./mvnw`.

- [ ] Confirmar o Flyway V47 e `ddl-auto=validate` sem erro de tipos/FKs.
- [ ] Confirmar os testes de geração, progressão, pódio e regressão da eliminação simples.
- [ ] No frontend, executar `npm ci` e `npm run build` dentro de `gestao/`.
- [ ] Não executar migrador ou testes contra a base persistente de produção.

## 2. Geração da chave

Criar uma competição de homologação, categoria Sumô, com **5 robôs aprovados e aptos na inspeção**; encerrar inscrições.

Na tela Gestão → Sumô, selecionar **Dupla eliminação** e clicar **Gerar nova chave**.

- [ ] A chave deve ter seções Winners, Losers, Final Geral e Reset se necessário.
- [ ] Com 5 inscritos, devem existir 15 nós lógicos: 7 Winners, 6 Losers, 1 Final Geral e 1 Reset.
- [ ] Partidas BYE avançam sem round, sem placar, sem derrota fictícia e sem competidor fantasma.
- [ ] A mesma competição/categoria mantém uma única chave vigente. A versão substituída aparece no histórico.
- [ ] A opção Eliminação simples continua funcionando como antes, inclusive terceiro lugar disputado.

## 3. Progressão e eliminação

Disputar as partidas conforme forem liberadas.

- [ ] O perdedor de uma partida Winners aparece na partida correspondente da Losers.
- [ ] Após a **primeira derrota**, o robô continua vivo, com a indicação “Chave dos perdedores”.
- [ ] Após a **segunda derrota**, seu estado é “Eliminado”.
- [ ] O vencedor da Final da Winners não se torna campeão antecipadamente.
- [ ] O perdedor da Final da Losers recebe o terceiro lugar **sem disputa adicional**.
- [ ] Com 5 inscritos, são disputados 8 resultados reais sem reset ou 9 com reset.

## 4. Cenários finais — em competições de homologação independentes

**Cenário A — sem reset**

1. Avançar até a Final Geral.
2. Registrar como vencedor o robô vindo da Winners, que entrou invicto.
3. Confirmar campeão e vice da Final Geral e terceiro vindo da Final da Losers.
4. Confirmar que o Reset permanece sem disputa e que a chave é finalizada.

**Cenário B — reset obrigatório**

1. Avançar até a Final Geral de outra competição de homologação.
2. Registrar como vencedor o robô vindo da Losers.
3. Confirmar que a chave **não** é finalizada, que ambos aparecem na Final de Reset e que ela pode ser operada.
4. Disputar o Reset com os rounds normais de Sumô.
5. Confirmar campeão, vice e terceiro, e status finalizado da chave.

## 5. Correção excepcional e histórico

- [ ] Antes de iniciar a partida dependente, o DEV consegue justificar e corrigir o vencedor, e as duas rotas são reconstruídas.
- [ ] Se a partida dependente já tiver round ou resultado, a correção deve ser bloqueada e não apagar resultados.
- [ ] Quando o resultado da primeira Final Geral é corrigido e passa a exigir reset, a chave deve reabrir.
- [ ] Confirmar o histórico e a visualização do chaveamento no Portal do Participante, sem permitir que ele opere partidas.

## Resultado

- [ ] Build backend aprovado
- [ ] Testes de regressão aprovados
- [ ] Flyway V47 homologado
- [ ] Build frontend aprovado
- [ ] Cenário A aprovado
- [ ] Cenário B aprovado
- [ ] Correção excepcional e histórico aprovados
- [ ] **Aceite do responsável antes do merge**

Este checklist é a evidência de homologação; os arquivos e commits da branch, isoladamente, não comprovam execução dos testes.
