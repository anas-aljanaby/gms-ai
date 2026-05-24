# Page Activation Prompt

You are an AI agent tasked with transforming a placeholder/demo page in the GMS (Global Management System) codebase into a fully working page with real data paths. You will be given a specific page to activate. Follow this process exactly.

---

## Context: What This Codebase Looks Like

This is a bilingual (Arabic/English) non-profit ERP built with:
- **Frontend**: React 19 + Vite + TypeScript, TailwindCSS, TanStack Query, i18next
- **Backend**: Hono (Node.js) + Drizzle ORM + PostgreSQL
- **Shared**: Zod schemas in `packages/shared`
- **API client**: `apps/web/src/lib/api.ts` — a simple class with `get/post/patch/delete` methods
- **Auth**: Supabase Auth (token set on `api` client)

### The Two Worlds

The codebase has two kinds of pages:

**LIVE pages** (the target pattern — copy this):
- Use TanStack Query hooks (`useQuery`, `useMutation`) that call the Hono API via `api.get/post/patch/delete`
- Hooks live in `apps/web/src/hooks/use*.ts`
- API routes live in `apps/api/src/routes/*.ts`
- DB schema in `apps/api/src/db/schema.ts`
- Shared Zod validation in `packages/shared/src/schemas/*.ts`
- Example: Individual Donors module (`useDonors.ts` → `routes/donors.ts` → `individual_donors` table)
- Example: Financials module (`useTransactions.ts` → `routes/financials.ts` → `financial_transactions` table)

**PLACEHOLDER pages** (what you're fixing):
- Import mock data from `apps/web/src/data/*.ts` (e.g., `MOCK_PROJECTS`, `MOCK_STAKEHOLDERS`)
- Use `useState` with hardcoded arrays for data
- Display components are read-only with no edit/save functionality
- Modals open but don't persist anything
- Detail views show static data

### Reference Implementations

Before you start, study these files as the "gold standard" for how a fully activated module works:

**Donor module (most complete):**
- Hook: `apps/web/src/hooks/useDonors.ts` — CRUD with optimistic updates
- Hook: `apps/web/src/hooks/useDonorProfileSummary.ts` — detail view data aggregation
- Route: `apps/api/src/routes/donors.ts` — full REST API with auth middleware
- Schema: `apps/api/src/db/schema.ts` → `individual_donors`, `donations`, `donor_tasks`, `donor_interactions`, `donor_documents`
- Shared: `packages/shared/src/schemas/donor.ts` — Zod validation for create/update
- Frontend: `apps/web/src/components/pages/donors_individual/` — list, detail, tabs, modals all wired up

**Financials module (second reference):**
- Hooks: `apps/web/src/hooks/useTransactions.ts`, `useDonations.ts`, `usePledges.ts`, `useBudgets.ts`, `useDisbursements.ts`, `useFunds.ts`, `useGrants.ts`, `useApprovals.ts`, `useReports.ts`
- Route: `apps/api/src/routes/financials.ts`
- Multiple DB tables in schema.ts

---

## Your Process

You will work on ONE page at a time. The page will be specified when you receive this prompt.

### Phase 0: Audit

Before touching any code, produce a structured audit of the page.

1. **Identify the page entry point** — the top-level component file (e.g., `ProjectManagement.tsx`)
2. **Map the component tree** — list every child component, organized by tab if the page has tabs
3. **For each component, classify every data field** into one of these categories:

| Category | Description | Example |
|----------|-------------|---------|
| **Manual Entry** | User types/selects a value that is stored on this entity | Name, email, status, notes |
| **Computed** | Derived from this entity's own data | Total donations (sum of donations), completion % |
| **Cross-Module Reference** | Data that comes from another module's API | "Linked Projects" on a donor detail, "Donor Name" on a donation record |
| **Static/Config** | System constants, enums, category lists | Status options, country list, SDG goals |
| **Unresolvable Dependency** | Depends on a module that has no API/DB yet | Cannot be activated in this pass |

4. **Identify data sources**: For each component, note whether it currently uses:
   - `import { MOCK_* } from '../../data/*'` — mock data import
   - `useState([...hardcoded...])` — inline fake data
   - `useQuery` / real hook — already live (skip it)
   - Props from parent that trace back to mock data

5. **Check what backend infrastructure exists**:
   - Does a DB table exist in `apps/api/src/db/schema.ts`?
   - Does an API route exist in `apps/api/src/routes/`?
   - Does a TanStack Query hook exist in `apps/web/src/hooks/`?
   - Does a Zod schema exist in `packages/shared/src/schemas/`?

**Output the audit as a structured table before proceeding.**

Example audit output:
```
PAGE: ProjectManagement
ENTRY: apps/web/src/components/pages/ProjectManagement.tsx

BACKEND STATUS:
  - DB table: NO (projects table does not exist in schema.ts)
  - API route: NO
  - Hook: NO
  - Shared schema: NO

TAB: Overview
  COMPONENT: ProjectOverviewTab
    - Project name (en/ar): Manual Entry — currently from prop (mock)
    - Budget total: Computed — sum from cost management sub-object (mock)
    - SDG alignment: Cross-Module Reference — imports MOCK_PROGRAM_DATA
    - Schedule status: Computed — derived from SPI value in mock data
    ACTION NEEDED: All fields read from mock Project object passed as prop

TAB: Cost Management
  COMPONENT: CostManagementTab
    - Financial summary KPIs: Computed — from project.costManagement (mock)
    - Budget line items: Manual Entry — but currently static
    ACTION NEEDED: Needs real budget API or cross-reference to financials module

UNRESOLVABLE:
  - SDG alignment data (no SDG table/API exists)
  - HR tab data (no HR module API exists)
```

### Phase 1: Frontend Pass

Goal: Make the UI fully interactive with proper edit/save patterns, using placeholder data where needed. After this phase, every component should:
- Have working edit buttons for Manual Entry fields
- Show loading/empty states properly
- Have modals that collect real form data (even if they don't persist yet)
- Use `useState` for local editing state with proper save/cancel flows

**Rules for the frontend pass:**

1. **For Manual Entry fields that are currently read-only:**
   - Add edit mode toggle (pencil icon button)
   - Add save/cancel buttons when in edit mode
   - Wire up `useState` for form state
   - Follow the pattern in `apps/web/src/components/pages/beneficiaries/tabs/OverviewTab.tsx` — it has a good edit/save pattern with `isContactEditing` state
   - Follow the pattern in `apps/web/src/components/pages/donors_individual/DonorDetailView.tsx` — the header edit mode pattern

2. **For data tables that show mock arrays:**
   - Keep the mock data for now, but make sure the table accepts data as a prop (not hardcoded inside)
   - Ensure add/edit/delete actions exist in the UI (even if they only update local state)
   - Add proper empty states

3. **For modals (Add/Edit):**
   - Make sure all form fields are wired to state
   - Add proper validation (required fields, formats)
   - The submit handler should call an `onSubmit` prop (don't hardcode persistence)
   - Add loading state to the submit button

4. **For Computed fields:**
   - Leave the computation logic as-is
   - Just make sure it gracefully handles missing/empty data (no crashes on `undefined`)

5. **For Cross-Module References:**
   - Check if the referenced module has a real API. If yes, prepare to use it (add the import, but wrap in a check)
   - If no real API exists, keep the mock reference but add a comment: `// TODO: Replace with real API when {module} is activated`

6. **For Unresolvable Dependencies:**
   - Leave the component as-is
   - Add a clear comment at the top: `// PLACEHOLDER: Depends on {module} which has no backend yet`
   - Do not break existing UI — it should still render with mock data

7. **Translation keys:**
   - Every new user-facing string must use `t()` from `useLocalization`
   - Add translation keys to both `apps/web/public/locales/ar/{namespace}.json` and `apps/web/public/locales/en/{namespace}.json`
   - Never hardcode user-facing strings

8. **Do not:**
   - Add mobile responsiveness (desktop only)
   - Add test files
   - Refactor components that are already working
   - Change the visual design/layout

### Phase 2: Backend Pass

Goal: Create real data persistence for everything that was identified as Manual Entry or Computed in the audit.

**Step 2a: Database schema**

If no table exists for this page's primary entity:

1. Add the table to `apps/api/src/db/schema.ts`
2. Follow the conventions:
   - Every table MUST have `org_id` (FK to `organizations.id`)
   - Every table MUST have `custom_fields jsonb` defaulting to `{}`
   - Every table MUST have `created_at timestamp` defaulting to `now()`
   - Use `uuid` primary keys with `defaultRandom()`
   - Bilingual text fields: `name_en` + `name_ar`
   - Money fields: `numeric(12, 2)` or `numeric(14, 2)` for large amounts
3. Run `npm run db:push` from `apps/api/` to apply the schema

**Step 2b: Shared Zod schemas**

Add create/update Zod schemas in `packages/shared/src/schemas/`:

```typescript
// Example pattern from packages/shared/src/schemas/donor.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name_en: z.string().min(1),
  name_ar: z.string().optional().default(''),
  // ... other required fields
});

export const updateProjectSchema = createProjectSchema.partial();
```

Export from `packages/shared/src/index.ts`.

**Step 2c: API routes**

Create or extend a route file in `apps/api/src/routes/`:

1. Follow the pattern in `apps/api/src/routes/donors.ts`:
   - Use `authMiddleware`
   - Get `org_id` from user's membership
   - Scope ALL queries with `eq(table.org_id, orgId)`
   - Validate request bodies with the Zod schemas from `packages/shared`
   - Return clean JSON (convert `numeric` DB fields to `number`, timestamps to ISO strings)

2. Required endpoints for a typical entity:
   - `GET /` — list all for the org
   - `GET /:id` — get one by ID
   - `POST /` — create
   - `PATCH /:id` — update
   - `DELETE /:id` — delete

3. Register the router in `apps/api/src/routes/` and mount it in the main Hono app.

**Step 2d: Frontend hooks**

Create a TanStack Query hook in `apps/web/src/hooks/`:

Follow the pattern in `useDonors.ts` or `useTransactions.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const QUERY_KEY = ['projects'] as const;

export const useProjects = () => useQuery({
  queryKey: QUERY_KEY,
  queryFn: () => api.get<Project[]>('/projects'),
});

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) => api.post<Project>('/projects', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

// ... update, delete mutations
```

**Step 2e: Wire frontend to backend**

Now replace mock data with real hooks:

1. In the page component, replace `MOCK_*` imports with the new hook:
   ```typescript
   // BEFORE
   import { MOCK_PROJECTS } from '../../data/projectData';
   const [projects] = useState(MOCK_PROJECTS);

   // AFTER
   import { useProjects } from '../../hooks/useProjects';
   const { data: projects = [], isLoading } = useProjects();
   ```

2. In modals, wire `onSubmit` to the mutation:
   ```typescript
   const createMutation = useCreateProject();
   const handleSubmit = (data) => {
     createMutation.mutate(data, { onSuccess: () => setModalOpen(false) });
   };
   ```

3. Add loading states:
   - Show a skeleton/spinner when `isLoading` is true
   - Show empty state when data is `[]`

4. Add error handling:
   - Show a toast on mutation error (use `useToast` hook)
   - Show an error banner when query fails

5. For edit operations in detail views:
   - The save button should call `updateMutation.mutate()`
   - Show saving state on the button
   - Invalidate queries on success

### Phase 3: Verification

After completing both passes:

1. **Build check**: Run `npm run build:web` — must compile with zero errors
2. **Visual check**: Start the dev server (`npm run dev:web`) and manually verify:
   - Page loads without console errors
   - All tabs render
   - Add/edit/delete operations work
   - Empty states show correctly
   - Both Arabic and English work
   - Dark mode doesn't break
3. **Data flow check**: Start the API (`npm run dev:api`) and verify:
   - Creating an entity shows it in the list
   - Editing an entity persists the changes
   - Deleting an entity removes it
   - Refreshing the page still shows the data (it's in the DB, not local state)

---

## Key Principles

1. **Minimal changes, maximum impact.** Don't redesign components. Keep the existing UI, just wire it to real data.

2. **One module at a time.** Don't try to activate cross-module references to modules that don't have backends yet. Mark them and move on.

3. **Match existing patterns exactly.** Don't invent new patterns for API calls, hooks, or state management. Copy what works in the donor module.

4. **Every new DB table needs `org_id` and `custom_fields`.** No exceptions.

5. **Every user-facing string goes through `t()`.** No exceptions.

6. **No half-baked features.** If you can't fully activate a component (because it depends on an unbuilt module), leave it with mock data and a clear TODO comment. Don't ship a broken form that writes to a nonexistent endpoint.

7. **Frontend pass is complete before backend pass starts.** This ensures the UI is clean and all data flows are mapped before you build the persistence layer.

---

## What You Deliver

For each page activation, deliver:

1. **The audit table** (Phase 0 output)
2. **List of files changed** with a one-line summary per file
3. **List of new DB tables** created (if any)
4. **List of new API endpoints** created (if any)
5. **List of TODO items** — things left as placeholder because of unresolvable dependencies
6. **Confirmation that build passes** (`npm run build:web` output)

---

## Pages in the System

Here is the full list of pages/modules, roughly ordered by dependency (activate earlier ones first so later ones can cross-reference):

1. **Individual Donors** — `apps/web/src/components/pages/donors_individual/` — ALREADY LIVE (reference implementation)
2. **Financials** — `apps/web/src/components/pages/financials/` — MOSTLY LIVE (reference implementation)
3. **Beneficiaries** — `apps/web/src/components/pages/beneficiaries/` — partially wired
4. **Projects** — `apps/web/src/components/pages/projects/` — uses `MOCK_PROJECTS`, needs full activation
5. **Institutional Donors** — `apps/web/src/components/pages/donors_institutional/` — uses `MOCK_INSTITUTIONAL_DONORS`
6. **Stakeholders** — `apps/web/src/components/pages/stakeholders/` — uses `MOCK_STAKEHOLDERS`
7. **Bousala (Strategic Compass)** — `apps/web/src/components/pages/bousala/` — mostly local state
8. **Settings** — `apps/web/src/components/pages/settings/` — uses various `MOCK_*` data
9. **Dashboard** — `apps/web/src/components/pages/Dashboard.tsx` — aggregates from all modules, activate last

---

## Activation Command

When you receive this prompt, you will also receive a command like:

```
ACTIVATE: Projects
```

This tells you which page to work on. Follow the full process (Audit → Frontend Pass → Backend Pass → Verification) for that page only.
