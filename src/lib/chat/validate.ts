import type { RespondPayload } from "./types";
import { TOPICS } from "@/content/chat/config";
import { randomUUID } from "node:crypto";

const INTENTS = new Set(["browsing", "evaluating", "ready"]);
const TOPIC_SET = new Set<string>(TOPICS);
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateConversationId(value: unknown): string {
  return typeof value === "string" && UUID_V4.test(value) ? value : randomUUID();
}

/** An answer can still be shown when optional suggestions or tags are unusable. */
export function validateRespondPayload(input: unknown): RespondPayload | null {
  if (typeof input !== "object" || input === null) return null;
  const { answer, followups, sources, intent } = input as Record<string, unknown>;
  if (typeof answer !== "string" || !answer.trim()) return null;

  const tags = Array.isArray(sources)
    ? sources.filter((source): source is string =>
        typeof source === "string" && TOPIC_SET.has(source.toLowerCase()),
      ).map((source) => source.toLowerCase())
    : [];
  const questions = Array.isArray(followups)
    ? followups.flatMap((item: unknown) => {
        if (typeof item !== "object" || item === null) return [];
        const { question, topic } = item as Record<string, unknown>;
        return typeof question === "string" && question.trim() &&
          typeof topic === "string" && TOPIC_SET.has(topic.toLowerCase())
          ? [{ question: question.trim(), topic: topic.toLowerCase() }]
          : [];
      }).slice(0, 3)
    : [];
  const normalizedIntent = typeof intent === "string" ? intent.toLowerCase() : "";
  return {
    answer: answer.trim(),
    followups: questions,
    sources: [...new Set(tags)],
    intent: INTENTS.has(normalizedIntent) ? normalizedIntent as RespondPayload["intent"] : "browsing",
  };
}
