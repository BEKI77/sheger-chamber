import { getTableColumns } from "drizzle-orm";
import { db, schema } from "@/db";
import { descNullsLast } from "@/lib/server/order";
import { json, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";

const { members } = schema;
// Every column except the unused national_id
const { national_id, ...listColumns } = getTableColumns(members);

export const GET = route(async () => {
    await requireAdmin();
    const rows = await db.select(listColumns).from(members).orderBy(descNullsLast(members.created_at));
    return json({ success: true, members: rows });
});
