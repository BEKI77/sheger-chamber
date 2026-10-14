import { json, route } from "@/lib/server/http";
import { publicAdmin, requireAdmin } from "@/lib/server/session";

// Used by the admin pages to check that the admin is still logged in
export const GET = route(async () => {
    const admin = await requireAdmin();
    return json({ success: true, message: "Admin authentication is working.", admin: publicAdmin(admin) });
});
