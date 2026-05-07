# Donor Profile Page

## MVP Rule

We are building the MVP. If something is useful but not central, and adding it later will be additive, postpone it.

Build it now only when one of these is true:
- It is a central component of the donor profile experience.
- Leaving it out would make the MVP feel broken or misleading.
- Adding it later would force us to break old code, rewrite data contracts, or migrate around a bad shortcut.

Even if a feature is important, postpone it when it can be added later without breaking existing code. The goal is a simple MVP with the right foundation, not a crowded first version.

---

## Shared Constants

Status, tier, pipeline stage, interaction types, and task types are defined once in `packages/shared/src/constants/donorOptions.ts`. Frontend dropdowns and backend Zod schemas both import from `@gms/shared`.

```ts
export const DONOR_STATUSES = ['Active', 'Lapsed', 'On Hold', 'Deceased', 'Disqualified'] as const;
export const DONOR_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Major Donor'] as const;
export const PIPELINE_STAGES = ['prospect', 'researching', 'contacted', 'cultivating', 'solicitation', 'pledged', 'stewardship'] as const;
export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'note', 'event'] as const;
export const TASK_TYPES = ['Follow-up', 'Call', 'Email', 'Meeting', 'Review', 'Other'] as const;
```

Hardcoded for MVP. Per-org customization is post-MVP — the constant file is the seam we'd replace later.

---

## Header

Avatar, name, location, badges (tier, status, pipeline stage, relationship health), and tags.

**Data source:** `GET /donors/:id` — already implemented.

**Edit mode:** Full name (en/ar), country, assigned manager, status, tier, tags. Saves via `PATCH /donors/:id` — already implemented.

**Deferred:** Avatar upload (URL field works for MVP), manager dropdown from org users (free text for MVP).

---

## Pipeline Stage

Current stage in the donor cultivation pipeline. Appears in overview KPI, giving tab, and kanban view.

**Data source:** `individual_donors.custom_fields.pipeline_stage`. Single field, read by all three views. Kanban drag updates the same field.

---

## Finance

Donation totals, averages, and giving trends. Read-only on the profile — actual entry happens on the financials page (not yet built).

**Data source:** Profile-summary endpoint assembles stats from the `donations` table. No extra backend work needed — when the financials page is built, the profile reads from the same source.

---

## Tasks

Manual CRUD. User creates a task (type, due date, description), marks it complete. No automation.

**Data source:** `GET /donors/:id/tasks`. Full list lives in the Relationship/Activity tab. Backend: `donor_tasks` table, standard CRUD endpoints.

## Task Summary

Overview shows a small task summary only:
- Open task count and up to a few open tasks when any exist.
- "All tasks complete" when tasks exist but none are open.
- Empty state when there are no tasks.

Full task CRUD lives only in the Relationship/Activity tab. No separate derived action contract.

## Log Interaction

Manual CRUD. Fundraiser logs an interaction (type, date, summary) after it happens. Full list lives in the Relationship/Activity tab. Feeds into engagement plan (last contact) and overview recent activity.

**Data source:** `donor_interactions` table, `GET/POST /donors/:id/interactions`. Interaction types come from shared constants.

## Send Email

Modal opens but all fields are disabled with a "Coming Soon" overlay. No backend work — the modal is a placeholder so users know the feature exists.

**Deferred:** Full email sending, email/calendar integration.

---

## Pipeline & Ask

Pipeline stage is a manual dropdown (see Pipeline Stage section above). Ask amount is a manually entered number — what the fundraiser plans to request from this donor.

**Data source:** Both stored on the donor record in `custom_fields`. Read/write via existing `GET/PATCH /donors/:id`.

---

## Documents

File uploads attached to a donor. User uploads a document (PDF, image, letter, tax receipt) with a label. Flat list — no folders or versioning.

**Data source:** `donor_documents` table (donor_id, filename, file_url, label, uploaded_at). `GET/POST /donors/:id/documents`. For MVP, files stored locally on the server filesystem. The table stores the path.

**Deferred:** Persistent object storage (S3 or equivalent — not yet decided), categories/folders, inline preview, versioning, OCR/search.

---

## Tabs

_Detailed sections for each tab will be added as we get to them._

---

## Build Tracker

**Shared Constants**
- [x] Create `@gms/shared` constants file
- [x] Wire profile dropdowns and backend schemas to shared constants

**Header**
- [x] Display real data from `GET /donors/:id`
- [x] Edit mode saves via `PATCH /donors/:id`

**Pipeline Stage**
- [ ] All views read from `custom_fields.pipeline_stage`

**Finance**
- [x] Profile reads donation stats from summary endpoint

**Tasks**
- [x] `donor_tasks` table + CRUD endpoints
- [x] Wire relationship tab to full task list
- [x] Wire overview task summary to the task list

**Log Interaction**
- [x] `donor_interactions` table + CRUD endpoints (`GET/POST /donors/:id/interactions`)
- [x] Feed into engagement plan (last contact) and overview recent activity

**Send Email**
- [x] Disabled modal with "Coming Soon" overlay (no backend)

**Documents**
- [x] `donor_documents` table + CRUD endpoints (`GET/POST/DELETE /donors/:id/documents`)
- [x] Local filesystem storage for MVP

**Pipeline & Ask**
- [x] Add `ask_amount` to `custom_fields`, read/write via existing `PATCH /donors/:id`
