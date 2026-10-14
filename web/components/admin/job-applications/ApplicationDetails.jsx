"use client";

import { useState } from "react";
import { fileName } from "@/lib/adminApi";

const STATUSES = ["Pending", "Shortlisted", "Rejected", "Hired"];

function formatDate(value) {
    if (!value) return "Not available";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function downloadFile(url, name) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function Detail({ label, children }) {
    return (
        <div className="detail-item">
            <strong>{label}</strong> <span>{children}</span>
        </div>
    );
}

export default function ApplicationDetails({ application, onSaveStatus }) {
    const [status, setStatus] = useState(application.status);
    const cvName = fileName(application.cv_path);
    const cvUrl = `/api/job-applications/cv/${encodeURIComponent(cvName)}`;

    return (
        <>
            <div className="detail-section">
                <h3>Applicant Information</h3>
                <div className="detail-grid">
                    <Detail label="Full Name">{application.full_name}</Detail>
                    <Detail label="Email">{application.email}</Detail>
                    <Detail label="Phone">{application.phone}</Detail>
                    <Detail label="Education">{application.education}</Detail>
                </div>
            </div>

            <div className="detail-section">
                <h3>Job Information</h3>
                <div className="detail-grid">
                    <Detail label="Position">{application.job_title}</Detail>
                    <Detail label="Application Date">{formatDate(application.created_at)}</Detail>
                </div>
            </div>

            <div className="detail-section">
                <h3>Experience</h3>
                <div className="cover-letter">{application.experience || "No experience information provided."}</div>
            </div>

            <div className="detail-section">
                <h3>Cover Letter</h3>
                <div className="cover-letter">{application.cover_letter || "No cover letter provided."}</div>
            </div>

            <div className="detail-section">
                <h3>Applicant CV</h3>
                <div className="application-actions">
                    {application.cv_path ? (
                        <div className="cv-actions">
                            <button
                                type="button"
                                className="cv-button download-cv-button"
                                onClick={() => downloadFile(cvUrl, cvName)}
                            >
                                <i className="fas fa-download"></i> Download CV
                            </button>
                        </div>
                    ) : (
                        <span>No CV available.</span>
                    )}
                </div>
            </div>

            <div className="detail-section">
                <h3>Application Status</h3>
                <div className="status-control">
                    <select id="applicationStatus" value={status} onChange={(event) => setStatus(event.target.value)}>
                        {STATUSES.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>{" "}
                    <button
                        type="button"
                        className="save-status-btn"
                        id="saveApplicationStatus"
                        onClick={() => onSaveStatus(application.id, status)}
                    >
                        <i className="fas fa-save"></i> Save Status
                    </button>
                </div>
            </div>
        </>
    );
}
