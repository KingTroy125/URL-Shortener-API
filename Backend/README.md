# URL Shortener API — Backend

A production-ready REST API for URL shortening built with **Node.js**, **Express 5**, and **MongoDB** (via Mongoose). Implements a deterministic **Base62 SHA-256** short code generation algorithm with built-in collision resolution, TTL-based URL expiry, and origin-restricted CORS.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [API Reference](#api-reference)
5. [Short Code Generation Algorithm](#short-code-generation-algorithm)
6. [Data Model](#data-model)
7. [Request Lifecycle](#request-lifecycle)
8. [Environment Variables](#environment-variables)
9. [Getting Started](#getting-started)
10. [Scripts](#scripts)
11. [Error Handling](#error-handling)
12. [Security Considerations](#security-considerations)
13. [Known Limitations & Future Work](#known-limitations--future-work)

---

## Architecture Overview

The backend follows a strict **3-layer architecture** (Routes → Controllers → Services), keeping HTTP concerns out of business logic and database logic out of controllers.

```
HTTP Request
    │
    ▼
┌─────────────┐
│   Routes    │  – Declare endpoints, bind to controller handlers
└─────────────┘
       │
       ▼
┌─────────────────┐
│   Controllers   │  – Validate input, handle HTTP req/res, delegate to service
└─────────────────┘
       │
       ▼
┌─────────────┐
│   Services  │  – Business logic: code generation, collision resolution, DB writes
└─────────────┘
       │
       ▼
┌─────────────┐
│   Models    │  – Mongoose schema definitions, database access
└─────────────┘
       │
       ▼
   MongoDB Atlas
```

---

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection via Mongoose
│   ├── controllers/
│   │   └── urlController.js       # HTTP handlers: shortenUrl, redirectUrl
│   ├── models/
│   │   └── ShortUrl.js            # Mongoose schema & model
│   ├── prisma/
│   │   └── prismaClient.js        # Prisma Client with Accelerate extension (future use)
│   ├── routes/
│   │   └── urlRoutes.js           # Express Router: POST /shorten, GET /:shortCode
│   ├── services/
│   │   └── urlService.js          # Business logic: createShortUrl, getOriginalUrl
│   ├── utils/
│   │   ├── generateShortCode.js   # Base62 SHA-256 hash-based code generator
│   │   └── test/                  # Standalone algorithm benchmarks (git-ignored)
│   └── server.js                  # Express app bootstrap, middleware, export
├── .env                           # Environment variables (git-ignored)
├── .gitignore
├── package.json
└── prisma.config.ts
```

---

## Tech Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Runtime | Node.js | ≥ 18 | Native `BigInt`, built-in `crypto`, ES Modules |
| Framework | Express | 5.x | Async error propagation, cleaner middleware |
| Database | MongoDB Atlas | — | Flexible schema, managed cloud hosting |
| ODM | Mongoose | 8.x | Schema validation, model-level uniqueness enforcement |
| Module System | ES Modules (`"type": "module"`) | — | Native `import`/`export`, no transpilation |
| Dev Server | Nodemon | 3.x | Hot reload on source change |
| Hashing | Node `crypto` (built-in) | — | No external dependency, FIPS-compliant SHA-256 |

---

## API Reference

### `POST /shorten`

Shortens a long URL and returns a 6-character Base62 short code.

**Request Body**

```json
{
  "originalUrl": "https://github.com/KingTroy125"
}
```

**Success Response — `201 Created`**

```json
{
  "shortUrl": "http://localhost:5000/ph3lhc"
}
```

**Error Responses**

| Status | Condition | Body |
|---|---|---|
| `400` | `originalUrl` missing from body | `{ "error": "Original URL is required" }` |
| `400` | URL fails regex validation | `{ "error": "Invalid URL format. Please enter a valid http or https URL." }` |
| `200` | Empty body (health check) | `{ "message": "API is running" }` |
| `500` | Unhandled server error | `{ "error": "Internal server error" }` |

**URL Validation Regex**

```
/^(https?:\/\/)[^\s/$.?#].[^\s]*$/i
```

Accepts any well-formed `http://` or `https://` URL. Rejects bare domains, `ftp://`, and whitespace-only strings.

---

### `GET /:shortCode`

Resolves a short code and issues an HTTP redirect to the original URL.

**Parameters**

| Parameter | Type | Description |
|---|---|---|
| `shortCode` | `string` | 6-character Base62 code (e.g., `ph3lhc`) |

**Success Response — `302 Found`**

Redirects the client to the stored `originalUrl`.

**Error Responses**

| Status | Condition | Body |
|---|---|---|
| `404` | Short code not in database | `{ "error": "URL not found" }` |
| `410` | Short code exists but TTL has elapsed | `{ "error": "URL expired" }` |
| `500` | Unhandled server error | `{ "error": "Internal server error" }` |

---

## Short Code Generation Algorithm

Short codes are generated in `src/utils/generateShortCode.js` using a deterministic **Base62-encoded SHA-256 hash** of the input URL.

### Why not `Math.random()`?

The naïve random approach (`Math.random().toString(36).substring(2, 8)`) operates on a **Base36 namespace** of `36⁶ = ~2.18B` values. Benchmarks at 1,000,000 codes show ~230 unresolved collisions with no built-in retry.

### The Algorithm

```
Input: originalUrl (string), attempt (integer, default 0)

1. seed  = url || Math.random().toString(36)
2. input = `${seed}-${attempt}`
3. hash  = SHA-256(input)          → 32-byte Buffer
4. n     = BigInt("0x" + hash.hex) → 256-bit integer
5. base62 = iterative modular reduction of n into Base62 chars
6. return base62[0..5]             → 6-character code
```

### Why BigInt?

SHA-256 produces a 256-bit value. JavaScript `Number` only has 53 bits of integer precision — direct numeric conversion would silently discard entropy. `BigInt` preserves all 256 bits through the modular reduction, ensuring uniform distribution across all 62 characters.

### Collision Resolution

```js
let attempt = 0;
let shortCode;

while (true) {
    shortCode = generateShortCode(originalUrl, attempt);

    const existing = await ShortUrl.findOne({ shortCode });
    if (!existing) break;

    attempt++;
}
```

Because `attempt` is embedded in the hash input, SHA-256's avalanche effect guarantees each retry produces a completely different 256-bit output — not a trivial permutation. Empirical benchmarks show ~12 collisions per 1,000,009 codes, each resolved in a single retry.

### Namespace Comparison

| Algorithm | Namespace | Codes before 50% collision probability |
|---|---|---|
| `Math.random()` Base36, 6 chars | 36⁶ = 2.18B | ~55,000 |
| SHA-256 → Base62, 6 chars | 62⁶ = 56.8B | ~281,000 |

---

## Data Model

**Collection:** `shorturls`

```js
{
  originalUrl: String,   // required — the destination URL
  shortCode:   String,   // required, unique — 6-char Base62 identifier
  expiresAt:   Date,     // required — TTL: createdAt + 10 days
  createdAt:   Date,     // auto (Mongoose timestamps)
  updatedAt:   Date,     // auto (Mongoose timestamps)
}
```

**Index:** `shortCode` carries a `unique: true` constraint at the MongoDB level. This acts as a hard safety net against race conditions in concurrent environments where two requests could pass the application-level uniqueness check simultaneously.

**TTL:** Expiry is enforced at the application layer (not a MongoDB TTL index). The `redirectUrl` controller checks `new Date() > originalUrl.expiresAt` before redirecting and returns `410 Gone` on expiry. Expired documents are retained in the database for audit purposes.

---

## Request Lifecycle

### Shorten a URL

```
POST /shorten  { originalUrl: "https://..." }
        │
        ▼
urlController.shortenUrl()
  ├─ Guard: empty body → 200 health check
  ├─ Validate: originalUrl present → 400
  ├─ Validate: URL regex → 400
  └─ Delegate to urlService.createShortUrl(originalUrl)
              │
              ▼
         urlService.createShortUrl()
           ├─ attempt = 0
           ├─ loop:
           │    shortCode = generateShortCode(url, attempt)
           │    existing  = ShortUrl.findOne({ shortCode })
           │    if not found → break
           │    attempt++
           ├─ expiresAt = now + 10 days
           └─ ShortUrl.create({ originalUrl, shortCode, expiresAt })
                          │
                          ▼
              201 → { shortUrl: "BASE_URL/shortCode" }
```

### Redirect

```
GET /:shortCode
        │
        ▼
urlController.redirectUrl()
  ├─ getOriginalUrl(shortCode) → ShortUrl.findOne({ shortCode })
  ├─ Not found  → 404
  ├─ Expired    → 410
  └─ res.redirect(originalUrl)  → 302
```

---

## Environment Variables

All variables are loaded via `dotenv` at server startup. The `.env` file is git-ignored — never commit it.

| Variable | Required | Example | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port the Express server binds to. Defaults to `5000`. |
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` | MongoDB Atlas connection string |
| `BASE_URL` | Yes | `http://localhost:5000` | Base URL prepended to short codes in API responses |
| `FRONTEND_URL` | Yes | `http://localhost:3000` | Allowed CORS origin for the frontend application |

### `.env` Template

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?appName=<app>
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

> **Production note:** `BASE_URL` and `FRONTEND_URL` should use your real domain (e.g. `https://api.yourapp.com`). Ensure `https://` is used and `FRONTEND_URL` exactly matches your deployed frontend origin — CORS is strict.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A MongoDB Atlas cluster (free tier is sufficient)
- npm ≥ 9

### Installation

```bash
# From the project root
cd Backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, BASE_URL, and FRONTEND_URL
```

### Run Development Server

```bash
npm run dev
```

Nodemon watches all `src/**/*.js` files and restarts the server automatically on any change.

### Verify the Server

```bash
curl http://localhost:5000/
# → "API running"
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with Nodemon (hot reload) |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Run `prisma generate` (Prisma client codegen) |

---

## Error Handling

All controller functions are wrapped in `try/catch` blocks. Unhandled exceptions return `500 Internal Server Error` with no stack trace exposed to the client:

```js
} catch (error) {
    return res.status(500).json({ error: "Internal server error" });
}
```

**Express 5** natively propagates async errors thrown in route handlers without requiring `next(error)` boilerplate, reducing middleware wiring surface.

---

## Security Considerations

| Concern | Current Implementation | Recommendation |
|---|---|---|
| **Input validation** | Regex check on `originalUrl` | Consider `zod` or `joi` for schema-level validation |
| **CORS** | Origin whitelist via `FRONTEND_URL` env var | Ensure exact origin match in production |
| **Credentials in logs** | No logging of `originalUrl` | Add structured logging (e.g. `pino`) with PII redaction |
| **Rate limiting** | None | Add `express-rate-limit` to `POST /shorten` to prevent abuse |
| **SSRF** | Regex blocks non-HTTP schemes | Consider resolving & blocklisting private/loopback IP ranges |
| **Database injection** | Mongoose ODM parameterizes queries | No raw query strings used — safe by default |
| **Secrets** | `.env` git-ignored | Use a secrets manager (e.g. AWS Secrets Manager) in production |

---

## Known Limitations & Future Work

| Item | Notes |
|---|---|
| **No authentication** | Any client can shorten any URL. Add JWT or API key auth for user-scoped URLs. |
| **TTL not enforced in DB** | Expired documents persist. Add a MongoDB TTL index or a cron job to purge them. |
| **No click analytics** | Add a `clicks` counter or a separate `ClickEvent` collection on each redirect. |
| **Prisma client unused** | `src/prisma/prismaClient.js` is scaffolded but not wired to any service. Remove or migrate to Prisma if switching from Mongoose. |
| **`npm run start` uses nodemon** | Production deployments should use `node src/server.js` directly, not nodemon. |
| **No custom short codes** | Users cannot choose their own alias. Add an optional `customCode` field with availability check. |
| **Concurrent collision race** | The application-level uniqueness loop is not atomic. The MongoDB unique index catches the race, but the error is not currently retried — add E11000 error handling in `createShortUrl`. |
