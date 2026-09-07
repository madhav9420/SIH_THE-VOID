const packagedCommodityRules = require("./packagedCommodityRules");

const isEmpty = (value) => {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === "string") {
        return value.trim() === "";
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
};

const createResult = (rule, status, message) => ({
    ruleId: rule.id,
    field: rule.field,
    label: rule.label,
    status,
    message,
    description: rule.description
});

const validateProduct = (productData) => {
    const results = packagedCommodityRules.map((rule) => {
        const value = productData[rule.field];

        if (!rule.required && isEmpty(value)) {
            return createResult(
                rule,
                "NOT_APPLICABLE",
                `${rule.label} is not applicable or not detected`
            );
        }

        if (rule.required && isEmpty(value)) {
            return createResult(
                rule,
                "FAIL",
                `${rule.label} is missing`
            );
        }

        return createResult(
            rule,
            "PASS",
            `${rule.label} detected`
        );
    });

    const passedRules = results.filter(
        (rule) => rule.status === "PASS"
    );

    const failedRules = results.filter(
        (rule) => rule.status === "FAIL"
    );

    const applicableRules = results.filter(
        (rule) => rule.status !== "NOT_APPLICABLE"
    );

    return {
        overallStatus: failedRules.length > 0 ? "FAIL" : "PASS",
        totalRules: applicableRules.length,
        passedRules: passedRules.length,
        failedRules: failedRules.length,
        results
    };
};

module.exports = {
    validateProduct
};