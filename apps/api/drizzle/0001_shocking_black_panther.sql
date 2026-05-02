CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"donor_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"date" timestamp NOT NULL,
	"program" text DEFAULT '',
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "individual_donors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"full_name_en" text NOT NULL,
	"full_name_ar" text DEFAULT '',
	"email" text NOT NULL,
	"phone" text DEFAULT '',
	"total_donations" numeric(12, 2) DEFAULT '0',
	"last_donation_date" timestamp,
	"status" text DEFAULT 'Active' NOT NULL,
	"tier" text DEFAULT 'Bronze' NOT NULL,
	"country" text DEFAULT '',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"assigned_manager" text DEFAULT '',
	"avatar" text DEFAULT '',
	"donor_since" timestamp,
	"donor_category" text,
	"donations_count" integer DEFAULT 0,
	"avg_gift" numeric(12, 2),
	"avg_days_between_donations" numeric(8, 1),
	"primary_program_interest" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_individual_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."individual_donors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "individual_donors" ADD CONSTRAINT "individual_donors_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;