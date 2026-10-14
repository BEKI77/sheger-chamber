"use client";

import { useAdminSession } from "@/lib/adminSession";
import { useApiList } from "@/lib/useApiList";
import { sendJson } from "@/lib/adminApi";
import MessageCard from "./MessageCard";

export default function AdminContact() {
    useAdminSession();
    const messages = useApiList("/api/contact", "messages");

    async function updateStatus(message, status) {
        try {
            await sendJson(
                `/api/contact/${message.id}/status`,
                "PATCH",
                { status },
                "Failed to update message status."
            );
            messages.reload({ showLoading: true });
        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update message status.");
        }
    }

    async function deleteMessage(message) {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await sendJson(`/api/contact/${message.id}`, "DELETE", null, "Failed to delete message.");
            messages.reload({ showLoading: true });
        } catch (error) {
            console.error("Delete message error:", error);
            alert("Failed to delete message.");
        }
    }

    return (
        <>
            {/* ===================================================== ADMIN HEADER ===================================================== */}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div className="admin-brand">
                        <div className="admin-logo">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div>
                            <h1>Shagar Chamber</h1>
                            <span>Contact Management</span>
                        </div>
                    </div>
                    <a href="/" className="admin-back-link">
                        <i className="fas fa-arrow-left"></i> Back to Website
                    </a>
                </div>
            </header>
            {/* ===================================================== MAIN ===================================================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* PAGE HEADING */}
                    <div className="admin-page-heading">
                        <span className="admin-section-label">
                            <i className="fas fa-envelope"></i> Communication Management
                        </span>
                        <h2>Contact Message Management</h2>
                        <p>View and manage messages submitted through the Shagar Chamber website.</p>
                    </div>
                    {/* ================================================= CONTACT MESSAGES ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-inbox"></i> Contact Messages
                                </h3>
                                <p>Review messages submitted by website visitors.</p>
                            </div>
                            <button
                                type="button"
                                id="refreshMessages"
                                className="admin-secondary-button"
                                onClick={() => messages.reload({ showLoading: true })}
                            >
                                <i className="fas fa-arrows-rotate"></i> Refresh
                            </button>
                        </div>
                        {/* MESSAGES LIST */}
                        <div id="admin-contact-messages-list">
                            {messages.status === "loading" && <p>Loading messages...</p>}
                            {messages.status === "error" && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <h3>Unable to Load Messages</h3>
                                    <p>Please make sure the backend server is running.</p>
                                </div>
                            )}
                            {messages.status === "ready" && !messages.items.length && (
                                <div className="admin-empty-state">
                                    <i className="fa-solid fa-envelope-open"></i>
                                    <h3>No Contact Messages</h3>
                                    <p>There are currently no messages from website visitors.</p>
                                </div>
                            )}
                            {messages.status === "ready" &&
                                messages.items.map((message) => (
                                    <MessageCard
                                        key={message.id}
                                        message={message}
                                        onStatus={updateStatus}
                                        onDelete={deleteMessage}
                                    />
                                ))}
                        </div>
                    </section>
                </div>
            </main>
            {/* ===================================================== JAVASCRIPT ===================================================== */}
        </>
    );
}
