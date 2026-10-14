import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
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
    const result = id ? await db.update(news).set(newsValues(body)).where(eq(news.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, NOT_FOUND);
    return json({ success: true, message: "News article updated successfully." });
});

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    const result = id ? await db.delete(news).where(eq(news.id, id)) : null;
    if (!result || !affectedRows(result)) return fail(404, NOT_FOUND);
    return json({ success: true, message: "News article deleted successfully." });
});
