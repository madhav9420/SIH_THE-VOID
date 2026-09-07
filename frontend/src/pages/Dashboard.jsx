import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);
            } catch (error) {
                console.error("Profile Error:", error.message);

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
                const response = await api.get("/products/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error("Stats Error:", error.message);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchProfile();
        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <LoadingScreen message="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar
                onScan={() => navigate("/product/upload")}
                onHistory={() => navigate("/history")}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900">
                        {user?.name || "User"}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        {user?.email}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Scans"
                        value={
                            statsLoading
                                ? "..."
                                : stats?.totalScans ?? 0
                        }
                    />

                    <StatCard
                        label="Compliant"
                        value={
                            statsLoading
                                ? "..."
                                : stats?.compliant ?? 0
                        }
                        valueClass="text-green-600"
                    />

                    <StatCard
                        label="Non-Compliant"
                        value={
                            statsLoading
                                ? "..."
                                : stats?.nonCompliant ?? 0
                        }
                        valueClass="text-red-600"
                    />

                    <StatCard
                        label="Compliance Rate"
                        value={
                            statsLoading
                                ? "..."
                                : `${stats?.complianceRate ?? 0}%`
                        }
                        valueClass="text-blue-600"
                    />
                </div>
            </main>
        </div>
    );
}

function Navbar({ onScan, onHistory, onLogout }) {
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

                <div className="flex items-center gap-4">
                    <NavButton onClick={onScan}>
                        Scan Product
                    </NavButton>

                    <NavButton onClick={onHistory}>
                        Inspection History
                    </NavButton>

                    <NavButton onClick={onLogout}>
                        Logout
                    </NavButton>
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

function StatCard({
    label,
    value,
    valueClass = "text-slate-900"
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
                {value}
            </p>
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

function ErrorScreen({ message }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-red-600">
                {message}
            </p>
        </div>
    );
}

export default Dashboard;