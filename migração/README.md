# Migração e portabilidade — RasComp

Este diretório centraliza decisões e procedimentos para migrar a infraestrutura e as contas de usuários sem perder dados, quebrar autenticação ou interromper competições.

> **Status (12/10/2026):** estrutura inicial criada. Completar e validar os runbooks **após finalizar as integrações cloud** (Landing, Gestão/Portal, API, MySQL, R2 e e-mail). Não interpretar este material como procedimento de migração já testado.

## Guias previstos

1. `DECISOES_E_LIMITACOES.md` — histórico e justificativas.
2. `BANCO_E_CONTAS.md` — inventário do esquema, exportação, backup consistente, importação, hashes de senha, IDs, vínculos, integridade, Flyway, testes e rollback.
3. `API_E_SECRETS.md` — Docker, configuração cloud/local, certificados TLS, segredos, JWT, sessões, URLs, CORS e cutover.
4. `CLOUDFLARE_E_WORKERS.md` — DNS, subdomínios, frontend Workers, cron triggers, R2, rotas e reversão.
5. `CHECKLIST_DE_MIGRACAO.md` — migração ensaiada, janela, congelamento de escritas, validação, rollback e comunicação.

## Princípios

- Preservar o Spring Boot Java 21, JPA, Flyway e o contrato da API.
- Backup verificado e restauração em ambiente isolado **antes** de qualquer mudança de produção.
- Migrar usuários, perfis, hashes e vínculos com integridade e sem registrar credenciais nos documentos.
- Avaliar invalidação/rotação de JWT e tokens de recuperação; nunca copiar segredos sem estratégia.
- Arquivos R2 precisam ser inventariados e migrados separadamente do MySQL.
- Cutover com única origem de gravações, proteção de operações em andamento e rollback definido.
- Manter os ambientes local e cloud utilizáveis e compatíveis.

Os detalhes de cada guia serão preenchidos com valores **não secretos** e comandos testados depois do fechamento da integração cloud.
