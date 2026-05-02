import { z } from 'zod/v4';

export const donorStatusSchema = z.enum(['Active', 'Lapsed', 'On Hold', 'Deceased']);
export const donorTierSchema = z.enum(['Bronze', 'Silver', 'Gold', 'Platinum', 'Major Donor']);
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

export const createDonationSchema = donationSchema.omit({ id: true, org_id: true });

export type IndividualDonor = z.infer<typeof individualDonorSchema>;
export type CreateDonor = z.infer<typeof createDonorSchema>;
export type UpdateDonor = z.infer<typeof updateDonorSchema>;
export type Donation = z.infer<typeof donationSchema>;
export type CreateDonation = z.infer<typeof createDonationSchema>;
export type DonorStatus = z.infer<typeof donorStatusSchema>;
export type DonorTier = z.infer<typeof donorTierSchema>;
export type DonorCategory = z.infer<typeof donorCategorySchema>;
