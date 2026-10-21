"use client";

import { formatNewsDate, markNewsRead, newsDetailsUrl, newsSummary } from "@/lib/news";

// featured: the large lead story at the top of the newsletter
export default function NewsCard({ article, featured = false, isNew = false }) {
    const date = formatNewsDate(article.published_at, { year: "numeric", month: "short", day: "numeric" });

    return (
        <a
            href={newsDetailsUrl(article)}
            className={featured ? "news-card news-card-featured" : "news-card"}
            onClick={() => markNewsRead([article.id])}
        >
            {article.image_url ? (
                <div className="news-card-image">
                    <img src={article.image_url} alt={article.title} />
                </div>
            ) : (
                <div className="news-card-image news-card-placeholder">
                    <i className="fa-solid fa-newspaper"></i>
                </div>
            )}

            <div className="news-card-content">
                <div className="news-card-tags">
                    {featured && <span className="news-card-flag">Top Story</span>}
                    {isNew && <span className="news-card-new">New</span>}
                    {article.category && <span className="news-card-category">{article.category}</span>}
                </div>

                <h3>{article.title}</h3>

                <p>{newsSummary(article, featured ? 260 : 150)}</p>

                <div className="news-card-meta">
                    {date && (
                        <span>
                            <i className="fa-regular fa-calendar"></i> {date}
                        </span>
                    )}
                    {article.author && (
                        <span>
                            <i className="fa-regular fa-user"></i> {article.author}
                        </span>
                    )}
                </div>

                <span className="news-read-more">
                    Read More <i className="fa-solid fa-arrow-right"></i>
                </span>
            </div>
        </a>
    );
}
