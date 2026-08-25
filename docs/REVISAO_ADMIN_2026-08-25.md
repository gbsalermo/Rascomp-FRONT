# Revisão ADMIN — 2026-08-25

Status: **CONSOLIDAÇÃO EM ANDAMENTO**

Feedback obtido após teste local do frontend de gestão.

## Prioridade atual

```text
1. Dashboard + Sidebar
2. Autenticação / persistência ✅
3. Tela Competição ← PRÓXIMA
4. Histórico de chaves
5. Follow Line
6. Dados temporários de teste
7. Consolidação visual e técnica
```

## Backlog de revisão

- [x] 1. Corrigir “Lembrar de mim”.
- [x] 2. Garantir que conta recém-criada permaneça autenticada no dispositivo.
- [ ] 3. Recuperação de senha depende de implementação no backend.
- [x] 4. Adicionar identidade/logo RasComp no topo do sidebar.
- [x] 5. Mover recolher/expandir menu para o topo usando seta esquerda/direita.
- [x] 6. Aumentar presença do vermelho rubro e reduzir dominância visual do roxo no Dashboard/Sidebar.
- [x] 7. Adicionar seleção global de competição em foco para cenários com múltiplas competições simultâneas.
- [ ] 8. Criar histórico de chaveamentos por competição/categoria, preservando chaves anteriores.
- [x] 9. Renomear seção “Operação” do sidebar para “Categorias”.
- [ ] 10. Reestruturar tela “Competição”: detalhar a competição em foco (descrição, categorias, inscrições, datas, status etc.) e separar gerenciamento/listagem de edições.
- [ ] 11. Criar dados temporários/seed de desenvolvimento no backend para testar o fluxo completo.
- [ ] 12. Follow Line: alterar passo do controle de tempo para 10 s (ajuste fino via digitação continua possível).
- [ ] 13. Revisar uso de checkpoints no Follow Line e tornar o conceito explícito ou remover da operação se não fizer sentido para a regra oficial.
- [ ] 14. Remover quadro “Regra estrutural” da tela de Follow Line.
- [ ] 15. Exibir histórico real de tentativas/tempos do Follow Line após registro.
- [ ] 16. Continuar evolução visual/informacional do ADMIN até atingir o nível do esboço aprovado.

## Autenticação — validada localmente

Validação concluída em 2026-08-25:

- login sem “Lembrar de mim” persiste durante a sessão e usa `sessionStorage`;
- login com “Lembrar de mim” persiste ao reabrir o navegador e usa `localStorage`;
- cadastro mantém login automático e persistência conforme a opção escolhida;
- hidratação por `/api/v1/auth/me` funciona após recarregar/reabrir;
- logout remove sessão dos dois storages e protege novamente as rotas autenticadas;
- backend usa JWT padrão de 8 h e JWT lembrado de 30 dias.

Status da etapa: **CONCLUÍDA**.

Recuperação de senha continua fora desta conclusão porque o backend ainda não possui o fluxo correspondente.

## Dashboard + Sidebar — alteração iniciada

Entregue nesta rodada:

- contexto global de competição persistido em `localStorage`;
- seletor de competição em foco na topbar;
- Dashboard passa a responder à competição selecionada;
- métricas da edição calculadas a partir das inscrições da competição em foco;
- detalhes de datas e inscrições;
- categorias da competição com contagem de inscrições;
- últimas inscrições da edição;
- atalhos rápidos;
- sidebar com logo/robô RasComp;
- botão de recolher/expandir no topo;
- navegação “Categorias” com Follow Line e Sumô;
- direção visual mais rubra e menos roxa.

## Observação sobre checkpoints

O backend atual possui `numeroCheckpoints` na configuração de Follow Line e registra `checkpointsAlcancados` por tentativa. Hoje o serviço valida apenas se a quantidade informada está entre 0 e o máximo configurado. A decisão de negócio sobre como isso deve influenciar classificação/abandono ainda precisa ser confirmada antes da consolidação do frontend.
