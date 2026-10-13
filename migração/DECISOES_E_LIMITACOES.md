# Decisões de infraestrutura e limitações — RasComp

> Registro inicial de 12/10/2026. Atualizar ao final das integrações.

## Arquitetura atual

- `rasufrb.site`: Landing pública Cloudflare Worker Static Assets.
- `app.rasufrb.site`: Gestão / Portal Vue, Cloudflare Worker `rascomp-app`.
- `api.rasufrb.site`: API Docker Spring Boot Java 21 no Render Free (`rascomp-api`).
- Aiven MySQL Free: banco persistente e Flyway, TLS validado.
- Cloudflare Worker `rascomp-automation`: verificações agendadas entre 06h e 00h (Brasília); não é garantia de disponibilidade.
- Cloudflare R2 e e-mail transacional real: ainda pendentes de integração e validação.
- Backup externo e restauração isolada: pendentes antes de contas/inscrições públicas.

## Decisões e razões

1. Preservar Java/Spring Boot: reescrever backend para Cloudflare Workers Free exigiria grande retrabalho em segurança, JPA e regras competitivas.
2. Cloudflare Containers exige recursos pagos; optou-se por testar Render Free antes de contratar hospedagem.
3. Render Free: adormece por inatividade, recursos de CPU/memória limitados; avaliar com testes de carga. Versão paga ou outra hospedagem seguem como opção futura.
4. Aiven Free: persistência do registro DEV confirmada após desligamento observado em 12/10; causa específica não comprovada. Contingência e backup obrigatórios.
5. `/actuator/health` + configuração do componente `db`: consulta leve ao MySQL, sem escrita artificial. Não garante impedir políticas de suspensão Aiven.
6. Contingência: notebook Docker via Cloudflare Tunnel, mas exposição da API pelo Tunnel **ainda não validada**; não contar como plano B operacional até testar.
7. Deploy controlado com branch `v1-beta-b-identidade-cloud`, merge para `main` ao encerrar a etapa; auto-deploy do Render desligado.
8. Login DEV, recuperação de senha via `EMAIL_PROVIDER=log` e testes com usuários internos foram confirmados; envio de e-mails reais ainda não configurado. Remover links sensíveis dos logs antes de abrir o sistema externamente.
9. Fluxos internos validados não equivalem a disponibilidade ou carga aprovadas para o dia da competição.

## Atualizações futuras obrigatórias

Documentar versões, limites e custos vigentes; operação de domínio/DNS, export/import da base, armazenamento de comprovantes/mídias, provedores de e-mail, execução local, rotação de chaves e ensaio de restauração. Registrar motivo, alternativa rejeitada, custo/risco e critério de retorno de cada decisão.
