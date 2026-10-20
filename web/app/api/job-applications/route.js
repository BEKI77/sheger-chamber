import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { fail, insertId, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { readFormSubmission } from "@/lib/server/form-submission";

const { jobApplications, opportunities } = schema;

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

    const fullName = text("fullName");
    const email = text("email");
    const phone = text("phone");
    const education = text("education");

    if (!fullName || !email || !phone || !education) {
        return fail(400, "Full name, email, phone and education are required.");
    }

    // The job must exist and still be open; its title comes from the database
    const opportunityId = Number(text("opportunityId"));
    const [job] =
        Number.isSafeInteger(opportunityId) && opportunityId > 0
            ? await db
                  .select({ title: opportunities.title, status: opportunities.status })
                  .from(opportunities)
                  .where(eq(opportunities.id, opportunityId))
            : [];
    if (!job) return fail(404, "The selected job could not be found.");
    if (job.status !== "Open") return fail(400, "This job is no longer accepting applications.");

    if (!submission.hasFile("cv")) return fail(400, "Please upload your CV.");
    const { cv: filename } = await submission.storeFiles();

    const result = await db
        .insert(jobApplications)
        .values({
            opportunity_id: opportunityId,
            job_title: job.title,
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
