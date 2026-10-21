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
        <section id="news" className="sc-section">
            <div className="sc-container">
                <div className="sc-section-head">
                    <div>
                        <span className="sc-eyebrow">News &amp; updates</span>
                        <h2 className="sc-title">Chamber news</h2>
                    </div>

                    {/* CATEGORY FILTER */}
                    {categories.length > 2 && (
                        <div className="sc-filters" role="tablist" aria-label="Filter news by category">
                            {categories.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    role="tab"
                                    aria-selected={category === name ? "true" : "false"}
                                    className={category === name ? "active" : undefined}
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
                </div>

                {status === "loading" && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading latest news...
                    </p>
                )}
                {status === "error" && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-circle-exclamation"></i> Unable to load news at this time.
                    </p>
                )}
                {status === "ready" && !publishedNews.length && (
                    <p className="sc-empty">
                        <i className="fa-solid fa-newspaper"></i> No news articles available at the moment.
                    </p>
                )}

                {status === "ready" && featured && (
                    <div id="news-container" className="sc-news-grid">
                        {/* LEAD STORY */}
                        <NewsCard article={featured} featured isNew={isNewsUnread(featured, readNewsIds)} />

                        {/* MORE STORIES */}
                        {moreNews.map((article) => (
                            <NewsCard key={article.id} article={article} isNew={isNewsUnread(article, readNewsIds)} />
                        ))}
                    </div>
                )}

                {status === "ready" && others.length > visible && (
                    <div className="sc-center">
                        <button
                            type="button"
                            className="sc-btn sc-btn-outline"
                            onClick={() => setVisible((count) => count + PAGE_SIZE)}
                        >
                            Load more news <i className="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
