import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { jobApplications } = schema;
const STATUSES = ["Pending", "Shortlisted", "Rejected", "Hired"];

export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const { status } = await readJson(request);
    if (!STATUSES.includes(status)) return fail(400, "Invalid application status.");
    const id = await idParam(context);
    const result = id ? await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, "Job application not found.");
    return json({ success: true, message: `Application status changed to ${status}.`, status });
});
