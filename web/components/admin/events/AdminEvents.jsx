"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { dateInputValue, fillFields, readFields } from "@/lib/forms";
import EventItem from "./EventItem";

const FIELDS = {
    title: "title",
    eventType: "eventType",
    description: "description",
    eventDate: "eventDate",
    eventTime: "eventTime",
    location: "location",
    imageUrl: "imageUrl",
    contactEmail: "contactEmail",
    contactPhone: "contactPhone",
    status: "status"
};

export default function AdminEvents() {
    useAdminSession();
    const events = useApiList("/api/events", "events");
    // The same form creates new events and edits existing ones
    const [editingId, setEditingId] = useState(null);
    const reload = () => events.reload({ showLoading: true });

    async function handleSubmit(submitEvent) {
        submitEvent.preventDefault();
        const form = submitEvent.currentTarget;
        const data = readFields(form, FIELDS);
        try {
            if (editingId) {
                await sendJson(`/api/events/${editingId}`, "PUT", data, "Failed to update event.");
                alert("Event updated successfully!");
            } else {
                await sendJson("/api/events", "POST", data, "Failed to create event.");
                alert("Event created successfully!");
            }
            form.reset();
            reload();
        } catch (error) {
            console.error(editingId ? "Error updating event:" : "Error creating event:", error);
            alert(error.message || (editingId ? "Failed to update event." : "Failed to create event."));
        }
    }

    async function startEdit(event) {
        try {
            const response = await fetch(`/api/events/${event.id}`);
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Failed to load event.");
            const item = data.event;
            fillFields(document.getElementById("eventForm"), {
                title: item.title,
                eventType: item.event_type,
                description: item.description,
                eventDate: dateInputValue(item.event_date),
                eventTime: item.event_time ? String(item.event_time).substring(0, 5) : "",
                location: item.location,
                imageUrl: item.image_url,
                contactEmail: item.contact_email,
                contactPhone: item.contact_phone,
                status: item.status || "Upcoming"
            });
            setEditingId(item.id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Error loading event:", error);
            alert(error.message || "Failed to load event.");
        }
    }

    async function deleteEvent(event) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await sendJson(`/api/events/${event.id}`, "DELETE", null, "Failed to delete event.");
            alert("Event deleted successfully!");
            reload();
        } catch (error) {
            console.error("Error deleting event:", error);
            alert(error.message || "Failed to delete event.");
        }
    }

    return (
        <>
            {/* ===================================================== MAIN CONTENT ===================================================== */}
            <main className="admin-container">
                <div className="admin-page-heading">
                    <span className="admin-section-label">
                        <i className="fas fa-calendar-days"></i> Event Management
                    </span>
                    <h2>Events Management</h2>
                    <p>Create and manage Shagar Chamber events.</p>
                </div>
                {/* ================================================= EVENT FORM ================================================= */}
                <div className="admin-card">
                    <h3>
                        <i className="fas fa-plus-circle"></i> Add New Event
                    </h3>
                    <form id="eventForm" onSubmit={handleSubmit} onReset={() => setEditingId(null)}>
                        <div className="form-grid">
                            {/* TITLE */}
                            <div className="form-group">
                                <label htmlFor="title">Event Title *</label>{" "}
                                <input type="text" id="title" name="title" placeholder="Enter event title" required />
                            </div>
                            {/* EVENT TYPE */}
                            <div className="form-group">
                                <label htmlFor="eventType">Event Type *</label>{" "}
                                <select id="eventType" name="eventType" required>
                                    <option value="">Select event type</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Business Forum">Business Forum</option>
                                    <option value="Networking">Networking</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* DATE */}
                            <div className="form-group">
                                <label htmlFor="eventDate">Event Date *</label>{" "}
                                <input type="date" id="eventDate" name="eventDate" required />
                            </div>
                            {/* TIME */}
                            <div className="form-group">
                                <label htmlFor="eventTime">Event Time</label>{" "}
                                <input type="time" id="eventTime" name="eventTime" />
                            </div>
                            {/* LOCATION */}
                            <div className="form-group">
                                <label htmlFor="location">Location</label>{" "}
                                <input type="text" id="location" name="location" placeholder="Enter event location" />
                            </div>
                            {/* IMAGE */}
                            <div className="form-group">
                                <label htmlFor="imageUrl">Image URL</label>{" "}
                                <input type="text" id="imageUrl" name="imageUrl" placeholder="Enter image URL" />
                            </div>
                            {/* EMAIL */}
                            <div className="form-group">
                                <label htmlFor="contactEmail">Contact Email</label>{" "}
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    placeholder="Enter contact email"
                                />
                            </div>
                            {/* PHONE */}
                            <div className="form-group">
                                <label htmlFor="contactPhone">Contact Phone</label>{" "}
                                <input
                                    type="text"
                                    id="contactPhone"
                                    name="contactPhone"
                                    placeholder="Enter contact phone"
                                />
                            </div>
                            {/* STATUS */}
                            <div className="form-group">
                                <label htmlFor="status">Status</label>{" "}
                                <select id="status" name="status">
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            {/* DESCRIPTION */}
                            <div className="form-group full">
                                <label htmlFor="description">Description</label>{" "}
                                <textarea id="description" name="description" placeholder="Enter event description" />
                            </div>
                        </div>
                        {/* BUTTONS */}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <i className={editingId ? "fas fa-pen" : "fas fa-save"}></i>{" "}
                                {editingId ? "Update Event" : "Save Event"}
                            </button>{" "}
                            <button type="reset" className="btn btn-secondary" id="resetEventForm">
                                <i className="fas fa-rotate-left"></i> Reset
                            </button>
                        </div>
                    </form>
                </div>
                {/* ================================================= EVENTS LIST ================================================= */}
                <div className="admin-card">
                    <div className="list-header">
                        <h3>
                            <i className="fas fa-calendar-check"></i> Events
                        </h3>
                        <button className="btn btn-secondary" id="refreshEvents" onClick={reload}>
                            <i className="fas fa-refresh"></i> Refresh
                        </button>
                    </div>
                    <div id="admin-events-list" className="event-list">
                        {events.status === "loading" && (
                            <div className="empty-state">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Loading events...</p>
                            </div>
                        )}
                        {events.status === "error" && (
                            <div className="empty-state">
                                <i className="fas fa-triangle-exclamation"></i>
                                <p>Failed to load events.</p>
                            </div>
                        )}
                        {events.status === "ready" && !events.items.length && (
                            <div className="empty-state">
                                <i className="fas fa-calendar-xmark"></i>
                                <p>No events have been created yet.</p>
                            </div>
                        )}
                        {events.status === "ready" &&
                            events.items.map((event) => (
                                <EventItem key={event.id} event={event} onEdit={startEdit} onDelete={deleteEvent} />
                            ))}
                    </div>
                </div>
            </main>
            {/* JAVASCRIPT */}
        </>
    );
}
