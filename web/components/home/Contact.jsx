"use client";

import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
    const [sending, setSending] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const value = (name) => form.elements[name].value.trim();

        const fullName = value("fullName");
        const email = value("email");
        const phone = value("phone");
        const subject = value("subject");
        const message = value("message");

        if (!fullName || !email || !subject || !message) {
            alert("Please complete all required fields.");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        setSending(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, phone, subject, message })
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to send message.");
            }

            alert(
                "Thank you, " +
                    fullName +
                    "!\n\n" +
                    "Your message has been sent successfully.\n" +
                    "Our team will contact you as soon as possible."
            );
            form.reset();
        } catch (error) {
            console.error("Contact form error:", error);
            alert("Sorry, your message could not be sent.\n\nPlease try again later.");
        } finally {
            setSending(false);
        }
    }

    return (
        <>
            {/* ==================== CONTACT SECTION ==================== */}
            <section id="contact" className="contact-section">
                <div className="container">
                    {/* Section Header */}
                    <div className="section-header">
                        <span className="section-tag">
                            <i className="fas fa-headset"></i> GET IN TOUCH
                        </span>
                        <h2>
                            Let's Build Business <span>Together</span>
                        </h2>
                        <p>
                            Have a question, need business support, or want to connect with Shagar Chamber? Our team is
                            ready to hear from you.
                        </p>
                    </div>
                    {/* Contact Content */}
                    <div className="contact-wrapper">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <div className="contact-info-header">
                                <span className="contact-mini-label">CONTACT US</span>
                                <h3>
                                    We're Here to <span>Help</span>
                                </h3>
                                <p>
                                    Reach out to Shagar Chamber for membership, business opportunities, partnerships,
                                    events, and chamber services.
                                </p>
                            </div>
                            {/* Address */}
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="fas fa-location-dot"></i>
                                </div>
                                <div>
                                    <h4>Our Address</h4>
                                    <p>
                                        Addis Ababa, Ethiopia
                                        <br />
                                        Shagar Chamber of Commerce & Sectoral Association
                                    </p>
                                </div>
                            </div>
                            {/* Phone */}
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+251 908 577 171</p>
                                </div>
                            </div>
                            {/* Email */}
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>info@shagarchamber.com</p>
                                </div>
                            </div>
                            {/* Business Hours */}
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>
                                        Monday – Friday: 8:30 AM – 5:30 PM
                                        <br />
                                        Saturday: 9:00 AM – 1:00 PM
                                    </p>
                                </div>
                            </div>
                            {/* Social Links */}
                            <div className="contact-socials">
                                <h4>Connect With Us</h4>
                                <div className="social-links">
                                    <a
                                        href="https://www.facebook.com/SHCCSA"
                                        aria-label="Facebook"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>{" "}
                                    <a href="#" aria-label="LinkedIn">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>{" "}
                                    <a
                                        href="https://t.me/shagarchamber1365"
                                        aria-label="Telegram"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-telegram"></i>
                                    </a>{" "}
                                    <a href="#" aria-label="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <div className="form-header">
                                <span>MESSAGE US</span>
                                <h3>
                                    Send Us a <strong>Message</strong>
                                </h3>
                                <p>Fill out the form below and our team will get back to you as soon as possible.</p>
                            </div>
                            <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contactName">Full Name</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-user"></i>{" "}
                                            <input
                                                type="text"
                                                id="contactName"
                                                name="fullName"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactEmail">Email Address</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-envelope"></i>{" "}
                                            <input
                                                type="email"
                                                id="contactEmail"
                                                name="email"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contactPhone">Phone Number</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-phone"></i>{" "}
                                            <input
                                                type="tel"
                                                id="contactPhone"
                                                name="phone"
                                                placeholder="+251 XXX XXX XXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactSubject">Subject</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-tag"></i>
                                            <select id="contactSubject" name="subject" required defaultValue="">
                                                <option value="" disabled>
                                                    Select a subject
                                                </option>
                                                <option value="membership">Membership</option>
                                                <option value="business">Business Support</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="expo">Expo & Events</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactMessage">Your Message</label>
                                    <div className="textarea-wrapper">
                                        <i className="fas fa-comment-dots"></i>
                                        <textarea
                                            id="contactMessage"
                                            name="message"
                                            rows={6}
                                            placeholder="Write your message here..."
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="contact-submit-btn" disabled={sending}>
                                    <span>{sending ? "Sending..." : "Send Message"}</span>{" "}
                                    <i className={sending ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
