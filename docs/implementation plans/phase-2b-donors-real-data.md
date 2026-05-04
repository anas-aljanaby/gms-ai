# Phase 2b — Donors Page: Remove Mock Data, Wire to Real DB

Goal: make the donors page fully data-driven from the database. Seeded org sees data; other orgs see an empty page. No mock data fallbacks.

---

## Context

The donors page has **three tabs**, each with its own data model:

| Tab | Current source | DB table exists? |
|---|---|---|
| **Pipeline** (Kanban) | `MOCK_DONORS` from `mockData.ts` | No |
| **Directory** (table/cards) | `useDonorIntelligenceData` hook → tries API, falls back to `MOCK_INDIVIDUAL_DONORS` | Yes (`individual_donors`) |
| **Analytics** | Same hook as Directory | Yes (derived) |

The Pipeline tab uses a `Donor` type with pipeline-specific fields (`stage`, `potentialGift`, `relationshipHealth`, `tasks[]`). These fields don't exist in the DB yet.

---

## Phase A — Database & Schema

### Task A1: Add pipeline fields to `individual_donors` table
- [ ] Add columns to Drizzle schema: `pipeline_stage`, `potential_gift`, `relationship_health`, `last_contact`
- [ ] Generate and push migration

### Task A2: Create `donor_tasks` table
- [ ] New table: id, org_id, donor_id (FK), text, type, assigned_to, due_date, completed
- [ ] Generate and push migration

### Task A3: Add Zod schemas for pipeline fields
- [ ] Extend donor schemas in `packages/shared` with the new fields
- [ ] Update `createDonorSchema` and `updateDonorSchema`

---

## Phase B — API

### Task B1: Update donor API routes to include new fields
- [ ] GET /donors returns the new pipeline fields
- [ ] POST/PATCH handle the new fields
- [ ] Add GET /donors/:id/tasks and POST /donors/:id/tasks endpoints

---

## Phase C — Seed Script

### Task C1: Update seed script with pipeline data + donations
- [ ] Add pipeline fields (stage, potentialGift, etc.) to seed donors
- [ ] Add donor_tasks seed data
- [ ] Make sure seed creates enough variety to fill all 5 pipeline stages

---

## Phase D — Frontend Wiring

### Task D1: Remove mock data fallback from `useDonorIntelligenceData`
- [ ] Remove `MOCK_INDIVIDUAL_DONORS` and `MOCK_DONATIONS` imports
- [ ] Return empty array (not mock data) when API fails or returns nothing

### Task D2: Create `usePipelineDonors` hook
- [ ] New hook that fetches from GET /donors and maps to the `Donor` type used by Kanban
- [ ] Fetch tasks from GET /donors/:id/tasks

### Task D3: Wire DonorManagement Pipeline tab to real data
- [ ] Replace `MOCK_DONORS` usage with `usePipelineDonors` hook
- [ ] Remove localStorage persistence of mock pipeline data

### Task D4: Wire DonorDetailView to fetch donations from API
- [ ] Replace `MOCK_DONATIONS.filter(...)` with API call to GET /donors/:id/donations

### Task D5: Clean up — delete mock data files
- [ ] Remove `individualDonorsData.ts`, `donationsData.ts`
- [ ] Remove `MOCK_DONORS` from `mockData.ts` (keep `MONTHLY_DONATIONS_DATA` / `DASHBOARD_STATS` if still used elsewhere)
- [ ] Remove unused imports throughout

---

## Phase E — Verification

### Task E1: End-to-end test
- [ ] Run seed script → log in as seeded user → verify Pipeline, Directory, Analytics tabs show data
- [ ] Log in as a different user (different org) → verify empty state on all tabs
