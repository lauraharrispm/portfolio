#!/usr/bin/env node
// Read-only report for the bounded question log and 90-day outcome counters.
// It never writes to Redis; --input accepts a local JSON fixture for rehearsal.
//
//   npm run chat:log
//   node scripts/analyze-chat-log.mjs --env .env.local
//   node scripts/analyze-chat-log.mjs --input /tmp/chat-log-fixture.json

import fs from "node:fs";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
};
const inputPath = valueAfter("--input");
const envPath = valueAfter("--env");

if (envPath) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const OUTCOMES = [
  "ok",
  "blocked_conversation_cap",
  "blocked_rate_hour",
  "blocked_rate_day",
  "error_validation",
  "error_model",
  "rejected_payload",
];

let rawRows;
let counterValues = {};
if (inputPath) {
  const fixture = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  rawRows = Array.isArray(fixture) ? fixture : fixture.rows ?? [];
  counterValues = Array.isArray(fixture) ? {} : fixture.counters ?? {};
} else {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) {
    console.error("Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.");
    process.exit(1);
  }

  const headers = { Authorization: `Bearer ${token}` };
  const logResponse = await fetch(`${baseUrl}/lrange/chat:log/0/-1`, { headers });
  if (!logResponse.ok) {
    console.error(`Upstash returned ${logResponse.status} reading chat:log: ${await logResponse.text()}`);
    process.exit(1);
  }
  const encodedRows = (await logResponse.json()).result ?? [];
  rawRows = encodedRows.map((entry) => {
    try { return JSON.parse(entry); } catch { return null; }
  }).filter(Boolean);

  const dateKeys = [];
  for (let offset = 89; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - offset);
    dateKeys.push(date.toISOString().slice(0, 10));
  }
  const counterKeys = dateKeys.flatMap((date) => OUTCOMES.map((outcome) => `chat:stat:${date}:${outcome}`));
  const pipelineResponse = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify(counterKeys.map((key) => ["GET", key])),
  });
  if (!pipelineResponse.ok) {
    console.error(`Upstash returned ${pipelineResponse.status} reading chat:stat counters: ${await pipelineResponse.text()}`);
    process.exit(1);
  }
  const pipeline = await pipelineResponse.json();
  pipeline.forEach((item, index) => {
    if (item.error) throw new Error(`Upstash failed reading ${counterKeys[index]}: ${item.error}`);
    counterValues[counterKeys[index]] = Number(item.result ?? 0);
  });
  rawRows.reverse();
}

const rows = rawRows.filter((row) => row && typeof row === "object");
rows.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
const validTimestamps = rows.map((row) => new Date(row.timestamp)).filter((date) => Number.isFinite(date.getTime()));
const first = validTimestamps[0];
const last = validTimestamps.at(-1);
const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(1)}%` : "0.0%");
const tally = (items) => {
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};
const datesWithCounters = Object.keys(counterValues).flatMap((key) => {
  const match = key.match(/^chat:stat:(\d{4}-\d{2}-\d{2}):/);
  return match ? [match[1]] : [];
});
const datesWithRows = rows.flatMap((row) => typeof row.timestamp === "string" ? [row.timestamp.slice(0, 10)] : []);
const reportDates = [...new Set([...datesWithCounters, ...datesWithRows])].sort();
const counter = (date, outcome) => Number(counterValues[`chat:stat:${date}:${outcome}`] ?? 0);

console.log("=".repeat(68));
console.log(`CHAT QUESTION LOG | ${rows.length} retained question(s)`);
if (first && last) console.log(`${first.toISOString()} to ${last.toISOString()}`);
console.log(`Storage cap: 2000 | ${rows.length >= 2000 ? "at cap" : `${2000 - rows.length} slots free`}`);
console.log("=".repeat(68));

const byDay = tally(rows.flatMap((row) => typeof row.timestamp === "string" ? [row.timestamp.slice(0, 10)] : []))
  .sort((a, b) => a[0].localeCompare(b[0]));
console.log("\nQUESTIONS BY DAY");
for (const [date, count] of byDay) console.log(`  ${date}  ${count}`);

const byHour = tally(rows.flatMap((row) => {
  if (typeof row.timestamp !== "string") return [];
  const hour = Number(row.timestamp.slice(11, 13));
  return Number.isInteger(hour) ? [hour] : [];
}));
console.log("\nBUSIEST HOURS | UTC");
for (const [hour, count] of byHour.slice(0, 6)) {
  console.log(`  ${String(hour).padStart(2, "0")}:00  ${count}`);
}

console.log("\nOUTCOMES BY DAY | block/error rates use all terminal outcomes as denominator");
for (const date of reportDates) {
  const total = OUTCOMES.reduce((sum, outcome) => sum + counter(date, outcome), 0);
  if (!total) continue;
  const values = OUTCOMES.map((outcome) => `${outcome}=${counter(date, outcome)}`).join("  ");
  const blocked = counter(date, "blocked_conversation_cap") + counter(date, "blocked_rate_hour") + counter(date, "blocked_rate_day");
  const errors = counter(date, "error_validation") + counter(date, "error_model");
  console.log(`  ${date}  ${values}`);
  console.log(`    block rate ${pct(blocked, total)} | error rate ${pct(errors, total)} | total ${total}`);
}

console.log("\nINTENT");
for (const [intent, count] of tally(rows.map((row) => row.intent ?? "unknown"))) {
  console.log(`  ${intent.padEnd(12)} ${count} (${pct(count, rows.length)})`);
}
const readyCount = rows.filter((row) => row.intent === "ready").length;
console.log(`  ready intent: ${pct(readyCount, rows.length)} of retained questions`);

console.log("\nTOPICS CITED | topics stores the model's cited sources");
for (const [topic, count] of tally(rows.flatMap((row) => Array.isArray(row.topics) ? row.topics : []))) {
  console.log(`  ${topic.padEnd(30)} ${count}`);
}
const topicIntent = new Map();
for (const row of rows) {
  for (const topic of Array.isArray(row.topics) ? row.topics : []) {
    const entry = topicIntent.get(topic) ?? { total: 0, ready: 0 };
    entry.total += 1;
    if (row.intent === "ready") entry.ready += 1;
    topicIntent.set(topic, entry);
  }
}
console.log("\nTOPICS AND READY INTENT | topics with at least three cited turns");
for (const [topic, entry] of [...topicIntent.entries()]
  .filter(([, entry]) => entry.total >= 3)
  .sort((a, b) => b[1].ready / b[1].total - a[1].ready / a[1].total)
  .slice(0, 10)) {
  console.log(`  ${topic.padEnd(30)} ${pct(entry.ready, entry.total)} (${entry.ready}/${entry.total})`);
}

const modernRows = [];
const legacyRows = [];
for (const row of rows) {
  if (Number.isInteger(row.turn) && row.turn > 0 && typeof row.conversationId === "string" && row.conversationId) {
    modernRows.push(row);
  } else {
    legacyRows.push(row);
  }
}
const conversations = new Map();
for (const row of modernRows) {
  const group = conversations.get(row.conversationId) ?? [];
  group.push(row);
  conversations.set(row.conversationId, group);
}
const groups = [...conversations.values()].map((group) => group.sort((a, b) => a.turn - b.turn));
const distribution = tally(groups.map((group) => group.length)).sort((a, b) => a[0] - b[0]);
const escalations = groups.filter((group) => {
  let sawBrowsing = false;
  for (const row of group) {
    if (row.intent === "browsing") sawBrowsing = true;
    if (sawBrowsing && row.intent === "ready") return true;
  }
  return false;
});

console.log("\nCONVERSATIONS");
console.log(`  ${groups.length} identifiable conversations | ${modernRows.length} questions | ${legacyRows.length} legacy row(s) without both turn and conversationId`);
console.log("  questions per conversation");
for (const [count, frequency] of distribution) console.log(`    ${count} question(s): ${frequency} conversation(s)`);
console.log(`  browsing to ready escalation: ${escalations.length} conversation(s)`);
for (const group of groups) {
  const lastRow = group.at(-1);
  const escalated = escalations.includes(group) ? ", browsing-to-ready" : "";
  console.log(`  ${group[0].conversationId} | ${group.length} question(s) | ended: ${lastRow.question ?? "(missing question)"} (${lastRow.intent ?? "unknown"})${escalated}`);
}
if (legacyRows.length) console.log(`  Legacy rows are retained as individual legacy questions and excluded from conversation counts.`);

const repeatTally = tally(rows.map((row) => (row.question ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim()))
  .filter(([question, count]) => question && count > 1);
const stopWords = new Set("the a an and or but of to in on for with is are was were do does did you your yours how what when where why who which can could would should i me my we our us they them it its this that these those at by from as be been being have has had will if then than so not no yes about into over under more most much many any all some im ive dont cant".split(" "));
const questionWords = rows.flatMap((row) => (row.question ?? "").toLowerCase().match(/[a-z']{3,}/g) ?? [])
  .filter((word) => !stopWords.has(word));
console.log("\nMOST COMMON QUESTION WORDS");
for (const [word, count] of tally(questionWords).slice(0, 20)) console.log(`  ${word.padEnd(20)} ${count}`);
const redactedCount = rows.filter((row) => (row.question ?? "").includes("[redacted]")).length;
if (redactedCount) console.log(`  redacted email/phone markers: ${redactedCount}`);
if (repeatTally.length) {
  console.log("\nREPEATED QUESTIONS");
  for (const [question, count] of repeatTally.slice(0, 15)) console.log(`  ${count}x ${question.slice(0, 100)}`);
}

console.log("\nALL QUESTIONS | chronological");
for (const row of rows) {
  const time = typeof row.timestamp === "string" ? row.timestamp.slice(0, 16).replace("T", " ") : "unknown time";
  const legacy = !Number.isInteger(row.turn) || !row.conversationId ? " legacy" : ` turn ${row.turn}`;
  console.log(`  [${time}] (${row.intent ?? "unknown"}${legacy}) ${row.question ?? "(missing question)"}`);
  if (Array.isArray(row.topics) && row.topics.length) console.log(`    sources: ${row.topics.join(", ")}`);
}
