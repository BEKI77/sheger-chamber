"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { fillFields, readFields } from "@/lib/forms";
import PartnershipAdminCard from "./PartnershipAdminCard";

const FIELDS = {
    partner_name: "partnerName",
    partner_type: "partnerType",
    description: "partnerDescription",
    logo_url: "partnerLogo",
    website_url: "partnerWebsite",
    contact_email: "partnerEmail",
    contact_phone: "partnerPhone",
    status: "partnershipStatus"
};

export default function AdminPartnerships() {
    useAdminSession();
    const partnerships = useApiList("/api/partnerships", "partnerships");
    // The same form creates new partnerships and edits existing ones
    const [editingId, setEditingId] = useState(null);
    const reload = () => partnerships.reload({ showLoading: true });

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = readFields(form, FIELDS);
        try {
            const result = editingId
                ? await sendJson(`/api/partnerships/${editingId}`, "PUT", data, "Failed to save partnership")
                : await sendJson("/api/partnerships", "POST", data, "Failed to save partnership");
            alert(result.message || "Partnership saved successfully.");
            form.reset();
            reload();
        } catch (error) {
            console.error("Partnership save error:", error);
            alert("Unable to save partnership.");
        }
    }

    async function startEdit(partnership) {
        try {
            const response = await fetch(`/api/partnerships/${partnership.id}`);
            if (!response.ok) throw new Error("Failed to load partnership");
            const item = (await response.json()).partnership;
            if (!item) throw new Error("Partnership not found");
            const form = document.getElementById("partnershipForm");
            fillFields(form, {
                partnerName: item.partner_name,
                partnerType: item.partner_type,
                partnershipStatus: item.status || "Active",
                partnerLogo: item.logo_url,
                partnerWebsite: item.website_url,
                partnerEmail: item.contact_email,
                partnerPhone: item.contact_phone,
                partnerDescription: item.description
            });
            setEditingId(item.id);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (error) {
            console.error("Partnership editing error:", error);
            alert("Unable to load partnership for editing.");
        }
    }

    async function deletePartnership(partnership) {
        if (!confirm("Are you sure you want to delete this partnership?")) return;
        try {
            const result = await sendJson(
                `/api/partnerships/${partnership.id}`,
                "DELETE",
                null,
                "Failed to delete partnership"
            );
            alert(result.message || "Partnership deleted successfully.");
            reload();
        } catch (error) {
            console.error("Partnership deletion error:", error);
            alert("Unable to delete partnership.");
        }
    }

    return (
        <>
            {/* ===================================================== ADMIN HEADER ===================================================== */}
            <header className="admin-header">
                <div className="admin-container">
                    <div className="admin-header-content">
                        <div className="admin-brand">
                            <i className="fa-solid fa-handshake"></i>
                            <div>
                                <h1>Shagar Chamber</h1>
                                <span>Partnerships Management</span>
                            </div>
                        </div>
                        <a href="/" className="admin-back-link">
                            <i className="fa-solid fa-arrow-left"></i> Back to Website
                        </a>
                    </div>
                </div>
            </header>
            {/* ===================================================== MAIN CONTENT ===================================================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* ================================================= PAGE HEADING ================================================= */}
                    <div className="admin-page-heading">
                        <span className="admin-section-label">PARTNERSHIPS</span>
                        <h2>Partnership Management</h2>
                        <p>Create, update and manage Shagar Chamber partnerships.</p>
                    </div>
                    {/* ================================================= CREATE / EDIT FORM ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-header">
                            <div>
                                <h3>Add Partnership</h3>
                                <p>Enter the partner organization's information below.</p>
                            </div>
                        </div>
                        <form
                            id="partnershipForm"
                            className="admin-form"
                            onSubmit={handleSubmit}
                            onReset={() => setEditingId(null)}
                        >
                            {/* PARTNER NAME */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerName">Partner Name</label>{" "}
                                <input
                                    type="text"
                                    id="partnerName"
                                    name="partnerName"
                                    placeholder="Enter partner name"
                                    required
                                />
                            </div>
                            {/* PARTNER TYPE */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerType">Partner Type</label>{" "}
                                <select id="partnerType" name="partnerType" required>
                                    <option value="">Select partner type</option>
                                    <option value="Government">Government</option>
                                    <option value="Private Company">Private Company</option>
                                    <option value="Bank">Bank / Financial Institution</option>
                                    <option value="NGO">NGO / Development Organization</option>
                                    <option value="Association">Association</option>
                                    <option value="International Organization">International Organization</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* STATUS */}
                            <div className="admin-form-group">
                                <label htmlFor="partnershipStatus">Status</label>{" "}
                                <select id="partnershipStatus" name="partnershipStatus">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            {/* LOGO */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerLogo">Logo URL</label>{" "}
                                <input
                                    type="url"
                                    id="partnerLogo"
                                    name="partnerLogo"
                                    placeholder="https://example.com/logo.jpg"
                                />
                            </div>
                            {/* WEBSITE */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerWebsite">Website URL</label>{" "}
                                <input
                                    type="url"
                                    id="partnerWebsite"
                                    name="partnerWebsite"
                                    placeholder="https://example.com"
                                />
                            </div>
                            {/* EMAIL */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerEmail">Contact Email</label>{" "}
                                <input
                                    type="email"
                                    id="partnerEmail"
                                    name="partnerEmail"
                                    placeholder="partner@example.com"
                                />
                            </div>
                            {/* PHONE */}
                            <div className="admin-form-group">
                                <label htmlFor="partnerPhone">Contact Phone</label>{" "}
                                <input type="tel" id="partnerPhone" name="partnerPhone" placeholder="0912345678" />
                            </div>
                            {/* DESCRIPTION */}
                            <div className="admin-form-group admin-form-full">
                                <label htmlFor="partnerDescription">Partnership Description</label>{" "}
                                <textarea
                                    id="partnerDescription"
                                    name="partnerDescription"
                                    rows={6}
                                    placeholder="Describe the partnership..."
                                    required
                                />
                            </div>
                            {/* FORM BUTTONS */}
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button">
                                    <i className={editingId ? "fa-solid fa-save" : "fa-solid fa-plus"}></i>{" "}
                                    {editingId ? "Update Partnership" : "Create Partnership"}
                                </button>{" "}
                                <button type="reset" className="admin-secondary-button">
                                    <i className="fa-solid fa-rotate-left"></i> Reset
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ================================================= PARTNERSHIP LIST ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-header">
                            <div>
                                <h3>Existing Partnerships</h3>
                                <p>Manage partnerships currently stored in the system.</p>
                            </div>
                            <button
                                type="button"
                                id="refreshPartnerships"
                                className="admin-secondary-button"
                                onClick={reload}
                            >
                                <i className="fa-solid fa-arrows-rotate"></i> Refresh
                            </button>
                        </div>
                        <div id="admin-partnerships-list" className="admin-list">
                            {partnerships.status === "loading" && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <p>Loading partnerships...</p>
                                </div>
                            )}
                            {partnerships.status === "error" && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <p>Unable to load partnerships.</p>
                                </div>
                            )}
                            {partnerships.status === "ready" && !partnerships.items.length && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-handshake-slash"></i>
                                    <p>No partnerships available.</p>
                                </div>
                            )}
                            {partnerships.status === "ready" &&
                                partnerships.items.map((partnership) => (
                                    <PartnershipAdminCard
                                        key={partnership.id}
                                        partnership={partnership}
                                        onEdit={startEdit}
                                        onDelete={deletePartnership}
                                    />
                                ))}
                        </div>
                    </section>
                </div>
            </main>
            {/* ===================================================== JAVASCRIPT ===================================================== */}
        </>
    );
}
