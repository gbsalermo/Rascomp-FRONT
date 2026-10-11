# V1-BETA B — Bloco 2 — Homologação remota

Status em 06/10/2026: **🚧 EM IMPLEMENTAÇÃO**.

Branch:

```text
v1-beta-b-identidade-cloud
```

## Objetivo

Permitir acesso externo ao RasComp executado no computador local sem abrir portas no roteador e sem expor diretamente Spring Boot ou MySQL.

Arquitetura do Bloco 2:

```text
Internet
→ Cloudflare
→ autenticação da homologação
→ Tunnel
→ 127.0.0.1:4173  (build/preview do Gestão/Participante)
   └─ /api
      → proxy local
      → 127.0.0.1:8080  (Spring Boot)
         └─ 127.0.0.1:3306 / MySQL local
```

O navegador externo enxerga **uma única origem HTTPS**. O banco nunca é publicado e a porta 8080 não precisa ser exposta à internet.

O modo local continua funcionando separadamente:

```text
localhost/LAN
→ Vite local
→ Spring Boot local
→ MySQL local
```

## Fase 2A — homologação imediata por Quick Tunnel

Esta é a primeira validação do bloco.

Pré-requisitos no computador:

- backend rodando em `127.0.0.1:8080`;
- Node/npm instalados;
- `cloudflared` atualizado;
- pelo menos um e-mail autorizado.

No Git Bash, a partir da raiz do frontend:

```bash
./scripts/homologacao-quick-tunnel.sh SEU_EMAIL
```

Para dois ou mais testadores:

```bash
./scripts/homologacao-quick-tunnel.sh EMAIL_1 EMAIL_2
```

O script:

1. verifica se backend, npm, curl e cloudflared estão disponíveis;
2. força `VITE_API_URL` vazio no build para usar `/api` same-origin, ignorando configuração local que aponte para `localhost:8080`;
3. executa o build do `gestao/` e inicia `vite preview` somente em `127.0.0.1:4173`;
4. mantém o proxy `/api → 127.0.0.1:8080`;
5. abre um Quick Tunnel;
6. troca o Host enviado ao Vite por `localhost`, evitando liberar hosts arbitrários;
7. restringe o acesso aos e-mails informados;
8. encerra o preview quando o Tunnel for encerrado.

Não versionar URL de Quick Tunnel. Ela é temporária e muda a cada execução.

### Verificação inicial

Em outro dispositivo/rede:

```text
abrir URL https://<aleatorio>.trycloudflare.com
→ informar e-mail autorizado
→ receber OTP
→ autenticar
→ abrir login RasComp
→ login
→ navegar em página autenticada
→ chamada /api funciona pela mesma URL
```

Também testar um e-mail não autorizado.

### Links de identidade durante Quick Tunnel

Como a URL do Quick Tunnel só é conhecida depois que ele inicia, o backend que estiver com:

```text
IDENTITY_FRONTEND_BASE_URL=http://localhost:5173
```

continuará gerando links locais.

Para testar cadastro/recuperação remotamente neste modo temporário, reiniciar o backend com:

```text
IDENTITY_FRONTEND_BASE_URL=https://<url-atual-do-quick-tunnel>
```

Esse ajuste é apenas por variável de ambiente. Não alterar código nem versionar a URL.

## Fase 2B — hostname estável + Cloudflare Access

Depois de validar 2A, criar a homologação estável:

```text
https://homolog.<dominio>
→ Cloudflare Access
→ Cloudflare Tunnel
→ http://localhost:4173
```

Nome recomendado do Tunnel:

```text
rascomp-homolog-local
```

Configuração do serviço publicado:

```text
Service URL: http://localhost:4173
HTTP Host Header: localhost
```

A aplicação Access deve proteger o hostname inteiro, inclusive `/api`.

Política inicial:

```text
ALLOW
→ somente e-mails explicitamente autorizados
→ autenticação por One-time PIN ou IdP escolhido
```

Quando o hostname estável existir, usar no backend:

```text
IDENTITY_FRONTEND_BASE_URL=https://homolog.<dominio>
```

Não criar hostname público separado para MySQL. Nesta homologação também não é necessário expor a API em outro subdomínio.

## Critérios de validação do Bloco 2

```text
[ ] acesso externo por rede diferente da máquina host
[ ] e-mail autorizado entra
[ ] e-mail não autorizado não entra
[ ] login RasComp funciona
[ ] /api funciona pela mesma origem
[ ] página autenticada recarrega sem perder rota
[ ] cadastro/verificação funciona com URL externa
[ ] recuperação de senha gera URL externa
[ ] localhost continua funcionando
[ ] acesso LAN continua disponível no modo dev normal
[ ] 8080 não foi publicado diretamente
[ ] 3306 não foi publicado
[ ] desligar Tunnel remove o acesso externo
[ ] desligar PC/backend/preview torna homologação indisponível sem afetar dados
```

## Limites e papel deste ambiente

Homologação remota não é produção.

Quick Tunnel é apenas o caminho imediato de QA. O hostname é efêmero e o ambiente depende do computador local ligado.

O Tunnel estável + Access continua sendo homologação, também dependente da máquina local. Staging cloud persistente e produção serão tratados nos blocos seguintes.

## Segurança operacional

- não compartilhar token de Tunnel no Git;
- não commitar credenciais Cloudflare;
- não publicar MySQL;
- não fazer port-forward de 3306/8080 no roteador;
- não usar `server.allowedHosts=true` no Vite;
- manter e-mails de Access restritos;
- encerrar Tunnel quando não estiver em uso;
- Quick Tunnel não deve receber dados reais de competição.

## Checkpoint

Bloco 1:

```text
identidade/e-mail/recuperação → ✅ 15/15 validado
```

Bloco 2:

```text
2A Quick Tunnel protegido → preparado / aguardando validação externa
2B Tunnel estável + Access → aguardando configuração da conta/domínio Cloudflare
```


## Dois frontends na homologação

O RasComp possui duas aplicações frontend independentes e elas permanecem separadas:

```text
Landing pública
→ landing-page/

Gestão + Portal do Participante
→ gestao/
```

No Quick Tunnel inicial, primeiro validamos `gestao/` isoladamente.

Na homologação estável, a topologia prevista é:

```text
homolog.<dominio>
→ Landing
→ proxy /api → Spring Boot local

app-homolog.<dominio>
→ Gestão/Participante
→ proxy /api → Spring Boot local
```

A Landing recebe:

```text
VITE_GESTAO_URL=https://app-homolog.<dominio>
```

Assim o CTA **Inscrever-se** leva ao segundo frontend sem hardcode.

Em produção, a separação continua:

```text
site público → Landing
aplicação autenticada → Gestão/Participante
API → backend
```

Cloudflare Access protege apenas os ambientes de homologação. O site público real não deve exigir Access.


## Landing pública via Quick Tunnel

Como a Landing é pública por definição, ela pode ser validada externamente sem Cloudflare Access.

Script:

```bash
./scripts/homologacao-landing-quick-tunnel.sh
```

Fluxo:

```text
Internet
→ Quick Tunnel público
→ Landing em 127.0.0.1:4174
→ somente /api/v1/public/**
→ proxy local
→ Spring Boot 127.0.0.1:8080
```

O proxy da Landing expõe apenas a API pública do backend. Login, endpoints administrativos e MySQL não são publicados por esse caminho.

Opcionalmente, se existir uma URL externa válida do Gestão/Participante, ela pode ser passada como primeiro argumento:

```bash
./scripts/homologacao-landing-quick-tunnel.sh https://app-exemplo
```

Sem argumento, o build de homologação não aponta o CTA para localhost.

Essa configuração é adequada para validar externamente a Landing sem antecipar a configuração definitiva de domínio, Access ou produção.


## Checkpoint 06/10/2026 — Landing remota validada

A Landing pública foi executada externamente com sucesso por Quick Tunnel:

```text
Internet
→ Quick Tunnel público
→ Landing preview local
→ /api/v1/public/**
→ Spring Boot local
```

Status:

```text
Landing externa                 ✅ VALIDADA
API pública via Tunnel          ✅ VALIDADA
Gestão/Portal local             ✅ VALIDADO
Gestão/Portal Quick + Access    ⚠️ POST /auth/login recebe 401 na camada protegida
```

Esse achado não bloqueia a infraestrutura definitiva. A partir deste checkpoint, o foco muda para a base de deploy na conta Cloudflare temporária.
