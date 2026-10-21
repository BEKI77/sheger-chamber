export default function Opportunities() {
    return (
        <>
            <section id="opportunities" className="opportunities-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-eyebrow">BUSINESS OPPORTUNITIES</span>
                        <h2>
                            Find Your Next <span>Business Opportunity</span>
                        </h2>
                        <p>
                            Discover pathways for investment, trade, partnerships, market access and business
                            development.
                        </p>
                    </div>
                    <div className="opportunity-layout">
                        {/* FEATURE */}
                        <div className="opportunity-feature">
                            <div className="opportunity-feature-icon">🚀</div>
                            <span className="opportunity-label">BUSINESS GROWTH</span>
                            <h3>Turning Connections Into Opportunities</h3>
                            <p>
                                Connect with businesses, investors, suppliers, markets and partners through a growing
                                business network.
                            </p>
                        </div>
                        {/* OPPORTUNITY LIST */}
                        <div className="opportunity-list">
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">💰</div>
                                <div>
                                    <h4>Investment Opportunities</h4>
                                    <p>Explore opportunities for investment, enterprise development and expansion.</p>
                                </div>
                            </article>
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">🤝</div>
                                <div>
                                    <h4>Partnership Opportunities</h4>
                                    <p>Connect with potential business and institutional partners.</p>
                                </div>
                            </article>
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">📦</div>
                                <div>
                                    <h4>Trade & Supplier Opportunities</h4>
                                    <p>Discover trade relationships, suppliers and commercial connections.</p>
                                </div>
                            </article>
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">🌍</div>
                                <div>
                                    <h4>Export Opportunities</h4>
                                    <p>
                                        Explore market connections and pathways related to export and international
                                        trade.
                                    </p>
                                </div>
                            </article>
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">🎪</div>
                                <div>
                                    <h4>Expo Opportunities</h4>
                                    <p>Showcase products, meet businesses and connect with potential markets.</p>
                                </div>
                            </article>
                            <article className="opportunity-item">
                                <div className="opportunity-item-icon">🎓</div>
                                <div>
                                    <h4>Training Opportunities</h4>
                                    <p>
                                        Find learning and professional development opportunities for businesses and
                                        teams.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
