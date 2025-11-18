"use client";

import React, { useState } from "react";

export default function AdminLogin() {
    const [username, setUser] = useState("");
    const [password, setPass] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch("http://localhost:4000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return setError(data.error);
        }

        localStorage.setItem("admin_token", data.token);
        window.location.href = "/dashboard"; // ไปหน้า dashboard
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border">

                <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Admin Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="w-full border p-2 rounded-lg"
                        placeholder="Username"
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <input
                        className="w-full border p-2 rounded-lg"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPass(e.target.value)}
                    />

                    <button className="w-full bg-[#d4af37] text-white py-2 rounded-lg hover:bg-[#b99730] transition">
                        Login
                    </button>
                </form>

                {error && <p className="text-red-600 text-center mt-3">{error}</p>}
            </div>
        </div>
    );
}
