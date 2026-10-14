// One contact message with its status and delete buttons
export default function MessageCard({ message, onStatus, onDelete }) {
    return (
        <article className="admin-message-card">
            <div className="admin-message-header">
                <div>
                    <span className={`admin-message-status ${(message.status || "").toLowerCase()}`}>
                        {message.status}
                    </span>
                    <h3>{message.subject}</h3>
                </div>
                <span className="admin-message-date">{new Date(message.created_at).toLocaleString()}</span>
            </div>

            <div className="admin-message-contact">
                <p>
                    <i className="fa-solid fa-user"></i> <strong>{message.full_name}</strong>
                </p>
                <p>
                    <i className="fa-solid fa-envelope"></i> {message.email}
                </p>
                {message.phone && (
                    <p>
                        <i className="fa-solid fa-phone"></i> {message.phone}
                    </p>
                )}
            </div>

            <div className="admin-message-content">
                <p>{message.message}</p>
            </div>

            <div className="admin-message-actions">
                <button type="button" className="admin-status-button" onClick={() => onStatus(message, "Read")}>
                    <i className="fa-solid fa-envelope-open"></i> Mark Read
                </button>{" "}
                <button type="button" className="admin-status-button" onClick={() => onStatus(message, "Replied")}>
                    <i className="fa-solid fa-reply"></i> Mark Replied
                </button>{" "}
                <button type="button" className="admin-delete-button" onClick={() => onDelete(message)}>
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </article>
    );
}
