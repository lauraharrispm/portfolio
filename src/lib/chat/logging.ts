import { Redis } from "@upstash/redis";
import { redact } from "./redact";
import type { Intent } from "./types";
import { QUESTION_RETENTION_SECONDS } from "@/lib/measurement/store";
import { randomUUID } from "node:crypto";

export interface QuestionLogEntry {
  timestamp: string;
  requestId?: string;
  inputSource?: string;
  starterId?: string;
  latencyMs?: number;
  modelVersion?: string;
  knowledgeVersion?: string;
  schemaVersion?: number;
  isInternal?: boolean;
  turn: number;
  conversationId: string;
  /** Model-cited sources are retained under the original field name for stored-row compatibility. */
  topics: string[];
  intent: Intent;
  /** Redacted, truncated question text, kept short for review, never the full conversation. */
  question: string;
}

// Capped list so storage never grows unbounded: push newest, trim to the
// last 2000. A separate daily archive retains 90 days. Email/phone redaction
// is deliberately narrow: access to question text remains restricted.
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

export function buildLogEntry(
  rawQuestion: string,
  topics: string[],
  intent: Intent,
  turn: number,
  conversationId: string,
): QuestionLogEntry {
  return {
    timestamp: new Date().toISOString(),
    turn,
    conversationId,
    topics,
    intent,
    question: redact(rawQuestion).slice(0, 500),
  };
}

export async function logQuestion(entry: QuestionLogEntry): Promise<void> {
  const redis = getClient();
  const day = entry.timestamp.slice(0, 10);
  // Snapshot old retained rows once, before the compatibility buffer changes.
  // The migration marker prevents every request from recopying that snapshot.
  await redis.eval(
    `
    if redis.call('SET', KEYS[4], '1', 'NX') then
      local old=redis.call('LRANGE',KEYS[1],0,-1)
      for _,row in ipairs(old) do redis.call('RPUSH',KEYS[3],row) end
      redis.call('EXPIRE',KEYS[3],ARGV[1])
    end
    redis.call('HSETNX',KEYS[2],ARGV[2],ARGV[3])
    redis.call('EXPIRE',KEYS[2],ARGV[1])
    redis.call('LPUSH',KEYS[1],ARGV[3])
    redis.call('LTRIM',KEYS[1],0,ARGV[4])
    while redis.call('LLEN',KEYS[1]) > 0 do
      local oldest=redis.call('LINDEX',KEYS[1],-1)
      local ok,row=pcall(cjson.decode,oldest)
      if ok and row.timestamp and row.timestamp >= ARGV[5] then break end
      redis.call('RPOP',KEYS[1])
    end
    redis.call('EXPIRE',KEYS[1],ARGV[1])
    return 1`,
    [
      LOG_KEY,
      `chat:questions:${day}`,
      `chat:legacy-snapshot:${day}`,
      "chat:question-archive-v2",
    ],
    [
      QUESTION_RETENTION_SECONDS,
      entry.requestId ?? randomUUID(),
      JSON.stringify(entry),
      LOG_CAP - 1,
      new Date(Date.now() - QUESTION_RETENTION_SECONDS * 1000).toISOString(),
    ],
  );
}
