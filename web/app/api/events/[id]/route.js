import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { removeOldImage } from "@/lib/server/images";
import { eventValues } from "@/lib/server/records";

const { events } = schema;
const NOT_FOUND = "Event not found.";

export const GET = route(async (request, context) => {
    const id = await idParam(context);
    const [event] = id ? await db.select().from(events).where(eq(events.id, id)) : [];
    if (!event) return fail(404, NOT_FOUND);
    return json({ success: true, event });
});

export const PUT = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const values = eventValues(await readJson(request));
    if (!values) return fail(400, "Title, event type and event date are required.");
    // The old image, to delete once the record no longer uses it
    const [old] = id ? await db.select({ url: events.image_url }).from(events).where(eq(events.id, id)) : [];
    if (!old) return fail(404, NOT_FOUND);
    const result = await db.update(events).set(values).where(eq(events.id, id));
    if (!affectedRows(result)) return fail(404, NOT_FOUND);
    await removeOldImage(old.url, values.image_url);
    return json({ success: true, message: "Event updated successfully." });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [deleted] = id ? await db.delete(events).where(eq(events.id, id)).returning({ url: events.image_url }) : [];
    if (!deleted) return fail(404, NOT_FOUND);
    await removeOldImage(deleted.url);
    return json({ success: true, message: "Event deleted successfully." });
});
