const extractProductInformation = async () => {

    console.log("MOCK AI: Using test product data");

    return {
        productName: "Test Biscuits",
        brandName: "THE_VOID",
        mrp: "",
        netQuantity: "100 g",
        manufacturer: "THE_VOID Foods Pvt Ltd",
        packer: "",
        importer: "",
        countryOfOrigin: "India",
        manufacturingDate: "01/09/2026",
        packingDate: "",
        expiryDate: "01/09/2027",
        consumerCare: "1800-123-4567",
        batchNumber: "TV001",
        licenseNumber: "",
        warnings: [],
        rawVisibleText:
            "THE_VOID Biscuits\nMRP ₹50\nNet Quantity 100 g\nManufactured by THE_VOID Foods Pvt Ltd\nCountry of Origin: India"
    };
};

module.exports = {
    extractProductInformation
};