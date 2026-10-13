# Arquitetura de deploy — RasComp V1 Beta B

Diagrama lógico de referência (10/10/2026). Não representa infraestrutura já provisionada.

```mermaid
flowchart TD
 U[Usuários] --> CF[Cloudflare DNS HTTPS]
 CF --> FE[Landing e Gestão Portal]
 CF --> API[Docker: Spring Boot Java 21]
 FE --> API
 API --> DB[(MySQL persistente)]
 API --> R2[(R2: uploads)]
 API --> EM[E-mail transacional]
```

Docker encapsula a API Java. Cloudflare fornece acesso e roteamento; o Docker poderá ser executado em hospedagem compatível escolhida após avaliação. MySQL exige banco persistente separado por ambiente, backup e restore. R2 guarda comprovantes e mídia. Frontends estáticos não precisam de Docker.

## Sequência MySQL

1. Escolher provedor e região.
2. Provisionar bancos separados para homologação e produção.
3. Configurar usuário restrito, rede e TLS, com segredos externos ao código.
4. Habilitar backups e testar restauração.
5. Executar migrations Flyway primeiro em homologação.
6. Conectar a API Docker e validar persistência, saúde, logs e migração.

## Contingência

```mermaid
flowchart TD
 U[Usuários locais ou remotos] --> T[LAN ou Cloudflare Tunnel]
 T --> API[Spring Boot local ou Docker]
 API --> DB[(MySQL local)]
 API --> ST[(Storage local)]
```

Durante contingência, somente um ambiente será fonte de verdade para escrita. A volta à cloud exige restauração e reconciliação controladas.
