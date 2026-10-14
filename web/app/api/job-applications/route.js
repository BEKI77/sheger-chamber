import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, insertId, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { CV_TYPES, checkUpload, saveUpload } from "@/lib/server/files";

const { jobApplications } = schema;

export const GET = route(async () => {
    await requireAdmin();
    const rows = await db.select().from(jobApplications).orderBy(desc(jobApplications.created_at));
    return json({ success: true, applications: rows });
});

// Public: the job application form (multipart, with the CV file)
export const POST = route(async (request) => {
    const form = await request.formData();
    const text = (name) => {
        const value = form.get(name);
        return typeof value === "string" ? value.trim() : "";
    };

    const jobTitle = text("jobTitle");
    const fullName = text("fullName");
    const email = text("email");
    const phone = text("phone");
    const education = text("education");

    if (!jobTitle || !fullName || !email || !phone || !education) {
        return fail(400, "Job title, full name, email, phone and education are required.");
    }

    const cv = checkUpload(form.get("cv"), CV_TYPES, "Only PDF, DOC and DOCX CV files are allowed.");
    if (!cv) return fail(400, "Please upload your CV.");
    const filename = await saveUpload(cv, "job-applications");

    const opportunityId = Number(text("opportunityId"));
    const result = await db.insert(jobApplications).values({
        opportunity_id: Number.isSafeInteger(opportunityId) && opportunityId > 0 ? opportunityId : null,
        job_title: jobTitle,
        full_name: fullName,
        email,
        phone,
        education,
        experience: text("experience") || null,
        cover_letter: text("coverLetter") || null,
        cv_path: "/job-application-cv/" + filename,
        status: "Pending"
    });

    return json(
        { success: true, message: "Job application submitted successfully.", applicationId: insertId(result) },
        201
    );
});
