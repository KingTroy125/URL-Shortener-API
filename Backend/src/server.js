import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();
// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to check if the server is running
app.get("/", (req, res) => {
    res.send("API running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
