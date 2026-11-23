# Analytics audit: November 13–19, 2026

Reviewed November 23, 2026 against production JavaScript, current `origin/main` (`9fd6089`), signed-in GA4, the production Upstash console, and Cal's booking list. GA property `534835097` uses Los Angeles time, verified in Property details. Redis comparisons use **November 13 08:00 UTC through November 20 08:00 UTC**, covering the corresponding eight UTC date buckets. Daily outcome counters have UTC-day granularity, so the counter check deliberately includes both boundary days in full.

**The low chat and case-study numbers have supporting server evidence. The six legacy CTA clicks were navigation, not booking intent.** Two booking creations agree across GA and the event store. Direct traffic is an attribution limitation, not proof that 34 visitors typed the address. Owner contamination cannot be estimated reliably from these records.

Production settings, Redis records, and appointments were unchanged. No production chat or booking was submitted. Redis queries used `HLEN`, `HGETALL`, `GET`, and `LRANGE` inside enforced read-only `EVAL_RO`; they returned counts and bounded metadata, never question text. No credentials or raw exports are committed. The GA booking aggregate CSV is retained outside the repository with owner-only permissions.

## 1. Chat usage

**Status: working in the checked paths; no recorded use during this week.**

**Evidence:** GA's complete 12-event list contains no chat events. The two rows beyond the top ten are `click` and `contact_click`, one each. The question archive contains zero rows in the reporting interval; the legacy log also contains zero matching questions. The measurement archive contains no chat browser events or server completion rows. All nine supported outcome-counter keys are absent across the eight covering UTC days, including error and logging-failure counters. Earlier archive activity exists: November 10 has three archived questions, establishing that this is not simply an empty archive across all dates.

Only **four users** recorded chat-heading exposure, compared with 33 measured site users. This is limited reach, not a meaningful zero-conversion experiment. The deployed bundle includes start, submission, response, displayed-response, action, error, and clear tracking. A local mock preview successfully exercised starter submission, a suggested follow-up, free text, and Clear; the existing reliability tests also pass.

**Fix:** no chat rewrite justified. The evidence supports no observed requests, rather than a GA-only loss of chat events. Attempts blocked before reaching the application cannot be ruled out by absent telemetry.

## 2. Booking CTA versus legacy CTA

**Status: working; the apparent contradiction is resolved.**

**Evidence:** GA's six `cta_click` events are `services` (2), `work` (2), `ask_my_ai` (1), and `references` (1). Locations are desktop navigation (3) and mobile navigation (3). None has the booking label. The event store has eight legacy clicks, demonstrating that GA and first-party delivery do not have identical coverage; it also has zero `booking_cta_click` rows.

The desktop and mobile navigation, hero, How I work, and chat helper link all use `#book` anchors and receive `booking_cta_click` through the document capture listener. AI book-call chips are buttons and emit that event explicitly in their own handler. Legacy anchor handlers additionally emit `cta_click` for historical continuity. The delegated-listener regression test verifies dedicated events from hero, How I work, and navigation, including clicks on nested content. Email and LinkedIn contact tracking is covered too.

Visitors can reach the inline booking widget by scrolling or loading a hash link, so a booking does not require a booking-CTA event. `booking_widget_ready` measures embed readiness, not booking attempts.

**Fix:** none required. Do not treat all legacy CTA clicks as lead intent or require CTA-click counts to exceed booking counts.

## 3. Case-study opens

**Status: working in reviewed code and exercised UI paths.**

**Evidence:** both GA and Upstash record two opens. The stored metadata shows a Services example opening the therapist directory, followed by reading-view navigation to the phone-agent scheduling study. GA reports one user; the two stored rows alone do not independently establish a person count.

`WorkSummary` synchronizes the initial hash, `hashchange`, and `popstate`, and tracks changes in the open project once per transition. Card opens and reading-view navigation update the same state. AI case-study actions preserve their entry source. In the local mock preview, card open, next study, back/forward, Services hash link, and initial deep-link reload all opened the appropriate reading view. Local previews intentionally suppress production telemetry, so these UI exercises are supported by source inspection rather than live GA submissions.

**Fix:** none required. Two opens is a credible count of observed activity, not evidence of widespread case-study evaluation.

## 4. Direct attribution and campaign tags

**Status: working for the inspected URL path; end-to-end receipt of a new tagged test remains unverified.**

**Evidence:** Traffic acquisition confirms 35 sessions: 34 `(direct) / (none)` and one `linkedin.com / referral`. A public HTTP request to the bare domain returned a 308 to `www` with all four UTM parameters intact, then a 200. The campaign-link script generates a tagged canonical URL. No application redirect strips its query. Fragment-only case-study history updates preserve the current query. GA configuration does not override campaign/source/medium or `page_location`.

The custom `traffic_source` parameter describes the current document referrer; it does not parse campaign tags and is not GA's session attribution. One booking has a LinkedIn referrer even though GA attributes both booking sessions to Direct. Those are different measurements and must not be substituted for each other.

A new tagged production visit was blocked by automatic approval review because it would add data despite the briefing's read-only constraint. It was not executed. The proposed tag is `utm_campaign=analytics_audit_20261123`, `utm_content=tagged_link_check` and requires an explicit exception before use.

**Fix:** use consistently tagged links for posts, profile, Slack, and outreach. No evidence supports changing the domain redirect. Confirm actual campaign receipt with an approved labeled diagnostic visit before describing that part as verified.

## 5. Owner exclusion and November 18

**Status: owner-cookie behavior works in regression checks; historical owner share is unclear. One related collection defect is fixed on this branch.**

**Evidence:** executing the actual head bootstrap against a cookie jar verifies `?measurement=internal` sets a secure 30-day cookie and queues no GA configuration; existing owner mode renews it; `?measurement=public` expires it and resumes configuration. Do Not Track and Global Privacy Control suppress configuration. Custom browser events use the same owner/privacy checks.

November 18 has 34 received custom-event rows in the aligned reporting day. This is not 34 users. Browser rows have neither an owner identity nor a general page/session ID. Excluded visits leave no browser events, and an owner's visits without the cookie cannot reliably be distinguished from other visitors. No defensible owner percentage can be calculated.

The production head bootstrap previously checked deployment environment but not hostname. A production Vercel alias could therefore send automatic GA page views while custom events correctly rejected that hostname. The new test reproduces that mismatch against the original code. `layout.tsx` now applies the production-host allowlist before configuring GA. This prevents future alias contamination; it does not prove alias traffic caused the November 18 peak.

**Fix:** merge the hostname guard when ready. On each browser/device used to review the live site, visit `https://www.lauraharrispm.com/?measurement=internal`. The cookie is browser-specific; using another browser or clearing cookies requires setting it again. Do not use the public reset link during ordinary owner review.

## 6. Booking count, deduplication, and privacy

**Status: count and in-page deduplication work; historical status detail is incomplete. Status normalization is improved on this branch.**

**Evidence:** GA's booking aggregate export places both events on November 17. Upstash independently contains two creation rows that day, one with a LinkedIn referrer and one with a Direct referrer. Cal shows confirmed appointments on November 23 and November 24 matching the dates supplied in the briefing. The browser archive deliberately excludes booking UIDs and appointment details, so there is no deterministic identity join from those anonymous rows to specific calendar appointments; matching counts and dates are corroboration, not such a join.

The callback listens for the namespaced `bookingSuccessfulV2` event, ignores missing UIDs, and deduplicates repeated UIDs in page memory. Regression checks replay a callback twice, omit a UID, and use another UID; they verify one event per distinct valid UID and that only bounded status leaves the callback. Reload/remount is the boundary of this deduplication, as documented. No raw booking payload or UID is passed into `trackEvent`.

Both historical rows store status `unknown`. The current allowlist only recognizes lowercase values. The branch normalizes string status to lowercase before applying that allowlist, with tests for uppercase `ACCEPTED`, lowercase `pending`, and an unsupported value. This handles casing differences without claiming to recover the original missing detail or prove that casing caused those two historical unknowns. Cal's documentation also cautions that creation need not mean confirmation.

**Fix:** merge status normalization when ready. Trust the two measured creations; use Cal for confirmed state and the private lead tracker for qualification. No fake appointment was made.

## 7. GA custom definitions

**Status: working.**

**Evidence:** all 14 definitions are event-scoped and were last changed October 22: `action_kind`, `target_id`, `booking_status`, `intent`, `source_id`, `contact_method`, `cta_label`, `cta_location`, `error_type`, `input_source`, `traffic_source`, `project_id`, `section_id`, and `starter_id`. There are no custom dimensions for event, request, or conversation IDs. Existing report breakdowns show CTA labels/locations, sections, and referrer categories.

**Fix:** none required. Keep unique IDs in restricted/raw records for joins rather than registering them as custom dimensions.

## Validation

- `node --test tests/measurement.test.mjs tests/measurement-ui.test.mjs`: seven passing tests, including four new behavioral regression checks. The hostname check was observed failing before its fix.
- Existing chat reliability suite: three passing tests.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with five pre-existing warnings in the rendering script and `StoryView.tsx`; no errors.
- `npm run build`: passed after granting network access for the existing Google Fonts dependency. The initial sandbox attempts were blocked by a temporary dependency symlink and font-network restrictions; neither required an application change.
- Local mock UI: starter, suggested follow-up, free text, Clear; card/hash/deep-link/history/reading-view paths; Cal widget loaded and displayed available times. No booking submitted.

## What to trust and what to discount

Trust the week as **33 measured users and 35 measured sessions**, subject to ordinary browser coverage and possible unexcluded owner activity. Trust two observed booking creations and two observed study opens, corroborated by the first-party event store. The absence of recorded chat usage has independent server support, but only four people recorded chat-heading exposure.

Discount the interpretation of six navigation clicks as leads, 16 widget-ready events as booking attempts, Direct as intentional typed traffic, or two creations as two qualified leads. GA records fewer custom events than Upstash (for example, 64 versus 74 section exposures); the systems have different delivery failure modes and should not be assumed to count every interaction identically. Historical `unknown` booking status remains unknown. Owner share cannot be reconstructed reliably.

Laura's remaining actions: review and merge the PR if desired; set owner mode on each device/browser; keep campaign tags consistent; record actual lead qualification privately. A labeled production campaign-receipt check requires the explicit exception described in section 4.

## References

- [Cal embed events and bookingSuccessfulV2](https://cal.com/help/embedding/embed-events)
- [Upstash read-only Lua execution](https://upstash.com/docs/redis/sdks/py/commands/scripts/eval_ro)
- Project measurement contract: `docs/measurement.md`
