"use client";

import { useApiList } from "@/lib/useApiList";
import EventCard from "./EventCard";

export default function Events() {
    const { status, items } = useApiList("/api/events", "events");
    const upcomingEvents = items.filter((event) => event.status === "Upcoming");

    return (
        <>
            {/* ========================================================= EVENTS SECTION ========================================================= */}
            <section id="events" className="events-section">
                <div className="container">
                    {/* SECTION HEADING */}
                    <div className="section-heading">
                        <span className="section-label">CHAMBER EVENTS</span>
                        <h2>Connect. Learn. Grow.</h2>
                        <p>
                            Participate in Chamber events that bring businesses, entrepreneurs, investors and partners
                            together to create meaningful connections and new opportunities.
                        </p>
                    </div>
                    {/* EVENT CATEGORIES */}
                    <div className="events-grid">
                        {/* NETWORKING */}
                        <article className="event-card">
                            <div className="event-icon">🤝</div>
                            <span className="event-category">NETWORKING</span>
                            <h3>Business Networking</h3>
                            <p>
                                Meet business owners, entrepreneurs, investors and professionals while building valuable
                                business connections.
                            </p>
                            <div className="event-details">
                                <span>📅 Regular Events</span> <span>🤝 Business Connections</span>
                            </div>
                        </article>
                        {/* TRAINING */}
                        <article className="event-card">
                            <div className="event-icon">🎓</div>
                            <span className="event-category">TRAINING</span>
                            <h3>Training & Development</h3>
                            <p>
                                Improve business knowledge and skills through practical training, workshops and
                                professional development programs.
                            </p>
                            <div className="event-details">
                                <span>📅 Scheduled Sessions</span> <span>🎓 Skills Development</span>
                            </div>
                        </article>
                        {/* BUSINESS FORUM */}
                        <article className="event-card">
                            <div className="event-icon">💼</div>
                            <span className="event-category">BUSINESS FORUM</span>
                            <h3>Business Forums</h3>
                            <p>
                                Join discussions where businesses and stakeholders can exchange ideas, discuss
                                challenges and explore opportunities.
                            </p>
                            <div className="event-details">
                                <span>💬 Business Discussions</span> <span>📊 Industry Insights</span>
                            </div>
                        </article>
                        {/* EXHIBITIONS */}
                        <article className="event-card">
                            <div className="event-icon">🎪</div>
                            <span className="event-category">EXHIBITIONS</span>
                            <h3>Exhibitions & Expos</h3>
                            <p>
                                Discover products, services and businesses through exhibitions and Chamber expo
                                activities.
                            </p>
                            <div className="event-details">
                                <span>🏢 Business Exhibition</span> <span>🌍 Market Exposure</span>
                            </div>
                            <a href="#expo" className="event-button">
                                Explore Expo →
                            </a>
                        </article>
                        {/* TRADE EVENTS */}
                        <article className="event-card">
                            <div className="event-icon">🌍</div>
                            <span className="event-category">TRADE</span>
                            <h3>Trade Events</h3>
                            <p>Connect businesses with trade opportunities, suppliers, buyers and potential markets.</p>
                            <div className="event-details">
                                <span>📦 Trade Opportunities</span> <span>🌐 Market Access</span>
                            </div>
                        </article>
                        {/* CONFERENCES */}
                        <article className="event-card">
                            <div className="event-icon">🏢</div>
                            <span className="event-category">CONFERENCES</span>
                            <h3>Business Conferences</h3>
                            <p>
                                Take part in conferences that bring together business leaders, organizations and
                                stakeholders.
                            </p>
                            <div className="event-details">
                                <span>🎤 Business Leaders</span> <span>🤝 Strategic Partnerships</span>
                            </div>
                        </article>
                    </div>
                    {/* DYNAMIC UPCOMING EVENTS */}
                    <div className="events-live-section">
                        <div className="section-heading">
                            <span className="section-label">UPCOMING EVENTS</span>
                            <h2>Latest Chamber Events</h2>
                            <p>
                                Discover upcoming Chamber activities, meetings, workshops, forums and business events.
                            </p>
                        </div>
                        <div id="events-container" className="events-live-grid">
                            {status === "loading" && (
                                <>
                                    <div className="events-empty-state">
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        <p>Loading upcoming events...</p>
                                    </div>
                                </>
                            )}
                            {status === "error" && (
                                <div className="events-empty-state">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <p>Unable to load events at this time.</p>
                                </div>
                            )}
                            {status === "ready" && !upcomingEvents.length && (
                                <div className="events-empty-state">
                                    <i className="fa-solid fa-calendar-xmark"></i>
                                    <p>No upcoming events are available at the moment.</p>
                                </div>
                            )}
                            {status === "ready" &&
                                upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
                        </div>
                    </div>
                    {/* EVENT INFORMATION */}
                    <div className="events-highlight">
                        <div className="events-highlight-icon">📅</div>
                        <div className="events-highlight-content">
                            <span className="section-label">EVENT INFORMATION</span>
                            <h3>Stay Connected With Chamber Activities</h3>
                            <p>
                                Event dates, locations, schedules and registration information will be published here as
                                Chamber activities are announced.
                            </p>
                        </div>
                        <a href="#contact" className="events-highlight-button">
                            Contact the Chamber →
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
