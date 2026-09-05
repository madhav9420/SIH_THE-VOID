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

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setMessage("");
        setError("");
        setProductData(null);
    };

    const handleScan = async (e) => {
        e.preventDefault();

        if (!image) {
            setError("Please select a product image.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");
            setProductData(null);
            setCompliance(null);

            const formData = new FormData();

            formData.append("productImage", image);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/products/extract",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setProductData(response.data.data);
                setCompliance(response.data.compliance);
                setMessage(
                    "Product information extracted successfully."
                );
            }

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to analyze product image."
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

        
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            THE_VOID
                        </h1>

                        <p className="text-xs text-slate-500">
                            Legal Metrology Compliance System
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer"
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </nav>

            <main className="mx-auto max-w-5xl px-6 py-10">

         
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

         
                <div className="rounded-2xl border bg-white p-8 shadow-sm">

                    <form onSubmit={handleScan}>

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
                                <>
                                    <div className="mb-4 text-5xl">
                                        📦
                                    </div>

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
                            )}

                            <input
                                id="productImage"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </label>

                  
                        {image && (
                            <div className="mt-4 rounded-lg bg-slate-50 p-4">

                                <p className="text-sm font-medium text-slate-700">
                                    Selected File
                                </p>

                                <p className="mt-1 break-all text-sm text-slate-500">
                                    {image.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {(image.size / 1024 / 1024).toFixed(2)} MB
                                </p>

                            </div>
                        )}

                     
                        {error && (
                            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                     
                        {message && (
                            <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-lg px-5 py-3 font-medium text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
                        >
                            {loading
                                ? "Analyzing with Gemini..."
                                : "Scan Product"}
                        </button>

                    </form>

                </div>

                {productData && (
                    <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

                        <div className="mb-6">
                            <p className="text-sm font-medium text-green-600">
                                AI EXTRACTION COMPLETE
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-slate-900">
                                Extracted Product Information
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Information detected from the uploaded
                                package image.
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

              
                        <div className="mt-6">

                            <h4 className="mb-2 text-lg font-semibold text-slate-900">
                                Warnings
                            </h4>

                            {productData.warnings?.length > 0 ? (
                                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                                    {productData.warnings.map(
                                        (warning, index) => (
                                            <li key={index}>
                                                {warning}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No warnings detected.
                                </p>
                            )}

                        </div>

                        <div className="mt-6">

                            <h4 className="mb-2 text-lg font-semibold text-slate-900">
                                Raw Visible Text
                            </h4>

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="whitespace-pre-wrap text-sm text-slate-600">
                                    {productData.rawVisibleText ||
                                        "No readable text detected."}
                                </p>

                            </div>

                        </div>

                    </div>
                )}
                {compliance && (
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
                                    compliance.overallStatus === "PASS"
                                        ? "bg-green-50"
                                        : "bg-red-50"
                                }`}
                            >

                                <p
                                    className={`text-3xl font-bold ${
                                        compliance.overallStatus === "PASS"
                                            ? "text-green-700"
                                            : "text-red-700"
                                    }`}
                                >
                                    {compliance.overallStatus}
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    {compliance.overallStatus === "PASS"
                                        ? "All currently configured mandatory checks passed."
                                        : "One or more configured mandatory checks failed."}
                                </p>

                            </div>

                         
                            <div className="mt-6 grid gap-4 md:grid-cols-3">

                                <div className="rounded-lg border p-4">
                                    <p className="text-xs text-slate-500">
                                        Total Checks
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {compliance.totalRules}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <p className="text-xs text-slate-500">
                                        Passed
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-green-600">
                                        {compliance.passedRules}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <p className="text-xs text-slate-500">
                                        Failed
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-red-600">
                                        {compliance.failedRules}
                                    </p>
                                </div>

                            </div>

                        
                            <div className="mt-8">

                                <h4 className="mb-4 text-lg font-semibold text-slate-900">
                                    Validation Details
                                </h4>

                                <div className="space-y-3">

                                    {compliance.results.map((rule) => (
                                        <div
                                            key={rule.ruleId}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >

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
                                                    rule.status === "PASS"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {rule.status}
                                            </span>

                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>
                )}

            </main>

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