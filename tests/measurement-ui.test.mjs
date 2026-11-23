import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(path, imports, globals = {}) {
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, {
    module: loaded, exports: loaded.exports,
    require: (name) => {
      if (!(name in imports)) throw Error(`Unexpected import: ${name}`);
      return imports[name];
    },
    ...globals,
  });
  return loaded.exports;
}

// Execute the actual head snippet, with a cookie jar that applies expiry writes.
function bootstrap({ hostname = "www.lauraharrispm.com", search = "", cookie = "", navigator = {} } = {}) {
  const source = fs.readFileSync("src/app/layout.tsx", "utf8");
  const snippet = source.match(/__html: `([\s\S]*?)`,/)[1].replace("${GA_MEASUREMENT_ID}", "G-S49DLLQHFT");
  const writes = [];
  const document = {
    get cookie() { return cookie; },
    set cookie(value) {
      writes.push(value);
      cookie = value.includes("Max-Age=0;") ? "" : value.split(";")[0];
    },
  };
  const window = {};
  vm.runInNewContext(snippet, { window, document, navigator, location: { hostname, search }, URLSearchParams,
    get dataLayer() { return window.dataLayer; },
  });
  return { cookie, writes, commands: window.dataLayer.map((args) => Array.from(args)) };
}

test("automatic GA collection uses the same production hosts as custom events", () => {
  assert.equal(bootstrap().commands.filter((c) => c[0] === "config").length, 1);
  assert.equal(bootstrap({ hostname: "lauraharrispm.com" }).commands.length, 2);
  assert.equal(bootstrap({ hostname: "portfolio.vercel.app" }).commands.length, 0);
  assert.equal(bootstrap({ hostname: "localhost" }).commands.length, 0);
});

test("owner mode sets and renews the cookie, public clears it, and privacy signals suppress GA", () => {
  const internal = bootstrap({ search: "?measurement=internal" });
  assert.equal(internal.cookie, "lh_internal=1");
  assert.equal(internal.commands.length, 0);
  assert.match(internal.writes[0], /Max-Age=2592000; Path=\/; SameSite=Lax; Secure/);
  assert.equal(bootstrap({ cookie: "lh_internal=1" }).writes.length, 1);
  const publicVisit = bootstrap({ cookie: "lh_internal=1", search: "?measurement=public" });
  assert.equal(publicVisit.cookie, "");
  assert.equal(publicVisit.commands.length, 2);
  assert.equal(bootstrap({ navigator: { doNotTrack: "1" } }).commands.length, 0);
  assert.equal(bootstrap({ navigator: { globalPrivacyControl: true } }).commands.length, 0);
});

test("delegated booking and contact links emit dedicated events, independently of legacy clicks", () => {
  const listeners = new Map();
  const events = [];
  let cleanup;
  const analytics = { trackEvent: (...args) => events.push(args), setProjectEntry() {}, flushEvents() {} };
  const Component = load("src/components/SiteAnalytics.tsx", {
    react: { useEffect: (fn) => { cleanup = fn(); } }, "@/lib/analytics": analytics,
  }, {
    document: { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener() {}, querySelector: () => null },
    window: { addEventListener() {}, removeEventListener() {} },
    IntersectionObserver: class { observe() {} disconnect() {} },
    setTimeout, clearTimeout,
  }).default;
  Component();
  for (const section of ["hero", "how", null]) {
    const link = {
      getAttribute: () => "#book",
      closest: (selector) => selector === "section" && section ? { id: section } : null,
    };
    // Handles a nested span or SVG as the event target, not only the anchor itself.
    listeners.get("click")({ target: { closest: () => link } });
  }
  assert.deepEqual(events.map(([name, params]) => [name, params.cta_location]), [
    ["booking_cta_click", "hero"], ["booking_cta_click", "how_i_work"], ["booking_cta_click", "nav"],
  ]);
  for (const href of ["mailto:laura@lauraharrispm.com", "https://www.linkedin.com/in/laurakayharris/"]) {
    listeners.get("click")({ target: { closest: () => ({
      getAttribute: () => href,
      closest: () => null,
    }) } });
  }
  assert.deepEqual(events.slice(3).map(([name, params]) => [name, params.contact_method]), [
    ["contact_click", "email"], ["contact_click", "linkedin"],
  ]);
  cleanup();
});

test("Cal callbacks deduplicate a booking UID and send only bounded booking status", () => {
  const callbacks = new Map();
  const events = [];
  const effects = [];
  const jsx = (type, props) => ({ type, props });
  const ns = (command, options) => { if (command === "on") callbacks.set(options.action, options.callback); };
  const Cal = () => {};
  Cal.ns = { "30min": ns };
  const Component = load("src/components/LetsChat.tsx", {
    react: { useState: () => [true, () => {}], useRef: (initial) => ({ current: initial ?? {} }), useEffect: (fn) => effects.push(fn) },
    "react/jsx-runtime": { jsx, jsxs: jsx }, "./LetsChat.module.css": { default: {} },
    "@/lib/analytics": { trackEvent: (...args) => events.push(args) },
  }, { window: { Cal } }).default;
  Component();
  const cleanups = effects.map((fn) => fn());
  const booked = callbacks.get("bookingSuccessfulV2");
  const payload = { detail: { data: { uid: "private-booking-a", status: "ACCEPTED", title: "Private title", videoCallUrl: "private-url" } } };
  booked(payload);
  booked(payload);
  booked({ detail: { data: { status: "accepted" } } });
  booked({ detail: { data: { uid: "private-booking-b", status: "unexpected" } } });
  booked({ detail: { data: { uid: "private-booking-c", status: "pending" } } });
  assert.equal(events.length, 3);
  assert.equal(events[0][0], "booking_created");
  assert.equal(events[0][1].booking_status, "accepted");
  assert.equal(events[1][1].booking_status, "unknown");
  assert.equal(events[2][1].booking_status, "pending");
  assert.deepEqual(Object.keys(events[0][1]), ["booking_status"]);
  assert.doesNotMatch(JSON.stringify(events), /private-/);
  cleanups.forEach((fn) => fn?.());
});
