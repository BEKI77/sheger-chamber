"use client";

import { useApiList } from "@/lib/useApiList";
import PartnershipCard from "./PartnershipCard";

export default function Partnerships() {
    const { status, items } = useApiList("/api/partnerships", "partnerships");
    const activePartnerships = items.filter((partnership) => partnership.status === "Active");

    return (
        <section id="partnerships" className="sc-section sc-section-white">
            <div className="sc-container">
                <div className="sc-section-head">
                    <div>
                        <span className="sc-eyebrow">Partnerships</span>
                        <h2 className="sc-title">Working with our partners</h2>
                    </div>
                    <a href="#contact" className="sc-link">
                        Become a partner <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                {status === "loading" && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading partners...
                    </p>
                )}
                {status === "error" && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-triangle-exclamation"></i> Unable to load partnerships. Please try
                        again later.
                    </p>
                )}
                {status === "ready" && !activePartnerships.length && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-handshake"></i> Shagar Chamber is building partnerships with
                        businesses, organizations and institutions. Get in touch to become one of the first.
                    </p>
                )}
                {status === "ready" && activePartnerships.length > 0 && (
                    <div id="partnerships-container" className="sc-partners">
                        {activePartnerships.map((partnership) => (
                            <PartnershipCard key={partnership.id} partnership={partnership} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
