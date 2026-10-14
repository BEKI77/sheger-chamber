// drizzle-kit settings. `npm run db:push` creates or updates the tables.
// Creating tables needs a session-mode or direct connection (not the
// transaction pooler), so DATABASE_MIGRATION_URL can override SUPABASE_DB_URL.
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.js",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_MIGRATION_URL || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
    }
});
