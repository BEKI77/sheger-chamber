const CATEGORY_ICONS = {
    Job: "fa-briefcase",
    "Business Opportunity": "fa-building",
    Training: "fa-graduation-cap",
    Tender: "fa-file-contract",
    Other: "fa-circle-info"
};

export default function OpportunityCard({ opportunity }) {
    const deadline = opportunity.application_deadline
        ? new Date(opportunity.application_deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "No deadline specified";

    const icon = CATEGORY_ICONS[opportunity.category] || "fa-briefcase";

    return (
        <article className="job-card">
            <div className="job-card-icon">
                <i className={`fas ${icon}`}></i>
            </div>

            <div className="job-card-content">
                <span className="job-category">{opportunity.category}</span>

                <h3>{opportunity.title}</h3>

                {opportunity.organization && (
                    <p className="job-organization">
                        <i className="fas fa-building"></i> {opportunity.organization}
                    </p>
                )}

                {opportunity.location && (
                    <p className="job-location">
                        <i className="fas fa-location-dot"></i> {opportunity.location}
                    </p>
                )}

                <p className="job-description">{opportunity.description}</p>

                {opportunity.requirements && (
                    <div className="job-requirements">
                        <strong>
                            <i className="fas fa-list-check"></i> Requirements
                        </strong>{" "}
                        <p>{opportunity.requirements}</p>
                    </div>
                )}

                <div className="job-meta">
                    <span>
                        <i className="fas fa-calendar"></i> Deadline: {deadline}
                    </span>{" "}
                    <span className="job-status">
                        <i className="fas fa-circle"></i> {opportunity.status}
                    </span>
                </div>

                {(opportunity.contact_email || opportunity.contact_phone) && (
                    <div className="job-contact">
                        {opportunity.contact_email && (
                            <a href={`mailto:${opportunity.contact_email}`}>
                                <i className="fas fa-envelope"></i> Contact
                            </a>
                        )}{" "}
                        {opportunity.contact_phone && (
                            <a href={`tel:${opportunity.contact_phone}`}>
                                <i className="fas fa-phone"></i> Call
                            </a>
                        )}
                    </div>
                )}

                {opportunity.category === "Job" && (
                    <a href={`/job-application?id=${opportunity.id}`} className="job-apply-button">
                        <i className="fas fa-paper-plane"></i> Apply Now
                    </a>
                )}
            </div>
        </article>
    );
}
