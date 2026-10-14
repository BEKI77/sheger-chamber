require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const membersRouter = require("./members");
const opportunitiesRouter = require("./opportunities");
const newsRouter = require("./news");
const revenueRouter = require("./revenue");
const expoRouter = require("./expo");
const partnershipsRouter = require("./partnerships");
const contactRouter = require("./contact");
const jobApplicationsRouter = require("./job-applications");
const eventsRouter = require("./events");
const adminAuthRouter = require("./admin-auth");
const requireAdmin = require("./admin-middleware");
const db = require("./db");
const path = require("path");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware

app.set("trust proxy", 1);

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured");
}

// Sessions live in the database ("sessions" table, created automatically),
// so admins stay logged in across restarts and memory does not grow.
const sessionStore = new MySQLStore(
    {
        createDatabaseTable: true,
        clearExpired: true
    },
    db.promise()
);

app.use(
    session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Extra sites allowed to call the API, comma separated, e.g.
// CORS_ORIGINS=https://shagarchamber.com,https://www.shagarchamber.com
const extraOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors(function (req, callback) {
    const origin = req.get("Origin");
    const allowed =
        !origin ||
        // The site served by this same server
        origin === `${req.protocol}://${req.get("host")}` ||
        // Local development (Live Server, other ports)
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        extraOrigins.includes(origin);

    callback(null, { origin: allowed, credentials: true });
}));
// Used by the admin pages to check that the admin is still logged in
app.get("/api/admin/test", requireAdmin, (req, res) => {

    res.json({
        success: true,
        message: "Admin authentication is working.",
        admin: req.session.admin
    });

});
app.use("/api/members", membersRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/news", newsRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/expos", expoRouter);
app.use("/api/partnerships", partnershipsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/job-applications", jobApplicationsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/admin", adminAuthRouter);
// Serve the website (frontend folder) from this same server
// Open http://localhost:5000/admin-login.html in the browser
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Errors (rejected uploads, bad JSON, crashes) always answer in JSON,
// without leaking stack traces.
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    let status = err.status || err.statusCode || 500;
    let message = status < 500 ? err.message : "Something went wrong. Please try again later.";

    if (err instanceof multer.MulterError) {
        status = 400;
        message = err.code === "LIMIT_FILE_SIZE"
            ? "File is too large. The maximum size is 5 MB."
            : "Invalid file upload: " + err.message;
    } else if (err.type === "entity.parse.failed") {
        message = "Invalid request data.";
    }

    if (status >= 500) console.error("Unhandled error:", err);

    res.status(status).json({ success: false, message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Shagar Chamber backend running on http://localhost:${PORT}`);
});