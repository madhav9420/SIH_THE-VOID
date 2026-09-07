const express = require("express");

const {
    uploadProductImage,
    extractProductData,
    getInspectionHistory,
    getDashboardStats,
    getInspectionById
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("productImage"),
    uploadProductImage
);

router.post(
    "/extract",
    protect,
    upload.single("productImage"),
    extractProductData
);

router.get("/history", protect, getInspectionHistory);
router.get("/stats", protect, getDashboardStats);
router.get("/:id", protect, getInspectionById);

module.exports = router;