import { fail, json, readJson, route } from "@/lib/server/http";
import { directUploadsEnabled, signUpload } from "@/lib/server/files";
import { UPLOAD_FORMS } from "@/lib/server/upload-forms";

// Public: the membership and job forms call this first, then upload their files
// straight to Supabase Storage with the returned one-time links. This keeps
// large photos and CVs out of the request to the app (Vercel caps it at 4.5 MB).
// Without Supabase configured, forms fall back to sending files to the app.
export const POST = route(async (request) => {
    if (!directUploadsEnabled()) return json({ success: true, direct: false });

    const { form, files } = await readJson(request);
    const fields = UPLOAD_FORMS[form];
    if (!fields || !files || typeof files !== "object") return fail(400, "Invalid upload request.");

    const uploads = {};
    for (const [field, file] of Object.entries(files)) {
        const spec = fields[field];
        if (!spec) return fail(400, "Invalid upload request.");
        uploads[field] = await signUpload(file || {}, spec.allowed, spec.typeMessage, spec.folder);
    }
    return json({ success: true, direct: true, uploads });
});
