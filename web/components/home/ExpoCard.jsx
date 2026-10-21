export default function ExpoCard({ expo }) {
    const isInternational = expo.type === "International Expo";
    const icon = isInternational ? "fa-globe" : "fa-flag";
    const defaultImage = isInternational ? "/assets/images/international-expo.jpg" : "/assets/images/national-expo.jpg";

    const startDate = expo.start_date ? new Date(expo.start_date).toLocaleDateString() : "";
    const endDate = expo.end_date ? new Date(expo.end_date).toLocaleDateString() : "";
    const dateText = startDate && endDate ? `${startDate} - ${endDate}` : startDate;

    return (
        <article className="sc-expo">
            <img src={expo.image_url || defaultImage} alt={expo.title} />
            <div className="sc-expo-body">
                <div className="sc-expo-text">
                    <span className="sc-expo-type">
                        <i className={`fa-solid ${icon}`}></i> {expo.type}
                    </span>
                    <h3>{expo.title}</h3>
                    <span className="sc-expo-meta">{[dateText, expo.location].filter(Boolean).join(" · ")}</span>
                    {expo.description && <p className="sc-clamp">{expo.description}</p>}
                </div>
                <a
                    href={expo.contact_email ? `mailto:${expo.contact_email}` : "#contact"}
                    className="sc-btn sc-btn-primary"
                >
                    Contact Chamber
                </a>
            </div>
        </article>
    );
}
