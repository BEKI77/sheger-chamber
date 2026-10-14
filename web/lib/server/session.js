// Admin login sessions, stored in the admin_sessions table.
// The browser keeps a random token in an httpOnly cookie; the database keeps
// only its SHA-256 hash, so a leaked database cannot be used to log in.
import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { HttpError } from "./http";

const COOKIE_NAME = "shagar_session";
const SESSION_HOURS = 2;
const MAX_FAILED_LOGINS = 10;
const LOGIN_WINDOW_MINUTES = 15;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export function publicAdmin(admin) {
    return {
        id: admin.id,
        fullName: admin.full_name,
        username: admin.username,
        email: admin.email,
        role: admin.role
    };
}

export async function createSession(adminId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

    // Remove expired sessions now and then
    await db.delete(schema.adminSessions).where(lt(schema.adminSessions.expires_at, new Date()));
    await db.insert(schema.adminSessions).values({
        token_hash: hashToken(token),
        admin_id: adminId,
        expires_at: expiresAt
    });

    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt
    });
}

// The logged-in admin, or null
export async function getSessionAdmin() {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;

    const rows = await db
        .select({ admin: schema.adminUsers })
        .from(schema.adminSessions)
        .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.adminSessions.admin_id))
        .where(
            and(eq(schema.adminSessions.token_hash, hashToken(token)), gt(schema.adminSessions.expires_at, new Date()))
        )
        .limit(1);

    const admin = rows[0]?.admin;
    return admin && admin.status === "Active" ? admin : null;
}

// Use in admin-only handlers: returns the admin or answers 401
export async function requireAdmin() {
    const admin = await getSessionAdmin();
    if (!admin) throw new HttpError(401, "Admin authentication required.");
    return admin;
}

export async function destroySession() {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (token) {
        await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token_hash, hashToken(token)));
    }
    store.delete(COOKIE_NAME);
}

/* ----- Failed login limit (per IP address) ----- */

export async function clientIp() {
    const h = await headers();
    return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim().slice(0, 64);
}

const windowStart = () => new Date(Date.now() - LOGIN_WINDOW_MINUTES * 60 * 1000);

export async function loginBlocked(ip) {
    const rows = await db.select().from(schema.loginAttempts).where(eq(schema.loginAttempts.ip, ip)).limit(1);
    const entry = rows[0];
    if (!entry) return false;
    if (entry.first_at < windowStart()) {
        await clearFailedLogins(ip);
        return false;
    }
    return entry.count >= MAX_FAILED_LOGINS;
}

export async function recordFailedLogin(ip) {
    // Start a new window when the old one has expired, otherwise count up
    await db
        .insert(schema.loginAttempts)
        .values({ ip, count: 1, first_at: new Date() })
        .onDuplicateKeyUpdate({
            set: {
                count: sql`IF(${schema.loginAttempts.first_at} < ${windowStart()}, 1, ${schema.loginAttempts.count} + 1)`,
                first_at: sql`IF(${schema.loginAttempts.first_at} < ${windowStart()}, ${new Date()}, ${schema.loginAttempts.first_at})`
            }
        });
}

export async function clearFailedLogins(ip) {
    await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.ip, ip));
}
