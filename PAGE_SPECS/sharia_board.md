# Page Spec — Sharia Board Management

**Page:** `apps/web/src/components/pages/ShariaBoardManagementPage.tsx` + `apps/web/src/components/pages/sharia_board/*`
**Sidebar key:** `sharia_board`
**Related module (not absorbed):** `sharia_compliance` (`ShariaCompliancePage.tsx`) — overlaps the current Portal tab; see Cross-page findings.
**Stage:** 1 of 3 (DESIGN). Plan only — no code changes.

> Note: the page was inspected in-repo (entry component + its three tab files + the related `sharia_compliance` page + mock data/types). The hosted `full.ssgm.app` reference was not fetched in this pass; the in-repo copy is the source of truth for intent.

---

## Intent

### Job-to-be-done
Administer the **Sharia Supervisory Board as a governance body** — for the **board secretary / governance officer**. Two concrete tasks:
- *Who sits on the board, in what role, and are they active?* (the roster)
- *When does the board convene, who attends, what's on the agenda, where are the minutes?* (the meeting calendar)

This is the standard "board / committee management" surface (cf. Salesforce Nonprofit board management, Blackbaud), specialized to a Gulf awqaf Sharia Supervisory Board. The job is clear and real for the target user.

### Does it serve more than one job?
**Yes — and that is the page's central defect.** Today it serves *three* jobs across three tabs:
1. **Members** — board roster administration. ✅ on-job.
2. **Meetings** — board meeting calendar/minutes. ✅ on-job.
3. **Portal** — a board-member-facing **compliance dashboard** (fatwas issued, cases under review, contract/policy document review queue, required actions, zakat). ❌ This is a *different job* (compliance monitoring, not board administration) **and a different audience** (the board member, not the secretary), and it duplicates the standalone `sharia_compliance` module almost field-for-field. It is also hardcoded Arabic-only mock with non-functional buttons (a bilingual/RTL violation).

Stripping Portal collapses the page back to one coherent job: managing the board body.

---

## Phase 1 — Component critique

| Tab | Section / component | Verdict | Reason |
|-----|--------------------|---------|--------|
| **Portal** | Arabic-only header "بوابة الهيئة الشرعية" + welcome line | **Cut** | Hardcoded, single-language, decorative. Violates the bilingual rule. |
| **Portal** | 3 stat cards (cases under review · upcoming meetings · fatwas issued this year) | **Cut** | Duplicates `sharia_compliance` KPI cards (pending fatwas, contracts under review). Hardcoded mock. |
| **Portal** | "Required Actions" list (contracts to approve, investment proposals to vote, policy edits to sign) | **Cut** | Compliance-workflow items — belongs to `sharia_compliance`, not board administration. Hardcoded Arabic, dead buttons (مراجعة/نقاش do nothing). |
| **Portal** | "Document Repository" table (contracts / proposals / policy drafts, Pending/Approved) | **Cut** | Contract/policy review queue is `sharia_compliance`'s domain (it has "Submit Contract" + "Contracts Under Review"). Hardcoded mock. |
| **Portal** | "Fatwas & Questions" table | **Cut** | Fatwa register belongs to `sharia_compliance` (it has "New Fatwa" + "Pending Fatwas" KPI). Hardcoded Arabic, "view details" button dead. |
| **Meetings** | Month calendar grid + prev/next + meeting chips | **Keep** | Core board-meeting scheduling view; on-job and coherent. |
| **Meetings** | `ScheduleMeetingModal` | **Rework** | On-job, but form labels are hardcoded Arabic (`عنوان الاجتماع`, `التاريخ`, …) — must use `t()`. No attendees/agenda inputs, so new meetings always open an empty detail modal. |
| **Meetings** | Meeting detail modal (time/date/location, attendees, agenda, download minutes) | **Keep** | Useful drill-in; attendees resolve against the Members roster. |
| **Members** | Filter bar (search · role · status) | **Keep** | Standard roster filtering; on-job. |
| **Members** | Grid/list view toggle | **Keep** | Reasonable affordance for a directory. |
| **Members** | Member cards (grid) | **Rework** | Keep card + mailto. The two extra icon buttons (Check, Briefcase) are dead and meaningless — cut them. |
| **Members** | Members list (table) + `MoreHorizontal` row action | **Keep** + **Rework** | Keep the table; the `MoreHorizontal` button does nothing — wire to a member-detail view later, or drop until then. |
| **Members** | `AddMemberModal` | **Keep** + **Rework** | On-job. But it stores `name`/`title` as `{en: x, ar: x}` (same string both languages) — needs separate AR/EN inputs to satisfy bilingual data entry (flag for ACTIVATE). |

No surviving control is purely decorative. The Members/Meetings modals wire to local component state today (legacy mock — ACTIVATE replaces with the Hono API).

---

## Phase 2 — Cross-page / IA findings

1. **The Portal tab duplicates the `sharia_compliance` module.** `ShariaCompliancePage.tsx` already owns: compliance gauge, **pending fatwas**, **contracts under review**, **zakat distribution**, **alerts**, recent activity, and quick actions (**New Fatwa**, **Submit Contract**, **Log Zakat**). The Portal tab re-renders the same domain (fatwas, contract/policy review queue, required actions, zakat-adjacent stats) as a second, Arabic-only, hardcoded dashboard. This is the "Compliance"-style collision: two surfaces competing for the same job.
   **Decision:** Portal's content is `sharia_compliance`'s domain, not the board-administration page's. **Cut Portal from `sharia_board`.** Nothing in Portal is unique enough to migrate as live code — it is all hardcoded mock and the *concepts* (fatwa register, contract review pipeline) already have a home in `sharia_compliance`. Their proper bilingual implementation is a `sharia_compliance` concern, out of scope for this page. (See Open Question 2.)

2. **`sharia_compliance` already cross-links here.** Its "Board Members" KPI card calls `setActiveModule('sharia_board')`. That link stays valid and correct once `sharia_board` is the clean roster/meetings surface — it points at the board roster, which is exactly this page's job.

3. **Attendees & agenda presenters reference the Members roster.** The Meetings detail modal resolves `attendees` (member IDs) against `MOCK_SHARIA_BOARD_MEMBERS`. So Members is the owning entity and Meetings reads from it — same module, no cross-module dependency.

---

## Phase 3 — Page verdict

**Keep as a dedicated page (restructured) — two tabs: Members · Meetings. Cut the Portal tab.**

Rationale grounded in Phases 0–2: Members + Meetings is a coherent, single-job "manage the Sharia Supervisory Board" surface for the board secretary, and is the standard board-management pattern. The Portal tab is a second compliance dashboard that (a) duplicates the existing `sharia_compliance` module, (b) targets a different job/audience, and (c) is hardcoded Arabic-only mock with dead controls. Cutting it is the surgical fix that resolves the multi-job defect without touching `sharia_compliance`.

**Cut:** the entire Portal tab and its file `apps/web/src/components/pages/sharia_board/PortalTab.tsx`.
**Unique content to preserve elsewhere:** none as code. The *concepts* it gestured at (fatwa register, contract/policy review queue) are already represented in `sharia_compliance` and should be built out there, not here — flagged as Open Question 2, not migrated.

This is recommended over the heavier alternative of folding Members+Meetings into `sharia_compliance` as tabs (Open Question 1): the two modules serve genuinely distinct jobs (board administration vs. compliance monitoring), and that merge changes a page outside this assessment's scope.

---

## Phase 4 — Target structure spec

Two tabs, same visual language. Change set: delete Portal; default tab becomes Members; Meetings modal de-hardcoded; two dead Members-card buttons removed.

### Tab order
`Members` · `Meetings`
(Default/initial tab: **Members** — the roster is the anchor entity that Meetings reads from. Previously the default was Portal, which is removed.)

### Tab 1 — Members (kept, light rework)
- **Filter bar:** search (name) · role select (Chairman/Member/Secretary/Observer + All) · status select (Active/On Leave/Inactive + All). Unchanged.
- **View toggle:** grid ↔ list. Unchanged.
- **Add Member** button → `AddMemberModal`.
- **Grid:** member cards (photo, name, title, role chip, status dot, mailto). **Rework:** remove the two dead icon buttons (Check, Briefcase); keep the mailto link.
- **List:** table (Member · Role · Status · Credentials · Actions). **Rework:** the `MoreHorizontal` action is currently inert — either wire to a member-detail view or drop the column until BUILD has a target. (Recommend: keep the column, leave the affordance for ACTIVATE.)
- **`AddMemberModal` rework (note for ACTIVATE):** capture **separate AR + EN** values for name and title (today it duplicates one string into both languages), to satisfy bilingual data entry.

### Tab 2 — Meetings (kept, rework the schedule form)
- **Month calendar:** title (month/year) · prev/next · weekday header · 6×7 day grid with meeting chips; click a chip → meeting detail modal. Unchanged.
- **Schedule Meeting** button → `ScheduleMeetingModal`. **Rework:** replace hardcoded Arabic labels (title/date/location/start/end) with `t()` keys (AR+EN). Optionally add attendees (multi-select from Members) and agenda rows so newly created meetings have a populated detail view — *enhancement, lower priority; minimum bar is the de-hardcoding.*
- **Meeting detail modal:** time · date · location · attendees (resolved against Members) · agenda (topic + presenter) · download minutes (if present). Unchanged.

### Cut
| Cut | One-line reason |
|-----|-----------------|
| Portal tab (whole) + `PortalTab.tsx` | Arabic-only hardcoded compliance dashboard duplicating `sharia_compliance`; off-job for board administration. |
| Portal stat cards / required actions / document repo / fatwas table | Each is `sharia_compliance`'s domain; all hardcoded mock with dead buttons. |
| Members-card Check & Briefcase icon buttons | Non-functional, meaningless. |

### Renames
| Where | From | To | Why |
|-------|------|----|-----|
| Default active tab | `portal` | `members` | Portal removed; roster is the anchor entity. |

No page-title or other tab-label renames. The `sharia.board.tabs.portal` key becomes unused (leave or delete; no functional impact).

### Data each surviving component needs (notes for ACTIVATE — plain terms, not schema)
- **Board Members** — *entered on this page.* name (ar/en), title (ar/en), email, role (Chairman/Member/Secretary/Observer), status (Active/On Leave/Inactive), photo (upload/URL), credentials (list of strings), bio (ar/en). Org-scoped (`org_id`).
- **Meetings** — *entered on this page.* title (ar/en), date, start time, end time, location, attendees (**references Board Members above** — same module), agenda (list of {topic ar/en, presenter}), minutes document (uploaded file / URL). Org-scoped.
- No data is owned by another module; `sharia_compliance` *reads* the member count from here (its KPI card), but does not edit it.

### Translation namespace impact (both `ar` + `en` must stay in sync)
- New keys for the Meetings schedule form (replacing hardcoded Arabic): `sharia.board.meetings.form.title`, `.date`, `.location`, `.startTime`, `.endTime` (+ AR equivalents). The submit/title key `sharia.board.meetings.schedule` already exists.
- `sharia.board.tabs.portal` — now unused (Portal removed). Safe to leave or remove from both `ar`/`en`.
- All other `sharia.board.*` keys unchanged.

---

## Decisions (approved — ready for BUILD)

1. **Keep `sharia_board` as a separate module** (Open Q1 → recommended option). Portal is cut; Members + Meetings stay as the two tabs. No merge into `sharia_compliance`.
2. **Portal content is abandoned here** (Open Q2). The fatwa register / contract-review / required-actions concepts remain `sharia_compliance`'s domain; nothing migrates onto this page.
3. **No member-detail view in MVP** (Open Q3). The list `Actions` column stays as a placeholder affordance, left inert for the ACTIVATE stage; no detail drawer/modal is built now.

---

## Open questions (resolved above — kept for reference)

1. **Keep `sharia_board` separate, or merge into `sharia_compliance`?** *(Recommended: keep separate.)* The two modules serve distinct jobs — board administration (roster + meetings) vs. compliance monitoring (gauge, fatwas, zakat, alerts). Keeping them separate is clean once Portal is cut. The alternative is to fold Members+Meetings into `sharia_compliance` as tabs and drop the `sharia_board` sidebar entry (the grc.md "absorb" pattern, fewer modules). That's a heavier IA change affecting a page outside this assessment — decide if you want it.
2. **Confirm Portal's compliance content is abandoned here.** Cutting Portal removes the (mock) fatwa register, contract/policy review queue, and "required actions" from `sharia_board`. These concepts already exist as KPIs/quick-actions in `sharia_compliance`; building them out as real bilingual features there is a separate future task. Confirm nothing in Portal must survive on *this* page.
3. **Member-detail view?** The list `MoreHorizontal` action and (former) card icons imply a per-member detail/profile (bio, credentials, meeting history). Do you want a member-detail drawer/modal in scope now, or leave the action inert until a later stage?
