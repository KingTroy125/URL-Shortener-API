import request from "supertest";
import express from "express";
import cors from "cors";
import generateShortCode from "../utils/generateShortCode.js";

// Create a test app instance for stress testing the shorten endpoint.
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL
    })
);
app.use(express.json());

// Mock shorten endpoint for stress testing
app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
        return res.status(400).json({ error: "URL is required" });
    }
    
    try {
        const shortCode = generateShortCode(originalUrl);
        res.status(201).json({
            shortUrl: `http://localhost:5000/${shortCode}`
        });
    } catch (error) {
        console.error("Error generating short code:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Note: This test is resource-intensive and may take some time to complete. Consider running it separately from other tests.
describe("API Stress Test", () => {
  it("should handle 1000 URL creations", async () => {
    const requests = [];

    // Simulate 1000 concurrent requests to create shortened URLs
    for (let i = 0; i < 1000; i++) {
      requests.push(
        request(app)
          .post("/shorten")
          .send({
            originalUrl: `https://example${i}.com`
          })
      );
    }

    // Wait for all requests to complete
    const results = await Promise.all(requests);

    const successful = results.filter(
      r => r.statusCode === 201
    );

    console.log(`Successful: ${successful.length}`);

    expect(successful.length).toBe(1000);
  });
});
