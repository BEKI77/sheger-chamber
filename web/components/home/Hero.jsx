export default function Hero() {
    return (
        <>
            <section id="home" className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <span className="hero-eyebrow">SHAGGAR CHAMBER OF COMMERCE & SECTORAL ASSOCIATION</span>
                        <h1>
                            Connecting Businesses. <span>Creating Opportunities.</span> Building Growth.
                        </h1>
                        <p className="hero-description">
                            We connect businesses, entrepreneurs, investors and institutions to opportunities,
                            partnerships, markets and services that support sustainable economic growth.
                        </p>
                        <div className="hero-buttons">
                            <a href="#membership" className="btn btn-primary">
                                Become a Member
                            </a>{" "}
                            <a href="#services" className="btn btn-secondary">
                                Explore Services
                            </a>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-item">
                                <strong>Business</strong> <span>Connection</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-item">
                                <strong>Market</strong> <span>Opportunities</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-item">
                                <strong>Economic</strong> <span>Growth</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-wrapper">
                            <img
                                src="/image/shaggar-chamber-hero.jpg"
                                alt="Shagar Chamber of Commerce representatives"
                            />
                            <div className="hero-image-overlay"></div>
                        </div>
                        <div className="hero-highlight-card">
                            <span className="highlight-icon">◆</span>
                            <div>
                                <strong>Business & Partnership</strong>
                                <p>Building stronger connections</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
