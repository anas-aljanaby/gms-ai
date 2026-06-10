-- Per-org module registry: enablement, order, and label overrides.
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0 NOT NULL;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "label_en" text;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "label_ar" text;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

-- Normalize legacy module names to canonical keys.
UPDATE "modules" SET "name" = 'stakeholder_management' WHERE "name" = 'stakeholders';
UPDATE "modules" SET "name" = 'staff' WHERE "name" = 'hr';
UPDATE "modules" SET "name" = 'financials' WHERE "name" = 'finance';

-- Remove duplicate rows after rename (keep lowest id per org+name).
DELETE FROM "modules" a
USING "modules" b
WHERE a.org_id = b.org_id
  AND a.name = b.name
  AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS "modules_org_id_name_unique" ON "modules" ("org_id", "name");
