import { fail, json, readJson, route } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/session";
import { directUploadsEnabled, saveImage, signImageUpload } from "@/lib/server/files";
import { removeOldImage } from "@/lib/server/images";

// Admin only: add a picture for an event, expo, news article or partnership.
//  - JSON { folder, type, size }: with Supabase, answers with a one-time link
//    to upload the image straight to the public bucket plus its lasting URL
//    ({ direct: true, signedUrl, url }), or { direct: false } without Supabase.
//  - multipart { folder, file }: the image itself; answers with { url }.
// The URL is then saved with the record like any other field.
export const POST = route(async (request) => {
    await requireAdmin();
    const isJson = (request.headers.get("content-type") || "").includes("application/json");

    if (isJson) {
        if (!directUploadsEnabled()) return json({ success: true, direct: false });
        const { folder, type, size } = await readJson(request);
        const upload = await signImageUpload({ type, size }, folder);
        return json({ success: true, direct: true, ...upload });
    }

    const form = await request.formData().catch(() => null);
    if (!form) return fail(400, "Invalid upload request.");
    const url = await saveImage(form.get("file"), String(form.get("folder") || ""));
    return json({ success: true, url });
});

// Admin only: JSON { url }. Throw away an image uploaded in a form that was
// then replaced, removed or reset before saving. Only deletes our own uploads
// that no record uses, so a saved image is never removed this way.
export const DELETE = route(async (request) => {
    await requireAdmin();
    const { url } = await readJson(request);
    await removeOldImage(typeof url === "string" ? url : "");
    return json({ success: true });
});
