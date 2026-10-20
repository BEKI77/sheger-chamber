// Admin login sessions, stored in the admin_sessions table.
// The browser keeps a random token in an httpOnly cookie; the database keeps
// only its SHA-256 hash, so a leaked database cannot be used to log in.
import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { and, eq, gt, lt, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { HttpError } from "./http";

const COOKIE_NAME = "shaggar_session";
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

// Sign the admin out everywhere except this browser (after a password change)
export async function endOtherSessions(adminId) {
    const token = (await cookies()).get(COOKIE_NAME)?.value || "";
    await db
        .delete(schema.adminSessions)
        .where(and(eq(schema.adminSessions.admin_id, adminId), ne(schema.adminSessions.token_hash, hashToken(token))));
}

// Check the logged-in admin's current password before changing their account.
// Wrong guesses count toward the same per-IP limit as the login form.
export async function requireCurrentPassword(admin, password) {
    if (typeof password !== "string" || !password) throw new HttpError(400, "Please enter your current password.");
    const ip = await clientIp();
    if (await loginBlocked(ip)) {
        throw new HttpError(429, "Too many failed attempts. Please try again in 15 minutes.");
    }
    if (!(await bcrypt.compare(password, admin.password_hash))) {
        await recordFailedLogin(ip);
        throw new HttpError(400, "Your current password is incorrect.");
    }
    await clearFailedLogins(ip);
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

// The visitor's address, from the one header the host sets itself and a
// visitor can't fake. Each host differs, so it's chosen by host:
//  - Render (sets RENDER): Cloudflare's cf-connecting-ip, overwritten on every request
//  - Vercel (sets VERCEL): x-vercel-forwarded-for
//  - elsewhere: the last x-forwarded-for entry, the one the nearest proxy added
// CLIENT_IP_HEADER overrides the choice for other hosts.
function clientIpHeader() {
    if (process.env.CLIENT_IP_HEADER) return process.env.CLIENT_IP_HEADER.toLowerCase();
    if (process.env.RENDER) return "cf-connecting-ip";
    if (process.env.VERCEL) return "x-vercel-forwarded-for";
    return null;
}

export async function clientIp() {
    const h = await headers();
    const name = clientIpHeader();
    const value = name ? h.get(name) : h.get("x-forwarded-for")?.split(",").pop();
    return (value?.trim() || "unknown").slice(0, 64);
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
    const { loginAttempts } = schema;
    const expired = sql`${loginAttempts.first_at} < ${windowStart().toISOString()}::timestamptz`;
    await db
        .insert(loginAttempts)
        .values({ ip, count: 1, first_at: new Date() })
        .onConflictDoUpdate({
            target: loginAttempts.ip,
            set: {
                count: sql`CASE WHEN ${expired} THEN 1 ELSE ${loginAttempts.count} + 1 END`,
                first_at: sql`CASE WHEN ${expired} THEN now() ELSE ${loginAttempts.first_at} END`
            }
        });
}

export async function clearFailedLogins(ip) {
    await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.ip, ip));
}
