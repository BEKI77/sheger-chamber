"use client";

import { useCallback, useEffect, useState } from "react";

// Load a list from the API, e.g. useApiList("/api/news", "news").
// Returns { status: "loading" | "ready" | "error", items, error, reload }.
export function useApiList(path, key) {
    const [state, setState] = useState({ status: "loading", items: [], error: null });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelled = false;

        fetch(path, { credentials: "include" })
            .then(async (response) => {
                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error(`Server returned an unexpected response (HTTP ${response.status}).`);
                }
                if (!response.ok || result.success === false) {
                    throw new Error(result.message || `Unable to load ${key}.`);
                }
                return result[key] || [];
            })
            .then((items) => {
                if (!cancelled) setState({ status: "ready", items, error: null });
            })
            .catch((error) => {
                console.error(`Failed to load ${key}:`, error);
                if (!cancelled) setState((previous) => ({ ...previous, status: "error", error }));
            });

        return () => {
            cancelled = true;
        };
    }, [path, key, version]);

    // reload({ showLoading: true }) switches back to the loading state first
    const reload = useCallback((options) => {
        if (options?.showLoading) setState((previous) => ({ ...previous, status: "loading" }));
        setVersion((v) => v + 1);
    }, []);

    return { ...state, reload };
}
