export interface CaseStudy {
  id: string;
  company: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  /** Optional real image path (in /public) — takes priority over color block */
  thumbnailImage?: string;
  /** CSS background color for the branded thumbnail block */
  thumbnailBg: string;
  /** Large text shown on the branded thumbnail */
  thumbnailStat: string;
  thumbnailStatColor: string;
  problem: string;
  solution: string;
  results: string[];
  challenges: string[];
  design: string;
  reflection: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "gg-payments",
    company: "GlossGenius",
    title: "Redesigning Payments Onboarding",
    thumbnailImage: "/thumb-gg-payments.png",
    description:
      "A broken onboarding flow was limiting growth from one of GlossGenius's most valuable revenue streams. An iterative experimentation program fixed it.",
    metric: "80%",
    metricLabel: "increase in payments onboarding completion rate",
    thumbnailBg: "#F07052",
    thumbnailStat: "80%",
    thumbnailStatColor: "#ffffff",
    problem:
      "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. Payments processing is one of its most valuable features: users who process payments generate significantly more revenue and are measurably more likely to remain subscribers. Most GlossGenius users could benefit from it, but most hadn't set it up.\n\nThe onboarding flow was broken in two compounding ways:\n\nThe value proposition was hidden. There was no clear answer to \u201cwhy should I do this, and why right now?\u201d Without a reason to continue, the flow was a dead end.\n\nIt was hard to get through even for motivated users. The flow lacked clear steps and context, including an externally-managed Stripe identity verification step that felt foreign: a jarring light-mode interface inside a dark-mode app, opening in an external browser without context explaining why users were being asked to share sensitive personal information.",
    solution:
      "I redesigned the flow through an iterative experimentation program, sequencing experiments by expected impact, resources required, and user experience to maximize learning and momentum. Two principles guided every decision:\n\nMake the value unmistakable before asking for effort. We led with a clear value statement so users understood why payments processing was worth setting up before they started.\n\nRemove friction that creates confusion and add friction that builds confidence. We added a persistent progress bar and more instructional content to guide users through a complex flow. We transformed the Stripe verification step to feel native: matching dark mode, applying brand styles, and rewriting copy to be clearer and more reassuring.",
    results: [
      "📈 80% increase in payments onboarding completion rate",
      "📈 Seven-figure GPV impact as more businesses began actively processing payments",
      "📈 3% lift in subscription activations, validating that payments setup increased the perceived value of a GlossGenius subscription",
    ],
    challenges: [
      "We had informed hypotheses but needed data to prove them. Each experiment was designed to get a confident answer: learn, iterate, launch, repeat.",
      "Running experiments across mobile, web, and multiple entry points added complexity. Funnel performance varied significantly by entry point, requiring precision in how we defined success and ensuring no conflicting experiences ran simultaneously.",
      "The persona finding emerged mid-experiment and reshaped the strategy. Established businesses responded well to payments-first flows; newer businesses needed to demonstrate value through service creation first. This came from the data, not the hypothesis, and pointed toward persona-based onboarding as the right next direction.",
    ],
    design:
      "Friction in onboarding has a bad reputation, but the goal was never fewer clicks. It was the right clicks. When stakes are high and users need to trust a flow before they'll complete it, removing steps can create more confusion than confidence. Users were being asked to verify their identity, connect a bank account, and commit to a new revenue stream. Rushing them through it didn't help.\n\nWe led with a value statement, added a persistent progress bar, rewrote instructional copy, and transformed the Stripe verification experience by matching GlossGenius's branding. The result felt native and trustworthy rather than foreign and unclear.",
    reflection:
      "A bad onboarding flow can suppress adoption of a feature users already need. Most GlossGenius subscribers hadn't set up payments not because they didn't want it, but because the flow failed them.\n\nA well-run experiment can give you more learnings than you drew up. The persona finding from the data was a pleasant surprise, presenting an opportunity for branding user flows by persona in the future.",
  },
  {
    id: "gg-annual",
    company: "GlossGenius",
    title: "Launching Annual Subscription Plans",
    thumbnailImage: "/thumb-gg-annual.png",
    description:
      "GlossGenius's subscription infrastructure could only support one billing type, limiting revenue growth and future product strategy. I led a full migration and monetization unlock with zero business interruptions.",
    metric: "0 → Annual",
    metricLabel: "plans launched",
    thumbnailBg: "#FAD5C8",
    thumbnailStat: "0→\nAnnual",
    thumbnailStatColor: "#2E2820",
    problem:
      "GlossGenius provides a booking and business management platform for beauty and wellness entrepreneurs. GlossGenius had one subscription structure: monthly, one price tier per plan, which varied by feature access. As the company matured, this created compounding problems across revenue, customer experience, and product roadmap.\n\nLimiting revenue: there was no cash pull-forward, no annual commitment signal, and new customer pricing hadn't kept pace with the value the product now delivered.\n\nLackluster customer experience: established businesses often prefer annual billing for accounting ease. Monthly payments were friction for them, not flexibility.\n\nLimiting product roadmap: the infrastructure could only accommodate a single charge type per user. There was no ability to charge for add-ons separately from a subscription tier, meaning future product launches like AI agents to help run your business were architecturally blocked before they started. Any meaningful monetization evolution was impossible without rebuilding the foundation first.",
    solution:
      "I led the launch of annual subscription plans alongside a price increase for new customers, requiring a full infrastructure migration, cross-functional coordination across product, engineering, finance, and marketing, and a careful launch strategy to protect against activation risk.",
    results: [
      "📈 Annual plan adoption exceeded projections, particularly among existing customers who switched voluntarily, signaling genuine long-term product commitment",
      "📈 Revenue per customer increased",
      "✅ Activation held within acceptable thresholds, requiring no corrective action",
      "✅ Zero business interruptions through a full subscription infrastructure migration",
    ],
    challenges: [
      "The existing infrastructure couldn't support annual billing at all. After confirming there were no engineering shortcuts, I worked with engineering to scope a full migration, defining requirements for the short- and medium-term future state: multiple charge types, new plan tiers, price flexibility, and different billing logic across customer types.",
      "Launching a price increase and a new billing option simultaneously required careful sequencing. We chose to launch to all customers at once rather than a phased rollout. GlossGenius customers are part of tight-knit solopreneur communities and a phased rollout would have created confusion when customers compared notes. The clean rule: subscribe before X date, your price is locked in; sign up after, new pricing applies.",
      "The activation risk needed to be modeled precisely. Working with finance and analytics, we modeled the maximum tolerable activation decrease before the price increase became net-negative. That number became the launch guardrail and the primary post-launch decision point.",
    ],
    design:
      "The challenge was communicating two simultaneous changes without creating confusion or triggering price sensitivity among existing subscribers who weren't affected. Key decisions: a clear plan comparison UI making annual vs. monthly value immediately legible, a simplified pricing page, and copy framing the price lock for existing subscribers as reassuring rather than defensive.",
    reflection:
      "Monetization is not always an optimization problem. Sometimes it requires rebuilding the foundation entirely before any meaningful progress is possible. This project was the foundation GlossGenius needs to achieve its growth roadmap.\n\nThe other surprise: existing customers adopted annual plans voluntarily without a discount because it genuinely fit how they run their businesses. Your most committed users will often tell you what they want if you give them the option.",
  },
  {
    id: "rula-scheduling",
    company: "Rula Health",
    title: "Scheduling Tool for Phone Agents",
    thumbnailImage: "/thumb-rula-scheduling.png",
    description:
      "Patients calling their insurer for mental healthcare had no direct path to booking. I built the bridge, and it became the most impactful launch in Rula's history.",
    metric: "21%",
    metricLabel: "patient growth (largest feature launch ever at Rula)",
    thumbnailBg: "#FAF9F6",
    thumbnailStat: "21%",
    thumbnailStatColor: "#F07052",
    problem:
      "Most patients who call their insurance company about mental healthcare leave with a referral list, not an appointment. The drop-off between \u201cI want help\u201d and \u201cI have a booking\u201d was enormous, and Rula had no presence in that moment at all.",
    solution:
      "I built a scheduling tool that lets insurance phone agents book Rula appointments on behalf of members in real time. A patient calls their insurer, asks about mental healthcare, and leaves the call with an appointment booked. It became the most impactful feature launch in Rula's history.",
    results: [
      "📈 21% patient growth, the largest feature launch ever at Rula",
      "📈 66% conversion increase vs. the previous phone agent flow",
    ],
    challenges: [
      "The interface needed to be a calendar view, but we only had a therapist list. Phone agents need to book quickly while a patient is on the line. Building the calendar UI required an entirely new backend service to surface therapist availability at the volume and speed the tool required.",
      "I built for scale from day one. The tool launched with one insurance partner, but I set requirements that made onboarding additional partners as frictionless as possible. The use case was too common and too valuable to treat as a one-off.",
    ],
    design:
      "The calendar UI lets agents quickly find available appointments and filter by therapist gender, language, and therapy method, purpose-built for speed and scheduling rather than patient browsing. The existing therapist list would have failed here: it was optimized for patients exploring on their own time, not agents scheduling under pressure.",
    reflection:
      "The instinct early on was to adapt what we already had. But the phone agent's job is completely different from a patient's: they're on a call, under time pressure, scheduling for someone else. Starting from the user's actual context rather than existing patterns led to a better outcome faster. Sometimes the right answer is a new tool, not a modified one.",
  },
  {
    id: "rula-directory",
    company: "Rula Health",
    title: "Therapist Directory",
    thumbnailImage: "/thumb-rula-directory.png",
    description:
      "Rula was nearly invisible on Google. I built an SEO-driven directory that turned organic search into a zero-cost acquisition channel from scratch.",
    metric: "345%",
    metricLabel: "increase in organic patient starts",
    thumbnailBg: "#FAD5C8",
    thumbnailStat: "345%",
    thumbnailStatColor: "#2E2820",
    problem:
      "Most people looking for mental healthcare start with a Google search, but Rula was nearly invisible in those results. Competing for high-volume searches like \u201ctherapist near me\u201d wasn't realistic. The only viable path was to play a different game.",
    solution:
      "I spearheaded an SEO-driven therapist directory targeting the long tail of therapy searches: \u201cADHD therapists near me,\u201d \u201cgrief therapy Texas,\u201d hundreds of thousands of indexed pages designed to bring prospective patients to Rula directly from search.",
    results: [
      "📈 0 to 1.7M impressions in search results",
      "📈 290% increase in organic traffic",
      "📈 345% increase in organic patient starts",
      "📈 41% improvement in domain ranking",
    ],
    challenges: [
      "The strategy was breadth, not depth. Winning the long tail meant creating hundreds of thousands of directory pages, each with customized page-level signals: titles, meta descriptions, and content to build relevance across Google's index at scale.",
      "I scoped for speed. Rather than building net-new infrastructure, I framed the directory as a new front door to what we already had: the recommendation algorithm, therapist filters, profile pages, and sign-up flow. Launch fast, let the index build over time.",
      "A 30-second load time was a hard blocker. Results needed to load on page arrival, not behind a sign-up form and not after a wait. I championed a cross-functional initiative to bring load time under one second and remove the sign-up gate that had previously preceded results.",
    ],
    design:
      "A patient searches for the therapy type they need. Google incorporates location automatically in most cases. Results take them directly to a filtered therapist list with no sign-up required. If location is unknown, a lightweight modal collects state and insurance before loading results.",
    reflection:
      "The most important decision on this project was strategic, not tactical. We could have spent months trying to rank for \u201ctherapist near me\u201d and gotten nowhere. The insight that changed everything: we didn't need to win the most competitive searches to win the channel. The long tail was wide open, the content needs were well-defined, and the infrastructure already existed. Sometimes the best growth move is finding the game you can actually win.",
  },
  {
    id: "ai-pm-os",
    company: "Personal Practice / GlossGenius",
    title: "AI as a PM Operating System",
    description:
      "PM work used to require assembling a team for every high-quality output. I rebuilt how I work with AI and now move 10x faster from idea to shareable artifact.",
    metric: "10×",
    metricLabel: "faster to shareable artifact",
    thumbnailBg: "#2E2820",
    thumbnailStat: "10×",
    thumbnailStatColor: "#F07052",
    problem:
      "For most of my career, high-quality PM output required assembling a team. Design for visuals. Engineering for feasibility. Data for analysis. Even in lean startups, getting the right people aligned consumed hours I didn't have, and the work that required my actual judgment was perpetually competing with the overhead of getting there.\n\nThe bottleneck wasn't effort. It was access.",
    solution:
      "I started treating Claude as a thought partner and execution accelerator: a brilliant generalist on call at all times. Over time I developed a personal operating system, a set of workflows where AI has fundamentally changed how I work and how much time I spend on the parts of the job that actually matter.\n\nAt GlossGenius, I extended this beyond my own practice, deploying Claude Enterprise with cross-functional connectors and AI-assisted workflows spanning product, engineering, and operations.",
    results: [
      "📝 Meeting notes and follow-ups: from manual note-taking to Granola capturing and structuring automatically",
      "📊 Data analysis: from waiting on a data partner or hours in spreadsheets to first-pass analysis in minutes",
      "🖼️ Quick mockups: from waiting days for design availability to lo-fi mockups fast with compressed feedback loops",
      "🔍 Strategy and research synthesis: from hours reading and writing from scratch to rapid synthesis with a first draft ready to react to",
      "✉️ Stakeholder communication: from drafting from blank to first drafts in my voice, with more energy for the thinking behind it",
      "🛠️ Coding and personal tools: from no path to building without engineering to shipping tools as a non-technical PM",
    ],
    challenges: [
      "The biggest unlock was changing how I prompt, not just what I prompt. Treating AI as a collaborator, sharing full context, pushing back on outputs, asking it to find holes in my thinking, changed the quality of what came back entirely.",
      "Deploying Claude Enterprise required more than giving people access. I focused on showing concrete workflows rather than making abstract cases, starting with the highest-friction tasks people already complained about and making the before/after undeniable.",
      "The hardest thing to delegate to AI is cross-functional judgment. Synthesis, drafting, and analysis: AI accelerates all of it. But the actual product decisions, stakeholder reads, and prioritization calls still require a human.",
      "Engineering leverage is outpacing PM and design leverage. Small engineering teams now produce dramatically more output with AI. The response isn't to work harder; it's to build a personal operating system that scales your judgment, not just your hours.",
    ],
    design:
      "My stack: Claude for thought partnership, writing, synthesis, strategy, and workflow automation (Claude Enterprise at GlossGenius for team-wide deployment). Granola for automated meeting capture and structured notes. Superwhisper for voice dictation, removing friction between thinking and writing. Devin for coding and personal tool building without an engineering dependency.",
    reflection:
      "AI has made me better at the parts of the job that matter most by removing the overhead that used to crowd them out. What remains irreplaceable is taste, judgment, and the ability to align people around hard decisions, and having more time for those things is the point. I got into product management because I find it genuinely interesting. AI gave me more of that back.",
  },
];
