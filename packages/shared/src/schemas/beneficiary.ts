import { z } from 'zod/v4';
import { BENEFICIARY_STATUSES, BENEFICIARY_TYPES, SUPPORT_TYPES } from '../constants/beneficiaryOptions';

export const beneficiaryTypeSchema = z.enum(BENEFICIARY_TYPES);
export const beneficiaryStatusSchema = z.enum(BENEFICIARY_STATUSES);
export const supportTypeSchema = z.enum(SUPPORT_TYPES);

const jsonRecordSchema = z.record(z.string(), z.unknown());
const jsonArraySchema = z.array(jsonRecordSchema);

export const beneficiarySchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    name_en: z.string(),
    name_ar: z.string().optional().default(''),
    beneficiary_type: beneficiaryTypeSchema,
    photo: z.string().optional().default(''),
    status: beneficiaryStatusSchema.default('active'),
    support_type: supportTypeSchema.default('direct-support'),
    country: z.string().optional().default(''),
    project_id: z.string().nullable().optional(),
    profile: jsonRecordSchema.default({}),
    aid_log: jsonArraySchema.default([]),
    assessments: jsonArraySchema.default([]),
    milestones: jsonArraySchema.default([]),
    documents: jsonArraySchema.default([]),
    custom_fields: jsonRecordSchema.default({}),
});

const createBeneficiaryFieldsSchema = beneficiarySchema.omit({
    id: true,
    org_id: true,
}).extend({
    name_en: z.string().default(''),
    name_ar: z.string().default(''),
    profile: jsonRecordSchema.default({ type: 'student' }),
});

export const createBeneficiarySchema = createBeneficiaryFieldsSchema.superRefine((data, ctx) => {
    const nameEn = data.name_en.trim();
    const nameAr = data.name_ar.trim();
    if (!nameEn && !nameAr) {
        ctx.addIssue({
            code: 'custom',
            message: 'at_least_one_name_required',
            path: ['name_en'],
        });
    }
});

export const updateBeneficiarySchema = createBeneficiaryFieldsSchema.partial();
