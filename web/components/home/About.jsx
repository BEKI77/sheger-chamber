export default function About() {
    return (
        <>
            <section id="about" className="about-section">
                <div className="container about-container">
                    <div className="about-content">
                        <span className="section-eyebrow">ABOUT SHAGAR CHAMBER</span>
                        <h2>
                            Building a Stronger <span>Business Community</span>
                        </h2>
                        <p className="about-lead">
                            Shagar Chamber of Commerce & Sectoral Association works to connect businesses, entrepreneurs
                            and institutions with opportunities that support business development and economic growth.
                        </p>
                        <p>
                            The Chamber provides a platform for businesses across different sectors to connect, exchange
                            knowledge, discover markets, develop partnerships and access services that can strengthen
                            their operations.
                        </p>
                        <p>
                            Through business networking, information sharing, training, market connections, advocacy and
                            collaboration, the Chamber seeks to contribute to a more productive and connected business
                            environment.
                        </p>
                        <a href="#services" className="about-link">
                            Discover Our Services <span>→</span>
                        </a>
                    </div>
                    {/* CHAMBER LEADERSHIP */}
                    <div className="about-leadership">
                        <span className="section-eyebrow">OUR LEADERSHIP</span>
                        <h3>Meet Our Leaders</h3>
                        <div className="leadership-grid">
                            <div className="leader-card">
                                <div className="leader-image-wrapper">
                                    <img
                                        src="/assets/images/president-mulgeta-mulisa.png"
                                        alt="Dr. Mulgeta Mulisa, President of Shagar Chamber"
                                        className="leader-image"
                                    />
                                </div>
                                <div className="leader-info">
                                    <h4>Dr. Mulgeta Mulisa</h4>
                                    <p>President</p>
                                </div>
                            </div>
                            <div className="leader-card">
                                <div className="leader-image-wrapper">
                                    <img
                                        src="/assets/images/vice-president-adisu-fufa.png"
                                        alt="Engineer Adisu Fufa, Vice President of Shagar Chamber"
                                        className="leader-image"
                                    />
                                </div>
                                <div className="leader-info">
                                    <h4>Engineer Adisu Fufa</h4>
                                    <p>Vice President</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-highlights">
                        <div className="about-card about-card-featured">
                            <div className="about-card-icon">◆</div>
                            <div>
                                <h3>Business Connection</h3>
                                <p>Bringing businesses and stakeholders together to build meaningful connections.</p>
                            </div>
                        </div>
                        <div className="about-card">
                            <div className="about-card-icon">◆</div>
                            <div>
                                <h3>Market Opportunities</h3>
                                <p>Supporting access to business, trade and market opportunities.</p>
                            </div>
                        </div>
                        <div className="about-card">
                            <div className="about-card-icon">◆</div>
                            <div>
                                <h3>Business Development</h3>
                                <p>Encouraging enterprise growth, knowledge sharing and professional development.</p>
                            </div>
                        </div>
                        <div className="about-card">
                            <div className="about-card-icon">◆</div>
                            <div>
                                <h3>Partnership</h3>
                                <p>Creating opportunities for collaboration between businesses and institutions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
