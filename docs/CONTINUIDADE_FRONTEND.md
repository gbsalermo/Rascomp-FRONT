# Continuidade — RASCOMP Frontend

Última atualização: **26/08/2026 — pós-aprovação da apresentação**

## 1. Situação atual

O projeto foi apresentado à equipe e **aprovado**. O foco agora deixa de ser preparar uma demo e passa a ser estabilizar o sistema e iniciar as novas frentes acordadas.

```text
RAS UFRB = organização
RRC      = evento/competição
RasComp  = plataforma
```

O repositório possui:

```text
gestao/        → autenticado: operação, participante e futuras áreas DEV/MIDIA
landing-page/  → site público RAS UFRB + RRC
photo-gallery/ → protótipo separado de galeria pública
```

## 2. Checkpoint entregue

```text
Autenticação                           ✅
Dashboard / shell                      ✅
Central da competição                  ✅
Inscrições                             ✅
Equipes / robôs / modalidades          ✅
Ativo/inativo                          ✅
Usuários                               ✅
Follow Line                            ✅
Histórico por tomadas                  ✅
Operação da tomada                     ✅
Sumô                                   ✅
Chave visual                           ✅
Arena da partida                       ✅
2 penalidades = derrota automática     ✅
Suicídio/WO                            ✅
Histórico de chaves                    ✅
Fotos dos robôs                        ✅
Portal participante inicial            ✅
Landing pública inicial                ✅
Galeria pública protótipo              ✅
```

Último checkpoint conhecido:

```text
Frontend Checks ✅
Backend         ✅ 48 testes / 0 falhas / 0 erros
Demo profile    ✅ MySQL + Flyway + testdata
```

## 3. Mudança de roadmap aprovada

O modelo antigo `ADMIN → PARTICIPANTE → LANDING` não é mais suficiente.

Novo roadmap:

```text
0. REVISÃO / ESTABILIZAÇÃO
   ↓
1. PERMISSÕES
   DEV | GESTAO | MIDIA | PARTICIPANTE
   ↓
2. AJUSTES GERAIS DEV
   ↓
3. GESTOR DE MÍDIA / CMS
   ↓
4. REGRAS
   ↓
5. FUTEBOL DE ROBÔS
   ↓
6. PARTICIPANTE COMPLETO
   ↓
7. CONSOLIDAÇÃO LANDING / GALERIA
```

## 4. Novas permissões

### DEV

Acesso integral. Deve ser o único perfil com poderes estruturais como:

- criar competição;
- alterar permissões;
- alterar/desativar inscrições livremente dentro das regras DEV;
- transferir competidor de equipe;
- transferir robô de equipe;
- trocar responsável de equipe;
- usar Ajustes Gerais.

### GESTAO

Perfil operacional equivalente à parte de operação que a organização usa hoje:

- Follow;
- Sumô;
- inspeção;
- partidas;
- lançamento de resultados/rounds/tentativas;
- acompanhamento do evento.

Não cria competição e não recebe ferramentas estruturais de DEV.

### MIDIA

Acesso ao futuro gestor editorial:

- upload de mídia;
- edição de tópicos/textos;
- associação de mídia a slots/janelas;
- conteúdo da Landing;
- galeria.

### PARTICIPANTE

Permanece restrito ao portal e ao ownership da própria equipe.

## 5. Gestor de Mídia

Será implementado dentro de `gestao/`.

Primeiros alvos públicos que hoje estão hardcoded:

```text
landing-page/src/components/HighlightsHero.vue
landing-page/src/components/InstitutionalAbout.vue
landing-page/src/components/InstitutionalEvents.vue
landing-page/src/components/InstitutionalGallery.vue
landing-page/src/components/TeamRobotsAwards.vue
photo-gallery/src/data/albums.ts
```

A arquitetura prevista está detalhada no dossiê mestre. Conceitos sugeridos:

```text
MediaAsset
ContentSlot
ContentItem
```

O backend já possui uma abstração de Cloudflare R2 reservada para mídia futura.

## 6. Futebol de Robôs

Nova modalidade planejada.

Conceito recebido:

```text
competidor A + robô fornecido pela RAS
             ×
competidor B + robô fornecido pela RAS
```

A inscrição não exigirá robô próprio. Equipe continua no desenho por enquanto, sujeito à confirmação final.

Isso exige alteração do backend antes do frontend, porque hoje `Registration.robot` e `ParticipantRegistrationRequest.robotId` são obrigatórios.

## 7. Regras

Criar área de cards expansíveis para:

```text
Follow Line
Sumô geral
Sumô RC / textos específicos
Futebol de Robôs
Ambiente / Vestimenta
```

Regras ambientais indicadas inicialmente incluem proibição de alimentos/líquidos na área, sandálias e shorts, além das normas de segurança equivalentes ao laboratório. A redação/sanção deve ser confirmada antes de ser publicada como regulamento oficial.

## 8. Ajustes Gerais DEV

Nova área DEV-only para substituir intervenções manuais no banco.

Não deve ser um editor de tabela genérico. Cada ação será uma operação validada, por exemplo:

```text
alterarRole
transferirCompetidor
transferirRobo
transferirResponsabilidade
corrigirInscricao
ativar/desativar
```

Ações críticas devem possuir auditoria.

## 9. Achados prioritários da revisão

### P0 / manutenção

- backend possui `rascomp/bin/` antigo rastreado com artefatos de build/código duplicado;
- documentação antiga divergia da estrutura real;
- comentários TODO antigos em ConfigFollow/ConfigSumo descreviam módulos já implementados;
- CSS da gestão está fragmentado em muitas folhas corretivas.

### P1 / lógica

- reativação de Registration não revalida período de inscrições;
- cancelamento do participante precisa regra explícita depois de aprovação/chave/início;
- geração/regeneração de chave precisa estados de competição formalmente permitidos;
- edição futura de MatchResult após progressão precisa ser bloqueada ou ter rollback de chave;
- segurança atual ORGANIZACAO é ampla demais para o novo modelo de roles.

### P2 / arquitetura

- `api.ts` e `types.ts` precisam ser quebrados por domínio conforme novas features entrarem;
- `ParticipantView`, `SumoMatchView`, `FollowView` e `FollowRunView` já são grandes;
- decidir se `photo-gallery` continua aplicação própria;
- alinhar storage local de RobotImage com a estratégia R2 do CMS.

## 10. Regras ainda pendentes

- impacto oficial dos checkpoints no Follow;
- combinações válidas de concluída/válida/tempo no Follow;
- regras completas e sanções do Futebol;
- regras oficiais de ambiente/vestimenta;
- quem pode editar/publicar Regras: DEV, MIDIA ou ambos;
- se conteúdo MIDIA publica imediatamente ou requer aprovação;
- política de cancelamento de inscrição após aprovação/chave.

## 11. Próxima etapa efetiva

Antes de implementar novas features:

1. fechar os bugs P1 da revisão;
2. fazer um commit isolado removendo `rascomp/bin/` do backend;
3. manter CI verde;
4. implementar a nova matriz de permissões;
5. somente então iniciar Ajustes Gerais/Mídia/Futebol.

## 12. Documento canônico

O mapa detalhado de arquivos, fluxos, riscos e o guia “quero alterar X, onde mexo?” está em:

```text
docs/DOSSIE_PROJETO_RASCOMP.md
```

Esse dossiê deve ser atualizado sempre que uma mudança alterar responsabilidades arquiteturais.