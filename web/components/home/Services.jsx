const SERVICES = [
    ["Membership services", "Access to the Chamber community, business information and networking."],
    ["Business training", "Training that strengthens business knowledge, skills and professional development."],
    ["Business networking", "Meaningful connections with businesses, entrepreneurs, institutions and partners."],
    ["Business advocacy", "Dialogue on the issues that affect businesses and the wider business environment."],
    ["Business opportunities", "Business, partnership, investment, trade and market opportunities."],
    ["Business information", "Useful information that supports planning, decision-making and growth."],
    ["Market information", "Insight into markets, buyers and suppliers for your products and services."],
    ["Business consultation", "Guidance from the Chamber on the questions your business is facing."]
];

export default function Services() {
    return (
        <section id="services" className="sc-section">
            <div className="sc-container">
                <div className="sc-section-head">
                    <div>
                        <span className="sc-eyebrow">Services</span>
                        <h2 className="sc-title">What members get</h2>
                    </div>
                    <a href="#contact" className="sc-link">
                        Ask about a service <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div className="sc-services">
                    {SERVICES.map(([title, text], index) => (
                        <article key={title} className="sc-service">
                            <span className="sc-service-number">{String(index + 1).padStart(2, "0")}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
