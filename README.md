# Developer Portfolio + Admin CMS

A minimalist, high-contrast (black / white / red) developer portfolio backed by a fully
authenticated admin dashboard. Every section of the public site — hero, projects, skills,
experience, contact — is rendered from MySQL and editable through `/admin`.

## Stack

- **Next.js 14** (Pages Router)
- **MySQL** + **Drizzle ORM**
- **NextAuth.js** (Credentials provider, JWT sessions)
- **Tailwind CSS** + **Framer Motion**
- **React Query** for admin data fetching/mutations
- **React Hook Form** + **Zod** for validated forms (client and server)
- **bcryptjs** for password hashing

## Design language

Strict palette: white `#FFFFFF`, black `#0A0A0A`, red `#E53E3E` (accent), with `#FF2E93`
reserved for rare high-emphasis hover states. Typography is Inter (UI/body) paired with a
monospace face (Geist Mono, falls back to system monospace) for labels, tags, and timestamps —
a nod to the terminal/code aesthetic.

**Theme & Dark Mode:** A dynamic dark mode toggler is built directly into the navigation header. Selecting it flips the color variables (`ink` and `paper`) seamlessly, automatically reversing the foreground, background, borders, and interactive elements.

**Signature element:** tech tags and status pills are styled as *git-diff markers*
(`+tag` / `-tag`) instead of generic rounded pills — a small detail that ties the UI language
directly to the subject (a developer's day-to-day tool).

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

- `DB_HOST` — Database host (e.g. `127.0.0.1` or `localhost`)
- `DB_PORT` — Database port (default: `3306`)
- `DB_USER` — Database user (e.g. `root`)
- `DB_PASSWORD` — Database password
- `DB_NAME` — Database name (e.g. `portfolio`)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` in development
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — used once by the seed script to create your
  first admin login. **Change the password immediately after first login** (there is no
  in-app password-change flow yet — update it directly in the `users` table with a new
  bcrypt hash, or re-run the seed against a fresh database).

### 3. Create the database

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Push the schema

```bash
npm run db:push
```

This uses `drizzle-kit push` to create the six tables (`users`, `profile`, `skills`,
`projects`, `experience`, `messages`) directly from `lib/db/schema.js`. Use
`npm run db:generate` instead if you'd rather produce versioned SQL migration files.

### 5. Seed initial content (optional but recommended)

```bash
npm run db:seed
```

Creates your admin user plus sample profile, skills, projects, and experience rows so the
site isn't empty on first run.

### 6. Run the dev server

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Project structure

```
lib/db/schema.js       Drizzle table definitions (all 6 tables)
lib/db/index.js        mysql2 pool + drizzle client
lib/auth.js            NextAuth config (Credentials provider)
lib/requireAdmin.js    API route guard (401s without a session)
lib/validations.js     Zod schemas shared by API routes and forms
middleware.js          Edge-level redirect guard for /admin/*

pages/index.js               Public homepage (getStaticProps + revalidate)
pages/projects/[slug].js     Project case-study page (Markdown content)
pages/admin/*                Admin dashboard (client-guarded via AdminGuard)
pages/api/*                  Public + admin-protected REST endpoints
```

## Security notes

- Admin routes are guarded three ways: edge `middleware.js` (redirect), a client-side
  `AdminGuard` component (UX), and `requireAdmin()` on every mutating API route (the actual
  enforcement layer — never trust the client).
- Passwords are hashed with bcrypt (cost factor 10). Never store plaintext credentials.
- The contact endpoint has basic honeypot + in-memory rate limiting. For production traffic,
  swap the in-memory limiter for Redis-backed limiting if you deploy across multiple
  instances.
- All write endpoints validate input with Zod before touching the database.

## Deployment

Any Node-hosting platform that supports Next.js SSR/ISR works (Vercel, Render, a VPS behind
nginx, etc.). Make sure database environment variables (`DB_HOST`, `DB_PORT`, etc.) point to a reachable MySQL instance and that
`NEXTAUTH_URL` matches your production domain exactly (including protocol).
