// Uploaded files (national ID photos, payment receipts, CVs).
// With SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set, files go to a private
// Supabase Storage bucket (needed online: hosts like Vercel have no lasting
// disk). Otherwise they are saved under UPLOAD_DIR (default ./uploads).
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { HttpError } from "./http";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET_NAME = process.env.SUPABASE_BUCKET || "shagar-member-documents";
// Runtime data folder, not part of the app: excluded from build tracing
const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || "uploads");

export const IMAGE_TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
export const CV_TYPES = {
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
};
const CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

const supabase =
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
              auth: { persistSession: false }
          })
        : null;

let bucketReady = null;
function ensureBucket() {
    bucketReady ??= supabase.storage.getBucket(BUCKET_NAME).then(async ({ error }) => {
        if (!error) return;
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, { public: false });
        if (createError) console.error("Could not create storage bucket:", createError.message);
    });
    return bucketReady;
}

// Check an uploaded File and return { file, ext }, or throw a 400.
// `allowed` maps MIME types to extensions; the saved name never uses the
// name the uploader sent, so nothing can be stored as .html or .js.
export function checkUpload(file, allowed, typeMessage) {
    if (!file || typeof file === "string" || file.size === 0) return null;
    const ext = allowed[file.type];
    if (!ext) throw new HttpError(400, typeMessage);
    if (file.size > MAX_FILE_SIZE) throw new HttpError(400, "File is too large. The maximum size is 5 MB.");
    return { file, ext };
}

// Save a checked upload into `folder`; returns the stored file name.
export async function saveUpload({ file, ext }, folder) {
    const filename = `${Date.now()}-${crypto.randomInt(1e9)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (supabase) {
        await ensureBucket();
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(`${folder}/${filename}`, buffer, { contentType: file.type, upsert: true });
        if (error) {
            console.error("Upload to permanent storage failed:", error.message);
            throw new HttpError(500, "Could not save the uploaded file. Please try again.");
        }
    } else {
        const dir = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, folder);
        await fs.mkdir(/*turbopackIgnore: true*/ dir, { recursive: true });
        await fs.writeFile(/*turbopackIgnore: true*/ path.join(dir, filename), buffer);
    }
    return filename;
}

// Answer with a stored file: local disk first, then Supabase.
export async function storedFileResponse(folder, filename, notFoundMessage) {
    const safeName = path.basename(filename || "");
    const notFound = () => Response.json({ success: false, message: notFoundMessage }, { status: 404 });
    if (!safeName || safeName.startsWith(".")) return notFound();

    let buffer = null;
    try {
        buffer = await fs.readFile(/*turbopackIgnore: true*/ path.join(UPLOAD_DIR, folder, safeName));
    } catch {}

    if (!buffer && supabase) {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).download(`${folder}/${safeName}`);
        if (!error && data) buffer = Buffer.from(await data.arrayBuffer());
    }
    if (!buffer) return notFound();

    return new Response(buffer, {
        headers: {
            "Content-Type": CONTENT_TYPES[path.extname(safeName).toLowerCase()] || "application/octet-stream",
            "Content-Disposition": "inline",
            // ID scans, receipts and CVs: never cached, never type-guessed
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        }
    });
}

export async function deleteStoredFile(folder, filename) {
    const safeName = path.basename(filename || "");
    if (!safeName) return;
    await fs.rm(/*turbopackIgnore: true*/ path.join(UPLOAD_DIR, folder, safeName), { force: true });
    if (supabase) {
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([`${folder}/${safeName}`]);
        if (error) throw error;
    }
}
