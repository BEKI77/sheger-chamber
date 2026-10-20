import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { opportunities } = schema;

export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const result = id ? await db.update(opportunities).set({ status: "Open" }).where(eq(opportunities.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, "Opportunity not found.");
    return json({ success: true, message: "Opportunity reopened successfully." });
});
