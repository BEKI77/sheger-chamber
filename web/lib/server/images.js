// Clean up uploaded site images (event, expo, news and partnership pictures)
// once no record uses them any more.
import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { deleteStoredImage, isStoredImage } from "./files";

const IMAGE_COLUMNS = [
    [schema.events, schema.events.image_url],
    [schema.expos, schema.expos.image_url],
    [schema.news, schema.news.image_url],
    [schema.partnerships, schema.partnerships.logo_url]
];

async function inUse(url) {
    for (const [table, column] of IMAGE_COLUMNS) {
        const rows = await db.select({ url: column }).from(table).where(eq(column, url)).limit(1);
        if (rows.length) return true;
    }
    return false;
}

// Call after a record's image changed or the record was deleted, with the
// URL it used to have. Deletes the file when it's one of our uploads and no
// record still points at it. Never throws: a leftover file is not worth
// failing the save for.
export async function removeOldImage(oldUrl, newUrl = null) {
    if (!oldUrl || oldUrl === newUrl || !isStoredImage(oldUrl)) return;
    try {
        if (!(await inUse(oldUrl))) await deleteStoredImage(oldUrl);
    } catch (error) {
        console.error("Could not delete old image:", error?.message || error);
    }
}
