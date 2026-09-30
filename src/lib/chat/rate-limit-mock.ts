import { CHAT_LIMITS } from "@/content/chat/config";
import type { RateLimitResult } from "./rate-limit";

// In-memory stand-in for rate-limit.ts, used when CHAT_MOCK=true so the
// full limit UI (and the atomic-counter behavior) can be exercised
// without an Upstash database. Mirrors the same key/window/TTL shape as
// the real Lua script, just backed by a Map instead of Redis. Module
// state resets on every server restart/redeploy, which is fine for
// local testing.

interface Entry {
  count: number;
  expiresAt: number;
}

const store = new Map<string, Entry>();

function incrWithTtl(key: string, ttlSeconds: number): number {
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.expiresAt <= now) {
    // Creation and expiry set together, same as the Lua script does
    // atomically in Redis: there's never a window with no TTL.
    store.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
    return 1;
  }
  existing.count += 1;
  return existing.count;
}

export async function checkRateLimitMock(ip: string): Promise<{ hour: RateLimitResult; day: RateLimitResult }> {
  const hourKey = `chat:rl:h:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  const dayKey = `chat:rl:d:${ip}:${Math.floor(Date.now() / 86_400_000)}`;

  const hourCount = incrWithTtl(hourKey, 3600);
  const dayCount = incrWithTtl(dayKey, 86400);

  return {
    hour: { allowed: hourCount <= CHAT_LIMITS.perHourLimit, count: hourCount, limit: CHAT_LIMITS.perHourLimit },
    day: { allowed: dayCount <= CHAT_LIMITS.perDayLimit, count: dayCount, limit: CHAT_LIMITS.perDayLimit },
  };
}
