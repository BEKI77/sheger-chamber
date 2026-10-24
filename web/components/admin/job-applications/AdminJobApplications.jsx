"use client";

import { useMemo, useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import ApplicationDetails from "./ApplicationDetails";

const STATUSES = ["Pending", "Shortlisted", "Rejected", "Hired"];
const STATUS_CLASSES = {
    Pending: "status-pending",
    Shortlisted: "status-shortlisted",
    Rejected: "status-rejected",
    Hired: "status-hired"
};
const NO_JOB = "(No job title)";
const EMPTY_FILTERS = { job: "", status: "", search: "", from: "", to: "" };

const jobOf = (application) => application.job_title || NO_JOB;

function Message({ children }) {
    return (
        <tr>
            <td colSpan={8} className="message">
                {children}
            </td>
        </tr>
    );
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-CA");
}

// Does the application match the filters? (the view tab is checked separately)
function matches(application, filters) {
    if (filters.job && jobOf(application) !== filters.job) return false;
    if (filters.status && (application.status || "Pending") !== filters.status) return false;
    const day = formatDate(application.created_at);
    if (filters.from && (!day || day < filters.from)) return false;
    if (filters.to && (!day || day > filters.to)) return false;
    const search = filters.search.trim().toLowerCase();
    if (search) {
        const text = [application.full_name, application.email, application.phone, application.education]
            .join(" ")
            .toLowerCase();
        if (!text.includes(search)) return false;
    }
    return true;
}

// Counts per job (and a grand total) for the report table
function buildReport(applications) {
    const blank = () => ({ total: 0, archived: 0, ...Object.fromEntries(STATUSES.map((s) => [s, 0])) });
    const jobs = new Map();
    const totals = blank();
    for (const application of applications) {
        const job = jobOf(application);
        if (!jobs.has(job)) jobs.set(job, blank());
        for (const row of [jobs.get(job), totals]) {
            row.total++;
            row[application.status || "Pending"] = (row[application.status || "Pending"] || 0) + 1;
            if (application.archived_at) row.archived++;
        }
    }
    const rows = [...jobs.entries()].map(([job, counts]) => ({ job, ...counts }));
    rows.sort((a, b) => b.total - a.total || a.job.localeCompare(b.job));
    return { rows, totals };
}

function csvCell(value) {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(name, rows) {
    const csv = "﻿" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function AdminJobApplications() {
    useAdminSession();
    const applications = useApiList("/api/job-applications", "applications");
    // Details popup: null when closed, otherwise { status, application }
    const [details, setDetails] = useState(null);
    // "active", "archived" or "all"
    const [view, setView] = useState("active");
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const reload = () => applications.reload({ showLoading: true });
    const setFilter = (name) => (event) => setFilters((previous) => ({ ...previous, [name]: event.target.value }));

    const all = applications.items;
    const jobTitles = useMemo(() => [...new Set(all.map(jobOf))].sort((a, b) => a.localeCompare(b)), [all]);
    const counts = useMemo(() => {
        const archived = all.filter((application) => application.archived_at).length;
        return { active: all.length - archived, archived, all: all.length };
    }, [all]);
    // Report covers every application matching the filters, archived or not
    const filteredAll = useMemo(() => all.filter((application) => matches(application, filters)), [all, filters]);
    const visible = useMemo(
        () =>
            filteredAll.filter((application) =>
                view === "all" ? true : view === "archived" ? application.archived_at : !application.archived_at
            ),
        [filteredAll, view]
    );
    const report = useMemo(() => buildReport(filteredAll), [filteredAll]);
    const filtersActive = Object.values(filters).some(Boolean);

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

    async function setArchived(application, archived) {
        try {
            await sendJson(
                `/api/job-applications/${application.id}/archive`,
                "PATCH",
                { archived },
                archived ? "Unable to archive application." : "Unable to restore application."
            );
            reload();
            if (details?.application?.id === application.id) await openApplication(application.id);
        } catch (error) {
            console.error("Failed to change archive state:", error);
            alert(error.message || "Unable to update application.");
        }
    }

    async function deleteApplication(application) {
        const confirmed = confirm(
            `Permanently delete the application from ${application.full_name} for "${jobOf(application)}"?\n` +
                "The applicant's CV will also be deleted. This cannot be undone."
        );
        if (!confirmed) return;
        try {
            const result = await sendJson(
                `/api/job-applications/${application.id}`,
                "DELETE",
                null,
                "Unable to delete application."
            );
            alert(result.message);
            if (details?.application?.id === application.id) setDetails(null);
            reload();
        } catch (error) {
            console.error("Failed to delete application:", error);
            alert(error.message || "Unable to delete application.");
        }
    }

    function exportApplications() {
        const header = ["ID", "Applicant", "Job", "Email", "Phone", "Education", "Status", "Applied", "Archived"];
        const rows = visible.map((application) => [
            application.id,
            application.full_name,
            jobOf(application),
            application.email,
            application.phone,
            application.education,
            application.status || "Pending",
            formatDate(application.created_at),
            formatDate(application.archived_at)
        ]);
        downloadCsv(`job-applications-${view}-${formatDate(new Date())}.csv`, [header, ...rows]);
    }

    function exportReport() {
        const header = ["Job", "Total", ...STATUSES, "Archived"];
        const line = (job, row) => [job, row.total, ...STATUSES.map((s) => row[s]), row.archived];
        downloadCsv(`job-applications-report-${formatDate(new Date())}.csv`, [
            header,
            ...report.rows.map((row) => line(row.job, row)),
            line("All jobs", report.totals)
        ]);
    }

    return (
        <>
            {/* ========================================= MAIN CONTENT ========================================== */}
            <main className="admin-container">
                <div className="admin-page-heading">
                    <span className="admin-section-label">
                        <i className="fas fa-file-lines"></i> Recruitment
                    </span>
                    <h2>Job Applications</h2>
                    <p>Review and manage applications submitted for Chamber job opportunities.</p>
                </div>

                {/* ========================================= FILTERS ========================================== */}
                <section className="applications-card filters-card no-print">
                    <div className="filters-grid">
                        <label>
                            Job
                            <select value={filters.job} onChange={setFilter("job")}>
                                <option value="">All jobs</option>
                                {jobTitles.map((title) => (
                                    <option key={title} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Status
                            <select value={filters.status} onChange={setFilter("status")}>
                                <option value="">All statuses</option>
                                {STATUSES.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Applied from
                            <input type="date" value={filters.from} onChange={setFilter("from")} />
                        </label>
                        <label>
                            Applied to
                            <input type="date" value={filters.to} onChange={setFilter("to")} />
                        </label>
                        <label className="filter-search">
                            Search
                            <input
                                type="search"
                                placeholder="Name, email, phone or education"
                                value={filters.search}
                                onChange={setFilter("search")}
                            />
                        </label>
                    </div>
                    {filtersActive && (
                        <button type="button" className="clear-filters-btn" onClick={() => setFilters(EMPTY_FILTERS)}>
                            <i className="fas fa-filter-circle-xmark"></i> Clear filters
                        </button>
                    )}
                </section>

                {/* ========================================= REPORT ========================================== */}
                <section className="applications-card report-card">
                    <div className="applications-header">
                        <div>
                            <h3>Report by Job</h3>
                            <p className="report-subtitle">
                                {filters.job || "All jobs"}
                                {filters.status && ` · ${filters.status}`}
                                {(filters.from || filters.to) &&
                                    ` · ${filters.from || "start"} to ${filters.to || "today"}`}
                                {filters.search && ` · matching "${filters.search}"`}
                            </p>
                        </div>
                        <div className="header-actions no-print">
                            <button type="button" className="refresh-btn" onClick={exportReport}>
                                <i className="fas fa-file-csv"></i> Export Report
                            </button>
                            <button type="button" className="refresh-btn" onClick={() => window.print()}>
                                <i className="fas fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <strong>{report.totals.total}</strong>
                            <span>Total</span>
                        </div>
                        {STATUSES.map((value) => (
                            <div key={value} className={`summary-item ${STATUS_CLASSES[value]}`}>
                                <strong>{report.totals[value]}</strong>
                                <span>{value}</span>
                            </div>
                        ))}
                        <div className="summary-item summary-archived">
                            <strong>{report.totals.archived}</strong>
                            <span>Archived</span>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Total</th>
                                    {STATUSES.map((value) => (
                                        <th key={value}>{value}</th>
                                    ))}
                                    <th>Archived</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.status === "ready" && !report.rows.length && (
                                    <tr>
                                        <td colSpan={STATUSES.length + 3} className="message">
                                            No applications match these filters.
                                        </td>
                                    </tr>
                                )}
                                {report.rows.map((row) => (
                                    <tr
                                        key={row.job}
                                        className={filters.job === row.job ? "selected-row" : "clickable-row"}
                                        title="Show only this job"
                                        onClick={() =>
                                            setFilters((previous) => ({
                                                ...previous,
                                                job: previous.job === row.job ? "" : row.job
                                            }))
                                        }
                                    >
                                        <td>
                                            <strong>{row.job}</strong>
                                        </td>
                                        <td>{row.total}</td>
                                        {STATUSES.map((value) => (
                                            <td key={value}>{row[value]}</td>
                                        ))}
                                        <td>{row.archived}</td>
                                    </tr>
                                ))}
                                {report.rows.length > 1 && (
                                    <tr className="total-row">
                                        <td>All jobs</td>
                                        <td>{report.totals.total}</td>
                                        {STATUSES.map((value) => (
                                            <td key={value}>{report.totals[value]}</td>
                                        ))}
                                        <td>{report.totals.archived}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ========================================= APPLICATIONS ========================================== */}
                <section className="applications-card">
                    <div className="applications-header">
                        <div className="view-tabs no-print">
                            {[
                                ["active", "Active"],
                                ["archived", "Archived"],
                                ["all", "All"]
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={view === value ? "view-tab active" : "view-tab"}
                                    onClick={() => setView(value)}
                                >
                                    {label} <span className="tab-count">{counts[value]}</span>
                                </button>
                            ))}
                        </div>
                        <h3 className="print-only">Applications ({view})</h3>
                        <div className="header-actions no-print">
                            <button type="button" className="refresh-btn" onClick={exportApplications}>
                                <i className="fas fa-file-csv"></i> Export List
                            </button>
                            <button className="refresh-btn" id="refreshApplications" onClick={reload}>
                                <i className="fas fa-rotate"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Job</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Applied</th>
                                    <th>Status</th>
                                    <th className="no-print">Action</th>
                                </tr>
                            </thead>
                            <tbody id="applicationsTableBody">
                                {applications.status === "loading" && <Message>Loading applications...</Message>}
                                {applications.status === "error" && <Message>Unable to load applications.</Message>}
                                {applications.status === "ready" && !visible.length && (
                                    <Message>
                                        {all.length ? "No applications match these filters." : "No job applications found."}
                                    </Message>
                                )}
                                {applications.status === "ready" &&
                                    visible.map((application) => (
                                        <tr key={application.id} className={application.archived_at ? "archived-row" : ""}>
                                            <td>
                                                <strong>{application.full_name}</strong>
                                                {application.archived_at && <span className="archived-tag">Archived</span>}
                                            </td>
                                            <td>{jobOf(application)}</td>
                                            <td>{application.email}</td>
                                            <td>{application.phone}</td>
                                            <td>{formatDate(application.created_at)}</td>
                                            <td>
                                                <span
                                                    className={`status ${STATUS_CLASSES[application.status] || "status-pending"}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td className="row-actions no-print">
                                                <button
                                                    type="button"
                                                    className="view-btn view-application-btn"
                                                    onClick={() => openApplication(application.id)}
                                                >
                                                    <i className="fas fa-eye"></i> View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="row-btn archive-btn"
                                                    onClick={() => setArchived(application, !application.archived_at)}
                                                >
                                                    {application.archived_at ? (
                                                        <>
                                                            <i className="fas fa-box-open"></i> Restore
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-box-archive"></i> Archive
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="row-btn delete-btn"
                                                    onClick={() => deleteApplication(application)}
                                                >
                                                    <i className="fas fa-trash"></i> Delete
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
                                    onSetArchived={setArchived}
                                    onDelete={deleteApplication}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
