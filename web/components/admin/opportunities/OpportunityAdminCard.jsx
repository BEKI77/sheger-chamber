"use client";

import { useState } from "react";

// `busy` is "closing" or "deleting" while that request runs
export default function OpportunityAdminCard({ opportunity, onClose, onDelete }) {
    const [busy, setBusy] = useState(null);
    const deadline = opportunity.application_deadline
        ? new Date(opportunity.application_deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "No deadline";

    return (
        <article className="admin-opportunity-card">
            <div className="admin-opportunity-main">
                <span className="admin-opportunity-category">{opportunity.category}</span>
                <h4>{opportunity.title}</h4>
                {opportunity.organization && (
                    <p>
                        <i className="fas fa-building"></i> {opportunity.organization}
                    </p>
                )}
                {opportunity.location && (
                    <p>
                        <i className="fas fa-location-dot"></i> {opportunity.location}
                    </p>
                )}
                <p className="admin-opportunity-description">{opportunity.description}</p>
                <div className="admin-opportunity-meta">
                    <span>
                        <i className="fas fa-calendar"></i> {deadline}
                    </span>{" "}
                    <span className={`admin-status ${opportunity.status === "Open" ? "open" : "closed"}`}>
                        <i className="fas fa-circle"></i> {opportunity.status}
                    </span>
                </div>
            </div>
            <div className="admin-action-buttons">
                {opportunity.status === "Open" ? (
                    <button
                        type="button"
                        className="admin-close-button"
                        disabled={busy === "closing"}
                        onClick={() => onClose(opportunity, (on) => setBusy(on ? "closing" : null))}
                    >
                        <i className={busy === "closing" ? "fas fa-spinner fa-spin" : "fas fa-lock"}></i>{" "}
                        {busy === "closing" ? "Closing..." : "Close"}
                    </button>
                ) : (
                    <span className="admin-closed-label">
                        <i className="fas fa-lock"></i> Closed
                    </span>
                )}{" "}
                <button
                    type="button"
                    className="admin-delete-button"
                    disabled={busy === "deleting"}
                    onClick={() => onDelete(opportunity, (on) => setBusy(on ? "deleting" : null))}
                >
                    <i className={busy === "deleting" ? "fas fa-spinner fa-spin" : "fas fa-trash"}></i>{" "}
                    {busy === "deleting" ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
