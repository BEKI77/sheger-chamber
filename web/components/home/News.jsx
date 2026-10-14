export default function News() {
    return (
        <>
        {/* ========================================================= NEWS & UPDATES SECTION ========================================================= */}
        <section id="news" className="news-section">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">
                NEWS & UPDATES
              </span>
              <h2>
                Latest Chamber News
              </h2>
              <p>
                Stay informed about Chamber activities, business opportunities, announcements, events and developments affecting the business community.
              </p>
            </div>
            {/* DYNAMIC NEWS ARTICLES */}
            <div id="news-container" className="news-grid">
              <div className="news-empty-state">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>
                  Loading latest news...
                </p>
              </div>
            </div>
            {/* NEWS INFORMATION BAR */}
            <div className="news-information">
              <div className="news-information-icon">
                📰
              </div>
              <div className="news-information-content">
                <span className="section-label">
                  CHAMBER NEWS
                </span>
                <h3>
                  Stay Updated
                </h3>
                <p>
                  New Chamber announcements, business opportunities, event information and important updates will be published here.
                </p>
              </div>
              <a href="#contact" className="news-information-button">
                Contact Chamber →
              </a>
            </div>
          </div>
        </section>
        </>
    );
}
