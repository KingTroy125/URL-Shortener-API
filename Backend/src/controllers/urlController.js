import { createShortUrl, getOriginalUrl } from "../services/urlService.js";

// Controller function to handle URL shortening

export async function shortenUrl(req, res) {

    try {
        const { originalUrl } = req.body;

        // Validate the original URL format
        const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

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

        res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${shortUrl.shortCode}`,
        });

        // Log the shortened URL to the console
        } catch (error) {
            res.status(500).json({
                error: "Internal server error" 
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
        res.status(500).json({
            error: "Internal server error"
        });
    }
}
