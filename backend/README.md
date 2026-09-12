# LISTING-MANAGER-API 1.0.0

This is the backend of listing-manager app. It exposes API routes to the frontend part of this app. Backend uses `Fastify` as a web framework (server), `Prisma ORM` as a ORM (database connection) and `PostgresDB` as a database.

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
            └── / (POST, GET, HEAD)
                ├── me (GET, HEAD, PATCH)   ------- ->  ME UPDATES/INFO
                └── :id (GET, HEAD, PATCH, DELETE)  ->  USER CRUD (:id)
```

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
