import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { eventValues } from "@/lib/server/records";

const { events } = schema;

export const GET = route(async () => {
    const rows = await db.select().from(events).orderBy(asc(events.event_date));
    return json({ success: true, events: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const values = eventValues(await readJson(request));
    if (!values) return fail(400, "Title, event type and event date are required.");
    const result = await db.insert(events).values(values);
    return json({ success: true, message: "Event created successfully.", eventId: insertId(result) }, 201);
});
