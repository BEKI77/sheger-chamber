// Shared helpers for the API route handlers.
import "server-only";
import { NextResponse } from "next/server";

// Throw this from a handler to answer with an error status and message.
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function json(body, status = 200) {
    return NextResponse.json(body, { status });
}

export function fail(status, message) {
    return json({ success: false, message }, status);
}

// Parse a JSON request body. An empty body counts as {}.
export async function readJson(request) {
    const text = await request.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        throw new HttpError(400, "Invalid request data.");
    }
}

// Read the [id] route parameter as a positive whole number (or null).
export async function idParam(context) {
    const { id } = await context.params;
    const number = Number(id);
    return Number.isSafeInteger(number) && number > 0 ? number : null;
}

// Wrap a handler: known errors become JSON answers, anything else a 500
// without internal details.
export function route(handler) {
    return async (request, context) => {
        try {
            return await handler(request, context);
        } catch (error) {
            if (error instanceof HttpError) return fail(error.status, error.message);
            console.error("API error:", error);
            return fail(500, "Something went wrong. Please try again later.");
        }
    };
}

// Trimmed string, or null when empty / missing
export function clean(value) {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text ? text : null;
}

// Affected rows / insert id from a Drizzle mysql2 write result
export const affectedRows = (result) => result[0]?.affectedRows ?? 0;
export const insertId = (result) => result[0]?.insertId;
