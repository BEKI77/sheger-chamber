export default function ExpoAdminCard({ expo, onEdit, onDelete }) {
    const startDate = expo.start_date ? new Date(expo.start_date).toLocaleDateString() : "Not set";
    const endDate = expo.end_date ? new Date(expo.end_date).toLocaleDateString() : "Not set";

    return (
        <article className="admin-list-card" data-expo-id={expo.id}>
            <div className="admin-list-card-content">
                <div className="admin-list-card-header">
                    <div>
                        <span className="admin-status-badge">{expo.status}</span>{" "}
                        <span className="admin-category-badge">{expo.type}</span>
                    </div>
                </div>
                <h3>{expo.title}</h3>
                <p>{expo.description}</p>
                <div className="admin-list-card-meta">
                    {expo.location && (
                        <span>
                            <i className="fa-solid fa-location-dot"></i> {expo.location}
                        </span>
                    )}{" "}
                    <span>
                        <i className="fa-regular fa-calendar"></i> {startDate}
                        {expo.end_date ? ` - ${endDate}` : ""}
                    </span>{" "}
                    {expo.contact_email && (
                        <span>
                            <i className="fa-regular fa-envelope"></i> {expo.contact_email}
                        </span>
                    )}
                </div>
                <div className="admin-action-buttons">
                    <button type="button" className="admin-edit-button" onClick={() => onEdit(expo)}>
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>{" "}
                    <button type="button" className="admin-delete-button" onClick={() => onDelete(expo)}>
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
