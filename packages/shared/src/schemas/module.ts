import { z } from 'zod/v4';
import { MODULE_KEYS } from '../constants/modules';

export const moduleKeySchema = z.enum(MODULE_KEYS);

export const orgModuleSchema = z.object({
    id: z.string().uuid(),
    name: moduleKeySchema,
    enabled: z.boolean(),
    sort_order: z.number().int(),
    label_en: z.string().nullable(),
    label_ar: z.string().nullable(),
    locked: z.boolean(),
    config: z.record(z.string(), z.unknown()).nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
});

export const orgModuleUpdateItemSchema = z.object({
    name: moduleKeySchema,
    enabled: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
    label_en: z.string().trim().nullable().optional(),
    label_ar: z.string().trim().nullable().optional(),
});

export const patchOrgModulesSchema = z.object({
    modules: z.array(orgModuleUpdateItemSchema).min(1),
});

export type OrgModule = z.infer<typeof orgModuleSchema>;
export type OrgModuleUpdateItem = z.infer<typeof orgModuleUpdateItemSchema>;
export type PatchOrgModules = z.infer<typeof patchOrgModulesSchema>;
