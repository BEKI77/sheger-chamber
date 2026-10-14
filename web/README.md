# Shagar Chamber website (Next.js)

The public website, the admin panel and the API in one Next.js app.

- **Pages**: `app/` (routes) and `components/` (page parts). Each stylesheet group has its own root layout (`app/(site)`, `app/(admin-*)`), so the pages look exactly like the old static site.
- **API**: `app/api/**/route.js`, at the same `/api/...` addresses the site has always used.
- **Database**: MySQL through [Drizzle ORM](https://orm.drizzle.team). Schema in `db/schema.js`; `../database.sql` creates the tables.
- **Uploads** (ID photos, payment receipts, CVs): Supabase Storage when configured, otherwise the `uploads/` folder.
- **Admin login**: database sessions (`admin_sessions` table) with an httpOnly cookie, 2 hours long. After 10 wrong passwords, logins from that IP address are blocked for 15 minutes.

## Run it locally

1. Create the database: import `../database.sql` in phpMyAdmin (or `mysql < database.sql`). You can import it again safely; it only adds what is missing.
2. Copy `.env.example` to `.env.local` and fill in your database settings. XAMPP: `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USER=root`, empty password, `DB_SSL=false`.
3. Install and create an admin:
   ```bash
   npm install
   npm run create-admin     # asks for name, username, email, password (12+ chars)
   ```
   Run it again with the same email to reset that admin's password.
4. Start it:
   ```bash
   npm run dev              # development, http://localhost:3000
   # or
   npm run build && npm start   # production mode
   ```
   Website: http://localhost:3000 · Admin: http://localhost:3000/admin/login

Old addresses like `/admin-members.html` redirect to the new ones (`/admin/members`).

## Hosting it online

You need three things, all of which have free plans:

| What | Service | Why |
| --- | --- | --- |
| The app | **Render** (recommended) or Vercel | Runs the Next.js site and API |
| Database | **TiDB Cloud** (MySQL-compatible) | Your data; the code already supports it |
| File storage | **Supabase Storage** | Keeps uploaded photos and CVs; app hosts wipe their disks |

The hosts deploy from a Git repository, so first push the project to GitHub (or GitLab).

### 1. Database: TiDB Cloud

1. Create a free cluster at tidbcloud.com (the free tier is called Starter or Serverless).
2. Open its **SQL Editor** (or connect with any MySQL client) and run `database.sql`.
3. Click **Connect** and note the host, port (4000), user and password.

### 2. File storage: Supabase

1. Create a project at supabase.com.
2. In **Project Settings → API**, copy the **Project URL** and the **service_role** key. Keep the key secret: it has full access.
3. The app creates the private bucket `shagar-member-documents` the first time someone uploads a file.

### 3. The app

**Render (recommended).** Choose **New → Web Service**, connect the repository, then set:

- Root directory: `web`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: see the list below.

Render has no limit on upload request size, so the membership form's three photos (up to 5 MB each) always go through. On the free plan the site goes to sleep after 15 minutes without visitors, and the next visit takes about a minute to wake it. The paid Starter plan keeps it awake.

**Vercel.** Choose **Add New → Project**, import the repository, set the root directory to `web`, and add the same environment variables. Vercel limits each request to **4.5 MB**, though, so a membership application with large phone photos, or a CV close to 5 MB, will fail there. Only choose Vercel if that's acceptable, or after adding image compression to the forms.

**Environment variables** (on either host):

```
DB_HOST=<TiDB host>
DB_PORT=4000
DB_USER=<TiDB user>
DB_PASSWORD=<TiDB password>
DB_NAME=shagar_chamber
SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service_role key>
```

Leave out `DB_SSL`, because TiDB needs the encrypted connection that is on by default.

### 4. First admin

On your computer, set `.env.local` to the **TiDB** values and run `npm run create-admin`. It creates the admin directly in the online database.

### 5. Your own domain

In the host's dashboard, open **Settings → Custom Domains**, add the domain, and create the DNS record it shows you at your domain registrar. HTTPS is set up automatically.
