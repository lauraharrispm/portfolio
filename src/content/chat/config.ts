import type { Topic } from "@/lib/chat/types";

// ─── Availability ──────────────────────────────────────────────────────
// The only place to update Laura's current availability. getSystemPrompt
// in anthropic-client.ts appends this as a labeled line onto the
// assembled prompt at request time, so this single constant is what the
// chat actually says; knowledge.md itself no longer states a specific
// availability.
export const CHAT_AVAILABILITY =
  "Laura currently has availability for 1 to 2 clients in Q4 2026.";

// ─── Limits ────────────────────────────────────────────────────────────
// All the numbers from the spec, in one place so they're easy to tune.
export const CHAT_LIMITS = {
  /** Max characters allowed in a single visitor message. */
  maxMessageChars: 500,
  /** Max visitor (user-role) messages allowed in one conversation. */
  maxVisitorMessages: 12,
  /** Server trims incoming history to this many messages before calling the model. */
  maxHistoryMessages: 10,
  /** Hard cap on the total size (chars) of the messages array in a request body. */
  maxPayloadChars: 20000,
  /** Answers should read under ~120 words; this is the output token ceiling, not a target. */
  maxAnswerTokens: 600,
  /** Rate limit: messages per IP per hour. */
  perHourLimit: 20,
  /** Rate limit: messages per IP per day. */
  perDayLimit: 60,
  /** Follow-up question character limit (spec: 60 chars max). */
  maxFollowupChars: 60,
} as const;

// ─── Topic map ─────────────────────────────────────────────────────────
export const TOPICS: Topic[] = [
  "services",
  "fractional",
  "project_based",
  "first_90_days",
  "fit",
  "process",
  "ai_approach",
  "team_ai_enablement",
  "case_payments_onboarding",
  "case_phone_agent_tool",
  "case_therapist_directory",
  "case_annual_plans",
  "case_burrow_growth",
  "case_patient_intake",
  "case_patient_portal",
  "background",
  "logistics",
  "pricing",
  "contact",
];

/**
 * Case study topics that map to a real, published case study slug (and so
 * can open the reading view / earn the "Read the story" chip). The two
 * patient topics are in TOPICS per spec (for when those studies ship) but
 * have no entry here yet, so they never trigger the case-study chip.
 */
export const CASE_STUDY_SLUGS: Partial<Record<Topic, string>> = {
  case_payments_onboarding: "payments-onboarding",
  case_phone_agent_tool: "phone-agent-tool",
  case_therapist_directory: "therapist-directory",
  case_annual_plans: "annual-plans",
  case_burrow_growth: "burrow-growth",
};

/** Case study titles, for the "Read the [title] story" chip label. Kept
 * here (not re-derived from src/content/projects.ts) so this package has
 * no dependency on the v2 site content and stays easy to merge later. */
export const CASE_STUDY_TITLES: Record<string, string> = {
  "payments-onboarding": "Payments onboarding redesign",
  "phone-agent-tool": "Scheduling tool for phone agents",
  "therapist-directory": "Therapist directory",
  "annual-plans": "Billing rebuild for AI add-ons and annual subscriptions",
  "burrow-growth": "Ecommerce website redesign",
};

// ─── Starter examples (rotating placeholder) ──────────────────────────
export const STARTER_QUESTIONS: string[] = [
  "How would you fix our onboarding drop-off?",
  "Fractional or project-based: which fits us?",
  "Are we a fit if we just raised a Series A?",
  "How do you work with engineers part-time?",
  "What's the biggest growth win you've shipped?",
  "How do you use AI without building the wrong thing?",
];

// ─── Curated fallback questions per topic ─────────────────────────────
// Used when the model returns fewer than 2 valid suggestions, or when a
// suggestion is dropped (bad topic, too long, near-duplicate). 2-3 each.
export const CURATED_FALLBACKS: Record<Topic, string[]> = {
  services: [
    "What parts of the funnel do you own?",
    "Do you only work on acquisition?",
  ],
  fractional: [
    "What does fractional actually look like week to week?",
    "How many days a week do you work?",
    "How long do fractional engagements usually run?",
  ],
  project_based: [
    "What does a project-based engagement include?",
    "Fractional or project-based: which fits us?",
    "Can a project turn into ongoing work?",
  ],
  first_90_days: [
    "What happens in the first 30 days?",
    "What should we expect by day 90?",
  ],
  fit: [
    "Are we a fit if we just raised a Series A?",
    "What kind of company is a bad fit for you?",
    "Do you work with enterprise software companies?",
  ],
  process: [
    "How do you decide what to build first?",
    "What does your process look like end to end?",
  ],
  ai_approach: [
    "How do you use AI without building the wrong thing?",
    "What AI tools are in your stack?",
    "Does AI replace your judgment on what to build?",
  ],
  team_ai_enablement: [
    "Do you help teams adopt AI tools too?",
    "What did the GlossGenius AI rollout involve?",
  ],
  case_payments_onboarding: [
    "What happened with the payments onboarding project?",
    "How did you lift onboarding completion 80%?",
  ],
  case_phone_agent_tool: [
    "Tell me about the phone agent scheduling tool.",
    "What was the impact of the scheduling tool at Rula?",
  ],
  case_therapist_directory: [
    "How did the therapist directory grow organic traffic?",
    "What was the SEO play at Rula?",
  ],
  case_annual_plans: [
    "How did you launch annual plans with no downtime?",
    "What was the annual subscription project at GlossGenius?",
  ],
  case_burrow_growth: [
    "How did Burrow's revenue grow 4x?",
    "What did you change on Burrow.com?",
  ],
  case_patient_intake: [
    "Have you worked on patient intake before?",
  ],
  case_patient_portal: [
    "Have you worked on a patient portal before?",
  ],
  background: [
    "What's Laura's background before fractional work?",
    "Where has she worked full-time?",
  ],
  logistics: [
    "Is Laura based in the US?",
    "Is she open to remote work?",
  ],
  pricing: [
    "How does pricing work?",
    "What does a project-based engagement cost?",
  ],
  contact: [
    "How do I get in touch?",
    "Can I book a call?",
  ],
};
