"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { readFields } from "@/lib/forms";
import OpportunityAdminCard from "./OpportunityAdminCard";

const FIELDS = {
    title: "title",
    category: "category",
    organization: "organization",
    location: "location",
    description: "description",
    requirements: "requirements",
    contactEmail: "contactEmail",
    contactPhone: "contactPhone",
    applicationDeadline: "applicationDeadline"
};

export default function AdminOpportunities() {
    useAdminSession();
    const opportunities = useApiList("/api/opportunities", "opportunities");
    const [publishing, setPublishing] = useState(false);
    const reload = () => opportunities.reload({ showLoading: true });

    async function handleCreate(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = readFields(form, FIELDS);
        if (!data.title || !data.category || !data.description) {
            alert("Please complete all required fields.");
            return;
        }
        setPublishing(true);
        try {
            await sendJson("/api/opportunities", "POST", data, "Unable to create opportunity.");
            alert("Opportunity published successfully.");
            form.reset();
            reload();
        } catch (error) {
            console.error("Create opportunity error:", error);
            alert(error.message || "Unable to publish opportunity.");
        } finally {
            setPublishing(false);
        }
    }

    async function closeOpportunity(opportunity, setBusy) {
        if (!confirm("Are you sure you want to close this opportunity?")) return;
        setBusy(true);
        try {
            await sendJson(`/api/opportunities/${opportunity.id}/close`, "PATCH", null, "Unable to close opportunity.");
            alert("Opportunity closed successfully.");
            reload();
        } catch (error) {
            console.error("Close opportunity error:", error);
            alert(error.message || "Unable to close opportunity.");
            setBusy(false);
        }
    }

    async function reopenOpportunity(opportunity, setBusy) {
        if (!confirm("Are you sure you want to reopen this opportunity?")) return;
        setBusy(true);
        try {
            await sendJson(`/api/opportunities/${opportunity.id}/reopen`, "PATCH", null, "Unable to reopen opportunity.");
            alert("Opportunity reopened successfully.");
            reload();
        } catch (error) {
            console.error("Reopen opportunity error:", error);
            alert(error.message || "Unable to reopen opportunity.");
            setBusy(false);
        }
    }

    async function deleteOpportunity(opportunity, setBusy) {
        if (!confirm("Are you sure you want to permanently delete this opportunity?")) return;
        setBusy(true);
        try {
            await sendJson(`/api/opportunities/${opportunity.id}`, "DELETE", null, "Unable to delete opportunity.");
            alert("Opportunity deleted successfully.");
            reload();
        } catch (error) {
            console.error("Delete opportunity error:", error);
            alert(error.message || "Unable to delete opportunity.");
            setBusy(false);
        }
    }

    return (
        <>
            {/* ========================= MAIN CONTENT ========================= */}
            <main className="admin-main">
                <div className="admin-container">
                    <div className="admin-page-heading">
                        <span>
                            <i className="fas fa-briefcase"></i> ADMINISTRATION
                        </span>
                        <h2>Jobs & Opportunities</h2>
                        <p>Create and manage jobs, business opportunities, training programs and tenders.</p>
                    </div>
                    {/* ========================= CREATE OPPORTUNITY ========================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-plus-circle"></i> Add New Opportunity
                                </h3>
                            </div>
                        </div>
                        <form id="opportunityForm" onSubmit={handleCreate}>
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label htmlFor="title">
                                        Opportunity Title <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Example: Marketing Manager"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="category">
                                        Category <span>*</span>
                                    </label>{" "}
                                    <select id="category" name="category" required>
                                        <option value="">Select category</option>
                                        <option value="Job">Job</option>
                                        <option value="Business Opportunity">Business Opportunity</option>
                                        <option value="Training">Training</option>
                                        <option value="Tender">Tender</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="organization">Organization</label>{" "}
                                    <input
                                        type="text"
                                        id="organization"
                                        name="organization"
                                        placeholder="Company or organization"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="location">Location</label>{" "}
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        placeholder="Example: Addis Ababa"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="contactEmail">Contact Email</label>{" "}
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        name="contactEmail"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="contactPhone">Contact Phone</label>{" "}
                                    <input type="tel" id="contactPhone" name="contactPhone" placeholder="0912345678" />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="applicationDeadline">Application Deadline</label>{" "}
                                    <input type="date" id="applicationDeadline" name="applicationDeadline" />
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="description">
                                    Description <span>*</span>
                                </label>{" "}
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    placeholder="Describe the opportunity..."
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="requirements">Requirements</label>{" "}
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    rows={4}
                                    placeholder="Enter qualifications, requirements or other important information..."
                                />
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={publishing}>
                                    <i className={publishing ? "fas fa-spinner fa-spin" : "fas fa-plus"}></i>{" "}
                                    {publishing ? "Publishing..." : "Publish Opportunity"}
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ========================= EXISTING OPPORTUNITIES ========================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-list"></i> Existing Opportunities
                                </h3>
                            </div>
                            <button
                                type="button"
                                id="refreshOpportunities"
                                className="admin-secondary-button"
                                onClick={reload}
                            >
                                <i className="fas fa-refresh"></i> Refresh
                            </button>
                        </div>
                        <div id="admin-opportunities-list">
                            {opportunities.status === "loading" && (
                                <div className="admin-loading">
                                    <i className="fas fa-spinner fa-spin"></i> Loading opportunities...
                                </div>
                            )}
                            {opportunities.status === "error" && (
                                <div className="admin-error">
                                    <i className="fas fa-triangle-exclamation"></i>
                                    <h3>Unable to Load Opportunities</h3>
                                    <p>Make sure the backend server is running.</p>
                                </div>
                            )}
                            {opportunities.status === "ready" && !opportunities.items.length && (
                                <div className="admin-empty">
                                    <i className="fas fa-briefcase"></i>
                                    <h3>No Opportunities</h3>
                                    <p>No opportunities have been published yet.</p>
                                </div>
                            )}
                            {opportunities.status === "ready" &&
                                opportunities.items.map((opportunity) => (
                                    <OpportunityAdminCard
                                        key={opportunity.id}
                                        opportunity={opportunity}
                                        onClose={closeOpportunity}
                                        onReopen={reopenOpportunity}
                                        onDelete={deleteOpportunity}
                                    />
                                ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
