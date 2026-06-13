# 07_Project_Structure

## Recommended backend structure

```
src/
├ routes/
├ controllers/
├ services/
├ middleware/
├ prisma/
├ tests/
├ config/
└ server.js
```

## Folder responsibilities

- `src/routes/`
    - Express route definitions (e.g., `/shorten`, `/:shortCode`).
    - Maps URLs + methods to controller functions.
- `src/controllers/`
    - Request handlers that validate input (or delegate validation) and call services.
    - Responsible for HTTP responses (status code + JSON shape).
- `src/services/`
    - Business logic: generating short codes, collision retries, computing expirations.
    - Should be written to be easy to unit test.
- `src/middleware/`
    - Cross-cutting concerns: request logging, error handler, validation middleware.
- `src/prisma/`
    - Prisma client initialization and Prisma schema (depending on setup).
    - Central place for DB access patterns.
- `src/tests/`
    - Jest + Supertest tests: route/integration tests and service unit tests.
- `src/config/`
    - Environment loading, constants, app configuration objects.
- `src/server.js`
    - Express app initialization: middleware wiring + route registration.