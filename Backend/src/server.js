import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// POST endpoint
app.post("/api/shorten", (req, res) => {
    res.status(200).send("URL shortened successfully!");
});

// GET endpoint
app.get("/api/:shortCode", (req, res) => {
    res.status(200).json({ 
        message: "URL retrieved successfully!", 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});