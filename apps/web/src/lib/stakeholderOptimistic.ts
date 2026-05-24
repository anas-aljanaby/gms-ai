import type { Stakeholder } from '../types';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';

export const OPTIMISTIC_STAKEHOLDER_PREFIX = 'optimistic-stakeholder-';

export function isOptimisticStakeholder(id: Stakeholder['id']): boolean {
  return typeof id === 'string' && isOptimisticId(id, OPTIMISTIC_STAKEHOLDER_PREFIX);
}

export function buildOptimisticStakeholder(
  data: Pick<Stakeholder, 'name' | 'type' | 'category' | 'country' | 'email' | 'phone'>
): Stakeholder {
  return {
    id: createOptimisticId(OPTIMISTIC_STAKEHOLDER_PREFIX),
    name: data.name,
    type: data.type,
    category: data.category,
    status: 'active',
    healthScore: 75,
    relationshipLevel: 'core',
    riskLevel: 'low',
    lastContact: new Date().toISOString(),
    aiInsights: 'stakeholder_management.insights.newly_added',
    email: data.email,
    phone: data.phone,
    country: data.country,
    engagementScore: 50,
    power: 50,
    interest: 50,
    classification: 'secondary',
    riskProfile: 'neutral',
    needs: [],
  };
}

export function nextStakeholderNumericId(stakeholders: Stakeholder[]): number {
  const numericIds = stakeholders
    .map((s) => s.id)
    .filter((id): id is number => typeof id === 'number');
  return (numericIds.length ? Math.max(...numericIds) : 0) + 1;
}
