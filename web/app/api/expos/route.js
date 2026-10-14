import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { expoValues } from "@/lib/server/records";

const { expos } = schema;

export const GET = route(async () => {
    const rows = await db.select().from(expos).orderBy(asc(expos.start_date), desc(expos.id));
    return json({ success: true, expos: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const values = expoValues(await readJson(request));
    if (!values) return fail(400, "Title, type and description are required");
    const result = await db.insert(expos).values(values);
    return json({ success: true, message: "Expo created successfully", expoId: insertId(result) }, 201);
});
