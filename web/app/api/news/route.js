import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { newsValues } from "@/lib/server/records";

const { news } = schema;

export const GET = route(async () => {
    const rows = await db.select().from(news).orderBy(desc(news.published_at));
    return json({ success: true, news: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const body = await readJson(request);
    if (!body.title || !body.category || !body.content) {
        return fail(400, "Title, category and content are required.");
    }
    const result = await db.insert(news).values(newsValues(body));
    return json({ success: true, message: "News article created successfully.", news_id: insertId(result) }, 201);
});
