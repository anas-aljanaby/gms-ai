import { boolean, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow()
});

export const memberships = pgTable('memberships', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    user_id: uuid('user_id').notNull(),
    role: text('role').notNull(),
    created_at: timestamp('created_at').defaultNow()
});

// Per-org registry of enabled modules. config stores module-specific settings.
// Convention: every domain table must have org_id (FK to organizations) and
// custom_fields jsonb for client-specific extensions.
export const modules = pgTable('modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    name: text('name').notNull(),
    config: jsonb('config'),
    created_at: timestamp('created_at').defaultNow()
});

export const audit_log = pgTable('audit_log', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    user_id: uuid('user_id').notNull(),
    action: text('action').notNull(),
    table_name: text('table_name').notNull(),
    record_id: uuid('record_id'),
    payload: jsonb('payload'),
    created_at: timestamp('created_at').defaultNow()
});

export const individual_donors = pgTable('individual_donors', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    full_name_en: text('full_name_en').notNull(),
    full_name_ar: text('full_name_ar').default(''),
    email: text('email').notNull(),
    phone: text('phone').default(''),
    total_donations: numeric('total_donations', { precision: 12, scale: 2 }).default('0'),
    last_donation_date: timestamp('last_donation_date'),
    status: text('status').notNull().default('Active'),
    tier: text('tier').notNull().default('Bronze'),
    country: text('country').default(''),
    tags: jsonb('tags').default([]),
    assigned_manager: text('assigned_manager').default(''),
    avatar: text('avatar').default(''),
    donor_since: timestamp('donor_since'),
    donor_category: text('donor_category'),
    donations_count: integer('donations_count').default(0),
    avg_gift: numeric('avg_gift', { precision: 12, scale: 2 }),
    avg_days_between_donations: numeric('avg_days_between_donations', { precision: 8, scale: 1 }),
    primary_program_interest: text('primary_program_interest'),
    custom_fields: jsonb('custom_fields').default({}),
    created_at: timestamp('created_at').defaultNow(),
});

export const donations = pgTable('donations', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    donor_id: uuid('donor_id').notNull().references(() => individual_donors.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: timestamp('date').notNull(),
    program: text('program').default(''),
    custom_fields: jsonb('custom_fields').default({}),
    created_at: timestamp('created_at').defaultNow(),
});

export const donor_tasks = pgTable('donor_tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    donor_id: uuid('donor_id').notNull().references(() => individual_donors.id),
    text: text('text').notNull(),
    type: text('type').notNull().default('Follow-up'),
    assigned_to: text('assigned_to').default(''),
    due_date: timestamp('due_date').notNull(),
    completed: boolean('completed').notNull().default(false),
    custom_fields: jsonb('custom_fields').default({}),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

export const donor_interactions = pgTable('donor_interactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    donor_id: uuid('donor_id').notNull().references(() => individual_donors.id),
    interaction_type: text('interaction_type').notNull().default('note'),
    occurred_at: timestamp('occurred_at').notNull().defaultNow(),
    subject: text('subject').notNull(),
    status: text('status').default('logged'),
    notes: text('notes').default(''),
    custom_fields: jsonb('custom_fields').default({}),
    created_at: timestamp('created_at').defaultNow(),
});

export const donor_documents = pgTable('donor_documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    donor_id: uuid('donor_id').notNull().references(() => individual_donors.id),
    filename: text('filename').notNull(),
    file_url: text('file_url').notNull(),
    label: text('label').default('Document'),
    content_type: text('content_type'),
    size_bytes: integer('size_bytes'),
    custom_fields: jsonb('custom_fields').default({}),
    uploaded_at: timestamp('uploaded_at').defaultNow(),
});
