"use client";

import { useEffect, useState } from "react";

// The year is filled in by the browser, so a page built last year still shows this year.
export default function CurrentYear() {
    const [year, setYear] = useState(null);
    useEffect(() => setYear(new Date().getFullYear()), []);
    return <span id="current-year">{year}</span>;
}
