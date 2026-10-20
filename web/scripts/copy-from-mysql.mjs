// One-time copy of all data from the old MySQL / TiDB database into Supabase.
// Run in the web folder after `npm run db:push`:
//   npm run copy-from-mysql
// Reads MYSQL_URL (e.g. mysql://user:pass@host:4000/shaggar_chamber?ssl=true)
// and SUPABASE_DB_URL. Refuses to run if a Supabase table already has rows,
// so it can't create duplicates.
import mysql from "mysql2/promise";
import postgres from "postgres";

const TABLES = [
    "admin_users",
    "contact_messages",
    "events",
    "expos",
    "opportunities",
    "job_applications",
    "members",
    "news",
    "partnerships",
    "revenue"
];

const mysqlUrl = process.env.MYSQL_URL;
const pgUrl = process.env.DATABASE_MIGRATION_URL || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!mysqlUrl || !pgUrl) {
    console.error("Set MYSQL_URL and SUPABASE_DB_URL (in .env.local or the environment).");
    process.exit(1);
}

const url = new URL(mysqlUrl);
const source = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: url.searchParams.get("ssl") === "true" ? { minVersion: "TLSv1.2" } : undefined,
    // Read times as UTC, the way the app stores them
    timezone: "Z",
    dateStrings: false
});
const target = postgres(pgUrl, { prepare: false, max: 1 });

try {
    for (const table of TABLES) {
        const [{ count }] = await target`select count(*)::int as count from ${target(table)}`;
        if (count > 0) throw new Error(`Supabase table "${table}" already has ${count} rows. Nothing was copied.`);
    }

    await target.begin(async (tx) => {
        for (const table of TABLES) {
            const [rows] = await source.query(`SELECT * FROM \`${table}\``).catch((error) => {
                if (error.code === "ER_NO_SUCH_TABLE") return [[]];
                throw error;
            });
            // Copy only columns that exist in the Supabase table
            const columns = (
                await tx`select column_name from information_schema.columns
                where table_schema = 'public' and table_name = ${table}`
            ).map((c) => c.column_name);
            const cleaned = rows.map((row) =>
                Object.fromEntries(columns.filter((c) => c in row).map((c) => [c, row[c]]))
            );
            for (let i = 0; i < cleaned.length; i += 500) {
                await tx`insert into ${tx(table)} ${tx(cleaned.slice(i, i + 500))}`;
            }
            // Continue new ids after the copied ones
            if (columns.includes("id") && cleaned.length) {
                await tx`select setval(pg_get_serial_sequence(${table}, 'id'), (select max(id) from ${tx(table)}))`;
            }
            console.log(`${table}: ${cleaned.length} rows`);
        }
    });
    console.log("Done.");
} catch (error) {
    console.error("Copy failed:", error.message);
    process.exitCode = 1;
} finally {
    await source.end();
    await target.end();
}
