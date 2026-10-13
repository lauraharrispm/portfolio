import { NextRequest, NextResponse } from "next/server";
import { CHAT_LIMITS } from "@/content/chat/config";
import { askClaude, RespondValidationError } from "@/lib/chat/anthropic-client";
import { mockRespond } from "@/lib/chat/mock";
import { computeChips } from "@/lib/chat/followups";
import { rateLimit, logChatQuestion, recordChatOutcome } from "@/lib/chat/store";
import { validateConversationId } from "@/lib/chat/validate";
import { stripEmDashes } from "@/lib/chat/sanitize";
import type { ChatApiResponse, ChatMessage } from "@/lib/chat/types";

// Reads local .md files (system prompt, knowledge base) via fs, so this
// must run on the Node runtime, not Edge.
export const runtime = "nodejs";

interface ChatRequestBody {
  messages?: ChatMessage[];
  /** Topic ids the visitor has already been shown answers on, accumulated
   * client-side from each response's `sources`. Lets the server pick a
   * genuinely untouched "go sideways" topic without the client re-sending
   * the full structured history of every prior turn. */
  touchedTopics?: string[];
  conversationId?: string;
}

function isMockMode(): boolean {
  return process.env.CHAT_MOCK === "true";
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "127.0.0.1";
}

function bad(message: string, status = 400): NextResponse<ChatApiResponse> {
  return NextResponse.json({ status: "error", message }, { status });
}

function limited(message: string): NextResponse<ChatApiResponse> {
  return NextResponse.json({ status: "limited", message }, { status: 200 });
}

async function recordOutcome(outcome: Parameters<typeof recordChatOutcome>[0]): Promise<void> {
  try {
    await recordChatOutcome(outcome);
  } catch (err) {
    console.error("chat: outcome counter failed", err);
  }
}

async function rejectPayload(message: string, status = 400): Promise<NextResponse<ChatApiResponse>> {
  await recordOutcome("rejected_payload");
  return bad(message, status);
}

const ERROR_MESSAGE =
  "Something went wrong on my end. Try again, or book a call and ask me directly.";
const LIMIT_MESSAGE =
  "That's all the questions I can take for now. The best next step is a real conversation.";

export async function POST(req: NextRequest): Promise<NextResponse<ChatApiResponse>> {
  if (process.env.CHAT_ENABLED !== "true") {
    return NextResponse.json({ status: "error", message: "Chat is not enabled." }, { status: 404 });
  }

  let body: ChatRequestBody;
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return rejectPayload("Invalid request body.");
    }
    body = parsed as ChatRequestBody;
  } catch {
    return rejectPayload("Invalid request body.");
  }

  const conversationId = validateConversationId(body.conversationId);

  const allMessages = Array.isArray(body.messages) ? body.messages : [];
  if (JSON.stringify(allMessages).length > CHAT_LIMITS.maxPayloadChars) {
    return rejectPayload("Conversation too large.", 413);
  }

  const visitorMessages = allMessages.filter((m) => m.role === "user");
  if (visitorMessages.length === 0) {
    return rejectPayload("No visitor message to respond to.");
  }

  const latest = visitorMessages[visitorMessages.length - 1];
  if (typeof latest.content !== "string" || !latest.content.trim()) {
    return rejectPayload("Empty message.");
  }
  if (latest.content.length > CHAT_LIMITS.maxMessageChars) {
    return rejectPayload(`Message too long (max ${CHAT_LIMITS.maxMessageChars} characters).`);
  }

  // Conversation limit: checked before the rate limit / model call, since
  // it's about this one conversation, not this visitor's overall usage.
  if (visitorMessages.length > CHAT_LIMITS.maxVisitorMessages) {
    await recordOutcome("blocked_conversation_cap");
    return limited(LIMIT_MESSAGE);
  }

  const ip = getIp(req);
  try {
    const rl = await rateLimit(ip);
    if (!rl.hour.allowed || !rl.day.allowed) {
      await recordOutcome(!rl.hour.allowed ? "blocked_rate_hour" : "blocked_rate_day");
      return limited(LIMIT_MESSAGE);
    }
  } catch (err) {
    // Fail closed: if the rate-limit store itself is unreachable, we
    // can't confirm this visitor is under their limit, so don't answer.
    // Same friendly error state as a model failure (with the Book a call
    // chip), not the "limited" copy, since this isn't actually a limit
    // being hit, it's the store being down. Logged either way.
    console.error("chat: rate limit check failed, refusing to answer", err);
    return NextResponse.json({ status: "error", message: ERROR_MESSAGE }, { status: 502 });
  }

  const trimmedHistory = allMessages.slice(-CHAT_LIMITS.maxHistoryMessages);

  let payload;
  try {
    payload = isMockMode() ? mockRespond(latest.content) : await askClaude(trimmedHistory);
  } catch (err) {
    if (err instanceof RespondValidationError) {
      await recordOutcome("error_validation");
      return NextResponse.json({ status: "error", message: ERROR_MESSAGE }, { status: 502 });
    }
    // Anthropic.APIError subclasses (rate limit, overloaded, etc.) and any
    // other unexpected failure all surface the same friendly copy; the
    // specifics aren't useful to a visitor and shouldn't leak to the client.
    console.error("chat: model call failed", err);
    await recordOutcome("error_model");
    return NextResponse.json({ status: "error", message: ERROR_MESSAGE }, { status: 502 });
  }

  // Belt-and-suspenders against em dashes: the system prompt already says
  // never to use them, but the model doesn't follow that with full
  // consistency, so strip any that slip through before the visitor sees
  // them. Covers both the real model and (harmlessly, since they're
  // already dash-free) the mock payloads.
  payload.answer = stripEmDashes(payload.answer);
  payload.followups = payload.followups.map((f) => ({ ...f, question: stripEmDashes(f.question) }));

  const touchedTopics = new Set(Array.isArray(body.touchedTopics) ? body.touchedTopics : []);
  const askedQuestions = visitorMessages.map((m) => m.content);

  const chips = computeChips({
    modelFollowups: payload.followups,
    sources: payload.sources,
    intent: payload.intent,
    askedQuestions,
    touchedTopics,
    visitorMessageCount: visitorMessages.length,
  });

  try {
    await logChatQuestion(latest.content, payload.sources, payload.intent, visitorMessages.length, conversationId);
  } catch (err) {
    // Logging failures shouldn't break the visitor's answer.
    console.error("chat: logging failed", err);
  }

  await recordOutcome("ok");

  return NextResponse.json({
    status: "ok",
    answer: payload.answer,
    chips,
    sources: payload.sources,
    intent: payload.intent,
  });
}
