export const OPTIMISTIC_HIGHLIGHT_MS = 2200;

export function createOptimisticId(prefix: string): string {
  return `${prefix}${Date.now()}`;
}

export function isOptimisticId(id: string, prefix: string): boolean {
  return id.startsWith(prefix);
}

/** Simulates network latency for local-only (mock) create flows. */
export function simulateLocalPersist<T>(buildResult: () => T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(buildResult()), delayMs);
  });
}
