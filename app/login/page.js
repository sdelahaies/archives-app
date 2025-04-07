"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Clear localStorage when the component mounts
    useEffect(() => {
        localStorage.removeItem("token");
    }, []);


    const handleLogin = async () => {
        setError("");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                router.push("/dashboard");  // Redirect to homepage
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    const handleVisitorAccess = () => {
        router.push("/visitor");  // Redirect to homepage
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-black p-8 rounded shadow-md max-w-sm w-full">
                <img src="/logo.png" alt="Logo" className="h-30 mx-auto mb-4" />
                <h2 className="text-xl mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    className="w-full mb-3 p-2 border rounded"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full bg-gray-500 text-white p-2 rounded mb-3"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <button
                    className="w-full bg-gray-500 text-white p-2 rounded"
                    onClick={handleVisitorAccess}
                >
                    Continue as Visitor
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
