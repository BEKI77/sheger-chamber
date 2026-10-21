const LEADERS = [
    ["/assets/images/president-mulgeta-mulisa.png", "Dr. Mulgeta Mulisa", "President"],
    ["/assets/images/vice-president-adisu-fufa.png", "Engineer Adisu Fufa", "Vice President"]
];

const VALUES = ["Integrity", "Collaboration", "Innovation", "Professionalism", "Opportunity", "Growth"];

// About, leadership, mission, vision and values as one bento grid
export default function About() {
    return (
        <section id="about" className="sc-section">
            <div className="sc-container">
                <span className="sc-eyebrow">About the Chamber</span>
                <h2 className="sc-title sc-about-title">
                    A platform for every business in Shaggar to connect, learn and grow.
                </h2>

                <div className="sc-bento">
                    <div className="sc-tile sc-tile-wide sc-leadership">
                        <div className="sc-leadership-intro">
                            <span className="sc-eyebrow">Leadership</span>
                            <p>
                                The Chamber gives businesses across every sector a place to connect, exchange knowledge,
                                discover markets and build partnerships — through networking, training, market
                                connections and advocacy.
                            </p>
                        </div>
                        {LEADERS.map(([image, name, role]) => (
                            <figure key={name} className="sc-leader">
                                <img src={image} alt={`${name}, ${role} of Shagar Chamber`} />
                                <figcaption>
                                    <strong>{name}</strong>
                                    <span>{role}</span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>

                    <div className="sc-tile sc-tile-green">
                        <span className="sc-tile-label">Our mission</span>
                        <p>
                            To connect businesses, entrepreneurs and institutions with information, services, markets
                            and partnerships that support business development and sustainable economic growth.
                        </p>
                    </div>

                    <div className="sc-tile sc-tile-blue">
                        <span className="sc-tile-label">Our vision</span>
                        <p>
                            A dynamic, connected business environment where enterprises grow, reach new markets and take
                            part in sustainable economic development.
                        </p>
                    </div>

                    <div className="sc-tile sc-tile-wide">
                        <span className="sc-eyebrow">Our values</span>
                        <ul className="sc-values">
                            {VALUES.map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
