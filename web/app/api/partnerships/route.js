import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { partnershipValues } from "@/lib/server/records";

const { partnerships } = schema;

export const GET = route(async () => {
    const rows = await db.select().from(partnerships).orderBy(descNullsLast(partnerships.created_at));
    return json({ success: true, partnerships: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const values = partnershipValues(await readJson(request));
    if (!values) return fail(400, "Partner name and partner type are required");
    const result = await db.insert(partnerships).values(values).returning({ id: partnerships.id });
    return json({ success: true, message: "Partnership created successfully.", partnershipId: insertId(result) }, 201);
});
