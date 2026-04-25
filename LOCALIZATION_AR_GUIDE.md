# Arabic Localization Guide and Page Tracker

## Goal
Ensure all user-facing text is shown in Arabic, while keeping technical/section identifiers (like page names and main headers) in English when needed.

This project should **never** show raw translation keys in the UI (examples: `dashboard.title`, `quick_actions.title`, `shareMenu.share`).

## Translation Rules

### 1) Translate to Arabic (Required)
Translate any text the end user is expected to read, understand, or act on:
- Button labels and action text
- Form labels, hints, placeholders, validation messages
- Table column labels (when user-facing)
- Empty states, helper text, tooltips, alerts, toasts
- Dialog bodies and confirmation messages
- Menu items that are actions
- Status descriptions and explanatory content

### 2) Keep in English (Allowed)
Keep high-level section/page identifiers in English when they are structural labels:
- Page titles like `Dashboard`
- Major section headers used as module names
- Product or feature names that are intentionally English

Important: even in these cases, we should display clean text (for example `Dashboard`), not a raw key (for example `dashboard.title`).

### 3) Never Display Translation Keys
If a key is missing, do not allow the raw key to appear in UI.

Wrong:
- `dashboard.title`
- `quick_actions.title`
- `shareMenu.share`

Correct fallback behavior:
- Show Arabic default text where possible, or
- Show a safe human-readable label (never key syntax)

## Page-by-Page Workflow
For each page:
1. Find all visible strings.
2. Classify each string:
   - Structural/title text -> English allowed.
   - User-facing content -> Arabic required.
3. Add/fix translation keys and values.
4. Verify no raw keys appear on screen.
5. Mark page status in tracker below.

## QA Checklist Per Page
- [ ] No raw i18n keys visible in UI.
- [ ] User-facing text is Arabic.
- [ ] Structural headers/titles are intentionally English (if kept).
- [ ] Buttons/messages/forms are understandable for Arabic users.
- [ ] No mixed broken text or placeholder artifacts.

## Progress Tracker
Update this table every time a page is completed.

| Page | Status | Notes | Last Update |
|---|---|---|---|
| Dashboard | Done | Added missing locale keys + replaced hardcoded English in dashboard components | 2026-04-23 |
| Quick Actions | Done | Verified Quick Actions/ShareMenu keys and refined Arabic recipients placeholder | 2026-04-23 |
| Bousala | Done | Completed `components/pages/bousala/*` cleanup: removed remaining hardcoded modal/report/chart text, switched `BousalaPage` to shared localization hook (no local key shim), and added missing `bousala.*` keys in `ar/en` including export filenames/sheet labels/validation/chart labels | 2026-04-23 |
| Help & Support | Done | Added missing `help.*` locale keys (ar/en) and removed hardcoded English toast/video unit labels | 2026-04-23 |
| Donor Management | Done | Completed donor locale coverage by adding all missing `donors`, `individual_donors`, and `institutional_donors` keys referenced by donor pages (ar/en), and replaced remaining hardcoded donor modal/AI/toast/accessibility strings with locale-backed values | 2026-04-23 |

### Status Legend
- `Pending`: Not started.
- `In Progress`: Currently being localized.
- `Done`: Localization completed and verified.

## Continuation Plan (Next Workstream)

### Phase 1 - Finish Active Scope (Immediate)
1. Complete `Bousala` localization pass for all remaining dialogs/tabs/modals.
2. Run a key-leak sweep to ensure no `namespace.key` strings render in UI.
3. Mark `Bousala` as `Done` only after Arabic UX QA checklist passes.

### Phase 2 - High Impact User Journeys
Localize the most frequently used operational pages next:
- `Project Management`
- `Beneficiaries`
- `Stakeholders`
- `Settings` (including translation/financial sub-sections)

Execution order for each page:
1. Add missing locale keys in all supported locale files.
2. Replace hardcoded English in components with `t(...)`.
3. Verify Arabic readability and RTL alignment in forms/tables/modals.
4. Confirm no raw keys are visible.
5. Update tracker status + notes.

### Phase 3 - Navigation and Shell Consistency
After page modules, do a shell-wide consistency pass:
- Header / sidebar / mobile sidebar
- Global menus, tooltips, export labels, announcements
- Empty/loading/error states reused across modules

Goal: remove mixed-language artifacts while preserving intentionally English structural labels.

### Phase 4 - Locked Modules Closure
Close currently locked tracks before starting new modules:
1. `Beneficiaries`: complete remaining subviews and release lock only after full QA checklist pass.
2. `Settings`: finish all settings sub-sections (especially translation/financial/COA flows) and release lock after QA.
3. Re-open `Bousala` only for regression fixes if key leak or mixed-language issues are discovered during global QA.

### Immediate Execution Queue (Continue From Here)
Use this exact order to continue work:
1. Finish `Bousala` and update tracker row from `In Progress (Locked)` -> `Done`.
2. Finish `Beneficiaries` and update tracker row from `In Progress (Locked)` -> `Done`.
3. Finish `Settings` and update tracker row from `In Progress (Locked)` -> `Done`.
4. Start `Layout (Header/Sidebar/Mobile Sidebar)` and move from `Pending` -> `In Progress`.

### Definition of Done Per Module (Mandatory)
A module can be marked `Done` only when all checks below pass:
- No visible raw i18n keys in module UI (`foo.bar` style never rendered).
- No hardcoded English in user-facing content (forms, toasts, dialogs, helper text, table labels).
- Arabic copy is readable and context-correct for operational users.
- RTL layout remains stable in dense views (tables, calendars, side panels, modals).
- Tracker row includes a precise note of what was localized and verification outcome.

### Regression Guardrail (Run After Every Module)
After each module completion:
1. Perform a quick in-app sweep in Arabic mode for all touched screens.
2. Search touched files for remaining hardcoded strings that should be localized.
3. Re-check shared components used by the module (tabs, alerts, tooltips, modals).
4. Update tracker immediately (same day) to keep cross-chat continuity accurate.

## Completion Criteria for AR Localization
- Zero visible raw translation keys in the app.
- All user-facing actions/messages/forms are Arabic.
- Intentional English structural labels are consistent and human-readable.
- Arabic mode has correct RTL direction and no clipped or broken UI text.

## Tracker Backlog (To Fill During Execution)
Add rows below as each area starts:

| Page | Status | Notes | Last Update |
|---|---|---|---|
| Project Management | Done | Completed full `components/pages/projects/*` localization sweep: removed hardcoded labels, added missing `projects.*`/related keys across ar/en, and verified no remaining key leaks in project module | 2026-04-23 |
| Beneficiaries | Done | Completed final beneficiary cleanup in `BeneficiariesModule` + `BeneficiaryModule`: replaced remaining hardcoded category labels, voice-search errors, add-success toast, view/advanced-filter placeholders, and select label with `beneficiaries.*` keys; added missing keys to ar/en and verified build passes | 2026-04-23 |
| Stakeholders | Done | Started with explicit lock on `StakeholderManagement` + `components/pages/stakeholders/*`; localized all Stakeholder UI strings, added full `stakeholder_management.*` namespace to ar/en, and replaced remaining hardcoded stakeholder insights with translation-backed values | 2026-04-23 |
| Settings | In Progress (Locked) | LOCKED by current chat while localizing `SettingsPage` + `components/pages/settings/*`; replacing remaining hardcoded settings UI text and adding missing `settings.*` keys across ar/en | 2026-04-23 |
| Layout (Header/Sidebar/Mobile Sidebar) | Pending |  |  |
