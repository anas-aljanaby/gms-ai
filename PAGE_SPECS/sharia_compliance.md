# Page Spec — Sharia Compliance

**Page:** `apps/web/src/components/pages/ShariaCompliancePage.tsx`
**Sidebar key:** `sharia_compliance`
**Related modules (not absorbed):** `sharia_board` (board roster/meetings), `grc` (enterprise governance/risk/regulatory compliance + AML screening), `financials` (money ledger, budgets, disbursements), `projects` (project/contract context).
**Stage:** 1 of 3 (DESIGN). Plan only — no code changes beyond this spec.

> Note: the in-repo page, mock data, translations, `sharia_board` spec, and hosted `full.ssgm.app/#sharia_compliance` reference were inspected. The hosted page matches the same one-screen dashboard intent, with several untranslated `sharia.*` keys visible in the reference. Treat it as intent/content reference, not a structure to preserve.

---

## Intent

### Job-to-be-done
Provide a **Sharia compliance control room** for the Sharia compliance officer, finance staff, program managers, and Sharia Supervisory Board members. It answers: *which rulings are pending, which contracts/products need Sharia review, are zakat funds being used within approved rules, and what exceptions need attention?*

This is distinct from generic regulatory compliance. For Gulf awqaf and charitable foundations, Sharia compliance is a domain-specific assurance workflow covering fatwas/rulings, contracts, investments, zakat allocation, and exception resolution.

### Does it serve more than one job?
Yes, but under one coherent compliance umbrella:
1. **Fatwa / ruling management** — request, review, issue, and archive Sharia opinions.
2. **Contract/document/product review** — submit agreements, policies, and investment proposals for Sharia review.
3. **Zakat oversight** — monitor allocation, eligibility, policy limits, and compliance certification of zakat spending.
4. **Exceptions and activity** — triage Sharia alerts and maintain a recent compliance trail.

These are legitimate sub-jobs for one Sharia compliance workspace. The current defect is not that the page exists; it is that all sub-jobs are flattened into static KPI cards and under-construction quick actions.

---

## Component Critique Table

| Section / component | Verdict | Reason |
|---------------------|---------|--------|
| Page header (`sidebar.sharia_compliance` + `ShariaComplianceIcon`) | **Keep** | Correct page identity and distinct from `sharia_board` once the page is restructured. |
| Overall compliance gauge | **Rework** | Useful executive signal, but today it is an unexplained static score; keep it on Overview with a breakdown by fatwas, reviews, zakat, and exceptions. |
| KPI card — Pending Fatwas | **Keep** | Directly maps to a core Sharia compliance queue and should drill into the Fatwas tab. |
| KPI card — Contracts Under Review | **Keep** | Directly maps to the document/contract review queue and should drill into the Reviews tab. |
| KPI card — Sharia Board Members | **Rework** | Board roster data is owned by `sharia_board`; keep only as a small read-only cross-link, not as a headline compliance KPI. |
| KPI card — Recent Alerts | **Keep** | Sharia exceptions are a real compliance workload and should drill into an Exceptions tab/section. |
| Zakat distribution progress card | **Rework** | Important for Gulf non-profits, but it needs category/eligibility context and links to financial disbursement data rather than a lone progress bar. |
| Compliance trend chart | **Rework** | A trend has value, but the current 97–100 vanity axis does not explain what changed; tie the trend to resolved exceptions and completed reviews. |
| Sharia alerts list | **Keep** | Alerts have operational value; promote them into an exceptions queue with owner, severity, status, and resolution. |
| Recent activity list | **Rework** | Useful as an audit trail, but it should be generated from fatwa/review/zakat/alert events rather than free-floating dashboard copy. |
| Quick Actions card | **Rework** | The actions are right, but they currently open an under-construction modal; each action should live with the relevant tab and open a real static form. |
| `ActionModal` under-construction modal | **Cut** | Generic placeholder modal blocks the page from feeling real; replace with dedicated `New Fatwa`, `Submit Review`, and `Log Zakat Review` modals in BUILD. |

---

## Cross-Page Findings

1. **`sharia_board` remains separate and owns people/meetings.** `ShariaCompliancePage.tsx` currently reads `MOCK_SHARIA_BOARD_MEMBERS.length` and links to `setActiveModule('sharia_board')`. That relationship is correct: Sharia compliance can reference board members as reviewers/approvers, but roster and meeting scheduling stay in `sharia_board`.

2. **GRC stays separate.** `grc` owns enterprise governance/risk/regulatory compliance and AML/sanctions screening. `sharia_compliance` owns jurisprudential review, fatwas, zakat compliance, and Sharia exceptions. The shared word "compliance" is acceptable because GRC was already disambiguated as "Regulatory Compliance" and AML screening was folded into GRC.

3. **Financials owns money movement.** Zakat disbursement amounts, budgets, and actual payments should ultimately come from `financials`; this page should own Sharia eligibility/certification, exceptions, and approvals. BUILD can use local mock data, but ACTIVATE should avoid creating a duplicate finance ledger here.

4. **Investments and projects may be referenced but not absorbed.** `investmentData.ts` already contains `shariahCompliant` flags, and projects/contracts may need Sharia review. This page can show linked review items; the underlying investment/project records remain owned by their source modules.

---

## Page Verdict + Rationale

**Keep as a dedicated page (restructured).**

The page is a real, high-value surface for Gulf non-profit and awqaf operations. Eliminating it would lose the product's Islamic finance specificity; merging it into `sharia_board` would mix board administration with compliance casework; merging it into GRC would blur generic regulatory compliance with Sharia jurisprudential review.

Restructure the one-screen dashboard into a tabbed Sharia compliance workspace:
- **Overview** summarizes status and directs users to work queues.
- **Fatwas & Rulings** manages Sharia opinions.
- **Reviews** manages contracts, documents, policies, and investment/product review.
- **Zakat Oversight** tracks zakat allocation compliance and certification.
- **Exceptions & Activity** triages Sharia alerts and shows the compliance event trail.

The only cut is the generic under-construction action modal. The existing concepts are preserved, but each is moved to the tab where a user can act on it.

---

## Target Structure Spec

Five tabs, same visual language as the existing app. The BUILD stage should make this a fully interactive static frontend with local/mock state only.

### Tab Order
`Overview` · `Fatwas & Rulings` · `Reviews` · `Zakat Oversight` · `Exceptions & Activity`

### Tab 1 — Overview
- **Overall Sharia Compliance Score** — reworked gauge with a short breakdown: fatwa backlog, review backlog, zakat compliance, unresolved exceptions. The score remains a mock/computed value in BUILD.
- **Headline KPI cards** — Pending Fatwas · Contracts/Reviews Under Review · Active Exceptions · Zakat Compliance Progress. Each card should drill/switch to the relevant tab.
- **Board Roster Link** — small secondary card/link: board member count + "View Sharia Board" action to `sharia_board`. Read-only here.
- **Compliance Trend** — keep the 6-month trend, but label it as the Sharia compliance trend and pair it with a concise explanation of what affects the score.
- **Priority Work Queue** *(new)* — top 5 items across pending fatwas, overdue reviews, zakat exceptions, and critical alerts.
- **Recent Activity Preview** — last 5 Sharia compliance events; full trail lives in Exceptions & Activity.

### Tab 2 — Fatwas & Rulings
- **Fatwa Register** *(new)* — table/list of fatwa requests and rulings: reference number, topic, requester, status, priority, assigned reviewer, requested date, due date, issued date.
- **New Fatwa / Request Ruling** modal — replaces the current `newFatwa` under-construction action. Fields: title/topic, question/details, requester, related module/record, priority, assigned reviewer, due date, attachments placeholder.
- **Fatwa Detail Drawer/Modal** *(new)* — shows question, review notes, decision/ruling summary, status history, attachments placeholder, and issued date. Static edit/save is enough for BUILD.
- **Statuses** — Draft / Submitted / Under Review / Issued / Archived.

### Tab 3 — Reviews
- **Review Queue** *(new)* — table/list for contracts, policies, investment proposals, grant agreements, procurement contracts, and financial products needing Sharia review. Columns: item title, type, source module, counterparty/project, status, risk flag, assigned reviewer, due date.
- **Submit for Sharia Review** modal — replaces the current `submitContract` under-construction action. Fields: title, review type, description, counterparty/project, source module/record link, priority, due date, assigned reviewer, attachment placeholder.
- **Review Detail Drawer/Modal** *(new)* — checklist-style review notes, decision (Approved / Approved with Conditions / Rejected / Needs Clarification), conditions, reviewer, and activity history.
- **Statuses** — Submitted / Under Review / Needs Clarification / Approved / Approved with Conditions / Rejected.

### Tab 4 — Zakat Oversight
- **Zakat Compliance Summary** — reworked progress card with target, distributed amount, remaining amount, eligible/ineligible flags, and category distribution.
- **Zakat Allocation Table** *(new)* — rows for zakat expenditures or allocation reviews: beneficiary/program/category, amount, date, eligibility status, related financial transaction/disbursement, reviewer, notes.
- **Log Zakat Review** modal — replaces the current `logZakat` under-construction action. The user logs compliance certification/eligibility review; actual payment data is read-only from Financials once activated.
- **Policy Limits / Category Rules** *(new, static for BUILD)* — small table of zakat categories and limits/notes (e.g. poor/needy, debt relief, education where applicable). Keep MVP-level: enough to explain alerts without overbuilding jurisprudence.
- **Zakat Exceptions** — list of allocation-limit warnings or ineligible-spend alerts, linked to Exceptions & Activity.

### Tab 5 — Exceptions & Activity
- **Sharia Exceptions Queue** — promoted from the current alerts list. Each alert has severity, source, linked record, owner, status, created date, and resolution notes.
- **Resolve Exception** modal/drawer *(new)* — static edit/save for status, owner, resolution, and follow-up date.
- **Activity Trail** — reworked recent activity list with timestamp, event type, actor, linked record, and description. This is read-only in the UI.

### Cut

| Cut | One-line reason |
|-----|-----------------|
| Generic `ActionModal` with `placeholder.underConstruction` | It makes the three main workflows feel fake; BUILD should replace it with dedicated forms. |
| Board members as a headline KPI | Roster count is not a compliance outcome; keep it only as a secondary cross-link to `sharia_board`. |

### Renames

| Where | From | To (en) | To (ar) | Why |
|-------|------|---------|---------|-----|
| New Tab 1 | — | Overview | نظرة عامة | Converts the dashboard into a navigation/summary surface. |
| New Tab 2 | — | Fatwas & Rulings | الفتاوى والأحكام | Names the fatwa workflow explicitly. |
| New Tab 3 | — | Reviews | المراجعات | Covers contracts, policies, investment proposals, and documents without narrowing to contracts only. |
| New Tab 4 | — | Zakat Oversight | الرقابة على الزكاة | Makes zakat a compliance oversight workflow, not only a distribution progress bar. |
| New Tab 5 | — | Exceptions & Activity | الاستثناءات والنشاط | Combines alerts and audit-like activity in one operational tab. |
| Quick action | Log Zakat Expenditure | Log Zakat Review | تسجيل مراجعة الزكاة | Avoids duplicating the financial ledger; this page certifies compliance. |

### Data Each Component Needs (notes for ACTIVATE — plain terms, not schema)

- **Overall compliance score** — *computed on this page* from fatwa backlog, review statuses, zakat compliance status, and unresolved exception severity.
- **Fatwa requests/rulings** — *entered on this page.* Reference number, title/topic (ar/en), question/details (ar/en), requester, status, priority, assigned Sharia board member, requested date, due date, issued date, ruling summary (ar/en), attachments placeholder, related module/record.
- **Review submissions** — *entered on this page,* with optional read-only links to source records. Title (ar/en), type (contract/policy/investment proposal/grant/procurement/financial product), source module, source record ID/name, counterparty/project, status, risk flag, assigned reviewer, due date, decision, conditions (ar/en), attachments placeholder.
- **Board members/reviewers** — *owned/edited by `sharia_board`, read-only here.* Used for reviewer assignment and the Overview roster link. BUILD can use mock members; ACTIVATE should read from `sharia_board` once available.
- **Zakat allocation reviews** — *entered on this page as compliance certification.* Category, beneficiary/program, amount, date, eligibility status, reviewer, notes (ar/en), linked financial transaction/disbursement if available.
- **Financial transaction/disbursement data** — *owned by `financials`, read-only here.* Amounts, dates, account/fund, project, and payment status should link back to Financials once activated.
- **Policy limits/category rules** — *entered/configured on this page for MVP.* Category, rule/limit text (ar/en), threshold amount/percent if applicable, effective date, status.
- **Exceptions/alerts** — *generated from this page's review/zakat checks or sourced from related modules.* Severity, source, linked record, owner, status, created date, resolution notes, follow-up date.
- **Activity trail** — *read-only, generated by user actions on this page.* Event type, actor, timestamp, linked record, description (ar/en).
- **Investment Sharia flags** — *owned by investments/financials, read-only here if surfaced.* Show as linked review context, not as an editable portfolio table.

### Translation Namespace Impact (both `ar` + `en`)

- Keep using the `sharia` namespace.
- Add `sharia.tabs.overview`, `.fatwas`, `.reviews`, `.zakat`, `.exceptions`.
- Add keys under `sharia.overview.*` for score breakdown, priority queue, board link, and activity preview.
- Add keys under `sharia.fatwas.*` for register columns, statuses, detail labels, and `newFatwa` form fields.
- Add keys under `sharia.reviews.*` for queue columns, review types, statuses, decision labels, and submit-review form fields.
- Add keys under `sharia.zakat.*` for oversight summary, allocation table, policy rules, eligibility statuses, and `logZakatReview`.
- Add keys under `sharia.exceptions.*` for severity/status labels, resolution form fields, and activity trail labels.
- Existing keys under `sharia.kpi.*`, `sharia.trend.*`, `sharia.alerts.*`, `sharia.activity.*`, and `sharia.actions.*` can be reused where intent still matches, but BUILD should avoid relying on currently untranslated keys visible in the hosted reference.

---

## Open Questions

1. **Should investment screening be a full tab now or stay inside Reviews?** Recommended for MVP: keep investment/product proposals inside **Reviews**. A dedicated investment-compliance tab would duplicate future investment management work.
2. **Should Zakat Oversight own actual expenditure entry?** Recommended: no. Let Financials own payments/disbursements; this page owns Sharia eligibility/certification and exception handling.
3. **Should fatwa/ruling publication have an external portal?** Recommended: no for this build. Keep it internal; any board-member portal or public fatwa library is a later product decision.
