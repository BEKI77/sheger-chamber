"use client";

import { useRef, useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { fillFields, readFields } from "@/lib/forms";
import NewsAdminCard from "./NewsAdminCard";

const CREATE_FIELDS = {
    title: "newsTitle",
    category: "newsCategory",
    imageUrl: "newsImage",
    excerpt: "newsExcerpt",
    content: "newsContent",
    author: "newsAuthor",
    status: "newsStatus"
};
const EDIT_FIELDS = {
    title: "editNewsTitle",
    category: "editNewsCategory",
    imageUrl: "editNewsImage",
    excerpt: "editNewsExcerpt",
    content: "editNewsContent",
    author: "editNewsAuthor",
    status: "editNewsStatus"
};

export default function AdminNews() {
    useAdminSession();
    const news = useApiList("/api/news", "news");
    const [publishing, setPublishing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const editPanelRef = useRef(null);
    const editFormRef = useRef(null);
    const reload = () => news.reload({ showLoading: true });

    async function handleCreate(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = readFields(form, CREATE_FIELDS);
        if (!data.title || !data.category || !data.content) {
            alert("Please complete all required fields.");
            return;
        }
        setPublishing(true);
        try {
            await sendJson("/api/news", "POST", data, "Unable to create news article.");
            alert("News article created successfully.");
            form.reset();
            reload();
        } catch (error) {
            console.error("Create news error:", error);
            alert(error.message || "Unable to create news article.");
        } finally {
            setPublishing(false);
        }
    }

    async function startEdit(article) {
        try {
            const response = await fetch(`/api/news/${article.id}`);
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Unable to load news article.");
            const item = result.news;
            setEditingId(item.id);
            fillFields(editFormRef.current, {
                editNewsTitle: item.title,
                editNewsCategory: item.category,
                editNewsAuthor: item.author,
                editNewsImage: item.image_url,
                editNewsExcerpt: item.excerpt,
                editNewsContent: item.content,
                editNewsStatus: item.status || "Published"
            });
            // wait for the panel to be shown before scrolling to it
            requestAnimationFrame(() => editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
        } catch (error) {
            console.error("Load news for editing error:", error);
            alert(error.message || "Unable to load news article.");
        }
    }

    function closeEdit() {
        editFormRef.current.reset();
        setEditingId(null);
    }

    async function handleSave(event) {
        event.preventDefault();
        const data = readFields(event.currentTarget, EDIT_FIELDS);
        if (!data.title || !data.category || !data.content) {
            alert("Please complete all required fields.");
            return;
        }
        setSaving(true);
        try {
            await sendJson(`/api/news/${editingId}`, "PUT", data, "Unable to update news article.");
            alert("News article updated successfully.");
            closeEdit();
            reload();
        } catch (error) {
            console.error("Update news error:", error);
            alert(error.message || "Unable to update news article.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteArticle(article, setDeleting) {
        if (!confirm("Are you sure you want to permanently delete this news article?")) return;
        setDeleting(true);
        try {
            await sendJson(`/api/news/${article.id}`, "DELETE", null, "Unable to delete news article.");
            alert("News article deleted successfully.");
            reload();
        } catch (error) {
            console.error("Delete news error:", error);
            alert(error.message || "Unable to delete news article.");
            setDeleting(false);
        }
    }

    return (
        <>
            {/* ===================================================== MAIN ===================================================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* PAGE HEADING */}
                    <div className="admin-page-heading">
                        <span className="admin-section-label">
                            <i className="fas fa-newspaper"></i> Content Management
                        </span>
                        <h2>News Management</h2>
                        <p>Create and manage Shagar Chamber news and announcements.</p>
                    </div>
                    {/* ================================================= CREATE NEWS ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-plus-circle"></i> Create News Article
                                </h3>
                                <p>Publish a new news article or save it as a draft.</p>
                            </div>
                        </div>
                        <form id="newsForm" onSubmit={handleCreate}>
                            <div className="admin-form-grid">
                                {/* TITLE */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="newsTitle">
                                        News Title <span>*</span>
                                    </label>{" "}
                                    <input type="text" id="newsTitle" placeholder="Enter news title" required />
                                </div>
                                {/* CATEGORY */}
                                <div className="admin-form-group">
                                    <label htmlFor="newsCategory">
                                        Category <span>*</span>
                                    </label>{" "}
                                    <select id="newsCategory" required>
                                        <option value="">Select category</option>
                                        <option value="Business">Business</option>
                                        <option value="Chamber News">Chamber News</option>
                                        <option value="Economy">Economy</option>
                                        <option value="Events">Events</option>
                                        <option value="Announcements">Announcements</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* AUTHOR */}
                                <div className="admin-form-group">
                                    <label htmlFor="newsAuthor">Author</label>{" "}
                                    <input type="text" id="newsAuthor" placeholder="Author name" />
                                </div>
                                {/* IMAGE URL */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="newsImage">Image URL</label>{" "}
                                    <input type="url" id="newsImage" placeholder="https://example.com/image.jpg" />{" "}
                                    <small>We will add direct image uploads later.</small>
                                </div>
                                {/* EXCERPT */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="newsExcerpt">Short Summary</label>{" "}
                                    <textarea
                                        id="newsExcerpt"
                                        rows={3}
                                        placeholder="Write a short summary of the article..."
                                    />
                                </div>
                                {/* CONTENT */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="newsContent">
                                        Article Content <span>*</span>
                                    </label>{" "}
                                    <textarea
                                        id="newsContent"
                                        rows={10}
                                        placeholder="Write the full news article here..."
                                        required
                                    />
                                </div>
                                {/* STATUS */}
                                <div className="admin-form-group">
                                    <label htmlFor="newsStatus">Status</label>{" "}
                                    <select id="newsStatus">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            {/* BUTTONS */}
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={publishing}>
                                    <i className={publishing ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>{" "}
                                    {publishing ? "Publishing..." : "Publish News"}
                                </button>{" "}
                                <button type="reset" className="admin-secondary-button">
                                    <i className="fas fa-rotate-left"></i> Clear
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ================================================= EDIT NEWS ================================================= */}
                    <section
                        className="admin-panel"
                        id="edit-news-panel"
                        ref={editPanelRef}
                        style={{ display: editingId ? "block" : "none" }}
                    >
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-pen-to-square"></i> Edit News Article
                                </h3>
                                <p>Update the selected news article.</p>
                            </div>
                        </div>
                        <form id="editNewsForm" ref={editFormRef} onSubmit={handleSave}>
                            <input type="hidden" id="editNewsId" value={editingId ?? ""} />
                            <div className="admin-form-grid">
                                {/* TITLE */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="editNewsTitle">
                                        News Title <span>*</span>
                                    </label>{" "}
                                    <input type="text" id="editNewsTitle" placeholder="Enter news title" required />
                                </div>
                                {/* CATEGORY */}
                                <div className="admin-form-group">
                                    <label htmlFor="editNewsCategory">
                                        Category <span>*</span>
                                    </label>{" "}
                                    <select id="editNewsCategory" required>
                                        <option value="">Select category</option>
                                        <option value="Business">Business</option>
                                        <option value="Chamber News">Chamber News</option>
                                        <option value="Economy">Economy</option>
                                        <option value="Events">Events</option>
                                        <option value="Announcements">Announcements</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* AUTHOR */}
                                <div className="admin-form-group">
                                    <label htmlFor="editNewsAuthor">Author</label>{" "}
                                    <input type="text" id="editNewsAuthor" placeholder="Author name" />
                                </div>
                                {/* IMAGE URL */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="editNewsImage">Image URL</label>{" "}
                                    <input type="url" id="editNewsImage" placeholder="https://example.com/image.jpg" />
                                </div>
                                {/* EXCERPT */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="editNewsExcerpt">Short Summary</label>{" "}
                                    <textarea id="editNewsExcerpt" rows={3} placeholder="Write a short summary..." />
                                </div>
                                {/* CONTENT */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="editNewsContent">
                                        Article Content <span>*</span>
                                    </label>{" "}
                                    <textarea
                                        id="editNewsContent"
                                        rows={10}
                                        placeholder="Write the full news article..."
                                        required
                                    />
                                </div>
                                {/* STATUS */}
                                <div className="admin-form-group">
                                    <label htmlFor="editNewsStatus">Status</label>{" "}
                                    <select id="editNewsStatus">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            {/* BUTTONS */}
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={saving}>
                                    <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>{" "}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>{" "}
                                <button
                                    type="button"
                                    id="cancelEditNews"
                                    className="admin-secondary-button"
                                    onClick={closeEdit}
                                >
                                    <i className="fas fa-xmark"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ================================================= EXISTING NEWS ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-list"></i> Existing News
                                </h3>
                                <p>Manage published articles and drafts.</p>
                            </div>
                            <button type="button" id="refreshNews" className="admin-secondary-button" onClick={reload}>
                                <i className="fas fa-arrows-rotate"></i> Refresh
                            </button>
                        </div>
                        <div id="admin-news-list">
                            {news.status === "loading" && (
                                <div className="admin-loading">
                                    <i className="fas fa-spinner fa-spin"></i> Loading news...
                                </div>
                            )}
                            {news.status === "error" && (
                                <div className="admin-error">
                                    <i className="fas fa-triangle-exclamation"></i>
                                    <h3>Unable to Load News</h3>
                                    <p>Make sure the backend server is running.</p>
                                </div>
                            )}
                            {news.status === "ready" && !news.items.length && (
                                <div className="admin-empty">
                                    <i className="fas fa-newspaper"></i>
                                    <h3>No News Articles</h3>
                                    <p>No news articles have been published yet.</p>
                                </div>
                            )}
                            {news.status === "ready" &&
                                news.items.map((article) => (
                                    <NewsAdminCard
                                        key={article.id}
                                        article={article}
                                        onEdit={startEdit}
                                        onDelete={deleteArticle}
                                    />
                                ))}
                        </div>
                    </section>
                </div>
            </main>
            {/* ===================================================== JAVASCRIPT ===================================================== */}
        </>
    );
}
