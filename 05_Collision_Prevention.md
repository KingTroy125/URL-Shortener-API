# 05_Collision_Prevention

## Why collision prevention matters

A collision happens when two different URLs accidentally receive the same `shortCode`. Without prevention, a collision can:

- Redirect users to the wrong destination.
- Overwrite existing data.
- Break trust in the system.

## Approach

1. Generate a random `shortCode`.
2. Attempt to persist it.
3. If a duplicate is detected then generate a new code and rety the save operation

## Recommended safeguards

- **Database unique constraint** on `shortCode` (source of truth).
- **Retry loop** in service logic.

## Request Flow

```mermaid

```

## Example (JavaScript + Prisma)

```jsx
import { prisma } from "../prisma/client.js";
import { generateShortCode } from "../utils/generateShortCode.js";

// Function to create a shortened URL
export async function createShortUrl(originalUrl) {

    // Generate a unique short code
    //const shortCode = generateShortCode();

    let attempt = 0;
    let shortCode;

    // ** Hash-based approach **
    while (true) {
        shortCode = generateShortCode(originalUrl, attempt);

        // Check if the short code already exists in the database
        const existing = await prisma.shortUrl.findUnique({
            where: { shortCode }
        });
        if (!existing) {
            break;
        }
        attempt++;
    }

    // Set the expiration date for the shortened URL (e.g., 10 days from now)
    const expiresAt = new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000 // Expires in 10 days
    );

    // Create the shortened URL in the database
    const shortUrl = await prisma.shortUrl.create({
        data: {
            originalUrl,
            shortCode,
            expiresAt
        }
    });

    return shortUrl;
}

export async function getOriginalUrl(shortCode) {
    // Find the original URL by short code
    const url = await prisma.shortUrl.findUnique({
        where: { shortCode }
    });

    return url;
}

```

## Notes

- The database constraint guarantees correctness even under concurrency.
- The loop makes collisions invisible to API clients.