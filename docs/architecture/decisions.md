# Architecture Decisions

## Stack

- **Frontend:** React + Vite + TypeScript (existing).
- **Backend:** Node.js + TypeScript.
- **Web framework:** Hono.
- **ORM:** Drizzle.
- **Database:** PostgreSQL.
- **Data layer / BaaS:** Supabase (Postgres + Auth + Storage + RLS).
- **Server-state library (frontend):** TanStack Query (replaces `useCachedData`).
- **Validation:** Zod, shared between frontend and backend.

## Repo

- **Single monorepo.**
- **Tooling:** npm workspaces. No Nx/Turborepo until needed.
- **Layout:**
  ```
  apps/web      # React app (current code moved here)
  apps/api      # Hono backend
  packages/shared  # Zod schemas + types shared by web and api
  ```
- **Drizzle schema lives in `apps/api/src/db/`**, not in `packages/shared`.

## Multi-tenancy

- **Shared database, shared schema.**
- Every domain table has an `org_id` column.
- **Row-Level Security (RLS)** enforces tenant isolation.
- Users belong to organizations via a `memberships(user_id, org_id, role)` table.
- A user can belong to multiple organizations.

## Auth

- **Supabase Auth.** No custom auth.
- Real users replace the current fake `Role` flow.
- Active org is held in frontend context; org switcher in UI for multi-org users.

## Core schema (spine)

- `organizations`
- `memberships`
- `modules` (per-org module registry, with a `config jsonb`)
- `audit_log`

## Custom modules (future-proofing only — not building yet)

- Defer the design.
- v1 must not hardcode anything that blocks it later. Specifically:
  - Sidebar is built from a list returned by the API, **not** from a hardcoded constant.
  - Dashboard widgets are registered, not hardcoded.
  - Routes/permissions are data-driven where reasonable.
  - Every entity gets a `custom_fields jsonb` column reserved from day one.
- The existing `*.config.json` / `*.permissions.json` / `*.routes.json` pattern is the direction; will formalize into a module manifest later.

## AI

- Gemini API calls move **server-side** (Hono route or Supabase Edge Function).
- API key is never in the browser bundle.

## Migration approach

- Migrate **one `useXxxData` hook at a time** from mock/localStorage to the API.
- Pilot module: **Donors**.
- Order after pilot: Beneficiaries → Projects → Stakeholders → Institutional Donors → Bousala → Dashboard last.
- Inactive pages (loans, GRC, GRI, sharia, HR, financials, etc.) stay on mock data until a customer asks.
- Component signatures don't change during migration; only the hook internals do.

## Deployment

- **Frontend:** static host (Netlify / Vercel / Cloudflare Pages).
- **Backend:** Node host (Fly.io / Render / Railway).
- **Database:** Supabase managed.
- **Environments:** staging + production from day one.

## Operational requirements

- `audit_log` populated from day one.
- RLS isolation tested with integration tests (login as org A, assert org B invisible).
- Backups verified by actually restoring.
- Error tracking (Sentry or equivalent).
- Rate limiting on AI endpoints.

## Data residency

- Default: Supabase managed region.
- If a customer requires KSA/UAE residency: self-host Supabase or move to Postgres on a Gulf VPS. Schema and app code remain unchanged.

## Explicit non-goals for v1

- No custom auth.
- No GraphQL.
- No microservices.
- No Nx/Turborepo.
- No `packages/ui`.
- No no-code form designer.
- No migration of inactive pages.
- No schema-per-tenant.
