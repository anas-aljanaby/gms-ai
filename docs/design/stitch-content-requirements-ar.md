---
version: alpha
name: MSS.2 Content Requirements
description: Arabic-first content-only screen and workflow requirements for an authenticated SaaS web app. No visual design tokens are provided so Claude Design can decide the visual system.
---

# MSS.2 Arabic Content Requirements for Claude Design

## Overview

Create an authenticated Arabic web application for **MSS.2**, a SaaS platform for Gulf-region endowments and charitable institutions. The product connects strategic goals, KPIs, projects, donors, beneficiaries, stakeholders, reports, and operational tasks in one system.

Do not use this document to infer any specific color palette, typography, illustration style, theme, mood, or visual brand direction. Claude Design should decide the visual system. This document only defines the required screens, navigation, content, components, and functionality.

This requirements document is written in English for clarity, but the generated interface must be Arabic-first. Every visible UI string must be in Arabic and the full application must render right-to-left. It must also support light mode and dark mode, but Claude Design should decide the visual treatment for both.

## Arabic UI Requirements

Generate the actual UI in Arabic, not English. Use clear Modern Standard Arabic suitable for Gulf-region nonprofit, endowment, and institutional users.

Required language behavior:

- Set the app direction to RTL.
- Place the sidebar on the right side in Arabic layouts.
- Mirror drawers, breadcrumbs, navigation flow, steppers, timelines, tabs, and directional icons.
- Align Arabic text to the right.
- Keep numbers, currencies, percentages, dates, and KPIs easy to scan.
- Use Arabic labels for all navigation items, page titles, buttons, tabs, filters, table headers, form labels, modal titles, tooltips, empty states, notifications, and chart labels.
- Do not mix English labels into the generated UI except for unavoidable product names, acronyms, or abbreviations such as MSS.2, KPI, AI, SDG, PDF, CSV, and Excel.
- Use Arabic button labels such as إضافة, حفظ, إلغاء, تصدير, مشاركة, بحث, تصفية, عرض التقارير, إنشاء مشروع, and عرض التفاصيل.
- Use Arabic status labels such as نشط, مخطط, مكتمل, متوقف, عالي, متوسط, منخفض, متأخر, معرض للخطر, صحي, and يحتاج متابعة.
- The language toggle may show العربية and English, but the selected/default interface must be Arabic.

## Density and Surface Requirements

The generated app should not feel sparse, generic, or like disconnected cards floating on a blank page. It should feel like a mature operational system with enough content density for managers, executives, and program teams who review many records and KPIs daily.

Claude Design should decide the visual style, but the layout must avoid excessive whitespace and repetitive plain backgrounds.

Required density behavior:

- Use compact enterprise spacing, especially on desktop.
- Prefer information-rich cards, tables, drawers, and dashboards over large empty panels.
- Fill dashboard and list pages with realistic sample data so the product feels active.
- Keep card content concise but meaningful: show status, owner, date, progress, linked goal, amount, next action, or risk where relevant.
- Use more than one surface level so the app does not appear as the same background everywhere.
- Separate major page regions with clear sectioning, surface changes, dividers, rails, bands, panels, or other visual structure chosen by Claude Design.
- Use dense but readable headers for pages: title, subtitle, primary actions, filters, and key context should appear together.
- Use right-side insight rails on complex desktop pages instead of leaving wide empty margins.
- Make list and project pages feel populated even when using cards; avoid layouts where a few cards leave most of the canvas empty.
- Charts should have axes, labels, legends, comparison context, and realistic values where appropriate.
- Tables should show enough columns to feel useful, while remaining readable.
- Detail drawers should contain several meaningful sections, not only a profile card and one small table.
- Empty states should only appear when the page is intentionally empty; default generated examples should show active data.

Avoid these layout outcomes:

- A large white or plain background with only a few isolated cards.
- Huge gaps between components.
- Oversized cards with very little text or metadata.
- Repeating the same card surface for every part of the screen without hierarchy.
- Dashboards where the main content area feels less important than the sidebar.
- AI panels that feel like decorative widgets rather than useful operational analysis.

## Layout

The app is an authenticated SaaS dashboard, not a landing page.

Required global shell:

- Collapsible sidebar with expanded and icon-only states.
- Logo or product identity area.
- Role-aware navigation.
- Logout action at the bottom of the sidebar.
- Global header with search, language toggle, role switcher, notifications, and user/profile controls.
- Mobile navigation with hamburger access for secondary navigation and a bottom navigation bar for primary destinations.
- Main content area for page-specific workflows.
- Optional right-side panel for contextual AI insights, quick actions, alerts, or recommendations.

Primary navigation groups:

- لوحة التحكم
- بوصلة
- المتبرعون الأفراد
- المانحون المؤسسيون
- المستفيدون
- المشاريع
- أصحاب المصلحة
- الإعدادات
- المساعدة والدعم

User roles:

- مدير النظام
- مدير
- موظف
- متطوع

Navigation visibility and available actions should vary by role where appropriate.

## Elevation & Depth

No specific depth, shadow, border, glass, or surface treatment is prescribed. Claude Design should decide how surfaces, panels, modals, drawers, sticky areas, and overlays should look. However, the interface must not be visually flat or dominated by one uninterrupted background.

Required structural behaviors:

- Header remains globally available.
- Sidebar can collapse.
- Right insight panels may be sticky on desktop.
- Drawers slide in for details.
- Modals appear above the current workflow.
- Drag-and-drop items show clear moving and dropped states.
- Main work areas use visible hierarchy between page background, section areas, cards, tables, drawers, and rails.
- Dense pages such as Dashboard, Bousala, Projects, and Donors should use layered regions so users can understand what belongs together.

## Shapes

No specific corner radius, shape language, icon style, or decorative motif is prescribed. Claude Design should decide.

Required structural patterns:

- Buttons for actions.
- Tabs for switching views.
- Segmented controls or toggles for view modes.
- Form fields for data entry.
- Cards or rows for repeated records.
- Tables for sortable data.
- Drawers for details.
- Modals for creation and confirmation flows.
- Badges for status, type, category, role, and AI indicators.

## Components

### Common App Components

Use these across the application:

- Global search.
- Language toggle for English and Arabic.
- Role switcher for demo purposes.
- Notifications bell.
- Light/dark mode control.
- Sidebar navigation.
- Mobile bottom navigation.
- Empty states with a clear CTA.
- Skeleton loaders.
- Toast notifications for success, error, warning, and info.
- Confirmation dialogs for destructive actions.
- Centered form modals.
- Detail drawers.
- Search fields with microphone button for voice search on major list pages.
- AI indicator for AI-powered features.
- Global AI assistant FAB.
- Feedback FAB.
- Export actions.
- Share actions where relevant.
- Filters and advanced filters.
- Sort controls.
- View toggles.
- Pagination or infinite loading for large datasets.

### Dashboard

Purpose: personalized operational overview after login.

Required content and components:

- Alerts ticker with urgent notifications and click-through behavior.
- KPI cards row with 4 smart cards.
- KPI card content: metric value, label, trend sparkline, status indicator, short context, owner or department, and latest update time where useful.
- Controls bar with time period filter, department filter, customize layout, export, and share.
- Customizable widget grid with drag-and-drop behavior.
- Widget: donations or funding chart.
- Widget: project milestone timeline.
- Widget: priority matrix for impact versus urgency.
- Widget: year-over-year comparison bars.
- Widget: favorite report shortcut.
- Widget: onboarding or getting-started checklist.
- Sticky AI Insights panel.
- Quick Actions hub.
- Layout customizer slide-in panel.
- Layout customizer controls: widget toggles, Executive preset, Manager preset, Analyst preset, undo, redo, and save.
- Dashboard default state should look populated and operational, not sparse. Use compact widgets, dense KPI summaries, realistic alerts, and multiple visible work areas.

### Bousala

Purpose: strategic compass and core product area. Bousala connects organizational goals to KPIs, projects, tasks, and outcomes.

Required header content:

- Page title: بوصلة.
- Subtitle: منصة ذكية لإدارة الأهداف والمشاريع.
- Toolbar actions: إضافة هدف, إضافة مهمة, عرض التقارير, الإعدادات, وضع العرض, and AI indicator.
- Tabs: لوحة التحكم and التنبؤات.

Dashboard tab requirements:

- Optional Smart Alerts panel for KPI deviations.
- Goals accordion list.
- Each goal summary includes title, description, responsible person, deadline, overall progress, health/status, linked KPI count, linked project count, and next review date.
- Expanded goal content includes linked KPI cards.
- Expanded goal content includes linked projects list.
- Expanded goal content includes linked tasks list.
- KPI cards show value, target, unit, trend, and AI prediction badge.
- Project rows show name, status, progress, owner, and relationship to the goal.
- Task rows show title, due date, priority, owner, and status.
- Goal actions: Add KPI, Add Task, Link Project, AI task suggestions, and AI risk prediction.
- Right AI panel with accordion sections.
- AI panel sections: Task Suggestions, KPI Insights, Risk Predictions, and Analytics Summary.
- Charts section below goals.
- Chart: KPI trend lines.
- Chart: goal completion donut.
- Bousala should make the goal to KPI to project to task relationship visually obvious and information-rich. Avoid showing only a small number of isolated cards on a blank canvas.

Predictive tab requirements:

- Forecast dashboard.
- Trend projections.
- Scenario analysis controls.
- Confidence indicators.
- Recommended actions.
- Plain-language explanation of the prediction.

Bousala modals:

- Add Goal modal with title, description, progress percentage, and responsible person.
- Add KPI modal with title, current value, target, unit, and linked goal.
- Add Task modal with title, linked goal, due date, and priority.
- Link Project modal with multi-select list of existing projects.
- Report Generation modal with report type, date range, and export format.

### Individual Donor Management

Purpose: manage individual donors through a relationship pipeline with AI-assisted enrichment.

Required content and components:

- Summary stats bar.
- Stats: total donors, total donated, retention rate, and average donation.
- Toolbar with search, voice input, filters, view toggle, export, and add donor button.
- Tabs: Pipeline, List, Map, and Briefcase.

Pipeline view:

- Kanban columns: Prospect, Cultivating, Active, and Lapsed.
- Donor cards inside each column.
- Drag-and-drop movement between stages.

List view:

- Sortable and filterable table.
- Rows open donor detail drawer or panel.

Map view:

- Geographic map showing donor locations.

Donor detail drawer:

- Profile header with name.
- Category badge.
- Relationship health indicator.
- Tabs: Overview, Donation History, Tasks, and AI Profile.
- AI Profile includes donor classification and engagement recommendations.

Add Donor modal:

- Name.
- Contact information.
- Category.
- Source.

### Institutional Donors

Purpose: manage grants, foundations, government bodies, and corporate donors.

Required content and components:

- KPI summary row.
- KPIs: total funding received, pipeline value, high-priority count, and upcoming grant deadlines within 90 days.
- Toolbar with search, voice input, filters, view toggle, export, and add institution button.
- Tabs: Directory, Map, Analytics, and Partnership Opportunities.

Directory view:

- Table or card grid of institutional donors.
- Filters by type, status, and priority.
- Institution types include Foundation, Government, Corporate, and other configurable types.

Map view:

- Geographic distribution of institutional donors.

Analytics tab:

- Funding distribution by type.
- Status breakdown.
- Funding trend over time.

Partnership Opportunities tab:

- Match cards between institution interests and organizational programs.

Institutional donor detail drawer:

- Profile information.
- Grant history.
- Reporting obligations.
- Contact log.
- Next deadline alert.

Add Institution modal:

- Name.
- Type.
- Country.
- Contact.
- Grant amount.
- Status.
- Deadlines.

### Beneficiary Management

Purpose: unified registry of program beneficiaries across sponsorships, education, orphan care, incubation, and other programs.

Required content and components:

- Stats bar.
- Total beneficiaries count.
- Breakdown by beneficiary type.
- Category filter tabs: All, Students, Sponsored, Orphans, Incubation, and other configurable categories.
- Toolbar with search, voice input, advanced filters, view toggle, export, and add beneficiary button.
- View toggle: Card Grid, List, Map, and Briefcase.

Card grid:

- Beneficiary cards with photo placeholder.
- Name.
- Type badge.
- Program information.

List view:

- Sortable data table.

Map view:

- Geographic distribution.

Beneficiary detail drawer:

- Profile information.
- Contact information.
- Program enrollment.
- Tabs: Overview, Sponsorships, Services Received, and Documents.
- Orphan sub-profile when relevant.

Add Beneficiary modal:

- Name.
- Type.
- Contact.
- Program assignment.

Beneficiary Portal modal:

- Self-service portal view for beneficiary-facing access.

### Project Management

Purpose: track organizational programs and initiatives with milestones, budgets, team assignments, beneficiaries, and reports.

Required content and components:

- Toolbar with search, filter by status, filter by category, sort, and create project button.
- View toggle: Project List and SDG Alignment.

Project List view:

- Cards or table rows per project.
- Project name.
- Category icon.
- Status badge.
- Progress bar.
- Budget used and total budget.
- Start and end dates.
- Linked strategic goal.
- Project owner.
- Next milestone.
- Risk or attention indicator.
- Categories: Community Service, Research, Innovation, Leadership, Environmental, Educational, and Cultural.
- Status values: Active, Planned, Completed, and On Hold.
- Project list should show enough projects to fill the workspace and should support both dense table view and compact card view.

SDG Alignment view:

- Matrix or chart linking projects to UN Sustainable Development Goals.

Project detail view:

- Full-page view that replaces the list.
- Header with project name, status, category, dates, and budget used/total.
- Tabs: Overview, Milestones and Timeline, Budget, Team, Beneficiaries, Reporting, and Documents.
- Reporting tab has exportable report cards.
- Report cards: Overview, Tasks, Budget, and Progress/Timeline.
- Report cards can be pinned or favorited.

Create Project wizard:

- Step 1: Basic info.
- Step 2: Category.
- Step 3: Milestones.
- Step 4: Team.
- Step 5: Budget.
- Step 6: Review.

### Stakeholder Management

Purpose: track trustees, regulators, partners, media, and key contacts with engagement levels.

Required content and components:

- Stats row.
- Stats: total stakeholders, influence breakdown, active engagements, and alerts count.
- Toolbar with search, voice input, type filter, view toggle, export, and add stakeholder button.
- View toggle: Cards, Table, and Matrix.

Card view:

- Stakeholder cards with name.
- Type badge.
- Influence indicator.
- Interest indicator.
- Last contact date.

Table view:

- Sortable data table.

Matrix view:

- Interactive 2x2 influence-versus-interest matrix.
- Stakeholders plotted as interactive nodes.

Stakeholder detail drawer:

- Profile.
- Type.
- Organization.
- Contact information.
- Tabs: Overview, Engagement Log, Related Projects, and Documents.

Add Stakeholder modal:

- Name.
- Type.
- Organization.
- Influence level.
- Interest level.
- Contact information.

### Settings

Purpose: organizational and user configuration.

Required content and components:

- Language preferences.
- Enabled language toggles.
- Theme controls for light and dark mode.
- User profile.
- Notification preferences.
- Role and permissions overview.
- Save and cancel actions where settings are editable.

### Help and Support

Purpose: self-service learning and support.

Required content and components:

- FAQ accordion.
- Video tutorials grid.
- Interactive tutorials or walkthroughs.
- Contact or feedback entry point.
- Search or category filtering for help content.

## Do's and Don'ts

Do:

- Preserve all required pages and workflows.
- Start with the authenticated Dashboard, not a marketing page.
- Make Bousala a complete strategic goal, KPI, project, and task management surface.
- Make pages feel populated, data-rich, and operational by default.
- Use visual hierarchy and surface variation chosen by Claude Design so the app does not feel like plain cards on one blank background.
- Include required tabs, modals, drawers, tables, cards, filters, charts, and view toggles.
- Make the interface responsive.
- Support RTL layout behavior.
- Include light and dark mode behavior.
- Keep actions discoverable on desktop.
- Use clear labels for all major controls.
- Show empty, loading, error, and success states.

Don't:

- Do not define or imply any color palette.
- Do not define or imply any typography choices.
- Do not define or imply a visual theme, tone, illustration style, mood, or brand style.
- Do not reuse the current demo frontend styling.
- Do not create a landing page.
- Do not create sparse screens with excessive whitespace.
- Do not use the same plain background treatment everywhere.
- Do not show oversized cards with too little information.
- Do not omit Bousala functionality.
- Do not remove AI, voice search, export, filters, modals, drawers, or role-aware navigation.
- Do not create layouts that only work left-to-right.
