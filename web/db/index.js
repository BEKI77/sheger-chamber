// Database connection (server only). Uses the same DB_* settings as the old
// Express backend, so the same .env values work.
import "server-only";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

function createPool() {
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 4000),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "shagar_chamber",
        // TiDB Cloud needs TLS. Local XAMPP MySQL does not support it: set DB_SSL=false.
        ssl: process.env.DB_SSL === "false" ? undefined : { minVersion: "TLSv1.2" },
        // Store and read times as UTC
        timezone: "Z",
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
    });
}

// Reuse one pool across hot reloads in development
const globalForDb = globalThis;
const pool = globalForDb.__shagarPool ?? (globalForDb.__shagarPool = createPool());

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
