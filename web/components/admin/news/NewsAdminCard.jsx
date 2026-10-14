"use client";

import { useState } from "react";

export default function NewsAdminCard({ article, onEdit, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "Not published";

    return (
        <article className="admin-opportunity-card admin-news-card">
            <div className="admin-opportunity-main">
                <span className="admin-opportunity-category">{article.category}</span>
                <h4>{article.title}</h4>
                {article.author && (
                    <p>
                        <i className="fas fa-user"></i> {article.author}
                    </p>
                )}
                <p className="admin-opportunity-description">
                    {article.excerpt || `${(article.content || "").substring(0, 180)}...`}
                </p>
                <div className="admin-opportunity-meta">
                    <span>
                        <i className="fas fa-calendar"></i> {publishedDate}
                    </span>{" "}
                    <span className={`admin-status ${article.status === "Published" ? "open" : "closed"}`}>
                        <i className="fas fa-circle"></i> {article.status}
                    </span>
                </div>
            </div>
            <div className="admin-opportunity-actions">
                <button type="button" className="admin-edit-news-button" onClick={() => onEdit(article)}>
                    <i className="fas fa-pen-to-square"></i> Edit
                </button>{" "}
                <button
                    type="button"
                    className="admin-delete-news-button"
                    disabled={deleting}
                    onClick={() => onDelete(article, setDeleting)}
                >
                    <i className={deleting ? "fas fa-spinner fa-spin" : "fas fa-trash"}></i>{" "}
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
