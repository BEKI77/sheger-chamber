// Create an admin account, or reset the password of an existing one
// (matched by email). Run in the web folder:  npm run create-admin
import readline from "node:readline";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { adminUsers } from "../db/schema.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Queue input lines so answers are not lost when input is pasted or piped in
const pendingLines = [];
const waiting = [];
rl.on("line", (line) => {
    const resolve = waiting.shift();
    if (resolve) resolve(line.trim());
    else pendingLines.push(line.trim());
});
rl.on("close", () => waiting.splice(0).forEach((resolve) => resolve("")));

function ask(question) {
    process.stdout.write(question);
    if (pendingLines.length) return Promise.resolve(pendingLines.shift());
    return new Promise((resolve) => waiting.push(resolve));
}

const fullName = (await ask("Full name [Shagar Chamber Admin]: ")) || "Shagar Chamber Admin";
const username = (await ask("Username [admin]: ")) || "admin";
const email = await ask("Email: ");
const password = await ask("Password (at least 12 characters): ");
rl.close();

if (!email || !email.includes("@")) {
    console.error("A valid email is required.");
    process.exit(1);
}
if (password.length < 12) {
    console.error("Use a password with at least 12 characters.");
    process.exit(1);
}

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!connectionString) {
    console.error("SUPABASE_DB_URL is not set. Add it to .env.local (see .env.example).");
    process.exit(1);
}

const client = postgres(connectionString, { prepare: false, max: 1 });

try {
    const db = drizzle(client);
    const passwordHash = await bcrypt.hash(password, 12);
    // A second run with the same email updates that admin instead of failing
    const [saved] = await db
        .insert(adminUsers)
        .values({ full_name: fullName, username, email, password_hash: passwordHash, role: "admin", status: "Active" })
        .onConflictDoUpdate({
            target: adminUsers.email,
            set: { full_name: fullName, username, password_hash: passwordHash, status: "Active" }
        })
        .returning({ id: adminUsers.id, created: sql`(xmax = 0)` });

    console.log(saved.created ? "Admin account created." : "Existing admin updated with the new password.");
    console.log("Username:", username);
    console.log("Email:", email);
} catch (error) {
    console.error("Failed to save admin:", error.cause?.message || error.message);
    process.exitCode = 1;
} finally {
    await client.end();
}
