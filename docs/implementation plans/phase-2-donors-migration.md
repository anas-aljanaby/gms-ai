# Phase 2 — Donors Migration

Goal: migrate the Donors module from mock/localStorage to real API calls. This is the pilot migration — the pattern established here will be reused for all other modules.

---

## Tasks

### 2.1 Shared Zod schemas
- [x] Install Zod in `packages/shared`
- [x] Create `src/schemas/donor.ts` with IndividualDonor, Donation, CreateDonor, UpdateDonor schemas
- [x] Export from `src/index.ts`

### 2.2 Donor database tables
- [x] Add `individual_donors` and `donations` tables to Drizzle schema
- [x] Generate migration with `drizzle-kit generate`
- [x] Push migration to Supabase

### 2.3 Donor API routes
- [x] Create `src/routes/donors.ts` with CRUD endpoints
- [x] GET /donors — list all donors for user's org
- [x] GET /donors/:id — get single donor
- [x] POST /donors — create donor (validated with Zod)
- [x] PATCH /donors/:id — update donor
- [x] DELETE /donors/:id — delete donor
- [x] GET /donors/:id/donations — list donations for a donor
- [x] POST /donors/:id/donations — create donation
- [x] Register route in `src/index.ts`

### 2.4 Frontend API client + TanStack Query
- [x] Install `@tanstack/react-query` in web app
- [x] Create `src/lib/api.ts` — fetch wrapper with auth token
- [x] Add `QueryClientProvider` in `main.tsx`
- [x] Fix Vite dev server port (5173) to avoid conflict with API (3000)

### 2.5 Migrate donor data hooks
- [x] Replace `useDonorIntelligenceData` internals to call `/donors` API
- [x] Keep component signatures unchanged
- [x] Fallback to mock data when API is unavailable (dev convenience)

### 2.5b Auth foundation (prerequisite for API calls)
- [x] Install `@supabase/supabase-js` in web app
- [x] Create `src/lib/supabase.ts` — Supabase client with env vars
- [x] Create `src/contexts/AuthContext.tsx` — auth state, signIn/signUp/signOut
- [x] Create `src/components/pages/LoginPage.tsx` — login/signup form
- [x] Wire AuthProvider into `main.tsx`
- [x] Add auth gate in `App.tsx` — show LoginPage when unauthenticated
- [x] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`
- [x] Create `.env.example` for web app

### 2.6 End-to-end test
- [x] Start API + web dev servers
- [x] Verify frontend can reach `GET /health` through CORS
- [ ] Create a test donor via API
- [ ] Verify donor appears in the UI

---

## Phase 3 preview (not starting yet)
Beneficiaries migration, then Projects.
