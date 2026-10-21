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
        <article className="sc-partner">
            <div className="sc-partner-head">
                <span className="sc-partner-icon">
                    <i className={`fa-solid ${partnerIcon(partnership.partner_type)}`}></i>
                </span>
                <div>
                    <h3>{partnership.partner_name}</h3>
                    {partnership.partner_type && <span className="sc-partner-type">{partnership.partner_type}</span>}
                </div>
            </div>

            {partnership.description && <p className="sc-clamp">{partnership.description}</p>}

            {partnership.website_url && (
                <a href={partnership.website_url} className="sc-link" target="_blank" rel="noopener noreferrer">
                    Visit partner <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            )}
        </article>
    );
}
