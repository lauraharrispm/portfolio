import type { RespondPayload } from "./types";
import { TOPICS } from "@/content/chat/config";
import { randomUUID } from "node:crypto";

const INTENTS = new Set(["browsing", "evaluating", "ready"]);
const TOPIC_SET = new Set<string>(TOPICS);
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateConversationId(value: unknown): string {
  return typeof value === "string" && UUID_V4.test(value) ? value : randomUUID();
}

/**
 * Hand-rolled validation of the model's tool input (no zod, per the "no
 * new dependencies" rule). `strict: true` on the tool already guarantees
 * the *shape* matches the JSON schema, but we still check it ourselves:
 * strict mode is enforced by the API, and this route should never trust
 * an upstream guarantee blindly for something a malformed response could
 * break the UI on. Returns null if anything is wrong, so the caller can
 * retry once and then fall back to the error state.
 */
export function validateRespondPayload(input: unknown): RespondPayload | null {
  if (typeof input !== "object" || input === null) return null;
  const obj = input as Record<string, unknown>;

  if (typeof obj.answer !== "string" || !obj.answer.trim()) return null;

  if (!Array.isArray(obj.followups) || obj.followups.length < 2 || obj.followups.length > 3) {
    return null;
  }
  for (const f of obj.followups) {
    if (typeof f !== "object" || f === null) return null;
    const fo = f as Record<string, unknown>;
    if (typeof fo.question !== "string" || !fo.question.trim()) return null;
    if (typeof fo.topic !== "string" || !TOPIC_SET.has(fo.topic)) return null;
  }

  if (!Array.isArray(obj.sources) || !obj.sources.every((s) => typeof s === "string")) {
    return null;
  }

  if (typeof obj.intent !== "string" || !INTENTS.has(obj.intent)) return null;

  return obj as unknown as RespondPayload;
}
