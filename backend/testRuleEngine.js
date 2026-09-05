const { validateProduct } = require("./rules/ruleEngine");

const testProduct = {
    productName: "Example Biscuit",
    brandName: "Example",
    mrp: "₹50",
    netQuantity: "100 g",
    manufacturer: "ABC Foods Pvt Ltd",
    packer: "",
    importer: "",
    countryOfOrigin: "India",
    manufacturingDate: "",
    packingDate: "",
    expiryDate: "",
    consumerCare: "1800-123-4567",
    batchNumber: "B123",
    licenseNumber: "",
    warnings: [],
    rawVisibleText: "Example product package"
};

const result = validateProduct(testProduct);

console.log(
    JSON.stringify(result, null, 2)
);