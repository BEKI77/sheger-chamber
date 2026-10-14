// Drizzle schema for the Shagar Chamber MySQL database.
// Mirrors ../database.sql. Property names are the column names (snake_case)
// so API responses keep the same field names the pages use.
import {
    mysqlTable,
    int,
    varchar,
    text,
    longtext,
    decimal,
    date,
    datetime,
    timestamp,
    char
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

const createdAt = () => timestamp("created_at").default(sql`CURRENT_TIMESTAMP`);

export const adminUsers = mysqlTable("admin_users", {
    id: int("id").autoincrement().primaryKey(),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    username: varchar("username", { length: 100 }).unique(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("admin"),
    status: varchar("status", { length: 20 }).notNull().default("Active"),
    created_at: createdAt()
});

// Logged-in admin sessions. Only a SHA-256 hash of the cookie token is stored.
export const adminSessions = mysqlTable("admin_sessions", {
    token_hash: char("token_hash", { length: 64 }).primaryKey(),
    admin_id: int("admin_id").notNull(),
    expires_at: datetime("expires_at").notNull(),
    created_at: createdAt()
});

// Failed admin logins per IP address, for the login attempt limit.
export const loginAttempts = mysqlTable("login_attempts", {
    ip: varchar("ip", { length: 64 }).primaryKey(),
    count: int("count").notNull().default(0),
    first_at: datetime("first_at").notNull()
});

export const contactMessages = mysqlTable("contact_messages", {
    id: int("id").autoincrement().primaryKey(),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 255 }),
    message: text("message").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("New"),
    created_at: createdAt()
});

export const events = mysqlTable("events", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    event_type: varchar("event_type", { length: 100 }),
    description: text("description"),
    event_date: date("event_date"),
    event_time: varchar("event_time", { length: 50 }),
    location: varchar("location", { length: 255 }),
    image_url: varchar("image_url", { length: 500 }),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Upcoming"),
    created_at: createdAt()
});

export const expos = mysqlTable("expos", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }),
    description: text("description"),
    image_url: varchar("image_url", { length: 500 }),
    location: varchar("location", { length: 255 }),
    start_date: date("start_date"),
    end_date: date("end_date"),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Upcoming"),
    created_at: createdAt()
});

export const opportunities = mysqlTable("opportunities", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    organization: varchar("organization", { length: 255 }),
    location: varchar("location", { length: 255 }),
    description: text("description"),
    requirements: text("requirements"),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    application_deadline: date("application_deadline"),
    status: varchar("status", { length: 30 }).default("Open"),
    created_at: createdAt()
});

export const jobApplications = mysqlTable("job_applications", {
    id: int("id").autoincrement().primaryKey(),
    opportunity_id: int("opportunity_id"),
    job_title: varchar("job_title", { length: 255 }),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    education: text("education"),
    experience: text("experience"),
    cover_letter: text("cover_letter"),
    cv_path: varchar("cv_path", { length: 500 }),
    status: varchar("status", { length: 30 }).default("Pending"),
    created_at: createdAt()
});

export const members = mysqlTable("members", {
    id: int("id").autoincrement().primaryKey(),
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
    membership_fee: decimal("membership_fee", { precision: 12, scale: 2 }).default("0"),
    payment_status: varchar("payment_status", { length: 30 }).default("Pending"),
    payment_method: varchar("payment_method", { length: 100 }),
    payment_receipt: varchar("payment_receipt", { length: 500 }),
    status: varchar("status", { length: 30 }).default("Pending"),
    created_at: createdAt()
});

export const news = mysqlTable("news", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }),
    image_url: varchar("image_url", { length: 500 }),
    excerpt: text("excerpt"),
    content: longtext("content"),
    author: varchar("author", { length: 150 }),
    status: varchar("status", { length: 30 }).default("Published"),
    published_at: datetime("published_at").default(sql`CURRENT_TIMESTAMP`),
    created_at: createdAt()
});

export const partnerships = mysqlTable("partnerships", {
    id: int("id").autoincrement().primaryKey(),
    partner_name: varchar("partner_name", { length: 255 }).notNull(),
    partner_type: varchar("partner_type", { length: 100 }),
    description: text("description"),
    logo_url: varchar("logo_url", { length: 500 }),
    website_url: varchar("website_url", { length: 500 }),
    contact_email: varchar("contact_email", { length: 150 }),
    contact_phone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("Active"),
    created_at: createdAt()
});

export const revenue = mysqlTable("revenue", {
    id: int("id").autoincrement().primaryKey(),
    revenue_type: varchar("revenue_type", { length: 100 }),
    description: text("description"),
    payer_name: varchar("payer_name", { length: 150 }),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull().default("0"),
    payment_method: varchar("payment_method", { length: 100 }),
    payment_status: varchar("payment_status", { length: 30 }).default("Paid"),
    payment_date: date("payment_date"),
    reference: varchar("reference", { length: 150 }),
    notes: text("notes"),
    created_at: createdAt()
});
