// Drizzle schema for the Shagar Chamber database (Supabase Postgres).
// Create or update the tables with `npm run db:push`.
//
// Property names are the column names (snake_case) so API responses keep the
// field names the pages use.
//
// Row Level Security is on for every table with no policies: Supabase's public
// Data API (publishable key) can't read or change anything. The app's server
// connects as the database owner, which is not limited by RLS.
import { pgTable, serial, integer, varchar, text, numeric, date, timestamp, char } from "drizzle-orm/pg-core";

const timestampColumn = (name) => timestamp(name, { withTimezone: true, mode: "date" });
const createdAt = () => timestampColumn("created_at").defaultNow();
const dateColumn = (name) => date(name, { mode: "date" });

export const adminUsers = pgTable("admin_users", {
    id: serial("id").primaryKey(),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    username: varchar("username", { length: 100 }).unique(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("admin"),
    status: varchar("status", { length: 20 }).notNull().default("Active"),
    created_at: createdAt()
}).enableRLS();

// Logged-in admin sessions. Only a SHA-256 hash of the cookie token is stored.
export const adminSessions = pgTable("admin_sessions", {
    token_hash: char("token_hash", { length: 64 }).primaryKey(),
    admin_id: integer("admin_id")
        .notNull()
        .references(() => adminUsers.id, { onDelete: "cascade" }),
    expires_at: timestampColumn("expires_at").notNull(),
    created_at: createdAt()
}).enableRLS();

// Failed admin logins per IP address, for the login attempt limit.
export const loginAttempts = pgTable("login_attempts", {
    ip: varchar("ip", { length: 64 }).primaryKey(),
    count: integer("count").notNull().default(0),
    first_at: timestampColumn("first_at").notNull()
}).enableRLS();

export const contactMessages = pgTable("contact_messages", {
    id: serial("id").primaryKey(),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 255 }),
    message: text("message").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("New"),
    created_at: createdAt()
}).enableRLS();

export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    event_type: varchar("event_type", { length: 100 }),
    description: text("description"),
    event_date: dateColumn("event_date"),
    event_time: varchar("event_time", { length: 50 }),
    location: varchar("location", { length: 255 }),
    image_url: varchar("image_url", { length: 500 }),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Upcoming"),
    created_at: createdAt()
}).enableRLS();

export const expos = pgTable("expos", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }),
    description: text("description"),
    image_url: varchar("image_url", { length: 500 }),
    location: varchar("location", { length: 255 }),
    start_date: dateColumn("start_date"),
    end_date: dateColumn("end_date"),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Upcoming"),
    created_at: createdAt()
}).enableRLS();

export const opportunities = pgTable("opportunities", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    organization: varchar("organization", { length: 255 }),
    location: varchar("location", { length: 255 }),
    description: text("description"),
    requirements: text("requirements"),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    application_deadline: dateColumn("application_deadline"),
    status: varchar("status", { length: 30 }).default("Open"),
    created_at: createdAt()
}).enableRLS();

export const jobApplications = pgTable("job_applications", {
    id: serial("id").primaryKey(),
    opportunity_id: integer("opportunity_id"),
    job_title: varchar("job_title", { length: 255 }),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    education: text("education"),
    experience: text("experience"),
    cover_letter: text("cover_letter"),
    cv_path: varchar("cv_path", { length: 500 }),
    status: varchar("status", { length: 30 }).default("Pending"),
    // Set when an admin archives the application; null while it is active
    archived_at: timestampColumn("archived_at"),
    created_at: createdAt()
}).enableRLS();

export const members = pgTable("members", {
    id: serial("id").primaryKey(),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    national_id: varchar("national_id", { length: 100 }),
    national_id_front: varchar("national_id_front", { length: 500 }),
    national_id_back: varchar("national_id_back", { length: 500 }),
    tin_number: varchar("tin_number", { length: 100 }),
    business_name: varchar("business_name", { length: 255 }),
    business_type: varchar("business_type", { length: 100 }),
    business_category: varchar("business_category", { length: 100 }),
    address: varchar("address", { length: 255 }),
    business_description: text("business_description"),
    membership_type: varchar("membership_type", { length: 100 }),
    membership_fee: numeric("membership_fee", { precision: 12, scale: 2 }).default("0"),
    payment_status: varchar("payment_status", { length: 30 }).default("Pending"),
    payment_method: varchar("payment_method", { length: 100 }),
    payment_receipt: varchar("payment_receipt", { length: 500 }),
    status: varchar("status", { length: 30 }).default("Pending"),
    created_at: createdAt()
}).enableRLS();

export const news = pgTable("news", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    image_url: varchar("image_url", { length: 500 }),
    excerpt: text("excerpt"),
    content: text("content"),
    author: varchar("author", { length: 150 }),
    status: varchar("status", { length: 30 }).default("Published"),
    published_at: timestampColumn("published_at").defaultNow(),
    created_at: createdAt()
}).enableRLS();

export const partnerships = pgTable("partnerships", {
    id: serial("id").primaryKey(),
    partner_name: varchar("partner_name", { length: 255 }).notNull(),
    partner_type: varchar("partner_type", { length: 100 }),
    description: text("description"),
    logo_url: varchar("logo_url", { length: 500 }),
    website_url: varchar("website_url", { length: 500 }),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Active"),
    created_at: createdAt()
}).enableRLS();

export const revenue = pgTable("revenue", {
    id: serial("id").primaryKey(),
    revenue_type: varchar("revenue_type", { length: 100 }),
    description: text("description"),
    payer_name: varchar("payer_name", { length: 150 }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0"),
    payment_method: varchar("payment_method", { length: 100 }),
    payment_status: varchar("payment_status", { length: 30 }).default("Paid"),
    payment_date: dateColumn("payment_date"),
    reference: varchar("reference", { length: 150 }),
    notes: text("notes"),
    created_at: createdAt()
}).enableRLS();
