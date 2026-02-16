"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ เก็บ token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/admin/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Admin Access</h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Sign in to continue</p>
                </div>

                {error && (
                    <div className="text-red-500 mb-6 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                        required
                        placeholder="Enter your username"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                        required
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-black text-sm py-4 px-4 rounded-2xl hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest"
                >
                    LOGIN TO DASHBOARD
                </button>
            </form>
        </div>
    );
}