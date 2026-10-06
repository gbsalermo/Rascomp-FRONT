# V1-BETA B — Bloco 1 — Identidade e recuperação de acesso

Status em 06/10/2026: **implementado; validação manual 12/15 concluída**.

Branch cross-repo:

```text
v1-beta-b-identidade-cloud
```

Não fazer merge em `main` antes da validação manual.

## Escopo fechado

Fluxo público:

```text
cadastro
→ conta PARTICIPANTE criada sem sessão
→ e-mail ainda não verificado
→ link de confirmação de uso único
→ confirmação
→ login liberado
```

Recuperação:

```text
esqueci minha senha
→ resposta genérica
→ link de recuperação de uso único
→ nova senha
→ sessionVersion++
→ JWTs anteriores deixam de ser aceitos
```

Decisões:

- não coletar CPF/documento para criar identidade;
- `ativo` continua sendo estado administrativo e não representa verificação de e-mail;
- contas preexistentes são migradas como verificadas para preservar operação e testdata;
- novas contas públicas `PARTICIPANTE` nascem não verificadas;
- contas internas provisionadas pelo DEV nascem verificadas;
- tokens brutos não são persistidos; somente SHA-256;
- verificação expira por padrão em 24 h;
- recuperação expira por padrão em 30 min;
- novo token invalida token anterior do mesmo tipo;
- cooldown padrão de reenvio: 60 s;
- recuperação não informa se o e-mail existe;
- alteração administrativa do e-mail de PARTICIPANTE remove a verificação e invalida a sessão;
- modo local usa `EMAIL_PROVIDER=log`;
- provider preparado para produção: `resend`.

## Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/email-verification/resend
POST /api/v1/auth/email-verification/confirm
POST /api/v1/auth/login
POST /api/v1/auth/password/forgot
POST /api/v1/auth/password/reset
```

## Validação local de amanhã

Configuração mínima do backend:

```text
EMAIL_PROVIDER=log
IDENTITY_FRONTEND_BASE_URL=http://localhost:5173
JWT_SECRET=<chave local com 32+ bytes>
```

Com `EMAIL_PROVIDER=log`, o conteúdo do e-mail e o link aparecem no console do backend. Isso permite validar o fluxo inteiro antes de configurar domínio/API do provedor real.

Bateria manual — checkpoint 06/10/2026:

1. ✅ criar uma conta nova de participante;
2. ✅ confirmar que o cadastro termina na tela de verificação e não cria sessão;
3. ✅ tentar login antes da confirmação e verificar bloqueio;
4. ✅ copiar do console o link `/verificar-email?token=...`;
5. ✅ abrir o link e confirmar o e-mail;
6. ✅ entrar normalmente com a conta;
7. ✅ tentar reutilizar o mesmo link e confirmar rejeição;
8. ✅ solicitar recuperação de senha;
9. ✅ confirmar que a tela usa resposta genérica;
10. ✅ copiar do console o link `/redefinir-senha?token=...`;
11. ✅ definir nova senha e entrar com ela;
12. ✅ confirmar que o link de reset não pode ser reutilizado;
13. ⏳ confirmar que a senha antiga deixou de funcionar;
14. ⏳ confirmar que sessões/JWT anteriores ao reset deixam de autenticar;
15. ⏳ solicitar dois links do mesmo tipo respeitando o cooldown e confirmar que somente o mais novo permanece válido.

## Fora deste bloco

Ainda não implementado neste checkpoint:

- Cloudflare Tunnel;
- Cloudflare Access;
- staging cloud;
- produção;
- Turnstile;
- rate limiting/WAF específico da autenticação;
- abertura de inscrições reais.

Depois da aprovação manual deste bloco, o próximo passo é **homologação remota**: publicar a instalação local por Cloudflare Tunnel, protegida por Cloudflare Access, sem transformar o ambiente em produção.
