import { CASE_STUDY_SLUGS, CASE_STUDY_TITLES, CHAT_LIMITS, CURATED_FALLBACKS, TOPICS } from "@/content/chat/config";
import type { Chip, Intent, Topic } from "./types";

const TOPIC_SET = new Set<string>(TOPICS);

function normalize(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Word-overlap similarity, 0 to 1. Good enough for "near-duplicate", not
 * trying to be a real semantic similarity check (no new dependency for it). */
function similarity(a: string, b: string): number {
  const wa = new Set(normalize(a).split(" ").filter(Boolean));
  const wb = new Set(normalize(b).split(" ").filter(Boolean));
  if (wa.size === 0 || wb.size === 0) return 0;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared / Math.max(wa.size, wb.size);
}

function isNearDuplicate(question: string, askedQuestions: string[]): boolean {
  return askedQuestions.some((a) => similarity(question, a) >= 0.7);
}

interface ValidFollowup {
  question: string;
  topic: Topic;
}

/** Drops anything with an invalid topic, over the length limit, or a
 * near-duplicate of something already asked this conversation. */
function filterModelFollowups(
  raw: { question: string; topic: string }[],
  askedQuestions: string[]
): ValidFollowup[] {
  const out: ValidFollowup[] = [];
  for (const f of raw) {
    if (!TOPIC_SET.has(f.topic)) continue;
    if (f.question.length > CHAT_LIMITS.maxFollowupChars) continue;
    if (isNearDuplicate(f.question, askedQuestions)) continue;
    out.push({ question: f.question, topic: f.topic as Topic });
  }
  return out;
}

/** First curated fallback for a topic that isn't a near-duplicate of
 * anything already asked. Returns null if every curated option for that
 * topic has already effectively been asked. */
function curatedFallbackFor(topic: Topic, askedQuestions: string[]): string | null {
  const options = CURATED_FALLBACKS[topic] ?? [];
  for (const q of options) {
    if (!isNearDuplicate(q, askedQuestions)) return q;
  }
  return null;
}

function pickAnyUntouchedTopic(touchedTopics: Set<string>): Topic | null {
  for (const t of TOPICS) {
    if (!touchedTopics.has(t)) return t;
  }
  return null;
}

export interface ComputeChipsInput {
  modelFollowups: { question: string; topic: string }[];
  /** Topic ids (and case study slugs) this turn's answer drew on. */
  sources: string[];
  intent: Intent;
  /** Every question the visitor has asked so far in this conversation, oldest first. */
  askedQuestions: string[];
  /** Every topic drawn on (via sources) anywhere earlier in this conversation. */
  touchedTopics: Set<string>;
  /** Visitor message count including the one that produced this answer. */
  visitorMessageCount: number;
}

export function computeChips(input: ComputeChipsInput): Chip[] {
  const { modelFollowups, sources, intent, askedQuestions, touchedTopics, visitorMessageCount } = input;

  const valid = filterModelFollowups(modelFollowups, askedQuestions);
  const usedQuestions = new Set<string>();

  // ── Chip 1: go deeper (same topic as this answer) ──
  const primaryTopic = (sources.find((s) => TOPIC_SET.has(s)) ?? null) as Topic | null;
  let deeper = primaryTopic ? valid.find((f) => f.topic === primaryTopic) : undefined;
  if (!deeper && primaryTopic) {
    const fallback = curatedFallbackFor(primaryTopic, askedQuestions);
    if (fallback) deeper = { question: fallback, topic: primaryTopic };
  }
  if (!deeper) {
    // No usable topic from sources (e.g. the model said "I don't know") —
    // just take the first valid model suggestion, whatever its topic.
    deeper = valid[0];
  }
  if (deeper) usedQuestions.add(deeper.question);

  // ── Chip 2: go sideways (untouched topic) ──
  let sideways = valid.find(
    (f) => !touchedTopics.has(f.topic) && !usedQuestions.has(f.question)
  );
  if (!sideways) {
    const topic = pickAnyUntouchedTopic(touchedTopics);
    if (topic) {
      const fallback = curatedFallbackFor(topic, askedQuestions);
      if (fallback) sideways = { question: fallback, topic };
    }
  }
  if (sideways) usedQuestions.add(sideways.question);

  // ── Chip 3: deterministic action chip ──
  const chips: Chip[] = [];
  if (deeper) {
    chips.push({ kind: "deeper", label: deeper.question, question: deeper.question });
  }
  if (sideways) {
    chips.push({ kind: "sideways", label: sideways.question, question: sideways.question });
  }

  const caseStudySlug = sources
    .map((s) => CASE_STUDY_SLUGS[s as Topic])
    .find((slug): slug is string => Boolean(slug));

  if (intent === "ready") {
    chips.push({ kind: "book_call", label: "Book a call", href: "#book" });
  } else if (caseStudySlug) {
    chips.push({
      kind: "case_study",
      label: `Read the ${CASE_STUDY_TITLES[caseStudySlug]} story`,
      href: `#work-${caseStudySlug}`,
    });
  } else if (visitorMessageCount >= 3) {
    chips.push({ kind: "book_call", label: "Book a call", href: "#book" });
  } else {
    let third = valid.find((f) => !usedQuestions.has(f.question) && !touchedTopics.has(f.topic));
    if (!third) {
      const topic = pickAnyUntouchedTopic(new Set([...touchedTopics, ...usedQuestionTopics(chips, valid)]));
      if (topic) {
        const fallback = curatedFallbackFor(topic, askedQuestions);
        if (fallback) third = { question: fallback, topic };
      }
    }
    if (third) {
      chips.push({ kind: "sideways", label: third.question, question: third.question });
    } else {
      // Last resort so we always return 3 chips: a call, which is always safe.
      chips.push({ kind: "book_call", label: "Book a call", href: "#book" });
    }
  }

  return chips;
}

function usedQuestionTopics(chips: Chip[], valid: ValidFollowup[]): Topic[] {
  const usedText = new Set(chips.map((c) => c.question).filter(Boolean));
  return valid.filter((f) => usedText.has(f.question)).map((f) => f.topic);
}
