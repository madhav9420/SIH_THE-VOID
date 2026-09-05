import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);

            } catch (error) {
                console.error(error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setError("Session expired. Please login again.");

                setTimeout(() => {
                    navigate("/login");
                }, 1500);

            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get(
            "/products/stats",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            setStats(response.data.stats);
        }

    } catch (error) {
        console.error(
            "Stats Error:",
            error
        );
    } finally {
        setStatsLoading(false);
    }
        };

        getProfile();
        fetchStats();
             
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-red-600">
                    {error}
                </p>
            </div>
        );
    }

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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/product/upload")}
                            className="rounded-lg bg-black active:scale-95 px-5 py-2 text-sm h-9 text-white shadow-sm transition hover:bg-white hover:text-black "
                        >
                            Scan Product
                        </button>

                        <button 
                            onClick={() => navigate("/history")}
                            className="active:scale-95 cursor-pointer shadow-sm rounded-lg px-4 py-2 text-sm font-medium bg-black text-white hover:text-black hover:bg-white"
                        >
                            Inspection History
                        </button>

                        <button
                            onClick={handleLogout}
                            className="active:scale-95 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-black shadow-sm"
                        >
                            Logout
                        </button>   
                    </div>

                    

                </div>
            </nav>

       
            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="mb-8">
                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900">
                        {user?.name}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        {user?.email}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Scans
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {statsLoading
                                ? "..."
                                : stats?.totalScans ?? 0}
                        </p>
                    </div>


                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Compliant
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {statsLoading
                                ? "..."
                                : stats?.compliant ?? 0}
                        </p>
                    </div>


                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Non-Compliant
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {statsLoading
                                ? "..."
                                : stats?.nonCompliant ?? 0}
                        </p>
                    </div>


                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Compliance Rate
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {statsLoading
                                ? "..."
                                : `${stats?.complianceRate ?? 0}%`}
                        </p>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default Dashboard;