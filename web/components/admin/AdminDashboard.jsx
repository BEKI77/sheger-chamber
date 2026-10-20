"use client";

import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import AdminShell from "./AdminShell";

const sumAmounts = (records) => records.reduce((total, record) => total + Number(record.amount || 0), 0);

export default function AdminDashboard() {
    const admin = useAdminSession();
    const members = useApiList("/api/members", "members");
    const opportunities = useApiList("/api/opportunities", "opportunities");
    const applications = useApiList("/api/job-applications", "applications");
    const revenue = useApiList("/api/revenue", "revenue");

    // Counts show 0 until loaded, like before
    const count = (list, include = () => true) => (list.status === "ready" ? list.items.filter(include).length : 0);
    // Only approved members count; approving one raises the total
    const isActiveMember = (member) => member.status === "Active";
    const totalRevenue = revenue.status === "ready" ? sumAmounts(revenue.items).toLocaleString() + " ETB" : "0 ETB";
    const adminName = (admin && (admin.fullName || admin.email)) || "Administrator";

    return (
        <AdminShell>
            {/* ===================================================== MAIN ADMIN AREA ===================================================== */}
            <main className="admin-main admin-dashboard">
                {/* TOP BAR */}
                <header className="admin-topbar">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Shagar Chamber of Commerce & Sectoral Association</p>
                    </div>
                    <a href="/admin/profile" className="admin-user" title="My Profile">
                        <i className="fas fa-user-shield"></i> <span>{adminName}</span>
                    </a>
                </header>
                {/* ================================================= DASHBOARD CONTENT ================================================= */}
                <section className="dashboard-content">
                    <div className="dashboard-intro">
                        <h2>Welcome to Shagar Chamber Administration</h2>
                        <p>
                            Manage members, opportunities, applications, news, events, partnerships and revenue from one
                            central dashboard.
                        </p>
                    </div>
                    {/* ================================================= STATISTICS ================================================= */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info">
                                <span>Total Members</span> <strong id="total-members">{count(members, isActiveMember)}</strong>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <div className="stat-info">
                                <span>Opportunities</span>{" "}
                                <strong id="total-opportunities">{count(opportunities)}</strong>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-file-lines"></i>
                            </div>
                            <div className="stat-info">
                                <span>Job Applications</span>{" "}
                                <strong id="total-applications">{count(applications)}</strong>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div className="stat-info">
                                <span>Revenue</span> <strong id="total-revenue">{totalRevenue}</strong>
                            </div>
                        </div>
                    </div>
                    {/* ================================================= MANAGEMENT ================================================= */}
                    <h2 className="section-title">Management</h2>
                    <div className="management-grid">
                        {/* MEMBERS */}
                        <a href="/admin/members" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Members</h3>
                            <p>Review and manage Chamber membership applications and member information.</p>
                            <span className="management-link">Manage Members →</span>
                        </a>{" "}
                        {/* OPPORTUNITIES */}
                        <a href="/admin/opportunities" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <h3>Opportunities & Jobs</h3>
                            <p>Create, manage and monitor business opportunities and job listings.</p>
                            <span className="management-link">Manage Opportunities →</span>
                        </a>{" "}
                        {/* JOB APPLICATIONS */}
                        <a href="/admin/job-applications" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-file-lines"></i>
                            </div>
                            <h3>Job Applications</h3>
                            <p>Review applicants, CVs and application statuses.</p>
                            <span className="management-link">Manage Applications →</span>
                        </a>{" "}
                        {/* NEWS */}
                        <a href="/admin/news" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-newspaper"></i>
                            </div>
                            <h3>News</h3>
                            <p>Publish and manage Chamber news, announcements and updates.</p>
                            <span className="management-link">Manage News →</span>
                        </a>{" "}
                        {/* EXPO */}
                        <a href="/admin/expo" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h3>Expo</h3>
                            <p>Manage National and International Expo activities.</p>
                            <span className="management-link">Manage Expo →</span>
                        </a>{" "}
                        {/* EVENTS */}
                        <a href="/admin/events" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-calendar-days"></i>
                            </div>
                            <h3>Events</h3>
                            <p>Manage Chamber events, schedules and activities.</p>
                            <span className="management-link">Manage Events →</span>
                        </a>{" "}
                        {/* PARTNERSHIPS */}
                        <a href="/admin/partnerships" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3>Partnerships</h3>
                            <p>Manage partnership requests and partner information.</p>
                            <span className="management-link">Manage Partnerships →</span>
                        </a>{" "}
                        {/* REVENUE */}
                        <a href="/admin/revenue" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <h3>Revenue</h3>
                            <p>Monitor membership, partnership, expo and other revenue records.</p>
                            <span className="management-link">Manage Revenue →</span>
                        </a>{" "}
                        {/* CONTACT */}
                        <a href="/admin/contact" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <h3>Contact Messages</h3>
                            <p>Review messages and inquiries submitted through the Chamber website.</p>
                            <span className="management-link">Manage Messages →</span>
                        </a>{" "}
                        {/* PROFILE */}
                        <a href="/admin/profile" className="management-card">
                            <div className="management-icon">
                                <i className="fas fa-user-gear"></i>
                            </div>
                            <h3>My Profile</h3>
                            <p>Change your admin username, email address and password.</p>
                            <span className="management-link">Manage Profile →</span>
                        </a>
                    </div>
                </section>
            </main>
        </AdminShell>
    );
}
