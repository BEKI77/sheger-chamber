# Shagar Chamber

Website and admin panel for the Shagar Chamber: membership registration, news,
events, expos, opportunities and job applications, partnerships, contact
messages and revenue tracking.

## Stack

- **web/**: the current app. A Next.js site with the public pages, the admin panel
  and the API (`web/app/api`), using Drizzle ORM for the database.
  See [web/README.md](web/README.md) for running and hosting it.
- **Database**: MySQL. That's XAMPP's MariaDB locally and TiDB Cloud online. The
  schema is in `database.sql`.
- **Uploads**: national ID scans, payment receipts and CVs go to a private Supabase
  Storage bucket when Supabase is configured (needed online), otherwise to `web/uploads/`.

## Getting started

See [HOW-TO-RUN.txt](HOW-TO-RUN.txt) for local setup and [web/README.md](web/README.md)
for hosting. In short:

```bash
# 1. Import database.sql (phpMyAdmin -> Import)
cd web
cp .env.example .env.local   # 2. set your database settings
npm install
npm run create-admin         # 3. create your admin login
npm run dev                  # 4. open http://localhost:3000
```

## Admin accounts

Admins are created or reset with `npm run create-admin` in `web/`. Running it with an
existing email gives that admin a new password. Admin logins are stored in the database
(`admin_sessions` table) and last 2 hours.

## Sensitive data

`web/uploads/` holds real people's ID documents and CVs. It's in `.gitignore`. Don't copy it into zips, backups or chats you share.
