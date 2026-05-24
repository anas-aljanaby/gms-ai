import type { Beneficiary } from '../types';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';

export const OPTIMISTIC_BENEFICIARY_PREFIX = 'optimistic-beneficiary-';

export function isOptimisticBeneficiary(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_BENEFICIARY_PREFIX);
}

export function buildOptimisticBeneficiary(data: Partial<Beneficiary>): Beneficiary {
  return {
    id: createOptimisticId(OPTIMISTIC_BENEFICIARY_PREFIX),
    name: data.name || { en: '', ar: '' },
    beneficiaryType: data.beneficiaryType || 'student',
    photo: `https://picsum.photos/seed/${Date.now()}/200/200`,
    status: 'active',
    supportType: data.supportType || 'direct-support',
    country: data.country || '',
    profile: data.profile || { type: 'student' },
    aidLog: [],
    assessments: [],
    milestones: [],
    documents: [],
  };
}
