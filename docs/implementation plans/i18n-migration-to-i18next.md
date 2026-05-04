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
- [ ] Install `i18next`, `react-i18next`, `i18next-http-backend`

**Concepts to know:**
- What each package does (i18next = core engine, react-i18next = React bindings, i18next-http-backend = lazy-loads JSON files over HTTP)

### Task 1.2 — Split en.json and ar.json into namespace files
- [ ] Create folder structure: `public/locales/en/` and `public/locales/ar/`
- [ ] Extract these namespace files from the monolithic JSONs:

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
- [ ] Create `src/lib/i18n.ts` with i18next initialization
- [ ] Configure: `i18next-http-backend` to load from `/locales/{{lng}}/{{ns}}.json`
- [ ] Set default namespace to `common`, always-loaded namespaces to `['common', 'sidebar', 'header']`
- [ ] Set fallback language to `en`
- [ ] Restore saved language from `localStorage`
- [ ] Keep interpolation and `Intl.PluralRules` working

**Concepts to know:**
- i18next `init()` config options: `lng`, `fallbackLng`, `ns`, `defaultNS`, `backend.loadPath`
- How `i18next-http-backend` fetches namespace files on demand
- `react-i18next` Suspense integration (shows fallback while loading)

### Task 1.4 — Create useLocalization compatibility hook
- [ ] Rewrite `src/hooks/useLocalization.ts` to wrap `useTranslation` from react-i18next
- [ ] Keep the same API: `{ t, language, setLanguage, dir }`
- [ ] `setLanguage` calls `i18next.changeLanguage()` + updates `localStorage` + sets `document.documentElement.dir` and `lang`

**Concepts to know:**
- `useTranslation()` hook from react-i18next
- `i18next.changeLanguage()` method
- Why a compatibility wrapper lets us migrate page-by-page without changing every component at once

---

## Phase 2: Migrate Donor Pages (priority)

### Task 2.1 — Wire up donor namespaces in DonorManagement.tsx
- [ ] Add `useTranslation(['common', 'donors', 'individual_donors'])` to DonorManagement
- [ ] Update `t()` calls: keys like `t('donors.hubTitle')` stay the same if defaultNS is handled, or become `t('hubTitle', { ns: 'donors' })` — pick consistent pattern
- [ ] Test: language switch, all tabs render correctly, RTL layout works

**Concepts to know:**
- How `useTranslation` accepts a namespace array
- Namespace-prefixed keys: `t('donors:hubTitle')` vs `t('hubTitle', { ns: 'donors' })`
- How react-i18next suspends while a namespace loads

### Task 2.2 — Migrate DonorManagement sub-components (donors/ folder)
- [ ] Update these files to use react-i18next:
  - `donors/DashboardControls.tsx`
  - `donors/KanbanBoard.tsx`, `KanbanCard.tsx`, `KanbanColumn.tsx`
  - `donors/AddDonorModal.tsx`
  - `donors/AiActionModal.tsx`
- [ ] Each uses `useTranslation(['common', 'donors'])` or inherits from parent

**Concepts to know:**
- Child components can call `useTranslation()` with their needed namespaces — i18next deduplicates and caches

### Task 2.3 — Migrate individual donor sub-components (donors_individual/ folder)
- [ ] Update these files:
  - `DonorsTable.tsx`, `DonorCard.tsx`, `DonorDetailView.tsx`
  - `AddDonorModal.tsx`, `LogInteractionModal.tsx`, `SendEmailModal.tsx`
  - `AdvancedFilterPanel.tsx`, `DonorBadges.tsx`, `DonorsControls.tsx`
- [ ] Each uses `useTranslation(['common', 'individual_donors'])`

### Task 2.4 — Migrate InstitutionalDonors.tsx and sub-components
- [ ] Update `InstitutionalDonors.tsx` → `useTranslation(['common', 'institutional_donors', 'donors'])`
- [ ] Update sub-components in `donors_institutional/`:
  - `InstitutionalDonorsTable.tsx`, `InstitutionalDonorCard.tsx`, `InstitutionalDonorDetailView.tsx`
  - `AddInstitutionModal.tsx`, `AddContactModal.tsx`
  - `AdvancedFilterPanelInstitutional.tsx`, `InstitutionalDonorsControls.tsx`
  - `InstitutionalDonorsMap.tsx`, `PartnershipOpportunitiesTab.tsx`
  - `ContactsTab.tsx`, `DocumentsTab.tsx`, `GrantsTab.tsx`
- [ ] Test: all institutional donor views, detail tabs, modals, RTL

### Task 2.5 — Verify donor pages end-to-end
- [ ] Both donor routes load correctly with lazy-loaded namespaces
- [ ] Language switching works (EN ↔ AR) without full page reload
- [ ] RTL flips correctly on all donor views
- [ ] No console errors about missing translation keys
- [ ] Network tab shows only donor namespace files loaded (not all namespaces)

---

## Phase 3: Migrate layout components (sidebar, header)

### Task 3.1 — Migrate Sidebar and Header
- [ ] Update `Sidebar.tsx` → `useTranslation(['sidebar'])`
- [ ] Update `Header.tsx` → `useTranslation(['common', 'header'])`
- [ ] Language switcher in header uses `i18next.changeLanguage()`

---

## Phase 4: Migrate remaining pages (one by one)

### Task 4.1 — Dashboard
- [ ] Migrate `Dashboard.tsx` and sub-components → `useTranslation(['common', 'dashboard'])`

### Task 4.2 — Beneficiaries
- [ ] Migrate `BeneficiariesModule.tsx` and sub-components

### Task 4.3 — Projects
- [ ] Migrate project pages

### Task 4.4 — Bousala
- [ ] Migrate bousala pages

### Task 4.5 — Leadership / Stakeholders / Settings
- [ ] Migrate remaining modules

### Task 4.6 — Remove old system
- [ ] Delete old `locales/en.json` and `locales/ar.json` from `src/lib/locales/`
- [ ] Remove translation logic from `DashboardContext.tsx` (keep theme/sidebar/role)
- [ ] Remove `translationsCache` and the `fetch` calls
- [ ] Clean up any unused imports

---

## Phase 5: Polish

### Task 5.1 — Type-safe keys (optional but recommended)
- [ ] Generate TypeScript types from namespace JSON files
- [ ] Configure `react-i18next` module augmentation for autocomplete

### Task 5.2 — Add missing translation script
- [ ] Create a script that compares EN and AR namespace files and reports missing keys
