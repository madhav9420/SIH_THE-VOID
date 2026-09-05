import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            if (response.data.success) {
        
                localStorage.setItem(
                    "token",
                    response.data.token
                );

              
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                navigate("/dashboard");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2x">

            
                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-slate-900">
                        THE_VOID
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Legal Metrology Compliance System
                    </p>

                </div>

                <h2 className="mb-1 text-2xl font-semibold text-slate-900">
                    Welcome Back
                </h2>

                <p className="mb-6 text-sm text-slate-500">
                    Login to access the inspection system.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                  
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                  
                    <button
                        type="submit"
                        disabled={loading}
                        className="active:scale-95 cursor-pointer w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-gray-200 hover:text-black shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            
                <p className="mt-6 text-center text-sm text-slate-500">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Create Account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;