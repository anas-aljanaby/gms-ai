import type { GanttTask } from '../types';
import { createOptimisticId, isOptimisticId } from './optimisticSubmit';

export const OPTIMISTIC_PROJECT_TASK_PREFIX = 'optimistic-project-task-';

export function isOptimisticProjectTask(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_PROJECT_TASK_PREFIX);
}

export function buildOptimisticProjectTask(data: Omit<GanttTask, 'id'>): GanttTask {
  return {
    ...data,
    id: createOptimisticId(OPTIMISTIC_PROJECT_TASK_PREFIX),
  };
}

/** Tasks are displayed sorted by `start` ascending (stable ordering for optimistic + API rows). */
export function sortProjectTasksByStart(tasks: GanttTask[]): GanttTask[] {
  return [...tasks].sort((a, b) => a.start.localeCompare(b.start));
}

export function insertProjectTaskSorted(tasks: GanttTask[], task: GanttTask): GanttTask[] {
  return sortProjectTasksByStart([...tasks, task]);
}
