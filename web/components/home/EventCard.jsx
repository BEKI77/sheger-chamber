export default function EventCard({ event }) {
    const eventDate = event.event_date
        ? new Date(event.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "";
    const eventTime = event.event_time ? event.event_time.substring(0, 5) : "";

    return (
        <article className="events-live-card">
            {event.image_url ? (
                <img src={event.image_url} alt={event.title} className="events-live-image" />
            ) : (
                <div className="events-live-image-placeholder">
                    <i className="fa-solid fa-calendar-days"></i>
                </div>
            )}

            <div className="events-live-content">
                <span className="events-live-category">{event.event_type || "EVENT"}</span>

                <h3>{event.title}</h3>

                <p className="events-live-description">
                    {event.description || "Join Shagar Chamber for this important business event."}
                </p>

                <div className="events-live-meta">
                    {eventDate && (
                        <span>
                            <i className="fa-regular fa-calendar"></i> {eventDate}
                        </span>
                    )}{" "}
                    {eventTime && (
                        <span>
                            <i className="fa-regular fa-clock"></i> {eventTime}
                        </span>
                    )}{" "}
                    {event.location && (
                        <span>
                            <i className="fa-solid fa-location-dot"></i> {event.location}
                        </span>
                    )}{" "}
                    {event.contact_email && (
                        <span>
                            <i className="fa-regular fa-envelope"></i> {event.contact_email}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
