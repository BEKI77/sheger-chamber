CREATE TABLE "admin_sessions" (
	"token_hash" char(64) PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"username" varchar(100),
	"email" varchar(150) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"status" varchar(20) DEFAULT 'Active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(255),
	"message" text NOT NULL,
	"status" varchar(30) DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"event_type" varchar(100),
	"description" text,
	"event_date" date,
	"event_time" varchar(50),
	"location" varchar(255),
	"image_url" varchar(500),
	"contact_email" varchar(150),
	"contact_phone" varchar(50),
	"status" varchar(30) DEFAULT 'Upcoming',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "expos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"image_url" varchar(500),
	"location" varchar(255),
	"start_date" date,
	"end_date" date,
	"contact_email" varchar(150),
	"contact_phone" varchar(50),
	"status" varchar(30) DEFAULT 'Upcoming',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "expos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"opportunity_id" integer,
	"job_title" varchar(255),
	"full_name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(50),
	"education" text,
	"experience" text,
	"cover_letter" text,
	"cv_path" varchar(500),
	"status" varchar(30) DEFAULT 'Pending',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"ip" varchar(64) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"first_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "login_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(50),
	"national_id" varchar(100),
	"national_id_front" varchar(500),
	"national_id_back" varchar(500),
	"tin_number" varchar(100),
	"business_name" varchar(255),
	"business_type" varchar(100),
	"business_category" varchar(100),
	"address" varchar(255),
	"business_description" text,
	"membership_type" varchar(100),
	"membership_fee" numeric(12, 2) DEFAULT '0',
	"payment_status" varchar(30) DEFAULT 'Pending',
	"payment_method" varchar(100),
	"payment_receipt" varchar(500),
	"status" varchar(30) DEFAULT 'Pending',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100),
	"image_url" varchar(500),
	"excerpt" text,
	"content" text,
	"author" varchar(150),
	"status" varchar(30) DEFAULT 'Published',
	"published_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "news" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100),
	"organization" varchar(255),
	"location" varchar(255),
	"description" text,
	"requirements" text,
	"contact_email" varchar(150),
	"contact_phone" varchar(50),
	"application_deadline" date,
	"status" varchar(30) DEFAULT 'Open',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "opportunities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "partnerships" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_name" varchar(255) NOT NULL,
	"partner_type" varchar(100),
	"description" text,
	"logo_url" varchar(500),
	"website_url" varchar(500),
	"contact_email" varchar(150),
	"contact_phone" varchar(50),
	"status" varchar(30) DEFAULT 'Active',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "partnerships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_type" varchar(100),
	"description" text,
	"payer_name" varchar(150),
	"amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"payment_method" varchar(100),
	"payment_status" varchar(30) DEFAULT 'Paid',
	"payment_date" date,
	"reference" varchar(150),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "revenue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Keep Supabase's public Data API away from the app's tables (the app uses the owner role)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
