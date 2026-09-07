const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not loaded");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const extractProductInformation = async (imagePath, mimeType) => {
    try {
        const imageBytes = fs.readFileSync(imagePath);

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    inlineData: {
                        data: imageBytes.toString("base64"),
                        mimeType
                    }
                },
                {
                    text: "read all data in image , only return productName ,brandName, mrp , netQuantity , manufacturer , packer , importer , countryOfOrigin , manufacturingDate , packingDate , expiryDate , consumerCare , batchNumber , licenseNumber and don't give anything else , if anythig is missing keep blank"
                }
            ]
        });

        if (!response.text) {
            throw new Error("Gemini returned empty response");
        }

        let text = response.text.trim();

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        try {
            return JSON.parse(text);
        } catch {
            throw new Error("Gemini returned invalid JSON");
        }

    } catch (error) {
        console.error("Gemini AI Error:", error.message);

        throw new Error(
            `Gemini extraction failed: ${error.message}`
        );
    }
};

module.exports = {
    extractProductInformation
};