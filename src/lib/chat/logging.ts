import { Redis } from "@upstash/redis";
import { redact } from "./redact";
import type { Intent } from "./types";

export interface QuestionLogEntry {
  timestamp: string;
  topics: string[];
  intent: Intent;
  /** Redacted, truncated question text, kept short for review, never the full conversation. */
  question: string;
}

// Capped list so storage never grows unbounded: push newest, trim to the
// last 2000. No IP, name, email, or phone number is ever stored (redact()
// strips emails/phones from the question text before it's written).
const LOG_KEY = "chat:log";
const LOG_CAP = 2000;

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

export function buildLogEntry(rawQuestion: string, topics: string[], intent: Intent): QuestionLogEntry {
  return {
    timestamp: new Date().toISOString(),
    topics,
    intent,
    question: redact(rawQuestion).slice(0, 500),
  };
}

export async function logQuestion(entry: QuestionLogEntry): Promise<void> {
  const redis = getClient();
  await redis.lpush(LOG_KEY, JSON.stringify(entry));
  await redis.ltrim(LOG_KEY, 0, LOG_CAP - 1);
}
