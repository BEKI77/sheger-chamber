export default function Sectors() {
    return (
        <>
            <section id="sectors" className="sectors-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-eyebrow">BUSINESS SECTORS</span>
                        <h2>
                            Supporting Businesses <span>Across Key Sectors</span>
                        </h2>
                        <p>
                            We support businesses and entrepreneurs across diverse sectors while creating connections,
                            opportunities and pathways for growth.
                        </p>
                    </div>
                    <div className="sectors-grid">
                        {/* AGRICULTURE */}
                        <article className="sector-card sector-featured">
                            <div className="sector-icon">🌾</div>
                            <div className="sector-content">
                                <span className="sector-number">01</span>
                                <h3>Agriculture</h3>
                                <p>
                                    Supporting agricultural businesses, producers, processors, traders and value-chain
                                    opportunities.
                                </p>
                            </div>
                        </article>
                        {/* Investment */}
                        <article className="sector-card">
                            <div className="sector-icon">🏭</div>
                            <div className="sector-content">
                                <span className="sector-number">02</span>
                                <h3>Investment</h3>
                                <p>
                                    Connecting manufacturers with markets, suppliers, partnerships and business
                                    development opportunities.
                                </p>
                            </div>
                        </article>
                        {/* CONSTRUCTION */}
                        <article className="sector-card">
                            <div className="sector-icon">🏗️</div>
                            <div className="sector-content">
                                <span className="sector-number">03</span>
                                <h3>Construction</h3>
                                <p>
                                    Supporting construction enterprises, contractors, suppliers and related business
                                    activities.
                                </p>
                            </div>
                        </article>
                        {/* TRADE */}
                        <article className="sector-card">
                            <div className="sector-icon">🛒</div>
                            <div className="sector-content">
                                <span className="sector-number">04</span>
                                <h3>Trade</h3>
                                <p>
                                    Helping traders and retailers discover markets, connections and opportunities for
                                    business expansion.
                                </p>
                            </div>
                        </article>
                        {/* ICT */}
                        <article className="sector-card">
                            <div className="sector-icon">💻</div>
                            <div className="sector-content">
                                <span className="sector-number">05</span>
                                <h3>ICT & Technology</h3>
                                <p>
                                    Promoting technology-driven businesses, digital solutions, innovation and technology
                                    partnerships.
                                </p>
                            </div>
                        </article>
                        {/* TOURISM */}
                        <article className="sector-card">
                            <div className="sector-icon">🏨</div>
                            <div className="sector-content">
                                <span className="sector-number">06</span>
                                <h3>Tourism & Hospitality</h3>
                                <p>
                                    Supporting hospitality businesses, tourism enterprises and opportunities across the
                                    visitor economy.
                                </p>
                            </div>
                        </article>
                        {/* TRANSPORT */}
                        <article className="sector-card">
                            <div className="sector-icon">🚚</div>
                            <div className="sector-content">
                                <span className="sector-number">07</span>
                                <h3>Transport & Logistics</h3>
                                <p>
                                    Connecting logistics and transport businesses with trade, supply-chain and
                                    partnership opportunities.
                                </p>
                            </div>
                        </article>
                        {/* administration */}
                        <article className="sector-card">
                            <i className="fas fa-building-columns"></i>
                            <div className="sector-content">
                                <span className="sector-number">07</span>
                                <h3>administration</h3>
                                <p>
                                    Supporting efficient administration, organizational development, public-private
                                    collaboration, and business-friendly services that contribute to sustainable
                                    economic growth.
                                </p>
                            </div>
                        </article>
                        {/* Office of Job Creation and Skills */}
                        <article className="sector-card">
                            <i className="fas fa-briefcase"></i>
                            <div className="sector-content">
                                <span className="sector-number">07</span>
                                <h3>Office of Job Creation and Skills</h3>
                                <p>
                                    Supporting job creation, workforce development, entrepreneurship, and skills
                                    training to expand employment opportunities and strengthen the capabilities of
                                    businesses and communities.
                                </p>
                            </div>
                        </article>
                        {/* REVENUE */}
                        <article className="sector-card">
                            <div className="sector-icon">💰</div>
                            <div className="sector-content">
                                <span className="sector-number">08</span>
                                <h3>Revenue</h3>
                                <p>
                                    Supporting revenue-related business activities and opportunities that contribute to
                                    sustainable enterprise growth.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
