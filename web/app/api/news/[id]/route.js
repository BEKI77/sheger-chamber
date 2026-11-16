import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { removeOldImage } from "@/lib/server/images";
import { newsValues } from "@/lib/server/records";

const { news } = schema;
const NOT_FOUND = "News article not found.";

export const GET = route(async (request, context) => {
    const id = await idParam(context);
    const [article] = id ? await db.select().from(news).where(eq(news.id, id)) : [];
    if (!article) return fail(404, NOT_FOUND);
    return json({ success: true, news: article });
});

export const PUT = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const body = await readJson(request);
    if (!body.title || !body.category || !body.content) {
        return fail(400, "Title, category and content are required.");
    }
    const values = newsValues(body);
    // The old image, to delete once the record no longer uses it
    const [old] = id ? await db.select({ url: news.image_url }).from(news).where(eq(news.id, id)) : [];
    if (!old) return fail(404, NOT_FOUND);
    const result = await db.update(news).set(values).where(eq(news.id, id));
    if (!affectedRows(result)) return fail(404, NOT_FOUND);
    await removeOldImage(old.url, values.image_url);
    return json({ success: true, message: "News article updated successfully." });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const [deleted] = id ? await db.delete(news).where(eq(news.id, id)).returning({ url: news.image_url }) : [];
    if (!deleted) return fail(404, NOT_FOUND);
    await removeOldImage(deleted.url);
    return json({ success: true, message: "News article deleted successfully." });
});
