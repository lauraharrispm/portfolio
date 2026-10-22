import { Redis } from "@upstash/redis";
import type { BrowserEvent } from "./contract";

export const EVENT_RETENTION_SECONDS = 426 * 86400;
export const QUESTION_RETENTION_SECONDS = 90 * 86400;
let client: Redis;
export function measurementRedis() {
  return (client ??= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  }));
}
// Daily hashes deduplicate retries by event ID. Time retention, no row-count eviction.
export type StoredEvent = Omit<BrowserEvent, "name"> & {
  name: BrowserEvent["name"] | "chat_request_completed";
};
export async function storeEvents(
  events: StoredEvent[],
  producer: "browser" | "server" = "browser",
) {
  if (process.env.CHAT_MOCK === "true" || process.env.VERCEL_ENV === "preview")
    return;
  const now = new Date();
  const key = `measurement:events:${now.toISOString().slice(0, 10)}`;
  const rows: Record<string, string> = {};
  for (const event of events)
    rows[event.event_id] = JSON.stringify({
      ...event,
      schema_version: 1,
      received_at: now.toISOString(),
      producer,
      environment: process.env.VERCEL_ENV ?? "development",
      site_version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    });
  await measurementRedis().eval(
    `
    for i = 2, #ARGV, 2 do redis.call('HSETNX', KEYS[1], ARGV[i], ARGV[i+1]) end
    redis.call('EXPIRE', KEYS[1], ARGV[1])
    return 1`,
    [key],
    [EVENT_RETENTION_SECONDS, ...Object.entries(rows).flat()],
  );
}
