import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductUpload() {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [productData, setProductData] = useState(null);
    const [compliance, setCompliance] = useState(null);
    const [extractedText, setExtractedText] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setMessage("");
        setError("");
        setProductData(null);
        setCompliance(null);
        setExtractedText("");
    };

    const handleScan = async (event) => {
        event.preventDefault();

        if (!image) {
            setError("Please select a product image first.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication token not found. Please login again.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");
            setProductData(null);
            setCompliance(null);
            setExtractedText("");

            const formData = new FormData();
            formData.append("productImage", image);

            const response = await api.post(
                "/products/extract",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                setError(
                    response.data.message ||
                    "Failed to scan product."
                );
                return;
            }

            const { data, compliance: complianceResult } = response.data;

            setProductData(data);
            setCompliance(complianceResult);
            setExtractedText(JSON.stringify(data, null, 2));
            setMessage(
                "Product scanned and inspected successfully."
            );
        } catch (error) {
            console.error("Product Scan Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to scan product."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar
                onDashboard={() => navigate("/dashboard")}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-5xl px-6 py-10">
                <PageHeader />

                <UploadCard
                    image={image}
                    preview={preview}
                    loading={loading}
                    error={error}
                    message={message}
                    onImageChange={handleImageChange}
                    onScan={handleScan}
                />

                {extractedText && (
                    <ExtractionReport productData={productData} />
                )}

                {compliance && (
                    <ComplianceReport compliance={compliance} />
                )}
            </main>
        </div>
    );
}

function Navbar({ onDashboard, onLogout }) {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        LabelCheck
                    </h1>

                    <p className="text-xs text-slate-500">
                        Legal Metrology Compliance System
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onDashboard}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-black"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={onLogout}
                        className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-black"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

function PageHeader() {
    return (
        <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">
                Product Inspection
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
                Scan Product
            </h2>

            <p className="mt-2 text-slate-600">
                Upload a clear image of the packaged commodity
                and let Gemini extract the visible information.
            </p>
        </div>
    );
}

function UploadCard({
    image,
    preview,
    loading,
    error,
    message,
    onImageChange,
    onScan
}) {
    return (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <form onSubmit={onScan}>
                <label
                    htmlFor="productImage"
                    className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100"
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Product preview"
                            className="max-h-64 max-w-full rounded-lg object-contain"
                        />
                    ) : (
                        <UploadPlaceholder />
                    )}

                    <input
                        id="productImage"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={onImageChange}
                        className="hidden"
                    />
                </label>

                {image && <SelectedFile file={image} />}

                {error && (
                    <Alert type="error">
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert type="success">
                        {message}
                    </Alert>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white shadow-sm hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
                >
                    {loading
                        ? "Analyzing with Gemini..."
                        : "Scan Product"}
                </button>
            </form>
        </div>
    );
}

function UploadPlaceholder() {
    return (
        <>
            <div className="mb-4 text-5xl">📦</div>

            <p className="font-medium text-slate-800">
                Select product image
            </p>

            <p className="mt-2 text-sm text-slate-500">
                JPG, JPEG, PNG or WEBP
            </p>

            <p className="text-sm text-slate-500">
                Maximum size: 5 MB
            </p>
        </>
    );
}

function SelectedFile({ file }) {
    return (
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
                Selected File
            </p>

            <p className="mt-1 break-all text-sm text-slate-500">
                {file.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
        </div>
    );
}

function Alert({ type, children }) {
    const className =
        type === "error"
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700";

    return (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${className}`}>
            {children}
        </div>
    );
}

function ExtractionReport({ productData }) {
    return (
        <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-4">
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    AI EXTRACTION & COMPLIANCE REPORT
                </span>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Legal Metrology 2011 Analysis
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Extracted product information from the uploaded image.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                    label="Product Name"
                    value={productData.productName}
                />

                <InfoCard
                    label="Brand Name"
                    value={productData.brandName}
                />

                <InfoCard
                    label="MRP"
                    value={productData.mrp}
                />

                <InfoCard
                    label="Net Quantity"
                    value={productData.netQuantity}
                />

                <InfoCard
                    label="Manufacturer"
                    value={productData.manufacturer}
                />

                <InfoCard
                    label="Packer"
                    value={productData.packer}
                />

                <InfoCard
                    label="Importer"
                    value={productData.importer}
                />

                <InfoCard
                    label="Country of Origin"
                    value={productData.countryOfOrigin}
                />

                <InfoCard
                    label="Manufacturing Date"
                    value={productData.manufacturingDate}
                />

                <InfoCard
                    label="Packing Date"
                    value={productData.packingDate}
                />

                <InfoCard
                    label="Expiry Date"
                    value={productData.expiryDate}
                />

                <InfoCard
                    label="Batch Number"
                    value={productData.batchNumber}
                />

                <InfoCard
                    label="License Number"
                    value={productData.licenseNumber}
                />

                <InfoCard
                    label="Consumer Care"
                    value={productData.consumerCare}
                />
            </div>

            <Warnings warnings={productData.warnings} />

            <RawText text={productData.rawVisibleText} />
        </div>
    );
}

function Warnings({ warnings }) {
    return (
        <div className="mt-6">
            <h4 className="mb-2 text-lg font-semibold text-slate-900">
                Warnings
            </h4>

            {warnings?.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {warnings.map((warning, index) => (
                        <li key={index}>
                            {warning}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500">
                    No warnings detected.
                </p>
            )}
        </div>
    );
}

function RawText({ text }) {
    return (
        <div className="mt-6">
            <h4 className="mb-2 text-lg font-semibold text-slate-900">
                Raw Visible Text
            </h4>

            <div className="rounded-lg bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-600">
                    {text || "No readable text detected."}
                </p>
            </div>
        </div>
    );
}

function ComplianceReport({ compliance }) {
    const passed = compliance.overallStatus === "PASS";

    return (
        <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-6">
                <p className="text-sm font-medium text-slate-500">
                    COMPLIANCE RESULT
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    Legal Metrology Check
                </h3>
            </div>

            <div
                className={`rounded-xl p-6 ${
                    passed ? "bg-green-50" : "bg-red-50"
                }`}
            >
                <p
                    className={`text-3xl font-bold ${
                        passed ? "text-green-700" : "text-red-700"
                    }`}
                >
                    {compliance.overallStatus}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                    {passed
                        ? "All currently configured mandatory checks passed."
                        : "One or more configured mandatory checks failed."}
                </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <StatCard
                    label="Total Checks"
                    value={compliance.totalRules}
                />

                <StatCard
                    label="Passed"
                    value={compliance.passedRules}
                    valueClass="text-green-600"
                />

                <StatCard
                    label="Failed"
                    value={compliance.failedRules}
                    valueClass="text-red-600"
                />
            </div>

            <div className="mt-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    Validation Details
                </h4>

                <div className="space-y-3">
                    {compliance.results.map((rule) => (
                        <RuleResult
                            key={rule.ruleId}
                            rule={rule}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    valueClass = "text-slate-900"
}) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-xs text-slate-500">
                {label}
            </p>

            <p className={`mt-1 text-2xl font-bold ${valueClass}`}>
                {value}
            </p>
        </div>
    );
}

function RuleResult({ rule }) {
    const statusClass = {
        PASS: "bg-green-100 text-green-700",
        FAIL: "bg-red-100 text-red-700",
        NOT_APPLICABLE: "bg-slate-100 text-slate-600"
    };

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <p className="font-medium text-slate-800">
                    {rule.label}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {rule.message}
                </p>
            </div>

            <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClass[rule.status] ||
                    "bg-slate-100 text-slate-600"
                }`}
            >
                {rule.status}
            </span>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 wrap-break-words text-sm font-medium text-slate-800">
                {value || "Not detected"}
            </p>
        </div>
    );
}

export default ProductUpload;