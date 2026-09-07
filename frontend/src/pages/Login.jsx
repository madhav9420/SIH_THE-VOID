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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            if (!response.data.success) {
                setError(
                    response.data.message || "Login failed"
                );
                return;
            }

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
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
        <AuthLayout>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    LabelCheck
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
                <Alert type="error">
                    {error}
                </Alert>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />

                <SubmitButton loading={loading}>
                    Login
                </SubmitButton>
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
        </AuthLayout>
    );
}

function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                {children}
            </div>
        </div>
    );
}

function Input({
    label,
    type,
    name,
    value,
    onChange,
    placeholder
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
        </div>
    );
}

function SubmitButton({ loading, children }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-slate-900 px-4 py-3 font-medium text-white shadow-lg transition hover:bg-slate-200 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Logging in..." : children}
        </button>
    );
}

function Alert({ type, children }) {
    const styles =
        type === "error"
            ? "bg-red-50 text-red-600"
            : "bg-green-50 text-green-600";

    return (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${styles}`}>
            {children}
        </div>
    );
}

export default Login;