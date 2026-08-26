# Roteiro de Demonstração — RRC / RasComp

Data prevista: **27/08/2026**

Objetivo: apresentar à equipe como o RasComp organiza a competição do ponto de vista da **ORGANIZAÇÃO** e do **PARTICIPANTE**, mostrando também estados já ocorridos e operações que podem ser feitas ao vivo.

## 1. Preparação antes da reunião

### Backend

```powershell
cd D:\Projetos\Java\Rascomp
git pull origin main
cd rascomp
$env:SPRING_PROFILES_ACTIVE="testdata"
.\mvnw spring-boot:run
```

No terminal, confirmar que aparece:

```text
RASCOMP · CENARIO COMPLETO DE DEMONSTRACAO PRONTO
```

### Frontend

Em outro terminal:

```powershell
cd D:\Projetos\Java\Rascomp-FRONT
git pull origin main
cd gestao
npm install
npm run typecheck
npm run build
npm run dev
```

Abrir o endereço exibido pelo Vite.

## 2. Credenciais

### Organização

```text
E-mail: organizacao.demo@rascomp.local
Senha:  Rascomp@2026
```

### Participante

```text
E-mail: lider.demo@rascomp.local
Senha:  Rascomp@2026
```

## 3. Abertura — explicar o conceito

Mensagem curta sugerida:

> O RRC é a competição; o RasComp é a plataforma que acompanha todo o fluxo, da inscrição até o ranking, chave, vencedor e publicação dos resultados.

Mostrar que o backend é a fonte de verdade e que o frontend da organização só opera essas regras.

## 4. Login da ORGANIZAÇÃO

Entrar com a conta de organização.

Selecionar como competição em foco:

```text
RRC 2026 · Demonstração ao vivo
```

## 5. Dashboard — competição em andamento

Mostrar:

- status `EM_ANDAMENTO`;
- progresso do período aproximadamente em 50%;
- inscrições da edição;
- aprovadas;
- pendentes;
- robôs/equipes;
- categorias realmente presentes na edição;
- últimas movimentações;
- atalhos de operação.

Explicar que o percentual é uma referência temporal do período oficial, não um percentual inventado de partidas.

## 6. Inscrições — ação ao vivo

Abrir **Inscrições**.

Existem inscrições:

```text
APROVADAS
PENDENTES
REJEITADA
```

Escolher uma `PendingBot Demo` e demonstrar aprovação.

Pontos a explicar:

- só `ORGANIZACAO` pode aprovar/rejeitar;
- backend grava usuário revisor e data/hora;
- participante não controla aprovação.

## 7. Follow Line — ranking já ocorrido

Abrir **Follow Line** e selecionar:

```text
RRC 2026 · Demonstração ao vivo
DEMO · Seguidor de Linha
```

Mostrar:

- ranking pré-estabelecido;
- melhor **tomada** de cada robô;
- tempo bruto + penalidade = tempo final;
- histórico por tomadas;
- expansão para ver tentativas.

Destaque:

```text
Chronos Demo
Tomada 1 → preenchida
Tomada 2 → preenchida
Tomada 3 → livre
```

## 8. Follow Line — operação ao vivo

Clicar:

```text
Registrar tomada
→ Chronos Demo
```

A tela deve abrir diretamente na Tomada 3.

Mostrar:

- foto do Chronos;
- equipe;
- melhor tempo;
- 2/3 tomadas preenchidas;
- tentativas restantes.

Registrar a tentativa #1 da Tomada 3 com um tempo de exemplo, por exemplo:

```text
Tempo:       40.850
Penalidade:  0
Checkpoints: 5
Concluída:   sim
Válida:      sim
```

Voltar e mostrar que histórico/ranking são atualizados pelo backend.

Se não quiser alterar o ranking durante a apresentação, usar um tempo mais alto, como `50.000`.

## 9. Sumô — chave ao vivo

Abrir **Sumô** e selecionar:

```text
RRC 2026 · Demonstração ao vivo
DEMO · Mini Sumô RC
```

Mostrar a árvore do campeonato.

Explicar:

- 8 robôs;
- parte da primeira rodada já concluída;
- progressão visual;
- Titan Demo já possui uma vitória;
- a chave é por categoria, portanto não mistura Mini/3 kg ou RC/Autônomo.

## 10. Sumô — abrir partida

Abrir uma partida disponível.

Mostrar a tela de arena:

- fotos dos dois robôs quando disponíveis;
- placar;
- histórico de rounds;
- botões grandes para uso no dia;
- vitória A/B;
- penalidades;
- Suicídio/WO;
- empate/anular/cancelar.

Se desejar registrar algo ao vivo, escolher uma partida ainda aberta e registrar um round.

### Penalidade

Explicar:

```text
0..2 penalidades por robô / round
```

O limite `2` é provisório até confirmação do regulamento. Atualmente a penalidade é registrada para auditoria e não define automaticamente o vencedor.

### Suicídio / WO

Demonstrar que:

```text
Suicídio/WO do robô A
→ vencedor do round = robô B
```

A regra serve tanto para RC quanto Autônomo.

## 11. BYE

Ainda no Sumô, selecionar:

```text
DEMO · Sumô 3 kg RC · BYEs
```

Existem 10 participantes.

Resultado esperado:

```text
chave de 16
6 BYEs
2 confrontos reais na primeira fase
```

Explicar que o backend calcula a próxima potência de dois e resolve BYEs automaticamente.

## 12. Histórico — campeonato já encerrado

Trocar a competição em foco para:

```text
RRC 2025 · Histórico completo
```

Selecionar:

```text
DEMO · Mini Sumô · 32 robôs
```

Mostrar:

```text
32 robôs
31 partidas
16 avos
8 oitavas
4 quartas
2 semifinais
1 final
```

As partidas devem estar finalizadas e servem como exemplo de informações já ocorridas/publicáveis.

Se abrir uma partida histórica, a tela deve entrar em **somente leitura**.

## 13. Fotos dos robôs

Explicar o fluxo:

```text
participante cadastra foto
→ backend valida arquivo e ownership
→ define foto principal
→ mesma foto aparece:
   - portal participante
   - Follow
   - Sumô
   - futuramente na Landing
```

Formatos:

```text
JPEG
PNG
WEBP
até 5 MB
```

## 14. Trocar para PARTICIPANTE

Fazer logout e entrar com:

```text
lider.demo@rascomp.local
Rascomp@2026
```

O sistema deve levar automaticamente para:

```text
/minha-equipe
```

Mostrar:

```text
Equipe Demo RAS
├─ Líder Demo
├─ Suporte Demo
├─ Chronos Demo
└─ Titan Demo
```

## 15. Portal participante

Mostrar os cartões competitivos.

### Chronos Demo

Deve exibir:

- foto;
- inscrição Follow aprovada;
- posição no ranking;
- melhor tomada;
- melhor tempo;
- tomadas já preenchidas;
- histórico resumido.

Antes da operação ao vivo, o seed começa em:

```text
2 / 3 tomadas preenchidas
```

### Titan Demo

Deve exibir:

- foto;
- inscrição Mini Sumô aprovada;
- pelo menos 1 vitória;
- última partida;
- resultado da partida;
- continuação na chave quando disponível.

Também mostrar o botão de adicionar/trocar foto.

## 16. Encerramento sugerido

Resumo curto:

```text
Participante
→ equipe / robôs / inscrições / acompanhamento

Organização
→ aprovação / operação das provas / resultados

Backend
→ fonte de verdade

Landing futura
→ publica o que já foi produzido pela competição
```

Próximas etapas após a demonstração:

1. consolidação final do ADMIN;
2. completar experiência do PARTICIPANTE;
3. desenvolver LANDING pública RAS UFRB + RRC.

## 17. Checklist de segurança antes de apresentar

```text
[ ] git pull dos dois repositórios
[ ] MySQL local disponível
[ ] backend sobe com SPRING_PROFILES_ACTIVE=testdata
[ ] mensagem do DemoShowcaseDataInitializer aparece
[ ] login ORGANIZACAO funciona
[ ] competição ao vivo aparece
[ ] Follow mostra ranking e histórico
[ ] Chronos abre com 2/3 tomadas
[ ] Sumô mostra chave parcial
[ ] categoria BYE mostra chave
[ ] histórico 32 robôs aparece
[ ] login PARTICIPANTE funciona
[ ] Chronos/Titan aparecem no portal
[ ] fotos aparecem
[ ] manter os dois terminais abertos durante a apresentação
```
