// ─── Data types ─────────────────────────────────────────────────────────────

export interface ProjectSection {
  id: string;
  label: string;
  /** Large serif heading inside the section */
  heading: string;
  /** Array of body paragraphs */
  body: string[];
  /**
   * Optional: parallel array to body[]. If boldPrefixes[i] is non-empty and
   * body[i] starts with that string, the prefix renders as <strong>.
   */
  boldPrefixes?: string[];
  /** Design section only: array of image paths (in /public) */
  images?: string[];
  /** Parallel to images[]: alt text per image */
  altTexts?: string[];
  /** Parallel to images[]: caption shown below each thumbnail on the page */
  captions?: string[];
  /** Parallel to images[]: intrinsic pixel width of each image */
  imageWidths?: number[];
  /** Parallel to images[]: intrinsic pixel height of each image */
  imageHeights?: number[];
  /** Results section only: parallel array to body[], one branded icon per
   * line. null for a plain grouping line (no bullet icon), e.g. "In the
   * first month after launch:" */
  resultIcons?: ("check" | "trend" | null)[];
}

export interface BeforeAfterRow {
  workflow: string;
  before: string;
  after: string;
}

export interface StackItem {
  tool: string;
  description: string;
}

export interface Project {
  /** Used as URL anchor: /#payments-onboarding, and as the reading-view deep link /#work-payments-onboarding */
  id: string;
  /** Position in the Recent Work stack: lower shows first. New studies just need the next number. */
  order: number;
  /** Funnel-stage tag(s) shown on the summary card, e.g. ["Acquisition"] or ["Acquisition", "Monetization"] */
  tags: string[];
  company: string;
  /** Path to thumbnail image in /public */
  thumbnail: string;
  /** Summary-card image: the study's most representative design-section image */
  cardImage?: { src: string; alt: string; width: number; height: number };
  /** Short description shown in hero band and mobile card */
  oneLineDesc: string;
  title: string;
  keyMetric: { number: string; label: string };
  /** Optional company stage shown in hero band metadata line */
  fundingStage?: string;
  /** Optional employee range shown in hero band metadata line */
  employeeRange?: string;
  sections: ProjectSection[];
  /** AI project only: structured before/after table, rendered in Results section */
  beforeAfterTable?: BeforeAfterRow[];
  /** AI project only: tool stack list, rendered in Design section */
  stack?: StackItem[];
  /** Optional engagement-type marker shown as a small tag next to the funnel
   * tag(s) on the summary card, e.g. "Fractional". Distinguishes studies
   * from fractional engagements from the full-time-role studies, which
   * don't set this. */
  engagement?: string;
  /** Optional one-line link to a related study, shown at the end of the
   * Reflection section. Opens the target study in place (reading view on
   * desktop, story view on mobile) rather than closing and reopening. */
  crossLink?: { toId: string; label: string };
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Patient Intake Redesign
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "patient-intake",
    order: 1,
    tags: ["Activation"],
    engagement: "Fractional",
    company: "Healthcare startup",
    thumbnail: "/thumb-intake.png",
    cardImage: {
      src: "/case-studies/intake-card.png",
      alt: "Redesigned intake form starting with a care-type choice",
      width: 1262,
      height: 873,
    },
    title: "Patient intake redesign",
    oneLineDesc:
      "A one-size-fits-all intake form was keeping qualified families from getting care. A staged redesign rebuilt it from diagnosis to launch.",
    keyMetric: {
      number: "~1.5 weeks",
      label: "of product time, diagnosis to launch",
    },
    fundingStage: "Series A",
    employeeRange: "14 employees",
    crossLink: {
      toId: "patient-portal",
      label: "Designed together with the patient portal. See the patient portal redesign →",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "Qualified families were dropping off on step one",
        body: [
          "The company connects families with specialized care. Intake was a small, high-touch flow: nearly every family arrived through a referral, already qualified and already looking for help. Yet about a third of them dropped off on the very first step of the intake form. For families who were already qualified, that was far too high, and in theory we could win almost all of them back by making those first steps feel doable. The intake experience was broken in two compounding ways:",
          "The form treated every family the same. Every family got the same insurance-heavy questions in the same order, whether they were ready to start care or hadn't been diagnosed yet. The question that determined what kind of care a family needed sat near the very end.",
          "Engineering was waiting on product. With no dedicated product person, the team kept finishing work and then waiting for the next definition.",
        ],
        boldPrefixes: [
          "",
          "The form treated every family the same.",
          "Engineering was waiting on product.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A staged plan, shipped as one release",
        body: [
          "I audited the funnel with production data, then wrote a plan staged by confidence and engineering effort. The CEO prioritized it and resourced every stage at once, so the full redesign shipped as one release. Two principles guided every decision:",
          "Fix what's certain first, and defer what needs new infrastructure. High-confidence changes led: simpler insurance steps, non-essential fields moved after submission, and broader entry-page copy. Higher-lift engineering projects like instant eligibility checks and automated insurance verification were saved for later.",
          "Ask the right question at the right moment. Fields not used for matching came out, and the care-type question moved to the front, so every family was routed correctly from the start.",
        ],
        boldPrefixes: [
          "",
          "Fix what's certain first, and defer what needs new infrastructure.",
          "Ask the right question at the right moment.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Reading the data, routing, and testing at low volume",
        body: [
          "The biggest drop-off in the data wasn't the biggest opportunity. The funnel analytics were new and hadn't been stress-tested, and they pointed to a large drop-off before families ever opened the intake link. The underlying data showed it was smaller than it looked, and mostly caused by things product couldn't fix, like unsupported insurance. Defining the real problems before brainstorming solutions kept us from building the wrong things.",
          "One question was two problems. Families who bounced early never reached the care-type question, and coordinators were learning mid-call that a family needed a diagnosis, not ongoing care. Moving the question earlier fixed conversion and routing at the same time.",
          "Volume was too low to test small changes. At current traffic, a test could only detect a lift of 15 to 20% and would take over a month. Referral traffic was already too close to its ceiling to test at all. So we shipped high-confidence changes to everyone with analytics live, and saved testing for the bigger bets.",
        ],
        boldPrefixes: [
          "The biggest drop-off in the data wasn't the biggest opportunity.",
          "One question was two problems.",
          "Volume was too low to test small changes.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Understand the need before asking for proof",
        body: [
          "The old form asked families to prove their eligibility before it understood what they needed. The redesign flipped that order: learn what kind of care the family is looking for, then ask only the questions that matter for it.",
          "We added a clear care-type choice up front, streamlined the insurance steps, and cut every field not needed to match a family with care. The result was an intake experience that met families where they were.",
          "The images below are abstracted recreations that illustrate the design, not screenshots of the live product, to keep the client anonymous.",
        ],
        images: [
          "/case-studies/intake-1.png",
          "/case-studies/intake-2.png",
        ],
        altTexts: [
          "Care-type selection at the start of intake.",
          "Streamlined insurance step.",
        ],
        captions: [
          "Families choose the kind of care they need first, so every question after it is relevant to them.",
          "Secondary insurance folded into one step, with non-essential details collected after submission.",
        ],
        imageWidths: [720, 1262],
        imageHeights: [1480, 873],
      },
      {
        id: "results",
        label: "Results",
        heading: "A full redesign, launched in one release",
        body: [
          "Full redesign launched across the backend and public intake, with every change merged in five days",
          "Engineering never waited on product for a definition",
          "Post-launch plan handed to named owners, with a guardrail metric tracking families reaching a first appointment",
        ],
        resultIcons: ["check", "check", "check"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Stay ahead of engineering and you raise both speed and impact. A great spec is table stakes. What changed this team's velocity was a queue of prioritized, well-scoped projects that were ready to build before engineering finished the last one. Nobody waited on product, and every sprint went to the work most likely to move the numbers.",
        ],
        boldPrefixes: [
          "Stay ahead of engineering and you raise both speed and impact.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Patient Portal Redesign
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "patient-portal",
    order: 2,
    tags: ["Activation"],
    engagement: "Fractional",
    company: "Healthcare startup",
    thumbnail: "/thumb-portal.png",
    cardImage: {
      src: "/case-studies/portal-card.png",
      alt: "Patient portal step tracker with a next-action header",
      width: 883,
      height: 842,
    },
    title: "Patient portal redesign",
    oneLineDesc:
      "After submitting intake, some families were misrouted, silently dropped, or promised coverage we couldn't deliver. A redesigned portal, built in about a week of product time, gave every family an honest next step.",
    keyMetric: {
      number: "1 day",
      label: "faster to first session",
    },
    fundingStage: "Series A",
    employeeRange: "14 employees",
    crossLink: {
      toId: "patient-intake",
      label: "Designed together with the intake form. See the patient intake redesign →",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A portal that left families stuck or misled",
        body: [
          "The company connects families with specialized care for their children. Finding that care isn't like booking a doctor's appointment, where one patient matches one provider and books a time. Before a first appointment, a family might need an evaluation, insurance verification, documentation, signed forms, and a clinician with capacity nearby, in an order that varies by family. The portal was supposed to guide parents through all of it. Instead, it failed them in three ways, in order of harm:",
          "Families who needed an evaluation were routed toward treatment. Their form answer overwrote a key flag in the data, sending them to a generic intake call instead of the team that coordinates evaluations.",
          "Families without a match disappeared. When matching failed on insurance, location, or clinician capacity, families landed in a portal with no match, no explanation, and no way to book.",
          "Coverage copy promised what the product couldn't deliver. Out-of-network families were told they'd get a match either way. They wouldn't.",
        ],
        boldPrefixes: [
          "",
          "Families who needed an evaluation were routed toward treatment.",
          "Families without a match disappeared.",
          "Coverage copy promised what the product couldn't deliver.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A state matrix for every path to care",
        body: [
          "The portal had too few analytics events for the kind of funnel analysis I did on intake, so I leaned on qualitative feedback and product judgment instead. The existing flow was a jumble of competing actions, and the fixes followed established best practices clearly enough that waiting for more data would only have slowed us down. I wrote a PRD and a state matrix covering every combination of care type, coverage, and capacity, then redesigned the portal around them. The matrix became engineering's acceptance criteria. Two principles guided every decision:",
          "Separate what a family asked for from what they have. One field had been carrying two facts. Splitting care type (what the family asked for, changeable only by staff) from documentation status (what each child has) fixed the misrouting and kept the funnel measurable.",
          "Every state tells the truth. Every screen names the parent's next action, or what the company is doing when there isn't one. No silent drops, no placeholder clinicians, no locked buttons without a reason, and nothing that promises care a family's plan can't cover.",
        ],
        boldPrefixes: [
          "",
          "Separate what a family asked for from what they have.",
          "Every state tells the truth.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "No single path to care",
        body: [
          "There was no single path to care. One family needs an evaluation first. Another is ready for treatment but waiting on a clinician. A third has a plan that accepts a doctor's referral instead of a diagnosis, or requires in-person care that telehealth can't deliver. I mapped every if-then path a parent could take on behalf of their child, then designed the intake form and portal together, so each family sees one clear, digestible sequence even though no two sequences are the same. Plan rules became data rather than design, so adding a new plan never requires a redesign.",
          "Booking was waiting on a check it didn't need. The first consultation is free, so I unlocked booking as soon as a family submitted their member ID, instead of waiting for the eligibility check. That took a full day off time to first session. It also meant designing for a new case: coverage problems surfacing after a consultation is booked. The appointment stays, because the clinician is the right person to help.",
          "Completion rate could be misleading, so we set a guardrail. A portal where every step gets checked off can still leave families short of care. I set the guardrail as families reaching a first appointment. I'd rather see step completion dip and care starts rise than the reverse.",
        ],
        boldPrefixes: [
          "There was no single path to care.",
          "Booking was waiting on a check it didn't need.",
          "Completion rate could be misleading, so we set a guardrail.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Always name the next step, and who owns it",
        body: [
          "The portal became a step tracker, built as phases containing steps, so treatment can be added later without renumbering anything. The header always names the parent's next action. When there isn't one, it says what the company is doing: \"We're verifying coverage. Nothing needed from you right now.\" A parent should never feel stalled on something that isn't theirs.",
          "Requirements split into two honest tiers: what's needed before you can book, and what's needed before we can bill. Only the first tier locks anything, so a finished tracker always means nothing is blocking you.",
          "The images below are abstracted recreations that illustrate the design, not screenshots of the live product, to keep the client anonymous.",
        ],
        images: [
          "/case-studies/portal-1.png",
          "/case-studies/portal-2.png",
        ],
        altTexts: [
          "Step tracker with a next-action header.",
          "No-match state with a bookable call.",
        ],
        captions: [
          "The header always names what happens next, and who's responsible for it.",
          "When there's no clinician nearby yet, families see why, get a call they can book now, and are notified when that changes.",
        ],
        imageWidths: [720, 720],
        imageHeights: [1480, 1480],
      },
      {
        id: "results",
        label: "Results",
        heading: "Every family gets an honest next step",
        body: [
          "A full day faster to first session, by unlocking booking as soon as families submitted their member ID",
          "Families needing an evaluation routed to evaluation support, not straight to treatment",
          "Unmatched families shown an honest next step and a call they can book, instead of a silent dead end",
          "Coverage copy rewritten to promise only what the product can deliver",
          "Launched alongside the redesigned intake form in a single release, with a state matrix as engineering's acceptance criteria",
          "Post-launch plan handed to named owners, with a guardrail metric tracking families reaching a first appointment",
        ],
        resultIcons: ["trend", "check", "check", "check", "check", "check"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Many UX problems are data model problems. Misrouted families, silent drops, and false promises looked like screen issues. Most came from one field doing two jobs. Fixing the model made honest screens possible, and more polish on the old model couldn't have.",
          "Moving fast is a tradeoff, so name it when you make it. Shipping intake and the portal together was the right call, but it meant no clean baseline to measure against. Next time I'd write down what the acceleration costs at the moment of the decision, so the team chooses the tradeoff instead of discovering it later.",
        ],
        boldPrefixes: [
          "Many UX problems are data model problems.",
          "Moving fast is a tradeoff, so name it when you make it.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Payments Onboarding
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "payments-onboarding",
    order: 4,
    tags: ["Activation"],
    company: "GlossGenius",
    thumbnail: "/thumb-gg-payments.png",
    cardImage: {
      src: "/gg-payments-1.png",
      alt: "Redesigned payments onboarding flow for GlossGenius",
      width: 1717,
      height: 1021,
    },
    title: "Payments onboarding redesign",
    oneLineDesc:
      "A broken onboarding flow was limiting adoption of one of GlossGenius's most valuable features. An iterative experimentation program fixed it.",
    keyMetric: {
      number: "80%",
      label: "lift in payments onboarding completion",
    },
    fundingStage: "Series C",
    employeeRange: "260→330 employees",
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A broken flow was blocking a high-value feature",
        body: [
          "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. Payments processing is one of its most valuable features: users who process payments generate significantly more revenue for GlossGenius and are more likely to remain subscribers because they find value in the feature.",
          "But most subscribers hadn't set up payments processing yet. Why? The onboarding flow was broken in two compounding ways:",
          "The value proposition was hidden. There was no clear answer to \"why should I do this, and why right now?\" Without a reason to continue, the flow was a dead end.",
          "Onboarding was difficult even for motivated users. The flow lacked clear steps and context, making it feel disjointed and untrustworthy. For example, the Stripe identity verification step opened in an external browser with different branding and no explanation as to why it required sensitive personal information including SSN.",
        ],
        boldPrefixes: [
          "",
          "",
          "The value proposition was hidden.",
          "Onboarding was difficult even for motivated users.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "An iterative experimentation program, guided by two principles",
        body: [
          "I improved the flow through a structured experimentation program, prioritizing changes based on impact, effort, and ability to drive learning. Two principles guided every decision:",
          "Make the value unmistakable before asking for effort. We led with a clear value statement so users understood why payments processing was worth setting up before they started.",
          "Remove friction that creates confusion and add friction that builds confidence. We introduced a persistent progress bar and clearer guidance to support users through a complex flow. We also redesigned the Stripe verification step to feel native with consistent styling and more reassuring, transparent copy.",
        ],
        boldPrefixes: [
          "",
          "Make the value unmistakable before asking for effort.",
          "Remove friction that creates confusion and add friction that builds confidence.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Three compounding complications",
        body: [
          "We had strong hypotheses but needed data to validate them before making larger investments. This was a complex, business-critical onboarding flow with real technical constraints, so we designed experiments to deliver clear answers with small to medium engineering lift. Those insights gave us the confidence to move forward with more significant changes.",
          "Running experiments across mobile, web, and multiple entry points added meaningful complexity. Funnel performance varied significantly by persona, entry point, and device, so we designed experiments with precision, aligning on variables, success metrics, MDE, and test duration upfront. We balanced isolating variables to validate hypotheses with taking large enough swings to reach statistically significant results.",
          "A key persona insight emerged mid-experiment and reshaped the strategy. The test was taking longer than expected to reach significance, and the data revealed why: established businesses responded to payments-first flows, while newer businesses needed to see value through setting up bookable services first. We ended the experiment early to free up traffic for other tests and adjusted the roadmap to support more tailored, persona-based experiences.",
        ],
        boldPrefixes: [
          "We had strong hypotheses but needed data to validate them before making larger investments.",
          "Running experiments across mobile, web, and multiple entry points added meaningful complexity.",
          "A key persona insight emerged mid-experiment and reshaped the strategy.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "The right friction, not less friction",
        body: [
          "Friction in onboarding isn't inherently bad; what matters is whether it builds or erodes confidence. Users were asked to do a lot: verify their identity, connect a bank account, and commit to a new platform. Reducing steps without enough context made it harder, not easier, to complete.",
          "We led with a clear value statement, added a persistent progress bar, improved instructional copy, and redesigned the Stripe verification experience to feel fully native. The result was a flow that felt cohesive, trustworthy, and easier to navigate.",
        ],
        images: ["/gg-payments-1.png"],
        altTexts: [
          "Payments onboarding flow redesign: value statement, progress bar, and native Stripe verification",
        ],
        imageWidths: [1717],
        imageHeights: [1021],
      },
      {
        id: "results",
        label: "Results",
        heading: "Measurable impact across the funnel",
        body: [
          "80% increase in payments processing onboarding completion rate",
          "Seven-figure GPV impact as more businesses began processing payments",
          "3% lift in subscription activations, validating that payments setup increased the perceived value of a GlossGenius subscription",
        ],
        resultIcons: ["trend", "trend", "trend"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Qualified, motivated users will still abandon a flow that fails them. Most GlossGenius subscribers hadn't set up payments not due to lack of intent, but because the onboarding experience broke down. Effective onboarding closes the gap between intent and action.",
          "Well-run experiments often yield more insight than planned, but only if you look for it. A key persona insight emerged when we analyzed results through the lens of user context rather than relying solely on the primary metric, revealing that optimal onboarding sequencing varied by business size. That deeper read helped us act faster on higher-impact opportunities.",
        ],
        boldPrefixes: [
          "Qualified, motivated users will still abandon a flow that fails them.",
          "Well-run experiments often yield more insight than planned, but only if you look for it.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Scheduling Tool for Phone Agents
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "phone-agent-tool",
    order: 5,
    tags: ["Acquisition"],
    company: "Rula Health",
    thumbnail: "/thumb-rula-scheduling.png",
    cardImage: {
      src: "/rula-scheduling-1.png",
      alt: "Intake form capturing state and insurance coverage before showing calendar slots",
      width: 2840,
      height: 2564,
    },
    title: "Scheduling tool for phone agents",
    oneLineDesc:
      "Patients calling their insurer for mental healthcare had no direct path to booking an appointment. I built the bridge, and it became the most impactful feature launch in Rula's history.",
    keyMetric: {
      number: "21%",
      label: "patient growth from this launch",
    },
    fundingStage: "Series B→C",
    employeeRange: "180→550 employees",
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A huge drop-off between intent and a booked appointment",
        body: [
          "The drop-off between 'I want help' and 'I have a booking' was massive, and Rula wasn't bridging that gap despite strong payer partnerships and offering same-week availability at scale.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A real-time scheduling tool built for phone agents",
        body: [
          "I built a scheduling tool that lets insurance phone agents book Rula appointments on behalf of members (patients) in real time. A member calls their insurer, asks about mental healthcare, and leaves the call with an appointment booked. This is a win for patients, providers, and insurers because more patients access care quicker.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Building for speed and scale from day one",
        body: [
          "The only way Rula allowed booking an appointment was the opposite of what the user (phone agent) needed. Phone agents need to book quickly while a patient is on the line. The existing therapist directory list took too long for the phone agent because it prioritized showing details about potential therapists rather than scheduling availability. Building the calendar UI they wanted required an entirely new backend service to surface therapist availability at the speed and volume the tool required.",
          "We made deliberate scope tradeoffs with scale in mind. We could have launched faster for a single payer, but that would have limited how quickly the scheduling tool could expand across all payers we partnered with. Given strong MVP traction and clear relevance across existing and prospective partners, I included the additional scope needed to scale from the start. That investment paid off, enabling fast adoption across partners and making it the most impactful feature launch in Rula's history.",
        ],
        boldPrefixes: [
          "The only way Rula allowed booking an appointment was the opposite of what the user (phone agent) needed.",
          "We made deliberate scope tradeoffs with scale in mind.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Purpose-built for speed, not browsing",
        body: [
          "The flow starts with a short intake form that captures the member's state, insurance coverage, type of therapy, any other fields a specific payer needs. The calendar view comes after the form, using its data to show only bookable slots. Additional filters are accessible on the side if the member has specific preferences.",
        ],
        images: [
          "/rula-scheduling-1.png",
          "/rula-scheduling-2.png",
          "/rula-scheduling-3.png",
        ],
        altTexts: [
          "Intake form capturing state and insurance coverage before showing calendar slots",
          "Calendar view with side filter panel for therapist preferences",
          "The existing therapist list, built for patient browsing, not agent scheduling",
        ],
        captions: [
          "The intake form captures state and insurance coverage upfront so every slot shown in the subsequent calendar is confirmed bookable for the member on the call.",
          "The calendar and filter designs shown are illustrative since the actual tool is not publicly available, but they accurately represent the interaction model that prioritizes scheduling quickly.",
          "What we didn't use. The existing therapist list was built for patients browsing on their own time, not agents scheduling under pressure.",
        ],
        imageWidths: [2840, 2664, 820],
        imageHeights: [2564, 1228, 766],
      },
      {
        id: "results",
        label: "Results",
        heading: "The most impactful feature launch in Rula's history",
        body: [
          "21% patient growth (largest feature launch ever at Rula)",
          "21% patient growth from this launch, part of Rula's 50%+ overall patient growth during my time there",
          "66% conversion increase vs. the previous phone agent flow",
        ],
        resultIcons: ["trend", "trend", "trend"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Sometimes the right answer is a new tool, not a modified one. The instinct early on was to adapt what we already had, and that was a successful MVP approach. But the phone agent's job is completely different from a patient's: on a call, under time pressure, scheduling for someone else. Starting from the user's actual context rather than existing patterns led to a tool that was more effective and scalable.",
        ],
        boldPrefixes: [
          "Sometimes the right answer is a new tool, not a modified one.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Therapist Directory
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "therapist-directory",
    order: 6,
    tags: ["Acquisition"],
    company: "Rula Health",
    thumbnail: "/thumb-rula-directory.png",
    cardImage: {
      src: "/rula-directory-3.png",
      alt: "Desktop therapist directory experience",
      width: 1350,
      height: 1261,
    },
    title: "Therapist directory",
    oneLineDesc:
      "Rula was nearly invisible in organic search. Winning thousands of long-tail searches built a free acquisition channel from scratch.",
    keyMetric: {
      number: "345%",
      label: "lift in organic patient starts",
    },
    fundingStage: "Series B→C",
    employeeRange: "180→550 employees",
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "Nearly invisible in the channel that matters most",
        body: [
          "Millions of people looking for mental healthcare start with a Google search, but Rula was nearly invisible in those results, leaving a huge patient demand channel untapped. Competing for high-volume searches like \"therapist near me\" wasn't realistic. The only viable path was to play a different game.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "Win the long tail instead of the impossible head terms",
        body: [
          "I spearheaded an SEO-driven therapist directory built on a counterintuitive insight: instead of competing for high-volume searches like \"therapist near me\" where established players dominate, we targeted thousands of hyper-specific searches like \"ADHD therapists near me,\" \"grief therapy Texas,\" and \"Aetna therapists in Austin.\" Each term was small on its own, but together they represented substantial traffic we could actually win. Every search term got its own indexed directory page, making it easy for search engines to find and serve to prospective patients.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Breadth, speed, and a 20-second load time",
        body: [
          "The strategy was breadth, not depth. Winning the long tail meant creating hundreds of thousands of directory pages, each with customized page-level signals: titles, meta descriptions, and content to build relevance across Google's index at scale. This demanded sophisticated SEO strategy, content creation, and technical approach.",
          "Because organic search is a long-game, we needed to get in the game ASAP to create impact. Rather than building net-new infrastructure, I framed the directory as a new front door to what we already had: the recommendation algorithm, therapist filters, profile pages, and sign-up flow. Launch fast, then let the index build over time.",
          "We initially planned to reuse the existing flow, but a 20-second load time made that impossible without significant performance investment. A slow page load is a nonstarter for Google rankings, and the existing flow took 20 seconds (!) to fetch therapist availability before rendering the directory page. While this delay was masked in the form flow, where required steps kept users engaged, it became fully visible on the directory pages and created a clear performance issue.",
        ],
        boldPrefixes: [
          "The strategy was breadth, not depth.",
          "Because organic search is a long-game, we needed to get in the game ASAP to create impact.",
          "We initially planned to reuse the existing flow, but a 20-second load time made that impossible without significant performance investment.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Zero friction between search and results",
        body: [
          "The user flow starts with a prospective patient Google searching for mental health therapy. Google suggests relevant pages to help them find care, including a Rula therapist directory page that speaks to the specific search terms (including location, which Google often adds). When a user clicks on the Rula page link, they land on a filtered therapist list showing therapists they could actually book (state and insurance pre-filtered) right now. If location is unknown, a lightweight modal collects state and insurance before loading results.",
        ],
        images: [
          "/rula-directory-1.gif",
          "/rula-directory-2.gif",
          "/rula-directory-3.png",
        ],
        altTexts: [
          "Therapist directory search flow: from Google result to filtered therapist list",
          "Directory results page with location and insurance modal",
          "Desktop therapist directory experience",
        ],
        captions: [
          "Directory requires state and requests insurance to load plausible therapists for patient, then shows list of therapists with additional filters.",
          "Content below the therapists is optimized for SEO with Rula blog links, Rula success data, FAQ content, and links to more directory pages. This content both contributes to user experience and helps search engines find and serve relevant pages.",
          "Directory desktop experience.",
        ],
        imageWidths: [1206, 800, 1350],
        imageHeights: [2622, 1739, 1261],
      },
      {
        id: "results",
        label: "Results",
        heading: "A zero-cost acquisition channel built from scratch",
        body: [
          "0 to 1.7M impressions in search results",
          "290% increase in organic traffic",
          "345% increase in organic patient starts",
          "41% improvement in domain ranking",
        ],
        resultIcons: ["trend", "trend", "trend", "trend"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "The most important decision on this project was strategic, not tactical. We could have spent months trying to rank for \"therapist near me\" and gotten nowhere. The insight that changed everything: we didn't need to win the most competitive searches to win the channel. The long tail was wide open, the content needs were well-defined, and we already had most of the infrastructure we needed to build the right content. Sometimes the best growth move is finding the game you can actually win.",
          "Infrastructure investments can pay off cross-functionally, if someone connects the dots. The load-time fix was built for the directory, but I looked across teams for ways to compound the value beyond the original scope. As a result, this work also improved the existing sign-up flow, boosting booking conversion for the majority of traffic by multiple percentage points.",
        ],
        boldPrefixes: [
          "The most important decision on this project was strategic, not tactical.",
          "Infrastructure investments can pay off cross-functionally, if someone connects the dots.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Billing Rebuild for AI Add-Ons and Annual Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "annual-plans",
    order: 3,
    tags: ["Monetization"],
    company: "GlossGenius",
    thumbnail: "/thumb-gg-annual.png",
    cardImage: {
      src: "/gg-annual-1.png",
      alt: "Website pricing page for new subscribers positions annual plans as a discount against the new monthly price",
      width: 1601,
      height: 1163,
    },
    title: "Billing rebuild for AI add-ons and annual subscriptions",
    oneLineDesc:
      "GlossGenius's billing system could only support one billing structure, which blocked annual plans and the company's AI add-on strategy. I led a full migration to a flexible subscription service.",
    keyMetric: {
      number: "0",
      label: "business interruptions during a full billing migration",
    },
    fundingStage: "Series C",
    employeeRange: "260→330 employees",
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A billing infrastructure that was blocking growth",
        body: [
          "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. GlossGenius had one subscription structure: three hard-coded subscription tiers that offered a set feature bundle and charged one price on a monthly cadence. As the company matured, this created compounding problems across the product roadmap, revenue optimization, and customer experience.",
          "Limiting product roadmap: the infrastructure could only accommodate a single charge type per user. There was no ability to charge for add-ons separately from a subscription tier, meaning future product launches like AI agents to help run your business as an add-on to your base subscription were architecturally blocked before they started.",
          "Limiting revenue: With only monthly billing, there was no annual commitment signal or cash pull-forward. Pricing for new customers had been static for years, presenting an opportunity to more accurately reflect the current value of a subscription.",
          "Lackluster customer experience: As GlossGenius scaled upmarket, more subscribers were established businesses that preferred annual over monthly billing for accounting simplicity.",
        ],
        boldPrefixes: [
          "",
          "Limiting product roadmap:",
          "Limiting revenue:",
          "Lackluster customer experience:",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A full infrastructure migration with a careful launch strategy",
        body: [
          "I led the launch of annual subscription plans alongside a price increase for new customers. This required a full subscription service migration, close cross-functional coordination across product, engineering, finance, and marketing, and a carefully managed launch to mitigate activation risk.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Three decisions that shaped the launch",
        body: [
          "The existing infrastructure couldn't support annual billing in any way. After confirming there were no engineering shortcuts, I worked with engineering to scope a full subscription service migration, defining requirements for the short- and medium-term future state: multiple charge types, new plan tiers, price flexibility, and different billing logic across customer types.",
          "Launching a price increase and a new billing option simultaneously required careful sequencing internally and externally. We chose to launch to all customers at once rather than a phased rollout. GlossGenius customers are part of tight-knit solopreneur communities, so a phased rollout would have created confusion when customers compared notes. The clean rule: subscribe before X date, your price is locked in; sign up after, new pricing applies.",
          "The activation risk needed to be modeled and monitored precisely to avoid harming the bottom line. Working with finance and analytics, we modeled the maximum tolerable activation decrease before the price increase became net-negative. That number became the launch guardrail and the primary post-launch decision point.",
        ],
        boldPrefixes: [
          "The existing infrastructure couldn't support annual billing in any way.",
          "Launching a price increase and a new billing option simultaneously required careful sequencing internally and externally.",
          "The activation risk needed to be modeled and monitored precisely to avoid harming the bottom line.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Communicating two changes without creating confusion",
        body: [
          "The challenge was communicating two simultaneous changes without creating confusion or triggering price sensitivity among existing subscribers who weren't affected. Key decisions: a clear plan comparison UI making annual vs. monthly value immediately legible, a simplified pricing page, and copy personalized for users who subscribed before launch (no annual discount) vs users who subscribed after launch (annual discount).",
        ],
        images: ["/gg-annual-1.png", "/gg-annual-2.png", "/gg-annual-3.png"],
        altTexts: [
          "Website pricing page for new subscribers positions annual plans as a discount against the new monthly price",
          "Annual plan awareness message for existing monthly subscribers, who could switch to annual at their locked-in rate",
          "View plans modal for logged-in subscribers, who could switch to annual at their locked-in rate",
        ],
        captions: [
          "Website pricing page for new subscribers positions annual plans as a discount against the new monthly price.",
          "Annual plan awareness message for existing monthly subscribers, who could switch to annual at their locked-in rate.",
          "View plans modal for logged-in subscribers, who could switch to annual at their locked-in rate.",
        ],
        imageWidths: [1601, 960, 550],
        imageHeights: [1163, 473, 316],
      },
      {
        id: "results",
        label: "Results",
        heading: "Zero disruption, with early signals above projections",
        body: [
          "Unblocked AI add-ons, the company's core growth strategy, which launched after I left",
          "In the first month after launch:",
          "Activation held within acceptable thresholds, requiring no corrective pricing action",
          "Zero business interruptions through a full subscription infrastructure migration",
          "Revenue per customer increased multiple percentage points (early directional signal; not yet statistically significant)",
          "Annual plan adoption exceeded projections, with strong voluntary uptake from existing customers, signaling real long-term commitment (early directional signal; not yet statistically significant)",
        ],
        resultIcons: ["check", null, "check", "check", "trend", "trend"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Monetization isn't always an optimization problem. Sometimes it requires rebuilding the foundation before meaningful progress is possible. This project laid that foundation for GlossGenius's growth roadmap, making the significant engineering investment well worth it.",
          "Work driven by business goals can also serve the customer if you look for the overlap. While overhauling subscription infrastructure was prioritized for monetization and roadmap needs, customer support data made it clear that annual billing was a real benefit for larger businesses. We leaned into that in our positioning, and existing customers, who got no discount, still switched to annual plans because it matched how they operate.",
        ],
        boldPrefixes: [
          "Monetization isn't always an optimization problem.",
          "Work driven by business goals can also serve the customer if you look for the overlap.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Burrow: Ecommerce Website Redesign
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "burrow-growth",
    order: 7,
    tags: ["Acquisition", "Monetization"],
    company: "Burrow",
    thumbnail: "/burrow-3.png",
    cardImage: {
      src: "/burrow-3.png",
      alt: "Promotions communicated active discounts without requiring user action",
      width: 842,
      height: 721,
    },
    title: "Ecommerce website redesign",
    oneLineDesc:
      "The site hadn't kept pace with a growing catalog. Fixing navigation, shipping messaging, and promotions compounded across the funnel.",
    keyMetric: {
      number: "4x",
      label: "revenue growth",
    },
    fundingStage: "Series A→C",
    employeeRange: "30→110 employees",
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "Site experience lagging behind catalog growth",
        body: [
          "Burrow's growth was fueled by paid acquisition, bringing high-intent traffic to the site. However, the onsite experience hadn't evolved at the same pace.",
          "As the catalog expanded, navigation became harder, key differentiators were diluted, and the path to purchase introduced unnecessary friction. Customers struggled to find the right product, evaluate options, and complete checkout efficiently.",
          "The opportunity was to better convert existing demand by evolving the experience to match a more mature stage of growth.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A series of initiatives across the funnel",
        body: [
          "I led a series of product initiatives across the funnel, each targeting a key conversion barrier as the business scaled.",
          "First, I restructured navigation and introduced filtering grounded in how customers shop for furniture, making it easier to browse and narrow to relevant products as the catalog grew.",
          "Next, I repositioned fast shipping as a core differentiator. Once operations improved, we surfaced \"in stock and ready to ship\" messaging across product pages, cart, and a dedicated landing page integrated into navigation.",
          "Finally, I rebuilt the promotions experience so discounts applied automatically, removing friction at checkout and establishing a more scalable foundation for future campaigns.",
          "Together, these changes improved clarity, reduced friction, and better supported more complex purchase decisions.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Coordination, scale, and limited measurement",
        body: [
          "Promotions required tight coordination across marketing and product. Tiered discounts meant exact savings could only be calculated in cart, so we kept messaging simple while the system handled complexity.",
          "Navigation needed to scale with an expanding catalog without overwhelming users. I partnered with design and merchandising to balance breadth with clarity and reinforce key entry points.",
          "Measuring results confidently was tricky. We intentionally did not invest in A/B testing infrastructure at this stage because there were too many moving parts changing quickly. The priority was rapid, informed iteration over precise measurement, so I used pre/post analysis and framed most results as directional.",
        ],
        boldPrefixes: [
          "Promotions required tight coordination across marketing and product.",
          "Navigation needed to scale with an expanding catalog without overwhelming users.",
          "Measuring results confidently was tricky.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Removing friction across browse, evaluate, and buy",
        body: [
          "Each initiative addressed a different point of funnel friction, with copy and visual treatments tuned to where customers were getting stuck.",
        ],
        images: [
          "/burrow-1.png",
          "/burrow-2.png",
          "/burrow-3.png",
        ],
        altTexts: [
          "Navigation and filtering",
          "Shipping messaging",
          "Promotions",
        ],
        captions: [
          "Navigation and filtering reorganized around how customers shop for home furnishings. On mobile, the grid adapted to show more detail as users narrowed results.",
          "Shipping messaging updated across product pages and cart. A modal provided delivery details, and a landing page supported paid and organic traffic.",
          "Promotions communicated active discounts without requiring user action. The cart displayed exact savings, promotion tier details, and allowed code overrides to maintain marketing channel attribution.",
        ],
        imageWidths: [1016, 695, 842],
        imageHeights: [859, 481, 721],
      },
      {
        id: "results",
        label: "Results",
        heading: "Compounding gains across the funnel",
        body: [
          "Revenue grew 4x over my nearly three years at Burrow. No single project drove it. It came from compounding work across the funnel, including the projects below.",
          "4x revenue growth during this period",
          "+41% increase in add-to-cart rate and +9% increase in average order value following improvements to the promotions experience",
          "Highest revenue day in company history within one week of launching in-stock messaging",
        ],
        resultIcons: ["trend", "trend", "trend", "check"],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "A strong marketing engine brings in demand, but growth depends on converting that traffic into purchases. As Burrow expanded beyond a single hero product into a broader assortment, the experience needed to do more than present options. It needed to guide decisions, surface the right products, and reinforce why to buy.",
        ],
        boldPrefixes: [
          "A strong marketing engine brings in demand, but growth depends on converting that traffic into purchases.",
        ],
      },
    ],
  },
];
