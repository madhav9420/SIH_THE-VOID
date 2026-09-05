const packagedCommodityRules = [
    {
        id: "PC-001",
        field: "productName",
        label: "Product name",
        required: true
    },

    {
        id: "PC-002",
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        required: true
    },

    {
        id: "PC-003",
        field: "netQuantity",
        label: "Net quantity",
        required: true
    },

    {
        id: "PC-004",
        field: "manufacturer",
        label: "Manufacturer / responsible entity",
        required: true
    },

    {
        id: "PC-005",
        field: "countryOfOrigin",
        label: "Country of origin",
        required: true
    },

    {
        id: "PC-006",
        field: "consumerCare",
        label: "Consumer care information",
        required: true
    }
];

module.exports = packagedCommodityRules;