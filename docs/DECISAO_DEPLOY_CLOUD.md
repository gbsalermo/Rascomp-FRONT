# RasComp — Decisão Congelada de Deploy em Nuvem

Data da decisão: **26/08/2026**  
Meta de resolução inicial: **até domingo, 30/08/2026**.

Este documento congela a arquitetura escolhida para o primeiro deploy do RasComp. O objetivo é impedir que a implantação em nuvem force uma reescrita do backend ou quebre o funcionamento local já validado.

Documento operacional detalhado:

```text
docs/DEPLOY_CLOUDFLARE.md
```

---

## 1. Regra principal

O RasComp continuará possuindo dois modos independentes:

```text
LOCAL
├─ Spring Boot local
├─ MySQL local
├─ Vite local
└─ uploads locais

CLOUD
├─ Cloudflare
├─ backend containerizado
├─ MySQL persistente externo
└─ R2 para arquivos persistentes
```

**O modo cloud não substitui nem remove o modo local.**

---

## 2. Arquitetura congelada para o primeiro deploy

```text
                         INTERNET
                            │
                            ▼
                       CLOUDFLARE
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             LANDING      GESTÃO       API
               Vue          Vue          │
                                        ▼
                                 Spring Boot
                                    Docker
                              Cloudflare Container
                                  ┌─────┴─────┐
                                  │           │
                                  ▼           ▼
                         Aiven MySQL Free     R2
                            persistente    arquivos
```

### Cloudflare ficará responsável por

```text
DNS
TLS/HTTPS
Landing
Gestão/Participante
Backend Spring Boot containerizado
R2
mídias/fotos
```

### Aiven ficará responsável por

```text
MySQL persistente
```

---

## 3. Banco de dados — decisão congelada

Para o primeiro deploy:

```text
BANCO = MySQL
PROVEDOR INICIAL = Aiven MySQL Free
```

Motivo:

- preserva o banco atual;
- preserva JDBC;
- preserva JPA/Hibernate;
- preserva Flyway;
- preserva as migrations MySQL atuais;
- evita refatoração para D1/SQLite;
- permite continuar desenvolvendo e testando localmente com MySQL normal.

Não colocar o MySQL dentro do Cloudflare Container.

```text
Spring Boot Container
        │
        │ JDBC + TLS
        ▼
Aiven MySQL
```

Se o container reiniciar, for recriado ou atualizado, os dados continuam no serviço MySQL.

---

## 4. Arquivos — decisão congelada

No cloud:

```text
fotos de robôs
mídias do CMS
galeria
imagens públicas persistentes
→ Cloudflare R2
```

Não depender do filesystem do Container para persistência.

Localmente permanece permitido:

```text
./uploads/robots
```

A implementação futura deve escolher storage por configuração/profile, e não remover o storage local.

---

## 5. Backend — decisão congelada

O backend continua:

```text
Java 21
Spring Boot
JPA/Hibernate
Flyway
MySQL
JWT
```

Para cloud:

```text
Spring Boot
→ Docker image
→ Cloudflare Container
```

Não reescrever a API para JavaScript/Workers apenas para realizar o primeiro deploy.

---

## 6. Frontend — decisão congelada

```text
landing-page/
→ deploy Cloudflare

gestao/
→ deploy Cloudflare
```

O frontend cloud aponta para a API cloud através de `VITE_API_URL`.

O frontend local continua apontando para:

```text
http://localhost:8080
```

---

## 7. Segurança e segredos

Nunca versionar:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

Produção deve usar secrets/configuração de ambiente.

O usuário MySQL de produção deve ser próprio do RasComp e não `root`.

---

## 8. O que NÃO será feito nesta primeira implantação

```text
migrar MySQL para D1
migrar para PostgreSQL sem necessidade
transformar o projeto em multi-tenant
colocar MySQL dentro do Docker
usar filesystem do Container como storage persistente
remover o modo local
reescrever Spring Boot para Workers
```

Esses pontos só podem ser reavaliados como projetos separados após a primeira implantação estável.

---

## 9. Meta até 30/08/2026

Até domingo, a meta desta frente é chegar pelo menos ao seguinte estado:

```text
[ ] conta Cloudflare criada/configurada
[ ] conta/projeto Aiven criado
[ ] MySQL Free criado e acessível
[ ] conexão JDBC/TLS validada
[ ] banco RasComp criado
[ ] Flyway validado no MySQL cloud
[ ] backend preparado/testado em Docker
[ ] estratégia R2 validada
[ ] gestão preparada para URL da API cloud
[ ] Landing preparada para cloud
[ ] primeiro smoke deploy realizado ou bloqueios documentados
[ ] modo local continua funcionando
```

Se alguma limitação de plano gratuito ou mudança de produto impedir um item, registrar o bloqueio antes de trocar a arquitetura.

---

## 10. Ordem de trabalho quando retomarmos

```text
1. criar Aiven MySQL Free
2. testar conexão pelo MySQL/JDBC local
3. apontar uma execução local do Spring para o Aiven
4. confirmar Flyway + login + CRUD básico
5. preparar Dockerfile
6. testar Docker local usando o Aiven
7. criar/configurar R2
8. adaptar storage cloud mantendo local
9. publicar backend Cloudflare
10. publicar gestão
11. publicar Landing
12. configurar DNS/domínios
13. smoke test completo
```

A cada passo, se algo falhar, corrigir antes de avançar.

---

## 11. Regra para alteração desta decisão

Esta arquitetura está **congelada para o primeiro deploy**.

Só alterar se surgir um bloqueio técnico ou financeiro objetivo. Preferência não é motivo suficiente para trocar banco/runtime durante a implantação.

Qualquer mudança deve registrar:

```text
problema encontrado
alternativas avaliadas
impacto no backend atual
impacto no modo local
custo
nova decisão
```
