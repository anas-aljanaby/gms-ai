import { readFileSync } from 'node:fs';
import path from 'node:path';

export type BeneficiarySeedRow = {
    name_en: string;
    name_ar: string;
    beneficiary_type: string;
    photo: string;
    status: string;
    support_type: string;
    country: string;
    project_id: string | null;
    profile: Record<string, unknown>;
    aid_log: unknown[];
    assessments: unknown[];
    milestones: unknown[];
    documents: unknown[];
};

const seedPath = path.join(import.meta.dirname, 'beneficiarySeedData.json');
export const SEED_BENEFICIARIES = JSON.parse(readFileSync(seedPath, 'utf8')) as BeneficiarySeedRow[];
