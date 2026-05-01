# Frontend Design Brief — MSS.2 (GMS-AI)

## Product Overview

**MSS.2** is a SaaS platform for Gulf-region endowments (Awqaf) and charitable institutions. It connects strategic goals → KPIs → projects → outcomes in one system, enabling leadership to prove sustainability and alignment to boards and regulators.

**Tone:** Professional, data-dense, trustworthy. Comparable to enterprise tools like Asana or Salesforce — but purpose-built for Islamic endowment context.

**Language:** English UI, with full RTL (Arabic) support required on all layouts.

**User roles:** Admin, Manager, Staff, Volunteer (role affects sidebar visibility and permissions).

---

## Global Layout

```
┌─────────────┬────────────────────────────────────────┐
│             │  Header (search, role switcher, lang)  │
│   Sidebar   ├────────────────────────────────────────│
│  (collap-   │                                        │
│   sible)    │        Page Content Area               │
│             │                                        │
└─────────────┴────────────────────────────────────────┘
```

- **Sidebar:** Collapsible (icon-only ↔ full-label). Has logo at top, nav items in middle, logout at bottom. On mobile: hidden behind hamburger + bottom navigation bar.
- **Header:** Global search, language toggle (EN/AR), role switcher (for demo), notifications bell.
- **Theme:** Light and dark mode required.
- **Mobile:** Bottom nav bar replaces sidebar for primary navigation.

---

## Pages

### 1. Dashboard

**Purpose:** Personalized operational overview. The first thing users see after login.

**Key sections:**
- **Alerts ticker** — horizontal scrolling banner of urgent notifications (clickable to navigate).
- **KPI cards row** — 4 smart cards showing key operational metrics (e.g. pending sponsorships, overdue tasks, projects at risk, funds to disburse). Each card shows value, trend sparkline, and status indicator.
- **Customizable widget grid** — drag-and-drop grid of optional widgets:
  - Donations/funding chart (bar/line)
  - Timeline view (project milestones)
  - Priority matrix (impact vs. urgency grid)
  - Year-over-year comparison bars
  - Favorite report shortcut card
  - Onboarding/getting-started checklist
- **AI Insights panel** — sticky right column showing AI-generated analysis and recommendations.
- **Quick Actions hub** — sticky right column section with shortcut buttons to common tasks.
- **Controls bar** — time period filter, department filter, "Customize Layout" button, export, share.
- **Layout customizer** — slide-in panel to toggle widgets on/off, apply preset layouts (Executive / Manager / Analyst), undo/redo.

---

### 2. Bousala (Strategic Compass)

**Purpose:** The core differentiator. Connects organizational strategy to execution. Admin/Manager only.

**Header area:**
- Page title + subtitle ("Smart goals and projects management platform")
- Toolbar: Add Goal, Add Task, View Reports, Settings (gear), Presentation Mode toggle, AI indicator

**Tabs:**
- **Dashboard tab** — main goal management view
- **Predictive tab** — AI-powered forecasting and trend analysis

**Dashboard tab layout:**
- **Smart Alerts panel** (optional, toggleable) — real-time alerts about KPI deviations
- **Goals accordion list** — each goal is an expandable card:
  - Goal title, description, responsible person, deadline, overall progress bar
  - On expand: linked KPI cards (value/target/unit/trend/AI prediction badge), linked projects list with progress, linked tasks list with status
  - Action buttons per goal: Add KPI, Add Task, Link Project, AI task suggestions, AI risk prediction
- **Right sidebar (AI panel):**
  - Accordion sections: Task suggestions, KPI Insights, Risk predictions
  - AI analytics summary text generated from goal data
- **Charts section (below goals):**
  - KPI trend line charts
  - Goal completion donut chart

**Predictive tab:** AI-driven forecasting dashboard with trend projections and scenario analysis.

**Modals (triggered from Bousala):**
- Add Goal modal (title, description, progress %, responsible person)
- Add KPI modal (title, current value, target, unit, link to goal)
- Add Task modal (title, link to goal, due date, priority)
- Link Project modal (multi-select list of existing projects)
- Report Generation modal (select report type, date range, format)

---

### 3. Donor Management (Individual)

**Purpose:** Track individual donors through a relationship pipeline, with AI-assisted enrichment.

**Key sections:**
- **Summary stats bar** — total donors, total donated, retention rate, avg donation
- **Tab bar:** Pipeline / List / Map / Briefcase (views)
- **Pipeline view (Kanban):** Donors as cards organized in columns by relationship stage (Prospect → Cultivating → Active → Lapsed). Drag to move between stages.
- **List view:** Sortable/filterable table with donor rows. Clicking opens detail panel.
- **Map view:** Geographic map showing donor locations.
- **Donor detail panel / drawer:**
  - Profile header (name, category badge, relationship health indicator)
  - Tabs within detail: Overview, Donation History, Tasks, AI Profile
  - AI Profile tab: AI-generated donor classification and engagement recommendations
- **Add Donor modal:** Form with name, contact info, category, source
- **Toolbar:** Search (with voice input), filters, view toggle, export, add button
- **AI features:** Donor intelligence classification, voice search

---

### 4. Institutional Donors

**Purpose:** Manage grants, foundations, government bodies, and corporate donors.

**Key sections:**
- **KPI summary row:** Total funding received, pipeline value, high-priority count, upcoming grant deadlines (within 90 days)
- **Tab bar:** Directory / Map / Analytics / Partnership Opportunities
- **Directory view:** Table or card grid of institutional donors. Filterable by type (Foundation, Government, Corporate, etc.), status, priority.
- **Map view:** Geographic distribution of institutional donors.
- **Analytics tab:** Charts showing funding distribution by type, status breakdown, trend over time.
- **Partnership Opportunities tab:** Surfaced matches between institution interests and org's programs.
- **Donor detail panel:** Profile info, grant history, reporting obligations, contact log, next deadline alert.
- **Add Institution modal:** Name, type, country, contact, grant amount, status, deadlines.
- **Toolbar:** Search (with voice), filters, view toggle, export, add button.

---

### 5. Beneficiary Management

**Purpose:** Unified registry of all program beneficiaries across sponsorships, education, orphan care, and other programs.

**Key sections:**
- **Stats bar:** Total beneficiaries count, breakdown by type (student, sponsored, orphan, incubation, etc.)
- **Category filter tabs:** All / Students / Sponsored / Orphans / Incubation / etc.
- **View toggle:** Card grid / List / Map / Briefcase
- **Card grid:** Beneficiary cards with photo placeholder, name, type badge, program info
- **List view:** Sortable data table
- **Map view:** Geographic distribution
- **Beneficiary detail panel:**
  - Profile (name, type, contact, program enrollment)
  - Tabs: Overview, Sponsorships, Services Received, Documents
  - Orphan sub-profile (additional orphan-specific case data)
- **Add Beneficiary modal:** Name, type, contact, program assignment
- **Beneficiary Portal modal:** Self-service portal view for beneficiary-facing access
- **Toolbar:** Search (with voice), advanced filters, view toggle, export, add button

---

### 6. Project Management

**Purpose:** Track organizational programs and initiatives with milestones, budgets, and team assignments.

**Key sections:**
- **View toggle:** Project List / SDG Alignment
- **Project List view:**
  - Cards or table rows per project showing name, category icon, status badge, progress bar, budget, dates
  - Category icons: Community Service, Research, Innovation, Leadership, Environmental, Educational, Cultural
  - Status: Active, Planned, Completed, On Hold
- **SDG Alignment view:** Matrix or chart linking projects to UN Sustainable Development Goals
- **Project detail view (full-page, replaces list):**
  - Header: project name, status, category, dates, budget used/total
  - Tabs: Overview, Milestones & Timeline, Budget, Team, Beneficiaries, Reporting, Documents
  - Reporting tab: exportable report cards (Overview, Tasks, Budget, Progress/Timeline) with favorite-star pinning
- **Create Project wizard:** Multi-step form (basic info → category → milestones → team → budget → review)
- **Toolbar (list view):** Search, filter by status/category, sort, create project button

---

### 7. Stakeholder Management

**Purpose:** Track trustees, regulators, partners, key contacts and their engagement levels.

**Key sections:**
- **Stats row:** Total stakeholders, by influence level, active engagements, alerts count
- **View toggle:** Cards / Table / Matrix
- **Card grid:** Stakeholder cards with name, type badge, influence/interest indicators, last contact date
- **Table view:** Sortable data table
- **Matrix view:** 2×2 influence-vs-interest matrix with stakeholder plotted as nodes (interactive)
- **Stakeholder detail panel:**
  - Profile, type, organization, contact info
  - Tabs: Overview, Engagement Log, Related Projects, Documents
- **Add Stakeholder modal:** Name, type (Trustee, Partner, Regulator, Media, etc.), organization, influence level, interest level, contact info
- **Toolbar:** Search (with voice), filter by type, view toggle, export, add button

---

### 8. Settings

**Purpose:** Organizational and user configuration.

**Key sections:**
- Language preferences (enabled languages toggle)
- Theme (light/dark)
- User profile
- Notification preferences
- Role and permissions overview

---

### 9. Help & Support

**Purpose:** Self-service learning resources.

**Key sections:**
- FAQ accordion
- Video tutorials grid
- Interactive tutorials / walkthroughs
- Contact / feedback link

---

## Common UI Patterns

- **Empty states:** Illustrated placeholder with CTA when a list has no items.
- **Skeleton loaders:** Animated placeholders during data fetch.
- **Toast notifications:** Success / Error / Warning / Info — appear top-right.
- **Modals:** Centered overlay with backdrop blur. Form modals have clear save/cancel actions.
- **Detail panels:** Slide-in from right (drawer) or full-page replacement depending on context.
- **Voice search:** Microphone button on search fields (all major list pages).
- **AI indicators:** Subtle "AI" or sparkle badge on AI-powered features.
- **Confirmation dialogs:** For destructive actions.
- **Floating AI button (FAB):** Global AI assistant shortcut (bottom-right corner).
- **Feedback FAB:** User feedback button (bottom-right, separate from AI FAB).
