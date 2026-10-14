"use client";

import { useEffect, useState } from "react";
import CurrentYear from "@/components/CurrentYear";

function BackToNews() {
    return (
        <a href="/#news" className="news-details-back">
            <i className="fa-solid fa-arrow-left"></i> Back to News
        </a>
    );
}

function Message({ icon, title, children }) {
    return (
        <div className="news-empty-state">
            <i className={`fa-solid ${icon}`}></i>
            <h2>{title}</h2>
            <p>{children}</p>
            <BackToNews />
        </div>
    );
}

export default function NewsDetails() {
    // "loading" | "missing" | "unavailable" | "error" | "ready"
    const [state, setState] = useState({ status: "loading", article: null });

    useEffect(() => {
        const newsId = new URLSearchParams(window.location.search).get("id");
        if (!newsId) {
            setState({ status: "missing" });
            return;
        }

        fetch(`/api/news/${encodeURIComponent(newsId)}`)
            .then((response) => {
                if (!response.ok) throw new Error("News article not found");
                return response.json();
            })
            .then((result) => {
                const article = result.news;
                if (!article) throw new Error("News article not found");
                if (article.status !== "Published") {
                    setState({ status: "unavailable" });
                    return;
                }
                document.title = `${article.title} | Shagar Chamber`;
                setState({ status: "ready", article });
            })
            .catch((error) => {
                console.error("News details loading error:", error);
                setState({ status: "error" });
            });
    }, []);

    return (
        <>
            {/* ===== HEADER ===== */}
            <header id="site-header" className="news-details-header">
                <div className="container">
                    <div className="header-inner">
                        <a href="/" className="logo">
                            Shagar Chamber
                        </a>{" "}
                        <BackToNews />
                    </div>
                </div>
            </header>

            {/* ===== NEWS DETAILS ===== */}
            <main>
                <section className="news-details-section">
                    <div className="container">
                        <div id="news-details-container" className="news-details-container">
                            {state.status === "loading" && (
                                <div className="news-empty-state">
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <p>Loading news article...</p>
                                </div>
                            )}
                            {state.status === "missing" && (
                                <Message icon="fa-circle-exclamation" title="News Article Not Found">
                                    The requested news article could not be found.
                                </Message>
                            )}
                            {state.status === "unavailable" && (
                                <Message icon="fa-lock" title="Article Unavailable">
                                    This news article is not currently available.
                                </Message>
                            )}
                            {state.status === "error" && (
                                <Message icon="fa-circle-exclamation" title="Unable to Load Article">
                                    The news article could not be loaded. Please try again later.
                                </Message>
                            )}
                            {state.status === "ready" && <Article article={state.article} />}
                        </div>
                    </div>
                </section>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>
                            © <CurrentYear /> Shagar Chamber of Commerce & Sectoral Association. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

function Article({ article }) {
    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "";

    return (
        <>
            {article.image_url ? (
                <div className="news-details-image">
                    <img src={article.image_url} alt={article.title} />
                </div>
            ) : (
                <div className="news-details-image news-details-placeholder">
                    <i className="fa-solid fa-newspaper"></i>
                </div>
            )}

            <article className="news-details-content">
                <div className="news-details-category">{article.category}</div>

                <h1>{article.title}</h1>

                <div className="news-details-meta">
                    <span>
                        <i className="fa-regular fa-calendar"></i> {formattedDate}
                    </span>{" "}
                    {article.author && (
                        <span>
                            <i className="fa-regular fa-user"></i> {article.author}
                        </span>
                    )}
                </div>

                {article.excerpt && <p className="news-details-excerpt">{article.excerpt}</p>}

                {/* Article text is written by admins and may contain HTML formatting */}
                <div className="news-details-body" dangerouslySetInnerHTML={{ __html: article.content || "" }} />

                <div className="news-details-footer">
                    <BackToNews />
                </div>
            </article>
        </>
    );
}
