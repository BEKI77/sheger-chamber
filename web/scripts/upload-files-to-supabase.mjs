// One-time copy of locally saved uploads (UPLOAD_DIR, default ./uploads) to
// the private Supabase Storage bucket the app uses. Safe to run again: files
// already in the bucket are skipped. Local files are left in place.
// Run in the web folder:  npm run upload-files
import fs from "node:fs/promises";
import path from "node:path";
import { createAdminClient } from "@supabase/server/core";

const BUCKET = process.env.SUPABASE_BUCKET || "shagar-member-documents";
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "uploads");
const FOLDERS = ["national-ids", "payment-receipts", "job-applications"];
const TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

const supabase = createAdminClient();
if ((await supabase.storage.getBucket(BUCKET)).error) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (error) throw new Error("Could not create bucket: " + error.message);
}

let uploaded = 0,
    skipped = 0,
    failed = 0;
for (const folder of FOLDERS) {
    const names = await fs.readdir(path.join(UPLOAD_DIR, folder)).catch(() => []);
    const { data: existing } = await supabase.storage.from(BUCKET).list(folder, { limit: 10000 });
    const already = new Set((existing || []).map((item) => item.name));

    for (const name of names) {
        if (already.has(name)) {
            skipped++;
            continue;
        }
        const body = await fs.readFile(path.join(UPLOAD_DIR, folder, name));
        const { error } = await supabase.storage.from(BUCKET).upload(`${folder}/${name}`, body, {
            contentType: TYPES[path.extname(name).toLowerCase()] || "application/octet-stream"
        });
        if (error) {
            failed++;
            console.error(`Failed: ${folder}/${name}: ${error.message}`);
        } else uploaded++;
    }
}
console.log(`Uploaded ${uploaded}, already there ${skipped}, failed ${failed}.`);
if (failed) process.exitCode = 1;
