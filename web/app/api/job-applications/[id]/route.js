import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { jobApplications } = schema;

export const GET = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [application] = id ? await db.select().from(jobApplications).where(eq(jobApplications.id, id)) : [];
    if (!application) return fail(404, "Job application not found.");
    return json({ success: true, application });
});
