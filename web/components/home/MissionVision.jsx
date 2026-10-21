export default function MissionVision() {
    return (
        <>
            <section id="mission-vision" className="mission-vision-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-eyebrow">OUR DIRECTION</span>
                        <h2>
                            Purpose Today. <span>Growth Tomorrow.</span>
                        </h2>
                        <p>
                            Our mission and vision guide our commitment to businesses, entrepreneurs and the wider
                            economy.
                        </p>
                    </div>
                    <div className="mission-vision-grid">
                        {/* MISSION */}
                        <article className="direction-card mission-card">
                            <div className="direction-icon">
                                <i className="fa-solid fa-bullseye"></i>
                            </div>
                            <div className="direction-content">
                                <span className="direction-label">OUR MISSION</span>
                                <h3>Connecting Business With Opportunity</h3>
                                <p>
                                    To connect businesses, entrepreneurs and institutions with information, services,
                                    markets, partnerships and opportunities that support business development and
                                    sustainable economic growth.
                                </p>
                                <ul>
                                    <li>
                                        <span>✓</span> Strengthen business connections
                                    </li>
                                    <li>
                                        <span>✓</span> Support enterprise development
                                    </li>
                                    <li>
                                        <span>✓</span> Improve access to opportunities
                                    </li>
                                    <li>
                                        <span>✓</span> Encourage partnerships and collaboration
                                    </li>
                                </ul>
                            </div>
                        </article>
                        {/* VISION */}
                        <article className="direction-card vision-card">
                            <div className="direction-icon">
                                <i className="fa-solid fa-eye"></i>
                            </div>
                            <div className="direction-content">
                                <span className="direction-label">OUR VISION</span>
                                <h3>A Connected and Growing Business Ecosystem</h3>
                                <p>
                                    To contribute to a dynamic business environment where enterprises can connect, grow,
                                    access markets, create opportunities and participate in sustainable economic
                                    development.
                                </p>
                                <ul>
                                    <li>
                                        <span>✓</span> A stronger business community
                                    </li>
                                    <li>
                                        <span>✓</span> Greater market connections
                                    </li>
                                    <li>
                                        <span>✓</span> More business opportunities
                                    </li>
                                    <li>
                                        <span>✓</span> Sustainable economic growth
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
