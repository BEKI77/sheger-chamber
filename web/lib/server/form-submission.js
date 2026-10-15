// Read a public form submission that includes files, in either shape:
//  - JSON: the browser already uploaded the files to Supabase Storage with
//    one-time links (POST /api/uploads/sign) and sends their stored names
//  - multipart: the files are in the request (used without Supabase)
import "server-only";
import { readJson } from "./http";
import { checkUpload, confirmUpload, saveUpload } from "./files";
import { UPLOAD_FORMS } from "./upload-forms";

const NOT_FOUND = "An uploaded file could not be found. Please select your files and submit again.";

export async function readFormSubmission(request, formName) {
    const spec = UPLOAD_FORMS[formName];
    const isJson = (request.headers.get("content-type") || "").includes("application/json");

    if (isJson) {
        const body = await readJson(request);
        const text = (name) => (typeof body[name] === "string" ? body[name].trim() : "");
        return {
            text,
            hasFile: (field) => Boolean(text(field)),
            // Check each named file really is in Storage before it's saved to the database
            storeFiles: async () => {
                const names = {};
                for (const [field, { folder, allowed }] of Object.entries(spec)) {
                    names[field] = await confirmUpload(text(field), folder, allowed, NOT_FOUND);
                }
                return names;
            }
        };
    }

    const form = await request.formData();
    const text = (name) => {
        const value = form.get(name);
        return typeof value === "string" ? value.trim() : "";
    };
    const checked = Object.fromEntries(
        Object.entries(spec).map(([field, { allowed, typeMessage }]) => [
            field,
            checkUpload(form.get(field), allowed, typeMessage)
        ])
    );
    return {
        text,
        hasFile: (field) => Boolean(checked[field]),
        storeFiles: async () => {
            const names = {};
            for (const [field, { folder }] of Object.entries(spec))
                names[field] = await saveUpload(checked[field], folder);
            return names;
        }
    };
}
