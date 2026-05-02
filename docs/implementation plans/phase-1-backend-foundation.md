# Phase 1 — Backend Foundation

Goal: get a working Hono API server with Supabase, Drizzle, and the core schema. No feature modules yet — just the spine that everything else plugs into.

---

## Tasks

### 1.1 Bootstrap Hono API
- [x] Add Hono + runtime deps to `apps/api/package.json`
- [x] Create `src/index.ts` with a minimal Hono app (health check route)
- [x] Replace the TODO `dev` script with a working `tsx watch` command
- [x] Verify `npm run dev:api` starts without errors

### 1.2 Set up Supabase project
- [x] Create a new Supabase project in the dashboard
- [x] Copy connection strings + anon/service keys into `apps/api/.env` (not committed)
- [x] Add `.env.example` with placeholder keys (committed)
- [x] Add `dotenv` loading to `src/index.ts`

### 1.3 Drizzle config + core schema
- [x] Install Drizzle ORM + Postgres driver in `apps/api`
- [x] Create `src/db/schema.ts` with `organizations` and `memberships` tables
- [x] Create `src/db/index.ts` that exports a connected `db` instance
- [x] Create `drizzle.config.ts` pointing at the Supabase Postgres URL

### 1.4 Extend core schema
- [x] Add `modules` table (per-org module registry with `config jsonb`)
- [x] Add `audit_log` table
- [x] Ensure every domain table pattern has `org_id` + `custom_fields jsonb` documented as convention

### 1.5 Run first migration
- [x] Run `drizzle-kit generate` to produce the SQL migration file
- [x] Run `drizzle-kit migrate` (or push) against the Supabase Postgres instance
- [x] Verify tables appear in the Supabase dashboard

### 1.6 Auth middleware
- [x] Install `@supabase/supabase-js` in `apps/api`
- [x] Create `src/middleware/auth.ts` — verifies the Supabase JWT from the `Authorization` header
- [x] Attach decoded user to Hono context (`c.set('user', ...)`)
- [x] Protect a test route and verify it rejects unauthenticated request

### 1.7 `/me` route
- [x] Create `src/routes/me.ts`
- [x] Query `memberships` to return the current user's organizations
- [x] Register the route in `src/index.ts`
- [x] Test with a real Supabase token (via curl or Hoppscotch)

### 1.8 CORS + error handling
- [x] Add CORS middleware allowing the Vite dev origin
- [x] Add a global error handler that returns `{ error: message }` JSON
- [x] Confirm the frontend can reach `GET /health` from the browser

---

## Phase 2 preview (not starting yet)
Shared Zod schemas in `packages/shared`, then Donors migration.
