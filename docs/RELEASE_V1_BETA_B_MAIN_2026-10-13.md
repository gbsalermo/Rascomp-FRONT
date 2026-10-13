# Release V1-BETA B — produção pela main (13/10/2026)

## Estado do GitHub
- Backend gbsalermo/Rascomp: PR #12 merged em main, merge commit `bf65fd7d06f5184e7127a59d7f2d002a73412a8c`.
- Frontend gbsalermo/Rascomp-FRONT: PR #6 merged em main, merge commit `22192257bc6aa78a277906890ceb57eb84b86247`; a alteração preexistente da main foi preservada pelo merge.
- Nova branch de desenvolvimento em ambos: `v1-pos-cloud-gestao-midia`, partindo do merge em main.
- Não apagar imediatamente a branch antiga de cloud; preservá-la como referência até verificar os deploys.

## Produção: mudanças de branch ainda dependem do painel externo
1. Render, serviço `rascomp-api`: Settings > Build & Deploy > Branch = `main`; manter Docker Root Directory `rascomp`, profile `cloud`, variáveis Aiven, R2 e Resend protegidas. Confirmar deploy do commit da main e `/actuator/health` = UP.
2. Cloudflare Worker Static Assets `rascomp-app`: configurações Git/Builds > branch de produção `main`; confirmar root `gestao`, build cloud e domínio `app.rasufrb.site`. Rodar login e recuperação de senha.
3. Cloudflare Worker Static Assets `rascomp-landing`: configurações Git/Builds > branch de produção `main`; confirmar root `landing-page`, build cloud, modo institucional, domínio `rasufrb.site`.
4. Worker `rascomp-automation`: não é Worker de frontend; manter cron existente e verificar health, sem forçar troca de source branch caso não seja Git-backed.
5. Após troca, cada plataforma deve reportar commit correspondente à main; não é suficiente fazer merge no GitHub.
6. Smoke: landing em desktop/mobile, Gestão login, cadastro/verificação por Resend, recuperação, API UP, leitura e upload R2 de QA sem dados reais. Observar logs; evitar divulgar inscrição pública até gates finais.

## Arquitetura vigente
- Landing `rasufrb.site` → `rascomp-landing` Workers Static Assets.
- Gestão `app.rasufrb.site` → `rascomp-app` Workers Static Assets.
- API `api.rasufrb.site` → Render Spring Boot 3.5 / Java 21.
- Banco → Aiven MySQL 8.4 com Flyway V32, TLS.
- Mídia e comprovantes → bucket Cloudflare R2 privado `rascomp-storage`.
- E-mail transacional → Resend domínio verificado `mail.rasufrb.site`.
- Galeria/CMS e Futebol de Robôs não estão concluídos.

## Pendências de segurança pré-inscrição pública
- Backup externo e restore realmente testado; plano de continuidade se Aiven Free ficar indisponível.
- Teste de carga para 100–500 usuários e contingência local + Tunnel validada.
- Verificar isolamento e autorização de comprovantes; reconciliação de reservas de R2 interrompidas e controle de operações.
- Alertas de armazenamento/e-mail, limites Resend, revisão de segredos e monitoramento de falhas transitórias de login.
- Não usar alterações em arquivos de documentação como prova de deploy ou de teste automatizado do frontend.

## Próxima entrega
`v1-pos-cloud-gestao-midia`: Gestor de Mídia e Galeria; depois Futebol de Robôs, manuais e hardening.
