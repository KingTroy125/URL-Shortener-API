# 02_System_Architecture

## Architecture style

This project follows a clean, layered structure optimized for maintainability:

- **Routes** define public HTTP endpoints.
- **Controllers** translate HTTP concerns into application commands.
- **Services** hold business logic.
- **Prisma ORM** abstracts database queries.

### Diagram placeholders

> **[Diagram]** Request flow sequence diagram
> 

> **[Diagram]** Component diagram (routes/controllers/services/db)
> 

## Layers and responsibilities

### 1) Client / API testing layer

- Consumers (frontend, mobile, scripts) and tools (Postman).
- Responsibility: send HTTP requests, receive responses, follow redirects.

### 2) Express backend layer

- Express app + middleware pipeline.
- Responsibility: routing, validation middleware, error handling, request context.

### 3) Controllers

- Responsibility: map input (req) to service calls; set correct status codes and response shapes.
- No database queries directly.

### 4) Services

- Responsibility: core business logic (generate codes, collision checks, expiration policy).
- Should be unit-testable without HTTP.

### 5) Prisma ORM

- Responsibility: safe, structured database operations.
- Helps enforce unique constraints and consistent reads/writes.

### 6) MongoDB

- Responsibility: persistence for URL mappings + expiration timestamps.

### 7) Hosting layer

- Vercel for deploying the API.
- MongoDB Atlas for managed MongoDB.

## Request flow

```mermaid
flowchart LR
Postman([Postman]) --> express[Express Route]
express --> service[Service Layer]
service --> prisma[Prisma ORM]
prisma --> db[(MongoDB)]
db --> api([API Response])
```

### Notes

- Each layer has a single responsibility, which improves readability and makes failures easier to isolate.
- This flow supports strong testing: services can be tested independently; routes can be tested end-to-end.