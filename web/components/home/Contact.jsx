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
        <section id="contact" className="sc-section sc-contact">
            <div className="sc-container sc-contact-grid">
                {/* Contact Information */}
                <div className="sc-contact-info">
                    <span className="sc-eyebrow">Get in touch</span>
                    <h2 className="sc-title">Let's build business together.</h2>
                    <p className="sc-lead">
                        Reach out about membership, business opportunities, partnerships, events and Chamber services.
                    </p>
                    <a href="mailto:info@shaggarchamber.org.et" className="sc-contact-email">
                        info@shaggarchamber.org.et
                    </a>
                    <dl className="sc-contact-list">
                        <div>
                            <dt>Phone</dt>
                            <dd>
                                <a href="tel:+251908577171">+251 908 577 171</a>
                            </dd>
                        </div>
                        <div>
                            <dt>Address</dt>
                            <dd>Addis Ababa, Ethiopia</dd>
                        </div>
                        <div>
                            <dt>Business hours</dt>
                            <dd>
                                Monday – Friday: 8:30 AM – 5:30 PM
                                <br />
                                Saturday: 9:00 AM – 1:00 PM
                            </dd>
                        </div>
                    </dl>
                    <div className="sc-socials">
                        <a href="https://www.facebook.com/SHCCSA" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://t.me/shaggarchamber1365" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-telegram"></i>
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <form id="contactForm" className="sc-form-card sc-form" onSubmit={handleSubmit}>
                    <h3>Send us a message</h3>
                    <div className="sc-form-grid">
                        <div className="sc-field">
                            <label htmlFor="contactName">Full Name</label>
                            <input type="text" id="contactName" name="fullName" placeholder="Enter your full name" required />
                        </div>
                        <div className="sc-field">
                            <label htmlFor="contactEmail">Email Address</label>
                            <input type="email" id="contactEmail" name="email" placeholder="Enter your email" required />
                        </div>
                        <div className="sc-field">
                            <label htmlFor="contactPhone">Phone Number</label>
                            <input type="tel" id="contactPhone" name="phone" placeholder="+251 XXX XXX XXX" />
                        </div>
                        <div className="sc-field">
                            <label htmlFor="contactSubject">Subject</label>
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
                        <div className="sc-field sc-field-full">
                            <label htmlFor="contactMessage">Your Message</label>
                            <textarea
                                id="contactMessage"
                                name="message"
                                rows={5}
                                placeholder="Write your message here..."
                                required
                            />
                        </div>
                    </div>
                    <div className="sc-form-actions">
                        <button type="submit" className="sc-btn sc-btn-primary sc-btn-lg" disabled={sending}>
                            {sending ? "Sending..." : "Send message"}{" "}
                            <i className={sending ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
