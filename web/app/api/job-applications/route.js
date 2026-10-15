import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { fail, insertId, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { readFormSubmission } from "@/lib/server/form-submission";

const { jobApplications } = schema;

export const GET = route(async () => {
    await requireAdmin();
    const rows = await db.select().from(jobApplications).orderBy(descNullsLast(jobApplications.created_at));
    return json({ success: true, applications: rows });
});

// Public: the job application form, with the CV
// (uploaded straight to Storage first, or included in the request)
export const POST = route(async (request) => {
    const submission = await readFormSubmission(request, "job-application");
    const text = submission.text;

    const jobTitle = text("jobTitle");
    const fullName = text("fullName");
    const email = text("email");
    const phone = text("phone");
    const education = text("education");

    if (!jobTitle || !fullName || !email || !phone || !education) {
        return fail(400, "Job title, full name, email, phone and education are required.");
    }
    if (!submission.hasFile("cv")) return fail(400, "Please upload your CV.");
    const { cv: filename } = await submission.storeFiles();

    const opportunityId = Number(text("opportunityId"));
    const result = await db
        .insert(jobApplications)
        .values({
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
        })
        .returning({ id: jobApplications.id });

    return json(
        { success: true, message: "Job application submitted successfully.", applicationId: insertId(result) },
        201
    );
});
