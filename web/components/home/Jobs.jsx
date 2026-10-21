"use client";

import { useState } from "react";
import { useApiList } from "@/lib/useApiList";
import OpportunityCard from "./OpportunityCard";

const PAGE_SIZE = 4;

export default function Jobs() {
    const { status, items } = useApiList("/api/opportunities", "opportunities");
    const [visible, setVisible] = useState(PAGE_SIZE);
    // Closed opportunities stay listed (marked closed) after the open ones.
    const visibleOpportunities = [
        ...items.filter((opportunity) => opportunity.status === "Open"),
        ...items.filter((opportunity) => opportunity.status === "Closed")
    ];

    return (
        <div id="jobs" className="sc-hub-block">
            <div className="sc-hub-head">
                <h2>Opportunities &amp; jobs</h2>
            </div>

            {status === "loading" && (
                <p className="sc-empty">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading opportunities...
                </p>
            )}
            {status === "error" && (
                <p className="sc-empty">
                    <i className="fas fa-triangle-exclamation"></i> Unable to load opportunities. Please try again
                    later.
                </p>
            )}
            {status === "ready" && !visibleOpportunities.length && (
                <p className="sc-empty">
                    <i className="fas fa-briefcase"></i> There are currently no opportunities. Please check back later.
                </p>
            )}
            {status === "ready" &&
                visibleOpportunities
                    .slice(0, visible)
                    .map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}

            {visibleOpportunities.length > visible && (
                <button type="button" className="sc-btn sc-btn-outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                    Show more opportunities <i className="fa-solid fa-chevron-down"></i>
                </button>
            )}
        </div>
    );
}
