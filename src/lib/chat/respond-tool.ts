import { TOPICS } from "@/content/chat/config";

/**
 * The single tool every call is forced to use (tool_choice: {type:"tool",
 * name:"respond"}), so the model's reply always arrives as structured
 * data instead of free text. `strict: true` asks the API to guarantee the
 * input matches this schema exactly; validate.ts still checks it by hand
 * before trusting it, since strict mode is a guarantee about shape, not
 * about the content rules (length, topic validity, near-duplicates) that
 * live in followups.ts.
 */
export const RESPOND_TOOL = {
  name: "respond",
  description:
    "Send your reply to the visitor. Always call this tool, exactly once, for every turn. " +
    "`answer` is the plain-text reply (light markdown, bold only), grounded only in the " +
    "knowledge base, usually under 120 words. `followups` is 2 to 3 suggested next questions: " +
    "each one must be answerable from the knowledge base, tagged with the single best-matching " +
    "topic id, phrased the way a visitor would type it (never \"What does Laura's AI...\"), and " +
    "60 characters or less. Prefer at least one follow-up on a different topic than the one you " +
    "just answered, so the conversation can range across the site. `sources` lists every topic id " +
    "(including case study slugs, e.g. case_payments_onboarding) the answer actually drew on; " +
    "leave it empty if you said you didn't know. `intent` is your best read of the visitor: " +
    "\"ready\" if they showed buying intent (asked about pricing, availability, starting, next " +
    "steps, or described their own company's problem in detail), \"evaluating\" if they're " +
    "comparing or asking pointed fit questions, otherwise \"browsing\".",
  input_schema: {
    type: "object" as const,
    additionalProperties: false,
    properties: {
      answer: {
        type: "string" as const,
        description: "Plain text answer, light markdown (bold only), under ~120 words.",
      },
      followups: {
        type: "array" as const,
        // No minItems/maxItems here: Anthropic's custom tool schema
        // validation rejects array minItems values other than 0 or 1
        // ("tools.0.custom: For 'array' type, 'minItems' values other
        // than 0 or 1 are not supported"), so the 2-3 count is enforced
        // entirely by validateRespondPayload in validate.ts after the
        // call, same as every other content rule that isn't pure shape.
        items: {
          type: "object" as const,
          additionalProperties: false,
          properties: {
            question: {
              type: "string" as const,
              description: "A follow-up question, 60 characters or fewer, written the way a visitor would type it.",
            },
            topic: {
              type: "string" as const,
              enum: TOPICS,
              description: "The single topic id this question is answerable from.",
            },
          },
          required: ["question", "topic"],
        },
      },
      sources: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Topic ids (including case study slugs) this answer drew on. Empty if the answer was \"I don't know.\"",
      },
      intent: {
        type: "string" as const,
        enum: ["browsing", "evaluating", "ready"] as const,
        description: "Your read of the visitor's buying intent this turn.",
      },
    },
    required: ["answer", "followups", "sources", "intent"],
  },
  strict: true,
};
