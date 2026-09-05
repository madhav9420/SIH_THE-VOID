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

                const response = await api.get(
                    "/products/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setInspections(
                        response.data.inspections
                    );
                }

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load inspection history."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
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
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-lg px-4 py-2 text-sm font-medium active:scale-95 text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/product/upload")
                            }
                            className="rounded-lg px-4 py-2 text-sm font-medium active:scale-95 text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer"
                        >
                            Scan Product
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-10">

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

         
                {loading && (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-600">
                            Loading inspection history...
                        </p>
                    </div>
                )}

                {error && !loading && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <p className="font-medium text-red-700">
                            {error}
                        </p>
                    </div>
                )}

        
                {!loading &&
                    !error &&
                    inspections.length === 0 && (
                        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

                            <h3 className="text-xl font-semibold text-slate-900">
                                No inspections yet
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Scan your first packaged product
                                to create an inspection record.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/product/upload")
                                }
                                className="mt-6 rounded-lg px-5 py-3 font-medium active:scale-95 text-white hover:text-black bg-black hover:bg-white shadow-sm cursor-pointer"
                            >
                                Scan Product
                            </button>

                        </div>
                    )}

               
                {!loading &&
                    !error &
                    inspections.length > 0 && (

                        <div className="space-y-5">

                            {inspections.map((inspection) => {

                                const isCompliant =
                                    inspection.compliance
                                        ?.overallStatus === "PASS";

                                return (
                                    <div
                                        key={inspection._id}
                                        onClick={() =>
                                            navigate(`/inspection/${inspection._id}`)
                                        }
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

                                                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                                                        MRP:{" "}
                                                        {inspection.extractedData?.mrp ||
                                                            "N/A"}
                                                    </span>

                                                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                                                        Checks:{" "}
                                                        {inspection.compliance?.totalRules ||
                                                            0}
                                                    </span>

                                                    <span className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                                                        Passed:{" "}
                                                        {inspection.compliance?.passedRules ||
                                                            0}
                                                    </span>

                                                    <span className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                                        Failed:{" "}
                                                        {inspection.compliance?.failedRules ||
                                                            0}
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="flex flex-col items-start md:items-end">

                                                <span
                                                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                                                        isCompliant
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {inspection.compliance
                                                        ?.overallStatus ||
                                                        inspection.status}
                                                </span>

                                                <p className="mt-3 text-sm text-slate-500">
                                                    {formatDate(
                                                        inspection.createdAt
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

            </main>
        </div>
    );
}

export default InspectionHistory;