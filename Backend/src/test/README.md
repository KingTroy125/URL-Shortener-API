# Short Code Generation — Test Suite

> **Scope:** `src/test/`
> **Purpose:** Jest unit tests and benchmarks for the URL Shortener's short code generation algorithms, covering both hash-based and random approaches with collision detection.

---

## Table of Contents

1. [Overview](#overview)
2. [Algorithms Under Test](#algorithms-under-test)
3. [Test Files](#test-files)
4. [Running the Tests](#running-the-tests)
5. [Expected Output](#expected-output)
6. [Design Decisions](#design-decisions)
7. [Collision Probability](#collision-probability)
8. [Production Strategy](#production-strategy)

---

## Overview

This suite validates `generateShortCode.js` (hash-based) and `generateShortCode1.js` (random-based), the two short code generation strategies used or considered for the URL Shortener API.

It covers:

- Unit correctness (length, character set, type)
- Determinism and uniqueness behavior
- Collision rates at scale (100,000+ codes)
- Endpoint-level stress testing under concurrent load

All tests run on Jest with Node.js built-ins (`crypto`, `Math.random`, `Set`) — no external dependencies required.

---

## Algorithms Under Test

### Strategy A — Random (Base36)

```js
Math.random().toString(36).substring(2, 8)
```

- **Charset:** `a-z0-9` (Base36), 6 characters → **36⁶ ≈ 2.18 billion** combinations
- **Behavior:** Stateless, non-deterministic — independent of input
- **Collision handling:** None at generation time; relies on a unique DB constraint

### Strategy B — Hash-based (Base62 + SHA-256)

```js
SHA-256(url + attempt) → BigInt → Base62 → first 6 chars
```

- **Charset:** `0-9a-zA-Z` (Base62), 6 characters → **62⁶ ≈ 56.8 billion** combinations
- **Behavior:** Deterministic and URL-seeded — same URL + attempt always produces the same code
- **Collision handling:** Retry loop increments `attempt` and re-hashes until a unique code is found

---

## Test Files

### `generateShortCode.test.js`
Unit tests for the hash-based generator.

- Generates a defined code
- Code is exactly 6 characters

```bash
npm test -- generateShortCode.test.js
```

### `generateShortCode1.test.js`
Unit tests for the random Base36 generator.

- Generates a defined code
- Returns a string
- Code is exactly 6 characters
- Matches `/^[a-z0-9]{6}$/`

```bash
npm test -- generateShortCode1.test.js
```

### `test-collision.test.js`
Collision benchmark for the random generator at scale (100,000 iterations). Uses a `Set` for O(1) lookups and asserts collisions stay below 50.

```bash
npm test -- test-collision.test.js
```

### `test-hash.test.js`
Extended tests for the hash-based generator covering both random-style and hash-style invocations:

- Output length and charset (Base62, `/^[0-9a-zA-Z]{6}$/`)
- Determinism: same URL + attempt → same code
- Different attempts → different codes
- Different URLs → different codes
- Random invocation produces ≥95 unique codes out of 100

```bash
npm test -- test-hash.test.js
```

### `stress.test.js`
Stress test against a mock `/shorten` Express endpoint, firing 1,000 concurrent requests and asserting all return `201`.

> ⚠️ Resource-intensive — consider running separately from the main suite.

```bash
npm test -- stress.test.js
```

---

## Running the Tests

```bash
# Run all tests
npm test

# Run a specific file
npm test -- generateShortCode.test.js

# Verbose output
npm test -- --verbose

# With coverage
npm test -- --coverage
```

Jest is configured via `jest.config.js` with the test pattern `*.test.js`.

---

## Expected Output

```
 PASS  src/utils/test/generateShortCode.test.js
 PASS  src/utils/test/generateShortCode1.test.js
 PASS  src/utils/test/test-collision.test.js
   Generated: 100000
   Collisions: 23
 PASS  src/utils/test/test-hash.test.js
 PASS  src/utils/test/stress.test.js
   Successful: 1000

Test Suites: 5 passed, 5 total
```

At ~100K codes, the Base36 random strategy typically produces **20–50 collisions** (~0.02–0.05%). The hash-based strategy produces deterministic, collision-free output for distinct (URL, attempt) pairs.

---

## Design Decisions

**Why hash-based (Base62-SHA-256) over UUID/NanoID for production?**

| Factor | UUID v4 | NanoID | Base62-SHA-256 |
|---|---|---|---|
| Uniqueness | Probabilistic | Probabilistic | Deterministic per (url, attempt) |
| Length | 36 chars | Configurable | 6 chars |
| Namespace (6 chars) | N/A | ~62⁶ | 62⁶ ≈ 56.8B |
| Collision resolution | External (DB) | External (DB) | Built-in (`attempt` counter) |
| URL-seeded | No | No | Yes |

Being URL-seeded means the same URL produces the same candidate code on the first attempt — useful for future deduplication (check for an existing short code before inserting).

**Why `BigInt` for Base62 conversion?**

SHA-256 produces a 256-bit buffer, but JS `Number` only safely holds 53 bits of integer precision. `BigInt` preserves the full 256 bits through the modular reduction, keeping the Base62 output uniformly distributed.

---

## Collision Probability

Approximate birthday-bound collision probability for `k` codes in a namespace of size `N`:

```
P(collision) ≈ 1 - e^(-k² / 2N)
```

| Namespace | 50% collision at | 1% collision at |
|---|---|---|
| Base36, 6 chars (2.18B) | ~55,000 codes | ~6,600 codes |
| Base62, 6 chars (56.8B) | ~281,000 codes | ~33,700 codes |

Base62 is ~26x more collision-resistant than Base36 at the same length, which is why it's preferred for production despite the extra hashing cost.

---

## Production Strategy

```
1. Hash originalUrl + attempt (starting at 0) → candidate code
2. Check DB for an existing record with this code
3. If free → use it
4. If taken → increment attempt, repeat from step 1
```

- SHA-256's avalanche effect ensures each `attempt` increment produces a fully different hash, not a trivial permutation.
- At 100K scale, the random baseline shows ~0.02% collisions, mostly resolved in a single retry — Base62-SHA-256 performs even better.
- The `unique: true` constraint on `shortCode` in the Mongoose schema acts as a final safeguard against race conditions in concurrent writes.

---

## Test Organization

```
src/utils/
├── generateShortCode.js          # Production hash-based generator
├── generateShortCode1.js         # Alternative random generator
test/
├── generateShortCode.test.js
├── generateShortCode1.test.js
├── test-collision.test.js
├── test-hash.test.js
├── stress.test.js
└── README.md
```