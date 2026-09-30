import { Redis } from "@upstash/redis";
import { CHAT_LIMITS } from "@/content/chat/config";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
}

/**
 * INCR-then-conditionally-EXPIRE as a single Lua script, so the counter
 * can never end up without a TTL (no window where a crash between two
 * separate commands leaves a key alive forever). This is the standard
 * atomic counter pattern for Redis: a Lua script runs as one operation.
 */
const INCR_WITH_TTL_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return current
`;

let client: Redis | null = null;
function getClient(): Redis {
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return client;
}

async function incrWithTtl(key: string, ttlSeconds: number): Promise<number> {
  const result = await getClient().eval(INCR_WITH_TTL_SCRIPT, [key], [String(ttlSeconds)]);
  return Number(result);
}

/**
 * Checks and increments both the hourly and daily counters for an IP in
 * one pass. Both counters are bumped even if one is already over limit,
 * so the counts stay accurate for the review the numbers are for; the
 * caller decides what to do with `allowed`.
 */
export async function checkRateLimit(ip: string): Promise<{ hour: RateLimitResult; day: RateLimitResult }> {
  const hourKey = `chat:rl:h:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  const dayKey = `chat:rl:d:${ip}:${Math.floor(Date.now() / 86_400_000)}`;

  const [hourCount, dayCount] = await Promise.all([
    incrWithTtl(hourKey, 3600),
    incrWithTtl(dayKey, 86400),
  ]);

  return {
    hour: { allowed: hourCount <= CHAT_LIMITS.perHourLimit, count: hourCount, limit: CHAT_LIMITS.perHourLimit },
    day: { allowed: dayCount <= CHAT_LIMITS.perDayLimit, count: dayCount, limit: CHAT_LIMITS.perDayLimit },
  };
}
