import CurrentYear from "@/components/CurrentYear";

export default function SiteFooter() {
    return (
        <>
            <footer id="site-footer">
                <div className="footer-main">
                    <div className="container">
                        <div className="footer-grid">
                            {/* Brand */}
                            <div className="footer-brand">
                                <div className="footer-logo">
                                    <div className="footer-logo-icon">
                                        <i className="fas fa-building-columns"></i>
                                    </div>
                                    <div>
                                        <h2>Shagar Chamber</h2>
                                        <span>Commerce & Sectoral Association</span>
                                    </div>
                                </div>
                                <p>
                                    Empowering businesses, creating opportunities, and building a stronger and more
                                    connected business community.
                                </p>
                            </div>
                            {/* Quick Links */}
                            <div className="footer-column">
                                <h3>Quick Links</h3>
                                <ul>
                                    <li>
                                        <a href="#home">
                                            <i className="fas fa-angle-right"></i> Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#about">
                                            <i className="fas fa-angle-right"></i> About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#services">
                                            <i className="fas fa-angle-right"></i> Services
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#events">
                                            <i className="fas fa-angle-right"></i> Events
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#news">
                                            <i className="fas fa-angle-right"></i> News
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#contact">
                                            <i className="fas fa-angle-right"></i> Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* Chamber */}
                            <div className="footer-column">
                                <h3>Chamber</h3>
                                <ul>
                                    <li>
                                        <a href="#membership">
                                            <i className="fas fa-angle-right"></i> Membership
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#sectors">
                                            <i className="fas fa-angle-right"></i> Business Sectors
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#opportunities">
                                            <i className="fas fa-angle-right"></i> Opportunities
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#jobs">
                                            <i className="fas fa-angle-right"></i> Jobs
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#expo">
                                            <i className="fas fa-angle-right"></i> Expo
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#partnerships">
                                            <i className="fas fa-angle-right"></i> Partnerships
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* Contact */}
                            <div className="footer-column footer-contact">
                                <h3>Contact Us</h3>
                                <div className="footer-contact-item">
                                    <i className="fas fa-location-dot"></i> <span>Addis Ababa, Ethiopia</span>
                                </div>
                                <div className="footer-contact-item">
                                    <i className="fas fa-phone"></i> <span>
                                        <a href="tel:+251908577171">+251 908 577 171</a>
                                    </span>
                                </div>
                                <div className="footer-contact-item">
                                    <i className="fas fa-envelope"></i> <span>info@shagarchamber.org.et</span>
                                </div>
                                <div className="footer-contact-item">
                                    <i className="fas fa-clock"></i> <span>Mon – Fri: 8:30 AM – 5:30 PM</span>
                                </div>
                                {/* Social Media */}
                                <div className="footer-socials">
                                    <a
                                        href="https://www.facebook.com/SHCCSA"
                                        aria-label="Facebook"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>{" "}
                                    <a
                                        href="https://t.me/shagarchamber1365"
                                        aria-label="Telegram"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-telegram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="container">
                        <div className="footer-bottom-content">
                            <p>
                                © <CurrentYear /> Shagar Chamber of Commerce & Sectoral Association. All rights
                                reserved.
                            </p>
                            <div className="footer-bottom-links">
                                <a href="#">Privacy Policy</a> <span></span> <a href="#">Terms & Conditions</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
