# @gms/shared

Zod schemas + shared TypeScript types consumed by both `@gms/web` and `@gms/api`.

Per [docs/architecture/decisions.md](../../docs/architecture/decisions.md):

- Zod schemas live here.
- **Drizzle schemas do NOT** — those live in `apps/api/src/db/`.
- `apps/web/src/types.ts` (47KB) is the source for migration: domain entity
  types should be carved out of it and moved here over time, leaving
  web-only UI types behind.
