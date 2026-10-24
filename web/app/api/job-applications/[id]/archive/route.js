import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { jobApplications } = schema;

// { archived: true } archives the application, { archived: false } restores it
export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const { archived } = await readJson(request);
    if (typeof archived !== "boolean") return fail(400, "Invalid archive request.");
    const id = await idParam(context);
    const result = id
        ? await db
              .update(jobApplications)
              .set({ archived_at: archived ? new Date() : null })
              .where(eq(jobApplications.id, id))
        : null;
    if (!result || !affectedRows(result)) return fail(404, "Job application not found.");
    return json({
        success: true,
        message: archived ? "Application archived." : "Application restored.",
        archived
    });
});
