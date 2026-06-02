import { z } from 'zod/v4';

const institutionTypeSchema = z.enum(['Foundation', 'Corporate', 'Government', 'Multilateral']);
const relationshipStatusSchema = z.enum(['Cold', 'Prospect', 'Cultivating', 'Active', 'Stewardship']);
const prioritySchema = z.enum(['High', 'Medium', 'Low']);

const customFieldsSchema = z.record(z.string(), z.unknown()).default({});

export const institutionalDonorSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    name_en: z.string().min(1),
    name_ar: z.string().default(''),
    type: institutionTypeSchema.default('Foundation'),
    relationship_status: relationshipStatusSchema.default('Prospect'),
    priority: prioritySchema.default('Medium'),
    assigned_manager: z.string().default(''),
    primary_contact_name: z.string().default(''),
    primary_contact_email: z.union([z.literal(''), z.string().email()]).default(''),
    focus_areas: z.array(z.string()).default([]),
    geographic_focus: z.array(z.string()).default([]),
    country: z.string().default(''),
    custom_fields: customFieldsSchema,
    created_at: z.string(),
});

const baseCreateInstitutionalDonorSchema = institutionalDonorSchema
    .omit({
        id: true,
        org_id: true,
        created_at: true,
    })
    .extend({
        name_en: z.string().default(''),
        name_ar: z.string().default(''),
    });

export const createInstitutionalDonorSchema = baseCreateInstitutionalDonorSchema.superRefine((data, ctx) => {
    if (!data.name_en.trim() && !data.name_ar.trim()) {
        ctx.addIssue({
            code: 'custom',
            message: 'at_least_one_name_required',
            path: ['name_en'],
        });
    }
});

export const updateInstitutionalDonorSchema = baseCreateInstitutionalDonorSchema.partial();

export const institutionalDonorContactSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    institutional_donor_id: z.string().uuid(),
    name: z.string().min(1),
    position: z.string().default(''),
    email: z.union([z.literal(''), z.string().email()]).default(''),
    phone: z.string().default(''),
    whatsapp: z.string().default(''),
    is_primary: z.boolean().default(false),
    photo_url: z.string().default(''),
    custom_fields: customFieldsSchema,
    created_at: z.string(),
});

export const createInstitutionalDonorContactSchema = institutionalDonorContactSchema.omit({
    id: true,
    org_id: true,
    institutional_donor_id: true,
    created_at: true,
});

export const updateInstitutionalDonorContactSchema = createInstitutionalDonorContactSchema.partial();

export const institutionalDonorDocumentSchema = z.object({
    id: z.string().uuid(),
    org_id: z.string().uuid(),
    institutional_donor_id: z.string().uuid(),
    filename: z.string().min(1),
    file_url: z.string().min(1),
    label: z.string().default('Document'),
    content_type: z.string().nullable().default(null),
    size_bytes: z.number().nullable().default(null),
    uploaded_at: z.string(),
    custom_fields: customFieldsSchema,
});

export type InstitutionalDonorRecord = z.infer<typeof institutionalDonorSchema>;
export type CreateInstitutionalDonor = z.infer<typeof createInstitutionalDonorSchema>;
export type UpdateInstitutionalDonor = z.infer<typeof updateInstitutionalDonorSchema>;
export type InstitutionalDonorContactRecord = z.infer<typeof institutionalDonorContactSchema>;
export type CreateInstitutionalDonorContact = z.infer<typeof createInstitutionalDonorContactSchema>;
export type UpdateInstitutionalDonorContact = z.infer<typeof updateInstitutionalDonorContactSchema>;
export type InstitutionalDonorDocumentRecord = z.infer<typeof institutionalDonorDocumentSchema>;
