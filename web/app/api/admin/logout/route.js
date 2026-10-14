import { json, route } from "@/lib/server/http";
import { destroySession } from "@/lib/server/session";

export const POST = route(async () => {
    await destroySession();
    return json({ success: true, message: "Admin logout successful." });
});
