// Only bounded behavioral metadata may enter GA or the event collector.
export const EVENT_NAMES = [
  "cta_click",
  "booking_cta_click",
  "contact_click",
  "project_open",
  "section_view",
  "booking_widget_ready",
  "booking_widget_error",
  "booking_created",
  "chat_start",
  "chat_message_sent",
  "chat_response_received",
  "chat_response_displayed",
  "chat_action_shown",
  "chat_action_click",
  "chat_clear",
  "chat_limit_reached",
  "chat_error",
  "chat_source_cited",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];
export type EventParams = Record<string, string | number>;
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const token = /^[a-z0-9_:-]{1,80}$/;
const enumFields: Record<string, readonly string[]> = {
  input_source: ["free_text", "starter_example", "go_deeper", "go_sideways"],
  action_kind: ["deeper", "sideways", "book_call", "case_study"],
  intent: ["browsing", "evaluating", "ready"],
  section_id: ["ask", "services", "how", "work", "book"],
  booking_status: ["accepted", "pending", "confirmed", "unknown"],
  contact_method: ["email", "linkedin"],
  traffic_source: ["direct", "linkedin", "google", "other"],
};
const tokens = new Set([
  "cta_label",
  "cta_location",
  "project_id",
  "action_id",
  "target_id",
  "starter_id",
  "error_type",
  "source_id",
]);
const numbers = new Set([
  "turn_number",
  "action_position",
  "latency_ms",
  "turn_count",
]);
const ids = new Set(["conversation_id", "request_id"]);
export function cleanParams(input: unknown): EventParams | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const result: EventParams = {};
  for (const [key, value] of Object.entries(input)) {
    if (ids.has(key) && typeof value === "string" && UUID.test(value))
      result[key] = value;
    else if (
      enumFields[key] &&
      typeof value === "string" &&
      enumFields[key].includes(value)
    )
      result[key] = value;
    else if (tokens.has(key) && typeof value === "string" && token.test(value))
      result[key] = value;
    else if (
      numbers.has(key) &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 3_600_000
    )
      result[key] = Math.round(value);
    else return null; // Fail closed on unknown keys, text, URLs, or malformed values.
  }
  return result;
}
export interface BrowserEvent {
  name: EventName;
  event_id: string;
  params: EventParams;
}
export function cleanEvent(input: unknown): BrowserEvent | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  if (Object.keys(obj).some((k) => !["name", "event_id", "params"].includes(k)))
    return null;
  if (
    !EVENT_NAMES.includes(obj.name as EventName) ||
    typeof obj.event_id !== "string" ||
    !UUID.test(obj.event_id)
  )
    return null;
  const params = cleanParams(obj.params);
  return params
    ? { name: obj.name as EventName, event_id: obj.event_id, params }
    : null;
}
