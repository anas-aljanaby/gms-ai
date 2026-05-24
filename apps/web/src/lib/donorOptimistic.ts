import type { IndividualDonor } from '../types';
import type { CreateDonorInput } from '../hooks/useDonors';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';
import { normalizeDonorEmail } from './donorEmail';

export const OPTIMISTIC_DONOR_PREFIX = 'optimistic-donor-';

export function isOptimisticDonor(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_DONOR_PREFIX);
}

export function buildOptimisticDonor(input: CreateDonorInput): IndividualDonor {
  const now = new Date().toISOString();
  return {
    id: createOptimisticId(OPTIMISTIC_DONOR_PREFIX),
    fullName: input.fullName,
    email: normalizeDonorEmail(input.email),
    phone: input.phone,
    country: input.country,
    status: 'Active',
    tier: 'Bronze',
    tags: [],
    assignedManager: 'Unassigned',
    avatar: normalizeDonorEmail(input.email)
        ? `https://i.pravatar.cc/150?u=${encodeURIComponent(normalizeDonorEmail(input.email))}`
        : '',
    donorSince: now,
    totalDonations: 0,
    lastDonationDate: '',
    donorType: 'Individual',
    relationshipStage: 'prospect',
    relationshipHealth: 'Moderate',
    relationshipLikelihood: 'Medium',
    stageEnteredAt: now,
    relationshipTasks: [],
  };
}
