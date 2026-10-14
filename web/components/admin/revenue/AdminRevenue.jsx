"use client";

import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import { readFields } from "@/lib/forms";
import RevenueCard from "./RevenueCard";

const FIELDS = {
    revenueType: "revenueType",
    description: "description",
    payerName: "payerName",
    amount: "amount",
    paymentMethod: "paymentMethod",
    paymentStatus: "paymentStatus",
    paymentDate: "paymentDate",
    reference: "reference",
    notes: "notes"
};

export default function AdminRevenue() {
    useAdminSession();
    const revenue = useApiList("/api/revenue", "revenue");
    const reload = () => revenue.reload({ showLoading: true });

    async function handleCreate(event) {
        event.preventDefault();
        const form = event.currentTarget;
        try {
            await sendJson("/api/revenue", "POST", readFields(form, FIELDS), "Unable to save revenue.");
            alert("Revenue record saved successfully.");
            form.reset();
            reload();
        } catch (error) {
            console.error("Revenue save error:", error);
            alert(error.message || "Unable to save revenue record.");
        }
    }

    return (
        <>
            {/* ===================================================== ADMIN HEADER ===================================================== */}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div className="admin-brand">
                        <div className="admin-logo">
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div>
                            <h1>Shagar Chamber</h1>
                            <span>Revenue Management</span>
                        </div>
                    </div>
                    <a href="/" className="admin-back-link">
                        <i className="fas fa-arrow-left"></i> Back to Website
                    </a>
                </div>
            </header>
            {/* ===================================================== MAIN CONTENT ===================================================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* PAGE HEADING */}
                    <div className="admin-page-heading">
                        <span className="admin-section-label">
                            <i className="fas fa-chart-line"></i> Financial Management
                        </span>
                        <h2>Revenue Management</h2>
                        <p>Record, monitor and manage revenue generated through Chamber services and activities.</p>
                    </div>
                    {/* ================================================= REVENUE FORM ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-plus-circle"></i> Add Revenue Record
                                </h3>
                                <p>Enter a new Chamber revenue transaction.</p>
                            </div>
                        </div>
                        <form id="revenueForm" onSubmit={handleCreate}>
                            {/* REVENUE TYPE */}
                            <div className="form-group">
                                <label htmlFor="revenueType">Revenue Type</label>{" "}
                                <select id="revenueType" name="revenueType" required>
                                    <option value="">Select revenue type</option>
                                    <option value="Membership">Membership</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Expo">Expo</option>
                                    <option value="Event">Event</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* DESCRIPTION */}
                            <div className="form-group">
                                <label htmlFor="description">Description</label>{" "}
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder="Example: Annual membership fee"
                                    required
                                />
                            </div>
                            {/* PAYER NAME */}
                            <div className="form-group">
                                <label htmlFor="payerName">Payer Name</label>{" "}
                                <input
                                    type="text"
                                    id="payerName"
                                    name="payerName"
                                    placeholder="Business or person's name"
                                    required
                                />
                            </div>
                            {/* AMOUNT */}
                            <div className="form-group">
                                <label htmlFor="amount">Amount (ETB)</label>{" "}
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            {/* PAYMENT METHOD */}
                            <div className="form-group">
                                <label htmlFor="paymentMethod">Payment Method</label>{" "}
                                <select id="paymentMethod" name="paymentMethod" required>
                                    <option value="">Select payment method</option>
                                    <option value="CBE">CBE</option>
                                    <option value="CBO">CBO</option>
                                    <option value="Sinke">Sinke</option>
                                    <option value="Awash">Awash</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* PAYMENT STATUS */}
                            <div className="form-group">
                                <label htmlFor="paymentStatus">Payment Status</label>{" "}
                                <select id="paymentStatus" name="paymentStatus">
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                            {/* PAYMENT DATE */}
                            <div className="form-group">
                                <label htmlFor="paymentDate">Payment Date</label>{" "}
                                <input type="date" id="paymentDate" name="paymentDate" />
                            </div>
                            {/* REFERENCE */}
                            <div className="form-group">
                                <label htmlFor="reference">Reference</label>{" "}
                                <input
                                    type="text"
                                    id="reference"
                                    name="reference"
                                    placeholder="Optional payment reference"
                                />
                            </div>
                            {/* NOTES */}
                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>{" "}
                                <textarea id="notes" name="notes" rows={4} placeholder="Additional information..." />
                            </div>
                            {/* SUBMIT */}
                            <button type="submit" className="admin-primary-button">
                                <i className="fas fa-save"></i> Save Revenue Record
                            </button>
                        </form>
                    </section>
                    {/* ================================================= REVENUE LIST ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-list"></i> Revenue Records
                                </h3>
                                <p>View all recorded Chamber revenue.</p>
                            </div>
                            <button
                                type="button"
                                id="refreshRevenue"
                                className="admin-secondary-button"
                                onClick={reload}
                            >
                                <i className="fas fa-arrows-rotate"></i> Refresh
                            </button>
                        </div>
                        <div id="admin-revenue-list">
                            {revenue.status === "loading" && (
                                <div className="admin-loading">
                                    <i className="fas fa-spinner fa-spin"></i> Loading revenue records...
                                </div>
                            )}
                            {revenue.status === "error" && (
                                <div className="admin-empty-state">
                                    <i className="fas fa-circle-exclamation"></i>
                                    <h3>Unable to Load Revenue</h3>
                                    <p>Please make sure the backend server is running.</p>
                                </div>
                            )}
                            {revenue.status === "ready" && !revenue.items.length && (
                                <div className="admin-empty-state">
                                    <i className="fas fa-money-bill-wave"></i>
                                    <h3>No Revenue Records</h3>
                                    <p>No revenue transactions have been recorded yet.</p>
                                </div>
                            )}
                            {revenue.status === "ready" &&
                                revenue.items.map((item) => <RevenueCard key={item.id} item={item} />)}
                        </div>
                    </section>
                </div>
            </main>
            {/* ===================================================== JAVASCRIPT ===================================================== */}
        </>
    );
}
