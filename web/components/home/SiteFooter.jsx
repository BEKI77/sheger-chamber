import CurrentYear from "@/components/CurrentYear";

const FOOTER_LINKS = [
    ["Chamber", [["#about", "About us"], ["#sectors", "Business sectors"], ["#services", "Services"], ["#membership", "Membership"]]],
    ["What's on", [["#opportunities", "Opportunities & jobs"], ["#events", "Events"], ["#expo", "Expo"], ["#news", "News"]]],
    ["Connect", [["#partnerships", "Partnerships"], ["#contact", "Contact"]]]
];

export default function SiteFooter() {
    return (
        <footer id="site-footer" className="sc-footer">
            <div className="sc-container sc-footer-grid">
                <div className="sc-footer-brand">
                    <a href="#home" className="sc-brand">
                        <span className="sc-brand-logo">
                            <img src="/assets/images/shagar-logo.png" alt="" />
                        </span>
                        <span className="sc-brand-name">Shaggar Chamber</span>
                    </a>
                    <p>
                        Commerce &amp; Sectoral Association — empowering businesses, creating opportunities and building
                        a stronger, more connected business community.
                    </p>
                </div>

                {FOOTER_LINKS.map(([title, links]) => (
                    <nav key={title} aria-label={title}>
                        <h3>{title}</h3>
                        <ul>
                            {links.map(([href, label]) => (
                                <li key={href}>
                                    <a href={href}>{label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="sc-container sc-footer-bottom">
                <p>
                    © <CurrentYear /> Shagar Chamber of Commerce &amp; Sectoral Association. All rights reserved.
                </p>
                <div className="sc-socials">
                    <a href="https://www.facebook.com/SHCCSA" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://t.me/shaggarchamber1365" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-telegram"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
