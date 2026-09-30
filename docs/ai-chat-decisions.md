# AI chat: what's built, decisions made, and what's needed from you

Built on branch `ai-chat`, in the worktree at `.claude/worktrees/ai-chat`,
from the `site-v2-fractional` checkpoint commit (`99068c8`). Your v2 working
copy was never touched by any of this — everything below happened in a
separate directory on its own branch. Dev server ran on port 3011 (v2's is
3010) for the whole build.

Commits, in order:

```
ae74899 Chat backend: API route, config, content, and Anthropic/Upstash clients
3779177 AskChat component: empty state, conversation, chips, limits
53fea09 WorkSummary: listen for hashchange, not just popstate
6e7e75b Hero: add the "Or just ask my AI" entry link, behind chatEnabled
f078b00 page.tsx: insert #ask between Recent Work and Let's chat, behind the flag
878dd51 Add .env.example with Upstash/Anthropic/chat env var names
9fbd883 Add eval test list and runner script (not run against the real model yet)
5888bc1 Fix real bugs found in manual testing
```

(A couple of small follow-up commits landed after this list was written,
e.g. switching the rate-limit failure behavior from fail-open to
fail-closed below. Run `git log --oneline site-v2-fractional..HEAD` for
the current full list.)

No merges, no pushes, no deploys. `CHAT_ENABLED` defaults to `false` in
`.env.example`, so the feature stays invisible until you turn it on.

## What's built

Everything in the spec, working end to end against mock data:

- **Empty state**: circular headshot, "Ask me anything," one input with a
  rotating typed placeholder (stops the moment you focus the input,
  collapses to one static example under reduced motion). Submitting empty
  asks whatever example is showing.
- **Conversation state**: compact header with a Start over button,
  right-aligned blush bubbles for you, left-aligned plain text for
  answers, a typing indicator, a word-by-word reveal (skipped under
  reduced motion), and exactly 3 chips once the answer has finished
  revealing. `aria-live="polite"` on the messages region; verified the
  live region actually contains the question + answer text via the
  browser's own accessibility tree, not just visually.
- **Chip logic** (`src/lib/chat/followups.ts`): go deeper / go sideways /
  deterministic action chip, in that order, with near-duplicate detection,
  topic validation, 60-character enforcement, and curated fallbacks. All
  four action-chip rules verified live: pricing questions correctly force
  `intent: "ready"` and a "Book a call" chip even when a case study was
  also discussed; a case-study answer produces "Read the [title] story"
  and actually opens the reading view; asking 3+ questions with no other
  trigger falls back to "Book a call."
- **Limits**: 500 char/message, 12 messages/conversation, 10-message
  history sent to the model, 20/hour and 60/day per IP, all verified by
  direct request against the running route (not just read in the code) —
  see the "What I tested" section below for the actual numbers.
- **Kill switch**: verified that with `CHAT_ENABLED=false`, the hero link,
  the `#ask` section, and the API route (404) are all absent, not just
  hidden by CSS.
- **Mock mode** (`CHAT_MOCK=true`): in-memory rate limiting and logging,
  canned `respond` payloads keyed by keyword match. Everything above was
  built and tested against this, no Anthropic key or Upstash database
  needed.
- **Real mode**, written but not yet run against the live API: the
  Anthropic client with prompt caching and forced strict tool use, and the
  Upstash-backed rate limiter and logger. See "How to switch from mock to
  real" below.
- **Evals**: 45 test cases in `docs/chat-evals.md` (see the Amendment 7
  note near the bottom of this file for the renumbering) plus
  `scripts/run-evals.mjs`, a dependency-free Node script that exercises a
  running dev server. Smoke-tested the script itself against the mock
  server to confirm it runs end to end; **not** run against the real
  model, per your instruction to hold that until you're back.

## Decisions I made where the spec was ambiguous

**Wire format between the browser and the API route.** The spec says
conversation state "lives in the browser and is sent with each request"
but doesn't specify the shape. I went with:

```ts
{ messages: {role: "user"|"assistant", content: string}[], touchedTopics: string[] }
```

`touchedTopics` is a flat, deduped list of topic ids the client accumulates
from each response's `sources` field. The server needs this to pick a
genuinely untouched "go sideways" topic and to know which topics have
already come up, without asking the client to resend a fully structured
history of every prior turn's sources. If you'd rather the server derive
this itself some other way, it's isolated to `route.ts` and `AskChat.tsx`.

**`CHAT_ENABLED` stays server-only, never reaches the client.** `page.tsx`
(a server component) reads it once and passes a `chatEnabled` boolean prop
into `Hero` (a client component, for the entry link) and conditionally
renders `<AskChat />` itself. I considered a `NEXT_PUBLIC_` env var instead
but that would ship the flag's value into the client bundle for no reason;
the prop approach keeps it purely server-side.

**Rate limit failures fail closed.** If the Upstash call itself throws (bad
config, an outage), the route refuses to answer: it returns the same
friendly error state as a model failure (with the Book a call chip), not
an answer. Updated from an earlier fail-open version after Laura's
explicit call: since we can't confirm a visitor is under their limit when
the store is unreachable, the safer default is to not answer rather than
answer unlimited. Logged either way, so an outage is visible in the
server logs, not silent. I found the original crash the hard way: testing
the real (non-mock) code path with no Upstash env vars set crashed the
route with an unhandled 500 and an empty response body, before either
version of the try/catch existed; verified the current fail-closed
behavior live the same way (no Upstash config, confirmed a clean 502 with
the friendly message and a log line, and that the model is never called).

**Near-duplicate question detection** uses plain word-overlap similarity
(shared words / larger word count, threshold 0.7), not a real semantic
check. No new dependency for it, and it's good enough to stop the model
suggesting "What does a Growth Sprint include?" right after "What's a
Growth Sprint?" (tested this exact pair; after the Amendment 7 rename
below, eval #45 tests the same pair reworded as "What does a
project-based engagement include?" / "What's project-based work?").

**Redaction regex** is deliberately permissive for phone numbers (matches
most US-style formats) since over-redacting a false positive is harmless
for this use case, but it's not a general PII scrubber — email and phone
only, per the spec.

**Case study titles/slugs are duplicated in `src/content/chat/config.ts`**
rather than imported from `src/content/projects.ts`. This keeps the chat
package dependency-free from the v2 site content (which is still changing
under you), at the cost of needing a manual update in two places if a case
study's title or slug ever changes. Worth reconsidering once v2 settles.

**`useRevealedText`'s "done" callback fires from an effect that only
calls the callback, never setState**, and the reduced-motion / no-play
path returns `fullText` directly instead of mirroring it into state. This
isn't a product decision, just how I resolved three real
`react-hooks/set-state-in-effect` and `react-hooks/refs` lint errors this
newer lint rule flagged in my first draft — caught by running eslint, not
just typecheck, re-verified in the browser after the fix (see commit
`5888bc1`).

## Existing files touched (3 commits, minimal by design)

1. **`src/components/WorkSummary.tsx`** — added a `hashchange` listener
   alongside the existing `popstate` one. `pushState` (used by this
   component's own navigation) never fires either event; a plain
   `location.hash =` assignment (what the chat's case-study chip does)
   fires `hashchange` but wasn't being listened for at all before this.
2. **`src/components/Hero.tsx` + `Hero.module.css`** — added the "Or just
   ask my AI" link, gated behind a new `chatEnabled` prop (default
   `false`).
3. **`src/app/page.tsx`** — reads `CHAT_ENABLED` once, passes it to
   `Hero`, and conditionally renders `<AskChat />` between `WorkSummary`
   and `LetsChat`.

Everything else is new files: `src/app/api/chat/route.ts`,
`src/components/AskChat.tsx` + `.module.css`, `src/content/chat/*`,
`src/lib/chat/*`, `docs/chat-evals.md`, `scripts/run-evals.mjs`,
`.env.example`.

## What I tested (all against the running dev server, not just code review)

- Full conversation flow through the mock: empty state, typed placeholder,
  one-tap starter, multi-turn conversation, chip clicks, "Start over."
- The case-study chip actually opens the reading view (confirms the
  `hashchange` fix works end to end, not just in isolation).
- The pricing/"ready" intent chip correctly outranks the case-study and
  3-questions rules.
- Conversation limit: sent 13 messages in one request, got back the
  `"limited"` status on request 13 (12 is the max).
- Rate limit: sent 22 requests from one spoofed IP, got `"ok"` for the
  first 20 and `"limited"` for 21 and 22, confirming the atomic Lua-script
  counter enforces the limit at exactly the configured number.
- Message-length, empty-message, and no-message rejection (400s with the
  right message, no crash).
- Kill switch: with `CHAT_ENABLED=false`, confirmed via the accessibility
  tree that neither the hero link nor the `#ask` section render at all,
  and that `POST /api/chat` itself returns 404.
- Client bundle: ran `next build`, then grepped `.next/static` for
  fragments of the system prompt, the knowledge base (including the
  "ALWAYS anonymized" instruction), and the tool schema. None present.
  (They're not even in the server bundle — `fs.readFileSync` reads them
  fresh from disk at request time rather than inlining them at build
  time, which is stronger than "tree-shaken.")
- The real (non-mock) error path: temporarily set `CHAT_MOCK=false` with
  no `ANTHROPIC_API_KEY` set, confirmed the friendly error message comes
  back cleanly (this is also what surfaced the rate-limit crash bug above).
- Reduced motion: this session's blind spot here turned out to be real.
  Laura found a genuine bug on real macOS + Chrome that I'd missed:
  `usePrefersReducedMotion`'s lazy-`useState` version computed the right
  value on the client, but the page is statically prerendered (confirmed
  via `next build`: `/` is a static route), so nothing forced React to
  reconcile the client's true value against the build-time snapshot after
  hydration. Fixed by switching to `useSyncExternalStore`, the hook built
  specifically for "client-only value that can differ from what was
  prerendered." See commit `1fcb67e` for the full root-cause writeup.
  Confirmed via `curl` against a production build that the static HTML
  really does ship `placeholder=""`, and confirmed no regression in the
  normal typing animation and full conversation flow afterward. Still
  could not force a real OS-level reduced-motion setting inside this
  session's sandboxed browser to visually replay the fix itself (a
  `matchMedia` patch applied post-load doesn't retroactively affect a
  media query list the component already subscribed to) — **please
  re-check on your real setup**, the same way you found the original bug.
- What I did **not** do: run the Enter key (as opposed to clicking the
  send button) through the automation tool reliably triggered form
  submission — clicking the button did, every time, confirmed via
  intercepting `window.fetch`. I believe this is a quirk of how this
  session's browser automation synthesizes keyboard events reaching a
  native HTML form submit, not an application bug (there's no JS on the
  input that would treat Enter differently from clicking the adjacent
  submit button), but I didn't manage to isolate the cause. Worth
  confirming Enter-to-send in a real browser.

## Prompt caching: a real finding, not padded to hide it

Combined, `system-prompt.md` + `knowledge.md` are about 2,300 words /
14,900 characters, which is roughly 3,700 tokens by the usual ~4
chars/token estimate. **Claude Haiku 4.5's minimum cacheable prompt length
is 4,096 tokens** — so at the current length, prompt caching most likely
won't activate on Haiku at all, silently (no error, it just costs full
price every call). Sonnet 5's minimum is 1,024 tokens, comfortably below
what we have.

I did not pad the knowledge base to clear the threshold, per your
instruction. Two honest paths once you're filling in the `[NEEDED]`
sections: the additional real content may well push it over 4,096 tokens
on its own, or you may end up on Sonnet 5 anyway. Either way, the eval
script prints `cache_creation_input_tokens` / `cache_read_input_tokens`
from the real response so you can see the actual number once you run it
against the live API, rather than trusting my estimate.

## What's needed from you

1. **Review this file and the code**, whenever you're back.
2. **Create the Anthropic API key** in the Claude Console with a monthly
   spend limit, and add it to `.claude/worktrees/ai-chat/.env.local` as
   `ANTHROPIC_API_KEY`. (Never paste it in chat — you already knew that,
   just confirming I didn't ask.)
3. **Create an Upstash Redis database** (their free tier is fine to
   start) — either standalone at upstash.com, or via the Vercel
   Marketplace integration if this site is Vercel-hosted, which auto-
   writes the env vars. Either way, put `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` in `.env.local`.
4. **Fill in the `[NEEDED]` sections** of `src/content/chat/knowledge.md`
   (minimum engagement length, scheduling/cadence, NDAs, sprint-to-
   fractional conversion, industries, HIPAA comfort, tool stack,
   availability line, and the full "never say" list).
5. **Run the evals for real**: `npm run dev` in the worktree with
   `CHAT_MOCK` off and a real key set, then `node scripts/run-evals.mjs`.
   Read through the 45 answers, especially the anonymization-attack and
   prompt-injection ones (#28-35) and the `[NEEDED]`-topic ones (#16-23),
   before setting `CHAT_ENABLED=true` anywhere real.

## How to switch from mock to real

In `.env.local` (gitignored, never committed):

```
CHAT_MOCK=false
ANTHROPIC_API_KEY=sk-ant-...
CHAT_MODEL=claude-haiku-4-5-20251001   # or a Sonnet 5 snapshot
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

That's it — `src/lib/chat/store.ts` is the single switch point; nothing
else needs to change. `CHAT_ENABLED` is independent of `CHAT_MOCK`: you
can run real mode locally with the feature still hidden on the live site
by controlling `CHAT_ENABLED` separately in whatever env Vercel (or
wherever this deploys) actually uses.

## Still open, not started

- Running the real evals (waiting on your key + review, as instructed).
- Nothing else from the spec is outstanding — Phase 0 through the UI, the
  chip logic, limits, kill switch, and the eval scaffolding are all built
  and tested against mock data. The only things between here and turning
  it on for real are the two accounts above and your read of the
  `[NEEDED]` content and evals.

## Amendment 9: one source for availability, mock responses refreshed

Availability is now genuinely single-sourced: `getSystemPrompt` in
`anthropic-client.ts` appends `CHAT_AVAILABILITY` onto the assembled
prompt as a labeled line at request time, and `knowledge.md` no longer
states a specific availability value at all. Verified live (temporary
debug route, removed before committing): changing the constant's value
alone changed the assembled prompt's text, confirmed by reading it back
over `curl`. Refreshed `mock.ts` for the topics filled in last round
(minimum engagement, NDA/contracts, HIPAA, plus equity, design-and-code,
low-traffic testing, and several boundary-rule cases) so they return
real canned answers instead of "not published yet"; narrowed the
"don't know" fallback to genuinely unlisted specifics (win rate, tech
stack beyond the named tools, salary, visa). Ran the new evals (#46-62,
added to `scripts/run-evals.mjs` too) against the mock server and found
two real bugs before they shipped: eval #50 (equity) had no matching
case and fell through to the generic default answer, and eval #52
(design and code) was silently shadowed by a regex false match in the
NDA case ("de**sign an**d code" matched `sign (an|our)`). Both fixed;
all 17 pass now.

## Amendment 8: knowledge base filled in, new boundary rules added

Filled in every `[NEEDED]` placeholder in `knowledge.md` with real content
(engagement mechanics, getting up to speed, confidentiality, fit, tools
and working style, results and reporting, point of view, proudest work,
Laura's story, how the site/chat were built, and the availability line),
and synced the existing site-derived sections (case study titles and
order, the "Ongoing ownership"/"Defined outcome" pills, the three fit
bullets, the "What you get"/"How we start" table copy, and the
AI-native points) to the current v2 working copy, read but not edited.
Added `system-prompt.md` rules for unknown-answer routing, the "are you
real"/"pass a message" case, the "growth bet you got wrong" deflection,
and always saying "Fractional"/"Project-Based." Added `CHAT_AVAILABILITY`
to `config.ts` as the single place to update availability, and 17 new
evals (#46-62) to `docs/chat-evals.md` covering all of the above.

Two small scope notes:

- **`CASE_STUDY_TITLES` in `config.ts`** was stale (old titles like
  "Redesigning Payments Onboarding" instead of the current
  "Payments onboarding redesign"), which would have shown the wrong
  title in the "Read the [title] story" chip. Fixed it to match the v2
  site, since leaving a known-wrong title in the one file this task
  already touched would have undercut the sync work in knowledge.md.
  Also fixed the one eval (#43) that quoted the old title.
- **`knowledge.md` and `CHAT_AVAILABILITY` are two separate copies of
  the same sentence today**, not one source of truth read by the other:
  `anthropic-client.ts` reads `knowledge.md` verbatim from disk with no
  templating step, so there's no existing mechanism to inject a config
  constant into the model's context. `knowledge.md`'s availability line
  matches `CHAT_AVAILABILITY`'s value as of this commit and points back
  to it, but if you update one without the other, the model will see
  the stale one. A real single source of truth would mean adding a
  small interpolation step in `anthropic-client.ts`, which felt like a
  bigger, unrequested change to make in the same pass as content edits.
- **Not touched**: `src/lib/chat/mock.ts` still returns its canned
  "not published yet" answer for minimum-engagement/NDA/availability-
  calendar/industries-avoided/HIPAA questions (the regex at the bottom
  of that file). Now that those are real, filled-in sections of
  `knowledge.md`, that canned mock response is stale, but updating mock
  payloads wasn't part of this task's scope, so it's flagged here
  rather than changed.

## Amendment 7: Growth Sprint renamed to Project-Based

Matches the v2 site's rename (same commit set, in the working copy, not
this worktree): both engagement formats now follow the retainer-vs-project
paradigm founders already know. Fractional is a retainer with ongoing,
evolving scope; Project-Based is a defined project with fixed scope and
deliverables that can still go all the way to shipped work. The
difference is how the work is structured, not how far it goes.

Renamed everywhere in this worktree:
- `Topic` union (`src/lib/chat/types.ts`): `growth_sprint` → `project_based`.
- `TOPICS`, `CURATED_FALLBACKS`, starter question (`src/content/chat/config.ts`):
  topic key renamed, fallback questions reworded to "What does a
  project-based engagement include?" / "Fractional or project-based: which
  fits us?" / "Can a project turn into ongoing work?"; the Growth Sprint
  starter question and the pricing fallback's "What does a Growth Sprint
  cost?" were reworded to match.
- Mock responses (`src/lib/chat/mock.ts`): the dedicated Growth Sprint case
  (matched on `/growth sprint/i`) is now matched on `/project.?based/i` and
  rewritten to describe Project-Based; every other canned payload's
  followup questions and topic tags that referenced Growth Sprint now
  reference project-based work instead.
- Knowledge base (`src/content/chat/knowledge.md`): the "Two ways to work
  together" section was replaced with the exact copy from the amendment,
  including the new "why ongoing instead of a series of projects" and
  "everything is documented" lines. The `[NEEDED]` line directly below it
  was left untouched per the amendment's explicit instruction, so it still
  reads "Growth Sprint" and "sprint": that's intentional, not a miss.
- Evals (`docs/chat-evals.md`, `scripts/run-evals.mjs`): renumbered 1-45
  (was 1-43) to insert two new cases right after the project-based
  description question: "What's the difference between fractional and
  project-based?" and "Does project-based work include building things,
  or just a plan?" Every other Growth Sprint wording in the existing
  cases was reworded to project-based; all cross-references elsewhere in
  this file to eval numbers were updated to match the new numbering.

Verified in mock mode: asking "What is project-based work?" returns
`sources: ["project_based"]` and an answer using the new name; asking a
fractional question returns a followup chip reading "What does a
project-based engagement include?" instead of the old Growth Sprint
wording.

Not touched in this worktree: `src/components/HowIWork.tsx` still says
"Growth Sprint" here, because that file is a snapshot from before this
worktree branched and isn't part of the chat feature: the real rename
for that component lives in the v2 working copy, not this worktree, per
the amendment's scope (Part 1 vs. Part 2).
