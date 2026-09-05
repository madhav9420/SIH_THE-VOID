import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function InspectionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inspection, setInspection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInspection = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get(
                    `/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setInspection(
                        response.data.inspection
                    );
                }

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load inspection."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInspection();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading inspection...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/history")}
                        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Back to History
                    </button>
                </div>
            </div>
        );
    }

    if (!inspection) {
        return null;
    }

    const data = inspection.extractedData;
    const compliance = inspection.compliance;

    const isCompliant =
        compliance?.overallStatus === "PASS";

    const handleLogoutAndRedirect = () => {
        handleLogout();
    };

    return (
        <div className="min-h-screen bg-slate-100">

    
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <h1 className="text-xl font-bold text-slate-900">
                        THE_VOID
                    </h1>

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/history")
                            }
                            className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            History
                        </button>

                        <button
                            onClick={handleLogoutAndRedirect}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6 py-10">

   
                <div className="mb-8">
                    <button
                        onClick={() =>
                            navigate("/history")
                        }
                        className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Back to Inspection History
                    </button>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                INSPECTION DETAILS
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                {data?.productName ||
                                    "Unknown Product"}
                            </h2>

                            <p className="mt-1 text-slate-500">
                                {data?.brandName ||
                                    "Unknown Brand"}
                            </p>
                        </div>

                        <span
                            className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${
                                isCompliant
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {compliance?.overallStatus ||
                                inspection.status}
                        </span>

                    </div>
                </div>

                <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

                    <h3 className="text-xl font-bold text-slate-900">
                        Compliance Summary
                    </h3>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                        <div className="rounded-xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                Total Checks
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {compliance?.totalRules ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-5">
                            <p className="text-sm text-green-700">
                                Passed
                            </p>
                            <p className="mt-1 text-3xl font-bold text-green-700">
                                {compliance?.passedRules ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-50 p-5">
                            <p className="text-sm text-red-700">
                                Failed
                            </p>
                            <p className="mt-1 text-3xl font-bold text-red-700">
                                {compliance?.failedRules ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-5">
                            <p className="text-sm text-blue-700">
                                Scan Date
                            </p>
                            <p className="mt-1 text-sm font-semibold text-blue-700">
                                {new Date(
                                    inspection.createdAt
                                ).toLocaleString()}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

                    <h3 className="text-xl font-bold text-slate-900">
                        Extracted Product Information
                    </h3>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">

                        <Info
                            label="Product Name"
                            value={data?.productName}
                        />

                        <Info
                            label="Brand Name"
                            value={data?.brandName}
                        />

                        <Info
                            label="MRP"
                            value={data?.mrp}
                        />

                        <Info
                            label="Net Quantity"
                            value={data?.netQuantity}
                        />

                        <Info
                            label="Manufacturer"
                            value={data?.manufacturer}
                        />

                        <Info
                            label="Packer"
                            value={data?.packer}
                        />

                        <Info
                            label="Importer"
                            value={data?.importer}
                        />

                        <Info
                            label="Country of Origin"
                            value={data?.countryOfOrigin}
                        />

                        <Info
                            label="Manufacturing Date"
                            value={data?.manufacturingDate}
                        />

                        <Info
                            label="Packing Date"
                            value={data?.packingDate}
                        />

                        <Info
                            label="Expiry Date"
                            value={data?.expiryDate}
                        />

                        <Info
                            label="Consumer Care"
                            value={data?.consumerCare}
                        />

                        <Info
                            label="Batch Number"
                            value={data?.batchNumber}
                        />

                        <Info
                            label="License Number"
                            value={data?.licenseNumber}
                        />

                    </div>
                </div>

                <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

                    <h3 className="text-xl font-bold text-slate-900">
                        Legal Metrology Validation
                    </h3>

                    <div className="mt-6 space-y-3">

                        {compliance?.results?.map(
                            (rule) => (
                                <div
                                    key={rule.ruleId}
                                    className="flex flex-col justify-between gap-3 rounded-xl border p-5 md:flex-row md:items-center"
                                >

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {rule.label}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Rule ID:{" "}
                                            {rule.ruleId}
                                        </p>

                                        <p className="mt-2 text-sm text-slate-600">
                                            {rule.message}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                                            rule.status ===
                                            "PASS"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {rule.status}
                                    </span>

                                </div>
                            )
                        )}

                    </div>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                    <h3 className="text-xl font-bold text-slate-900">
                        Raw Visible Text
                    </h3>

                    <pre className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-sm text-white">
                        {data?.rawVisibleText ||
                            "No raw text available."}
                    </pre>

                </div>

            </main>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl borde bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900">
                {value || "Not detected"}
            </p>
        </div>
    );
}

export default InspectionDetails;