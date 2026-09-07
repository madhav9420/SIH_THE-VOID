const packagedCommodityRules = [

    {
        id: "PC-001",
        field: "productName",
        label: "Product Name",
        required: true,
        description:
            "Common or generic name of the commodity should be declared."
    },

    {
        id: "PC-002",
        field: "manufacturer",
        label: "Manufacturer",
        required: true,
        description:
            "Manufacturer details should be declared as applicable."
    },

    {
        id: "PC-003",
        field: "countryOfOrigin",
        label: "Country of Origin",
        required: false,
        description:
            "Country of origin is applicable for imported products."
    },

    {
        id: "PC-004",
        field: "netQuantity",
        label: "Net Quantity",
        required: true,
        description:
            "Net quantity should be declared."
    },

    {
        id: "PC-005",
        field: "manufacturingDate",
        label: "Manufacturing Date",
        required: true,
        description:
            "Manufacturing date should be declared."
    },

    {
        id: "PC-006",
        field: "expiryDate",
        label: "Expiry / Best Before",
        required: false,
        description:
            "Applicable expiry or best-before information should be declared."
    },

    {
        id: "PC-007",
        field: "mrp",
        label: "Maximum Retail Price",
        required: true,
        description:
            "MRP should be declared."
    },

    {
        id: "PC-008",
        field: "consumerCare",
        label: "Consumer Care",
        required: true,
        description:
            "Consumer care information should be available."
    },

    {
        id: "PC-009",
        field: "unitSalePrice",
        label: "Unit Sale Price",
        required: false,
        description:
            "Applicable unit sale price should be declared."
    },

    {
        id: "PC-010",
        field: "dimensions",
        label: "Dimensions",
        required: false,
        description:
            "Dimensions are checked where applicable."
    }

];

module.exports = packagedCommodityRules;