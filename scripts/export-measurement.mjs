#!/usr/bin/env node
// Restricted local export. Credentials come from your environment, never arguments.
import fs from "node:fs";
import { Redis } from "@upstash/redis";
const arg = (k) => process.argv[process.argv.indexOf(k) + 1];
const from = arg("--from"),
  to = arg("--to"),
  output = arg("--output");
if (
  !process.argv.includes("--from") ||
  !/^\d{4}-\d{2}-\d{2}$/.test(from ?? "") ||
  !process.argv.includes("--to") ||
  !/^\d{4}-\d{2}-\d{2}$/.test(to ?? "") ||
  !process.argv.includes("--output")
)
  throw Error(
    "Use --from YYYY-MM-DD --to YYYY-MM-DD --output /private/path.jsonl [--include-questions]",
  );
const redis = Redis.fromEnv();
const rows = [];
const start = new Date(`${from}T00:00:00Z`),
  end = new Date(`${to}T00:00:00Z`);
if (start > end || (end - start) / 86400000 > 426)
  throw Error("Use a valid date range of up to 426 days");
for (
  let date = new Date(start);
  date <= end;
  date.setUTCDate(date.getUTCDate() + 1)
) {
  const day = date.toISOString().slice(0, 10);
  for (const [kind, key] of [
    ["event", `measurement:events:${day}`],
    ...(process.argv.includes("--include-questions")
      ? [["question", `chat:questions:${day}`]]
      : []),
  ]) {
    const page = await redis.hgetall(key);
    for (const value of Object.values(page ?? {}))
      rows.push({
        record_type: kind,
        ...(typeof value === "string" ? JSON.parse(value) : value),
      });
  }
}
fs.writeFileSync(
  output,
  rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
  { mode: 0o600, flag: "wx" },
);
console.log(
  `Exported ${rows.length} records to the requested local file. Question text included: ${process.argv.includes("--include-questions")}.`,
);
