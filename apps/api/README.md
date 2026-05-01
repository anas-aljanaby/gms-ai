# @gms/api

Backend service per [docs/architecture/decisions.md](../../docs/architecture/decisions.md).

## Stack (planned)

- Hono (web framework)
- Drizzle (ORM)
- PostgreSQL via Supabase
- Zod schemas (shared with `@gms/web` via `@gms/shared`)
- Supabase Auth for JWT verification

## Structure

```
src/
├── index.ts          # Hono app entry
├── routes/           # HTTP route handlers (donors, beneficiaries, ai, etc.)
├── db/               # Drizzle schema + client
├── middleware/       # auth, orgContext (RLS), rate-limit
└── services/         # gemini.ts and other backend-only logic
```

## Migration plan

This service does not exist yet — only the directory scaffolding has been
created. Build out incrementally per the decisions doc:

1. Hono skeleton + healthcheck
2. Drizzle schema for `organizations`, `memberships`, `modules`, `audit_log`
3. Supabase Auth middleware
4. **Donors** routes (pilot module)
5. AI proxy routes (move Gemini calls off the browser)
6. Then the remaining active modules in order:
   Beneficiaries → Projects → Stakeholders → Institutional Donors → Bousala → Dashboard

The `GEMINI_API_KEY` lives here, never in the web bundle.
