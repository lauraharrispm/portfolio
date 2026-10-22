# Site measurement

Primary business goal: qualified fractional/project leads. `booking_created` is a site key event; qualification is recorded after the prospect conversation using fit, growth opportunity, engineering capacity, timing, and engagement scope. Model intent is not qualification.

## Collection

GA4 property 534835097, web stream 14598295744, measurement ID G-S49DLLQHFT. Production hostname only. Preview builds use mock chat storage/model responses, and never send production GA events. Browser behavioral collection respects Do Not Track and Global Privacy Control. Operational server outcomes and explicitly submitted questions are separate from browser analytics.

Owner browser exclusion: visit `https://www.lauraharrispm.com/?measurement=internal` to set a 30-day first-party owner-mode cookie. That browser stops sending GA/browser behavioral events; submitted questions retain an isInternal marker in the restricted research log. `?measurement=public` clears owner mode. This prevents collection at the source and avoids activating an unvalidated IP filter.

The head GA bootstrap queues early events. Automatic page/history views remain controlled by GA enhanced measurement; custom events do not manually add page views. Section exposure means half of the section heading visible for one second. This works for sections taller than the viewport.

Events: section_view, cta_click (legacy), booking_cta_click, contact_click, project_open; chat_start, chat_message_sent, chat_response_received, chat_response_displayed, chat_source_cited, chat_action_shown, chat_action_click, chat_clear, chat_limit_reached, chat_error; booking_widget_ready, booking_widget_error, booking_created. Server-only chat_request_completed records actual processing outcomes.

A visible response is not evidence that it was read. Input sources distinguish free_text, starter_example, go_deeper, and go_sideways. Cited sources are model citations, not an independent classifier of visitor questions. Action impressions require at least half the suggestion group visible. Each answer's action IDs contain turn, position, and kind, and can be joined using conversation/request IDs.

Case studies are measured once per open transition through cards, hash links, initial deep links, browser navigation, and reading-view navigation. Chat links keep their AI entry source. Bookings use Cal's bookingSuccessfulV2 and deduplicate provider UIDs in page memory, without transmitting those UIDs or appointment details to GA. A booking may be pending; booking_status is retained and qualification happens outside GA.

## Storage and access

The /api/analytics collector accepts only the event/parameter contract in src/lib/measurement/contract.ts, checks origin, caps request size and batch size, and rate limits writes. It never accepts question, answer, full URL, or booking payload fields. Browser sends are best effort, with page-exit flushing. The server records processing outcomes independently.

- `measurement:events:YYYY-MM-DD`: daily hashes keyed by UUID event ID, retained 426 days (about 14 months), retry-safe HSETNX, with producer/schema/environment/site version. No count-based eviction.
- `chat:questions:YYYY-MM-DD`: restricted question hashes keyed by request UUID, retained 90 days. Redacted question text, turn, conversation/request IDs, input source, starter, latency, model, and prompt/knowledge version. Redaction covers emails and common US phone numbers, not all sensitive text. Access remains restricted to the existing authenticated Upstash project.
- `chat:legacy-snapshot:YYYY-MM-DD`: one-time migration snapshot of the old 2,000-row log, retained 90 days. The marker `chat:question-archive-v2` prevents repeating the migration.
- `chat:log`: legacy compatibility buffer (latest 2,000), retained for existing tools. Use daily archives for complete new question history.
- `chat:stat:YYYY-MM-DD:<outcome>`: existing 90-day aggregate counters, including store and logging failures. Logging failures are diagnostic and excluded from request-outcome denominators.

Do not register event/request/conversation IDs as GA custom dimensions. Use them in raw exports for joins. Browser rows are received events, not an audit log of all real visitors: blockers, offline navigation, and privacy settings can prevent collection.

Use `node scripts/export-measurement.mjs --from YYYY-MM-DD --to YYYY-MM-DD --output /private/path.jsonl` with existing Upstash credentials supplied through the environment. `--include-questions` explicitly includes restricted text. New files use owner-only permissions and existing exports are not overwritten. Never commit exports or credentials. `npm run chat:log` now reads the 90-day archive as well as the legacy buffer.

GA event retention should be 14 months. Set a daily BigQuery export when an authorized Google Cloud project is available; do not use streaming unless needed. BigQuery does not replace the restricted question log, and raw question/answer text must stay out of GA.

## Campaigns and lead review

Use `node scripts/campaign-link.mjs linkedin social portfolio_launch launch_post` for tagged launch links; use different content values for profile and outreach. Do not use recipient names/emails in tags. Compare source/device and report counts, not causal claims, at current volume.

Keep qualification in the private lead tracker: booking date, source/campaign, fractional vs project interest, consumer-facing business/PMF, engineering capacity, growth opportunity, timing, qualified yes/no/unknown, reason, next step. Include anonymous conversation ID only when a known connection is available; never infer an identity from anonymous logs.

## Checks and cutover

Run `node --test tests/measurement.test.mjs`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Verify chat starter/free-text/follow-up/action/reset paths in a mock preview; verify deep links and Cal embed readiness. Use test mode for booking verification, never a fake production appointment.

After deployment verify head snippet, canonical, robots, sitemap; Search Console ownership and live URL inspection; a clearly labeled synthetic chat and the Vercel `chat: question persisted` log after the awaited Redis write. Confirm GA events/parameters through Realtime and processed reports, allowing 24–48 hours for custom definitions. Record the release date before comparing periods.
