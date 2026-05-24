import type { Project } from '../types';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';

export const OPTIMISTIC_PROJECT_PREFIX = 'optimistic-project-';

export function isOptimisticProject(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_PROJECT_PREFIX);
}

export function buildOptimisticProject(data: Omit<Project, 'id'>): Project {
  return {
    ...data,
    id: createOptimisticId(OPTIMISTIC_PROJECT_PREFIX),
  } as Project;
}
