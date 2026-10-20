"use client";

import { useState } from "react";

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", color: undefined });
    const [busy, setBusy] = useState(false);

    function togglePassword() {
        setShowPassword((shown) => !shown);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const username = form.elements.username.value.trim();
        const password = form.elements.password.value;

        setMessage({ text: "Signing in...", color: "#64748b" });
        setBusy(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Login failed. Check your username and password.");
            }

            // The server checks the login; this copy is only for showing account details.
            localStorage.removeItem("shaggar_admin");
            sessionStorage.removeItem("shaggar_admin");
            if (data.admin) localStorage.setItem("shaggar_admin", JSON.stringify(data.admin));

            setMessage({ text: "Login successful. Opening dashboard...", color: "#15803d" });
            window.location.href = "/admin";
        } catch (error) {
            console.error("Admin login error:", error);
            setMessage({ text: error.message || "Unable to contact the login server.", color: "#dc2626" });
            setBusy(false);
        }
    }

    return (
        <main className="login-card">
            <div className="logo">
                <i className="fa-solid fa-building-columns"></i>
            </div>
            <h1>Administrator Login</h1>
            <p className="subtitle">Sign in to manage the Shagar Chamber website.</p>
            <form id="adminLoginForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Admin username</label>
                    <div className="input-wrapper">
                        <i className="fa-solid fa-user"></i>{" "}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <i className="fa-solid fa-lock"></i>{" "}
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />{" "}
                        <i
                            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                            id="togglePassword"
                            role="button"
                            tabIndex={0}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={togglePassword}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    togglePassword();
                                }
                            }}
                        ></i>
                    </div>
                </div>
                <button className="login-button" type="submit" disabled={busy}>
                    <i className="fa-solid fa-right-to-bracket"></i> Sign In
                </button>
                <p
                    id="loginMessage"
                    role="status"
                    aria-live="polite"
                    style={message.color ? { color: message.color } : undefined}
                >
                    {message.text}
                </p>
            </form>
            <a className="back-link" href="/">
                <i className="fa-solid fa-arrow-left"></i> Back to website
            </a>
        </main>
    );
}
