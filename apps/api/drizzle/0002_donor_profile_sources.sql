CREATE TABLE IF NOT EXISTS "donor_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"donor_id" uuid NOT NULL,
	"interaction_type" text DEFAULT 'note' NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'logged',
	"notes" text DEFAULT '',
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donor_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"donor_id" uuid NOT NULL,
	"text" text NOT NULL,
	"type" text DEFAULT 'Follow-up' NOT NULL,
	"assigned_to" text DEFAULT '',
	"due_date" timestamp NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donor_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"donor_id" uuid NOT NULL,
	"filename" text NOT NULL,
	"file_url" text NOT NULL,
	"label" text DEFAULT 'Document',
	"content_type" text,
	"size_bytes" integer,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_interactions" ADD CONSTRAINT "donor_interactions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_interactions" ADD CONSTRAINT "donor_interactions_donor_id_individual_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."individual_donors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_tasks" ADD CONSTRAINT "donor_tasks_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_tasks" ADD CONSTRAINT "donor_tasks_donor_id_individual_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."individual_donors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_documents" ADD CONSTRAINT "donor_documents_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donor_documents" ADD CONSTRAINT "donor_documents_donor_id_individual_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."individual_donors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
