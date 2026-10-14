"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import MemberCard, { memberSearchText } from "./MemberCard";

const ACTIONS = {
    approve: {
        confirm: "Are you sure you want to approve this membership application?",
        path: (id) => `/api/members/${id}/status`,
        body: { status: "Active" },
        success: "Membership application approved successfully!",
        failure: "Unable to approve membership application."
    },
    reject: {
        confirm: "Are you sure you want to reject this membership application?",
        path: (id) => `/api/members/${id}/status`,
        body: { status: "Rejected" },
        success: "Membership application rejected successfully!",
        failure: "Unable to reject membership application."
    },
    verify: {
        confirm: "Have you verified this payment receipt and received the payment?",
        path: (id) => `/api/members/${id}/payment-status`,
        body: { paymentStatus: "Paid" },
        success: "Payment verified successfully!",
        failure: "Unable to verify payment."
    },
    fail: {
        confirm: "Are you sure you want to mark this payment as failed?",
        path: (id) => `/api/members/${id}/payment-status`,
        body: { paymentStatus: "Failed" },
        success: "Payment marked as failed.",
        failure: "Unable to update payment status."
    }
};

const NO_FILTERS = { search: "", status: "", type: "", payment: "" };

export default function AdminMembers() {
    useAdminSession();
    const members = useApiList("/api/members", "members");
    const [filters, setFilters] = useState(NO_FILTERS);
    const setFilter = (name) => (event) => setFilters({ ...filters, [name]: event.target.value });

    async function runAction(kind, member) {
        const action = ACTIONS[kind];
        if (!confirm(action.confirm)) return;
        try {
            await sendJson(action.path(member.id), "PATCH", action.body, action.failure);
            alert(action.success);
            members.reload();
        } catch (error) {
            console.error("Membership update error:", error);
            alert(error.message);
        }
    }

    const search = filters.search.trim().toLowerCase();
    const isVisible = (member) =>
        (!search || memberSearchText(member).includes(search)) &&
        (!filters.status || (member.status || "") === filters.status) &&
        (!filters.type || (member.membership_type || "") === filters.type) &&
        (!filters.payment || (member.payment_status || "") === filters.payment);
    const visibleCount = members.items.filter(isVisible).length;

    return (
        <>
            {/* ===================================================== ADMIN MEMBERSHIP PAGE ===================================================== */}
            <main className="admin-members-page">
                <div className="container">
                    {/* PAGE HEADING */}
                    <div className="section-heading">
                        <span className="section-label">ADMINISTRATION</span>
                        <h1>Membership Management</h1>
                        <p>Review and manage Shagar Chamber membership applications.</p>
                    </div>
                    {/* ===================================================== SEARCH & FILTERING ===================================================== */}
                    <section className="admin-search-section">
                        <div className="admin-search-heading">
                            <div>
                                <span className="section-label">SEARCH & FILTERING</span>
                                <h2>Find Membership Applications</h2>
                                <p>Search and filter membership applications quickly and easily.</p>
                            </div>
                        </div>
                        <div className="admin-search-controls">
                            {/* SEARCH */}
                            <div className="admin-search-box">
                                <label htmlFor="memberSearch">Search Members</label>
                                <div className="admin-search-input">
                                    <i className="fas fa-search"></i>{" "}
                                    <input
                                        type="text"
                                        id="memberSearch"
                                        placeholder="Search by name, email, or business..."
                                        value={filters.search}
                                        onChange={setFilter("search")}
                                    />
                                </div>
                            </div>
                            {/* STATUS */}
                            <div className="admin-filter-box">
                                <label htmlFor="memberStatusFilter">Status</label>{" "}
                                <select id="memberStatusFilter" value={filters.status} onChange={setFilter("status")}>
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            {/* MEMBERSHIP TYPE */}
                            <div className="admin-filter-box">
                                <label htmlFor="memberTypeFilter">Membership Type</label>{" "}
                                <select id="memberTypeFilter" value={filters.type} onChange={setFilter("type")}>
                                    <option value="">All Membership Types</option>
                                    <option value="Member">Member</option>
                                    <option value="Partnership">Partnership</option>
                                </select>
                            </div>
                            {/* PAYMENT STATUS */}
                            <div className="admin-filter-box">
                                <label htmlFor="memberPaymentFilter">Payment Status</label>{" "}
                                <select
                                    id="memberPaymentFilter"
                                    value={filters.payment}
                                    onChange={setFilter("payment")}
                                >
                                    <option value="">All Payment Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                        </div>
                        {/* CLEAR FILTERS */}
                        <div className="admin-search-actions">
                            <button
                                type="button"
                                id="clearMemberFilters"
                                className="admin-secondary-button"
                                onClick={() => setFilters(NO_FILTERS)}
                            >
                                <i className="fas fa-rotate-left"></i> Clear Filters
                            </button>
                        </div>
                    </section>
                    {/* MEMBERS LIST */}
                    <section className="admin-members-section">
                        <div className="admin-members-list" id="admin-members-list">
                            {members.status === "loading" && (
                                <div className="admin-empty-state">
                                    <i className="fas fa-users"></i>
                                    <h3>Loading Membership Applications...</h3>
                                    <p>Please wait while applications are loaded.</p>
                                </div>
                            )}
                            {members.status === "error" && (
                                <div className="admin-empty-state">
                                    <i className="fas fa-triangle-exclamation"></i>
                                    <h3>Unable to Load Applications</h3>
                                    <p>{members.error?.message}</p>
                                </div>
                            )}
                            {members.status === "ready" && !members.items.length && (
                                <div className="admin-empty-state">
                                    <i className="fas fa-users"></i>
                                    <h3>No Membership Applications</h3>
                                    <p>There are currently no membership applications to review.</p>
                                </div>
                            )}
                            {members.status === "ready" &&
                                members.items.map((member) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        hidden={!isVisible(member)}
                                        onAction={runAction}
                                    />
                                ))}
                            {members.status === "ready" && members.items.length > 0 && visibleCount === 0 && (
                                <div id="member-filter-no-results" className="admin-empty-state">
                                    <i className="fas fa-search"></i>
                                    <h3>No Matching Members</h3>
                                    <p>No membership applications match your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            {/* Admin Membership JavaScript */}
        </>
    );
}
