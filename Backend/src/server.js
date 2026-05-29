import dotenv from "dotenv";
import express from "express";
// Import database connection function
import cors from "cors";
import connectDB from "./config/db.js";
// Import routes
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Use URL routes
app.use("/", urlRoutes);

// Basic route to check if the server is running
app.get("/", (req, res) => {
    res.send("API running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
