"use client";

export default function NewsCard({ article }) {
    const date = article.published_at ? new Date(article.published_at).toLocaleDateString() : "";

    return (
        <article className="news-card">
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
                <span className="news-card-category">{article.category}</span>

                <h3>{article.title}</h3>

                {article.excerpt ? <p>{article.excerpt}</p> : <p>{(article.content || "").substring(0, 150)}...</p>}

                <div className="news-card-meta">
                    <span>
                        <i className="fa-regular fa-calendar"></i> {date}
                    </span>{" "}
                    {article.author && (
                        <span>
                            <i className="fa-regular fa-user"></i> {article.author}
                        </span>
                    )}
                </div>

                <button
                    className="news-read-more"
                    type="button"
                    onClick={() => {
                        window.location.href = `/news-details?id=${article.id}`;
                    }}
                >
                    Read More <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </article>
    );
}
