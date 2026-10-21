"use client";

import { useEffect, useRef, useState } from "react";
import NewsNotifications from "./NewsNotifications";

const NAV_LINKS = [
    ["#about", "About"],
    ["#sectors", "Sectors"],
    ["#services", "Services"],
    ["#opportunities", "Opportunities"],
    ["#events", "Events"],
    ["#news", "News"]
];

// Sections that highlight their link in the menu while on screen
const TRACKED_SECTIONS = NAV_LINKS.map(([href]) => href.slice(1));

export default function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Header style change after scrolling
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close the mobile menu when clicking outside it
    useEffect(() => {
        const onClick = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    // Highlight the menu link of the section on screen
    useEffect(() => {
        if (!("IntersectionObserver" in window)) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-30% 0px -60% 0px" }
        );
        TRACKED_SECTIONS.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <header id="site-header" className={scrolled ? "sc-header scrolled" : "sc-header"}>
            <div className="sc-container sc-header-bar">
                {/* Logo / Brand */}
                <a href="#home" className="sc-brand">
                    <span className="sc-brand-logo">
                        <img
                            src="/assets/images/shagar-logo.png"
                            alt="Shagar Chamber of Commerce & Sectoral Association Logo"
                        />
                    </span>
                    <span className="sc-brand-name">Shaggar Chamber</span>
                </a>

                {/* Navigation Links */}
                <nav
                    ref={menuRef}
                    aria-label="Main"
                    className={menuOpen ? "sc-nav open" : "sc-nav"}
                    onClick={(event) => {
                        if (event.target.closest("a")) setMenuOpen(false);
                    }}
                >
                    {NAV_LINKS.map(([href, label]) => (
                        <a key={href} href={href} className={href === "#" + activeSection ? "active" : undefined}>
                            {label}
                        </a>
                    ))}
                    <a href="#contact" className="sc-nav-contact">
                        Contact
                    </a>
                </nav>

                <div className="sc-header-actions">
                    {/* News notifications */}
                    <NewsNotifications />

                    <a href="#membership" className="sc-btn sc-btn-primary sc-header-cta">
                        Join the Chamber
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        ref={buttonRef}
                        className="sc-menu-button"
                        type="button"
                        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={menuOpen ? "true" : "false"}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
