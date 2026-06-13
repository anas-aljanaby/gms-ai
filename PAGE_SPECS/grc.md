# Page Spec — GRC (Governance, Risk & Compliance)

**Page:** `apps/web/src/components/pages/GrcPage.tsx` + `apps/web/src/components/pages/grc/*`
**Sidebar key:** `grc`
**Absorbs:** `compliance` module (`apps/web/src/components/pages/CompliancePage.tsx`) — eliminated; its AML/sanctions screening becomes the GRC **Screening** tab.
**Stage:** 1 of 3 (DESIGN). Plan only — no code changes. All Phase-1-stage open questions are resolved into decisions below; this spec is ready for BUILD.

---

## Intent

### Job-to-be-done
A single **governance, risk & compliance command center** for the org's executive leadership, compliance/risk officer, and board secretary. It answers five enterprise-level questions in one place:
- *Are our policies current and what board decisions are outstanding?* (Governance)
- *What enterprise-level risks threaten the organization, and are they being mitigated?* (Risk)
- *Are we meeting our regulatory / donor / internal obligations and their deadlines?* (Regulatory Compliance)
- *Is this donor / vendor / partner safe to deal with, or a sanctions/AML risk?* (Screening)
- *Who changed what, and when?* (Audit)

GRC is a well-established product category (Salesforce, Blackbaud all ship a governance/risk surface), so the page concept is sound for the target users.

### Does it serve more than one job?
It legitimately serves **related sub-jobs under one coherent umbrella** (the pillars above), which is the standard GRC decomposition — acceptable. The original defects were that (a) the Dashboard tab duplicated the Risk tab's matrix, and (b) the word "Compliance" collided across three sidebar modules. Both are resolved here: the duplicated matrix is cut, the regulatory tab is renamed, and the standalone AML-screening `compliance` module is **absorbed** into GRC as a Screening tab (so the three-way collision disappears with one of the three modules folded in). Only `sharia_compliance` remains separately named, which is unambiguous.

---

## Phase 1 — Component critique

| Tab | Section / component | Verdict | Reason |
|-----|--------------------|---------|--------|
| **Dashboard** | 5 StatCards (pending decisions, non-compliant, high risks, active risks, active policies) | **Keep** | Genuine at-a-glance roll-up across all four pillars — the right job for an overview tab. |
| **Dashboard** | `RiskMatrix` | **Cut** (from this tab) | Exact duplicate of the matrix on the Risk tab; decorative here. The overview should summarize, not repeat one pillar. |
| **Governance** | Policies table + `NewPolicyModal` | **Keep** | Core governance register; clear and on-job. |
| **Governance** | Decisions table + `NewDecisionModal` | **Keep** | Board/management decision log; on-job. |
| **Risk** | 4 StatCards (total / critical / high / medium) | **Rework** | Useful, but overlaps the Dashboard stat cards. Keep on Risk tab as level-breakdown counts; let Dashboard own the cross-pillar headline numbers. |
| **Risk** | `Risk Register` table + search + `LogRiskModal` + `RiskDetailModal` | **Keep** | The heart of enterprise risk management; drill-in + mitigation tracking is on-job. |
| **Risk** | `RiskMatrix` (probability × impact) | **Keep** | Standard risk-management visual with decision value; this is its rightful home. |
| **Compliance** | Requirements table joined to latest `Assessment` (status, last assessed, next due) | **Keep** + **Rework label** | Strong compliance-obligations register. Renamed to **"Regulatory Compliance"** to disambiguate from the screening pillar now sharing this page. |
| **Audit** | System audit log table (date, user, module, action, record id) | **Keep** | Auditors and admins need an immutable change trail; defensible as a GRC pillar. Read-only, system-generated (see data notes). |
| **Screening** *(absorbed from `compliance` module)* | Screen-new-entity form (name / type / country → score, level, recommendation) | **Move → here** | AML/sanctions due diligence is a compliance function; belongs in GRC, not a standalone mislabeled "Compliance" module. |
| **Screening** *(absorbed)* | Recently-screened table + result card + active-alerts table | **Move → here** | Screening history and watchlist alerts; the operational record of the pillar above. |

No control on the page is dead/non-functional; the modals all wire to local state today (legacy mock — ACTIVATE will replace). The screening form is a mock keyword matcher (`simulateScreening`) today; ACTIVATE replaces it with a real screening call.

---

## Phase 2 — Cross-page / IA findings

1. **"Compliance" was overloaded across three sidebar modules — now resolved.**
   - `grc` → Compliance tab = **regulatory/donor/internal obligation tracking** (requirements + assessments).
   - `compliance` (`CompliancePage.tsx`) = **AML / sanctions watchlist screening** (KYC, OFAC/UN match simulation). A different function entirely, *mis-named* in the sidebar.
   - `sharia_compliance` (`ShariaCompliancePage.tsx`) = **Sharia/fatwa compliance** (fatwas, zakat, contract review).
   **Decision:** absorb the AML `compliance` module into GRC as a **Screening** tab and **remove** that sidebar module; rename the GRC regulatory tab to "Regulatory Compliance". `sharia_compliance` stays separate (distinct, unambiguous). This eliminates the collision.

2. **Risk register exists in two scopes — kept distinct.**
   - GRC `RiskTab` = **organization-level / enterprise risk** (numeric 1–5 probability × impact, `scope` field like "Organization", "IT", "Public Relations").
   - Projects `RiskManagementTab` (`projects/tabs/RiskManagementTab.tsx`) = **project-level risk** (low/med/high, per-project register, already wired to the Hono API via `useProjectRisks`).
   **Decision:** these are **legitimately distinct** (enterprise vs. project) and stay fully separate for the MVP — no roll-up, no shared data. GRC's risk register is strictly org-level.

3. **Audit log is cross-cutting.** It logs events from every module (`module` column: risk, governance, compliance, …). It is correct to *surface* it in GRC, but the data is **owned/generated by the system**, not entered here. No other page currently shows it, so GRC is its reasonable home.

---

## Phase 3 — Page verdict

**Keep as a dedicated page (restructured), absorbing the AML-screening `compliance` module.**

GRC is a coherent, industry-standard surface serving the governance/risk/compliance jobs for executive and compliance users. The restructure:
- Make **Dashboard → Overview** a true cross-pillar roll-up (remove the duplicated matrix; add upcoming-deadline and pending-decision summaries that pull from the other tabs).
- Keep **Governance**, **Risk**, **Audit** essentially as-is.
- **Rename** the Compliance tab to **"Regulatory Compliance"**.
- **Absorb** the standalone AML-screening `compliance` module (`CompliancePage.tsx`) as a new **Screening** tab, and **remove** that module from the sidebar/`moduleRegistry`.

This eliminates the three-way "Compliance" navigation collision and consolidates one extra module (good for the MVP).

**Eliminated:** the `compliance` sidebar module. Everything unique on `CompliancePage.tsx` (the screening form + scoring/recommendation result, recently-screened history, active-alerts list) is preserved by moving it verbatim into the GRC **Screening** tab. The only **Cut** is the duplicated Dashboard matrix, which still exists on the Risk tab.

---

## Phase 4 — Target structure spec

Six tabs, same visual language. Changes are: Dashboard becomes a real overview, Risk-tab matrix becomes the only matrix, Compliance tab is renamed, and a Screening tab is added (absorbed from the `compliance` module).

### Tab order
`Overview` · `Governance` · `Risk` · `Regulatory Compliance` · `Screening` · `Audit`
(Tab 1 renamed "Dashboard" → "Overview"; Tab 4 renamed "Compliance" → "Regulatory Compliance"; **Screening** is new, inserted before Audit.)

### Tab 1 — Overview (was "Dashboard")
- **Headline StatCards** (keep existing 5): Pending Decisions · Non-Compliant Requirements · High/Critical Risks · Active Risks · Active Policies.
- **Upcoming Compliance Deadlines** *(new)* — small list/table of the **top 5** requirements by soonest `nextDueDate`, each with a status badge. One-line: "next obligations falling due, soonest deadlines first." Full list lives on the Regulatory Compliance tab.
- **Pending Decisions** *(new)* — small list of the **top 5** decisions with `status = pending`, showing title + date. One-line: "board/management decisions awaiting sign-off." Full list lives on the Governance tab.
- **Cut:** the `RiskMatrix` (now lives only on the Risk tab).
- Rationale: an overview tab should summarize the pillars, not re-render one pillar's chart.

### Tab 2 — Governance (unchanged)
- **Policies** card: table (Title · Category · Version · Status · Review Date) + "New Policy" → `NewPolicyModal`.
- **Decisions** card: table (Title · Date · Status) + "New Decision" → `NewDecisionModal`.

### Tab 3 — Risk
- **Level-breakdown StatCards** (keep 4): Total · Critical · High · Medium. (These are the per-level counts; the cross-pillar headline numbers now live on Overview, so no functional change but conceptually distinct from Overview's cards.)
- **Risk Register** card: search + "Log Risk" (`LogRiskModal`) + table (Description · Category · Score · Level · Status), row click → `RiskDetailModal` (level/score/impact/probability, category, scope, mitigation list, "Update Mitigation").
- **Risk Matrix** (probability × impact) — the single home for the matrix.

### Tab 4 — Regulatory Compliance (renamed)
- **Requirements** card: table joining each requirement to its latest assessment — Requirement · Source · Status · Last Assessed · Next Due. Unchanged structure; heading/tab label change only.

### Tab 5 — Screening (new — absorbed from the `compliance` module)
Move `CompliancePage.tsx` content here verbatim (same layout, same visual language), as GRC tab content rather than a standalone page:
- **Screen New Entity** card: form — entity name, type (individual / organization / vendor / partner), country → "Screen" button.
- **Recently Screened** card: table (Name · Type · Risk Level · Date).
- **Screening Result** card (appears after a screen): score /100, risk level, recommendation (approve / review / reject) + bilingual reasoning.
- **Active Alerts** card: table (Entity · Match Details · Status · Date) for medium/high hits.
- Drop the page-level `<h1>` and `ComplianceIcon` header (the GRC page header + tab now provide context). Everything else moves as-is.

### Tab 6 — Audit (unchanged)
- **Audit Log** card: table (Date · User · Module · Action · Record ID). Read-only.

### Renames
| Where | From | To (en) | To (ar) | Why |
|-------|------|---------|---------|-----|
| Tab 1 label | Dashboard | Overview | نظرة عامة | "Overview" reads as a roll-up, not another chart surface. |
| Tab 4 label + card heading | Compliance | Regulatory Compliance | الالتزام التنظيمي | Disambiguate from the Screening pillar now sharing the page. |
| New tab | — | Screening | الفحص | AML/sanctions due-diligence pillar, absorbed from the removed `compliance` module. |

### Data each component needs (notes for ACTIVATE — plain terms, not schema)
- **Policies** — *entered on this page.* Title (ar/en), category, status (draft/active/archived), version, effective date, review date, owner.
- **Decisions** — *entered on this page.* Title (ar/en), date, status (pending/approved/rejected/implemented), impact, optional related policy.
- **Enterprise Risks** — *entered on this page.* Description, category, probability (1–5), impact (1–5), score, level (Critical/High/Medium/Low), scope, mitigation steps (list), status (identified/mitigating/monitored/closed). Strictly org-level; **no link to project risks** (kept distinct — see Decisions).
- **Compliance Requirements** — *entered on this page.* Code, title (ar/en), source (donor/internal/regulatory), source name (ar/en), priority, next due date, status.
- **Assessments** — *entered on this page.* Linked requirement, date, status (compliant / partially / non / not-assessed), score, assessor, optional findings (ar/en). The table shows the latest assessment per requirement.
- **Overview deadlines & pending decisions** — *derived,* no new data; computed from the requirements/decisions above.
- **Screening entities** — *entered on this page* (the screen form). Name, type (individual/organization/vendor/partner), country, resulting risk level, last-screened date.
- **Screening result** — *derived per screen.* Score (0–100), risk level, recommendation (approve/review/reject), bilingual reasoning, match details. (Mock today; ACTIVATE wires a real screening provider.)
- **Screening alerts** — *generated when a screen returns medium/high.* Entity, match details, list source, status (open/in-review/...), created date.
- **Audit Log** — *read-only, owned/generated by the system* (every module writes entries). Not entered here; ACTIVATE wires it to a system audit feed, scoped by `org_id`, not to a GRC-owned table the user edits.

### Translation namespace impact (both `ar` + `en`)
- `grc.tabs.dashboard` → label becomes **Overview / نظرة عامة** (key can stay `dashboard` or rename to `overview`; keep keys in sync across ar/en).
- `grc.tabs.compliance` + `grc.compliance.title` → **Regulatory Compliance / الالتزام التنظيمي**.
- New keys for Overview: `grc.overview.upcomingDeadlines`, `grc.overview.pendingDecisions` (ar + en).
- New `grc.tabs.screening` → **Screening / الفحص**.
- The existing `compliance` namespace (`apps/web/public/locales/{ar,en}/compliance.json`) is **reused as-is** for the Screening tab content — its keys stay valid since the markup moves verbatim. No need to re-key into `grc`; just keep loading the `compliance` namespace from the GRC page.
- All other GRC keys unchanged.

---

## Decisions (resolved — ready for BUILD)

1. **"Compliance" collision → absorb + rename.** The AML-screening `compliance` module is folded into GRC as the **Screening** tab and removed from the sidebar/`moduleRegistry`; the GRC regulatory tab is renamed "Regulatory Compliance". `sharia_compliance` stays a separate module. (Resolves the original Open Question via the merge option.)

2. **Audit stays in GRC.** Kept as a GRC tab for the compliance-officer/auditor audience rather than moved to Settings/Admin.

3. **Risk stays strictly org-level.** GRC enterprise risk and Projects project-risk remain fully distinct — no roll-up, no shared data, no "source: project" column. (Per user direction.)

4. **Overview lists capped at top 5.** "Upcoming Deadlines" and "Pending Decisions" each show the top 5; the full lists live on the Regulatory Compliance and Governance tabs respectively.

### BUILD hand-off notes (cross-page edits this verdict implies)
- Remove the `compliance` entry from `apps/web/src/moduleRegistry.tsx` (and any org-module seed/default that enables it) once its content lives in the GRC Screening tab.
- Move `CompliancePage.tsx`'s body into a new `apps/web/src/components/pages/grc/ScreeningTab.tsx`; drop the page `<h1>`/icon header.
- Wire the new Screening tab into `GrcPage.tsx`'s `tabs` array + `renderActiveTab` switch.
