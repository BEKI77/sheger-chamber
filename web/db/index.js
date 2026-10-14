// Database connection (server only): Supabase Postgres through Drizzle.
// SUPABASE_DB_URL (or DATABASE_URL) is the connection string from Supabase →
// Connect. Online, use the pooler string: transaction mode (port 6543) on
// Vercel, session mode (port 5432) on Render.
import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("SUPABASE_DB_URL is not set. See .env.example.");
}

function createClient() {
    return postgres(connectionString, {
        // Supabase's transaction pooler doesn't support prepared statements
        prepare: false,
        max: 5
    });
}

// Reuse one connection pool across hot reloads in development
const globalForDb = globalThis;
const client = globalForDb.__shagarDb ?? (globalForDb.__shagarDb = createClient());

export const db = drizzle(client, { schema });
export { schema };
