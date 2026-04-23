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
| Bousala | In Progress | Added bousala locale namespace (ar/en/tr) and localized remaining mixed-English labels in active page | 2026-04-23 |
| Help & Support | Done | Added missing `help.*` locale keys (ar/en/tr) and removed hardcoded English toast/video unit labels | 2026-04-23 |
| Donor Management | In Progress | Replaced hardcoded listening/voice-search labels with locale-backed keys in donor controls + stakeholder search | 2026-04-23 |

### Status Legend
- `Pending`: Not started.
- `In Progress`: Currently being localized.
- `Done`: Localization completed and verified.
