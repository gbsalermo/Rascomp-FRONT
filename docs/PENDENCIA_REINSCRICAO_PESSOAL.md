# Pendência — nova inscrição pessoal após rejeição

Status: **implementado nas branches de dupla eliminação; pendente de testes e validação**. Não publicar isoladamente.

## Problema atual

No `gestao/src/views/ParticipantView.vue`, `availablePersonalRegistrationCompetitions` exclui competições que possuem qualquer inscrição pessoal anterior, inclusive com status `REJEITADA` ou `CANCELADA`. O participante fica sem opção de tentar novamente durante inscrições abertas.

## Ajuste solicitado

- Permitir nova tentativa de inscrição pessoal quando a anterior foi `REJEITADA`, desde que a competição permaneça com inscrições abertas.
- Continuar impedindo inscrições pessoais duplicadas em status `PENDENTE` ou `APROVADA`.
- Preservar o histórico e a justificativa da rejeição, sem apagar a inscrição anterior.
- Conferir o contrato e a validação do backend antes de liberar o fluxo no frontend. Não presumir que o backend já aceita a nova inscrição.
- Reutilizar os fluxos de comprovante, lote vigente e Pix existentes, sem criar novas regras de pagamento.
- Validar tentativa após rejeição, tentativa pendente/aprovada, histórico e fechamento das inscrições.

Implementação feita nas branches `feat/sumo-double-elimination` de frontend e backend. Reutiliza a inscrição rejeitada, preservando histórico de status; não cria registro duplicado devido à restrição única por competição/competidor.
