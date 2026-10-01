import type { RespondPayload } from "./types";

/**
 * Canned `respond` payloads for CHAT_MOCK=true, so the full UI, chip
 * logic, and limit states can be built and tested without an Anthropic
 * key. Picked by loose keyword matching against the visitor's latest
 * message; falls back to a generic on-topic answer otherwise. Shaped
 * exactly like what the real model returns, including deliberately
 * varied `sources` and `intent`, so followups.ts gets exercised the same
 * way it would against the real API.
 */

interface MockCase {
  test: RegExp;
  payload: RespondPayload;
}

const CASES: MockCase[] = [
  {
    test: /price|pricing|cost|rate|how much/i,
    payload: {
      answer:
        "Pricing depends on scope, so Laura shares specifics on a call rather than publishing a rate card. Fractional and project-based work are priced differently based on time and depth. The fastest way to get a real number is a 30 minute intro call.",
      followups: [
        { question: "What's included in a project-based engagement?", topic: "project_based" },
        { question: "How long do engagements usually run?", topic: "fractional" },
      ],
      sources: ["pricing"],
      intent: "ready",
    },
  },
  {
    test: /onboarding/i,
    payload: {
      answer:
        "At GlossGenius, a broken onboarding flow was limiting payments adoption. Laura ran an iterative experimentation program that made the value clear before asking for effort, and added friction that built confidence, like a progress bar and native identity verification. **Onboarding completion rose 80%**, with a seven-figure GPV impact.",
      followups: [
        { question: "What made established businesses convert better?", topic: "case_payments_onboarding" },
        { question: "How do you approach a new onboarding flow?", topic: "process" },
      ],
      sources: ["case_payments_onboarding"],
      intent: "evaluating",
    },
  },
  {
    test: /project.?based/i,
    payload: {
      answer:
        "Project-Based is a defined project with fixed scope and deliverables, usually under 2 months at 1 to 3 days a week. It takes one prioritized growth opportunity from diagnosis to launch, with the problem, deliverables, and timeline agreed up front. The difference from Fractional is how the work is structured, not how far it goes: it's best for one prioritized opportunity with fixed scope and cost, rather than several ongoing ones.",
      followups: [
        { question: "How is that different from fractional?", topic: "fractional" },
        { question: "Can a project turn into ongoing work?", topic: "project_based" },
      ],
      sources: ["project_based"],
      intent: "evaluating",
    },
  },
  {
    test: /shortest engagement|minimum engagement|how short/i,
    payload: {
      answer:
        "The shortest fractional engagement is about a month, but most run two months or more. At up to three days a week, onboarding plus real delivery needs several weeks to add up to meaningful impact, so three weeks is usually too short to make a real difference.",
      followups: [
        { question: "How many days a week do you work?", topic: "fractional" },
        { question: "What does a project-based engagement include?", topic: "project_based" },
      ],
      sources: ["fractional"],
      intent: "evaluating",
    },
  },
  {
    // No generic "sign (an|our)" alternative: it false-matched "de-SIGN AN-d
    // code" (eval #52). \bnda\b and "contract" already cover the real
    // phrasings without that trap.
    test: /\bnda\b|contract|1099/i,
    payload: {
      answer:
        "Yes to an NDA if you need one. Laura can provide her own consulting contract, or start from yours and edit as needed. She works as a 1099 consultant, Laura Harris Consulting LLC, for every engagement.",
      followups: [
        { question: "What happens after a project-based engagement ends?", topic: "project_based" },
        { question: "What does a typical week look like?", topic: "fractional" },
      ],
      sources: ["logistics"],
      intent: "ready",
    },
  },
  {
    test: /equity|deferred pay/i,
    payload: {
      answer:
        "No. Laura isn't taking equity compensation, given the short- and medium-term nature of these engagements.",
      followups: [
        { question: "How does pricing work?", topic: "pricing" },
        { question: "How long do engagements usually run?", topic: "fractional" },
      ],
      sources: ["fractional"],
      intent: "ready",
    },
  },
  {
    test: /hipaa|regulated|privacy bar/i,
    payload: {
      answer:
        "Very comfortable. Her recent full-time roles were in healthcare and in small business software that included payments processing, so she's used to HIPAA compliance and high privacy bars.",
      followups: [
        { question: "What industries does Laura avoid?", topic: "fit" },
        { question: "Are we a fit if we just raised a Series A?", topic: "fit" },
      ],
      sources: ["fit"],
      intent: "evaluating",
    },
  },
  {
    test: /do you (actually )?design|do you code|design and code/i,
    payload: {
      answer:
        "Yes, both, still rooted in product. At a Series A healthcare startup, Laura did the discovery, spec, and design exploration herself, reviewed the prototype with the team to align on tradeoffs, made one round of tweaks, and handed the engineer a working prototype built in her design tools using the company's design system, including some usable code.",
      followups: [
        { question: "What's in Laura's AI toolkit?", topic: "ai_approach" },
        { question: "How does she work with engineering?", topic: "process" },
      ],
      sources: ["ai_approach"],
      intent: "evaluating",
    },
  },
  {
    test: /a\/?b test|500 signups|low.?traffic/i,
    payload: {
      answer:
        "Not every question needs a test; run the math first: time to results, traffic taken from other tests, and whether the minimum detectable effect is realistic. Low volume doesn't automatically rule one out if engagement is high enough on early funnel metrics. For a new patient intake flow at a Series A healthcare startup, the numbers were feasible, but the team chose a pre/post analysis instead, since the new flow was intentionally different enough that a test wouldn't have taught much.",
      followups: [
        { question: "How does Laura decide what to build first?", topic: "process" },
        { question: "Have you worked on patient intake before?", topic: "case_patient_intake" },
      ],
      sources: ["process", "case_patient_intake"],
      intent: "evaluating",
    },
  },
  {
    test: /growth bet|got wrong|worst (call|decision)|biggest mistake/i,
    payload: {
      answer: "That's a great one to ask Laura directly on a call.",
      followups: [
        { question: "What's the biggest growth win you've shipped?", topic: "case_burrow_growth" },
        { question: "How does Laura decide what to build?", topic: "process" },
      ],
      sources: [],
      intent: "ready",
    },
  },
  {
    test: /last client|most recent client|recently work/i,
    payload: {
      answer:
        "Her most recent engagement was with a Series A healthcare startup. Client names stay confidential, especially the most recent one.",
      followups: [
        { question: "Have you worked on patient intake before?", topic: "case_patient_intake" },
        { question: "Are we a fit if we just raised a Series A?", topic: "fit" },
      ],
      sources: ["case_patient_intake"],
      intent: "browsing",
    },
  },
  {
    // "up to speed" on a new engagement, not "get up to" a career break:
    // this case must come before the career-break one below, since that
    // regex used to also match "get up to" and swallowed this question.
    test: /up to speed|ramp.?up|ramping up|get started quickly|how quickly.*(start|onboard)/i,
    payload: {
      answer:
        "By relying on people first. Laura asks the team what's documented, what's current, and what only lives in people's heads. For a project, those conversations focus on that project; for fractional work, she casts a wider net across active projects and priorities and works with founders to decide what to focus on first.",
      followups: [
        { question: "What happens in the first 30 days?", topic: "first_90_days" },
        { question: "What does a typical week look like?", topic: "fractional" },
      ],
      sources: ["first_90_days", "process"],
      intent: "evaluating",
    },
  },
  {
    test: /career break|sabbatical|time off/i,
    payload: {
      answer:
        "After seven years in high-growth startups, Laura took time to recharge, explore, and build. She spent her days training her puppy, traveling with her camera, and tinkering with AI.",
      followups: [
        { question: "What's Laura's background before fractional work?", topic: "background" },
        { question: "Where has she worked full-time?", topic: "background" },
      ],
      sources: ["background"],
      intent: "browsing",
    },
  },
  {
    test: /are you (a )?real person|pass.*message|tell laura/i,
    payload: {
      answer:
        "I'm an AI assistant built for Laura's site, not Laura herself, so I can't pass along a message. The fastest way to reach her directly is a 30 minute call, or email at laura@lauraharrispm.com.",
      followups: [
        { question: "How do I get in touch?", topic: "contact" },
        { question: "Can I book a call?", topic: "contact" },
      ],
      sources: ["contact"],
      intent: "ready",
    },
  },
  {
    test: /hire a (head of product|pm\b|product manager)|help.*hire/i,
    payload: {
      answer:
        "Yes. Laura can help with job descriptions, sourcing, evaluating candidates, and interviewing to find the right full-time fit. She wouldn't be their people manager, but she's happy to act as a player-coach, the way she works with every teammate.",
      followups: [
        { question: "Why fractional instead of a full-time PM?", topic: "fit" },
        { question: "Will Laura go full-time eventually?", topic: "fit" },
      ],
      sources: ["fit"],
      intent: "evaluating",
    },
  },
  {
    test: /go full.?time|full.?time (hire|role|offer|after)/i,
    payload: {
      answer:
        "Not in the short or medium term. If you need a full-time hire now, or a commitment to go full-time after a part-time engagement, that's not the right fit for Laura right now.",
      followups: [
        { question: "Why fractional instead of a full-time PM?", topic: "fit" },
        { question: "Can you help us hire a full-time PM?", topic: "fit" },
      ],
      sources: ["fit"],
      intent: "evaluating",
    },
  },
  {
    test: /growth sprint/i,
    payload: {
      answer:
        "Laura doesn't offer a \"Growth Sprint.\" The two formats are Fractional (an ongoing, evolving retainer) and Project-Based (a defined project with fixed scope and deliverables, from diagnosis to launch).",
      followups: [
        { question: "What does a project-based engagement include?", topic: "project_based" },
        { question: "What does fractional work look like?", topic: "fractional" },
      ],
      sources: ["project_based", "fractional"],
      intent: "browsing",
    },
  },
  {
    test: /series a|fit|right for us|good fit|enterprise|b2b saas/i,
    payload: {
      answer:
        "It depends on where you are. Laura's a strong fit for consumer businesses past product-market fit that need to grow faster, especially teams with engineers but no dedicated senior product guidance. She avoids traditional B2B SaaS for large companies, that isn't where her experience is. She's also not the right fit if you're still searching for product-market fit or need a full-time PM starting today. A Series A raise alone doesn't rule you in or out, it's more about whether growth has stalled and who's driving it today.",
      followups: [
        { question: "What does a project-based engagement include?", topic: "project_based" },
        { question: "How do you work with engineers part-time?", topic: "process" },
      ],
      sources: ["fit"],
      intent: "evaluating",
    },
  },
  {
    test: /engineer|part.?time|work with/i,
    payload: {
      answer:
        "Laura embeds with the team 1 to 3 days a week and keeps engineering building from a queue that stays ahead of them, rather than waiting on her. She writes specs grounded in the actual codebase, checks every prototype against the spec, and makes sure nothing lives only in a Slack thread. Engineering shouldn't wait on product for a definition.",
      followups: [
        { question: "How do you use AI without building the wrong thing?", topic: "ai_approach" },
        { question: "What's the biggest growth win you've shipped?", topic: "case_burrow_growth" },
      ],
      sources: ["process", "fractional"],
      intent: "browsing",
    },
  },
  {
    test: /ai\b|claude|prototype/i,
    payload: {
      answer:
        "AI changed Laura's speed, not her judgment. Her process is the same product discipline she's always used: define the problem, prioritize, explore solutions, then ship and iterate. AI makes each step faster, like getting a working prototype the same day instead of waiting on design. **What gets built, and why, is still her call.** Every word and number she hands over is checked by her.",
      followups: [
        { question: "Do you help teams adopt AI tools too?", topic: "team_ai_enablement" },
        { question: "What's the biggest growth win you've shipped?", topic: "case_burrow_growth" },
      ],
      sources: ["ai_approach"],
      intent: "browsing",
    },
  },
  {
    test: /burrow|4x|ecommerce/i,
    payload: {
      answer:
        "At Burrow, Laura led a navigation and filtering restructure, fast-shipping messaging, and automatic promotions. Revenue grew 4x during the period, add-to-cart rate rose 41%, and average order value rose 9% after the promotions changes. The highest revenue day in company history landed within a week of launching in-stock messaging.",
      followups: [
        { question: "What was the phone agent tool at Rula?", topic: "case_phone_agent_tool" },
        { question: "Are we a fit if we just raised a Series A?", topic: "fit" },
      ],
      sources: ["case_burrow_growth"],
      intent: "browsing",
    },
  },
  {
    test: /available|availability|start|when can/i,
    payload: {
      answer:
        "Laura can often start within a week or two once she has availability, but she doesn't publish a live calendar here. The best next step is a 30 minute call, where she can speak to current availability directly.",
      followups: [
        { question: "What does a project-based engagement include?", topic: "project_based" },
        { question: "Is Laura open to remote work?", topic: "logistics" },
      ],
      sources: [],
      intent: "ready",
    },
  },
];

const DEFAULT_PAYLOAD: RespondPayload = {
  answer:
    "Laura is a fractional product lead with 8+ years building growth products at consumer startups, from GlossGenius to Rula Health to Burrow. She owns acquisition, activation, monetization, and retention work, usually embedded 1 to 3 days a week. Ask about a specific case study, how she works, or whether she's a fit for your team.",
  followups: [
    { question: "What does a project-based engagement include?", topic: "project_based" },
    { question: "Are we a fit if we just raised a Series A?", topic: "fit" },
  ],
  sources: ["services"],
  intent: "browsing",
};

/**
 * A message that exercises the "knowledge base can't answer this" path.
 * Matches the exact default routing line from system-prompt.md, for
 * consistency between mock and real answers to genuinely unpublished
 * specifics (a win rate, a tech stack beyond the named tools, salary or
 * visa questions, and the like): these aren't gaps that got filled in
 * today, they're things the knowledge base deliberately never states.
 */
const UNKNOWN_PAYLOAD: RespondPayload = {
  answer:
    "I don't know, but Laura does. The fastest way to ask her is to book a 30-minute call, or email her at laura@lauraharrispm.com.",
  followups: [
    { question: "What does a project-based engagement include?", topic: "project_based" },
    { question: "How does Laura work with engineers?", topic: "process" },
  ],
  sources: [],
  intent: "browsing",
};

export function mockRespond(latestMessage: string): RespondPayload {
  if (/win rate|success rate|programming language|tech stack beyond|visa|sponsorship|salary|compensation package/i.test(latestMessage)) {
    return UNKNOWN_PAYLOAD;
  }
  const match = CASES.find((c) => c.test.test(latestMessage));
  return match ? match.payload : DEFAULT_PAYLOAD;
}
