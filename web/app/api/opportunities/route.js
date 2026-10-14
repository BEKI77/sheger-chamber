import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { clean, fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { opportunities } = schema;

export const GET = route(async () => {
    const rows = await db.select().from(opportunities).orderBy(descNullsLast(opportunities.created_at));
    return json({ success: true, opportunities: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const body = await readJson(request);
    if (!body.title || !body.category || !body.description) {
        return fail(400, "Title, category and description are required.");
    }
    const result = await db
        .insert(opportunities)
        .values({
            title: String(body.title).trim(),
            category: body.category,
            organization: clean(body.organization),
            location: clean(body.location),
            description: String(body.description).trim(),
            requirements: clean(body.requirements),
            contact_email: clean(body.contactEmail),
            contact_phone: clean(body.contactPhone),
            application_deadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
            status: "Open"
        })
        .returning({ id: opportunities.id });
    return json({ success: true, message: "Opportunity created successfully.", opportunity_id: insertId(result) }, 201);
});
