import { count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { json, route } from "@/lib/server/http";

const { members, partnerships } = schema;

// Public totals for the homepage: only accepted (Active) members and partnerships count
export const GET = route(async () => {
    const [[memberTotal], [partnershipTotal]] = await Promise.all([
        db.select({ value: count() }).from(members).where(eq(members.status, "Active")),
        db.select({ value: count() }).from(partnerships).where(eq(partnerships.status, "Active"))
    ]);
    return json({ success: true, members: memberTotal.value, partnerships: partnershipTotal.value });
});
