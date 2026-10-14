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
