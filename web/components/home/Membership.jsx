"use client";

import { useState } from "react";

const MEMBERSHIP_FEES = { trader: "1,000 ETB", plc: "5,000 ETB" };

const PAYMENT_ACCOUNTS = {
    CBE: "1000546634551",
    CBO: "1023500127523",
    Sinke: "10553476312216",
    Awash: "013031159104100"
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Membership() {
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fee = MEMBERSHIP_FEES[category];
    const account = PAYMENT_ACCOUNTS[paymentMethod];

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const field = (name) => form.elements[name];
        const text = (name) => field(name).value.trim();

        const fullName = text("fullName");
        const email = text("email");
        const frontFile = field("nationalIdFront").files[0];
        const backFile = field("nationalIdBack").files[0];
        const receiptFile = field("paymentReceipt").files[0];

        const values = {
            fullName,
            email,
            phone: text("phone"),
            tin: text("tin"),
            businessName: text("businessName"),
            businessSector: field("businessSector").value,
            businessAddress: text("businessAddress"),
            businessDescription: text("businessDescription"),
            membershipType: field("membershipType").value,
            businessCategory: field("businessCategory").value,
            paymentMethod: field("paymentMethod").value
        };

        const required = Object.entries(values).filter(([name]) => name !== "tin");
        if (required.some(([, value]) => !value) || !frontFile || !backFile || !receiptFile) {
            alert("Please complete all required fields, including both sides of your National ID.");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const formData = new FormData();
        Object.entries(values).forEach(([name, value]) => formData.append(name, value));
        formData.append("nationalIdFront", frontFile);
        formData.append("nationalIdBack", backFile);
        formData.append("paymentReceipt", receiptFile);

        setSubmitting(true);

        try {
            const response = await fetch("/api/members/register", {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Something went wrong while submitting your application.");
                return;
            }

            alert(
                "Thank you, " +
                    fullName +
                    "!\n\n" +
                    result.message +
                    "\n\n" +
                    "Membership Type: " +
                    result.membership_type +
                    "\n" +
                    "Membership Fee: " +
                    result.membership_fee.toLocaleString() +
                    "\n" +
                    "Application Status: Pending"
            );

            form.reset();
            setCategory("");
            setPaymentMethod("");
        } catch (error) {
            console.error("Membership submission error:", error);
            alert("Membership submission failed:\n\n" + (error.message || "Unknown error. Check the browser console."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* MEMBERSHIP */}
            <section id="membership" className="membership-section">
                <div className="container">
                    <div className="section-heading">
                        <span className="section-eyebrow">MEMBERSHIP</span>
                        <h2>
                            Become Part of the <span>Business Community</span>
                        </h2>
                        <p>
                            Join Shagar Chamber of Commerce & Sectoral Association and connect with businesses,
                            opportunities, services and partnerships.
                        </p>
                    </div>
                    <div className="membership-plans">
                        {/* MEMBER PLAN */}
                        <article className="membership-plan membership-plan-featured">
                            <div className="membership-plan-top">
                                <div className="membership-icon">👤</div>
                                <span className="membership-badge">MEMBER</span>
                            </div>
                            <h3>Member</h3>
                            <p className="membership-plan-description">
                                For businesses, entrepreneurs and professionals who want to participate in the Chamber
                                community.
                            </p>
                            <div className="membership-price">
                                <strong>84,000</strong> <span>Membership</span>
                            </div>
                            <ul className="membership-benefits">
                                <li>
                                    <span>✓</span> Business community access
                                </li>
                                <li>
                                    <span>✓</span> Networking opportunities
                                </li>
                                <li>
                                    <span>✓</span> Business information
                                </li>
                                <li>
                                    <span>✓</span> Training opportunities
                                </li>
                                <li>
                                    <span>✓</span> Business opportunities
                                </li>
                                <li>
                                    <span>✓</span> Chamber events
                                </li>
                            </ul>
                            <a href="#membership-application" className="membership-button">
                                Apply as Member →
                            </a>
                        </article>
                        {/* PARTNERSHIP PLAN */}
                        <article className="membership-plan">
                            <div className="membership-plan-top">
                                <div className="membership-icon">🤝</div>
                                <span className="membership-badge">PARTNERSHIP</span>
                            </div>
                            <h3>Partnership</h3>
                            <p className="membership-plan-description">
                                For organizations and partners seeking deeper collaboration and business relationships.
                            </p>
                            <div className="membership-price">
                                <strong>120</strong> <span>Partnership</span>
                            </div>
                            <ul className="membership-benefits">
                                <li>
                                    <span>✓</span> Partnership opportunities
                                </li>
                                <li>
                                    <span>✓</span> Business networking
                                </li>
                                <li>
                                    <span>✓</span> Institutional connections
                                </li>
                                <li>
                                    <span>✓</span> Business events
                                </li>
                                <li>
                                    <span>✓</span> Market opportunities
                                </li>
                                <li>
                                    <span>✓</span> Collaboration opportunities
                                </li>
                            </ul>
                            <a href="#membership-application" className="membership-button membership-button-outline">
                                Apply for Partnership →
                            </a>
                        </article>
                        {/* SECTORS & EVENTS */}
                        {/* SECTORS CARD */}
                        <article className="membership-plan membership-extra-card">
                            <div className="membership-plan-top">
                                <div className="membership-icon">🏢</div>
                                <span className="membership-badge">SECTORS</span>
                            </div>
                            <h3>Business Sectors</h3>
                            <p className="membership-plan-description">
                                Connect with businesses and opportunities across different sectors of the economy
                                through the Chamber.
                            </p>
                            <div className="membership-price">
                                <strong>10</strong> <span>Sectors</span>
                            </div>
                            <ul className="membership-benefits">
                                <li>
                                    <span>✓</span> 🌾 Agriculture
                                </li>
                                <li>
                                    <span>✓</span> 🏭 Investment
                                </li>
                                <li>
                                    <span>✓</span> 🏗️ Construction
                                </li>
                                <li>
                                    <span>✓</span> 🛒 Trade
                                </li>
                                <li>
                                    <span>✓</span> 💻 ICT & Technology
                                </li>
                                <li>
                                    <span>✓</span> 🏨 Tourism & Hospitality
                                </li>
                                <li>
                                    <span>✓</span> 🚚 Transport & Logistics
                                </li>
                                <li>
                                    <span>✓</span> 💰 Revenue
                                </li>
                                <li>
                                    <span>✓</span> .....
                                </li>
                            </ul>
                        </article>
                        {/* EVENTS CARD */}
                        <article className="membership-plan membership-extra-card">
                            <div className="membership-plan-top">
                                <div className="membership-icon">🎪</div>
                                <span className="membership-badge">EVENTS</span>
                            </div>
                            <h3>Chamber Events</h3>
                            <p className="membership-plan-description">
                                Participate in events that connect businesses, create opportunities and strengthen
                                partnerships.
                            </p>
                            <div className="membership-price">
                                <strong>85+</strong> <span>Events</span>
                            </div>
                            <ul className="membership-benefits">
                                <li>
                                    <span>✓</span> 🤝 Business networking events
                                </li>
                                <li>
                                    <span>✓</span> 🎓 Training & development
                                </li>
                                <li>
                                    <span>✓</span> 💼 Business forums
                                </li>
                                <li>
                                    <span>✓</span> 🎪 Exhibitions & expos
                                </li>
                                <li>
                                    <span>✓</span> 🌍 Trade events
                                </li>
                                <li>
                                    <span>✓</span> 🏢 Business conferences
                                </li>
                                <li>
                                    <span>✓</span> 🚀 Business opportunity events
                                </li>
                                <li>
                                    <span>✓</span> 🤝 Partnership events
                                </li>
                            </ul>
                        </article>
                    </div>
                    {/* MEMBERSHIP APPLICATION */}
                    <div className="membership-application-intro" id="membership-application">
                        <div className="membership-application-icon">📝</div>
                        <div className="membership-application-content">
                            <span className="membership-label">MEMBERSHIP APPLICATION</span>
                            <h3>Apply to Become a Chamber Member</h3>
                            <p>
                                Complete the application below to join Shagar Chamber of Commerce & Sectoral Association
                                and become part of the business community.
                            </p>
                            <form className="membership-form" id="membershipForm" onSubmit={handleSubmit}>
                                {/* PERSONAL INFORMATION */}
                                <div className="form-section-title">
                                    <span>👤</span>
                                    <h4>Personal Information</h4>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="fullName">
                                            Full Name <span>*</span>
                                        </label>{" "}
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            Phone Number <span>*</span>
                                        </label>{" "}
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email Address <span>*</span>
                                        </label>{" "}
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nationalIdFront">National ID - Front</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-id-card"></i>{" "}
                                            <input
                                                type="file"
                                                id="nationalIdFront"
                                                name="nationalIdFront"
                                                accept="image/*"
                                                capture="environment"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nationalIdBack">National ID - Back</label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-id-card"></i>{" "}
                                            <input
                                                type="file"
                                                id="nationalIdBack"
                                                name="nationalIdBack"
                                                accept="image/*"
                                                capture="environment"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* BUSINESS INFORMATION */}
                                <div className="form-section-title">
                                    <span>🏢</span>
                                    <h4>Business Information</h4>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="businessName">
                                            Business / Company Name <span>*</span>
                                        </label>{" "}
                                        <input
                                            type="text"
                                            id="businessName"
                                            name="businessName"
                                            placeholder="Enter business or company name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tin">
                                            TIN Number <small>(For traders/businesses where applicable)</small>
                                        </label>{" "}
                                        <input type="text" id="tin" name="tin" placeholder="Enter TIN number" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="businessSector">
                                            Business Sector <span>*</span>
                                        </label>
                                        <select id="businessSector" name="businessSector" required>
                                            <option value="">Select business sector</option>
                                            <option value="agriculture">🌾 Agriculture</option>
                                            <option value="" investment="">
                                                🏭 Investment
                                            </option>
                                            <option value="construction">🏗️ Construction</option>
                                            <option value="trade-retail">🛒 Trade</option>
                                            <option value="ict">💻 ICT & Technology</option>
                                            <option value="tourism">🏨 Tourism & Hospitality</option>
                                            <option value="transport">🚚 Transport & Logistics</option>
                                            <option value="revenue">💰 Revenue</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="businessAddress">
                                            Business Address <span>*</span>
                                        </label>{" "}
                                        <input
                                            type="text"
                                            id="businessAddress"
                                            name="businessAddress"
                                            placeholder="Enter business address"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* MEMBERSHIP INFORMATION */}
                                <div className="form-section-title">
                                    <span>🤝</span>
                                    <h4>Membership Information</h4>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="membershipType">
                                            Membership Type <span>*</span>
                                        </label>
                                        <select id="membershipType" name="membershipType" required>
                                            <option value="">Select membership type</option>
                                            <option value="member">Member — 84,000</option>
                                            <option value="partnership">Partnership — 120</option>
                                        </select>
                                    </div>
                                    {/* ===================================================== MEMBERSHIP PAYMENT ===================================================== */}
                                    <div className="form-group">
                                        <label htmlFor="businessCategory">
                                            Business Type <span>*</span>
                                        </label>
                                        <select
                                            id="businessCategory"
                                            name="businessCategory"
                                            required
                                            onChange={(event) => setCategory(event.target.value)}
                                        >
                                            <option value="">Select business type</option>
                                            <option value="trader">Trader — 1,000 ETB</option>
                                            <option value="plc">PLC — 5,000 ETB</option>
                                        </select>
                                    </div>
                                    <div
                                        id="membershipFeeDisplay"
                                        className="membership-fee-display"
                                        style={{ display: fee ? "block" : "none" }}
                                    >
                                        <strong>Membership Fee:</strong>{" "}
                                        <span id="membershipFeeAmount">{fee || "0 ETB"}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paymentMethod">
                                            Payment Method <span>*</span>
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            required
                                            onChange={(event) => setPaymentMethod(event.target.value)}
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="CBE">CBE</option>
                                            <option value="CBO">CBO</option>
                                            <option value="Sinke">Sinke</option>
                                            <option value="Awash">Awash</option>
                                        </select>
                                    </div>
                                    <div
                                        id="paymentAccountDisplay"
                                        className="payment-account-display"
                                        style={{ display: account ? "block" : "none" }}
                                    >
                                        <strong>Payment Account:</strong>{" "}
                                        <span id="paymentAccountNumber">{account || "-"}</span>
                                    </div>
                                    {/* ===================================================== PAYMENT RECEIPT ===================================================== */}
                                    <div className="form-group">
                                        <label htmlFor="paymentReceipt">
                                            Payment Receipt / Screenshot <span>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <i className="fas fa-receipt"></i>{" "}
                                            <input
                                                type="file"
                                                id="paymentReceipt"
                                                name="paymentReceipt"
                                                accept="image/jpeg,image/png,image/webp"
                                                capture="environment"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* BUSINESS DESCRIPTION */}
                                    <div className="form-section-title">
                                        <span>📝</span>
                                        <h4>Business Description</h4>
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label htmlFor="businessDescription">
                                            Tell us about your business <span>*</span>
                                        </label>
                                        <textarea
                                            id="businessDescription"
                                            name="businessDescription"
                                            rows={5}
                                            placeholder="Briefly describe your business, products or services..."
                                            required
                                        />
                                    </div>
                                    {/* FORM ACTION */}
                                    <div className="membership-form-actions">
                                        <button type="submit" className="membership-button" disabled={submitting}>
                                            {submitting ? (
                                                <>
                                                    <span>Submitting...</span>{" "}
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                </>
                                            ) : (
                                                <>
                                                    Submit Membership Application <span>→</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="form-note">🔒 Your information will be handled securely.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
