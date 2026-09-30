// Shared types for the "Ask my AI anything" chat feature.
// Kept dependency-free (no zod, no new packages) — validated by hand in validate.ts.

export type Topic =
  | "services"
  | "fractional"
  | "project_based"
  | "first_90_days"
  | "fit"
  | "process"
  | "ai_approach"
  | "team_ai_enablement"
  | "case_payments_onboarding"
  | "case_phone_agent_tool"
  | "case_therapist_directory"
  | "case_annual_plans"
  | "case_burrow_growth"
  | "case_patient_intake"
  | "case_patient_portal"
  | "background"
  | "logistics"
  | "pricing"
  | "contact";

export type Intent = "browsing" | "evaluating" | "ready";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Raw shape the model returns via the forced `respond` tool. */
export interface RespondPayload {
  answer: string;
  followups: { question: string; topic: string }[];
  sources: string[];
  intent: Intent;
}

export type ChipKind = "deeper" | "sideways" | "book_call" | "case_study";

export interface Chip {
  kind: ChipKind;
  label: string;
  /** For book_call: "#book". For case_study: "#work-<slug>". For deeper/sideways: the question text to ask. */
  href?: string;
  question?: string;
}

/** What the API route returns to the client on a normal turn. */
export interface ChatTurnResponse {
  status: "ok";
  answer: string;
  chips: Chip[];
  sources: string[];
  intent: Intent;
}

export interface ChatErrorResponse {
  status: "error" | "limited";
  message: string;
}

export type ChatApiResponse = ChatTurnResponse | ChatErrorResponse;
