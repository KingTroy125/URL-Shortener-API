import { PrismaClient } from "@prisma/client";
import generateShortCode from "../utils/generateShortCode.js";

const prisma = new PrismaClient();

// Function to create a shortened URL
export async function createShortUrl(originalUrl) {

    let attempt = 0;
    let shortCode;

    // ** Hash-based approach **
    while (true) {
        shortCode = generateShortCode(originalUrl, attempt);

        // Check if the short code already exists in the database (PRISMA SYNTAX)
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

    // Create the shortened URL in the database (PRISMA SYNTAX)
    const shortUrl = await prisma.shortUrl.create({
        data: {
            originalUrl,
            shortCode,
            expiresAt
            // createdAt and updatedAt are auto-managed by Prisma
        }
    });

    return shortUrl;
}

export async function getOriginalUrl(shortCode) {
    // Find the original URL by short code (PRISMA SYNTAX)
    const url = await prisma.shortUrl.findUnique({
        where: { shortCode }
    });

    return url;
}