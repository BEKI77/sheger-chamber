export default function ExpoCard({ expo }) {
    const isInternational = expo.type === "International Expo";
    const icon = isInternational ? "fa-globe" : "fa-flag";
    const defaultImage = isInternational ? "/assets/images/international-expo.jpg" : "/assets/images/national-expo.jpg";

    const startDate = expo.start_date ? new Date(expo.start_date).toLocaleDateString() : "";
    const endDate = expo.end_date ? new Date(expo.end_date).toLocaleDateString() : "";
    const dateText = startDate && endDate ? `${startDate} - ${endDate}` : startDate;

    return (
        <article className="expo-card">
            <div className="expo-image">
                <img src={expo.image_url || defaultImage} alt={expo.title} />
                <div className="expo-image-overlay"></div>
                <span className="expo-type">
                    <i className={`fa-solid ${icon}`}></i> {expo.type}
                </span>
            </div>

            <div className="expo-content">
                <h3>{expo.title}</h3>{" "}
                <span className="expo-subtitle">
                    {isInternational
                        ? "GLOBAL CONNECTIONS, PARTNERSHIPS & OPPORTUNITIES"
                        : "SHOWCASING LOCAL BUSINESS, PRODUCTS & OPPORTUNITIES"}
                </span>
                <p>{expo.description}</p>
                <div className="expo-features">
                    {expo.location && (
                        <ExpoFeature icon="fa-solid fa-location-dot" title="Location" text={expo.location} />
                    )}
                    {dateText && <ExpoFeature icon="fa-regular fa-calendar" title="Expo Dates" text={dateText} />}
                    {expo.contact_email && (
                        <ExpoFeature icon="fa-regular fa-envelope" title="Contact" text={expo.contact_email} />
                    )}
                    <ExpoFeature
                        icon="fa-solid fa-chart-line"
                        title="Business Opportunities"
                        text="Discover new opportunities"
                    />
                </div>
                <a href="#contact" className="expo-button">
                    Contact Chamber{" "}
                    <span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </a>
            </div>
        </article>
    );
}

function ExpoFeature({ icon, title, text }) {
    return (
        <div className="expo-feature">
            <i className={icon}></i>
            <div>
                <strong>{title}</strong> <small>{text}</small>
            </div>
        </div>
    );
}
