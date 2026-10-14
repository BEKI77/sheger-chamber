import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { deleteStoredFile } from "@/lib/server/files";

const { members } = schema;

export const DELETE = route(async (request, context) => {
    await requireAdmin();
    const id = await idParam(context);
    if (!id) return fail(400, "Invalid membership application ID.");

    const [member] = await db.select().from(members).where(eq(members.id, id));
    if (!member) return fail(404, "Membership application not found.");

    const result = await db.delete(members).where(eq(members.id, id));
    if (!affectedRows(result)) return fail(404, "Membership application not found.");

    // Remove the uploaded photos; the record is already gone either way
    const cleanup = await Promise.allSettled([
        deleteStoredFile("national-ids", member.national_id_front),
        deleteStoredFile("national-ids", member.national_id_back),
        deleteStoredFile("payment-receipts", member.payment_receipt)
    ]);
    const cleanupFailed = cleanup.some((item) => item.status === "rejected");
    if (cleanupFailed) {
        console.error(
            "Member deleted, but stored files may need cleanup:",
            id,
            cleanup.filter((item) => item.status === "rejected").map((item) => item.reason)
        );
    }

    return json({
        success: true,
        message: cleanupFailed
            ? "Membership application deleted. Some stored files may need cleanup."
            : "Membership application deleted successfully."
    });
});
