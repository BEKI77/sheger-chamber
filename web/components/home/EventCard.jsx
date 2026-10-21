export default function EventCard({ event }) {
    const date = event.event_date ? new Date(event.event_date) : null;
    const month = date ? date.toLocaleDateString("en-US", { month: "short" }) : "";
    const day = date ? date.toLocaleDateString("en-US", { day: "numeric" }) : "";
    const eventTime = event.event_time ? event.event_time.substring(0, 5) : "";

    return (
        <article className="sc-event">
            {date ? (
                <span className="sc-event-date">
                    <small>{month}</small>
                    <strong>{day}</strong>
                </span>
            ) : (
                <span className="sc-event-date">
                    <i className="fa-solid fa-calendar-days"></i>
                </span>
            )}

            <div className="sc-event-body">
                <span className="sc-tag sc-tag-blue">{event.event_type || "Event"}</span>
                <h3>{event.title}</h3>
                {event.description && <p className="sc-clamp">{event.description}</p>}
                <div className="sc-meta">
                    {eventTime && (
                        <span>
                            <i className="fa-regular fa-clock"></i> {eventTime}
                        </span>
                    )}
                    {event.location && (
                        <span>
                            <i className="fa-solid fa-location-dot"></i> {event.location}
                        </span>
                    )}
                    {event.contact_email && (
                        <a href={`mailto:${event.contact_email}`}>
                            <i className="fa-regular fa-envelope"></i> {event.contact_email}
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
