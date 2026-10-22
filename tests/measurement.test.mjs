import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const load = (
  path,
  requireFn = () => {
    throw Error("unexpected import");
  },
  globals = {},
) => {
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, {
    module: loaded,
    exports: loaded.exports,
    require: requireFn,
    console,
    ...globals,
  });
  return loaded.exports;
};
const contract = load("src/lib/measurement/contract.ts");
const id = "77123083-64b0-4bba-a7cf-377ae69ca642";
test("collector accepts only metadata and rejects accidental text or arbitrary event names", () => {
  assert.ok(
    contract.cleanEvent({
      name: "chat_message_sent",
      event_id: id,
      params: {
        input_source: "starter_example",
        conversation_id: id,
        turn_number: 1,
      },
    }),
  );
  for (const params of [
    { question: "private question" },
    { cta_label: "name@example.com" },
    { input_source: "some typed words" },
    { conversation_id: "an-email@example.com" },
    { turn_number: NaN },
    { page_location: "https://example.com/?email=private" },
  ])
    assert.equal(
      contract.cleanEvent({ name: "chat_start", event_id: id, params }),
      null,
    );
  assert.equal(
    contract.cleanEvent({
      name: "chat_request_completed",
      event_id: id,
      params: {},
    }),
    null,
  );
});
test("early events queue, IDs join correctly, and questions cannot leak to GA or collector", () => {
  const ga = [],
    delivered = [];
  const context = {
    document: { referrer: "", cookie: "" },
    window: { dataLayer: [], gtag: (...args) => ga.push(args) },
    location: { hostname: "www.lauraharrispm.com" },
    navigator: { doNotTrack: "0" },
    crypto: { randomUUID: () => id },
    process: { env: { NEXT_PUBLIC_MEASUREMENT_ENV: "production" } },
    setTimeout: () => 1,
    clearTimeout: () => {},
    fetch: async (url, init) => {
      delivered.push(JSON.parse(init.body));
      return { ok: true };
    },
  };
  const analytics = load("src/lib/analytics.ts", () => contract, context);
  analytics.setAnalyticsConversation(id);
  analytics.trackEvent("chat_message_sent", {
    input_source: "free_text",
    turn_number: 1,
  });
  analytics.trackEvent("chat_message_sent", { question: "private question" });
  analytics.flushEvents();
  assert.equal(ga.length, 1);
  assert.equal(delivered[0].events.length, 1);
  assert.equal(delivered[0].events[0].params.conversation_id, id);
  assert.ok(!JSON.stringify(delivered).includes("private question"));
  context.navigator.doNotTrack = "1";
  analytics.trackEvent("chat_start", {});
  assert.equal(ga.length, 1);
});
test("preview and local hosts never send production measurement", () => {
  let calls = 0;
  const analytics = load("src/lib/analytics.ts", () => contract, {
    window: { gtag: () => calls++ },
    location: { hostname: "preview.vercel.app" },
    navigator: {},
    process: { env: { NEXT_PUBLIC_MEASUREMENT_ENV: "preview" } },
  });
  analytics.trackEvent("chat_start", {});
  assert.equal(calls, 0);
});
