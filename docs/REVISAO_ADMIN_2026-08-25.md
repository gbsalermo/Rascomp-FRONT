# Revisão ADMIN — 2026-08-25

Status: **CONSOLIDAÇÃO EM ANDAMENTO**

Feedback obtido após teste local do frontend de gestão.

## Prioridade atual

```text
1. Dashboard + Sidebar ✅
2. Autenticação / persistência ✅
3. Tela Competição ✅
4. Histórico de chaves ✅ validado localmente
5. Follow Line ✅ implementação concluída / validar localmente
6. Dados temporários de teste ✅ cenários opt-in de Chaves e Follow Line
7. Consolidação visual e técnica ← PRÓXIMA APÓS VALIDAÇÃO DO FOLLOW
```

## Backlog de revisão

- [x] 1. Corrigir “Lembrar de mim”.
- [x] 2. Garantir que conta recém-criada permaneça autenticada no dispositivo.
- [ ] 3. Recuperação de senha depende de implementação no backend.
- [x] 4. Adicionar identidade/logo RasComp no topo do sidebar.
- [x] 5. Mover recolher/expandir menu para o topo usando seta esquerda/direita.
- [x] 6. Aumentar presença do vermelho rubro e reduzir dominância visual do roxo no Dashboard/Sidebar.
- [x] 7. Adicionar seleção global de competição em foco para cenários com múltiplas competições simultâneas.
- [x] 8. Criar histórico de chaveamentos por competição/categoria, preservando chaves anteriores.
- [x] 9. Renomear seção “Operação” do sidebar para “Categorias”.
- [x] 10. Reestruturar tela “Competição”: detalhar a competição em foco (descrição, categorias em uso, inscrições, datas, status etc.) e separar gerenciamento/listagem de edições.
- [x] 11. Criar dados temporários/seed de desenvolvimento no backend para testar o fluxo completo.
- [x] 12. Follow Line: alterar passo do controle de tempo para 10 s (ajuste fino via digitação continua possível).
- [x] 13. Revisar uso de checkpoints no Follow Line e tornar o conceito explícito ou remover da operação se não fizer sentido para a regra oficial.
- [x] 14. Remover quadro “Regra estrutural” da tela de Follow Line.
- [x] 15. Exibir histórico real de tentativas/tempos do Follow Line após registro.
- [ ] 16. Continuar evolução visual/informacional do ADMIN até atingir o nível do esboço aprovado.

## Dashboard + Sidebar — entregue

- contexto global de competição persistido em `localStorage`;
- seletor de competição em foco na topbar;
- Dashboard responde à competição selecionada;
- métricas da edição calculadas a partir das inscrições da competição em foco;
- detalhes de datas e inscrições;
- últimas inscrições da edição;
- atalhos rápidos;
- sidebar com logo/robô RasComp;
- botão de recolher/expandir no topo;
- navegação “Categorias” com Follow Line e Sumô;
- direção visual mais rubra e menos roxa;
- transição suave entre páginas do conteúdo, mantendo shell fixo.

## Autenticação — validada localmente

Validação concluída em 2026-08-25:

- login sem “Lembrar de mim” usa sessão do navegador;
- login com “Lembrar de mim” persiste no dispositivo;
- cadastro mantém autenticação automática;
- hidratação valida o JWT em `/api/v1/auth/me`;
- logout limpa a sessão;
- JWT comum permanece com validade curta e sessão lembrada usa validade estendida.

Recuperação de senha permanece fora deste fechamento porque ainda depende de contrato específico no backend.

## Tela Competição — implementada

`/competicoes` deixou de ser apenas uma tabela e passou a funcionar como central da competição em foco.

Entregue:

- identidade, descrição e status da edição selecionada;
- período do evento e período de inscrições;
- situação ativa/inativa;
- métricas de inscrições, pendências, equipes, robôs e competidores;
- resumo de participação por categoria;
- atalhos para inscrições, categorias/modalidades, histórico de chaves e resultados;
- edição da competição em foco;
- drawer “Gerenciar / trocar edições”;
- criação de nova edição;
- troca da competição em foco a partir do histórico de edições;
- controles de troca de foco com contraste rubro reforçado;
- responsividade inicial da nova central.

### Regra importante sobre categorias

O backend atual trata `CompetitionCategory` como catálogo global e não possui associação direta `Competition -> Category`.

Por isso a central **não inventa** categorias configuradas para uma edição. O resumo da competição exibe categorias que possuem inscrições vinculadas à edição, usando dados reais de `Registration`. O catálogo administrativo continua separado em `/modalidades`.

Se futuramente for necessário configurar previamente quais categorias cada edição aceita, isso exige contrato/relacionamento explícito no backend.

## Histórico de chaves — implementado e validado

A regra anterior de um único chaveamento por competição/categoria foi substituída por versionamento real no backend.

Regra oficial:

```text
nova geração
    ↓
chave nova        -> atual = true
chave anterior    -> atual = false
partidas/resultados anteriores permanecem preservados
```

Entregue:

- migration Flyway removendo a restrição única antiga de `brackets`;
- campo `atual` no domínio/DTO de chaveamento;
- geração de uma nova chave preserva automaticamente a anterior como histórica;
- lock pessimista da competição durante geração para reduzir risco de duas chaves vigentes concorrentes;
- ADMIN `/chaves` lista vigentes separadas do arquivo histórico;
- filtros por categoria, status e busca textual;
- data de geração e quantidade de partidas por chave;
- atalhos para chave, partidas e resultados;
- abertura de uma chave histórica diretamente no Sumô;
- chave histórica é somente leitura e não permite registrar novos rounds;
- páginas `/partidas` e `/resultados` mostram por padrão apenas chaves vigentes;
- quando acessadas pelo histórico, essas páginas exibem somente a chave solicitada;
- API pública continua expondo apenas chaveamentos atuais/ativos, evitando publicar versões substituídas;
- Sumô passou a exibir árvore visual de campeonato e registrar vários rounds de uma batalha em uma única operação administrativa.

## Sumô — categorias RC/Autônomo e Mini/3 kg

Decisão de domínio:

- `RC` e `AUTÔNOMO` são nomenclaturas de categorias competitivas, não motores de regra diferentes;
- `MINI` e `3 KG` também são categorias distintas, diferenciadas pelas próprias categorias e por seus `ConfigSumo`;
- não criar enum/campo técnico para RC versus Autônomo enquanto essa diferença não alterar regras do sistema;
- as quatro disputas podem existir como categorias independentes, por exemplo:
  - Mini Sumô RC;
  - Mini Sumô Autônomo;
  - Sumô 3 kg RC;
  - Sumô 3 kg Autônomo;
- `Registration` continua sendo a unidade competitiva: o mesmo robô híbrido pode ter uma inscrição em Mini RC e outra em Mini Autônomo;
- o gerador de chave usa `competitionId + categoryId`, portanto inscrições de categorias diferentes nunca entram na mesma chave;
- resultados, inspeções, rounds e progressão permanecem independentes entre as inscrições/categorias do mesmo robô.

### Regras comuns de round

Para evitar duplicação entre RC e Autônomo, as ocorrências abaixo pertencem ao motor comum de Sumô:

- `SUICIDIO_WO`: motivo de encerramento com derrota do robô que sofreu a ocorrência e vitória do adversário;
- penalidades por infração são registradas separadamente para robô A e robô B em cada round;
- limite provisório atual: **2 penalidades por robô/round**;
- enquanto a regra oficial não for confirmada, atingir 2 penalidades **não produz consequência automática** no vencedor; o dado é preservado para auditoria e posterior consolidação da regra;
- migration V7 adiciona `motivo_resultado`, `penalidades_a` e `penalidades_b` em `rounds_sumo`;
- o modal administrativo de batalha permite registrar Suicídio/WO e penalidades junto dos demais resultados do round.

## Follow Line — implementação concluída / validar localmente

A tela deixou de ser apenas ranking + formulário e passou a funcionar como centro operacional da modalidade.

Entregue:

- contexto global de competição em foco;
- leitura real de `ConfigFollow` por categoria;
- resumo de inscrições aprovadas, tentativas, formato e melhor tempo;
- ranking corrigido para os nomes reais do contrato backend (`tempoBrutoSegundos` e `tempoFinalSegundos`);
- ranking continua integralmente calculado pelo backend;
- passo dos controles de tempo alterado para ±10 s, mantendo digitação livre/precisa;
- limites de tomada, tentativa e checkpoints dirigidos pela configuração da categoria;
- seleção de inscrição sugere o próximo slot livre de tomada/tentativa sem substituir a validação do backend;
- quadro “Regra estrutural” removido;
- histórico real por competição/categoria com robô, equipe, tomada, tentativa, tempo, penalidade, tempo final, checkpoints, concluída, válida e data/hora;
- endpoint administrativo de histórico contextual em `/api/v1/tentativas-seguidor-linha/por-contexto`;
- DTO de tentativa agora expõe contexto operacional e `tempoFinalSegundos` calculado no backend;
- cenário temporário opt-in `rascomp.test-data.follow-line-enabled=true` com tentativas válidas, inválida e não concluída.

### Checkpoints

O backend atual possui `numeroCheckpoints` na configuração de Follow Line e registra `checkpointsAlcancados` por tentativa. O serviço valida apenas se a quantidade informada está entre 0 e o máximo configurado.

O `RankingFollowService` **não usa checkpoints como critério de classificação**. Ele considera apenas tentativas válidas e concluídas e ordena pelo tempo final (`tempo + penalidade`). Por isso a Gestão apresenta checkpoint como dado operacional/configurado, sem inventar pontuação, abandono ou desempate que não existem no domínio atual.

Se a regra oficial do RRC futuramente definir impacto de checkpoint na classificação, essa mudança deve primeiro entrar no backend e nos testes; só depois a interface deve refletir a nova regra.
