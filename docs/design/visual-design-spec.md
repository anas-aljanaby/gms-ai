---
version: alpha
name: MSS.2 Strategic Command Room
description: A board-ready SaaS interface for Gulf awqaf and charitable institutions, centered on strategic goal alignment, KPI accountability, and operational evidence.
colors:
  primary: "#0E3B2E"
  primary_hover: "#0A2E24"
  on_primary: "#F8FFFB"
  primary_soft: "#DDEFE6"
  secondary: "#24303A"
  secondary_soft: "#E7ECEF"
  tertiary: "#8C4D22"
  tertiary_soft: "#F4E5D8"
  accent: "#066B66"
  accent_soft: "#D8F0EE"
  ink: "#17201D"
  muted: "#5E6A66"
  border: "#D8DEDB"
  surface: "#F7F9F6"
  surface_raised: "#FFFFFF"
  surface_subtle: "#EEF3EF"
  dark_surface: "#0C1210"
  dark_surface_raised: "#141B18"
  dark_border: "#2B3833"
  success: "#1F7A4D"
  warning: "#B77818"
  danger: "#B42318"
  info: "#2563A9"
  focus: "#0B6F68"
typography:
  display_lg:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 40px
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: 0px
  h1:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: 0px
  h2:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 620
    lineHeight: 1.25
    letterSpacing: 0px
  h3:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 620
    lineHeight: 1.35
    letterSpacing: 0px
  body_lg:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0px
  body_md:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body_sm:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0px
  label_md:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0px
  caption:
    fontFamily: IBM Plex Sans, IBM Plex Sans Arabic, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: 0px
  metric_lg:
    fontFamily: IBM Plex Mono, IBM Plex Sans Arabic, ui-monospace, monospace
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: 0px
  metric_md:
    fontFamily: IBM Plex Mono, IBM Plex Sans Arabic, ui-monospace, monospace
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0px
rounded:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px
components:
  app_shell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body_md}"
  app_shell_dark:
    backgroundColor: "{colors.dark_surface}"
    textColor: "{colors.on_primary}"
    typography: "{typography.body_md}"
  sidebar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on_primary}"
    width: 280px
  sidebar_collapsed:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on_primary}"
    width: 72px
  header:
    backgroundColor: "{colors.surface_raised}"
    textColor: "{colors.ink}"
    height: 64px
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.secondary}"
    height: 1px
  divider_dark:
    backgroundColor: "{colors.dark_border}"
    textColor: "{colors.on_primary}"
    height: 1px
  page_panel:
    backgroundColor: "{colors.surface_raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  page_panel_subtle:
    backgroundColor: "{colors.surface_subtle}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    padding: 20px
  card:
    backgroundColor: "{colors.surface_raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 20px
  card_dark:
    backgroundColor: "{colors.dark_surface_raised}"
    textColor: "{colors.on_primary}"
    rounded: "{rounded.md}"
    padding: 20px
  button_primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on_primary}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 12px
  button_primary_hover:
    backgroundColor: "{colors.primary_hover}"
    textColor: "{colors.on_primary}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 12px
  button_secondary:
    backgroundColor: "{colors.secondary_soft}"
    textColor: "{colors.secondary}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 12px
  button_accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on_primary}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 12px
  input:
    backgroundColor: "{colors.surface_raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body_md}"
    rounded: "{rounded.sm}"
    padding: 12px
  tab_active:
    backgroundColor: "{colors.primary_soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 10px
  tab_inactive:
    backgroundColor: "{colors.surface_raised}"
    textColor: "{colors.muted}"
    typography: "{typography.label_md}"
    rounded: "{rounded.sm}"
    padding: 10px
  ai_badge:
    backgroundColor: "{colors.accent_soft}"
    textColor: "{colors.accent}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px
  status_success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on_primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px
  status_warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px
  status_danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on_primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px
  status_info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on_primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px
  chart_highlight:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on_primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 4px
  chart_highlight_soft:
    backgroundColor: "{colors.tertiary_soft}"
    textColor: "{colors.tertiary}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 4px
  focus_ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.on_primary}"
    rounded: "{rounded.full}"
    padding: 4px
---

# MSS.2 Design System

## Overview

MSS.2 should feel like a strategic command room for Gulf-region awqaf and charitable institutions: calm, exacting, financially literate, and ready to be shown to a board. The interface is not a donation campaign, not a startup demo, and not a generic CRM; it is an evidence layer that connects strategy, KPIs, projects, funding, beneficiaries, and obligations.

The signature visual idea is the Compass Spine: a persistent vertical or horizontal lineage pattern that shows goal health, KPI movement, linked projects, and outcome evidence in one readable chain. Use it most strongly in Bousala, and echo it subtly in dashboard widgets, detail drawers, timelines, and report cards.

Design for English first with complete RTL readiness for Arabic. Every major layout must mirror cleanly, preserve alignment, and keep numeric data legible in both directions. Light and dark mode are required.

## Colors

The palette should be sober and institutional without becoming cold. Deep waqf green is the anchor for navigation and primary actions, charcoal carries text and structure, teal marks AI and live intelligence, and copper marks board-level highlights or financial inflection points. The UI should avoid the current demo theme entirely: do not reuse its colors, decorative habits, gradients, or tone.

- **Primary / Deep Waqf Green (#0E3B2E):** Main navigation, primary actions, strategy anchors, selected states, and Bousala goal lineage.
- **Secondary / Charcoal Ledger (#24303A):** Dense text, table headers, structural separators, and utilitarian controls.
- **Accent / Signal Teal (#066B66):** AI indicators, live analysis, predictive insights, voice search, and selected analytical overlays.
- **Tertiary / Burnished Copper (#8C4D22):** Important funding, board-ready insights, fiscal risk, report pins, and momentary emphasis. Use sparingly.
- **Surface / Pearl Ledger (#F7F9F6):** App background. Keep it near-neutral, not warm beige and not pure white.
- **Dark surfaces (#0C1210 and #141B18):** Dark mode should feel like a control room, with green and teal accents kept vivid enough for contrast.
- **Status colors:** Success green, warning amber, danger red, and information blue are only for state communication. Do not use them decoratively.

Charts should use the same semantic palette rather than random categorical colors. Goal health should always map consistently: green for healthy, amber for watch, red for at risk, blue for informational, teal for AI forecast, copper for funding emphasis.

## Typography

Use **IBM Plex Sans** for Latin text and **IBM Plex Sans Arabic** for Arabic text. This pairing feels institutional, multilingual, and data-ready without sounding like a consumer app. Use **IBM Plex Mono** only for large metrics, financial totals, compact IDs, timestamps, and tabular numeric columns.

Headings should be confident but not oversized. Dashboard and Bousala pages are working surfaces, so avoid marketing-scale hero typography except for empty states or onboarding. Body text should stay compact, usually 14px, because users scan dense operational information. Labels use weight and color for hierarchy, not letter spacing.

In Arabic RTL layouts, keep line heights generous enough for Arabic glyphs and mirror icon placement. Numbers in KPI cards, tables, and charts should remain easy to compare; use tabular numeric styling when available.

## Layout

Use a persistent enterprise shell: collapsible sidebar, global header, page content area, and optional right insight rail. Desktop pages should make the product feel like a mission-control workspace, not a brochure. Mobile should replace the sidebar with a bottom navigation bar and keep primary actions reachable with one hand.

Core dimensions:

- Sidebar: 280px expanded, 72px collapsed.
- Header: 64px high with global search, language toggle, role switcher, notification bell, and profile affordance.
- Right insight rail: 336px to 380px on desktop for AI insights, quick actions, alerts, and contextual recommendations.
- Page gutters: 24px desktop, 16px tablet, 12px mobile.
- Primary grid: 12 columns on desktop, 8 on tablet, 4 on mobile.
- Cards and panels: 20px to 24px internal padding on desktop, 16px on mobile.

Favor split operational layouts: main work area plus a persistent intelligence/action rail. Use full-width bands or unframed page sections for major page regions; reserve cards for repeated records, widgets, modals, and focused tools. Avoid nesting cards inside cards.

For RTL, mirror sidebar position, drawers, breadcrumb direction, table alignment, search icon placement, stepper flow, and timeline direction. Data tables should keep numeric comparison aligned consistently.

## Elevation & Depth

The product should feel precise and layered, but never glossy. Use thin borders, subtle shadow, and surface changes more than heavy elevation. The main background is quiet; panels sit on raised white or dark raised surfaces. Important drawers and modals may use backdrop blur, but keep it restrained.

Recommended depth language:

- Base pages are flat, with a faint grid or divider rhythm from borders.
- Cards use 1px borders and a soft shadow only on hover or when interactive.
- Sticky rails and headers use a slightly stronger lower border instead of a dramatic shadow.
- Modals use a soft shadow and clear scrim.
- Drag-and-drop widgets and Kanban cards use a lifted state while moving, then settle back into flat surfaces.

## Shapes

Use mostly squared, disciplined geometry with small radii. Cards and panels use 8px radius. Buttons and inputs use 4px radius. Pills are allowed only for compact status, AI, role, type, and category badges. Avoid bubbly shapes, oversized rounded cards, and decorative blobs.

The Compass Spine motif may use thin connected segments, nodes, status dots, bracket lines, and progress rails. It should feel like strategy infrastructure, not ornament. If using Islamic visual influence, keep it abstract and structural through alignment, proportion, and rhythm rather than literal pattern decoration.

## Components

### Application Shell

The shell must include a collapsible sidebar, logo area, role-aware navigation, logout at the bottom, global header, notifications, EN/AR language toggle, role switcher for demo use, light/dark theme toggle, and global search. On mobile, use a hamburger for secondary navigation and a bottom navigation bar for primary pages.

Sidebar navigation should group modules by purpose:

- Strategy: Dashboard, Bousala.
- Relationships: Individual Donors, Institutional Donors, Stakeholders.
- Delivery: Beneficiaries, Projects.
- Platform: Settings, Help and Support.

### Dashboard

The Dashboard is the personalized operational overview after login. It should prioritize alerts, key operational health, AI interpretation, and quick action.

Required components:

- Alerts ticker: horizontal, clickable, compact, severity-coded.
- KPI cards row: 4 smart cards with value, trend sparkline, status indicator, and short explanatory label.
- Controls bar: time period filter, department filter, customize layout, export, and share.
- Customizable widget grid: donations/funding chart, timeline view, priority matrix, year-over-year comparison bars, favorite report shortcut, and onboarding checklist.
- Sticky AI Insights panel: right rail with analysis, risk notes, and recommendations.
- Quick Actions hub: right rail buttons for common tasks.
- Layout customizer: slide-in panel with widget toggles, Executive/Manager/Analyst presets, undo, redo, and save.

Make the default dashboard feel dense but navigable. The right rail should not compete with the main KPI row; it should read like an advisor beside the work.

### Bousala

Bousala is the core product. Give it the strongest visual identity and most polished interaction model. It must show how strategic goals connect to KPIs, projects, tasks, and outcomes.

Header requirements:

- Page title and subtitle: "Smart goals and projects management platform".
- Toolbar: Add Goal, Add Task, View Reports, Settings, Presentation Mode toggle, and AI indicator.
- Tabs: Dashboard and Predictive.

Dashboard tab requirements:

- Optional Smart Alerts panel with real-time KPI deviations.
- Goals accordion list using the Compass Spine motif.
- Each goal summary shows title, description, responsible person, deadline, overall progress, and health status.
- Expanded goals show linked KPI cards, linked projects, linked tasks, trend, target, unit, and AI prediction badge.
- Per-goal actions: Add KPI, Add Task, Link Project, AI task suggestions, and AI risk prediction.
- Right AI panel with accordion sections for task suggestions, KPI insights, risk predictions, and AI analytics summary.
- Charts below goals: KPI trend lines and goal completion donut.

Predictive tab requirements:

- Forecast cards, scenario controls, trend projections, confidence indicators, and explanation text.
- AI language should be clear and accountable. Avoid magical phrasing; show confidence, data source, and recommended next action.

Modals required from Bousala:

- Add Goal, Add KPI, Add Task, Link Project, and Report Generation.

### Individual Donor Management

This page manages individual donors through a relationship pipeline with AI-assisted enrichment.

Required components:

- Summary stats bar: total donors, total donated, retention rate, and average donation.
- Tabs: Pipeline, List, Map, and Briefcase.
- Pipeline Kanban: Prospect, Cultivating, Active, and Lapsed columns with draggable donor cards.
- List table: sortable, filterable, clickable rows.
- Map view: donor locations with clustering.
- Donor detail drawer: profile header, category badge, relationship health, Overview, Donation History, Tasks, and AI Profile tabs.
- Add Donor modal.
- Toolbar: search with voice input, filters, view toggle, export, and add button.

Donor screens should feel relational but not sentimental. Use health indicators, contact recency, and recommended next action prominently.

### Institutional Donors

This page manages grants, foundations, government bodies, and corporate donors.

Required components:

- KPI row: total funding received, pipeline value, high-priority count, and upcoming grant deadlines within 90 days.
- Tabs: Directory, Map, Analytics, and Partnership Opportunities.
- Directory table or card grid with filters for type, status, and priority.
- Map view for geographic distribution.
- Analytics charts for funding distribution, status breakdown, and trend over time.
- Partnership match cards between institution interests and organizational programs.
- Detail drawer with profile, grant history, reporting obligations, contact log, and next deadline alert.
- Add Institution modal.
- Toolbar: search with voice, filters, view toggle, export, and add button.

Deadlines and reporting obligations should have strong information architecture. They are board and compliance risks, not minor metadata.

### Beneficiary Management

This page is a unified registry across sponsorships, education, orphan care, incubation, and other programs.

Required components:

- Stats bar: total beneficiaries and breakdown by type.
- Category filter tabs: All, Students, Sponsored, Orphans, Incubation, and additional configured categories.
- View toggle: Card Grid, List, Map, and Briefcase.
- Card grid with photo placeholder, name, type badge, and program info.
- Sortable list table.
- Map view for geographic distribution.
- Beneficiary detail drawer with Profile, Overview, Sponsorships, Services Received, and Documents.
- Orphan sub-profile area when beneficiary type is orphan.
- Add Beneficiary modal.
- Beneficiary Portal modal for self-service preview.
- Toolbar: search with voice, advanced filters, view toggle, export, and add button.

Beneficiary UI must protect dignity. Avoid charity imagery tropes and emotional overstatement. Use clean records, service history, eligibility clarity, and respectful profile presentation.

### Project Management

This page tracks organizational programs and initiatives with milestones, budgets, teams, beneficiaries, and reporting.

Required components:

- View toggle: Project List and SDG Alignment.
- Project list cards or table rows showing name, category icon, status badge, progress, budget, and dates.
- Category icons: Community Service, Research, Innovation, Leadership, Environmental, Educational, and Cultural.
- Status values: Active, Planned, Completed, and On Hold.
- SDG Alignment matrix or chart.
- Project detail full-page view with header, status, category, dates, budget used/total, and tabs.
- Detail tabs: Overview, Milestones and Timeline, Budget, Team, Beneficiaries, Reporting, and Documents.
- Reporting tab with exportable cards for Overview, Tasks, Budget, and Progress/Timeline, each with favorite pinning.
- Create Project wizard: basic info, category, milestones, team, budget, and review.
- Toolbar: search, status/category filter, sort, and create project button.

Project records should visibly roll up into Bousala. Every project card should make strategic alignment discoverable.

### Stakeholder Management

This page tracks trustees, regulators, partners, media, and key contacts.

Required components:

- Stats row: total stakeholders, influence breakdown, active engagements, and alerts count.
- View toggle: Cards, Table, and Matrix.
- Stakeholder cards with name, type badge, influence/interest indicators, and last contact date.
- Sortable table view.
- Interactive 2x2 influence-vs-interest matrix with plotted stakeholders.
- Detail drawer with profile, organization, contact info, Overview, Engagement Log, Related Projects, and Documents.
- Add Stakeholder modal.
- Toolbar: search with voice, type filter, view toggle, export, and add button.

The matrix view should feel like an executive planning tool, not a decorative chart. Make quadrant labels clear and keep plotted nodes readable.

### Settings

Settings should be quiet and utilitarian.

Required components:

- Language preferences with enabled language toggles.
- Theme controls for light and dark mode.
- User profile.
- Notification preferences.
- Role and permissions overview.

Group settings into simple sections with clear save states. Do not over-design this page.

### Help and Support

Help and Support should make learning self-service but compact.

Required components:

- FAQ accordion.
- Video tutorials grid.
- Interactive tutorials and walkthroughs.
- Contact and feedback entry point.

Use short titles, clear categories, and progress indicators for walkthroughs.

### Common Patterns

Use these patterns consistently across all pages:

- Empty states: restrained illustration or line icon, one useful CTA, no marketing copy.
- Skeleton loaders: quiet shimmer or static placeholders aligned to final layout.
- Toast notifications: top-right on desktop, bottom on mobile; success, error, warning, and info.
- Modals: centered overlay with clear title, compact form, save/cancel actions, and accessible close.
- Detail drawers: slide from the logical side; mirror for RTL.
- Voice search: microphone icon button attached to search fields on major list pages.
- AI indicators: teal badge or icon with tooltip explaining what AI generated or predicted.
- Confirmation dialogs: required for destructive actions.
- Global AI FAB: bottom-right on LTR, bottom-left on RTL; do not overlap feedback FAB.
- Feedback FAB: separate from AI, lower priority, accessible label.
- Tables: sticky headers, density controls when useful, sortable columns, bulk selection, and empty/filter-zero states.
- Forms: clear labels, inline validation, grouped sections, and final review screens for multi-step flows.

## Do's and Don'ts

Do:

- Make Bousala the visual and interaction centerpiece.
- Use the Compass Spine to clarify strategy-to-execution relationships.
- Keep dashboards dense, aligned, and scannable.
- Prioritize evidence, accountability, financial clarity, and board readiness.
- Preserve all required pages, tabs, modals, drawers, and common patterns from this document.
- Support light mode, dark mode, responsive layouts, and complete RTL mirroring.
- Use icons for tools and actions, especially search, export, share, filters, settings, add, microphone, AI, notifications, and view toggles.
- Show AI output with source context, confidence, or recommended next action where possible.
- Treat beneficiaries and donor relationships with restraint and dignity.

Don't:

- Do not imitate the current demo frontend theme, colors, visual tone, gradients, or component styling.
- Do not make a landing page. The first screen should be the actual authenticated dashboard.
- Do not use generic purple-blue AI gradients, decorative blobs, oversized rounded cards, or marketing hero sections.
- Do not reduce Bousala to a normal task manager. It must visibly connect goals, KPIs, projects, tasks, and outcomes.
- Do not hide filters, export, add actions, or view toggles behind unclear menus on desktop.
- Do not use literal religious ornamentation as decoration. Keep cultural cues subtle, structural, and respectful.
- Do not overload every card with AI. Use AI where it helps explain, predict, or recommend.
- Do not create layouts that only work left-to-right.
- Do not use emotional charity campaign imagery for beneficiary records.
