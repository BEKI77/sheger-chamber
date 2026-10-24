import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { deleteStoredFile } from "@/lib/server/files";
import { fileName } from "@/lib/adminApi";

const { jobApplications } = schema;

export const GET = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [application] = id ? await db.select().from(jobApplications).where(eq(jobApplications.id, id)) : [];
    if (!application) return fail(404, "Job application not found.");
    return json({ success: true, application });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    if (!id) return fail(400, "Invalid job application ID.");

    const [application] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    if (!application) return fail(404, "Job application not found.");

    const result = await db.delete(jobApplications).where(eq(jobApplications.id, id));
    if (!affectedRows(result)) return fail(404, "Job application not found.");

    // Remove the uploaded CV; the record is already gone either way
    try {
        await deleteStoredFile("job-applications", fileName(application.cv_path));
    } catch (error) {
        console.error("Job application deleted, but the CV may need cleanup:", id, error);
        return json({ success: true, message: "Job application deleted. The CV file may need cleanup." });
    }

    return json({ success: true, message: "Job application deleted successfully." });
});
