"use client";

import { useChamberTotals } from "@/lib/useChamberTotals";

const QUICK_ACTIONS = [
    ["#membership", "Apply for membership", "Trader 1,000 ETB · PLC 5,000 ETB"],
    ["#opportunities", "Browse jobs & opportunities", "Openings from member businesses"],
    ["#events", "Events & expos", "National and international expos"]
];

export default function Hero() {
    const totals = useChamberTotals();

    return (
        <section id="home" className="sc-hero">
            <div className="sc-container sc-hero-grid">
                <div className="sc-hero-content">
                    <span className="sc-hero-pill">
                        <span className="sc-dot"></span> Membership applications open online
                    </span>
                    <h1>
                        Connecting businesses. <span>Creating opportunities.</span> Building growth.
                    </h1>
                    <p>
                        Shaggar Chamber of Commerce &amp; Sectoral Association connects businesses, entrepreneurs,
                        investors and institutions to markets, partners and services.
                    </p>
                    <div className="sc-hero-buttons">
                        <a href="#membership" className="sc-btn sc-btn-primary sc-btn-lg">
                            Become a member
                        </a>
                        <a href="#services" className="sc-btn sc-btn-ghost sc-btn-lg">
                            Explore services
                        </a>
                    </div>
                </div>

                <div className="sc-hero-visual">
                    <img src="/image/shagar-chamber-hero.jpg" alt="Shagar Chamber of Commerce representatives" />
                    <div className="sc-hero-stats">
                        <div>
                            <strong>{totals.members}+</strong>
                            <span>members</span>
                        </div>
                        <div>
                            <strong>{totals.partnerships}+</strong>
                            <span>partnerships</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="sc-container sc-quick-actions">
                {QUICK_ACTIONS.map(([href, title, text]) => (
                    <a key={title} href={href} className="sc-quick-action">
                        <span>
                            <strong>{title}</strong>
                            <small>{text}</small>
                        </span>
                        <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                ))}
            </div>
        </section>
    );
}
