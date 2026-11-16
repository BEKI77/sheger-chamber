// Send a change to the API as JSON and return the parsed reply.
// Throws an Error with the server's message when the request fails.
export async function sendJson(url, method, body, fallbackMessage) {
    const response = await fetch(url, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
        throw new Error(result.message || fallbackMessage);
    }
    return result;
}

// Send a multipart form (with files) and return the parsed reply.
export async function sendForm(url, method, formData, fallbackMessage) {
    const response = await fetch(url, { method, credentials: "include", body: formData });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
        throw new Error(result.message || fallbackMessage);
    }
    return result;
}

// Last part of a stored file path, e.g. "uploads/ids/123.jpg" -> "123.jpg"
export function fileName(filePath) {
    return filePath ? String(filePath).split(/[\\/]/).pop() : "";
}

// Upload a picture for an event, expo, news article or partnership and return
// its lasting URL. With Supabase the browser uploads it straight to the public
// bucket using a one-time link; otherwise the file is sent to the app.
// `folder` is one of: events, expos, news, partnerships.
export async function uploadImage(file, folder) {
    const sign = await sendJson(
        "/api/uploads/image",
        "POST",
        { folder, type: file.type, size: file.size },
        "Could not prepare the image upload."
    );
    if (sign.direct) {
        const upload = await fetch(sign.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file
        });
        if (!upload.ok) throw new Error(`Could not upload ${file.name}. Please try again.`);
        return sign.url;
    }

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);
    const result = await sendForm("/api/uploads/image", "POST", formData, "Could not upload the image.");
    return result.url;
}

// Throw away an image uploaded in a form but never saved. Best effort: the
// server only deletes it if no record uses it.
export function discardImage(url) {
    fetch("/api/uploads/image", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        keepalive: true
    }).catch(() => {});
}
