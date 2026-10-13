# V1-BETA B — Base Cloud

Status em 06/10/2026: **🚧 estrutura preparada; nenhum recurso remoto provisionado ainda**.

## Domínio oficial adquirido

Domínio canônico do Beta B:

```text
rasufrb.site
```

Topologia de produção definida:

```text
https://rasufrb.site      → Landing pública (rascomp-landing)
https://app.rasufrb.site  → Gestão + Portal do Participante (rascomp-app)
https://api.rasufrb.site  → API Spring Boot
```

Homologação estável, quando ativada:

```text
https://homolog.rasufrb.site      → Landing de homologação
https://app-homolog.rasufrb.site  → Gestão/Participante protegidos por Access
```

O registro permanece na Hostinger; a autoridade DNS será transferida para os nameservers da Cloudflare. Não é necessário contratar hospedagem da Hostinger.

## Arquitetura de destino

```text
Landing
→ Cloudflare Workers Static Assets

Gestão / Participante
→ Cloudflare Workers Static Assets

API
→ Cloudflare Worker
→ Cloudflare Container
→ Spring Boot Java 21
→ MySQL persistente externo
→ R2 para storage persistente
→ provedor de e-mail transacional
```

A conta Cloudflare inicial pode ser temporária. Nenhum ID de conta, hostname ou segredo deve ficar hardcoded.

## Frontends

### Landing

Pasta:

```text
landing-page/
```

Configuração Cloudflare:

```text
landing-page/wrangler.jsonc
```

Build cloud:

```bash
cd landing-page
cp .env.cloud.example .env.cloud
npm run build:cloud
```

Deploy, somente depois de autenticar a conta:

```bash
npm run deploy:cloud
```

### Gestão / Participante

Pasta:

```text
gestao/
```

Configuração Cloudflare:

```text
gestao/wrangler.jsonc
```

Build/deploy segue o mesmo padrão.

## Variáveis de build

A API e a ligação Landing → App são configuradas no build, não no código.

Landing:

```text
VITE_API_URL=https://<api>
VITE_GESTAO_URL=https://<app>
VITE_REFRESH_MS=20000
```

Gestão:

```text
VITE_API_URL=https://<api>
```

Os arquivos reais `.env.cloud` continuam ignorados pelo Git. Somente os exemplos são versionados.

## Workers Static Assets

Os dois frontends usam:

```json
"assets": {
  "directory": "./dist",
  "not_found_handling": "single-page-application"
}
```

Isso preserva rotas do Vue Router em refresh/navegação direta.

## Backend

A base do backend será composta por:

```text
Dockerfile
application-cloud.properties
Cloudflare Worker/Container router
healthcheck
secrets externos
```

O backend cloud não deve iniciar com testdata.

## Ordem de provisionamento posterior

```text
1. autenticar Wrangler na conta temporária
2. publicar Landing em workers.dev
3. publicar Gestão/Participante em workers.dev
4. criar MySQL persistente externo
5. criar/configurar API Container
6. configurar CORS e URLs
7. configurar e-mail real
8. configurar R2/storage persistente
9. criar primeiro DEV real
10. smoke completo
11. somente depois considerar inscrições reais
```

## Gates preservados

A publicação técnica não significa produção aberta.

Ainda são bloqueantes para dados/inscrições reais:

- MySQL persistente + backup/restore;
- e-mail transacional real;
- storage persistente dos uploads;
- secrets fora do código;
- testdata desabilitado;
- contas reais verificadas;
- smoke ponta a ponta;
- observabilidade mínima;
- rollback documentado.


## Gate de banco limpo

A infraestrutura cloud não deve importar o banco local/testdata.

Primeiro boot esperado:

```text
MySQL novo/vazio
→ Flyway cria schema
→ seeds/testdata = false
→ 1 DEV real via bootstrap
→ demais contas/dados criados conscientemente
```

O backend possui `CloudProfileSafetyGuard` para impedir startup cloud com `testdata` ou seeds habilitados.

Não subir equipes, robôs, competidores, competições, inscrições, rounds, chaves ou contas demo do ambiente local.


## Convite das contas internas

Após o primeiro DEV de bootstrap, contas DEV/GESTAO/MIDIA são criadas sem senha administrativa.

O titular recebe o convite e define a própria senha em `/ativar-conta`. O smoke cloud deve validar esse fluxo com um e-mail real antes do go-live.
