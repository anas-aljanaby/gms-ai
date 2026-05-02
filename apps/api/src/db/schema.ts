import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';



export const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow()
})

export const memberships = pgTable('memberships', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => organizations.id),
    user_id: uuid('user_id').notNull(),
    role: text('role').notNull(),
    created_at: timestamp('created_at').defaultNow()
})
