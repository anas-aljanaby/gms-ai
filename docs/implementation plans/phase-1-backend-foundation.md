# Phase 1 — Backend Foundation

Goal: get a working Hono API server with Supabase, Drizzle, and the core schema. No feature modules yet — just the spine that everything else plugs into.

---

## Tasks

### 1.1 Bootstrap Hono API
- [ ] Add Hono + runtime deps to `apps/api/package.json`
- [ ] Create `src/index.ts` with a minimal Hono app (health check route)
- [ ] Replace the TODO `dev` script with a working `tsx watch` command
- [ ] Verify `npm run dev:api` starts without errors

### 1.2 Set up Supabase project
- [ ] Create a new Supabase project in the dashboard
- [ ] Copy connection strings + anon/service keys into `apps/api/.env` (not committed)
- [ ] Add `.env.example` with placeholder keys (committed)
- [ ] Add `dotenv` loading to `src/index.ts`

### 1.3 Drizzle config + core schema
- [ ] Install Drizzle ORM + Postgres driver in `apps/api`
- [ ] Create `src/db/schema.ts` with `organizations` and `memberships` tables
- [ ] Create `src/db/index.ts` that exports a connected `db` instance
- [ ] Create `drizzle.config.ts` pointing at the Supabase Postgres URL

### 1.4 Extend core schema
- [ ] Add `modules` table (per-org module registry with `config jsonb`)
- [ ] Add `audit_log` table
- [ ] Ensure every domain table pattern has `org_id` + `custom_fields jsonb` documented as convention

### 1.5 Run first migration
- [ ] Run `drizzle-kit generate` to produce the SQL migration file
- [ ] Run `drizzle-kit migrate` (or push) against the Supabase Postgres instance
- [ ] Verify tables appear in the Supabase dashboard

### 1.6 Auth middleware
- [ ] Install `@supabase/supabase-js` in `apps/api`
- [ ] Create `src/middleware/auth.ts` — verifies the Supabase JWT from the `Authorization` header
- [ ] Attach decoded user to Hono context (`c.set('user', ...)`)
- [ ] Protect a test route and verify it rejects unauthenticated requests

### 1.7 `/me` route
- [ ] Create `src/routes/me.ts`
- [ ] Query `memberships` to return the current user's organizations
- [ ] Register the route in `src/index.ts`
- [ ] Test with a real Supabase token (via curl or Hoppscotch)

### 1.8 CORS + error handling
- [ ] Add CORS middleware allowing the Vite dev origin
- [ ] Add a global error handler that returns `{ error: message }` JSON
- [ ] Confirm the frontend can reach `GET /health` from the browser

---

## Phase 2 preview (not starting yet)
Shared Zod schemas in `packages/shared`, then Donors migration.
