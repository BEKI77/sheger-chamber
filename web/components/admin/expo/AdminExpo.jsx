"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { dateInputValue, fillFields, readFields } from "@/lib/forms";
import ExpoAdminCard from "./ExpoAdminCard";

const FIELDS = {
    title: "expoTitle",
    type: "expoType",
    description: "expoDescription",
    image_url: "expoImage",
    location: "expoLocation",
    start_date: "expoStartDate",
    end_date: "expoEndDate",
    contact_email: "expoEmail",
    contact_phone: "expoPhone",
    status: "expoStatus"
};

export default function AdminExpo() {
    useAdminSession();
    const expos = useApiList("/api/expos", "expos");
    // The same form creates new expos and edits existing ones
    const [editingId, setEditingId] = useState(null);
    const reload = () => expos.reload({ showLoading: true });

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = readFields(form, FIELDS);
        try {
            const result = editingId
                ? await sendJson(`/api/expos/${editingId}`, "PUT", data, "Failed to update expo")
                : await sendJson("/api/expos", "POST", data, "Failed to create expo");
            alert(result.message || (editingId ? "Expo updated successfully." : "Expo created successfully."));
            form.reset();
            reload();
        } catch (error) {
            console.error("Expo save error:", error);
            alert(editingId ? "Unable to update expo." : "Unable to create expo.");
        }
    }

    async function startEdit(expo) {
        try {
            const response = await fetch(`/api/expos/${expo.id}`);
            if (!response.ok) throw new Error("Failed to load expo");
            const item = (await response.json()).expo;
            if (!item) throw new Error("Expo not found");
            const form = document.getElementById("expoForm");
            fillFields(form, {
                expoTitle: item.title,
                expoType: item.type,
                expoLocation: item.location,
                expoStatus: item.status || "Upcoming",
                expoStartDate: dateInputValue(item.start_date),
                expoEndDate: dateInputValue(item.end_date),
                expoEmail: item.contact_email,
                expoPhone: item.contact_phone,
                expoImage: item.image_url,
                expoDescription: item.description
            });
            setEditingId(item.id);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (error) {
            console.error("Expo editing error:", error);
            alert("Unable to load expo for editing.");
        }
    }

    async function deleteExpo(expo) {
        if (!confirm("Are you sure you want to delete this expo?")) return;
        try {
            const result = await sendJson(`/api/expos/${expo.id}`, "DELETE", null, "Failed to delete expo");
            alert(result.message || "Expo deleted successfully.");
            reload();
        } catch (error) {
            console.error("Expo deletion error:", error);
            alert("Unable to delete expo.");
        }
    }

    return (
        <>
            <main className="admin-main">
                <div className="admin-container">
                    <div className="admin-page-heading">
                        <span className="admin-section-label">
                            <i className="fas fa-globe"></i> Event Management
                        </span>
                        <h2>Expo Management</h2>
                        <p>Create and manage National and International Expo events.</p>
                    </div>
                    {/* ===================================================== CREATE EXPO SECTION ===================================================== */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-plus-circle"></i> Create Expo
                                </h3>
                                <p>Add a National or International Expo event.</p>
                            </div>
                        </div>
                        {/* ================================================= EXPO FORM ================================================= */}
                        <form
                            id="expoForm"
                            className="admin-form"
                            onSubmit={handleSubmit}
                            onReset={() => setEditingId(null)}
                        >
                            <div className="admin-form-grid">
                                {/* TITLE */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoTitle">Expo Title</label>{" "}
                                    <input
                                        type="text"
                                        id="expoTitle"
                                        name="title"
                                        placeholder="Enter expo title"
                                        required
                                    />
                                </div>
                                {/* TYPE */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoType">Expo Type</label>{" "}
                                    <select id="expoType" name="type" required>
                                        <option value="">Select Expo Type</option>
                                        <option value="National Expo">National Expo</option>
                                        <option value="International Expo">International Expo</option>
                                    </select>
                                </div>
                                {/* LOCATION */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoLocation">Location</label>{" "}
                                    <input
                                        type="text"
                                        id="expoLocation"
                                        name="location"
                                        placeholder="e.g. Addis Ababa, Ethiopia"
                                    />
                                </div>
                                {/* STATUS */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoStatus">Status</label>{" "}
                                    <select id="expoStatus" name="status">
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                {/* START DATE */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoStartDate">Start Date</label>{" "}
                                    <input type="date" id="expoStartDate" name="start_date" />
                                </div>
                                {/* END DATE */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoEndDate">End Date</label>{" "}
                                    <input type="date" id="expoEndDate" name="end_date" />
                                </div>
                                {/* CONTACT EMAIL */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoEmail">Contact Email</label>{" "}
                                    <input
                                        type="email"
                                        id="expoEmail"
                                        name="contact_email"
                                        placeholder="expo@example.com"
                                    />
                                </div>
                                {/* CONTACT PHONE */}
                                <div className="admin-form-group">
                                    <label htmlFor="expoPhone">Contact Phone</label>{" "}
                                    <input type="text" id="expoPhone" name="contact_phone" placeholder="0912345678" />
                                </div>
                                {/* IMAGE URL */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="expoImage">Image URL</label>{" "}
                                    <input
                                        type="url"
                                        id="expoImage"
                                        name="image_url"
                                        placeholder="https://example.com/expo-image.jpg"
                                    />
                                </div>
                                {/* DESCRIPTION */}
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="expoDescription">Description</label>{" "}
                                    <textarea
                                        id="expoDescription"
                                        name="description"
                                        rows={6}
                                        placeholder="Describe the expo..."
                                        required
                                    />
                                </div>
                            </div>
                            {/* FORM BUTTONS */}
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button">
                                    <i className={editingId ? "fa-solid fa-save" : "fa-solid fa-plus"}></i>{" "}
                                    {editingId ? "Update Expo" : "Create Expo"}
                                </button>{" "}
                                <button type="reset" className="admin-secondary-button">
                                    <i className="fa-solid fa-rotate-left"></i> Reset
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ===================================================== EXISTING EXPO SECTION ===================================================== */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-list"></i> Manage Expos
                                </h3>
                                <p>Edit or remove existing expos.</p>
                            </div>
                            <button type="button" id="refreshExpos" className="admin-secondary-button" onClick={reload}>
                                <i className="fa-solid fa-arrows-rotate"></i> Refresh
                            </button>
                        </div>
                        <div id="admin-expos-list" className="admin-list">
                            {expos.status === "loading" && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <p>Loading expos...</p>
                                </div>
                            )}
                            {expos.status === "error" && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <p>Unable to load expos.</p>
                                </div>
                            )}
                            {expos.status === "ready" && !expos.items.length && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-calendar-xmark"></i>
                                    <p>No expos available.</p>
                                </div>
                            )}
                            {expos.status === "ready" &&
                                expos.items.map((expo) => (
                                    <ExpoAdminCard key={expo.id} expo={expo} onEdit={startEdit} onDelete={deleteExpo} />
                                ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
