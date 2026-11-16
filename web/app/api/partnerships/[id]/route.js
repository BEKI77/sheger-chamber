import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { removeOldImage } from "@/lib/server/images";
import { partnershipValues } from "@/lib/server/records";

const { partnerships } = schema;
const NOT_FOUND = "Partnership not found";

export const GET = route(async (request, context) => {
    const id = await idParam(context);
    const [partnership] = id ? await db.select().from(partnerships).where(eq(partnerships.id, id)) : [];
    if (!partnership) return fail(404, NOT_FOUND);
    return json({ success: true, partnership });
});

export const PUT = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const values = partnershipValues(await readJson(request));
    if (!values) return fail(400, "Partner name and partner type are required");
    // The old image, to delete once the record no longer uses it
    const [old] = id ? await db.select({ url: partnerships.logo_url }).from(partnerships).where(eq(partnerships.id, id)) : [];
    if (!old) return fail(404, NOT_FOUND);
    const result = await db.update(partnerships).set(values).where(eq(partnerships.id, id));
    if (!affectedRows(result)) return fail(404, NOT_FOUND);
    await removeOldImage(old.url, values.logo_url);
    return json({ success: true, message: "Partnership updated successfully." });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [deleted] = id ? await db.delete(partnerships).where(eq(partnerships.id, id)).returning({ url: partnerships.logo_url }) : [];
    if (!deleted) return fail(404, NOT_FOUND);
    await removeOldImage(deleted.url);
    return json({ success: true, message: "Partnership deleted successfully." });
});
