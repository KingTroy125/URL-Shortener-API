import { createShortUrl, getOriginalUrl } from "../services/urlService.js";

// Controller function to handle URL shortening

export async function shortenUrl(req, res) {
    try {
        const { originalUrl } = req.body || {};

        // Validate the original URL format
        const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

        // Allow POST /shorten to be used as a simple API health test.
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(200).json({
                message: "API is running",
            });
        }

        // Validate the original URL
        if (!originalUrl) {
            return res.status(400).json({ error: "Original URL is required" });
        }

        // Validate the URL format
        if (!urlPattern.test(originalUrl)) {
            return res.status(400).json({ error: "Invalid URL format. Please enter a valid http or https URL." });
        }

        // Create the shortened URL
        const shortUrl = await createShortUrl(originalUrl);

        return res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${shortUrl.shortCode}`,
        });
    } catch (error) {
        console.error("Error in shortenUrl:", error);  // Add this
        return res.status(500).json({
            error: "Internal server error",
            details: error.message  // Add this temporarily
        });
    }
}

export async function redirectUrl(req, res) {
    try {
        const { shortCode } = req.params;

        // Retrieve the original URL
        const originalUrl = await getOriginalUrl(shortCode);

        // If the original URL is not found, return a 404 error
        if (!originalUrl) {
            return res.status(404).json({ 
                error: "URL not found" 
            });
        }

        // Check if the URL has expired
        if (new Date() > originalUrl.expiresAt) {
            return res.status(410).json({ 
                error: "URL expired" 
            });
        }

        // Redirect to the original URL
        res.redirect(originalUrl.originalUrl);
    } catch (error) {
        console.error("Error in redirectUrl:", error);  // Add this
        res.status(500).json({
            error: "Internal server error",
            details: error.message  // Add this temporarily
        });
    }
}
