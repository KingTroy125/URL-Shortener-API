# Tech Stack Selection

## Stack summary

The chosen stack is **modern, widely adopted, and production-proven** for building Node.js backends. It prioritizes developer productivity (Express + Prisma), operational maturity (MongoDB Atlas + Vercel), and testability (Jest + Supertest + Postman).

| Technology | Purpose | Pros | Cons | Reason for choosing it |
| --- | --- | --- | --- | --- |
| Node.js | JavaScript runtime for server-side execution | Fast development speed• Non-blocking architecture• Large NPM ecosystem• Same language across stack• Excellent for APIs | Single-threaded by default• Not ideal for CPU-heavy workloads• Can become difficult to structure in large projects | Ideal for a lightweight, high-throughput REST API; async I/O fits short URL redirects and rapid iteration for an MVP. |
| Express.js | HTTP server + routing + middleware | Minimal setup• Flexible architecture• Large community support• Easy middleware integration• Industry standard | Less opinionated structure• Requires manual project organization• Fewer built-in features than NestJS | Minimal routing/middleware layer that keeps the codebase simple for a small API (shorten, redirect, health checks) without extra framework overhead. |
| JavaScript | Implementation language | Easy to learn• Massive ecosystem• Large community support• Fast prototyping• Works across frontend and backend | Dynamic typing can cause runtime errors• Less strict than TypeScript• Harder to maintain at scale | Fastest path to ship in the Node ecosystem; reduces setup friction and keeps focus on API design, validation, and testing. |
| MongoDB | Primary data store | Flexible schema• Fast development cycles• Easy cloud hosting• Good horizontal scaling• JSON-like document model | Less strict data consistency• Complex relationships are harder• Less suitable for highly relational systems | Simple document model maps cleanly to URL records (code, longUrl, expiry, metadata) and handles flexible fields without migrations slowing the MVP. |
| Prisma ORM | Database access layer | Clean queries• Strong developer experience• Easier maintenance• Reduces boilerplate code• Clear schema management | Additional abstraction layer• Learning curve• Some advanced database features may require workarounds | Type-safe data access and a clear schema layer to prevent bugs around lookups/expiry logic, while keeping DB code clean and testable. |
| Jest | Test runner and assertions | Easy configuration• Fast execution• Snapshot support• Excellent documentation• Industry standard | Not designed for load testing• Large test suites can become slower | Mature Node testing ecosystem for quick feedback on core flows (create short link, redirect, expiry, error paths) with minimal setup. |
| Supertest | HTTP integration testing | Simple API testing• Works seamlessly with Express• Integrates with Jest• Fast feedback loop | Focused primarily on HTTP testing• Not suitable for performance testing | Best fit for verifying Express endpoints end-to-end (status codes, headers, redirects) without needing to run a separate server process. |
| Postman | Manual API testing + documentation collections | Easy to use• Environment variables• Request collections• API documentation support• Industry adoption | Mostly manual testing• Not ideal for automated CI pipelines | Great for quickly validating request/response shapes and sharing a repeatable collection for demoing the API and testing env-based configs. |
| GitHub | Version control + CI collaboration | Industry standard• Pull requests• CI/CD integration• Code reviews• Public portfolio exposure | Requires Git knowledge• Learning branching strategies can take time | Supports a professional workflow for an engineering-style project: PRs, code reviews, and CI runs for tests/linting on every change. |
| Vercel | Hosting + deployment | Easy deployment• Automatic builds• GitHub integration• Environment variable management• Free tier available | Serverless limitations• Less infrastructure control• Cold starts on some plans | Fast, low-ops deployments for a small API with simple environment-variable management—ideal for shipping and iterating quickly. |

## Why this stack is industry relevant

- Mirrors common backend team setups (Express + MongoDB + CI/CD).
- Enables **clean architecture** (controllers/services, testable units).
- Supports production practices: environment-based config, automated testing, and cloud deployment.