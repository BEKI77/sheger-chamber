"use client";

import { useEffect, useRef, useState } from "react";
import { useApiList } from "@/lib/useApiList";
import {
    isNewsUnread,
    markNewsRead,
    markToastShown,
    newsDetailsUrl,
    publishedNewsOnly,
    timeAgo,
    useReadNewsIds,
    wasToastShown
} from "@/lib/news";

const LIST_LIMIT = 6;
const TOAST_DELAY_MS = 1500;
const TOAST_DURATION_MS = 12000;

// Header bell listing the latest news titles, plus a pop-up for the newest unread article
export default function NewsNotifications() {
    const { status, items } = useApiList("/api/news", "news");
    const readNewsIds = useReadNewsIds();
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const wrapperRef = useRef(null);

    const latest = status === "ready" ? publishedNewsOnly(items) : [];
    const unread = latest.filter((article) => isNewsUnread(article, readNewsIds));

    // Show the newest unread headline once per article
    const newest = unread[0];
    useEffect(() => {
        if (!newest || wasToastShown(newest.id)) return;
        const showTimer = setTimeout(() => {
            markToastShown(newest.id);
            setToast(newest);
        }, TOAST_DELAY_MS);
        return () => clearTimeout(showTimer);
    }, [newest]);

    useEffect(() => {
        if (!toast) return;
        const hideTimer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
        return () => clearTimeout(hideTimer);
    }, [toast]);

    // Close the dropdown when clicking outside it or pressing Escape
    useEffect(() => {
        if (!open) return;
        const onClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <div ref={wrapperRef} className="news-bell">
                <button
                    type="button"
                    className="news-bell-button"
                    aria-label={unread.length ? `News notifications, ${unread.length} new` : "News notifications"}
                    aria-expanded={open ? "true" : "false"}
                    onClick={() => {
                        setOpen((value) => !value);
                        setToast(null);
                    }}
                >
                    <i className="fa-regular fa-bell"></i>
                    {unread.length > 0 && (
                        <span className="news-bell-badge">{unread.length > 9 ? "9+" : unread.length}</span>
                    )}
                </button>

                {open && (
                    <div className="news-bell-panel" role="dialog" aria-label="Latest news">
                        <div className="news-bell-panel-header">
                            <strong>Latest News</strong>
                            {unread.length > 0 && (
                                <button
                                    type="button"
                                    className="news-bell-mark-read"
                                    onClick={() => markNewsRead(unread.map((article) => article.id))}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {status === "loading" && <p className="news-bell-empty">Loading news...</p>}
                        {status === "error" && <p className="news-bell-empty">Unable to load news right now.</p>}
                        {status === "ready" && !latest.length && (
                            <p className="news-bell-empty">No news has been published yet.</p>
                        )}

                        {latest.length > 0 && (
                            <ul className="news-bell-list">
                                {latest.slice(0, LIST_LIMIT).map((article) => {
                                    const isUnread = isNewsUnread(article, readNewsIds);
                                    return (
                                        <li key={article.id}>
                                            <a
                                                href={newsDetailsUrl(article)}
                                                className={isUnread ? "news-bell-item unread" : "news-bell-item"}
                                                onClick={() => markNewsRead([article.id])}
                                            >
                                                <span className="news-bell-item-icon">
                                                    <i className="fa-solid fa-newspaper"></i>
                                                </span>
                                                <span className="news-bell-item-text">
                                                    <span className="news-bell-item-title">{article.title}</span>
                                                    <span className="news-bell-item-meta">
                                                        {article.category && <>{article.category} · </>}
                                                        {timeAgo(article.published_at)}
                                                    </span>
                                                </span>
                                                {isUnread && <span className="news-bell-dot" aria-label="New"></span>}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <a href="#news" className="news-bell-all" onClick={() => setOpen(false)}>
                            View all news <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                )}
            </div>

            {toast && (
                <div className="news-toast" role="status">
                    <a
                        href={newsDetailsUrl(toast)}
                        className="news-toast-body"
                        onClick={() => markNewsRead([toast.id])}
                    >
                        <span className="news-toast-icon">
                            <i className="fa-solid fa-bullhorn"></i>
                        </span>
                        <span className="news-toast-text">
                            <span className="news-toast-label">New from Shagar Chamber</span>
                            <span className="news-toast-title">{toast.title}</span>
                            <span className="news-toast-link">
                                Read the full story <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </span>
                    </a>
                    <button
                        type="button"
                        className="news-toast-close"
                        aria-label="Dismiss notification"
                        onClick={() => setToast(null)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}
        </>
    );
}
