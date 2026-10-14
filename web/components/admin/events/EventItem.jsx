function formatDate(value) {
    if (!value) return "Date not specified";
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// "14:30:00" -> "2:30 PM"
function formatTime(value) {
    const parts = String(value).split(":");
    if (parts.length < 2) return value;
    const hour = parseInt(parts[0], 10);
    return `${hour % 12 || 12}:${parts[1]} ${hour >= 12 ? "PM" : "AM"}`;
}

export default function EventItem({ event, onEdit, onDelete }) {
    return (
        <div className="event-item">
            <div className="event-info">
                <h4>{event.title}</h4>
                <div className="event-meta">
                    <span>
                        <i className="fas fa-tag"></i> {event.event_type}
                    </span>{" "}
                    <span>
                        <i className="fas fa-calendar"></i> {formatDate(event.event_date)}
                    </span>{" "}
                    <span>
                        <i className="fas fa-clock"></i>{" "}
                        {event.event_time ? formatTime(event.event_time) : "Time not specified"}
                    </span>{" "}
                    {event.location && (
                        <span>
                            <i className="fas fa-location-dot"></i> {event.location}
                        </span>
                    )}
                </div>
                {event.description && <div className="event-description">{event.description}</div>}
                <span className="event-status">{event.status}</span>
            </div>
            <div className="event-actions">
                <button className="action-btn edit-btn" title="Edit Event" onClick={() => onEdit(event)}>
                    <i className="fas fa-pen"></i>
                </button>{" "}
                <button className="action-btn delete-btn" title="Delete Event" onClick={() => onDelete(event)}>
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}
