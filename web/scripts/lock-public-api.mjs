// Remove the public roles' (anon, authenticated) access to the app's tables, so
// Supabase's Data API can't reach them even if Row Level Security were turned off.
// The app connects as the database owner and is not affected.
// Runs automatically after `npm run db:push`.
import postgres from "postgres";

const url = process.env.DATABASE_MIGRATION_URL || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!url) {
    console.error("SUPABASE_DB_URL is not set.");
    process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1 });
try {
    const tables = await sql`select tablename from pg_tables where schemaname = 'public'`;
    for (const { tablename } of tables) {
        await sql`revoke all on table ${sql("public." + tablename)} from anon, authenticated`;
    }
    await sql`revoke all on all sequences in schema public from anon, authenticated`;
    console.log(`Public API access removed from ${tables.length} tables.`);
} catch (error) {
    // Plain Postgres (local testing) has no anon/authenticated roles
    if (error.code === "42704") console.log("No Supabase public roles here; nothing to lock.");
    else throw error;
} finally {
    await sql.end();
}
