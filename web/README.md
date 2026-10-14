# Shagar Chamber website (Next.js + Supabase)

The public website, the admin panel and the API in one Next.js app, with Supabase for the database and file storage.

- **Pages**: `app/` (routes) and `components/` (page parts). Each stylesheet group has its own root layout (`app/(site)`, `app/(admin-*)`), so the pages look exactly like the original static site.
- **API**: `app/api/**/route.js`, at the same `/api/...` addresses the site has always used.
- **Database**: Supabase Postgres through [Drizzle ORM](https://orm.drizzle.team). The schema is in `db/schema.js`. Row Level Security is on for every table with no policies, so Supabase's public Data API can't read or change anything. Only this app's server can.
- **Uploads** (ID photos, payment receipts, CVs): a private Supabase Storage bucket, reached through `@supabase/server` with the secret key. The files have no public links; admins see them through the app.
- **Admin login**: the app's own accounts (`admin_users`) and database sessions (`admin_sessions`), with an httpOnly cookie that lasts 2 hours. After 10 wrong passwords from one IP address, logins from it are blocked for 15 minutes.

## Settings (`.env.local`)

Copy `.env.example` to `.env.local` and fill in the values from your Supabase project:

| Setting | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Project Settings → API Keys (or Data API): the project URL |
| `SUPABASE_SECRET_KEY` | Project Settings → API Keys → **Secret keys** (`sb_secret_...`). Keep it secret: it bypasses all security. |
| `SUPABASE_DB_URL` (or `DATABASE_URL`) | **Connect** button → **Session pooler** (or **Transaction pooler** on Vercel). Replace `[YOUR-PASSWORD]` with your database password (Database Settings → reset it if you don't know it). |

The app doesn't use the publishable key (`sb_publishable_...`). Leaving it in the file does no harm.

## Run it locally

```bash
npm install
npm run db:push        # creates the tables in Supabase (safe to run again)
npm run create-admin   # asks for name, username, email, password (12+ chars)
npm run dev            # http://localhost:3000, admin at /admin/login
```

`npm run create-admin` with an existing email resets that admin's password.

If `db:push` can't connect through the transaction pooler (port 6543), set `DATABASE_MIGRATION_URL` to the **Session pooler** string (port 5432) and run it again. As an alternative, paste `drizzle/0000_initial_schema.sql` into Supabase's **SQL Editor**.

### Moving existing data (one time)

- **Records from the old MySQL / TiDB database**: set `MYSQL_URL` in `.env.local` (for example `mysql://user:password@host:4000/shagar_chamber?ssl=true`), run `npm run db:push`, then `npm run copy-from-mysql`. It refuses to run if Supabase already has data, so it can't create duplicates. Admin passwords keep working.
- **Uploaded files in `uploads/`**: `npm run upload-files` copies them to the Supabase bucket, skipping files already there.

## Hosting it online

Supabase already holds the data and files. The app itself needs a Node.js host. Both options deploy from a Git repository, so push the project to GitHub first.

**Render (recommended).** Choose **New → Web Service** and connect the repository, then set:

- Root directory: `web`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_DB_URL` (session pooler string)

Render has no limit on upload size, so the membership form's three photos (up to 5 MB each) always go through. The free plan sleeps after 15 minutes without visitors, and the first visit after that takes about a minute. The Starter plan stays awake.

**Vercel.** Choose **Add New → Project**, import the repository, set the root directory to `web`, and add the same environment variables. Use the **transaction pooler** string for `SUPABASE_DB_URL`. Vercel caps each request at **4.5 MB**, so a membership application with large phone photos, or a CV close to 5 MB, will fail.

**Custom domain.** In the host's dashboard, open **Settings → Custom Domains** and add the DNS record it shows at your domain registrar. HTTPS is set up automatically.

**Optional hardening.** The app talks to Postgres directly and never uses Supabase's Data API (REST/GraphQL). You can turn the Data API off under Project Settings → Data API, so nothing is exposed even by mistake.
