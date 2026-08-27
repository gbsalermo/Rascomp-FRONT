# RasComp — Deploy em Nuvem com Cloudflare

Última revisão: **26/08/2026**

Este documento descreve como publicar o RasComp em nuvem **sem alterar o modo local que já funciona**.

A regra é:

```text
LOCAL
→ continua Spring Boot + MySQL local + Vite local + uploads locais

CLOUD
→ configuração/deploy separado
→ Cloudflare para DNS, frontend, backend containerizado e mídia
```

O deploy só deve ser executado depois da **ETAPA 13 — bateria final de testes manuais** de `docs/ETAPAS_POS_PROJETO.md`.

---

# 1. Estado atual e objetivo

Hoje:

```text
BACKEND
Java 21
Spring Boot
JPA/Hibernate
Flyway
MySQL
JWT

FRONTEND
Vue 3 + TypeScript + Vite
├─ gestao/
├─ landing-page/
└─ photo-gallery/ (enquanto existir separado)

ARQUIVOS
fotos de robôs → filesystem local
CMS/mídia futura → infraestrutura R2 já preparada
```

Objetivo da versão cloud:

```text
www/seu-dominio        → Landing
app/seu-dominio        → Gestão/Participante
api/seu-dominio        → Backend Spring Boot
R2                     → fotos e mídias persistentes
MySQL gerenciado       → banco persistente
Cloudflare             → DNS/TLS/Workers/Containers/R2
```

---

# 2. Arquitetura recomendada

## Primeira implantação — recomendada

```text
Internet
   ↓
Cloudflare DNS + TLS
   ├─ landing → Workers Static Assets
   ├─ gestão  → Workers Static Assets
   └─ API     → Worker
                 ↓
            Cloudflare Container
                 ↓
            Spring Boot Java 21
                 ├─ MySQL gerenciado externo
                 └─ Cloudflare R2
```

### Por que Docker para o backend

Cloudflare Containers executa imagens Linux e aceita aplicações existentes distribuídas como container. Isso evita reescrever o backend Spring Boot para o runtime JavaScript de Workers.

Documentação oficial:

- https://developers.cloudflare.com/containers/
- https://developers.cloudflare.com/containers/get-started/
- https://developers.cloudflare.com/containers/examples/container-backend/

Containers exige atualmente o **Workers Paid plan**. Verificar preço vigente antes da implantação:

- https://developers.cloudflare.com/containers/pricing/

---

# 3. Limitação importante: o banco

O RasComp atual usa:

```text
MySQL
JDBC
JPA/Hibernate
Flyway SQL voltado ao MySQL
```

Cloudflare D1 **não é MySQL**. D1 usa semântica SQLite e API/binding própria.

Documentação:

- https://developers.cloudflare.com/d1/

Portanto, migrar diretamente o sistema atual para D1 exigiria uma refatoração relevante da camada de persistência.

## Decisão recomendada para o primeiro deploy

```text
manter MySQL
→ usar provedor MySQL gerenciado e persistente
→ backend continua praticamente igual
```

Isso significa que a primeira arquitetura será **Cloudflare-first**, mas o banco será um serviço MySQL persistente externo.

Cloudflare Hyperdrive suporta MySQL, mas ele é um acelerador/conector de banco para Workers; **não hospeda o banco MySQL**. Não é necessário adicioná-lo ao primeiro deploy do nosso Spring Boot containerizado.

Se no futuro existir exigência de “100% Cloudflare”, criar uma etapa separada para avaliar migração MySQL/JPA/Flyway → D1. Não misturar essa migração com o primeiro deploy.

---

# 4. Limitação importante: disco de Containers

O disco de um Cloudflare Container é **efêmero**. Quando a instância dorme e volta, o filesystem retorna ao estado da imagem.

Logo isto NÃO pode permanecer em produção:

```text
./uploads/robots
```

Documentação:

- https://developers.cloudflare.com/containers/platform-details/architecture/

Antes do deploy de produção, fotos e mídia precisam usar armazenamento persistente.

## Direção recomendada

```text
LOCAL
RobotImageStorageService
→ filesystem

CLOUD
RobotImageStorageService / adapter cloud
→ ObjectStorageService
→ Cloudflare R2
```

Criar uma configuração do tipo:

```text
ROBOT_IMAGE_STORAGE_PROVIDER=local|r2
```

com padrão:

```text
local
```

Assim o comportamento atual não muda.

R2 será usado também pelo Gestor de Mídia/CMS.

Documentação:

- https://developers.cloudflare.com/r2/get-started/
- https://developers.cloudflare.com/r2/examples/aws/aws-sdk-java/

O projeto já possui `R2ObjectStorageService`. Reaproveitar essa infraestrutura; não criar um terceiro storage.

---

# 5. FASE 0 — preparar o projeto sem quebrar o local

Antes de criar a conta Cloudflare, concluir no código:

```text
[ ] modo local continua sendo default
[ ] Dockerfile do backend
[ ] profile/configuração cloud
[ ] upload de robôs compatível com R2
[ ] CMS/mídia compatível com R2
[ ] variáveis de ambiente documentadas
[ ] testdata impossível de ativar por acidente em produção
[ ] CORS configurável
[ ] logs sem segredos
[ ] health/smoke endpoint definido
[ ] CI verde
```

Não substituir `application.properties` local por configurações de produção.

Preferência:

```text
application.properties
→ defaults locais atuais

application-cloud.properties
→ diferenças seguras de produção
```

Segredos continuam vindo somente de ambiente.

---

# 6. FASE 1 — criar uma conta Cloudflare nova

1. Criar uma conta Cloudflare dedicada ao projeto/instituição.
2. Ativar autenticação de dois fatores na conta.
3. Não compartilhar a senha principal entre membros.
4. Usar membros/permissões da conta quando mais pessoas precisarem administrar.
5. Ativar o plano necessário para Cloudflare Containers.
6. Ativar R2 em **Storage & databases → R2**.
7. Criar/confirmar o subdomínio `*.workers.dev` da conta.

Antes de comprar/configurar domínio, é possível validar tudo usando URLs `workers.dev`.

---

# 7. FASE 2 — domínio e DNS

Pode-se usar um domínio novo ou um domínio/subdomínio institucional existente.

Estrutura recomendada:

```text
rascomp.exemplo.org.br       → Landing
app.rascomp.exemplo.org.br   → Gestão/Participante
api.rascomp.exemplo.org.br   → Backend
```

Alternativa mais curta:

```text
www.exemplo.org.br
rascomp.exemplo.org.br
api.rascomp.exemplo.org.br
```

## Adicionar domínio à Cloudflare

1. Cloudflare Dashboard.
2. Adicionar o domínio como uma Zone.
3. Se o domínio estiver em outro registrador, alterar os nameservers conforme instrução da Cloudflare.
4. Esperar o domínio aparecer como ativo.
5. Não remover registros DNS existentes sem revisar uso de e-mail/site institucional.

Workers Custom Domains criam DNS e certificado TLS automaticamente quando a zona pertence à conta.

Documentação:

- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/dns/manage-dns-records/

Não configurar domínio customizado antes de os três serviços funcionarem em `workers.dev`.

---

# 8. FASE 3 — criar R2

No Dashboard:

```text
Storage & databases
→ R2
→ Create bucket
```

Sugestão:

```text
rascomp-production
```

Chaves lógicas dentro do bucket:

```text
robots/{robotId}/...
media/...
gallery/...
```

Não misturar arquivos temporários e permanentes sem prefixo.

## Credenciais

Criar token/Access Key específico para o backend, com o menor privilégio necessário ao bucket.

Nunca colocar no Git:

```text
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
JWT_SECRET
DB_PASSWORD
```

Variáveis já previstas no backend:

```text
R2_ENABLED=true
R2_ACCOUNT_ID
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_BASE_URL
```

Para fotos privadas/administradas, avaliar cuidadosamente antes de tornar bucket inteiro público. Preferir API controlada ou URLs adequadas ao caso.

---

# 9. FASE 4 — banco MySQL de produção

Criar uma instância MySQL gerenciada em provedor de escolha.

Requisitos mínimos desejáveis:

```text
MySQL 8+
persistência real
TLS
backup automático
restore testável
foreign keys
acesso remoto pelo backend
região próxima da América do Sul quando possível
```

Não utilizar MySQL dentro do Cloudflare Container. O disco é efêmero.

Criar banco vazio:

```sql
CREATE DATABASE rascomp;
```

Criar usuário dedicado ao RasComp. Não usar `root` em produção.

Exemplo conceitual de variáveis:

```text
DB_URL=jdbc:mysql://HOST:3306/rascomp?...opções TLS do provedor...
DB_USERNAME=rascomp_app
DB_PASSWORD=<segredo>
```

As opções TLS da JDBC URL dependem do provedor escolhido. Seguir a documentação dele.

## Atenção a allowlist de IP

Cloudflare Containers consegue acessar a internet, inclusive conexões não HTTP quando internet está habilitada, mas não assumir um IP de saída fixo para liberar no MySQL.

Preferir um provedor que aceite conexão TLS autenticada por hostname/credencial ou confirmar a estratégia de rede antes de fechar o provedor.

Documentação de tráfego de saída:

- https://developers.cloudflare.com/containers/platform-details/outbound-traffic/

---

# 10. FASE 5 — criar Dockerfile do backend

Criar futuramente:

```text
Rascomp/rascomp/Dockerfile
```

Modelo inicial:

```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Antes de usar em cloud:

```powershell
docker build -t rascomp-api .
docker run --rm -p 8080:8080 `
  -e DB_URL="..." `
  -e DB_USERNAME="..." `
  -e DB_PASSWORD="..." `
  -e JWT_SECRET="..." `
  rascomp-api
```

Validar:

```text
[ ] aplicação inicia
[ ] Flyway executa
[ ] login funciona
[ ] API pública funciona
[ ] upload R2 funciona
[ ] não cria testdata
```

Nunca embutir credenciais no Dockerfile ou na imagem.

---

# 11. FASE 6 — Worker que controla o Container do backend

Cloudflare Containers é acessado através de um Worker/Durable Object.

Criar futuramente algo como:

```text
Rascomp/rascomp/cloudflare/api-worker/
├─ package.json
├─ wrangler.jsonc
└─ src/index.ts
```

Instalar:

```bash
npm install @cloudflare/containers
npm install -D wrangler typescript
```

Estrutura conceitual:

```ts
import { Container } from '@cloudflare/containers'
import { env } from 'cloudflare:workers'

export class RascompApiContainer extends Container {
  defaultPort = 8080
  sleepAfter = '10m'
  enableInternet = true

  envVars = {
    SPRING_PROFILES_ACTIVE: 'cloud',
    DB_URL: env.DB_URL,
    DB_USERNAME: env.DB_USERNAME,
    DB_PASSWORD: env.DB_PASSWORD,
    JWT_SECRET: env.JWT_SECRET,
    CORS_ALLOWED_ORIGINS: env.CORS_ALLOWED_ORIGINS,
    R2_ENABLED: 'true',
    R2_ACCOUNT_ID: env.R2_ACCOUNT_ID,
    R2_ENDPOINT: env.R2_ENDPOINT,
    R2_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: env.R2_BUCKET,
    R2_PUBLIC_BASE_URL: env.R2_PUBLIC_BASE_URL
  }
}

export default {
  async fetch(request, env) {
    const api = env.RASCOMP_API.getByName('rascomp-api')
    return api.fetch(request)
  }
}
```

O código final deve seguir a API vigente do `@cloudflare/containers` no momento da implementação.

## Configuração Wrangler conceitual

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "rascomp-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-26",
  "containers": [
    {
      "class_name": "RascompApiContainer",
      "image": "../../Dockerfile",
      "max_instances": 1,
      "instance_type": "basic"
    }
  ],
  "durable_objects": {
    "bindings": [
      {
        "name": "RASCOMP_API",
        "class_name": "RascompApiContainer"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["RascompApiContainer"]
    }
  ]
}
```

Começar com **uma instância nomeada** simplifica migrations, sessão do processo e diagnóstico.

Cloudflare Containers ainda não possui autoscaling stateless automático completo como requisito para usarmos sem pensar; o primeiro deploy do RasComp não precisa começar distribuído.

Durante evento real, revisar capacidade e comportamento de cold start.

Documentação:

- https://developers.cloudflare.com/containers/get-started/
- https://developers.cloudflare.com/containers/container-class/
- https://developers.cloudflare.com/containers/platform-details/limits/

---

# 12. FASE 7 — segredos do backend

Usar Worker Secrets ou Secrets Store.

Para começar, Worker Secrets é suficiente.

Exemplos:

```bash
npx wrangler secret put DB_URL
npx wrangler secret put DB_USERNAME
npx wrangler secret put DB_PASSWORD
npx wrangler secret put JWT_SECRET
npx wrangler secret put CORS_ALLOWED_ORIGINS
npx wrangler secret put R2_ACCOUNT_ID
npx wrangler secret put R2_ENDPOINT
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_BUCKET
npx wrangler secret put R2_PUBLIC_BASE_URL
```

Documentação:

- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/

`JWT_SECRET` deve continuar com pelo menos 32 bytes, conforme validação atual do backend.

Não usar `vars` do Wrangler para senha/token.

---

# 13. FASE 8 — primeiro deploy do backend

Pré-requisitos locais:

```text
Node.js
Docker Desktop ou engine compatível
Wrangler
login Cloudflare
```

Validar Docker:

```bash
docker info
```

Login Cloudflare:

```bash
npx wrangler login
```

Executar primeiro deploy dentro do Worker do backend:

```bash
npx wrangler deploy
```

O Wrangler pode construir/pushar a imagem Docker e publicar Worker + Container.

Depois:

```bash
npx wrangler containers list
npx wrangler containers images list
```

Cloudflare informa que o Worker pode ficar disponível antes de o provisionamento inicial do Container terminar. Esperar alguns minutos no primeiro deploy antes de diagnosticar como falha definitiva.

Testar inicialmente na URL:

```text
https://rascomp-api.<subdominio>.workers.dev
```

Smoke mínimo:

```text
[ ] API pública responde
[ ] login DEV/GESTAO funciona
[ ] JWT funciona
[ ] banco recebe migrations
[ ] CORS correto
[ ] upload R2 funciona
[ ] reiniciar/sleep do container não perde arquivos
```

---

# 14. FASE 9 — Deploy da Gestão em Workers Static Assets

O `gestao/` é uma SPA Vue/Vite.

Cloudflare Workers Static Assets possui modo específico para SPA que devolve `index.html` em navegações que não correspondem a um arquivo, mantendo Vue Router funcionando.

Documentação:

- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/

No `gestao/`, futuramente instalar Wrangler:

```bash
npm install -D wrangler
```

Criar `wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "rascomp-gestao",
  "compatibility_date": "2026-08-26",
  "assets": {
    "directory": "./dist/",
    "not_found_handling": "single-page-application"
  }
}
```

Antes do build, configurar URL da API cloud:

```text
VITE_API_URL=https://rascomp-api.<subdominio>.workers.dev
```

Build:

```bash
npm ci
npm run typecheck
npm run build
```

Deploy:

```bash
npx wrangler deploy
```

Testar:

```text
/login
/minha-equipe
/follow-line
/sumo
/sumo/partida/:id
rota inexistente / 404 customizada
refresh direto em rota interna
```

O último teste é obrigatório para validar o fallback SPA.

---

# 15. FASE 10 — Deploy da Landing

Repetir o padrão em `landing-page/`.

Configuração de build:

```text
VITE_API_URL=https://rascomp-api.<subdominio>.workers.dev
VITE_GESTAO_URL=https://rascomp-gestao.<subdominio>.workers.dev
VITE_REFRESH_MS=20000
```

Criar outro Worker Static Assets:

```text
rascomp-site
```

Executar:

```bash
npm ci
npm run typecheck
npm run build
npx wrangler deploy
```

Testar:

- home;
- competição atual;
- ranking Follow;
- chave Sumô;
- fotos públicas;
- CMS quando existir;
- navegação para gestão;
- comportamento sem competição em andamento.

Se `photo-gallery/` ainda existir separada, repetir como `rascomp-gallery`. Se já tiver sido absorvida pela Landing, não criar deploy separado.

---

# 16. FASE 11 — custom domains

Somente depois de tudo funcionar em `workers.dev`.

Sugestão:

```text
https://rascomp.seudominio      → landing
https://app.rascomp.seudominio  → gestão
https://api.rascomp.seudominio  → backend
```

Para cada Worker:

```text
Cloudflare Dashboard
→ Workers & Pages
→ Worker
→ Settings
→ Domains & Routes
→ Add
→ Custom Domain
```

Cloudflare cria DNS e certificado automaticamente para Custom Domains da zona.

Depois de configurar os domínios finais, atualizar:

```text
CORS_ALLOWED_ORIGINS=https://app...,https://rascomp...
VITE_API_URL=https://api...
VITE_GESTAO_URL=https://app...
```

Rebuildar/redeployar os frontends porque valores `VITE_*` são incorporados no build.

---

# 17. FASE 12 — CORS de produção

Não utilizar `*` para a aplicação autenticada.

Exemplo:

```text
CORS_ALLOWED_ORIGINS=
https://app.rascomp.exemplo.org.br,
https://rascomp.exemplo.org.br
```

Remover localhost do ambiente cloud se não houver necessidade.

O arquivo local continua permitindo portas de desenvolvimento conforme configuração atual.

---

# 18. FASE 13 — Flyway e primeiro banco

Antes do primeiro deploy que aponta para o banco real:

```text
[ ] banco vazio criado
[ ] backup/restore do provedor entendido
[ ] credenciais testadas
[ ] migrations versionadas intactas
[ ] testdata desligado
```

Ao iniciar Spring Boot:

```text
Flyway
→ cria/aplica V1...Vn
Hibernate ddl-auto=validate
→ confere schema
```

Depois confirmar tabela:

```text
flyway_schema_history
```

Nunca editar migration antiga só porque produção falhou. Corrigir com migration nova.

Antes de atualização futura:

```text
backup do banco
→ deploy
→ migrations
→ smoke test
```

---

# 19. FASE 14 — CI/CD

A implantação inicial pode ser manual. Depois de validada, automatizar.

## GitHub Secrets de deploy

Exemplos:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Não colocar os segredos de runtime do backend dentro dos workflows se eles já estiverem configurados como Worker Secrets.

## Pipeline backend desejado

```text
push/tag aprovado
↓
Maven test
↓
Docker build/test
↓
Wrangler deploy Container/Worker
↓
smoke API
```

## Pipeline frontend desejado

```text
push/tag aprovado
↓
npm ci
↓
typecheck
↓
build com VITE_API_URL cloud
↓
wrangler deploy
↓
smoke da URL
```

Para produção real, preferir deploy por tag/release ou workflow manual aprovado em vez de publicar cada commit da `main` automaticamente.

---

# 20. FASE 15 — logs e observabilidade

Verificar no Dashboard:

```text
Workers Logs
Containers Logs
métricas do Worker
status do Container
```

No backend:

- não registrar JWT;
- não registrar senha;
- não registrar access keys;
- reduzir `spring.jpa.show-sql` em cloud;
- registrar erros com contexto operacional sem dados sensíveis.

Criar futuramente alertas para:

```text
API indisponível
erro de conexão com banco
falha R2
falha Telegram
falha recorrente de autenticação
erro de migration
```

---

# 21. FASE 16 — backup e recuperação

## MySQL

Ter:

- backup automático do provedor;
- retenção conhecida;
- procedimento de restore documentado;
- dump manual antes de migrations de risco.

## R2

Manter chaves organizadas e não usar exclusão física indiscriminada para dados que precisam de auditoria/histórico.

## Código

Deploy sempre associado a commit/tag.

Registrar:

```text
versão frontend
versão backend
migration mais alta
horário do deploy
responsável
```

---

# 22. FASE 17 — estratégia de rollback

## Frontend

Se uma versão quebrar:

```text
reverter commit/tag
rebuild
wrangler deploy
```

## Backend sem migration destrutiva

```text
reverter imagem/commit
redeploy
```

## Backend com migration

Não assumir que rollback de código basta.

Avaliar previamente:

```text
migration backward-compatible?
código anterior entende o novo schema?
precisa migration corretiva?
```

Preferir migrations aditivas e compatíveis quando possível.

---

# 23. FASE 18 — preparação para o dia da competição

Cloudflare Containers pode dormir quando fica ocioso e sofrer cold start ao voltar.

Antes de evento oficial:

```text
[ ] abrir API/gestão antes do início
[ ] validar Container acordado
[ ] validar banco
[ ] validar R2
[ ] validar login Gestão
[ ] validar Follow
[ ] validar Sumô
[ ] validar Avisos
[ ] validar Landing pública
[ ] confirmar backup recente
[ ] manter plano de contingência local
```

Para o RasComp, manter o sistema local operacional continua sendo uma vantagem de contingência.

Não apagar o modo local depois do deploy.

---

# 24. Custos e capacidade

Antes da publicação, revisar a página oficial de preços porque valores mudam.

Hoje Cloudflare Containers exige Workers Paid e cobra recursos de Container/Worker/Durable Object conforme uso.

Links:

- https://developers.cloudflare.com/containers/pricing/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/workers/platform/pricing/

Começar pequeno:

```text
1 instância backend
Workers Static Assets para frontends
1 bucket R2
1 MySQL pequeno gerenciado
```

Medir antes de aumentar capacidade.

---

# 25. Caminho opcional futuro — 100% Cloudflare

Não faz parte do primeiro deploy.

Para remover o MySQL externo seria necessário estudar:

```text
MySQL/JPA/Hibernate/Flyway
↓
migração de persistência
↓
Cloudflare D1 (SQLite semantics)
```

Isso pode envolver:

- mudanças em schema;
- mudanças de tipos SQL;
- substituição/redução de JPA/Hibernate;
- acesso D1 via Worker/binding/API;
- nova estratégia de migrations;
- migração de dados;
- nova bateria de testes completa.

Não realizar essa conversão apenas para dizer que “tudo está na Cloudflare”. A estabilidade do motor competitivo é mais importante.

---

# 26. Checklist de go-live

Só publicar oficialmente quando todos estiverem marcados:

```text
[ ] Etapas pós-projeto concluídas
[ ] bateria manual completa passou
[ ] backend Docker validado localmente
[ ] storage de robôs em R2 no profile cloud
[ ] CMS/mídia em R2
[ ] MySQL de produção com backup
[ ] Flyway validado em banco limpo
[ ] Worker/Container em workers.dev
[ ] gestão em workers.dev
[ ] landing em workers.dev
[ ] CORS correto
[ ] segredos fora do Git
[ ] testdata desligado
[ ] custom domains funcionando
[ ] TLS funcionando
[ ] smoke DEV
[ ] smoke GESTAO
[ ] smoke MIDIA
[ ] smoke PARTICIPANTE
[ ] smoke público
[ ] upload/download de mídia
[ ] logs verificados
[ ] rollback documentado
[ ] backup restaurável
[ ] plano local de contingência preservado
```

---

# 27. Ordem prática do deploy quando chegar a hora

```text
1. concluir sistema local
2. executar bateria manual
3. criar conta Cloudflare
4. ativar Workers Paid + R2
5. preparar storage R2 cloud
6. criar MySQL persistente
7. validar Docker local
8. publicar backend em workers.dev
9. validar backend/Flyway/R2
10. publicar gestão em workers.dev
11. publicar Landing em workers.dev
12. executar smoke completo
13. configurar domínio
14. ajustar CORS/VITE URLs finais
15. redeploy final
16. configurar CI/CD
17. validar backup/rollback
18. declarar go-live
```

Esse processo cria uma implantação em nuvem sem sacrificar a execução local que já existe.
