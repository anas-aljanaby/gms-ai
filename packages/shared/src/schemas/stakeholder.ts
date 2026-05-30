import { z } from 'zod/v4';

export const stakeholderTypeSchema = z.enum([
    'donor',
    'beneficiary',
    'partner',
    'volunteer',
    'mentor',
    'expert',
    'investor',
    'board_member',
    'government',
    'supplier',
    'community',
    'media',
]);

export const stakeholderCategorySchema = z.enum(['foundation', 'family', 'company']);
export const stakeholderStatusSchema = z.enum(['active', 'inactive', 'pending']);
export const stakeholderClassificationSchema = z.enum(['primary', 'secondary']);
export const stakeholderRelationshipLevelSchema = z.enum(['strategic', 'core', 'important']);
export const stakeholderRiskLevelSchema = z.enum(['low', 'medium', 'high']);
export const stakeholderRiskProfileSchema = z.enum(['supporter', 'neutral', 'blocker']);

const stakeholderNameSchema = z.object({
    en: z.string().default(''),
    ar: z.string().default(''),
});

const stakeholderBaseSchema = z.object({
    name: stakeholderNameSchema,
    type: stakeholderTypeSchema.default('donor'),
    category: stakeholderCategorySchema.default('foundation'),
    status: stakeholderStatusSchema.default('active'),
    classification: stakeholderClassificationSchema.default('secondary'),
    email: z.union([z.literal(''), z.string().email()]).default(''),
    phone: z.string().default(''),
    country: z.string().default(''),
    healthScore: z.number().int().min(0).max(100).default(75),
    engagementScore: z.number().int().min(0).max(100).default(50),
    relationshipLevel: stakeholderRelationshipLevelSchema.default('core'),
    riskLevel: stakeholderRiskLevelSchema.default('low'),
    riskProfile: stakeholderRiskProfileSchema.default('neutral'),
    power: z.number().int().min(0).max(100).default(50),
    interest: z.number().int().min(0).max(100).default(50),
    aiInsights: z.string().default('stakeholder_management.insights.newly_added'),
    lastContact: z.string().datetime().optional(),
    needs: z.array(z.string()).default([]),
    totalDonations: z.number().nonnegative().optional(),
    supportReceived: z.number().nonnegative().optional(),
    partnershipValue: z.number().nonnegative().optional(),
    custom_fields: z.record(z.string(), z.unknown()).default({}),
});

export const createStakeholderSchema = stakeholderBaseSchema.superRefine((data, ctx) => {
    const en = data.name.en.trim();
    const ar = data.name.ar.trim();
    if (!en && !ar) {
        ctx.addIssue({
            code: 'custom',
            message: 'at_least_one_name_required',
            path: ['name', 'en'],
        });
    }
});

export const updateStakeholderSchema = stakeholderBaseSchema.partial();

export type CreateStakeholder = z.infer<typeof createStakeholderSchema>;
export type UpdateStakeholder = z.infer<typeof updateStakeholderSchema>;
