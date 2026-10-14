
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "shagar_chamber",
    // TiDB Cloud needs TLS. Local XAMPP MySQL does not support it: set DB_SSL=false.
    ssl: process.env.DB_SSL === "false"
        ? undefined
        : { minVersion: "TLSv1.2" },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }

    console.log("Database connected successfully!");
    connection.release();
});

module.exports = db;
