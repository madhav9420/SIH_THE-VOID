import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function InspectionHistory() {
    const navigate = useNavigate();

    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get("/products/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setInspections(
                        response.data.inspections || []
                    );
                }
            } catch (error) {
                console.error(
                    "Inspection History Error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load inspection history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar
                onDashboard={() => navigate("/dashboard")}
                onScan={() => navigate("/product/upload")}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <PageHeader />

                {loading && (
                    <MessageCard>
                        Loading inspection history...
                    </MessageCard>
                )}

                {error && !loading && (
                    <ErrorCard message={error} />
                )}

                {!loading &&
                    !error &&
                    inspections.length === 0 && (
                        <EmptyState
                            onScan={() =>
                                navigate("/product/upload")
                            }
                        />
                    )}

                {!loading &&
                    !error &&
                    inspections.length > 0 && (
                        <div className="space-y-5">
                            {inspections.map((inspection) => (
                                <InspectionCard
                                    key={inspection._id}
                                    inspection={inspection}
                                    onClick={() =>
                                        navigate(
                                            `/inspection/${inspection._id}`
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
            </main>
        </div>
    );
}

function Navbar({ onDashboard, onScan, onLogout }) {
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
                    <NavButton onClick={onDashboard}>
                        Dashboard
                    </NavButton>

                    <NavButton onClick={onScan}>
                        Scan Product
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
            className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition active:scale-95 hover:bg-white hover:text-black"
        >
            {children}
        </button>
    );
}

function PageHeader() {
    return (
        <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">
                INSPECTION RECORDS
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
                Inspection History
            </h2>

            <p className="mt-2 text-slate-600">
                View your previously scanned products and
                their compliance results.
            </p>
        </div>
    );
}

function InspectionCard({ inspection, onClick }) {
    const complianceStatus =
        inspection.compliance?.overallStatus;

    const status = complianceStatus || inspection.status;

    const statusClass =
        status === "PASS" || status === "COMPLIANT"
            ? "bg-green-100 text-green-700"
            : status === "FAIL" || status === "NON_COMPLIANT"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600";

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        {inspection.extractedData?.productName ||
                            "Unknown Product"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {inspection.extractedData?.brandName ||
                            "Unknown Brand"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <Badge>
                            MRP:{" "}
                            {inspection.extractedData?.mrp ||
                                "N/A"}
                        </Badge>

                        <Badge>
                            Checks:{" "}
                            {inspection.compliance?.totalRules ??
                                0}
                        </Badge>

                        <Badge className="bg-green-50 text-green-700">
                            Passed:{" "}
                            {inspection.compliance?.passedRules ??
                                0}
                        </Badge>

                        <Badge className="bg-red-50 text-red-700">
                            Failed:{" "}
                            {inspection.compliance?.failedRules ??
                                0}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end">
                    <span
                        className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass}`}
                    >
                        {status}
                    </span>

                    <p className="mt-3 text-sm text-slate-500">
                        {formatDate(inspection.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className = "bg-slate-100 text-slate-700" }) {
    return (
        <span
            className={`rounded-lg px-3 py-2 text-sm ${className}`}
        >
            {children}
        </span>
    );
}

function MessageCard({ children }) {
    return (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
                {children}
            </p>
        </div>
    );
}

function ErrorCard({ message }) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-700">
                {message}
            </p>
        </div>
    );
}

function EmptyState({ onScan }) {
    return (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
                No inspections yet
            </h3>

            <p className="mt-2 text-slate-500">
                Scan your first packaged product to create
                an inspection record.
            </p>

            <button
                type="button"
                onClick={onScan}
                className="mt-6 cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white shadow-sm active:scale-95 hover:bg-white hover:text-black"
            >
                Scan Product
            </button>
        </div>
    );
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

export default InspectionHistory;