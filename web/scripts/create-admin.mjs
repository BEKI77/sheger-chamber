// Create an admin account, or reset the password of an existing one
// (matched by email). Run in the web folder:  npm run create-admin
import readline from "node:readline";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
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

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "shagar_chamber",
    ssl: process.env.DB_SSL === "false" ? undefined : { minVersion: "TLSv1.2" }
});

try {
    const db = drizzle(connection);
    const passwordHash = await bcrypt.hash(password, 12);
    // A second run with the same email updates that admin instead of failing
    const [result] = await db
        .insert(adminUsers)
        .values({ full_name: fullName, username, email, password_hash: passwordHash, role: "admin", status: "Active" })
        .onDuplicateKeyUpdate({
            set: { full_name: fullName, username, password_hash: passwordHash, status: "Active" }
        });

    console.log(result.affectedRows === 1 ? "Admin account created." : "Existing admin updated with the new password.");
    console.log("Username:", username);
    console.log("Email:", email);
} catch (error) {
    console.error("Failed to save admin:", error.cause?.message || error.message);
    process.exitCode = 1;
} finally {
    await connection.end();
}
