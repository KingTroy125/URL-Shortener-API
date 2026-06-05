import ShortUrl from "../models/ShortUrl.js";
import { generateShortCode } from "../utils/generateShortCode.js";

// Function to create a shortened URL
export async function createShortUrl(originalUrl) {

    // Generate a unique short code
    const shortCode = generateShortCode();

    // Set the expiration date for the shortened URL (e.g., 10 days from now)
    const expiresAt = new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000 // Expires in 10 days
    );

    // Create the shortened URL in the database
    const shortUrl = await ShortUrl.create({
        originalUrl,
        shortCode,
        expiresAt
    });

    return shortUrl;
}

export async function getOriginalUrl(shortCode) {
    // Find the original URL by short code
    const url = await ShortUrl.findOne({ shortCode });

    return url;
}
