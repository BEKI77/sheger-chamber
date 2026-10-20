import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { fail, json, readJson, route } from "@/lib/server/http";
import { endOtherSessions, requireAdmin, requireCurrentPassword } from "@/lib/server/session";

const { adminUsers } = schema;
// Same minimum as `npm run create-admin`
const MIN_LENGTH = 12;

// Change the logged-in admin's password; other devices are signed out
export const PATCH = route(async (request) => {
    const admin = await requireAdmin();
    const body = await readJson(request);
    const newPassword = body?.newPassword;

    if (typeof newPassword !== "string" || newPassword.length < MIN_LENGTH) {
        return fail(400, `The new password must be at least ${MIN_LENGTH} characters.`);
    }
    // bcrypt only uses the first 72 bytes
    if (Buffer.byteLength(newPassword) > 72) return fail(400, "The new password is too long.");
    await requireCurrentPassword(admin, body?.currentPassword);
    if (await bcrypt.compare(newPassword, admin.password_hash)) {
        return fail(400, "The new password must be different from the current one.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.update(adminUsers).set({ password_hash: passwordHash }).where(eq(adminUsers.id, admin.id));
    await endOtherSessions(admin.id);
    return json({ success: true, message: "Password changed successfully." });
});
