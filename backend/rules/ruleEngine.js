const packagedCommodityRules = require("./packagedCommodityRules");

const isEmpty = (value) => {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === "string") {
        return value.trim() === "";
    }

    return false;
};


const validateProduct = (productData) => {

    const results = [];

    for (const rule of packagedCommodityRules) {

        const value = productData[rule.field];

        if (rule.required && isEmpty(value)) {

            results.push({
                ruleId: rule.id,
                field: rule.field,
                label: rule.label,
                status: "FAIL",
                message: `${rule.label} is missing`
            });

        } else {

            results.push({
                ruleId: rule.id,
                field: rule.field,
                label: rule.label,
                status: "PASS",
                message: `${rule.label} detected`
            });

        }
    }


    const failedRules = results.filter(
        (rule) => rule.status === "FAIL"
    );


    let overallStatus = "PASS";

    if (failedRules.length > 0) {
        overallStatus = "FAIL";
    }


    return {
        overallStatus,
        totalRules: results.length,
        passedRules: results.filter(
            (rule) => rule.status === "PASS"
        ).length,
        failedRules: failedRules.length,
        results
    };
};


module.exports = {
    validateProduct
};