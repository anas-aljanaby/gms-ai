# Financials Page Requirements — Cross-Module Source of Truth

Goal: define what the future Financials page must provide to the rest of the system. This is a planning document only; the page is not being implemented yet.

The Financials page should become the trusted place for money movement, donation/payment records, accounting classification, receipts, budget actuals, approvals, imports, and financial audit history.

---

## Why This Page Is Needed

Several modules need financial data, but they should not each invent their own local money records.

Financial fields shown in donor, project, beneficiary, sponsorship, dashboard, and reporting pages should ultimately trace back to financial transactions or approved financial plans.

Core decision:
- Other modules may provide contextual quick actions, such as "Add donation" from a donor profile.
- Financials remains the authoritative ledger, approval, reconciliation, and reporting layer.
- Summary fields in other modules can be cached for performance, but must be derived from Financials data.

---

## Modules That Depend On Financials

| Module/page | Financials must provide |
|---|---|
| Donor profiles | Donation records, lifetime giving, total gifts, last gift, average gift, receipts, refunds, pledge/payment status. |
| Donor pipeline | Pledge/opportunity amount, expected close date, paid vs outstanding pledge status. |
| Institutional donors | Grants awarded, grant installments, restricted funds, reporting deadlines tied to grant spending. |
| Projects | Budgets, actual expenses, committed costs, burn rate, CPI/SPI inputs, funding allocation, restricted fund usage. |
| Beneficiaries | Financial aid disbursements, aid history, payment status, scheduled support. |
| Sponsorship/orphans | Sponsorship payments, recurring sponsor commitments, beneficiary disbursements, missed/late payments. |
| Campaigns/marketing | Campaign-attributed donations, cost of campaign, ROI, conversion value. |
| Dashboard/leadership | Revenue, expenses, cash position, fundraising performance, restricted/unrestricted balances, alerts. |
| Documents | Receipts, invoices, grant agreements, payment proofs, audit documents. |
| Compliance/GRC/Sharia later | Approval trail, restricted fund compliance, AML flags, suspicious transactions, zakat/waqf restrictions. |

---

## Core Financials Features

### Transactions ledger
- [ ] Record money-in transactions: donations, grants, sponsorship payments, investment income, refunds received.
- [ ] Record money-out transactions: project expenses, beneficiary aid, vendor payments, payroll/HR costs later, refunds issued.
- [ ] Track transaction status: draft, pending approval, approved, posted, reconciled, voided, refunded.
- [ ] Track payment method: cash, bank transfer, card, cheque, payment gateway, in-kind valuation.
- [ ] Track date fields: transaction date, posting date, received/paid date, reconciliation date.
- [ ] Attach donor, project, beneficiary, campaign, institutional donor, or grant references when relevant.
- [ ] Support notes, attachments, and audit metadata.

### Donations and receipts
- [ ] Create donation records that update donor giving summaries.
- [ ] Link donations to individual donors, institutional donors, campaigns, programs/projects, and restricted funds.
- [ ] Generate receipt records.
- [ ] Track receipt delivery status.
- [ ] Support corrections, refunds, reversals, and voids without deleting audit history.
- [ ] Support anonymous donations and unmatched donations.

### Pledges and commitments
- [ ] Track pledge amount, pledge date, expected payment date, installment schedule, status, and linked donor.
- [ ] Track outstanding pledge balance.
- [ ] Link actual payments to pledge installments.
- [ ] Expose pledge status to donor profile and pipeline.

### Project budgets and actuals
- [ ] Store approved project budgets by budget line/category.
- [ ] Record expenses against project budget lines.
- [ ] Track committed, actual, remaining, and variance amounts.
- [ ] Provide data for project cost management, burn rate, CPI/SPI, EAC/ETC, and budget reports.
- [ ] Support restricted fund allocation to projects.

### Beneficiary aid and sponsorship disbursements
- [ ] Record aid disbursements to beneficiaries.
- [ ] Track scheduled, approved, paid, delivered, cancelled, and failed disbursements.
- [ ] Link disbursements to sponsorships, donors, programs, and projects where applicable.
- [ ] Provide beneficiary aid history and sponsorship payment status.

### Grants and restricted funds
- [ ] Track grant awards, installments, restrictions, reporting requirements, and spending windows.
- [ ] Track restricted vs unrestricted balances.
- [ ] Prevent or flag spending restricted funds outside allowed purposes.
- [ ] Provide grant financial summary to institutional donor pages.

### Imports and integrations
- [ ] CSV import for bank statements and donation batches.
- [ ] Payment gateway import/webhook support later.
- [ ] Bank reconciliation workflow.
- [ ] Matching workflow for unmatched deposits to donors/campaigns/pledges.
- [ ] Duplicate detection for imported transactions.

### Approval workflows
- [ ] Approval rules by transaction type, amount, role, fund, project, and payment method.
- [ ] Authorization limits by role/user.
- [ ] Approval history with timestamps and comments.
- [ ] Rejection and revision workflow.
- [ ] Lock posted transactions from casual editing; use correction entries instead.

### Accounting setup
- [ ] Chart of accounts.
- [ ] Cost centers/programs/projects.
- [ ] Funds: restricted, unrestricted, zakat, waqf/endowment, grant-specific funds.
- [ ] Fiscal years and periods.
- [ ] Currencies and exchange rates.
- [ ] Payment methods, bank accounts, and payment gateways.

### Reporting and exports
- [ ] Donation report by donor, campaign, period, program, and fund.
- [ ] Project budget vs actual report.
- [ ] Beneficiary disbursement report.
- [ ] Grant spending report.
- [ ] Cashflow summary.
- [ ] Restricted fund balance report.
- [ ] Audit trail export.
- [ ] CSV/PDF export later.

---

## Data Needed By Donor Profile Overview

Financials must provide or power:
- [ ] Lifetime donations: sum of posted donation transactions for donor.
- [ ] Total gifts: count of posted donation transactions for donor.
- [ ] Last donation: latest posted donation transaction.
- [ ] Average gift: average posted donation amount.
- [ ] Programs supported: distinct programs/projects/funds linked to donations.
- [ ] Current pledge/proposal payment status.
- [ ] Receipt list/status for donations.
- [ ] Refund/void/correction status so giving summaries remain accurate.

Workflow rule:
- Users can click "Add donation" from the donor profile, but the action should create a Financials transaction/donation record.
- Users should not directly edit lifetime donation totals on the donor profile.

---

## Data Needed By Project Pages

Financials must provide or power:
- [ ] Approved project budget.
- [ ] Budget lines/categories.
- [ ] Actual expenses.
- [ ] Committed costs.
- [ ] Remaining budget and variance.
- [ ] Funding source allocation.
- [ ] Restricted fund compliance checks.
- [ ] Cost performance data used by monitoring reports.

---

## Data Needed By Beneficiary And Sponsorship Pages

Financials must provide or power:
- [ ] Financial aid records.
- [ ] Scheduled disbursements.
- [ ] Paid/delivered/cancelled aid status.
- [ ] Sponsorship payment status.
- [ ] Donor-to-beneficiary sponsorship payment linkage where applicable.
- [ ] Aid history for beneficiary profile.

---

## Data Needed By Institutional Donor Pages

Financials must provide or power:
- [ ] Grant award amount.
- [ ] Installment schedule.
- [ ] Received installments.
- [ ] Restricted fund balance.
- [ ] Grant-funded project spending.
- [ ] Required financial reporting dates.
- [ ] Grant closeout financial summary.

---

## Data Needed By Dashboard And Leadership

Financials must provide or power:
- [ ] Total donations/revenue by period.
- [ ] Expenses by period.
- [ ] Cash position.
- [ ] Fund balances.
- [ ] Campaign ROI.
- [ ] Project budget alerts.
- [ ] Overdue pledges and expected incoming funds.
- [ ] Failed payments or unreconciled transactions.

---

## Suggested Financials Page Sections

The future Financials page can be organized into these sections:
- Overview dashboard
- Transactions
- Donations and receipts
- Pledges/commitments
- Budgets
- Disbursements
- Grants/funds
- Reconciliation/imports
- Approvals
- Reports

Settings that may stay under Settings rather than the main Financials page:
- Chart of accounts
- Fiscal periods
- Bank accounts and payment gateways
- Approval workflow templates
- Currencies and exchange rates

---

## Permissions And Audit Requirements

- [ ] Separate permissions for view, create, approve, post, reconcile, refund, void, export, and configure.
- [ ] Every financial change must write an audit entry.
- [ ] Posted transactions should not be deleted.
- [ ] Corrections should be explicit reversal/adjustment records.
- [ ] Sensitive fields should be hidden from users without permission.

---

## Later Implementation Phases

### Phase A — Requirements confirmation
- [ ] Confirm which modules are in scope for the first Financials version.
- [ ] Confirm currency and fiscal-period requirements.
- [ ] Confirm approval workflow complexity.
- [ ] Confirm whether accounting needs double-entry from day one or starts as operational ledger.

### Phase B — Data model
- [ ] Design transactions, donations, pledges, budgets, disbursements, funds, receipts, and approvals tables.
- [ ] Define relationships to donors, projects, beneficiaries, campaigns, grants, and documents.
- [ ] Define summary/cache update strategy.

### Phase C — API
- [ ] Add transaction CRUD with approval/posting rules.
- [ ] Add donation creation endpoint used by donor profile.
- [ ] Add budget and disbursement endpoints.
- [ ] Add reporting summary endpoints.

### Phase D — Frontend
- [ ] Build Financials navigation and overview.
- [ ] Build transaction ledger.
- [ ] Build donation entry and receipt flow.
- [ ] Build project budget actuals workflow.
- [ ] Build beneficiary disbursement workflow.
- [ ] Build imports/reconciliation later.

### Phase E — Verification
- [ ] Verify donor summaries update from transactions.
- [ ] Verify project budget reports use financial actuals.
- [ ] Verify beneficiary aid history uses financial disbursements.
- [ ] Verify role permissions and audit trail.

