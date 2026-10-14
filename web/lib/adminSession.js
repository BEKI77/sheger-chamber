"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shagar_admin";

function storedAdmin() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

// Checks the admin login with the server. Sends the visitor to the login
// page when they are not signed in. Returns the admin, or null while checking.
export function useAdminSession() {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch("/api/admin/test", { credentials: "include", signal: controller.signal })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));
                if (cancelled) return;
                if (response.ok && data.success) {
                    if (data.admin) {
                        try {
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.admin));
                        } catch {}
                    }
                    setAdmin(data.admin || storedAdmin() || {});
                } else {
                    window.location.href = "/admin/login";
                }
            })
            .catch((error) => {
                if (cancelled) return;
                // Server unreachable: stay on the page; its data requests will show errors
                console.warn("Admin login check unavailable:", error);
                setAdmin(storedAdmin() || {});
            })
            .finally(() => clearTimeout(timeoutId));

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    return admin;
}

export function logoutAdmin() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    fetch("/api/admin/logout", { method: "POST", credentials: "include" })
        .catch(() => {})
        .finally(() => {
            window.location.href = "/admin/login";
        });
}
