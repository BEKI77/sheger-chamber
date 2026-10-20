"use client";

import { useApiList } from "@/lib/useApiList";
import PartnershipCard from "./PartnershipCard";

export default function Partnerships() {
    const { status, items } = useApiList("/api/partnerships", "partnerships");
    const activePartnerships = items.filter((partnership) => partnership.status === "Active");

    return (
        <>
            {/* ========================================================= PARTNERSHIPS SECTION ========================================================= */}
            <section id="partnerships" className="partnerships-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-label">PARTNERSHIPS</span>
                        <h2>Building Stronger Business Connections</h2>
                        <p>
                            Shagar Chamber connects businesses, organizations, investors and institutions to create
                            meaningful partnerships and opportunities for growth.
                        </p>
                    </div>
                    <div id="partnerships-container" className="partnerships-grid">
                        {status === "loading" && (
                            <>
                                {/* BUSINESS PARTNERSHIPS */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">🤝</div>
                                    <span className="partnership-category">BUSINESS</span>
                                    <h3>Business Partnerships</h3>
                                    <p>
                                        Connect with businesses and entrepreneurs to develop commercial relationships,
                                        joint activities and new business opportunities.
                                    </p>
                                    <a href="#contact" className="partnership-button">
                                        Connect With Us →
                                    </a>
                                </article>
                                {/* INTERNATIONAL PARTNERSHIPS */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">🌍</div>
                                    <span className="partnership-category">INTERNATIONAL</span>
                                    <h3>International Partnerships</h3>
                                    <p>
                                        Build connections with international businesses, organizations and partners to
                                        explore trade and cross-border opportunities.
                                    </p>
                                    <a href="#expo" className="partnership-button">
                                        Explore Opportunities →
                                    </a>
                                </article>
                                {/* CORPORATE PARTNERSHIPS */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">🏢</div>
                                    <span className="partnership-category">CORPORATE</span>
                                    <h3>Corporate Partnerships</h3>
                                    <p>
                                        Create strategic relationships between established companies and the wider
                                        business community through collaboration and shared opportunities.
                                    </p>
                                    <a href="#contact" className="partnership-button">
                                        Become a Partner →
                                    </a>
                                </article>
                                {/* INSTITUTIONAL PARTNERSHIPS */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">🏛️</div>
                                    <span className="partnership-category">INSTITUTIONAL</span>
                                    <h3>Institutional Partnerships</h3>
                                    <p>
                                        Work with institutions and organizations on initiatives that support business
                                        development, sector growth and economic opportunities.
                                    </p>
                                    <a href="#contact" className="partnership-button">
                                        Partner With Us →
                                    </a>
                                </article>
                                {/* INVESTMENT PARTNERSHIPS */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">💰</div>
                                    <span className="partnership-category">INVESTMENT</span>
                                    <h3>Investment Connections</h3>
                                    <p>
                                        Connect businesses and potential investors while creating opportunities for
                                        investment, expansion and business development.
                                    </p>
                                    <a href="#opportunities" className="partnership-button">
                                        View Opportunities →
                                    </a>
                                </article>
                                {/* STRATEGIC COLLABORATION */}
                                <article className="partnership-card">
                                    <div className="partnership-icon">🔗</div>
                                    <span className="partnership-category">STRATEGIC</span>
                                    <h3>Strategic Collaboration</h3>
                                    <p>
                                        Develop long-term collaboration with businesses and organizations around shared
                                        goals, knowledge exchange and mutual opportunities.
                                    </p>
                                    <a href="#contact" className="partnership-button">
                                        Start a Conversation →
                                    </a>
                                </article>
                            </>
                        )}
                        {status === "error" && (
                            <div className="partnership-empty-state">
                                <div className="partnership-empty-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h3>Unable to Load Partnerships</h3>
                                <p>Please try again later.</p>
                            </div>
                        )}
                        {status === "ready" && !activePartnerships.length && (
                            <div className="partnership-empty-state">
                                <div className="partnership-empty-icon">
                                    <i className="fa-solid fa-handshake"></i>
                                </div>
                                <h3>Partnerships Coming Soon</h3>
                                <p>
                                    Shagar Chamber is building strong partnerships with businesses, organizations and
                                    institutions.
                                </p>
                            </div>
                        )}
                        {status === "ready" &&
                            activePartnerships.map((partnership) => (
                                <PartnershipCard key={partnership.id} partnership={partnership} />
                            ))}
                    </div>
                    {/* PARTNERSHIP CTA */}
                    <div className="partnerships-highlight">
                        <div className="partnerships-highlight-icon">🤝</div>
                        <div className="partnerships-highlight-content">
                            <span className="section-label">PARTNER WITH SHAGGAR CHAMBER</span>
                            <h3>Let's Create Opportunities Together</h3>
                            <p>
                                Whether you are a business, investor, organization or institution, connect with Shagar
                                Chamber to explore partnership and collaboration opportunities.
                            </p>
                        </div>
                        <a href="#contact" className="partnerships-highlight-button">
                            Become a Partner →
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
