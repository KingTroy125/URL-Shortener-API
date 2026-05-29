import express from "express";

import { shortenUrl, redirectUrl } from "../controllers/urlController.js";

const router = express.Router();

// POST endpoint for shortening URLs
router.post("/shorten", shortenUrl);

// GET endpoint for redirecting to the original URL
router.get("/:shortCode", redirectUrl);

export default router;