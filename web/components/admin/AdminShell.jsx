"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/adminSession";
import styles from "./AdminShell.module.css";
import "@/styles/admin-ui.css";

const NAV_LINKS = [
    { href: "/admin", icon: "fa-chart-line", label: "Dashboard" },
    { href: "/admin/members", icon: "fa-users", label: "Members" },
    { href: "/admin/opportunities", icon: "fa-briefcase", label: "Opportunities" },
    { href: "/admin/job-applications", icon: "fa-file-lines", label: "Job Applications" },
    { href: "/admin/news", icon: "fa-newspaper", label: "News" },
    { href: "/admin/expo", icon: "fa-globe", label: "Expo" },
    { href: "/admin/events", icon: "fa-calendar-days", label: "Events" },
    { href: "/admin/partnerships", icon: "fa-handshake", label: "Partnerships" },
    { href: "/admin/revenue", icon: "fa-money-bill-wave", label: "Revenue" },
    { href: "/admin/contact", icon: "fa-envelope", label: "Contact" },
    { href: "/admin/profile", icon: "fa-user-gear", label: "My Profile" }
];

// The dashboard link only matches itself; the others also match their sub-paths
const isActive = (pathname, href) =>
    href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(href + "/");

// Sidebar shared by every admin page. Always visible on wide screens;
// on phones it becomes a top bar with a menu button that opens it as a drawer.
export default function AdminShell({ children }) {
    const pathname = usePathname() || "";
    const [menuOpen, setMenuOpen] = useState(false);
    const current = NAV_LINKS.find((link) => isActive(pathname, link.href));

    // Lock page scrolling behind the drawer and let Escape close it
    useEffect(() => {
        if (!menuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeOnEscape = (event) => event.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    return (
        <div className={styles.shell}>
            {/* MOBILE TOP BAR */}
            <header className={styles.mobileBar}>
                <button
                    type="button"
                    className={styles.menuButton}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                    aria-controls="admin-shell-sidebar"
                    onClick={() => setMenuOpen(true)}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <div className={styles.mobileTitle}>
                    <strong>Shagar Chamber</strong>
                    <span>{current ? current.label : "Administration"}</span>
                </div>
                <a href="/admin/profile" className={styles.mobileProfile} aria-label="My Profile">
                    <i className="fas fa-user-shield"></i>
                </a>
            </header>

            <div
                className={`${styles.backdrop} ${menuOpen ? styles.backdropVisible : ""}`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            ></div>

            {/* SIDEBAR */}
            <aside id="admin-shell-sidebar" className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
                <button
                    type="button"
                    className={styles.closeButton}
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                >
                    <i className="fas fa-xmark"></i>
                </button>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <i className="fas fa-building"></i>
                    </div>
                    <h2>Shagar Chamber</h2>
                    <span>ADMINISTRATION</span>
                </div>
                <nav className={styles.nav}>
                    {NAV_LINKS.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                className={active ? styles.active : undefined}
                                aria-current={active ? "page" : undefined}
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className={`fas ${link.icon}`}></i> {link.label}
                            </a>
                        );
                    })}
                    <div className={styles.divider}></div>
                    <a href="/">
                        <i className="fas fa-arrow-left"></i> Back to Website
                    </a>
                    {/* LOGOUT */}
                    <a
                        href="#"
                        id="adminLogout"
                        onClick={(event) => {
                            event.preventDefault();
                            logoutAdmin();
                        }}
                    >
                        <i className="fas fa-right-from-bracket"></i> Logout
                    </a>
                </nav>
            </aside>

            {/* #admin-ui scopes the shared form and list styles in styles/admin-ui.css */}
            <div id="admin-ui" className={styles.content}>
                {children}
            </div>
        </div>
    );
}
