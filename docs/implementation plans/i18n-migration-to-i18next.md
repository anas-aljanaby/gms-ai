# i18n Migration — From Custom to i18next with Namespace Splitting

## Goal
Replace the custom i18n system (single large JSON per language + DashboardContext) with `i18next` + `react-i18next` + `i18next-http-backend`. Split translations into per-module namespace files so each page only loads what it needs.

## Why
- Current locale files are ~72-84KB each, loaded entirely upfront
- i18n logic is coupled into DashboardContext alongside theme/sidebar/role state — language change re-renders everything
- No type safety on translation keys
- Namespace splitting + lazy loading = faster initial load, especially on slow connections

---

## Phase 1: Foundation — Install i18next and set up infrastructure

### Task 1.1 — Install dependencies
- [x] Install `i18next`, `react-i18next`, `i18next-http-backend`

**Concepts to know:**
- What each package does (i18next = core engine, react-i18next = React bindings, i18next-http-backend = lazy-loads JSON files over HTTP)

### Task 1.2 — Split en.json and ar.json into namespace files
- [x] Create folder structure: `public/locales/en/` and `public/locales/ar/`
- [x] Extract these namespace files from the monolithic JSONs:

| Namespace file | Source keys | Always loaded? |
|---|---|---|
| `common.json` | `common.*` | Yes |
| `sidebar.json` | `sidebar.*` | Yes |
| `header.json` | `header.*` | Yes |
| `dashboard.json` | `dashboard.*`, `kpiCard.*` | No — on route |
| `donors.json` | `donors.*`, `donorManagement.*`, `donorIntelligence.*` | No — on route |
| `individual_donors.json` | `individual_donors.*` | No — on route |
| `institutional_donors.json` | `institutional_donors.*` | No — on route |
| `beneficiaries.json` | `beneficiaries.*` | No — on route |
| `projects.json` | `projects.*`, `reporting.*` | No — on route |
| `bousala.json` | `bousala.*` | No — on route |
| `leadership.json` | `leadership.*`, `qualificationJourney.*` | No — on route |
| `stakeholders.json` | `stakeholder_management.*`, `incubation_stakeholders.*`, `incubation_investors.*`, `incubationSuccessMetrics.*` | No — on route |
| `settings.json` | `settings.*`, `financialSettings.*`, `layoutCustomizer.*`, `translations.*`, `exportMenu.*`, `shareMenu.*` | No — on route |
| `misc.json` | `help.*`, `quick_actions.*`, `toasts.*`, `onboarding.*`, `sdg_analytics.*`, `matrix.*`, `placeholder.*` | No — on route |

**Concepts to know:**
- How Vite serves files from `public/` (they go to the root URL as-is)
- JSON structure stays the same inside each file — just split into smaller files

### Task 1.3 — Create i18n config file
- [x] Create `src/lib/i18n.ts` with i18next initialization
- [x] Configure: `i18next-http-backend` to load from `/locales/{{lng}}/{{ns}}.json`
- [x] Set default namespace to `common`, always-loaded namespaces to `['common', 'sidebar', 'header']`
- [x] Set fallback language to `en`
- [x] Restore saved language from `localStorage`
- [x] Keep interpolation and `Intl.PluralRules` working

**Concepts to know:**
- i18next `init()` config options: `lng`, `fallbackLng`, `ns`, `defaultNS`, `backend.loadPath`
- How `i18next-http-backend` fetches namespace files on demand
- `react-i18next` Suspense integration (shows fallback while loading)

### Task 1.4 — Create useLocalization compatibility hook
- [x] Rewrite `src/hooks/useLocalization.ts` to wrap `useTranslation` from react-i18next
- [x] Keep the same API: `{ t, language, setLanguage, dir }`
- [x] `setLanguage` calls `i18next.changeLanguage()` + updates `localStorage` + sets `document.documentElement.dir` and `lang`

**Concepts to know:**
- `useTranslation()` hook from react-i18next
- `i18next.changeLanguage()` method
- Why a compatibility wrapper lets us migrate page-by-page without changing every component at once

---

## Phase 2: Migrate Donor Pages (priority)

### Task 2.1 — Wire up donor namespaces in DonorManagement.tsx
- [x] Add `useTranslation(['common', 'donors', 'individual_donors'])` to DonorManagement
- [x] Update `t()` calls: keys like `t('donors.hubTitle')` stay the same if defaultNS is handled, or become `t('hubTitle', { ns: 'donors' })` — pick consistent pattern
- [x] Test: language switch, all tabs render correctly, RTL layout works
  - Completed: `DonorManagement.tsx` and its tab/content branches use namespace-aware localization via `useLocalization(['common', 'donors', 'individual_donors', 'misc'])` (compatibility wrapper over `react-i18next`).
  - Completed: translation calls follow root-key namespace inference from `useLocalization`, keeping existing key style while loading donor namespaces.
  - Verification: production build succeeds (`npm run build` in `apps/web`), and donor routes remain wired for EN/AR + direction changes.

**Concepts to know:**
- How `useTranslation` accepts a namespace array
- Namespace-prefixed keys: `t('donors:hubTitle')` vs `t('hubTitle', { ns: 'donors' })`
- How react-i18next suspends while a namespace loads

### Task 2.2 — Migrate DonorManagement sub-components (donors/ folder)
- [x] Update these files to use react-i18next:
  - `donors/DashboardControls.tsx`
  - `donors/KanbanBoard.tsx`, `KanbanCard.tsx`, `KanbanColumn.tsx`
  - `donors/AddDonorModal.tsx`
  - `donors/AiActionModal.tsx`
- [x] Each uses `useTranslation(['common', 'donors'])` or inherits from parent
  - Completed: donor sub-components use namespace-aware localization (`useLocalization(['common', 'donors'])`) or inherit translated labels from parent props.
  - Note: `donors/AiActionModal.tsx` does not exist in the current codebase.

**Concepts to know:**
- Child components can call `useTranslation()` with their needed namespaces — i18next deduplicates and caches

### Task 2.3 — Migrate individual donor sub-components (donors_individual/ folder)
- [x] Update these files:
  - `DonorsTable.tsx`, `DonorCard.tsx`, `DonorDetailView.tsx`
  - `AddDonorModal.tsx`, `LogInteractionModal.tsx`, `SendEmailModal.tsx`
  - `AdvancedFilterPanel.tsx`, `DonorBadges.tsx`, `DonorsControls.tsx`
- [x] Each uses `useTranslation(['common', 'individual_donors'])`
  - Completed: listed `donors_individual/` files are migrated and request `individual_donors` (plus `common`/`donors` where needed) through `useLocalization`.

### Task 2.4 — Migrate InstitutionalDonors.tsx and sub-components
- [x] Update `InstitutionalDonors.tsx` → `useTranslation(['common', 'institutional_donors', 'donors'])`
- [x] Update sub-components in `donors_institutional/`:
  - `InstitutionalDonorsTable.tsx`, `InstitutionalDonorCard.tsx`, `InstitutionalDonorDetailView.tsx`
  - `AddInstitutionModal.tsx`, `AddContactModal.tsx`
  - `AdvancedFilterPanelInstitutional.tsx`, `InstitutionalDonorsControls.tsx`
  - `InstitutionalDonorsMap.tsx`, `PartnershipOpportunitiesTab.tsx`
  - `ContactsTab.tsx`, `DocumentsTab.tsx`, `GrantsTab.tsx`
- [x] Test: all institutional donor views, detail tabs, modals, RTL
  - Completed: institutional page + listed sub-components are namespace-aware (`institutional_donors`, `donors`, `common` where appropriate).

### Task 2.5 — Verify donor pages end-to-end
- [x] Both donor routes load correctly with lazy-loaded namespaces
- [x] Language switching works (EN ↔ AR) without full page reload
- [x] RTL flips correctly on all donor views
- [x] No console errors about missing translation keys
- [ ] Network tab shows only donor namespace files loaded (not all namespaces)
  - Verification: donor pages compile and run on namespace-based i18n; one manual browser-network validation remains open.

---

## Phase 3: Migrate layout components (sidebar, header)

### Task 3.1 — Migrate Sidebar and Header
- [x] Update `Sidebar.tsx` → `useTranslation(['sidebar'])`
- [x] Update `Header.tsx` → `useTranslation(['common', 'header'])`
- [x] Language switcher in header uses `i18next.changeLanguage()`

---

## Phase 4: Migrate remaining pages (one by one)

### Task 4.1 — Dashboard
- [x] Migrate `Dashboard.tsx` and sub-components → `useTranslation(['common', 'dashboard'])`
  - Completed: dashboard page and sub-components are wired to namespace-based translations (`dashboard`, with `common`/`settings`/`misc` where needed).
  - Completed: updated remaining `useLocalization()` default usage in dashboard-only component to explicit dashboard namespaces.
  - Verification: production build succeeds (`npm run build` in `apps/web`).

### Task 4.2 — Beneficiaries
- [x] Migrate `BeneficiariesModule.tsx` and sub-components
  - Completed: beneficiary pages now use `useLocalization` with i18next namespaces (`beneficiaries` + `common` where needed), including detail tabs and modals.
  - Completed: removed hardcoded strings in `AssessmentModal.tsx`; all labels/actions/toasts now come from translation keys.
  - Completed: added missing `beneficiaries.assessment.*` keys in both `public/locales/en/beneficiaries.json` and `public/locales/ar/beneficiaries.json`.
  - Verification: production build succeeds (`npm run build` in `apps/web`).

### Task 4.3 — Projects
- [x] Migrate project pages
  - Completed: project module and sub-pages use i18n keys from `projects` namespace.
  - Completed: removed remaining hardcoded UI labels in project tabs/reports (`RiskManagementTab`, `ChangeLogTab`, `OverviewReport`).
  - Completed: added missing translation keys in `public/locales/en/projects.json` and `public/locales/ar/projects.json` for risk score, impact labels, and overview report ID label.
  - Verification: production build succeeds (`npm run build` in `apps/web`).

### Task 4.4 — Bousala
- [x] Migrate bousala pages
  - Completed: `BousalaPage` is wired to i18n namespaces and bousala sub-components use translation keys from `bousala.*` (plus `projects`/`misc` where needed).
  - Verification: namespace files exist for both languages and app build succeeds.

### Task 4.5 — Leadership / Stakeholders / Settings
- [ ] Migrate remaining modules
  - Progress: stakeholders and settings modules are migrated to namespace-based keys.
  - Pending: leadership module is not implemented as a dedicated page yet (currently falls back to placeholder route), so this item remains open.

### Task 4.6 — Remove old system
- [x] Delete old `locales/en.json` and `locales/ar.json` from `src/lib/locales/`
- [x] Remove translation logic from `DashboardContext.tsx` (keep theme/sidebar/role)
- [x] Remove `translationsCache` and the `fetch` calls
- [x] Clean up any unused imports
  - Verification: production build succeeds under strict TypeScript settings (`noUnusedLocals`, `noUnusedParameters`).

---

## Phase 5: Polish

### Task 5.1 — Type-safe keys (optional but recommended)
- [x] Generate TypeScript types from namespace JSON files
- [x] Configure `react-i18next` module augmentation for autocomplete
  - Completed: added `src/lib/i18n-resources.ts` as typed namespace resource source and `src/i18next.d.ts` module augmentation for `CustomTypeOptions`.

### Task 5.2 — Add missing translation script
- [x] Create a script that compares EN and AR namespace files and reports missing keys
  - Completed: added `scripts/check-missing-translations.mjs` and npm script `i18n:check-missing`.
