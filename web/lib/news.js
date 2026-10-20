"use client";

import { useEffect, useState } from "react";

// Which published articles this visitor has already opened is kept in the browser,
// so the header bell can show newly uploaded news as notifications.
const READ_KEY = "shaggar-news-read";
const TOAST_KEY = "shaggar-news-toasted";
const CHANGE_EVENT = "shaggar-news-read-change";
const MAX_STORED_IDS = 300;

// Articles older than this never count as new, e.g. for first-time visitors
const NEW_FOR_DAYS = 30;

function readIds(key) {
    try {
        const ids = JSON.parse(window.localStorage.getItem(key) || "[]");
        return Array.isArray(ids) ? ids.map(String) : [];
    } catch {
        return [];
    }
}

function writeIds(key, ids) {
    try {
        window.localStorage.setItem(key, JSON.stringify(ids.slice(-MAX_STORED_IDS)));
    } catch {
        // Storage can be unavailable (private mode); notifications just won't persist
    }
}

export function markNewsRead(ids) {
    const read = readIds(READ_KEY);
    const added = ids.map(String).filter((id) => !read.includes(id));
    if (!added.length) return;
    writeIds(READ_KEY, [...read, ...added]);
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function wasToastShown(id) {
    return readIds(TOAST_KEY).includes(String(id));
}

export function markToastShown(id) {
    const shown = readIds(TOAST_KEY);
    if (!shown.includes(String(id))) writeIds(TOAST_KEY, [...shown, String(id)]);
}

// Read ids for this visitor; null until loaded on the client
export function useReadNewsIds() {
    const [ids, setIds] = useState(null);

    useEffect(() => {
        const load = () => setIds(readIds(READ_KEY));
        load();
        window.addEventListener(CHANGE_EVENT, load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener(CHANGE_EVENT, load);
            window.removeEventListener("storage", load);
        };
    }, []);

    return ids;
}

export function isNewsUnread(article, readNewsIds) {
    if (!readNewsIds || readNewsIds.includes(String(article.id))) return false;
    const published = article.published_at ? new Date(article.published_at).getTime() : NaN;
    return Number.isFinite(published) && Date.now() - published < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;
}

export function publishedNewsOnly(items) {
    return items.filter((article) => article.status === "Published");
}

export function newsDetailsUrl(article) {
    return `/news-details?id=${encodeURIComponent(article.id)}`;
}

// Article content may contain HTML, so strip tags before using it as a preview
export function newsSummary(article, length = 150) {
    if (article.excerpt) return article.excerpt;
    const text = (article.content || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return text.length > length ? `${text.substring(0, length).trim()}...` : text;
}

export function formatNewsDate(value, options) {
    return value ? new Date(value).toLocaleDateString("en-US", options) : "";
}

export function timeAgo(value) {
    if (!value) return "";
    const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatNewsDate(value, { month: "short", day: "numeric" });
}
