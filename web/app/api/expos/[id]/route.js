import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { removeOldImage } from "@/lib/server/images";
import { expoValues } from "@/lib/server/records";

const { expos } = schema;
const NOT_FOUND = "Expo not found";

export const GET = route(async (request, context) => {
    const id = await idParam(context);
    const [expo] = id ? await db.select().from(expos).where(eq(expos.id, id)) : [];
    if (!expo) return fail(404, NOT_FOUND);
    return json({ success: true, expo });
});

export const PUT = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const values = expoValues(await readJson(request));
    if (!values) return fail(400, "Title, type and description are required");
    // The old image, to delete once the record no longer uses it
    const [old] = id ? await db.select({ url: expos.image_url }).from(expos).where(eq(expos.id, id)) : [];
    if (!old) return fail(404, NOT_FOUND);
    const result = await db.update(expos).set(values).where(eq(expos.id, id));
    if (!affectedRows(result)) return fail(404, NOT_FOUND);
    await removeOldImage(old.url, values.image_url);
    return json({ success: true, message: "Expo updated successfully" });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [deleted] = id ? await db.delete(expos).where(eq(expos.id, id)).returning({ url: expos.image_url }) : [];
    if (!deleted) return fail(404, NOT_FOUND);
    await removeOldImage(deleted.url);
    return json({ success: true, message: "Expo deleted successfully" });
});
