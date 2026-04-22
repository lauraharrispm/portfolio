// ─── Data types ─────────────────────────────────────────────────────────────

export interface ProjectSection {
  id: string;
  label: string;
  /** Large serif heading inside the section */
  heading: string;
  /** Array of body paragraphs */
  body: string[];
  /**
   * Optional — parallel array to body[]. If boldPrefixes[i] is non-empty and
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
  /** Used as URL anchor: /#payments-onboarding */
  id: string;
  company: string;
  /** Path to thumbnail image in /public */
  thumbnail: string;
  /** Short description shown in hero band and mobile card */
  oneLineDesc: string;
  title: string;
  keyMetric: { number: string; label: string };
  sections: ProjectSection[];
  /** AI project only: structured before/after table, rendered in Results section */
  beforeAfterTable?: BeforeAfterRow[];
  /** AI project only: tool stack list, rendered in Design section */
  stack?: StackItem[];
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Payments Onboarding
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "payments-onboarding",
    company: "GlossGenius",
    thumbnail: "/thumb-gg-payments.png",
    title: "Redesigning Payments Onboarding",
    oneLineDesc:
      "A broken onboarding flow was limiting growth from one of GlossGenius's most valuable revenue streams. An iterative experimentation program fixed it.",
    keyMetric: {
      number: "80%",
      label: "onboarding completion lift",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A broken flow was blocking a high-value feature",
        body: [
          "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. Payments processing is one of its most valuable features: users who process payments generate significantly more revenue and are measurably more likely to remain subscribers. Most GlossGenius users could benefit from it, but most hadn't set it up.",
          "The onboarding flow was broken in two compounding ways:",
          "The value proposition was hidden. There was no clear answer to \"why should I do this, and why right now?\" Without a reason to continue, the flow was a dead end.",
          "It was hard to get through even for motivated users. The flow lacked clear steps and context including an externally-managed Stripe identity verification step that felt foreign: a jarring light-mode interface inside a dark-mode app, opening in an external browser without context explaining why users were being asked to share sensitive personal information.",
        ],
        boldPrefixes: [
          "",
          "",
          "The value proposition was hidden.",
          "It was hard to get through even for motivated users.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "An iterative experimentation program, guided by two principles",
        body: [
          "I redesigned the flow through an iterative experimentation program, sequencing experiments by expected impact, resources required, and user experience to maximize learning and momentum. Two principles guided every decision:",
          "Make the value unmistakable before asking for effort. We led with a clear value statement so users understood why payments processing was worth setting up before they started.",
          "Remove friction that creates confusion and add friction that builds confidence. We added a persistent progress bar and more instructional content to guide users through a complex flow. We transformed the Stripe verification step to feel native: matching dark mode, applying brand styles, and rewriting copy to be clearer and more reassuring.",
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
          "We had informed hypotheses but needed data to prove them. Each experiment was designed to get a confident answer: learn, iterate, launch, repeat.",
          "Running experiments across mobile, web, and multiple entry points added complexity. Funnel performance varied significantly by entry point, requiring precision in how we defined success and ensuring no conflicting experiences ran simultaneously.",
          "A persona finding emerged mid-experiment and reshaped the strategy. Established businesses responded well to payments-first flows; newer businesses needed to demonstrate value through service creation first. This came from the data, not the hypothesis, and pointed toward persona-based onboarding as the right next direction.",
        ],
        boldPrefixes: [
          "We had informed hypotheses but needed data to prove them.",
          "Running experiments across mobile, web, and multiple entry points added complexity.",
          "A persona finding emerged mid-experiment and reshaped the strategy.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "The right friction, not less friction",
        body: [
          "Friction in onboarding has a bad reputation, but it's not always good or always bad. What matters is the right clicks. In this case, users were being asked for a lot: verify their identity, connect a bank account, and commit to a new revenue stream. Limiting context and clicks to rush them through it didn't help them succeed.",
          "We led with a value statement, added a persistent progress bar, rewrote instructional copy, and transformed the Stripe verification experience by matching GlossGenius's branding. The result felt native and trustworthy rather than foreign and unclear.",
        ],
        images: ["/gg-payments-1.png"],
        altTexts: [
          "Payments onboarding flow redesign — value statement, progress bar, and native Stripe verification",
        ],
        imageWidths: [1214],
        imageHeights: [630],
      },
      {
        id: "results",
        label: "Results",
        heading: "Measurable impact across the funnel",
        body: [
          "📈 80% increase in payments onboarding completion rate",
          "📈 Seven-figure GPV impact as more businesses began actively processing payments",
          "📈 3% lift in subscription activations, validating that payments setup increased the perceived value of a GlossGenius subscription",
        ],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "A bad onboarding flow can suppress adoption of a feature users already need. Most GlossGenius subscribers hadn't set up payments not because they didn't want it, but because the flow failed them.",
          "A well-run experiment can give you more actionable learnings than you drew up. The unplanned persona finding – that optimal onboarding step ordering varies by business size – emerged from bringing user context to the data analysis rather than reading the numbers in isolation. Once we had that insight, we treated it as a strategic input: it became the foundation for a future direction around persona-based onboarding flows.",
        ],
        boldPrefixes: [
          "A bad onboarding flow can suppress adoption of a feature users already need.",
          "A well-run experiment can give you more actionable learnings than you drew up.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Annual Subscription Plans
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "annual-plans",
    company: "GlossGenius",
    thumbnail: "/thumb-gg-annual.png",
    title: "Launching Annual Subscriptions",
    oneLineDesc:
      "GlossGenius's subscription infrastructure could only support one billing type, limiting revenue growth and future product strategy. I led a full migration and monetization unlock with zero business interruptions.",
    keyMetric: {
      number: "✓",
      label: "Unlocked AI product roadmap with zero-interruption migration",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A billing infrastructure that was blocking growth",
        body: [
          "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. GlossGenius had one subscription structure: monthly, one price tier per plan, which varied by feature access. As the company matured, this created compounding problems across revenue, customer experience, and product roadmap.",
          "Limiting revenue: there was no cash pull-forward, no annual commitment signal, and new customer pricing hadn't kept pace with the value the product now delivered.",
          "Lackluster customer experience: established businesses often prefer annual billing for accounting ease. Monthly payments were friction for them, not flexibility.",
          "Limiting product roadmap: the infrastructure could only accommodate a single charge type per user. There was no ability to charge for add-ons separately from a subscription tier, meaning future product launches like AI agents to help run your business were architecturally blocked before they started. Any meaningful monetization evolution was impossible without rebuilding the foundation first.",
        ],
        boldPrefixes: [
          "",
          "Limiting revenue:",
          "Lackluster customer experience:",
          "Limiting product roadmap:",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A full infrastructure migration with a careful launch strategy",
        body: [
          "I led the launch of annual subscription plans alongside a price increase for new customers, requiring a full infrastructure migration, cross-functional coordination across product, engineering, finance, and marketing, and a careful launch strategy to protect against activation risk.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Three decisions that shaped the launch",
        body: [
          "The existing infrastructure couldn't support annual billing at all. After confirming there were no engineering shortcuts, I worked with engineering to scope a full migration, defining requirements for the short- and medium-term future state: multiple charge types, new plan tiers, price flexibility, and different billing logic across customer types.",
          "Launching a price increase and a new billing option simultaneously required careful sequencing. We chose to launch to all customers at once rather than a phased rollout. GlossGenius customers are part of tight-knit solopreneur communities and a phased rollout would have created confusion when customers compared notes. The clean rule: subscribe before X date, your price is locked in; sign up after, new pricing applies.",
          "The activation risk needed to be modeled precisely to avoid harming the bottom line. Working with finance and analytics, we modeled the maximum tolerable activation decrease before the price increase became net-negative. That number became the launch guardrail and the primary post-launch decision point.",
        ],
        boldPrefixes: [
          "The existing infrastructure couldn't support annual billing at all.",
          "Launching a price increase and a new billing option simultaneously required careful sequencing.",
          "The activation risk needed to be modeled precisely to avoid harming the bottom line.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Communicating two changes without creating confusion",
        body: [
          "The challenge was communicating two simultaneous changes without creating confusion or triggering price sensitivity among existing subscribers who weren't affected. Key decisions: a clear plan comparison UI making annual vs. monthly value immediately legible, a simplified pricing page, and copy framing the price lock for existing subscribers as reassuring rather than defensive.",
        ],
        images: ["/placeholder-design-a.svg", "/placeholder-design-b.svg"],
        altTexts: [
          "Pricing page before and after redesign — plan comparison UI",
          "Plan selection UI and subscription settings screen",
        ],
        imageWidths: [1200, 1200],
        imageHeights: [750, 750],
      },
      {
        id: "results",
        label: "Results",
        heading: "Exceeded projections with zero disruption",
        body: [
          "In the first month after launch:",
          "✅ Activation held within acceptable thresholds, requiring no corrective pricing action",
          "✅ Zero business interruptions through a full subscription infrastructure migration",
          "📈 Revenue per customer increased (too early for stat sig results)",
          "📈 Annual plan adoption exceeded projections, particularly among existing customers who switched voluntarily, signaling genuine long-term product commitment (too early for stat sig results)",
        ],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Monetization is not always an optimization problem. Sometimes it requires rebuilding the foundation entirely before any meaningful progress is possible. This project was the foundation GlossGenius needs to achieve its growth roadmap.",
          "The other surprise: existing customers adopted annual plans voluntarily without a discount because it genuinely fit how they run their businesses. Your most committed users will often tell you what they want if you give them the option.",
        ],
        boldPrefixes: [
          "Monetization is not always an optimization problem.",
          "The other surprise: existing customers adopted annual plans voluntarily without a discount because it genuinely fit how they run their businesses.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Scheduling Tool for Phone Agents
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "phone-agent-tool",
    company: "Rula Health",
    thumbnail: "/thumb-rula-scheduling.png",
    title: "Scheduling Tool for Phone Agents",
    oneLineDesc:
      "Patients calling their insurer for mental healthcare had no direct path to booking. I built the bridge and it became the most impactful launch in Rula's history.",
    keyMetric: {
      number: "21%",
      label: "patient growth",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "A huge drop-off between intent and a booked appointment",
        body: [
          "Most patients who call their insurance company about mental healthcare leave with a referral list, not an appointment. The drop-off between \"I want help\" and \"I have a booking\" was enormous, and Rula had no presence in that moment at all.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A real-time scheduling tool built for phone agents",
        body: [
          "I built a scheduling tool that lets insurance phone agents book Rula appointments on behalf of members in real time. A patient calls their insurer, asks about mental healthcare, and leaves the call with an appointment booked.",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "Building for speed and scale from day one",
        body: [
          "The interface needed to be a calendar view, but we only had a therapist list. Phone agents need to book quickly while a patient is on the line. Building the calendar UI required an entirely new backend service to surface therapist availability at the speed and volume the tool required.",
          "I built for scale from day one. The tool launched with one insurance partner, but I set requirements that made onboarding additional partners as frictionless as possible. The use case was too common and too valuable to treat as a one-off.",
        ],
        boldPrefixes: [
          "The interface needed to be a calendar view, but we only had a therapist list.",
          "I built for scale from day one.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Purpose-built for speed, not browsing",
        body: [
          "The flow starts with a short intake form that captures the member's state and insurance coverage, pre-filtering everything that follows. The calendar view then shows only bookable slots with therapist filters accessible on the side if the member has specific preferences. The whole interaction is purpose-built for speed on a live call, not patient browsing. The existing therapist list was not scalable for this demand channel for exactly that reason.",
        ],
        images: [
          "/rula-scheduling-1.png",
          "/rula-scheduling-2.png",
          "/rula-scheduling-3.png",
        ],
        altTexts: [
          "Intake form capturing state and insurance coverage before showing calendar slots",
          "Calendar view with side filter panel for therapist preferences",
          "The existing therapist list — built for patient browsing, not agent scheduling",
        ],
        captions: [
          "The intake form captures state and insurance coverage upfront, so every slot shown in the calendar is already confirmed bookable for the member on the call. No dead ends mid-booking.",
          "The calendar view is the primary interface. Filters are accessible on the side for cases where the member requests a specific therapist specialty, gender, or language, but they don't interrupt the default booking flow.",
          "What we didn't use. The existing therapist list was built for patients browsing on their own time, not agents scheduling under pressure. Giving phone agents this format was an effective MVP to prove the channel, but its limitations prevented scaling within and across insurance partners.",
        ],
        imageWidths: [713, 860, 820],
        imageHeights: [1575, 469, 766],
      },
      {
        id: "results",
        label: "Results",
        heading: "The largest feature launch in Rula's history",
        body: [
          "📈 21% patient growth, largest feature launch ever at Rula",
          "📈 66% conversion increase vs. the previous phone agent flow",
        ],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Sometimes the right answer is a new tool, not a modified one. The instinct early on was to adapt what we already had. But the phone agent's job is completely different from a patient's: on a call, under time pressure, scheduling for someone else. Starting from the user's actual context rather than existing patterns led to a better outcome faster.",
        ],
        boldPrefixes: [
          "Sometimes the right answer is a new tool, not a modified one.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Therapist Directory
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "therapist-directory",
    company: "Rula Health",
    thumbnail: "/thumb-rula-directory.png",
    title: "Therapist Directory",
    oneLineDesc:
      "Rula was nearly invisible on Google. I built an SEO-driven directory that turned organic search into a zero-cost acquisition channel from scratch.",
    keyMetric: {
      number: "345%",
      label: "organic patient starts",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "Nearly invisible in the channel that matters most",
        body: [
          "Most people looking for mental healthcare start with a Google search, but Rula was nearly invisible in those results, leaving a huge patient demand channel untapped. Competing for high-volume searches like \"therapist near me\" wasn't realistic. The only viable path was to play a different game.",
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
        heading: "Breadth, speed, and a 30-second load time",
        body: [
          "The strategy was breadth, not depth. Winning the long tail meant creating hundreds of thousands of directory pages, each with customized page-level signals: titles, meta descriptions, and content to build relevance across Google's index at scale.",
          "I scoped for speed. Rather than building net-new infrastructure, I framed the directory as a new front door to what we already had: the recommendation algorithm, therapist filters, profile pages, and sign-up flow. Launch fast, let the index build over time.",
          "A 30-second load time was a hard blocker. Results needed to load on page arrival, not behind a sign-up form and not after a wait. I championed a cross-functional initiative to bring load time under one second and remove the sign-up gate that had previously preceded results.",
        ],
        boldPrefixes: [
          "The strategy was breadth, not depth.",
          "I scoped for speed.",
          "A 30-second load time was a hard blocker.",
        ],
      },
      {
        id: "design",
        label: "Design",
        heading: "Zero friction between search and results",
        body: [
          "A patient searches for the therapy type they need. Google incorporates location automatically in most cases. Results take them directly to a filtered therapist list with no sign-up required. If location is unknown, a lightweight modal collects state and insurance before loading results.",
        ],
        images: [
          "/rula-directory-1.gif",
          "/rula-directory-2.gif",
          "/rula-directory-3.png",
        ],
        altTexts: [
          "Therapist directory search flow — from Google result to filtered therapist list",
          "Directory results page with location and insurance modal",
          "Therapist directory — additional view",
        ],
        imageWidths: [1206, 800, 1350],
        imageHeights: [2622, 1739, 1261],
      },
      {
        id: "results",
        label: "Results",
        heading: "A zero-cost acquisition channel built from scratch",
        body: [
          "📈 0 to 1.7M impressions in search results",
          "📈 290% increase in organic traffic",
          "📈 345% increase in organic patient starts",
          "📈 41% improvement in domain ranking",
        ],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "The most important decision on this project was strategic, not tactical. We could have spent months trying to rank for \"therapist near me\" and gotten nowhere. The insight that changed everything: we didn't need to win the most competitive searches to win the channel. The long tail was wide open, the content needs were well-defined, and the infrastructure already existed. Sometimes the best growth move is finding the game you can actually win.",
        ],
        boldPrefixes: [
          "The most important decision on this project was strategic, not tactical.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. AI as a PM Operating System
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ai-operating-system",
    company: "Personal Practice / GlossGenius",
    thumbnail: "/thumb-gg-payments.png",
    title: "AI as a PM Operating System",
    oneLineDesc:
      "PM work used to require assembling a team for every high-quality output. I rebuilt how I work with AI and now move 10x faster from idea to shareable artifact.",
    keyMetric: {
      number: "10×",
      label: "faster from idea to shareable artifact",
    },
    sections: [
      {
        id: "problem",
        label: "Problem",
        heading: "High-quality PM output required assembling a team",
        body: [
          "For most of my career, high-quality PM output required assembling a team. Design for visuals. Engineering for feasibility. Data for analysis. Even in lean startups, getting the right people aligned consumed hours I didn't have, and the work that required my actual judgment competed constantly with the overhead of getting there.",
          "The bottleneck wasn't effort. It was access.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A personal AI operating system for the parts that matter",
        body: [
          "I started treating Claude as a thought partner and execution accelerator, effectively a senior generalist available at any time. Over time I developed a personal operating system: a set of workflows where AI has fundamentally changed how I work and how much time I spend on the parts of the job that actually matter.",
          "At GlossGenius, I extended this beyond my own practice, deploying Claude Enterprise with cross-functional connectors and AI-assisted workflows spanning product, engineering, and operations.",
          "The stack:",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "What actually changed — and what didn't",
        body: [
          "The biggest unlock was changing how I prompt, not just what I prompt. Treating AI as a collaborator, sharing full context, pushing back on outputs, and asking it to find holes in my thinking changed the quality of what came back entirely.",
          "Deploying Claude Enterprise required more than giving people access. I focused on showing concrete workflows rather than making abstract cases, starting with the highest-friction tasks people already complained about and making the before/after undeniable.",
          "The hardest thing to delegate to AI is cross-functional judgment. Synthesis, drafting, and analysis: AI accelerates all of it. But product decisions, stakeholder reads, and prioritization calls still require a human. Cross-functional coordination is the part of the PM role AI doesn't touch, and arguably makes more important.",
          "Engineering leverage is outpacing PM and design leverage. Small engineering teams now produce dramatically more output with AI. The response isn't to work harder; it's to build a personal operating system that scales your judgment, not just your hours.",
        ],
        boldPrefixes: [
          "The biggest unlock was changing how I prompt, not just what I prompt.",
          "Deploying Claude Enterprise required more than giving people access.",
          "The hardest thing to delegate to AI is cross-functional judgment.",
          "Engineering leverage is outpacing PM and design leverage.",
        ],
      },
      {
        id: "results",
        label: "Results",
        heading: "Eight workflows, fundamentally changed",
        body: [],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "AI has made me better at the parts of the job that matter most by removing the overhead that used to crowd them out. What remains irreplaceable is taste, judgment, and the ability to align people around hard decisions. Having more time for those things is the point. I got into product management because I find it genuinely interesting. AI gave me more of that back.",
        ],
        boldPrefixes: [
          "AI has made me better at the parts of the job that matter most by removing the overhead that used to crowd them out.",
        ],
      },
    ],
    stack: [
      {
        tool: "Claude",
        description:
          "Thought partner, writing, synthesis, strategy, workflow automation. Claude Enterprise at GlossGenius for team-wide deployment.",
      },
      {
        tool: "Granola",
        description: "Automated meeting capture and structured notes.",
      },
      {
        tool: "Superwhisper",
        description: "Voice dictation, removing the gap between thinking and writing.",
      },
      {
        tool: "Devin",
        description: "Coding and personal tool building without an engineering dependency.",
      },
      {
        tool: "Claude Cowork",
        description: "Knowledge work execution and personal productivity automation.",
      },
      {
        tool: "Claude Code",
        description: "Building and iterating on personal projects.",
      },
    ],
    beforeAfterTable: [
      {
        workflow: "Meeting notes and follow-ups",
        before: "Manual note-taking, action items scattered",
        after: "Granola captures and structures automatically",
      },
      {
        workflow: "Data analysis and visualization",
        before: "Waiting on a data partner or hours in spreadsheets",
        after: "First-pass analysis in minutes, more time on interpretation",
      },
      {
        workflow: "Quick mockups and visual feedback",
        before: "Waiting days for design availability",
        after: "Lo-fi mockups fast, feedback loops compressed",
      },
      {
        workflow: "Strategy and research synthesis",
        before: "Hours reading, writing from scratch",
        after: "Rapid synthesis, first draft ready to react to",
      },
      {
        workflow: "Thought partnership",
        before: "Waiting for a 1:1, ideas half-formed",
        after: "Always-available sounding board",
      },
      {
        workflow: "Coding and personal tools",
        before: "No path to building without engineering",
        after: "Claude Code and Devin make it possible to ship tools as a non-technical PM",
      },
    ],
  },
];
