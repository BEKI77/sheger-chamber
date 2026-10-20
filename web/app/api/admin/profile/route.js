import { and, eq, ne, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, json, readJson, route } from "@/lib/server/http";
import { publicAdmin, requireAdmin, requireCurrentPassword } from "@/lib/server/session";

const { adminUsers } = schema;
const USERNAME = /^[A-Za-z0-9._-]{3,50}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login accepts a username or an email, case-insensitively, so a new value
// may not match another admin's username or email
async function inUse(adminId, value) {
    const [taken] = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(
            and(
                ne(adminUsers.id, adminId),
                or(
                    sql`lower(${adminUsers.username}) = lower(${value})`,
                    sql`lower(${adminUsers.email}) = lower(${value})`
                )
            )
        )
        .limit(1);
    return Boolean(taken);
}

// Change the logged-in admin's username and/or email
export const PATCH = route(async (request) => {
    const admin = await requireAdmin();
    const body = await readJson(request);
    const changes = {};

    if (body?.username !== undefined) {
        const username = String(body.username).trim();
        if (!USERNAME.test(username)) {
            return fail(400, "Username must be 3-50 characters: letters, numbers, dots, dashes or underscores.");
        }
        changes.username = username;
    }
    if (body?.email !== undefined) {
        const email = String(body.email).trim();
        if (email.length > 150 || !EMAIL.test(email)) return fail(400, "Please enter a valid email address.");
        changes.email = email;
    }
    if (!Object.keys(changes).length) return fail(400, "Nothing to update.");

    await requireCurrentPassword(admin, body?.currentPassword);

    if (changes.username && (await inUse(admin.id, changes.username))) {
        return fail(409, "That username is already in use.");
    }
    if (changes.email && (await inUse(admin.id, changes.email))) {
        return fail(409, "That email address is already in use.");
    }

    const [updated] = await db.update(adminUsers).set(changes).where(eq(adminUsers.id, admin.id)).returning();
    const what = changes.username && changes.email ? "Profile" : changes.email ? "Email address" : "Username";
    return json({ success: true, message: `${what} updated successfully.`, admin: publicAdmin(updated) });
});
