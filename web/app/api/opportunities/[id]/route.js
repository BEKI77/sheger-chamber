import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { opportunities } = schema;
const NOT_FOUND = "Opportunity not found.";

export const GET = route(async (request, context) => {
    const id = await idParam(context);
    const [opportunity] = id ? await db.select().from(opportunities).where(eq(opportunities.id, id)) : [];
    if (!opportunity) return fail(404, NOT_FOUND);
    return json({ success: true, opportunity });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const result = id ? await db.delete(opportunities).where(eq(opportunities.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, NOT_FOUND);
    return json({ success: true, message: "Opportunity deleted successfully." });
});
