function partnerIcon(partnerType) {
    const type = (partnerType || "").toLowerCase();
    if (type.includes("bank")) return "fa-building-columns";
    if (type.includes("government")) return "fa-landmark";
    if (type.includes("company")) return "fa-building";
    if (type.includes("ngo")) return "fa-people-group";
    if (type.includes("international")) return "fa-globe";
    if (type.includes("association")) return "fa-users";
    return "fa-handshake";
}

export default function PartnershipCard({ partnership }) {
    return (
        <article className="partnership-card">
            <div className="partnership-icon">
                <i className={`fa-solid ${partnerIcon(partnership.partner_type)}`}></i>
            </div>

            <span className="partnership-category">{partnership.partner_type}</span>

            <h3>{partnership.partner_name}</h3>

            <p>
                {partnership.description ||
                    "Working with Shagar Chamber to support business growth and economic opportunities."}
            </p>

            {partnership.website_url ? (
                <a
                    href={partnership.website_url}
                    className="partnership-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit Partner <i className="fa-solid fa-arrow-right"></i>
                </a>
            ) : (
                <a href="#contact" className="partnership-button">
                    Connect With Us <i className="fa-solid fa-arrow-right"></i>
                </a>
            )}
        </article>
    );
}
