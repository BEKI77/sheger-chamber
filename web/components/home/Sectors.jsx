const SECTORS = [
    "Agriculture",
    "Investment",
    "Construction",
    "Trade",
    "ICT & Technology",
    "Tourism & Hospitality",
    "Transport & Logistics",
    "Administration",
    "Job Creation & Skills",
    "Revenue",
    "Service Sector"
];

export default function Sectors() {
    return (
        <section id="sectors" className="sc-section sc-section-white">
            <div className="sc-container sc-sectors">
                <div>
                    <span className="sc-eyebrow">{SECTORS.length} sector associations</span>
                    <h2 className="sc-title">Find your sector</h2>
                    <p className="sc-lead">
                        Every member belongs to a sector association with its own network, events and opportunities.
                    </p>
                </div>
                <ul className="sc-chips">
                    {SECTORS.map((sector) => (
                        <li key={sector}>{sector}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
