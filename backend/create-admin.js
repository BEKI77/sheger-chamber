// Create an admin account, or reset the password of an existing one
// (matched by email). Run from the backend folder:  node create-admin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const readline = require("readline");
const db = require("./db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

async function createAdmin() {

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

    try {

        const passwordHash = await bcrypt.hash(password, 12);

        // A second run with the same email updates that admin instead of failing.
        const sql = `
            INSERT INTO admin_users
            (
                full_name,
                username,
                email,
                password_hash,
                role,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                username = VALUES(username),
                password_hash = VALUES(password_hash),
                status = 'Active'
        `;

        const values = [
            fullName,
            username,
            email,
            passwordHash,
            "admin",
            "Active"
        ];

        db.query(sql, values, (err, result) => {

            if (err) {
                console.error("Failed to save admin:", err.message);
                process.exit(1);
            }

            console.log(
                result.affectedRows === 1
                    ? "Admin account created."
                    : "Existing admin updated with the new password."
            );
            console.log("Username:", username);
            console.log("Email:", email);

            process.exit(0);
        });

    } catch (error) {

        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();
