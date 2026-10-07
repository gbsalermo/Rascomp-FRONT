# Domínio e Cloudflare — rasufrb.site

Status: domínio adquirido; ativação da zona Cloudflare pendente.

## Fonte de verdade

Registrador: Hostinger  
Domínio: `rasufrb.site`  
DNS autoritativo: Cloudflare (após troca dos nameservers)

## Topologia

| Hostname | Papel | Projeto |
|---|---|---|
| `rasufrb.site` | Landing pública | `landing-page/` / Worker `rascomp-landing` |
| `www.rasufrb.site` | Redireciona para o domínio raiz | Redirect Rule |
| `app.rasufrb.site` | Gestão + Portal do Participante | `gestao/` / Worker `rascomp-app` |
| `api.rasufrb.site` | API | Spring Boot |
| `homolog.rasufrb.site` | Landing de homologação | opcional / Tunnel |
| `app-homolog.rasufrb.site` | App de homologação | Tunnel + Cloudflare Access |

MySQL nunca recebe hostname público.

## Workers Builds — GitHub

Repositório: `gbsalermo/Rascomp-FRONT`  
Branch enquanto o Beta B estiver em construção: `v1-beta-b-identidade-cloud`

### Landing

Root directory:

```text
landing-page
```

Build command:

```bash
npm run build:cloud
```

Deploy command:

```bash
npx wrangler deploy
```

Build variables:

```text
VITE_API_URL=https://api.rasufrb.site
VITE_GESTAO_URL=https://app.rasufrb.site
VITE_GALERIA_URL=
VITE_REFRESH_MS=20000
```

Custom Domain final:

```text
rasufrb.site
```

### Gestão / Participante

Root directory:

```text
gestao
```

Build command:

```bash
npm run build:cloud
```

Deploy command:

```bash
npx wrangler deploy
```

Build variables:

```text
VITE_API_URL=https://api.rasufrb.site
```

Custom Domain final:

```text
app.rasufrb.site
```

## Backend

Configuração do perfil:

```text
SPRING_PROFILES_ACTIVE=cloud
IDENTITY_FRONTEND_BASE_URL=https://app.rasufrb.site
CORS_ALLOWED_ORIGINS=https://rasufrb.site,https://app.rasufrb.site
```

Segredos obrigatórios não devem ser versionados:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
RESEND_API_KEY
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

## Ordem de ativação

1. adicionar `rasufrb.site` à Cloudflare;
2. revisar os registros DNS importados;
3. substituir na Hostinger os nameservers pelos dois fornecidos pela Cloudflare;
4. aguardar a zona ficar Active;
5. conectar o GitHub em Workers Builds;
6. publicar primeiro os dois frontends em `workers.dev`;
7. validar os builds;
8. anexar `rasufrb.site` e `app.rasufrb.site` como Custom Domains;
9. provisionar/ligar a API em `api.rasufrb.site`;
10. configurar CORS/identidade, e-mail, R2 e MySQL;
11. executar smoke cloud completo;
12. apenas depois abrir inscrições reais.

## Regra de segurança

Nenhum token da Cloudflare, credencial de banco, segredo JWT, chave de e-mail ou credencial R2 deve entrar no Git. Variáveis `VITE_*` são públicas por natureza e não podem conter segredos.
