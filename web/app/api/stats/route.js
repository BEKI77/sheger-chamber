import { and, count, eq, isNull, ne, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { json, route } from "@/lib/server/http";

const { members, partnerships } = schema;

// Public totals for the homepage: only accepted (Active) applications count.
// Both application types live in the members table, so they are split by
// membership_type: "Partnership" applications raise the partnership total,
// everything else raises the member total. Partners added directly from the
// admin Partnerships page also count toward the partnership total.
export const GET = route(async () => {
    const isActive = eq(members.status, "Active");
    const isPartnership = eq(members.membership_type, "Partnership");
    const isMember = or(isNull(members.membership_type), ne(members.membership_type, "Partnership"));

    const [[memberTotal], [partnershipApplications], [partnerTotal]] = await Promise.all([
        db.select({ value: count() }).from(members).where(and(isActive, isMember)),
        db.select({ value: count() }).from(members).where(and(isActive, isPartnership)),
        db.select({ value: count() }).from(partnerships).where(eq(partnerships.status, "Active"))
    ]);

    return json({
        success: true,
        members: memberTotal.value,
        partnerships: partnershipApplications.value + partnerTotal.value
    });
});
