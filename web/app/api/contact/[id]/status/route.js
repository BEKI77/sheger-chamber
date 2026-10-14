import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { contactMessages } = schema;
const STATUSES = ["New", "Read", "Replied"];

export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const { status } = await readJson(request);
    if (!STATUSES.includes(status)) return fail(400, "Invalid message status.");
    const id = await idParam(context);
    const result = id ? await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, "Contact message not found.");
    return json({ success: true, message: "Message status updated successfully." });
});
