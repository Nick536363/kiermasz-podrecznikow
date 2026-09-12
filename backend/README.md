# LISTING CRUD BACKEND

This is the backend of listing-manager app. It exposes API routes to the frontend part of this app. Backend uses `Fastify` as a web framework (server) and `Prisma ORM` as a ORM (database).

## API Version and information

You can get the current API version and status in `/` route.

Response should look something like this:

```JSON
{
    "name": "listing-manager-api",
    "status": "ok",
    "version": "1.0.0"
}
```

## Routes

Routes without prefix

| Route                  | Description     |
| ---------------------- | --------------- |
| `/`                    | API information |
| `/api/v<API VERSION>/` | Prefix route    |

---

Routes with prefix: `/api/v<API VERSION>/`

| Route     | Description                     |
| --------- | ------------------------------- |
| `/users/` | Prefix route to `users` service |
| `/auth/`  | Authentication route prefix     |
