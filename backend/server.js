const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");

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


const upload = multer({ storage: multer.memoryStorage() });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/extract-text", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file received in /api/extract-text");
            return res.status(400).json({ error: "Image file is required" });
        }

        console.log(`Processing image: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.size / 1024).toFixed(1)} KB)`);

        const imageBytes = req.file.buffer;
        const mimeType = req.file.mimetype;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
                { inlineData: { data: imageBytes.toString("base64"), mimeType } },
                { text: "Extract all the text visible in this image, exactly as it appears and also check its compliance with LM rules 2011." },
            ],
        });

        console.log("Gemini extraction finished successfully.");
        res.json({ success: true, text: response.text });
    } catch (err) {
        console.error("Extract text error:", err);
        res.status(500).json({ error: "Failed to process image: " + (err.message || "Unknown error") });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`THE_VOID_Project server running on port ${PORT}`);
});