const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        image: {
            filename: {
                type: String,
                required: true
            },
            originalName: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            mimetype: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        },

        extractedData: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        compliance: {
            overallStatus: {
                type: String,
                enum: ["PASS", "FAIL", "REVIEW"],
                default: "REVIEW"
            },
            totalRules: {
                type: Number,
                default: 0
            },
            passedRules: {
                type: Number,
                default: 0
            },
            failedRules: {
                type: Number,
                default: 0
            },
            results: {
                type: Array,
                default: []
            }
        },

        status: {
            type: String,
            enum: [
                "UPLOADED",
                "PROCESSING",
                "COMPLIANT",
                "NON_COMPLIANT",
                "REVIEW"
            ],
            default: "UPLOADED"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);