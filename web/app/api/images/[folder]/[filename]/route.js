import { localImageResponse } from "@/lib/server/files";

// Public: pictures admins uploaded while the app runs without Supabase
// (with Supabase they are shown straight from the public bucket).
export async function GET(request, context) {
    const { folder, filename } = await context.params;
    return localImageResponse(folder, filename);
}
