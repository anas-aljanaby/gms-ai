import type { InstitutionalDonor } from '../types';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';

export const OPTIMISTIC_INSTITUTION_PREFIX = 'optimistic-institution-';

export function isOptimisticInstitution(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_INSTITUTION_PREFIX);
}

export function buildOptimisticInstitution(
  data: Omit<
    InstitutionalDonor,
    'id' | 'logo' | 'totalGrantsAwarded' | 'activeGrants' | 'nextDeadline' | 'lastContactDate' | 'assignedManager' | 'createdDate'
  >
): InstitutionalDonor {
  return {
    ...data,
    id: createOptimisticId(OPTIMISTIC_INSTITUTION_PREFIX),
    logo: `https://picsum.photos/seed/${encodeURIComponent(data.organizationName.en)}/100/100`,
    totalGrantsAwarded: 0,
    activeGrants: 0,
    nextDeadline: '',
    lastContactDate: new Date().toISOString(),
    assignedManager: 'Unassigned',
    createdDate: new Date().toISOString(),
  };
}
