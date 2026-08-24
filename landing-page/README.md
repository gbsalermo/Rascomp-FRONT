# Landing Page — RASCOMP

Aplicação pública do RASCOMP.

A Landing será ao mesmo tempo:

1. presença institucional da RAS/UFRB e do RASCOMP;
2. interface pública para acompanhar a competição.

Ela não terá dependência direta do frontend de Gestão.

```text
Gestão -> Backend -> /api/v1/public/** -> Landing
```

O backend permanece como única fonte de verdade.

---

## Escopo institucional

- Hero/apresentação;
- RAS UFRB;
- sobre o RASCOMP;
- modalidades;
- eventos;
- cronograma;
- organização/diretoria;
- contato;
- chamada para inscrições.

---

## Escopo competitivo público

Conforme suporte real dos DTOs públicos:

- competição atual e status;
- categorias/modalidades;
- equipes;
- robôs;
- competidores quando permitidos pelo contrato público;
- ranking de Follow Line;
- melhores tempos;
- chaveamento do Sumô;
- partidas;
- estado das partidas;
- resultados/vencedores;
- progressão da chave;
- campeão;
- resultados históricos.

A Landing não calcula oficialmente ranking, vencedor ou progressão. Ela representa o estado fornecido pelo backend.

---

## Atualização durante a competição

No MVP, áreas públicas ao vivo podem usar polling controlado enquanto a competição estiver em andamento.

SSE/WebSocket só serão avaliados se houver necessidade real depois.

Não inferir uma única "partida atual" se o contrato do backend não fornecer um estado inequívoco para isso.

---

## Fotos

O backend atual possui suporte a fotos de robôs.

Uma funcionalidade de:

```text
fotos do dia
galeria do evento
momentos da rodada
```

ainda dependerá de um módulo específico de mídia/galeria no backend.

Não simular essa funcionalidade com arquivos estáticos como se fosse conteúdo operacional persistido.

---

## Identidade visual

A Landing será iniciada depois dos primeiros fluxos da Gestão.

A intenção é reaproveitar conceitualmente:

- logo;
- paleta;
- tipografia;
- espaçamentos;
- bordas;
- badges de status;
- linguagem de feedback.

Isso mantém os dois frontends com aparência de um único produto sem acoplá-los tecnicamente.

---

## Próxima etapa da Landing

A Landing está temporariamente em espera.

Antes da sua fundação técnica será feito um **System Design público**, mapeando os contratos `/api/v1/public/**` e as experiências de acompanhamento da competição.

O desenvolvimento atual começa por:

```text
GESTÃO 0 — Fundação técnica
```

conforme `docs/CONTINUIDADE_FRONTEND.md`.
