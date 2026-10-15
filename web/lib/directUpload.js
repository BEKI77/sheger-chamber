"use client";

// Upload a form's files straight to Supabase Storage, so they never pass
// through the app (hosts like Vercel cap a request at 4.5 MB).
// `files` maps field names to File objects, e.g. { cv: file }.
// Returns { field: storedName } to send with the form, or null when the
// server isn't set up for direct uploads (then send the files as before).
// Throws an Error with a message for the visitor when something fails.
export async function uploadDirect(form, files) {
    const response = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            form,
            files: Object.fromEntries(
                Object.entries(files).map(([field, file]) => [field, { type: file.type, size: file.size }])
            )
        })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.message || "Could not prepare the upload.");
    if (!result.direct) return null;

    const names = {};
    await Promise.all(
        Object.entries(files).map(async ([field, file]) => {
            const { filename, signedUrl } = result.uploads[field];
            const upload = await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });
            if (!upload.ok) throw new Error(`Could not upload ${file.name}. Please try again.`);
            names[field] = filename;
        })
    );
    return names;
}
