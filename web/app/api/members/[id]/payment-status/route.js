import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { affectedRows, fail, idParam, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { members } = schema;
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

export const PATCH = route(async (request, context) => {
    await requireAdmin();
    const { paymentStatus } = await readJson(request);
    if (!PAYMENT_STATUSES.includes(paymentStatus)) return fail(400, "Invalid payment status.");
    const id = await idParam(context);
    const result = id
        ? await db.update(members).set({ payment_status: paymentStatus }).where(eq(members.id, id))
        : null;
    if (!result || !affectedRows(result)) return fail(404, "Membership application not found.");
    return json({
        success: true,
        message: `Payment status changed to ${paymentStatus}.`,
        payment_status: paymentStatus
    });
});
