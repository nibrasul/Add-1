const tracker = new Map<string, number[]>();

// Clean up memory periodically to prevent memory leaks in long-running processes
if (typeof global !== 'undefined') {
  // Prevent duplicate intervals in hot-reload dev mode
  const globalRef = global as any;
  if (!globalRef.__rateLimitCleanupInterval) {
    globalRef.__rateLimitCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of tracker.entries()) {
        const valid = timestamps.filter((t) => now - t < 60000);
        if (valid.length === 0) {
          tracker.delete(key);
        } else {
          tracker.set(key, valid);
        }
      }
    }, 60000);
  }
}

/**
 * Simple in-memory sliding window rate limiter.
 * Returns true if the request is allowed, false if rate limited.
 */
export function rateLimit(key: string, limit: number, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = tracker.get(key) || [];

  // Keep only timestamps within the active sliding window
  const activeTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (activeTimestamps.length >= limit) {
    return false;
  }

  activeTimestamps.push(now);
  tracker.set(key, activeTimestamps);
  return true;
}
