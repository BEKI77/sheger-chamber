// drizzle-kit settings (optional tooling, e.g. `npx drizzle-kit studio`).
// database.sql in the project root stays the way to create the database.
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "mysql",
    schema: "./db/schema.js",
    dbCredentials: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 4000),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "shagar_chamber",
        ssl: process.env.DB_SSL === "false" ? undefined : { minVersion: "TLSv1.2" }
    }
});
