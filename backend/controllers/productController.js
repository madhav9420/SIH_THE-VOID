const Product = require("../models/Product");
const {
    extractProductInformation
} = require("../services/aiService");
const {
    validateProduct
} = require("../rules/ruleEngine");

const createImageData = (file) => ({
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size
});

const getProductStatus = (overallStatus) => {
    switch (overallStatus) {
        case "PASS":
            return "COMPLIANT";

        case "FAIL":
            return "NON_COMPLIANT";

        default:
            return "REVIEW";
    }
};

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
            image: createImageData(req.file),
            status: "UPLOADED"
        });

        return res.status(201).json({
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
        console.error("Product Upload Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to upload product image"
        });
    }
};

const extractProductData = async (req, res) => {
    let product = null;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }

        product = await Product.create({
            user: req.userId,
            image: createImageData(req.file),
            status: "PROCESSING"
        });

        const extractedData = await extractProductInformation(
            req.file.path,
            req.file.mimetype
        );

        const validationResult = validateProduct(extractedData);

        const productStatus = getProductStatus(
            validationResult.overallStatus
        );

        product.extractedData = extractedData;
        product.compliance = validationResult;
        product.status = productStatus;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product inspection completed successfully",
            productId: product._id,
            data: extractedData,
            compliance: validationResult,
            status: productStatus
        });
    } catch (error) {
        console.error("Product Scan Error:", error.message);

        if (product) {
            try {
                product.status = "REVIEW";
                await product.save();
            } catch (saveError) {
                console.error(
                    "Failed to update product status:",
                    saveError.message
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to scan product"
        });
    }
};

const getInspectionHistory = async (req, res) => {
    try {
        const inspections = await Product.find({
            user: req.userId
        })
            .sort({ createdAt: -1 })
            .select(
                "_id image.originalName image.filename status " +
                "extractedData.productName extractedData.brandName " +
                "extractedData.mrp compliance.overallStatus " +
                "compliance.totalRules compliance.passedRules " +
                "compliance.failedRules createdAt"
            );

        return res.status(200).json({
            success: true,
            count: inspections.length,
            inspections
        });
    } catch (error) {
        console.error(
            "Inspection History Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch inspection history"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const userFilter = {
            user: req.userId
        };

        const [
            totalScans,
            compliant,
            nonCompliant,
            review
        ] = await Promise.all([
            Product.countDocuments(userFilter),
            Product.countDocuments({
                ...userFilter,
                status: "COMPLIANT"
            }),
            Product.countDocuments({
                ...userFilter,
                status: "NON_COMPLIANT"
            }),
            Product.countDocuments({
                ...userFilter,
                status: "REVIEW"
            })
        ]);

        const complianceRate =
            totalScans === 0
                ? 0
                : Math.round((compliant / totalScans) * 100);

        return res.status(200).json({
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
        console.error(
            "Dashboard Stats Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

const getInspectionById = async (req, res) => {
    try {
        const inspection = await Product.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found"
            });
        }

        return res.status(200).json({
            success: true,
            inspection
        });
    } catch (error) {
        console.error(
            "Inspection Details Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch inspection details"
        });
    }
};

module.exports = {
    uploadProductImage,
    extractProductData,
    getInspectionHistory,
    getDashboardStats,
    getInspectionById
};