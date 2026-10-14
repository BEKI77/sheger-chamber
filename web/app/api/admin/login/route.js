import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, json, readJson, route } from "@/lib/server/http";
import {
    clearFailedLogins,
    clientIp,
    createSession,
    loginBlocked,
    publicAdmin,
    recordFailedLogin
} from "@/lib/server/session";

const { adminUsers } = schema;

export const POST = route(async (request) => {
    const body = await readJson(request);
    const identifier = String(body?.username || body?.email || "").trim();
    const password = body?.password;

    if (!identifier || typeof password !== "string" || !password) {
        return fail(400, "Username and password are required.");
    }

    const ip = await clientIp();
    if (await loginBlocked(ip)) {
        return fail(429, "Too many failed login attempts. Please try again in 15 minutes.");
    }

    const [admin] = await db
        .select()
        .from(adminUsers)
        .where(or(eq(adminUsers.username, identifier), eq(adminUsers.email, identifier)))
        .limit(1);

    if (!admin) {
        await recordFailedLogin(ip);
        return fail(401, "Invalid username or password.");
    }
    if (admin.status !== "Active") {
        return fail(403, "This admin account is inactive.");
    }
    if (!(await bcrypt.compare(password, admin.password_hash))) {
        await recordFailedLogin(ip);
        return fail(401, "Invalid username or password.");
    }

    await clearFailedLogins(ip);
    await createSession(admin.id);

    return json({ success: true, message: "Admin login successful.", admin: publicAdmin(admin) });
});
