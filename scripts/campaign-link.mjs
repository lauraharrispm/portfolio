#!/usr/bin/env node
const [source, medium, campaign, content] = process.argv.slice(2);
if (
  ![source, medium, campaign, content].every((v) =>
    /^[a-z0-9_-]{1,60}$/.test(v ?? ""),
  )
)
  throw Error(
    "Provide source medium campaign content as short nonpersonal lowercase identifiers",
  );
const url = new URL("https://www.lauraharrispm.com/");
for (const [key, value] of Object.entries({
  utm_source: source,
  utm_medium: medium,
  utm_campaign: campaign,
  utm_content: content,
}))
  url.searchParams.set(key, value);
console.log(url.href);
