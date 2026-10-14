import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { contactMessages } = schema;

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const result = id ? await db.delete(contactMessages).where(eq(contactMessages.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, "Contact message not found.");
    return json({ success: true, message: "Contact message deleted successfully." });
});
