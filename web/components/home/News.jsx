"use client";

import { useState } from "react";
import { useApiList } from "@/lib/useApiList";
import { isNewsUnread, publishedNewsOnly, useReadNewsIds } from "@/lib/news";
import NewsCard from "./NewsCard";

const ALL = "All";
const PAGE_SIZE = 6;

export default function News() {
    const { status, items } = useApiList("/api/news", "news");
    const readNewsIds = useReadNewsIds();
    const [category, setCategory] = useState(ALL);
    const [visible, setVisible] = useState(PAGE_SIZE);

    const publishedNews = publishedNewsOnly(items);
    const categories = [ALL, ...new Set(publishedNews.map((article) => article.category).filter(Boolean))];
    const filteredNews =
        category === ALL ? publishedNews : publishedNews.filter((article) => article.category === category);
    const [featured, ...others] = filteredNews;
    const moreNews = others.slice(0, visible);

    return (
        <>
            {/* ========================================================= NEWS & UPDATES SECTION ========================================================= */}
            <section id="news" className="news-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-label">NEWS & UPDATES</span>
                        <h2>Chamber Newsletter</h2>
                        <p>
                            Stay informed about Chamber activities, business opportunities, announcements, events and
                            developments affecting the business community.
                        </p>
                    </div>

                    {status === "loading" && (
                        <div className="news-empty-state">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <p>Loading latest news...</p>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="news-empty-state">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <p>Unable to load news at this time.</p>
                        </div>
                    )}
                    {status === "ready" && !publishedNews.length && (
                        <div className="news-empty-state">
                            <i className="fa-solid fa-newspaper"></i>
                            <p>No news articles available at the moment.</p>
                        </div>
                    )}

                    {status === "ready" && publishedNews.length > 0 && (
                        <div id="news-container" className="newsletter">
                            {/* CATEGORY FILTER */}
                            {categories.length > 2 && (
                                <div className="news-filters" role="tablist" aria-label="Filter news by category">
                                    {categories.map((name) => (
                                        <button
                                            key={name}
                                            type="button"
                                            role="tab"
                                            aria-selected={category === name ? "true" : "false"}
                                            className={category === name ? "news-filter active" : "news-filter"}
                                            onClick={() => {
                                                setCategory(name);
                                                setVisible(PAGE_SIZE);
                                            }}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* LEAD STORY */}
                            {featured && (
                                <NewsCard
                                    article={featured}
                                    featured
                                    isNew={isNewsUnread(featured, readNewsIds)}
                                />
                            )}

                            {/* MORE STORIES */}
                            {moreNews.length > 0 && (
                                <>
                                    <div className="news-subheading">
                                        <h3>More Stories</h3>
                                        <span>
                                            {others.length} {others.length === 1 ? "article" : "articles"}
                                        </span>
                                    </div>
                                    <div className="news-grid">
                                        {moreNews.map((article) => (
                                            <NewsCard
                                                key={article.id}
                                                article={article}
                                                isNew={isNewsUnread(article, readNewsIds)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {others.length > visible && (
                                <div className="news-load-more">
                                    <button type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                                        Load more news <i className="fa-solid fa-chevron-down"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* NEWS INFORMATION BAR */}
                    <div className="news-information">
                        <div className="news-information-icon">
                            <i className="fa-regular fa-bell"></i>
                        </div>
                        <div className="news-information-content">
                            <span className="section-label">CHAMBER NEWS</span>
                            <h3>Never Miss an Update</h3>
                            <p>
                                New announcements appear in the notification bell at the top of the page as soon as
                                the Chamber publishes them.
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
