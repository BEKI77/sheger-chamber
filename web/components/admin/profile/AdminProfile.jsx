"use client";

import { useEffect, useState } from "react";
import { rememberAdmin, useAdminSession } from "@/lib/adminSession";
import { sendJson } from "@/lib/adminApi";

export default function AdminProfile() {
    const admin = useAdminSession();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    // Which profile form is saving: "username", "email" or ""
    const [savingField, setSavingField] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    // Fill in the current details once the login check returns them
    useEffect(() => {
        if (admin?.username) setUsername(admin.username);
    }, [admin?.username]);
    useEffect(() => {
        if (admin?.email) setEmail(admin.email);
    }, [admin?.email]);

    // Save one profile field (username or email); both need the current password
    async function saveProfileField(event, field, value) {
        event.preventDefault();
        const form = event.currentTarget;
        setSavingField(field);
        try {
            const result = await sendJson(
                "/api/admin/profile",
                "PATCH",
                { [field]: value.trim(), currentPassword: form.currentPassword.value },
                `Unable to update ${field}.`
            );
            rememberAdmin(result.admin);
            setUsername(result.admin.username || "");
            setEmail(result.admin.email || "");
            form.currentPassword.value = "";
            alert(result.message);
        } catch (error) {
            console.error("Profile update error:", error);
            alert(error.message);
        } finally {
            setSavingField("");
        }
    }

    async function handlePassword(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const newPassword = form.newPassword.value;
        if (newPassword !== form.confirmPassword.value) {
            alert("The new passwords do not match.");
            return;
        }
        setSavingPassword(true);
        try {
            const result = await sendJson(
                "/api/admin/password",
                "PATCH",
                { currentPassword: form.currentPassword.value, newPassword },
                "Unable to change password."
            );
            form.reset();
            alert(result.message + " Other devices have been signed out.");
        } catch (error) {
            console.error("Password change error:", error);
            alert(error.message);
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <>
            {/* ===================================================== MAIN ===================================================== */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* PAGE HEADING */}
                    <div className="admin-page-heading">
                        <span className="admin-section-label">
                            <i className="fas fa-user-shield"></i> Account Settings
                        </span>
                        <h2>My Profile</h2>
                        <p>{admin?.fullName || "Administrator"}</p>
                    </div>
                    {/* ================================================= USERNAME ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-user"></i> Change Username
                                </h3>
                                <p>You can log in with your username or your email address.</p>
                            </div>
                        </div>
                        <form id="usernameForm" onSubmit={(event) => saveProfileField(event, "username", username)}>
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label htmlFor="username">
                                        Username <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="text"
                                        id="username"
                                        autoComplete="username"
                                        required
                                        minLength={3}
                                        maxLength={50}
                                        pattern="[A-Za-z0-9._\-]+"
                                        title="Letters, numbers, dots, dashes or underscores"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />{" "}
                                    <small>3-50 characters: letters, numbers, dots, dashes or underscores.</small>
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="usernamePassword">
                                        Current Password <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="password"
                                        id="usernamePassword"
                                        name="currentPassword"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={Boolean(savingField)}>
                                    <i
                                        className={savingField === "username" ? "fas fa-spinner fa-spin" : "fas fa-save"}
                                    ></i>{" "}
                                    {savingField === "username" ? "Saving..." : "Save Username"}
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ================================================= EMAIL ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-envelope"></i> Change Email Address
                                </h3>
                                <p>Your email address can also be used to log in.</p>
                            </div>
                        </div>
                        <form id="emailForm" onSubmit={(event) => saveProfileField(event, "email", email)}>
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label htmlFor="email">
                                        Email Address <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="email"
                                        id="email"
                                        autoComplete="email"
                                        required
                                        maxLength={150}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="emailPassword">
                                        Current Password <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="password"
                                        id="emailPassword"
                                        name="currentPassword"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={Boolean(savingField)}>
                                    <i
                                        className={savingField === "email" ? "fas fa-spinner fa-spin" : "fas fa-save"}
                                    ></i>{" "}
                                    {savingField === "email" ? "Saving..." : "Save Email"}
                                </button>
                            </div>
                        </form>
                    </section>
                    {/* ================================================= PASSWORD ================================================= */}
                    <section className="admin-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h3>
                                    <i className="fas fa-key"></i> Change Password
                                </h3>
                                <p>Changing your password signs you out on every other device.</p>
                            </div>
                        </div>
                        <form id="passwordForm" onSubmit={handlePassword}>
                            <div className="admin-form-grid">
                                <div className="admin-form-group admin-form-full">
                                    <label htmlFor="currentPassword">
                                        Current Password <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="newPassword">
                                        New Password <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        autoComplete="new-password"
                                        required
                                        minLength={12}
                                    />{" "}
                                    <small>At least 12 characters.</small>
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="confirmPassword">
                                        Confirm New Password <span>*</span>
                                    </label>{" "}
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        required
                                        minLength={12}
                                    />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-primary-button" disabled={savingPassword}>
                                    <i className={savingPassword ? "fas fa-spinner fa-spin" : "fas fa-key"}></i>{" "}
                                    {savingPassword ? "Saving..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
