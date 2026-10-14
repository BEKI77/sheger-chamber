import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { contactMessages } = schema;

// Public: the website contact form
export const POST = route(async (request) => {
    const body = await readJson(request);
    if (!body.fullName || !body.email || !body.message) {
        return fail(400, "Full name, email and message are required.");
    }
    const result = await db.insert(contactMessages).values({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || null,
        message: body.message
    });
    return json(
        { success: true, message: "Your message has been sent successfully.", messageId: insertId(result) },
        201
    );
});

export const GET = route(async () => {
    await requireAdmin();
    const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.created_at));
    return json({ success: true, messages: rows });
});
