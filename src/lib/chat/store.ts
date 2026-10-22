// Single switch point between the mock (in-memory) and real (Upstash)
// data layer, so route.ts doesn't need to branch on CHAT_MOCK itself.
import {
  checkRateLimit,
  incrementChatOutcome,
  type ChatOutcome,
} from "./rate-limit";
import {
  checkRateLimitMock,
  incrementChatOutcomeMock,
} from "./rate-limit-mock";
import { logQuestion, buildLogEntry, type QuestionLogEntry } from "./logging";
import { logQuestionMock } from "./logging-mock";
import type { Intent } from "./types";

export { buildLogEntry };
export type { QuestionLogEntry };

function isMock(): boolean {
  return (
    process.env.CHAT_MOCK === "true" || process.env.VERCEL_ENV === "preview"
  );
}

export async function rateLimit(ip: string) {
  return isMock() ? checkRateLimitMock(ip) : checkRateLimit(ip);
}

export async function logChatQuestion(
  rawQuestion: string,
  topics: string[],
  intent: Intent,
  turn: number,
  conversationId: string,
  metadata: Partial<QuestionLogEntry> = {},
): Promise<void> {
  const entry = {
    ...buildLogEntry(rawQuestion, topics, intent, turn, conversationId),
    ...metadata,
  };
  if (isMock()) {
    await logQuestionMock(entry);
  } else {
    await logQuestion(entry);
  }
}

export async function recordChatOutcome(outcome: ChatOutcome): Promise<void> {
  if (isMock()) {
    await incrementChatOutcomeMock(outcome);
  } else {
    await incrementChatOutcome(outcome);
  }
}
