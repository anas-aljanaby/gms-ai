# Institutional Donors — MVP Spec

One-page checklist for Phase 2 backend activation. **Existing UI stays in place**; out-of-scope tabs/views remain visible with mock/local data until Phase 2.5+.

**Goal:** A focused grantmaker CRM — track institutions, relationship stage, ownership, focus alignment, and key deadlines. Not a mini-suite (AI matching, DMS, multi-contact CRM).

**Reference patterns:** Individual Donors (`useDonors.ts`, `routes/donors.ts`, `schemas/donor.ts`).

---

## UI — In / Out / Hidden-behind-mock

| Surface | MVP | Notes |
|---|---|---|
| **List view (table)** | ✅ In | Primary workspace. Search, sort, add, view, delete. |
| **Detail → Overview tab** | ✅ In | Edit/save for fields below. |
| **Add Institution modal** | ✅ In | Wired to `POST /institutional-donors`. |
| **Search** | ✅ In | Name, primary contact, focus areas. |
| **Basic filters** | ✅ In | Type, relationship status, priority (+ optional focus text). Advanced panel OK as-is. |
| **Top KPI strip** | ⚠️ Simplified | Only metrics backed by DB or grants aggregate. Drop fake analytics (+15.2%, 4.8/5). |
| **Card view** | ⏸ Defer wire | Keep UI; same data hook as list when touched. |
| **Map view** | ⏸ Defer wire | Keep UI; mock coords OK until post-MVP. |
| **Partnership Opportunities** | ⏸ Defer wire | Keep UI; `MOCK_PROJECTS` + AI until Projects module live. |
| **Voice search** | ⏸ Defer wire | Keep UI; no backend impact. |
| **Detail → Grants tab** | ⚠️ Phase 2.5 | Read-only from `GET /financials/grants?grantor_id=…` when institution UUID exists. Until then: mock + empty state. |
| **Detail → Contacts tab** | ⏸ Post-MVP | Keep UI; mock local CRUD. MVP stores **primary contact only** on institution row. |
| **Detail → Documents tab** | ⏸ Post-MVP | Keep UI; mock per-donor cache. No Supabase upload in MVP. |
| **Overview → Next Move / Analytics panels** | ⏸ Defer | Placeholder copy; no backend. |

---

## Fields — MVP entity (`institutional_donors`)

### Stored on table (columns)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | auto | PK |
| `org_id` | uuid | yes | Tenant scope |
| `name_en` | text | yes* | *At least one of `name_en` / `name_ar` |
| `name_ar` | text | default `''` | |
| `type` | text | yes | `Foundation` \| `Corporate` \| `Government` \| `Multilateral` |
| `relationship_status` | text | yes | `Cold` \| `Prospect` \| `Cultivating` \| `Active` \| `Stewardship` |
| `priority` | text | yes | `High` \| `Medium` \| `Low` |
| `country` | text | default `''` | Free text / combobox value |
| `city` | text | default `''` | |
| `registration_number` | text | optional | |
| `establishment_date` | timestamp | optional | |
| `phone` | text | optional | |
| `website` | text | optional | |
| `address` | text | optional | |
| `logo` | text | optional | URL; default generated avatar |
| `primary_contact_name` | text | default `''` | |
| `primary_contact_email` | text | default `''` | Validate if non-empty |
| `assigned_manager` | text | default `''` | |
| `focus_areas` | jsonb | default `[]` | string[] |
| `geographic_focus` | jsonb | default `[]` | string[] |
| `next_deadline` | timestamp | optional | Manual entry for MVP |
| `last_contact_date` | timestamp | optional | Manual entry for MVP |
| `total_grants_awarded` | numeric(14,2) | default `0` | Computed cache; updated from grants sync (Phase 2.5) |
| `active_grants_count` | integer | default `0` | Computed cache |
| `custom_fields` | jsonb | default `{}` | Extension + future fields |
| `created_at` | timestamp | auto | |

### Deferred to `custom_fields` or post-MVP (not MVP columns)

- `socialMedia` (linkedin, twitter, facebook)
- `coordinates` (lat/lng)
- `contacts[]` (secondary contacts → future `institutional_donor_contacts` table)
- Documents (future table or reuse donor_documents pattern)
- Interaction/task history (future; mirror individual donor sub-routes if needed)

### Computed (API response / overview, not manual entry in MVP)

| Field | Source (target) |
|---|---|
| `totalGrantsAwarded` | Sum of `grants.received_amount` where `grantor_id` = institution id (Phase 2.5) |
| `activeGrants` | Count grants with status `active` / open installments (Phase 2.5) |
| `nextDeadline` | Min open grant installment due date OR manual `next_deadline` column (MVP: manual) |

---

## API — Endpoints (Phase 2)

Mount at `/institutional-donors` in `apps/api/src/index.ts`. Auth + org scope on every query (copy `donors.ts`).

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/institutional-donors` | List for org. Query: `org_id`, optional `search`, `type`, `status`, `priority`. |
| `GET` | `/institutional-donors/:id` | Single record |
| `POST` | `/institutional-donors` | Create (Zod validate) |
| `PATCH` | `/institutional-donors/:id` | Partial update |
| `DELETE` | `/institutional-donors/:id` | Hard delete MVP (soft-delete later via `custom_fields` if needed) |

**Not in MVP:** sub-routes for contacts, documents, interactions, tasks.

**Cross-module read (Phase 2.5):** reuse existing `GET /financials/grants` filtered client-side or add `grantor_id` query param; link `grants.grantor_id` to institution UUID when creating grants.

---

## Shared schema — `packages/shared`

New file: `schemas/institutionalDonor.ts`

- `institutionTypeSchema`, `grantmakerRelationshipStatusSchema`, `priorityLevelSchema`
- `createInstitutionalDonorSchema` / `updateInstitutionalDonorSchema`
- Export from `packages/shared/src/index.ts`

---

## Frontend hook — `apps/web/src/hooks/useInstitutionalDonors.ts`

Mirror `useDonors.ts`:

| Hook / fn | Purpose |
|---|---|
| `useInstitutionalDonors()` | `useQuery` list |
| `useCreateInstitutionalDonor()` | Optimistic create |
| `useUpdateInstitutionalDonor()` | Patch from overview edit |
| `useDeleteInstitutionalDonor()` | List/detail delete |
| `fetchInstitutionalDonorsList()` | For prefetch |
| `mapApiToInstitutionalDonor()` | API row → `InstitutionalDonor` type |

**Wire in Phase 2e (replace mock):**

- `InstitutionalDonors.tsx` — replace `MOCK_INSTITUTIONAL_DONORS` + local persist
- `AddInstitutionModal` — `onAdd` → mutation
- `DetailOverviewTabInstitutional` — save → `PATCH`
- List delete → `DELETE`

**Leave on mock for now:** Grants, Contacts, Documents, Opportunities, Map, voice, card-specific logic.

---

## Seed data

- Add `institutionalDonorsSeed.ts` (or extend seed) with 5–8 realistic Gulf/international funders
- Align a subset of `grants.grantor_id` / `funds.institutional_donor_id` to seeded UUIDs (Phase 2.5)

---

## Verification checklist (Phase 2 done)

- [ ] `npm run build:web` — zero errors
- [ ] `db:push` + `seed` — institutions appear for demo org
- [ ] List loads from API; refresh persists
- [ ] Create institution → appears in list (EN + AR names)
- [ ] Edit overview fields → survives refresh
- [ ] Delete institution → removed from list
- [ ] Arabic/English labels; RTL layout OK on list + detail
- [ ] Out-of-scope tabs still render (mock) without errors

---

## Phase roadmap (after MVP)

| Phase | Scope |
|---|---|
| **2 — MVP (this spec)** | Table + CRUD + overview edit + list filters |
| **2.5** | Grants tab ← `/financials/grants`; computed totals/deadlines |
| **3** | Contacts table + Documents upload |
| **4** | Partnership Opportunities ← Projects API + AI (optional) |
| **5** | Map (real geocoding), card view polish, voice search |

---

## Explicit non-goals (MVP)

- AI grant matching or draft proposals
- Full document management (folders, categories, storage)
- Secondary contacts with permissions matrix
- Mobile layouts
- Automated relationship health scoring
- Integration with Bousala compass (post-dashboard activation)
