"use client";

import { useEffect, useState } from "react";

export default function JobApplication() {
    const [opportunityId, setOpportunityId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // The job comes from the address, e.g. /job-application?id=3
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) {
            setJobTitle("No job selected");
            alert("No job was selected. Please return to the Jobs section and click Apply Now.");
            return;
        }
        setOpportunityId(id);

        fetch(`/api/opportunities/${encodeURIComponent(id)}`)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to load job information.");
                }
                setJobTitle(data.opportunity.title);
            })
            .catch((error) => {
                console.error("Job loading error:", error);
                setJobTitle("Unable to load position");
                alert("Unable to load the selected job.");
            });
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.append("jobTitle", jobTitle);

        setSubmitting(true);
        try {
            const response = await fetch("/api/job-applications", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to submit application.");
            }
            alert("Your job application has been submitted successfully.");
            form.reset();
            if (data.jobTitle) setJobTitle(data.jobTitle);
        } catch (error) {
            console.error("Application submission error:", error);
            alert(error.message || "Unable to submit your application.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* ===================================================== APPLICATION HEADER ===================================================== */}
            <header className="site-header">
                <div className="container">
                    <div className="logo">
                        <h1>Shagar Chamber</h1>
                        <span>Commerce & Sectoral Association</span>
                    </div>
                    <a href="/#jobs" className="membership-button">
                        <i className="fas fa-arrow-left"></i> Back to Jobs
                    </a>
                </div>
            </header>
            {/* ===================================================== APPLICATION PAGE ===================================================== */}
            <main>
                <section className="membership-section">
                    <div className="container">
                        <div className="section-heading">
                            <span className="section-label">
                                <i className="fas fa-briefcase"></i> JOB APPLICATION
                            </span>
                            <h2>Apply for a Position</h2>
                            <p>Complete the application form below and submit your CV for consideration.</p>
                        </div>
                        {/* JOB INFORMATION */}
                        <div id="job-information" className="membership-form">
                            <div className="form-group">
                                <label>Position Applying For</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-briefcase"></i>{" "}
                                    <input
                                        type="text"
                                        id="jobTitle"
                                        name="jobTitle"
                                        readOnly
                                        placeholder="Loading position..."
                                        value={jobTitle}
                                    />
                                </div>
                            </div>
                            {/* ================================================= APPLICATION FORM ================================================= */}
                            <form id="jobApplicationForm" encType="multipart/form-data" onSubmit={handleSubmit}>
                                <input type="hidden" id="opportunityId" name="opportunityId" value={opportunityId} />
                                {/* FULL NAME */}
                                <div className="form-group">
                                    <label htmlFor="fullName">
                                        Full Name <span>*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-user"></i>{" "}
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                                {/* EMAIL */}
                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email Address <span>*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-envelope"></i>{" "}
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>
                                {/* PHONE */}
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        Phone Number <span>*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-phone"></i>{" "}
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                                {/* EDUCATION */}
                                <div className="form-group">
                                    <label htmlFor="education">
                                        Education <span>*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-graduation-cap"></i>{" "}
                                        <input
                                            type="text"
                                            id="education"
                                            name="education"
                                            required
                                            placeholder="Example: Bachelor's Degree in Business Administration"
                                        />
                                    </div>
                                </div>
                                {/* EXPERIENCE */}
                                <div className="form-group">
                                    <label htmlFor="experience">Work Experience</label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-user-tie"></i>
                                        <textarea
                                            id="experience"
                                            name="experience"
                                            rows={5}
                                            placeholder="Describe your relevant work experience"
                                        />
                                    </div>
                                </div>
                                {/* COVER LETTER */}
                                <div className="form-group">
                                    <label htmlFor="coverLetter">Cover Letter</label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-file-lines"></i>
                                        <textarea
                                            id="coverLetter"
                                            name="coverLetter"
                                            rows={7}
                                            placeholder="Write your cover letter"
                                        />
                                    </div>
                                </div>
                                {/* CV */}
                                <div className="form-group">
                                    <label htmlFor="cv">
                                        Upload CV <span>*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-file-pdf"></i>{" "}
                                        <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx" required />
                                    </div>
                                    <small>Accepted formats: PDF, DOC, DOCX. Maximum size: 5 MB.</small>
                                </div>
                                {/* SUBMIT */}
                                <div className="form-actions">
                                    <button type="submit" className="membership-button" disabled={submitting}>
                                        <i className={submitting ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>{" "}
                                        {submitting ? "Submitting..." : "Submit Application"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
