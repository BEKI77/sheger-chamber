import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { clean, fail, insertId, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { revenue } = schema;
const REVENUE_TYPES = ["Membership", "Partnership", "Expo", "Event", "Other"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

export const GET = route(async () => {
    await requireAdmin();
    const rows = await db.select().from(revenue).orderBy(descNullsLast(revenue.created_at));
    return json({ success: true, revenue: rows });
});

export const POST = route(async (request) => {
    await requireAdmin();
    const body = await readJson(request);
    if (!body.revenueType || !body.description || !body.payerName || !body.amount || !body.paymentMethod) {
        return fail(400, "Revenue type, description, payer name, amount and payment method are required.");
    }
    if (!REVENUE_TYPES.includes(body.revenueType)) return fail(400, "Invalid revenue type.");

    const result = await db
        .insert(revenue)
        .values({
            revenue_type: String(body.revenueType).trim(),
            description: String(body.description).trim(),
            payer_name: String(body.payerName).trim(),
            amount: String(body.amount),
            payment_method: String(body.paymentMethod).trim(),
            payment_status: PAYMENT_STATUSES.includes(body.paymentStatus) ? body.paymentStatus : "Pending",
            payment_date: body.paymentDate ? new Date(body.paymentDate) : null,
            reference: clean(body.reference),
            notes: clean(body.notes)
        })
        .returning({ id: revenue.id });
    return json({ success: true, message: "Revenue record created successfully.", revenue_id: insertId(result) }, 201);
});
