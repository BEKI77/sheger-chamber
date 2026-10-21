export default function OpportunityCard({ opportunity }) {
    const deadline = opportunity.application_deadline
        ? new Date(opportunity.application_deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "No deadline specified";

    const isJob = opportunity.category === "Job";
    const isClosed = opportunity.status !== "Open";

    return (
        <article className={isClosed ? "sc-opportunity closed" : "sc-opportunity"}>
            <div className="sc-opportunity-tags">
                <span className={isJob ? "sc-tag sc-tag-blue" : "sc-tag sc-tag-green"}>{opportunity.category}</span>
                <span className={isClosed ? "sc-tag sc-tag-muted" : "sc-tag sc-tag-open"}>{opportunity.status}</span>
            </div>

            <h3>{opportunity.title}</h3>

            {(opportunity.organization || opportunity.location) && (
                <div className="sc-meta">
                    {opportunity.organization && (
                        <span>
                            <i className="fas fa-building"></i> {opportunity.organization}
                        </span>
                    )}
                    {opportunity.location && (
                        <span>
                            <i className="fas fa-location-dot"></i> {opportunity.location}
                        </span>
                    )}
                </div>
            )}

            {opportunity.description && <p className="sc-clamp">{opportunity.description}</p>}

            {opportunity.requirements && (
                <details className="sc-requirements">
                    <summary>Requirements</summary>
                    <p>{opportunity.requirements}</p>
                </details>
            )}

            <div className="sc-opportunity-footer">
                <span className="sc-deadline">
                    <i className="fas fa-calendar"></i> Deadline: {deadline}
                </span>

                <div className="sc-opportunity-actions">
                    {opportunity.contact_email && (
                        <a href={`mailto:${opportunity.contact_email}`} className="sc-link">
                            <i className="fas fa-envelope"></i> Contact
                        </a>
                    )}
                    {opportunity.contact_phone && (
                        <a href={`tel:${opportunity.contact_phone}`} className="sc-link">
                            <i className="fas fa-phone"></i> Call
                        </a>
                    )}
                    {isJob && isClosed && (
                        <span className="sc-btn sc-btn-disabled">
                            <i className="fas fa-lock"></i> Applications closed
                        </span>
                    )}
                    {isJob && !isClosed && (
                        <a href={`/job-application?id=${opportunity.id}`} className="sc-btn sc-btn-primary">
                            Apply now
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
