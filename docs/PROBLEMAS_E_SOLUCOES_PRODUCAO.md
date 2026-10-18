# RasComp — Problemas e soluções em produção

Registro técnico incremental de incidentes observados no uso real. Separar **sintoma observado**, **hipótese técnica**, **alteração realizada** e **validação**, sem atribuir causas não demonstradas.

## 2026-10-14 a 2026-10-17 — Galeria, consumo de recursos e redefinição do MVP

**Sintomas relatados em produção:** após disponibilização da Galeria, foram percebidos problemas de desempenho e pressão de memória no serviço Render Free, incluindo episódio de indisponibilidade associado ao esgotamento de memória. O usuário observou diferença relevante de desempenho com e sem a Galeria; ainda não há medições instrumentadas comparáveis registradas neste histórico.

**Contexto técnico:** Render Free com memória limitada; o plano de mídia documenta que servir imagens integralmente pelo backend pode gerar carga desnecessária, e recomenda entrega direta por R2/CDN, miniaturas sob demanda e redução de preloads. Esses são fatores de risco documentados, não prova isolada da causa do incidente.

**Decisões e medidas registradas:** priorizar a estabilidade da competição; retirar a Galeria independente do escopo do MVP V1 e adiá-la para V2.0; preservar a prévia institucional na Landing; ocultar acessos à Galeria completa e à gestão de álbuns; planejar arquitetura separada para a Galeria, com distribuição de mídia por R2/CDN e sem transferência pesada pelo backend de inscrições. Não adicionar novas funcionalidades ao MVP antes da competição; focar correções e operação.

**Referências:** `docs/PLANO_MIGRACAO_MIDIA_R2_CDN.md` (decisão de 15/10/2026) e `docs/ETAPAS_POS_PROJETO.md`.

**Resultado/limitações:** o usuário relatou melhora de desempenho ao operar sem a Galeria, mas não há valores de memória, latência, throughput ou concorrência registrados. A implementação da Galeria V2.0 permanece futura. Não afirmar que a migração de arquitetura foi executada.

**Lição aprendida:** em infraestrutura limitada, funcionalidades de mídia podem competir com os recursos do fluxo crítico de inscrições; separar conteúdo pesado e limitar escopo protege a disponibilidade do MVP.

---

## 2026-10-18 — Gestão / Inscrições: tabela inacessível no mobile

**Ambiente:** interface web da Gestão, tela Inscrições, navegador mobile (captura fornecida pelo usuário).

**Sintoma observado:** a tabela exibia principalmente as colunas finais de status e ações, enquanto a barra horizontal parecia estar no início. Informações das colunas anteriores ficavam inacessíveis ou difíceis de alcançar. A captura mostra status APROVADA/REJEITADA e a ação Trocar líder, mas não as informações de identificação à esquerda.

**Diagnóstico provável:** as colunas de ações com `fixed="right"` no componente `el-table` do Element Plus criavam uma camada fixa que, em viewport estreita, podia cobrir grande parte do conteúdo. A largura/overflow dos containers também precisava ser contida. A captura, isoladamente, não comprova a causa exata do deslocamento da barra.

**Correção implementada (frontend):**
- Removido `fixed="right"` de quatro colunas de ações nas tabelas da página.
- Aplicado `min-width: 0; max-width: 100%` à página e aos cards de tabelas, com `overflow: hidden` nos cards.
- Limitada a largura de `el-table` ao container.
- Aplicado `overscroll-behavior-x: contain` aos wrappers de rolagem do Element Plus.

**Arquivo:** `gestao/src/views/RegistrationsView.vue`.

**Commit:** [a0c08ce](https://github.com/gbsalermo/Rascomp-FRONT/commit/a0c08cebef47b46ef6e7ee6333a3e952713cd539), aplicado diretamente à `main`.

**Escopo e impacto esperado:** somente apresentação e rolagem das tabelas. Nenhuma mudança no backend, banco, regras competitivas ou chamadas à API. As ações deixam de permanecer fixas na borda direita e passam a acompanhar a tabela.

**Validação:** correção commitada; confirmação visual e testes em dispositivos reais ainda não registrados neste documento. Verificar em celular pequeno e desktop se a primeira coluna aparece ao iniciar, se é possível percorrer todas as colunas, se botões continuam acessíveis e se filtros/ações funcionam. A alternativa de cards mobile **não** foi implementada.

**Lição aprendida:** colunas fixas em tabelas administrativas largas precisam ser avaliadas em viewports estreitas; priorizar acesso a todas as informações e regressão mínima durante a estabilização do MVP.
