import type { RespondPayload } from "./types";

// Answers drawn from knowledge.md for common entry points. Keep them
// available when Claude is down without guessing at other questions.
const answers = new Map<string, RespondPayload>([
  ["how do you think about onboarding", {
    answer: "Laura starts by looking at where people drop off before they reach their first moment of value. She cuts steps that confuse people and keeps steps that build confidence. At GlossGenius, showing the value of payments up front and adding a persistent progress bar made the flow longer, but **onboarding completion rose 80%**.",
    followups: [],
    sources: ["case_payments_onboarding"],
    intent: "evaluating",
  }],
  ["how do you decide what to build next", {
    answer: "Laura starts with the business goal and looks across the funnel to find the biggest bottleneck the team can do something about. Once the problem is clear, she compares solutions by reach, impact, confidence, and effort. A quick prototype can help test which option is worth building before engineering commits to it.",
    followups: [],
    sources: ["process"],
    intent: "evaluating",
  }],
]);

export function findSavedAnswer(question: string): RespondPayload | undefined {
  return answers.get(question.trim().toLowerCase().replace(/\?$/, ""));
}
