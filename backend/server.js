const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "THE_VOID_Project backend is running"
    });
});

// Root API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to THE_VOID_Project API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`THE_VOID_Project server running on port ${PORT}`);
});