import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);

function loadChatRoute(create) {
  const modules = new Map();
  const deferred = [];
  const errors = [];
  const outcomes = [];
  const events = [];
  class FakeAnthropic {
    messages = { create };
    static APIError = class extends Error {};
  }
  const stubs = {
    "@anthropic-ai/sdk": FakeAnthropic,
    "next/server": { NextResponse: Response, after: (fn) => deferred.push(fn) },
    "@/lib/chat/store": {
      rateLimit: async () => ({ hour: { allowed: true }, day: { allowed: true } }),
      logChatQuestion: async () => { throw new Error("logging offline"); },
      recordChatOutcome: async (outcome) => outcomes.push(outcome),
    },
    "@/lib/measurement/store": { storeEvents: async (batch) => events.push(...batch) },
  };

  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const loaded = { exports: {} };
    const localRequire = (specifier) => {
      if (specifier in stubs) return stubs[specifier];
      if (specifier.startsWith("@/")) return load(resolve("src", specifier.slice(2) + ".ts"));
      if (specifier.startsWith(".")) return load(resolve(dirname(file), specifier + ".ts"));
      return require(specifier);
    };
    new Function("module", "exports", "require", "process", "console", compiled)(
      loaded, loaded.exports, localRequire,
      { cwd: process.cwd, env: { CHAT_ENABLED: "true", ANTHROPIC_API_KEY: "test-key" } },
      { error: (...args) => errors.push(args), info: () => {} },
    );
    modules.set(file, loaded.exports);
    return loaded.exports;
  }

  const { POST } = load(resolve("src/app/api/chat/route.ts"));
  return {
    post: (messages) => POST(new Request("https://example.test/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    })),
    async finish() { await Promise.all(deferred.splice(0).map((fn) => fn())); },
    errors, outcomes, events,
  };
}

const user = (content) => ({ role: "user", content });

test("a truncated model response retries with room for a complete answer and tolerates missing chips", async () => {
  const requests = [];
  const chat = loadChatRoute(async (request) => {
    requests.push(request);
    if (requests.length === 1) return { stop_reason: "max_tokens", content: [] };
    return {
      stop_reason: "tool_use",
      content: [{ type: "tool_use", name: "respond", input: {
        answer: "Focus on the bottleneck.",
        followups: [{ question: " ", topic: "process" }],
        sources: ["PROCESS", "unrecognized"],
        intent: "Evaluating",
      } }],
    };
  });

  const response = await chat.post([user("What should we build?")]);
  assert.equal(response.status, 200);
  const turn = await response.json();
  assert.equal(turn.answer, "Focus on the bottleneck.");
  assert.equal(turn.intent, "evaluating");
  assert.deepEqual(turn.sources, ["process"]);
  assert.ok(turn.chips.length > 0);
  assert.equal(requests.length, 2);
  assert.ok(requests[1].max_tokens > requests[0].max_tokens);
  assert.deepEqual(chat.outcomes, []);
  await chat.finish();
  assert.ok(chat.outcomes.includes("error_logging"));
  assert.equal(chat.events[0].params.outcome, "ok");
});

test("a provider outage serves the two reported questions from the portfolio and marks unsupported questions retryable", async () => {
  const chat = loadChatRoute(async () => { throw new Error("Claude offline"); });
  for (const [question, source] of [
    ["How do you think about onboarding?", "case_payments_onboarding"],
    ["How do you decide what to build next?", "process"],
  ]) {
    const response = await chat.post([user(question)]);
    assert.equal(response.status, 200);
    const turn = await response.json();
    assert.equal(turn.saved, true);
    assert.ok(turn.sources.includes(source));
    await chat.finish();
    assert.equal(chat.events.at(-1).params.outcome, "saved_answer");
  }

  const unavailable = await chat.post([user("What does fractional work look like?")]);
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).status, "error");
  await chat.finish();
  assert.equal(chat.events.at(-1).params.outcome, "error_model");
});

test("trimmed conversation history starts and ends with a visitor turn", async () => {
  const chat = loadChatRoute(async ({ messages }) => {
    assert.equal(messages.length, 9);
    assert.equal(messages[0].role, "user");
    assert.equal(messages.at(-1).content, "My follow-up");
    return { stop_reason: "refusal", content: [] };
  });
  const messages = Array.from({ length: 7 }, (_, i) => [
    user(`Question ${i}`),
    { role: "assistant", content: `Answer ${i}` },
  ]).flat();
  const response = await chat.post([...messages, user("My follow-up")]);
  assert.equal(response.status, 200);
  assert.match((await response.json()).answer, /Laura's work/);
});
