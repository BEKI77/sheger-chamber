# Shagar Chamber

Website and admin panel for the Shagar Chamber: membership registration, news,
events, expos, opportunities and job applications, partnerships, contact
messages and revenue tracking.

## Stack

- **web/**: a Next.js app with the public pages, the admin panel and the API
  (`web/app/api`). See [web/README.md](web/README.md) for running and hosting it.
- **Database**: Supabase Postgres, through Drizzle ORM (`web/db/schema.js`).
  `npm run db:push` creates the tables.
- **Uploads**: national ID scans, payment receipts and CVs are kept in a private
  Supabase Storage bucket.

## Getting started

See [HOW-TO-RUN.txt](HOW-TO-RUN.txt) for local setup and [web/README.md](web/README.md)
for hosting. In short:

```bash
cd web
cp .env.example .env.local   # 1. fill in your Supabase settings
npm install
npm run db:push              # 2. create the tables
npm run create-admin         # 3. create your admin login
npm run dev                  # 4. open http://localhost:3000
```

## Admin accounts

Admins are created or reset with `npm run create-admin` in `web/`. Running it with an
existing email gives that admin a new password. Admin logins are stored in the database
(`admin_sessions` table) and last 2 hours.

## Sensitive data

The Supabase bucket, and any local copies in `web/uploads/`, hold real people's ID
documents and CVs. `web/uploads/` is in `.gitignore`. Never commit `web/.env.local`. Don't copy it into zips, backups or chats you share.
