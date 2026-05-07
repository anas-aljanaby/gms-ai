import { z } from 'zod/v4';
import { DONOR_STATUSES, DONOR_TIERS, INTERACTION_TYPES, TASK_TYPES } from '../constants/donorOptions';

export const donorStatusSchema = z.enum(DONOR_STATUSES);
export const donorTierSchema = z.enum(DONOR_TIERS);
export const donorCategorySchema = z.enum([
    'Hero Donor',
    'Recurring Donor',
    'Seasonal Donor',
    'Event Donor',
    'Dormant Donor',
    'General Donor',
    'New Donor',
]);
export const languageSchema = z.enum(['en', 'ar']);

export const individualDonorSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    full_name_en: z.string().min(1),
    full_name_ar: z.string().optional().default(''),
    email: z.string().email(),
    phone: z.string().optional().default(''),
    total_donations: z.number().default(0),
    last_donation_date: z.string().nullable(),
    status: donorStatusSchema.default('Active'),
    tier: donorTierSchema.default('Bronze'),
    country: z.string().optional().default(''),
    tags: z.array(z.string()).default([]),
    assigned_manager: z.string().optional().default(''),
    avatar: z.string().optional().default(''),
    donor_since: z.string().nullable(),
    donor_category: donorCategorySchema.nullable().default(null),
    donations_count: z.number().default(0),
    avg_gift: z.number().nullable().default(null),
    avg_days_between_donations: z.number().nullable().default(null),
    primary_program_interest: z.string().nullable().default(null),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createDonorSchema = individualDonorSchema.omit({
    id: true,
    org_id: true,
    total_donations: true,
    donations_count: true,
    avg_gift: true,
    avg_days_between_donations: true,
    primary_program_interest: true,
    donor_category: true,
});

export const updateDonorSchema = createDonorSchema.partial();

export const donationSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    donor_id: z.string().uuid(),
    amount: z.number().positive(),
    date: z.string(),
    program: z.string().optional().default(''),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createDonationSchema = donationSchema.omit({ id: true, org_id: true, donor_id: true }).extend({
    donor_id: z.string().uuid().optional(),
});

export const donorTaskSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    donor_id: z.string().uuid(),
    text: z.string().min(1),
    type: z.enum(TASK_TYPES).default('Follow-up'),
    assigned_to: z.string().optional().default(''),
    due_date: z.string(),
    completed: z.boolean().default(false),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createDonorTaskSchema = donorTaskSchema.omit({ id: true, org_id: true, donor_id: true }).extend({
    donor_id: z.string().uuid().optional(),
});

export const updateDonorTaskSchema = createDonorTaskSchema.partial();

export const donorInteractionSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    donor_id: z.string().uuid(),
    interaction_type: z.enum(INTERACTION_TYPES).default('note'),
    occurred_at: z.string(),
    subject: z.string().min(1),
    status: z.string().optional().default('logged'),
    notes: z.string().optional().default(''),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createDonorInteractionSchema = donorInteractionSchema.omit({ id: true, org_id: true, donor_id: true }).extend({
    donor_id: z.string().uuid().optional(),
});

export const updateDonorInteractionSchema = createDonorInteractionSchema.partial();

export const donorDocumentSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    donor_id: z.string().uuid(),
    filename: z.string().min(1),
    file_url: z.string().min(1),
    label: z.string().optional().default('Document'),
    content_type: z.string().nullable().default(null),
    size_bytes: z.number().nullable().default(null),
    uploaded_at: z.string(),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createDonorDocumentSchema = donorDocumentSchema.omit({
    id: true,
    org_id: true,
    donor_id: true,
    filename: true,
    file_url: true,
    content_type: true,
    size_bytes: true,
    uploaded_at: true,
}).extend({
    donor_id: z.string().uuid().optional(),
});

export type IndividualDonor = z.infer<typeof individualDonorSchema>;
export type CreateDonor = z.infer<typeof createDonorSchema>;
export type UpdateDonor = z.infer<typeof updateDonorSchema>;
export type Donation = z.infer<typeof donationSchema>;
export type CreateDonation = z.infer<typeof createDonationSchema>;
export type DonorTask = z.infer<typeof donorTaskSchema>;
export type CreateDonorTask = z.infer<typeof createDonorTaskSchema>;
export type DonorInteraction = z.infer<typeof donorInteractionSchema>;
export type CreateDonorInteraction = z.infer<typeof createDonorInteractionSchema>;
export type DonorDocument = z.infer<typeof donorDocumentSchema>;
export type CreateDonorDocument = z.infer<typeof createDonorDocumentSchema>;
export type DonorStatus = z.infer<typeof donorStatusSchema>;
export type DonorTier = z.infer<typeof donorTierSchema>;
export type DonorCategory = z.infer<typeof donorCategorySchema>;
