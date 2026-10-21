"use client";

import { useEffect, useState } from "react";

// Cards that fade in the first time they scroll into view
const REVEAL_SELECTOR = ".sc-tile, .sc-service, .sc-quick-action, .sc-membership-banner";

// Page-wide behaviour of the home page: smooth scrolling for # links,
// card reveal animation and the back-to-top button.
export default function HomeEffects() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 500);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Smooth scroll to sections, leaving room for the fixed header
    useEffect(() => {
        const onClick = (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const header = document.getElementById("site-header");
            const headerHeight = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - headerHeight + 2,
                behavior: "smooth"
            });
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    // Reveal animation for the cards that are on the page when it loads
    useEffect(() => {
        if (!("IntersectionObserver" in window)) return;
        const elements = document.querySelectorAll(REVEAL_SELECTOR);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );
        elements.forEach((element) => {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(element);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <button
            id="backToTop"
            className={showBackToTop ? "sc-back-to-top show" : "sc-back-to-top"}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
}
