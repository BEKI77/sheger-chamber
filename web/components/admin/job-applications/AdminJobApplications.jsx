"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import ApplicationDetails from "./ApplicationDetails";

const STATUS_CLASSES = {
    Pending: "status-pending",
    Shortlisted: "status-shortlisted",
    Rejected: "status-rejected",
    Hired: "status-hired"
};

function Message({ children }) {
    return (
        <tr>
            <td colSpan={7} className="message">
                {children}
            </td>
        </tr>
    );
}

export default function AdminJobApplications() {
    useAdminSession();
    const applications = useApiList("/api/job-applications", "applications");
    // Details popup: null when closed, otherwise { status, application }
    const [details, setDetails] = useState(null);
    const reload = () => applications.reload({ showLoading: true });

    async function openApplication(id) {
        setDetails({ status: "loading" });
        try {
            const response = await fetch(`/api/job-applications/${id}`, { credentials: "include" });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Unable to load application.");
            setDetails({ status: "ready", application: data.application });
        } catch (error) {
            console.error("Failed to load application:", error);
            setDetails({ status: "error" });
        }
    }

    async function saveStatus(id, status) {
        try {
            await sendJson(`/api/job-applications/${id}/status`, "PATCH", { status }, "Unable to update status.");
            alert(`Application status changed to ${status}.`);
            reload();
            await openApplication(id);
        } catch (error) {
            console.error("Failed to update application status:", error);
            alert(error.message || "Unable to update application status.");
        }
    }

    return (
        <>
            {/* ========================================= ADMIN HEADER ========================================== */}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div className="admin-brand">
                        <div className="admin-logo">
                            <i className="fas fa-file-user"></i>
                        </div>
                        <div>
                            <h1>Shagar Chamber</h1>
                            <span>Job Applications Management</span>
                        </div>
                    </div>
                </div>
            </header>
            {/* ========================================= MAIN CONTENT ========================================== */}
            <main className="admin-container">
                <div className="page-title">
                    <h2>Job Applications</h2>
                    <p>Review and manage applications submitted for Chamber job opportunities.</p>
                </div>
                <section className="applications-card">
                    <div className="applications-header">
                        <h3>Applications</h3>
                        <button className="refresh-btn" id="refreshApplications" onClick={reload}>
                            <i className="fas fa-rotate"></i> Refresh
                        </button>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Job</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Education</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="applicationsTableBody">
                                {applications.status === "loading" && <Message>Loading applications...</Message>}
                                {applications.status === "error" && <Message>Unable to load applications.</Message>}
                                {applications.status === "ready" && !applications.items.length && (
                                    <Message>No job applications found.</Message>
                                )}
                                {applications.status === "ready" &&
                                    applications.items.map((application) => (
                                        <tr key={application.id}>
                                            <td>
                                                <strong>{application.full_name}</strong>
                                            </td>
                                            <td>{application.job_title}</td>
                                            <td>{application.email}</td>
                                            <td>{application.phone}</td>
                                            <td>{application.education}</td>
                                            <td>
                                                <span
                                                    className={`status ${STATUS_CLASSES[application.status] || "status-pending"}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="view-btn view-application-btn"
                                                    onClick={() => openApplication(application.id)}
                                                >
                                                    <i className="fas fa-eye"></i> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                {/* ========================================= APPLICATION DETAILS MODAL ========================================== */}
                <div
                    className={details ? "application-modal active" : "application-modal"}
                    id="applicationModal"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setDetails(null);
                    }}
                >
                    <div className="application-modal-content">
                        <div className="application-modal-header">
                            <div>
                                <h2>Application Details</h2>
                                <p>Review applicant information</p>
                            </div>
                            <button
                                type="button"
                                className="close-modal"
                                id="closeApplicationModal"
                                onClick={() => setDetails(null)}
                            >
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                        <div className="application-details" id="applicationDetails">
                            {!details && <div className="message">Loading application...</div>}
                            {details?.status === "loading" && (
                                <div className="message">Loading application details...</div>
                            )}
                            {details?.status === "error" && (
                                <div className="message">Unable to load application details.</div>
                            )}
                            {details?.status === "ready" && (
                                <ApplicationDetails
                                    key={`${details.application.id}-${details.application.status}`}
                                    application={details.application}
                                    onSaveStatus={saveStatus}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
