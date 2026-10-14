import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { members } = schema;
const STATUSES = ["Pending", "Active", "Rejected"];

export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const { status } = await readJson(request);
    if (!STATUSES.includes(status)) return fail(400, "Invalid membership status.");
    const id = await idParam(context);
    if (!id) return fail(404, "Membership application not found.");

    // A membership can only be approved once its payment is verified
    if (status === "Active") {
        const [member] = await db
            .select({ payment_status: members.payment_status })
            .from(members)
            .where(eq(members.id, id));
        if (!member) return fail(404, "Membership application not found.");
        if (member.payment_status !== "Paid") {
            return fail(400, "This membership cannot be approved until the payment has been verified.");
        }
    }

    const result = await db.update(members).set({ status }).where(eq(members.id, id));
    if (!affectedRows(result)) return fail(404, "Membership application not found.");
    return json({ success: true, message: `Membership application ${status.toLowerCase()} successfully.`, status });
});
