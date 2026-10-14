# Shagar Chamber

Website and admin panel for the Shagar Chamber: membership registration, news,
events, expos, opportunities and job applications, partnerships, contact
messages and revenue tracking.

## Stack

- **backend/**: Node.js + Express 5 API. It also serves the website from `frontend/`.
- **frontend/**: plain HTML, CSS and JavaScript. The public site is `index.html`
  and the admin pages are `admin-*.html`.
- **Database**: MySQL. That's XAMPP's MariaDB locally and TiDB Cloud online. The
  schema is in `database.sql`.
- **Uploads**: national ID scans, payment receipts and CVs are saved in
  `backend/uploads/`. If Supabase is configured, they're also copied to a private
  Supabase Storage bucket so they survive host restarts.

## Getting started

See [HOW-TO-RUN.txt](HOW-TO-RUN.txt) for the full steps. In short:

```bash
# 1. Import database.sql (phpMyAdmin -> Import)
cd backend
cp .env.example .env       # 2. set SESSION_SECRET (and DB settings if not XAMPP)
npm install
node create-admin.js       # 3. create your admin login
npm start                  # 4. open http://localhost:5000
```

## Configuration (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Required. A long random string used to sign login cookies. |
| `PORT` | Port to listen on (default 5000). |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database connection. |
| `DB_SSL` | Set to `false` for local XAMPP. Leave it unset for TiDB Cloud, which needs TLS. |
| `CORS_ORIGINS` | Other websites allowed to call the API, comma separated. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` | Optional permanent storage for uploads. |
| `NODE_ENV` | Set to `production` online so login cookies are sent over HTTPS only. |

## Admin accounts

Admins are created or reset with `node create-admin.js` in `backend/`. Running it
with an existing email gives that admin a new password. Admin login sessions are
stored in the database (`sessions` table, created automatically) and last 2 hours.

## Sensitive data

`backend/uploads/` holds real people's ID documents and CVs. It's listed in
`.gitignore`. Don't copy it into zips, backups or chats you share.
