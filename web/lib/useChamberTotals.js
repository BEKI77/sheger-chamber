"use client";

import { useEffect, useState } from "react";

// Totals shown before any applications were accepted online; each accepted
// (Active) member or partnership from the admin side adds one to these
const BASE_MEMBERS = 84000;
const BASE_PARTNERSHIPS = 120;

// Member and partnership totals for the homepage.
// The base numbers stay visible if the totals can't be loaded.
export function useChamberTotals() {
    const [accepted, setAccepted] = useState({ members: 0, partnerships: 0 });

    useEffect(() => {
        fetch("/api/stats")
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setAccepted({ members: Number(result.members) || 0, partnerships: Number(result.partnerships) || 0 });
                }
            })
            .catch((error) => console.error("Failed to load totals:", error));
    }, []);

    return {
        members: (BASE_MEMBERS + accepted.members).toLocaleString("en-US"),
        partnerships: (BASE_PARTNERSHIPS + accepted.partnerships).toLocaleString("en-US")
    };
}
