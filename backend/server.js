const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/api/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "THE_VOID_Project backend is running"
    });
});

app.get("/", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to THE_VOID_Project API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`THE_VOID_Project server running on port ${PORT}`);
});