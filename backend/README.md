# LISTING-MANAGER-API 1.0.0

This is the backend of listing-manager app. It exposes API routes to the frontend part of this app. Backend uses `Fastify` as a web framework (server), `Prisma ORM` as a ORM (database connection) and `PostgresDB` as a database.

## .ENV

This file should look something like this:

```.env
DATABASE_URL="<URL_TO_POSTGRES>"

ROOT_PASSWORD="<PASSWORD_TO_ROOT_USER>"

JWT_SECRET="<JSON_WEB_TOKEN_SECRET>"
JWT_REFRESH_SECRET="<JSON_WEB_TOKEN_REFRESH_SECRET>"
```

`ROOT_PASSWORD` is the password to the root user in this API. User name: `root` and password: `<ROOT_PASSWORD>`, are used to login into the application dashboard/get bearer token.

`JWT_SECRET` is a strong, random 256 bit/32 bytes secret. I used 64 bytes in my dev server.
`JWT_REFRESH_SECRET` is another strong, random 256 bit/32 bytes secret, just as `JWT_SECRET`, but cannot be the same as it.

## Authentication

All routes under `api/v1/` except `auth/login` and `auth/refresh` require a bearer token in the request header:

```
Authorization: Bearer <accessToken>
```

Missing or invalid tokens return `401 Unauthorized`. Insufficient permissions (e.g. non-admin hitting an admin-only route) return `403 Forbidden`.

| Token          | Lifetime | Obtained via                                  |
| -------------- | -------- | --------------------------------------------- |
| `accessToken`  | 15 min   | `POST /auth/login`, `POST /auth/refresh`      |
| `refreshToken` | 7 days   | `POST /auth/login` (set as `httpOnly` cookie) |

All request/response bodies use `Content-Type: application/json`.

## Routes

```
└── / (GET, HEAD)
    ├── health (GET, HEAD)   ---------------------- ->  API HEALTH
    ├── ready (GET, HEAD)    ---------------------- ->  API STATUS
    ├── _debug/routes (GET, HEAD)    -------- DEBUG ->  PRINTS ROUTES
    └── api/v1/     ------------------------------- ->  API ROUTE
        ├── auth/
        │   ├── log
        │   │   ├── in (POST)   ------------------- ->  USER LOGIN
        │   │   └── out (POST)   ------------------ ->  USER LOGOUT
        │   └── refresh (POST)   ------------------ ->  REFRESH TOKEN
        └── users (POST, GET, HEAD)
        │   └── / (POST, GET, HEAD)
        │       ├── me (GET, HEAD, PATCH)   ------- ->  ME UPDATES/INFO
        │       └── :id (GET, HEAD, PATCH, DELETE)  ->  USER CRUD (:id)
        └── listings (POST, GET, HEAD)
            └── / (POST, GET, HEAD)
                ├── me (GET, HEAD)   -------------- ->  ME LISTINGS
                └── :id (GET, HEAD, PATCH, DELETE)  ->  LISTINGS CRUD (:id)
```

## API Responses

This is the list of routes accesible from the API.

> ![WARNING]
> Only admins can operate on users (`POST`, `GET`, `PATCH`, `DELETE`), but users can only `GET` or `PATCH` only their user account.

### Auth Login

`POST /api/v1/auth/login`

Body:

```JSON
{
    "name": "root",
    "password": "286efc6d7df6892a0e6"
}
```

Response:

```JSON
{
    "accessToken": "eyJhbGci..."
}
```

Sets `refreshToken` as an `httpOnly` cookie.

Errors: `401` — invalid name/password.

### Auth Logout

`POST /api/v1/auth/logout`

Clears the `refreshToken` cookie and invalidates it server-side.

Response: `204`

### Auth Refresh

`POST /api/v1/auth/refresh`

Reads `refreshToken` from the `httpOnly` cookie (no body required).

Response:

```JSON
{
    "accessToken": "eyJhbGci..."
}
```

Errors: `401` — missing, expired, or revoked refresh token.

---

### Get Users (as an user)

`GET /api/v1/users/me`

Response:

```JSON
{
    "id": 1,
    "name": "root",
    "role": "ADMIN",
    "createdAt": "2026-09-12T21:33:29.004Z"
}
```

---

### Post Users

When creating users it's good to keep in mind that `name` field has to be unique.

`POST /api/v1/users/`

Body:

```JSON
{
    "name": "aleksander",
    "password": "epicultrastronkpassword1234",
    "role": "USER"
}
```

Response:

```JSON
{
    "id": 2,
    "name": "aleksander",
    "role": "USER",
    "createdAt": "2026-09-12T23:26:50.482Z"
}
```

Errors: `409` — name already taken. `400` — validation error (e.g. password too short).

### Get Users

`GET /api/v1/users/`

Query params: `?page=<int, default 1>&limit=<int, default 20, max 100>`

Response:

```JSON
{
    "users": [
        {
            "id": 1,
            "name": "root"
        }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
}
```

`GET /api/v1/users/:id` (id = 1)

Response:

```JSON
{
    "id": 1,
    "name": "root",
    "role": "ADMIN",
    "createdAt": "2026-09-12T21:33:29.004Z"
}
```

Errors: `404` — user not found.

### Patch Users

`name` and `password` are optional fields.

`PATCH /api/v1/users/:id` (id = 2)

Body:

```JSON
{
    "name": "aleks",
    "password": "secondbestpasswordonearth1337"
}
```

Response:

```JSON
{
    "id": 2,
    "name": "aleks",
    "role": "USER",
    "createdAt": "2026-09-12T23:26:50.482Z"
}
```

Errors: `404` — user not found. `409` — name already taken. `403` — non-admin editing another user.

### Delete Users

`DELETE /api/v1/users/:id` (id = 2)

Response: `204`

Errors: `404` — user not found.

---

### Get Listings

`GET /api/v1/listings/`

Query params: `?page=<int, default 1>&limit=<int, default 20, max 100>`

Response:

```JSON
{
    "listings": [
        {
            "id": 1,
            "name": "hello",
            "description": "world"
        }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
}
```

---

`GET /api/v1/listings/me/`

Response:

```JSON
{
    "listings": [
        {
            "id": 1,
            "name": "hello",
            "description": "world"
        }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
}
```

---

`GET /api/v1/listings/:id` (id = 1)

Response:

```JSON
{
    "id": 1,
    "name": "hello",
    "description": "world",
    "seller": "yes",
    "createdAt": "2026-09-12T21:33:44.091Z",
    "updatedAt": "2026-09-12T21:33:43.995Z",
    "authorId": 1
}
```

Errors: `404` — listing not found.

### Post Listings

`POST /api/v1/listings`

Body:

```JSON
{
    "name": "Linux Debian (unpacked)",
    "description": "Brand new installation disc for Linux Debian (14)",
    "seller": "Wiktor"
}
```

Response:

```JSON
{
    "id": 2,
    "name": "Linux Debian (unpacked)",
    "description": "Brand new installation disc for Linux Debian (14)",
    "seller": "Wiktor",
    "createdAt": "2026-09-12T23:55:32.902Z",
    "updatedAt": "2026-09-12T23:55:32.888Z",
    "authorId": 1
}
```

Errors: `400` — validation error (missing required field).

### Patch Listings

`name`, `description` and `seller` fields are optional.

`PATCH /api/v1/listings/:id` (id = 2)

Body:

```JSON
{
    "name": "Linux Debian (almost brand new)",
    "description": "Brand new installation disc for Linux Debian (13)",
    "seller": "Victor (debian lover)"
}
```

Response:

```JSON
{
    "id": 2,
    "name": "Linux Debian (almost brand new)",
    "description": "Brand new installation disc for Linux Debian (13)",
    "seller": "Victor (debian lover)",
    "createdAt": "2026-09-12T23:55:32.902Z",
    "updatedAt": "2026-09-12T23:55:32.888Z",
    "authorId": 1
}
```

Errors: `404` — listing not found. `403` — editing a listing you don't own (non-admin).

### Delete Listings

`DELETE /api/v1/listings/:id` (id = 2)

Response: `204`

Errors: `404` — listing not found. `403` — deleting a listing you don't own (non-admin).

---

### API Version and information

You can get the current API version and status in `/` route.

`GET /`

Response:

```JSON
{
    "name": "listing-manager-api",
    "version": "1.0.0"
}
```

---

Another route that you can use to check the API status is `/ready` route.

`GET /ready`

Response:

```JSON
{
    "status": "ready"
}
```

---

There is also a route to check the API's health (in this moment connection to the databse), route: `/health`.

`GET /health`

Response:

```JSON
{
    "status": "ok",
    "db": "connected"
}
```

If the database is unreachable:

```JSON
{
    "status": "error",
    "db": "disconnected"
}
```

### API Debug routes

There is currently one debug route and it shows all routes in the API.

`GET /_debug/routes/`

Response:

```
└── / (GET, HEAD)
    ├── health (GET, HEAD)
    ├── ready (GET, HEAD)
    ├── _debug/routes (GET, HEAD)
    └── api/v1/
        ├── auth/
        │   ├── log
        │   │   ├── in (POST)
        │   │   └── out (POST)
        │   └── refresh (POST)
        ├── users (POST, GET, HEAD)
        │   └── / (POST, GET, HEAD)
        │       ├── me (GET, HEAD, PATCH)
        │       └── :id (GET, HEAD, PATCH, DELETE)
        └── listings (POST, GET, HEAD)
            └── / (POST, GET, HEAD)
                ├── me (GET, HEAD)
                └── :id (GET, HEAD, PATCH, DELETE)
```

## Error Response Format

All error responses share a common shape:

```JSON
{
    "error": "Unauthorized",
    "message": "Invalid or expired access token",
    "statusCode": 401
}
```

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| 400    | Validation error / malformed request body |
| 401    | Missing, invalid, or expired token        |
| 403    | Authenticated but not permitted           |
| 404    | Resource not found                        |
| 409    | Conflict (e.g. duplicate `name`)          |
| 500    | Unexpected server error                   |
