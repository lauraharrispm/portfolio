import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { RESPOND_TOOL } from "./respond-tool";
import { validateRespondPayload } from "./validate";
import type { ChatMessage, RespondPayload } from "./types";
import { CHAT_AVAILABILITY, CHAT_LIMITS } from "@/content/chat/config";

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) throw new Error("chat_missing_api_key");
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

let cachedSystemPrompt: string | null = null;
function getSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const promptPath = path.join(
    process.cwd(),
    "src/content/chat/system-prompt.md",
  );
  const knowledgePath = path.join(
    process.cwd(),
    "src/content/chat/knowledge.md",
  );
  const prompt = fs.readFileSync(promptPath, "utf-8");
  const knowledge = fs.readFileSync(knowledgePath, "utf-8");
  // CHAT_AVAILABILITY (src/content/chat/config.ts) is the one place to
  // update availability; appended here as a short labeled line rather
  // than written into knowledge.md, so there's exactly one value the
  // chat can ever say.
  cachedSystemPrompt = `${prompt}\n\n# Knowledge base\n\n${knowledge}\n\nCurrent availability: ${CHAT_AVAILABILITY}\n`;
  return cachedSystemPrompt;
}

export class RespondValidationError extends Error {}

/**
 * One call to Claude, forced through the `respond` tool. Validates the
 * tool input against our own schema (not just the API's strict-mode
 * guarantee); if it's malformed, retries once with a short nudge message
 * appended, then gives up and lets the caller show the error state.
 */
export async function askClaude(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<RespondPayload> {
  const model = process.env.CHAT_MODEL || DEFAULT_MODEL;
  const client = getClient();

  const deadline = AbortSignal.timeout(22_000);
  const modelSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
  const call = (extraMessages: ChatMessage[], maxTokens: number) =>
    client.messages.create({
      model,
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: getSystemPrompt(),
          // Identical on every call, so this is the cache breakpoint.
          // Below Haiku 4.5's 4,096-token minimum, this silently just
          // doesn't cache; see docs/ai-chat-decisions.md.
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [RESPOND_TOOL],
      tool_choice: { type: "tool", name: "respond", disable_parallel_tool_use: true },
      messages: [...messages, ...extraMessages].map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }, { signal: modelSignal, timeout: 12_000, maxRetries: 1 });

  const first = await call([], CHAT_LIMITS.maxAnswerTokens);
  const firstValid = readAnswer(first);
  if (firstValid) return firstValid;

  // Retry once: malformed tool input is rare with strict:true, but not
  // impossible, and the spec calls for exactly one retry before failing.
  const retry = await call([
    { role: "assistant", content: "(malformed response, retrying)" },
    {
      role: "user",
      content:
        "Your last response didn't match the required format. Call the respond tool again with valid input: answer, 2-3 followups (each with question and topic), sources, and intent.",
    },
  ], first.stop_reason === "max_tokens" ? 1000 : CHAT_LIMITS.maxAnswerTokens);
  const retryValid = readAnswer(retry);
  if (retryValid) return retryValid;

  throw new RespondValidationError(
    retry.stop_reason ?? "missing_answer",
  );
}

function readAnswer(message: Anthropic.Message): RespondPayload | null {
  if (message.stop_reason === "max_tokens") return null;
  if (message.stop_reason === "refusal") {
    return {
      answer: "I can answer questions about Laura's work and how she approaches product growth.",
      followups: [],
      sources: [],
      intent: "browsing",
    };
  }
  const block = message.content.find(
    (b): b is Anthropic.ToolUseBlock =>
      b.type === "tool_use" && b.name === "respond",
  );
  return validateRespondPayload(block?.input);
}

export function getPromptVersion() {
  return createHash("sha256")
    .update(getSystemPrompt())
    .digest("hex")
    .slice(0, 16);
}

export function describeModelError(err: unknown) {
  if (err instanceof Anthropic.APIError) {
    const reason = err.status === 400 && /credit balance is too low/i.test(err.message)
      ? "insufficient_credits"
      : err.type;
    return { type: err.constructor.name, reason, status: err.status, providerRequestId: err.requestID };
  }
  if (err instanceof RespondValidationError) return { type: "invalid_response", reason: err.message };
  if (err instanceof Error && err.message === "chat_missing_api_key") return { type: "missing_api_key" };
  if (err instanceof Error && "code" in err && err.code === "ENOENT") return { type: "missing_prompt_file" };
  return { type: err instanceof Error ? err.constructor.name : "unknown" };
}
