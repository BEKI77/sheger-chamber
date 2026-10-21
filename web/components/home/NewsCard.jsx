"use client";

import { formatNewsDate, markNewsRead, newsDetailsUrl, newsSummary } from "@/lib/news";

// featured: the large lead story at the top of the news grid
export default function NewsCard({ article, featured = false, isNew = false }) {
    const date = formatNewsDate(article.published_at, { year: "numeric", month: "short", day: "numeric" });

    return (
        <a
            href={newsDetailsUrl(article)}
            className={featured ? "sc-news-card featured" : "sc-news-card"}
            onClick={() => markNewsRead([article.id])}
        >
            {article.image_url ? (
                <div className="sc-news-image">
                    <img src={article.image_url} alt={article.title} />
                </div>
            ) : (
                featured && (
                    <div className="sc-news-image sc-news-placeholder">
                        <i className="fa-solid fa-newspaper"></i>
                    </div>
                )
            )}

            <div className="sc-news-body">
                <div className="sc-news-tags">
                    {isNew && <span className="sc-tag sc-tag-open">New</span>}
                    {article.category && <span className="sc-tag sc-tag-muted">{article.category}</span>}
                </div>

                <h3>{article.title}</h3>

                {featured && <p>{newsSummary(article, 220)}</p>}

                <div className="sc-meta">
                    {date && <span>{date}</span>}
                    {article.author && <span>{article.author}</span>}
                </div>
            </div>
        </a>
    );
}
