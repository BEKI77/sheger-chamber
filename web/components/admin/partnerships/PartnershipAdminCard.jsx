export default function PartnershipAdminCard({ partnership, onEdit, onDelete }) {
    return (
        <article className="admin-list-card" data-partnership-id={partnership.id}>
            <div className="admin-list-card-content">
                <div className="admin-list-card-header">
                    <div>
                        <span className="admin-status-badge">{partnership.status}</span>{" "}
                        <span className="admin-category-badge">{partnership.partner_type}</span>
                    </div>
                </div>
                <h3>{partnership.partner_name}</h3>
                {partnership.description && <p>{partnership.description}</p>}
                <div className="admin-list-card-meta">
                    {partnership.contact_email && (
                        <span>
                            <i className="fa-regular fa-envelope"></i> {partnership.contact_email}
                        </span>
                    )}{" "}
                    {partnership.contact_phone && (
                        <span>
                            <i className="fa-solid fa-phone"></i> {partnership.contact_phone}
                        </span>
                    )}{" "}
                    {partnership.website_url && (
                        <span>
                            <i className="fa-solid fa-globe"></i> {partnership.website_url}
                        </span>
                    )}
                </div>
                <div className="admin-action-buttons">
                    <button type="button" className="admin-edit-button" onClick={() => onEdit(partnership)}>
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>{" "}
                    <button type="button" className="admin-delete-button" onClick={() => onDelete(partnership)}>
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
