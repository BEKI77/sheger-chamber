export default function Expo() {
    return (
        <>
        {/* ========================================================= EXPO SECTION ========================================================= */}
        <section id="expo" className="expo-section">
          <div className="container">
            {/* SECTION HEADING */}
            <div className="section-heading">
              <span className="section-label">
                EXPO
              </span>
              <h2>
                Connect Businesses & Markets
              </h2>
              <p>
                Discover opportunities, showcase products and services, build partnerships and connect with local and global markets through Shagar Chamber Expo events.
              </p>
            </div>
            {/* EXPO CARDS */}
            <div id="expo-container" className="expo-grid">
              {/* ================================================= NATIONAL EXPO ================================================= */}
              <article className="expo-card">
                <div className="expo-image">
                  <img src="/assets/images/national-expo.jpg" alt="Business exhibition and networking event" />
                  <div className="expo-image-overlay"></div>
                  <span className="expo-type">
                    <i className="fa-solid fa-flag"></i>
                    {" "}
                    NATIONAL EXPO
                  </span>
                </div>
                <div className="expo-content">
                  <h3>
                    National Expo
                  </h3>
                  <span className="expo-subtitle">
                    SHOWCASING LOCAL BUSINESS, PRODUCTS & OPPORTUNITIES
                  </span>
                  <p>
                    The National Expo brings together local businesses, entrepreneurs, producers and service providers to showcase their products and services, create business connections and explore opportunities within Ethiopia.
                  </p>
                  <div className="expo-features">
                    <div className="expo-feature">
                      <span>
                        🏢
                      </span>
                      <div>
                        <strong>
                          Local Businesses
                        </strong>
                        {" "}
                        <small>
                          Connect with local enterprises
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        📦
                      </span>
                      <div>
                        <strong>
                          Products & Services
                        </strong>
                        {" "}
                        <small>
                          Showcase local offerings
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        🌾
                      </span>
                      <div>
                        <strong>
                          Agriculture & Manufacturing
                        </strong>
                        {" "}
                        <small>
                          Promote local production
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        🤝
                      </span>
                      <div>
                        <strong>
                          Business Networking
                        </strong>
                        {" "}
                        <small>
                          Build valuable connections
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        📈
                      </span>
                      <div>
                        <strong>
                          Market Opportunities
                        </strong>
                        {" "}
                        <small>
                          Explore new markets
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        💰
                      </span>
                      <div>
                        <strong>
                          Investment Opportunities
                        </strong>
                        {" "}
                        <small>
                          Discover business potential
                        </small>
                      </div>
                    </div>
                  </div>
                  <a href="#contact" className="expo-button">
                    Explore National Expo
                    {" "}
                    <span>
                      →
                    </span>
                  </a>
                </div>
              </article>
              {/* ================================================= INTERNATIONAL EXPO ================================================= */}
              <article className="expo-card">
                <div className="expo-image">
                  <img src="/assets/images/international-expo.jpg" alt="International business exhibition" />
                  <div className="expo-image-overlay"></div>
                  <span className="expo-type">
                    <i className="fa-solid fa-globe"></i>
                    {" "}
                    INTERNATIONAL EXPO
                  </span>
                </div>
                <div className="expo-content">
                  <h3>
                    International Expo
                  </h3>
                  <span className="expo-subtitle">
                    GLOBAL CONNECTIONS, PARTNERSHIPS & OPPORTUNITIES
                  </span>
                  <p>
                    The International Expo connects businesses with international companies, investors and potential partners while creating opportunities for trade, market access and international collaboration.
                  </p>
                  <div className="expo-features">
                    <div className="expo-feature">
                      <span>
                        🌍
                      </span>
                      <div>
                        <strong>
                          International Businesses
                        </strong>
                        {" "}
                        <small>
                          Connect with global companies
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        📦
                      </span>
                      <div>
                        <strong>
                          Import & Export
                        </strong>
                        {" "}
                        <small>
                          Explore international trade
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        🤝
                      </span>
                      <div>
                        <strong>
                          Global Partnerships
                        </strong>
                        {" "}
                        <small>
                          Build strategic relationships
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        💼
                      </span>
                      <div>
                        <strong>
                          Investors & Delegates
                        </strong>
                        {" "}
                        <small>
                          Meet potential partners
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        🌐
                      </span>
                      <div>
                        <strong>
                          Global Market Access
                        </strong>
                        {" "}
                        <small>
                          Explore new markets
                        </small>
                      </div>
                    </div>
                    <div className="expo-feature">
                      <span>
                        📈
                      </span>
                      <div>
                        <strong>
                          Business Growth
                        </strong>
                        {" "}
                        <small>
                          Expand business opportunities
                        </small>
                      </div>
                    </div>
                  </div>
                  <a href="#contact" className="expo-button">
                    Explore International Expo
                    {" "}
                    <span>
                      →
                    </span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
        </>
    );
}
