import { pgTable, uuid, text, timestamp, jsonb, numeric, integer } from 'drizzle-orm/pg-core';

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
