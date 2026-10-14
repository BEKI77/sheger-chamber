"use client";

import { useApiList } from "@/lib/useApiList";
import OpportunityCard from "./OpportunityCard";

export default function Jobs() {
    const { status, items } = useApiList("/api/opportunities", "opportunities");
    const openOpportunities = items.filter((opportunity) => opportunity.status === "Open");

    return (
        <>
            <section id="jobs" className="jobs-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-eyebrow">JOB CREATION & EMPLOYMENT</span>
                        <h2>
                            Creating Pathways to <span>Work & Opportunity</span>
                        </h2>
                        <p>
                            Supporting employment, entrepreneurship, skills development and business growth through
                            stronger connections and practical opportunities.
                        </p>
                    </div>
                    <div id="opportunities-container">
                        {status === "error" && (
                            <div className="no-opportunities">
                                <i className="fas fa-triangle-exclamation"></i>
                                <h3>Unable to Load Opportunities</h3>
                                <p>Please try again later.</p>
                            </div>
                        )}
                        {status === "ready" && !openOpportunities.length && (
                            <div className="no-opportunities">
                                <i className="fas fa-briefcase"></i>
                                <h3>No Opportunities Available</h3>
                                <p>There are currently no open opportunities. Please check back later.</p>
                            </div>
                        )}
                        {status === "ready" &&
                            openOpportunities.map((opportunity) => (
                                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                            ))}
                    </div>
                    <div className="jobs-grid"></div>
                    <article className="job-card job-card-featured">
                        <div className="job-icon">👷</div>
                        <span className="job-label">EMPLOYMENT</span>
                        <h3>Connect People With Employment Opportunities</h3>
                        <p>
                            Help connect job seekers, businesses and employers through relevant employment and workforce
                            opportunities.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">🚀</div>
                        <h3>Entrepreneurship</h3>
                        <p>
                            Encourage entrepreneurs to develop ideas, establish businesses and explore new pathways for
                            growth.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">🎓</div>
                        <h3>Skills Development</h3>
                        <p>
                            Connect businesses and professionals with training, learning and skills development
                            opportunities.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">🏢</div>
                        <h3>SME Development</h3>
                        <p>
                            Support small and medium-sized businesses with connections, information, partnerships and
                            opportunities.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">🤝</div>
                        <h3>Business Partnerships</h3>
                        <p>Create connections between businesses, institutions, investors and other stakeholders.</p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">👥</div>
                        <h3>Youth Opportunities</h3>
                        <p>
                            Support young people through entrepreneurship, skills development, networking and business
                            opportunities.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">📈</div>
                        <h3>Business Expansion</h3>
                        <p>
                            Help businesses discover markets, partnerships and opportunities that can support
                            sustainable expansion.
                        </p>
                    </article>
                    <article className="job-card">
                        <div className="job-icon">🌍</div>
                        <h3>Market Access</h3>
                        <p>
                            Connect businesses with market information, trade opportunities and potential commercial
                            relationships.
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
}
