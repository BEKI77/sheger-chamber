export default function SiteHeader() {
    return (
        <>
        <header id="site-header">
          <nav className="navbar">
            {/* Logo / Brand */}
            <a href="#home" className="brand">
              <div className="brand-logo">
                <img src="/assets/images/shagar-logo.png" alt="Shagar Chamber of Commerce & Sectoral Association Logo" />
              </div>
              <div className="brand-text">
                <span className="brand-name">
                  Shagar Chamber
                </span>
                {" "}
                <span className="brand-subtitle">
                  Commerce & Sectoral Association
                </span>
              </div>
            </a>
            {" "}
            {/* Mobile Menu Button */}
            <button className="mobile-menu-button" id="mobile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false">
              <span></span>
              {" "}
              <span></span>
              {" "}
              <span></span>
            </button>
            {/* Navigation Links */}
            <div className="nav-menu" id="nav-menu">
              <a href="#home">
                Home
              </a>
              {" "}
              <a href="#about">
                About
              </a>
              {" "}
              <a href="#sectors">
                Sectors
              </a>
              {" "}
              <a href="#services">
                Services
              </a>
              {" "}
              <a href="#membership">
                Membership
              </a>
              {" "}
              <a href="#opportunities">
                Opportunities
              </a>
              {" "}
              <a href="#jobs">
                Jobs
              </a>
              {" "}
              <a href="#events">
                Events
              </a>
              {" "}
              <a href="#expo">
                Expo
              </a>
              {" "}
              <a href="#news">
                News
              </a>
              {" "}
              <a href="#partnerships">
                Partnerships
              </a>
              {" "}
              <a href="#contact">
                Contact
              </a>
              {" "}
              <a href="#membership" className="nav-cta">
                Become a Member
              </a>
            </div>
          </nav>
        </header>
        </>
    );
}
