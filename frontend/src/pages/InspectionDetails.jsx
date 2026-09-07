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

                if (!token) {
                    navigate("/login");
                    return;
                }

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
                console.error(
                    "Inspection Details Error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load inspection."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInspection();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <LoadingScreen message="Loading inspection..." />
        );
    }

    if (error) {
        return (
            <ErrorScreen
                message={error}
                onBack={() => navigate("/history")}
            />
        );
    }

    if (!inspection) {
        return null;
    }

    const data = inspection.extractedData;
    const compliance = inspection.compliance;

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar
                onDashboard={() => navigate("/dashboard")}
                onHistory={() => navigate("/history")}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-6xl px-6 py-10">
                <PageHeader
                    data={data}
                    status={
                        compliance?.overallStatus ||
                        inspection.status
                    }
                    onBack={() => navigate("/history")}
                />

                <ComplianceSummary
                    compliance={compliance}
                    createdAt={inspection.createdAt}
                />

                <ProductInformation data={data} />

                <ValidationDetails
                    results={compliance?.results}
                />

                <RawText data={data} />
            </main>
        </div>
    );
}

function Navbar({ onDashboard, onHistory, onLogout }) {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-xl font-bold text-slate-900">
                    THE_VOID
                </h1>

                <div className="flex gap-3">
                    <NavButton onClick={onDashboard}>
                        Dashboard
                    </NavButton>

                    <NavButton onClick={onHistory}>
                        History
                    </NavButton>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

function NavButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

function PageHeader({ data, status, onBack }) {
    const statusClass =
        status === "PASS" || status === "COMPLIANT"
            ? "bg-green-100 text-green-700"
            : status === "FAIL" || status === "NON_COMPLIANT"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600";

    return (
        <div className="mb-8">
            <button
                type="button"
                onClick={onBack}
                className="mb-4 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900"
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
                    className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${statusClass}`}
                >
                    {status}
                </span>
            </div>
        </div>
    );
}

function ComplianceSummary({ compliance, createdAt }) {
    return (
        <Section title="Compliance Summary">
            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    label="Total Checks"
                    value={compliance?.totalRules ?? 0}
                />

                <SummaryCard
                    label="Passed"
                    value={compliance?.passedRules ?? 0}
                    valueClass="text-green-700"
                    cardClass="bg-green-50"
                />

                <SummaryCard
                    label="Failed"
                    value={compliance?.failedRules ?? 0}
                    valueClass="text-red-700"
                    cardClass="bg-red-50"
                />

                <SummaryCard
                    label="Scan Date"
                    value={formatDate(createdAt)}
                    valueClass="text-blue-700"
                    cardClass="bg-blue-50"
                    smallValue
                />
            </div>
        </Section>
    );
}

function ProductInformation({ data }) {
    const fields = [
        ["Product Name", data?.productName],
        ["Brand Name", data?.brandName],
        ["MRP", data?.mrp],
        ["Net Quantity", data?.netQuantity],
        ["Manufacturer", data?.manufacturer],
        ["Packer", data?.packer],
        ["Importer", data?.importer],
        ["Country of Origin", data?.countryOfOrigin],
        ["Manufacturing Date", data?.manufacturingDate],
        ["Packing Date", data?.packingDate],
        ["Expiry Date", data?.expiryDate],
        ["Consumer Care", data?.consumerCare],
        ["Batch Number", data?.batchNumber],
        ["License Number", data?.licenseNumber]
    ];

    return (
        <Section title="Extracted Product Information">
            <div className="grid gap-4 md:grid-cols-2">
                {fields.map(([label, value]) => (
                    <Info
                        key={label}
                        label={label}
                        value={value}
                    />
                ))}
            </div>
        </Section>
    );
}

function ValidationDetails({ results = [] }) {
    return (
        <Section title="Legal Metrology Validation">
            <div className="space-y-3">
                {results.map((rule) => (
                    <RuleResult
                        key={rule.ruleId}
                        rule={rule}
                    />
                ))}
            </div>
        </Section>
    );
}

function RuleResult({ rule }) {
    const statusClass = {
        PASS: "bg-green-100 text-green-700",
        FAIL: "bg-red-100 text-red-700",
        NOT_APPLICABLE: "bg-slate-100 text-slate-600"
    };

    return (
        <div className="flex flex-col justify-between gap-3 rounded-xl border p-5 md:flex-row md:items-center">
            <div>
                <p className="font-semibold text-slate-900">
                    {rule.label}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Rule ID: {rule.ruleId}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                    {rule.message}
                </p>
            </div>

            <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                    statusClass[rule.status] ||
                    "bg-slate-100 text-slate-600"
                }`}
            >
                {rule.status}
            </span>
        </div>
    );
}

function RawText({ data }) {
    const text = data?.rawVisibleText;

    return (
        <Section title="Raw Visible Text">
            <pre className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-sm text-white">
                {text || "No raw text available."}
            </pre>
        </Section>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900">
                {value || "Not detected"}
            </p>
        </div>
    );
}

function SummaryCard({
    label,
    value,
    valueClass = "text-slate-900",
    cardClass = "bg-slate-50",
    smallValue = false
}) {
    return (
        <div className={`rounded-xl p-5 ${cardClass}`}>
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p
                className={`mt-1 font-bold ${
                    smallValue
                        ? "text-sm"
                        : "text-3xl"
                } ${valueClass}`}
            >
                {value}
            </p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
                {title}
            </h3>

            <div className="mt-6">
                {children}
            </div>
        </div>
    );
}

function LoadingScreen({ message }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-slate-600">
                {message}
            </p>
        </div>
    );
}

function ErrorScreen({ message, onBack }) {
    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onBack}
                    className="mt-4 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to History
                </button>
            </div>
        </div>
    );
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

export default InspectionDetails;