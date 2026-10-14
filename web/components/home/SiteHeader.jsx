"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
    ["#home", "Home"],
    ["#about", "About"],
    ["#sectors", "Sectors"],
    ["#services", "Services"],
    ["#membership", "Membership"],
    ["#opportunities", "Opportunities"],
    ["#jobs", "Jobs"],
    ["#events", "Events"],
    ["#expo", "Expo"],
    ["#news", "News"],
    ["#partnerships", "Partnerships"],
    ["#contact", "Contact"]
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

    const linkClass = (href, base) =>
        [base, href === "#" + activeSection ? "active" : null].filter(Boolean).join(" ") || undefined;

    return (
        <header id="site-header" className={scrolled ? "scrolled" : undefined}>
            <nav className="navbar">
                {/* Logo / Brand */}
                <a href="#home" className="brand">
                    <div className="brand-logo">
                        <img
                            src="/assets/images/shagar-logo.png"
                            alt="Shagar Chamber of Commerce & Sectoral Association Logo"
                        />
                    </div>
                    <div className="brand-text">
                        <span className="brand-name">Shagar Chamber</span>{" "}
                        <span className="brand-subtitle">Commerce & Sectoral Association</span>
                    </div>
                </a>{" "}
                {/* Mobile Menu Button */}
                <button
                    ref={buttonRef}
                    className="mobile-menu-button"
                    id="mobile-menu-button"
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen ? "true" : "false"}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span style={menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : undefined}></span>{" "}
                    <span style={menuOpen ? { opacity: "0" } : undefined}></span>{" "}
                    <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : undefined}></span>
                </button>
                {/* Navigation Links */}
                <div
                    ref={menuRef}
                    className={menuOpen ? "nav-menu active" : "nav-menu"}
                    id="nav-menu"
                    onClick={(event) => {
                        if (event.target.closest("a")) setMenuOpen(false);
                    }}
                >
                    {NAV_LINKS.map(([href, label]) => (
                        <Fragment key={href}>
                            <a href={href} className={linkClass(href)}>
                                {label}
                            </a>{" "}
                        </Fragment>
                    ))}
                    <a href="#membership" className={linkClass("#membership", "nav-cta")}>
                        Become a Member
                    </a>
                </div>
            </nav>
        </header>
    );
}
