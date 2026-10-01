# Contrato da API · TuiaJoiasApi

Resumo do que este frontend usa do backend NestJS (`../TuiaJoiasApi`). A referência
completa, com exemplos, fica em `../TuiaJoiasApi/docs/API.md`. Os tipos equivalentes
estão em [`types/`](../types).

## Convenções

- IDs são inteiros. Datas são strings ISO 8601.
- Rotas `/admin/*` e `GET /auth/me` exigem `Authorization: Bearer <JWT>`. Sem token, ou
  com token inválido, a resposta é `401`. O painel então limpa o cookie e volta ao login.
- As fotos vão **do navegador direto para o Supabase Storage**, com uma URL assinada
  gerada pela API. Elas não passam pela API nem por rotas do Next, então o limite de
  4,5 MB por requisição da Vercel não se aplica.
- Formato de erro, com mensagens já em português:

  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Dados inválidos.",
    "details": ["Informe o título."],
    "path": "/admin/works",
    "timestamp": "2026-10-01T12:00:00.000Z"
  }
  ```

  `details` só vem em erros de validação. `services/api.ts` converte isso em `ApiError`
  e `lib/errors.ts` gera o texto da interface.

## Tipos

```ts
Category = { id, name, slug }
PublicWork = {
  id, title, description /* string | null */, imageUrl,
  width, height, isFavorite, position,
  category: { id, name, slug }, createdAt
}
Work (painel) = PublicWork & { categoryId, isPublished, updatedAt }
// storagePath é interno do backend e não vem para o front.
```

## Autenticação

| Método | Rota          | Corpo                 | Resposta                                                 |
| ------ | ------------- | --------------------- | -------------------------------------------------------- |
| POST   | `/auth/login` | `{ email, password }` | `{ accessToken, tokenType, expiresIn, expiresAt, user }` |
| GET    | `/auth/me`    | —                     | `{ id, name, email }`                                    |

- Credenciais inválidas retornam `401`.
- Mais de 5 tentativas por minuto retornam `429`.
- O cookie da sessão expira em `expiresAt`.

## Rotas públicas

| Método | Rota                                | Resposta                                                            |
| ------ | ----------------------------------- | ------------------------------------------------------------------- |
| GET    | `/works?category=<slug>&page&limit` | `{ items: PublicWork[], meta: { page, limit, total, totalPages } }` |
| GET    | `/works/:id`                        | `PublicWork` (só se publicado; senão `404`)                         |
| GET    | `/categories`                       | `Category[]` (na ordem de criação)                                  |

- `GET /works` retorna só os trabalhos publicados, ordenados por `position ASC` (a
  ordem do drag and drop).
- `limit` vai até 100. O site pede `limit=100` e filtra no navegador.

## Rotas administrativas (JWT)

| Método | Rota                        | Corpo                                                                         | Resposta                      |
| ------ | --------------------------- | ----------------------------------------------------------------------------- | ----------------------------- |
| GET    | `/admin/works`              | —                                                                             | `Work[]` (todos, por posição) |
| GET    | `/admin/works/stats`        | —                                                                             | `{ total, favorites, hidden, published, maxWorks, remaining, upload: { maxFileSizeMb, acceptedMimeTypes } }` |
| POST   | `/admin/works/uploads`      | `{ contentType, size, purpose: "create" \| "replace" }`                       | `201 { uploadPath, uploadUrl, expiresInSeconds }` |
| POST   | `/admin/works`              | `{ uploadPath, title, categoryId, description?, isFavorite? }`                | `201 Work`                    |
| PATCH  | `/admin/works/:id`          | `{ title?, categoryId?, description?, uploadPath? }` (com `uploadPath`, troca a foto) | `Work`                |
| PATCH  | `/admin/works/:id/favorite` | `{ isFavorite: boolean }`                                                     | `Work`                        |
| PATCH  | `/admin/works/:id/publish`  | `{ isPublished: boolean }`                                                    | `Work`                        |
| PATCH  | `/admin/works/reorder`      | `{ items: [{ id, position }] }` com **todos** os trabalhos, posições 1..N     | `Work[]`                      |
| DELETE | `/admin/works/:id`          | —                                                                             | `204`                         |

Detalhes:

- **Upload em 3 etapas** (`services/works.ts`):
  1. `POST /admin/works/uploads` → a API valida formato, tamanho e limite e devolve a
     URL assinada.
  2. `PUT uploadUrl` com o arquivo e o `Content-Type` (`services/upload.ts`, com
     progresso). Sem token: a permissão já vem na URL.
  3. `POST /admin/works` (ou `PATCH`) com o `uploadPath`. A API confere o conteúdo
     real, gera o WebP e apaga o original.
- **Limite:** ao atingir `MAX_WORKS`, o upload retorna `400` ("Limite de 15 trabalhos
  atingido…"). O painel lê `remaining` de `stats` para bloquear antes.
- **Novos trabalhos:** entram no fim da ordem. Ao excluir, as posições seguintes sobem
  uma casa.
- **Reorder com filtro ativo:** o painel move o item dentro da lista completa e envia a
  lista completa. Uma lista parcial retorna `400`.
- **Descrição:** string vazia ou `null` apaga a descrição.
