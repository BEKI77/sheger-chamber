import { route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { storedFileResponse } from "@/lib/server/files";

export const GET = route(async (request, context) => {
    await requireAdmin();
    const { filename } = await context.params;
    return storedFileResponse("national-ids", filename, "National ID image not found.");
});
