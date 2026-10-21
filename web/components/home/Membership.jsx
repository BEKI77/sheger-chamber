"use client";

import { useState } from "react";
import { uploadDirect } from "@/lib/directUpload";
import { useChamberTotals } from "@/lib/useChamberTotals";

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
    const totals = useChamberTotals();

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

        const files = { nationalIdFront: frontFile, nationalIdBack: backFile, paymentReceipt: receiptFile };

        setSubmitting(true);

        try {
            // Photos go straight to storage first; a problem there (wrong type,
            // too large) is shown like any other rejected application
            let uploaded;
            try {
                uploaded = await uploadDirect("membership", files);
            } catch (error) {
                alert(error.message);
                return;
            }

            let body;
            if (uploaded) {
                body = JSON.stringify({ ...values, ...uploaded });
            } else {
                body = new FormData();
                Object.entries({ ...values, ...files }).forEach(([name, value]) => body.append(name, value));
            }

            const response = await fetch("/api/members/register", {
                method: "POST",
                headers: uploaded ? { "Content-Type": "application/json" } : undefined,
                body
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
        <section id="membership" className="sc-section">
            <div className="sc-container">
                {/* MEMBERSHIP BANNER */}
                <div className="sc-membership-banner">
                    <div>
                        <h2 className="sc-title">Join {totals.members}+ members</h2>
                        <p>
                            Pay the fee at CBE, CBO, Sinke or Awash, then apply below with your receipt and National ID.
                            Applications are reviewed by the Chamber team.
                        </p>
                        <p className="sc-membership-partners">
                            <strong>{totals.partnerships}+</strong> partner organizations already work with the Chamber.
                        </p>
                    </div>
                    <div className="sc-plans">
                        <a href="#membership-application" className="sc-plan">
                            <span>Sole Proprietorship</span>
                            <strong>
                                1,000 <small>ETB</small>
                            </strong>
                            <em>Apply →</em>
                        </a>
                        <a href="#membership-application" className="sc-plan sc-plan-featured">
                            <span>PLC</span>
                            <strong>
                                5,000 <small>ETB</small>
                            </strong>
                            <em>Apply →</em>
                        </a>
                    </div>
                </div>

                {/* MEMBERSHIP APPLICATION */}
                <div className="sc-form-card" id="membership-application">
                    <div className="sc-form-intro">
                        <span className="sc-eyebrow">Membership application</span>
                        <h3>Apply to become a Chamber member</h3>
                        <p>Fields marked * are required. It takes about ten minutes.</p>
                    </div>

                    <form className="sc-form" id="membershipForm" onSubmit={handleSubmit}>
                        {/* PERSONAL INFORMATION */}
                        <h4 className="sc-form-section">1. Personal information</h4>
                        <div className="sc-form-grid">
                            <div className="sc-field">
                                <label htmlFor="fullName">
                                    Full Name <span>*</span>
                                </label>
                                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="phone">
                                    Phone Number <span>*</span>
                                </label>
                                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="email">
                                    Email Address <span>*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="nationalIdFront">
                                    National ID - Front <span>*</span>
                                </label>
                                <input
                                    type="file"
                                    id="nationalIdFront"
                                    name="nationalIdFront"
                                    accept="image/*"
                                    capture="environment"
                                    required
                                />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="nationalIdBack">
                                    National ID - Back <span>*</span>
                                </label>
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

                        {/* BUSINESS INFORMATION */}
                        <h4 className="sc-form-section">2. Business information</h4>
                        <div className="sc-form-grid">
                            <div className="sc-field">
                                <label htmlFor="businessName">
                                    Business / Company Name <span>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    placeholder="Enter business or company name"
                                    required
                                />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="tin">
                                    TIN Number <small>(For traders/businesses where applicable)</small>
                                </label>
                                <input type="text" id="tin" name="tin" placeholder="Enter TIN number" />
                            </div>
                            <div className="sc-field">
                                <label htmlFor="businessSector">
                                    Business Sector <span>*</span>
                                </label>
                                <select id="businessSector" name="businessSector" required>
                                    <option value="">Select business sector</option>
                                    <option value="agriculture">Agriculture</option>
                                    <option value="investment">Investment</option>
                                    <option value="construction">Construction</option>
                                    <option value="trade-retail">Trade</option>
                                    <option value="ict">ICT & Technology</option>
                                    <option value="tourism">Tourism & Hospitality</option>
                                    <option value="transport">Transport & Logistics</option>
                                    <option value="administration">Administration</option>
                                    <option value="job-creation">Job Creation & Skills</option>
                                    <option value="revenue">Revenue</option>
                                    <option value="service">Service Sector</option>
                                </select>
                            </div>
                            <div className="sc-field">
                                <label htmlFor="businessAddress">
                                    Business Address <span>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="businessAddress"
                                    name="businessAddress"
                                    placeholder="Enter business address"
                                    required
                                />
                            </div>
                            <div className="sc-field sc-field-full">
                                <label htmlFor="businessDescription">
                                    Tell us about your business <span>*</span>
                                </label>
                                <textarea
                                    id="businessDescription"
                                    name="businessDescription"
                                    rows={4}
                                    placeholder="Briefly describe your business, products or services..."
                                    required
                                />
                            </div>
                        </div>

                        {/* MEMBERSHIP & PAYMENT */}
                        <h4 className="sc-form-section">3. Membership &amp; payment</h4>
                        <div className="sc-form-grid">
                            <div className="sc-field">
                                <label htmlFor="membershipType">
                                    Membership Type <span>*</span>
                                </label>
                                <select id="membershipType" name="membershipType" required>
                                    <option value="">Select membership type</option>
                                    <option value="member">Member — 84,000</option>
                                    <option value="partnership">Partnership — 120</option>
                                </select>
                            </div>
                            <div className="sc-field">
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
                                    <option value="trader">Sol Partnership — 1,000 ETB</option>
                                    <option value="plc">PLC — 5,000 ETB</option>
                                </select>
                                {fee && (
                                    <p className="sc-field-note">
                                        Membership fee: <strong>{fee}</strong>
                                    </p>
                                )}
                            </div>
                            <div className="sc-field">
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
                                {account && (
                                    <p className="sc-field-note">
                                        Pay to account: <strong>{account}</strong>
                                    </p>
                                )}
                            </div>
                            <div className="sc-field">
                                <label htmlFor="paymentReceipt">
                                    Payment Receipt / Screenshot <span>*</span>
                                </label>
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

                        {/* FORM ACTION */}
                        <div className="sc-form-actions">
                            <button type="submit" className="sc-btn sc-btn-primary sc-btn-lg" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        Submitting... <i className="fas fa-spinner fa-spin"></i>
                                    </>
                                ) : (
                                    "Submit membership application"
                                )}
                            </button>
                            <p>
                                <i className="fa-solid fa-lock"></i> Your information will be handled securely.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
