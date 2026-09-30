// Single switch point between the mock (in-memory) and real (Upstash)
// data layer, so route.ts doesn't need to branch on CHAT_MOCK itself.
import { checkRateLimit } from "./rate-limit";
import { checkRateLimitMock } from "./rate-limit-mock";
import { logQuestion, buildLogEntry, type QuestionLogEntry } from "./logging";
import { logQuestionMock } from "./logging-mock";
import type { Intent } from "./types";

export { buildLogEntry };
export type { QuestionLogEntry };

function isMock(): boolean {
  return process.env.CHAT_MOCK === "true";
}

export async function rateLimit(ip: string) {
  return isMock() ? checkRateLimitMock(ip) : checkRateLimit(ip);
}

export async function logChatQuestion(rawQuestion: string, topics: string[], intent: Intent): Promise<void> {
  const entry = buildLogEntry(rawQuestion, topics, intent);
  if (isMock()) {
    await logQuestionMock(entry);
  } else {
    await logQuestion(entry);
  }
}
