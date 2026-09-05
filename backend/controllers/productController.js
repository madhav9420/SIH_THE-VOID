const Product = require("../models/Product");
const {extractProductInformation} = require("../services/aiService");
const {validateProduct} = require("../rules/ruleEngine");

const uploadProductImage = async (req, res) => {
    try {

     
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }

        const product = await Product.create({
            user: req.userId,

            image: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            },

            status: "UPLOADED"
        });

        res.status(201).json({
            success: true,
            message: "Product image uploaded successfully",

            product: {
                id: product._id,
                filename: product.image.filename,
                originalName: product.image.originalName,
                mimetype: product.image.mimetype,
                size: product.image.size,
                status: product.status
            }
        });

    } catch (error) {

        console.error("Product Upload Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload product image"
        });
    }
};

const extractProductData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }

        console.log("Creating product record...");

        // Create initial product record
        const product = await Product.create({
            user: req.userId,

            image: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            },

            status: "PROCESSING"
        });

        console.log("Sending image to AI...");

     
        const extractedData = await extractProductInformation(
            req.file.path,
            req.file.mimetype
        );

        console.log("AI extraction successful");

        const validationResult = validateProduct(
            extractedData
        );

        console.log("Validation completed");

        let productStatus = "REVIEW";

        if (validationResult.overallStatus === "PASS") {
            productStatus = "COMPLIANT";
        } else if (validationResult.overallStatus === "FAIL") {
            productStatus = "NON_COMPLIANT";
        }

        product.extractedData = extractedData;

        product.compliance = validationResult;

        product.status = productStatus;

        await product.save();

        console.log("Inspection saved to MongoDB");

        res.status(200).json({
            success: true,
            message: "Product scanned successfully",

            productId: product._id,

            data: extractedData,

            compliance: validationResult,

            status: productStatus
        });

    } catch (error) {
        console.error("Product Scan Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to scan product"
        });
    }
};

const getInspectionHistory = async (req, res) => {
    try {
        const products = await Product.find({
            user: req.userId
        })
            .sort({ createdAt: -1 })
            .select(
                "_id image.originalName image.filename status extractedData.productName extractedData.brandName extractedData.mrp compliance.overallStatus compliance.totalRules compliance.passedRules compliance.failedRules createdAt"
            );

        res.status(200).json({
            success: true,
            count: products.length,
            inspections: products
        });

    } catch (error) {
        console.error("Inspection History Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch inspection history"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalScans = await Product.countDocuments({
            user: req.userId
        });

        const compliant = await Product.countDocuments({
            user: req.userId,
            status: "COMPLIANT"
        });

        const nonCompliant = await Product.countDocuments({
            user: req.userId,
            status: "NON_COMPLIANT"
        });

        const review = await Product.countDocuments({
            user: req.userId,
            status: "REVIEW"
        });

        let complianceRate = 0;

        if (totalScans > 0) {
            complianceRate = Math.round(
                (compliant / totalScans) * 100
            );
        }

        res.status(200).json({
            success: true,

            stats: {
                totalScans,
                compliant,
                nonCompliant,
                review,
                complianceRate
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

const getInspectionById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found"
            });
        }

        res.status(200).json({
            success: true,
            inspection: product
        });

    } catch (error) {
        console.error("Inspection Details Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch inspection details"
        });
    }
};

module.exports = {
    uploadProductImage,
    extractProductData,
    getInspectionHistory,
    getInspectionById,
    getDashboardStats
};