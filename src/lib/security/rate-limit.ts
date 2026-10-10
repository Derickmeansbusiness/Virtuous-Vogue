import "server-only";

/**
 * Small in-memory token bucket for server actions. Good enough per
 * instance; swap for Upstash/Redis in multi-region deployments.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
