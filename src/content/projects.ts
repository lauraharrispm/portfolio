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
  /** Optional company stage shown in hero band metadata line */
  fundingStage?: string;
  /** Optional employee range shown in hero band metadata line */
  employeeRange?: string;
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
      "A broken onboarding flow was limiting adoption of one of GlossGenius's most valuable features. An iterative experimentation program fixed it.",
    keyMetric: {
      number: "80%",
      label: "onboarding completion lift",
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
          "Payments onboarding flow redesign — value statement, progress bar, and native Stripe verification",
        ],
        imageWidths: [1717],
        imageHeights: [1021],
      },
      {
        id: "results",
        label: "Results",
        heading: "Measurable impact across the funnel",
        body: [
          "📈 80% increase in payments processing onboarding completion rate",
          "📈 Seven-figure GPV impact as more businesses began processing payments",
          "📈 3% lift in subscription activations, validating that payments setup increased the perceived value of a GlossGenius subscription",
        ],
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
  // 2. Annual Subscription Plans
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "annual-plans",
    company: "GlossGenius",
    thumbnail: "/thumb-gg-annual.png",
    title: "Launching Annual Subscriptions",
    oneLineDesc:
      "GlossGenius's subscription infrastructure could only support one billing structure, limiting revenue growth and future product strategy. I led a full migration to a flexible subscription service with zero business interruptions.",
    keyMetric: {
      number: "✓",
      label: "Unlocked AI product roadmap with zero-interruption migration",
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
          "Website pricing page positioning annual subscriptions as a discount for prospective subscribers",
          "Annual subscription awareness message for monthly subscribers",
          "View plans modal for logged in subscribers",
        ],
        captions: [
          "Website pricing page for prospective subscribers positions annual subscriptions as a discount.",
          "Annual subscription awareness message for monthly subscribers who receive a discount on annual subscriptions.",
          '"View plans" modal for logged in subscribers who receive a discount on annual subscriptions.',
        ],
        imageWidths: [1601, 960, 550],
        imageHeights: [1163, 473, 316],
      },
      {
        id: "results",
        label: "Results",
        heading: "Exceeded projections with zero disruption",
        body: [
          "In the first month after launch:",
          "✅ Activation held within acceptable thresholds, requiring no corrective pricing action",
          "✅ Zero business interruptions through a full subscription infrastructure migration",
          "📈 Revenue per customer increased multiple percentage points (early directional signal; not yet statistically significant)",
          "📈 Annual plan adoption exceeded projections, with strong voluntary uptake from existing customers, signaling real long-term commitment (early directional signal; not yet statistically significant)",
        ],
      },
      {
        id: "reflection",
        label: "Reflection",
        heading: "What this project taught me",
        body: [
          "Monetization isn't always an optimization problem. Sometimes it requires rebuilding the foundation before meaningful progress is possible. This project laid that foundation for GlossGenius's growth roadmap, making the significant engineering investment well worth it.",
          "Work driven by business goals can also serve the customer if you look for the overlap. While overhauling subscription infrastructure was prioritized for monetization and roadmap needs, customer support data made it clear that annual billing was a real benefit for larger businesses. We leaned into that in our positioning, and customers adopted annual plans without discounts because it matched how they operate.",
        ],
        boldPrefixes: [
          "Monetization isn't always an optimization problem.",
          "Work driven by business goals can also serve the customer if you look for the overlap.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. AI as a PM Operating System
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ai-operating-system",
    company: "Personal Practice",
    thumbnail: "/thumb-gg-payments.png",
    title: "AI as a PM Operating System",
    oneLineDesc:
      "10× faster from idea to shareable artifact using Claude and complementary tools.",
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
          "For most of my career, high-quality PM output required a high-functioning full team: design, engineering, data, marketing, and more. Even in the most efficient of lean startups, the meaty work that required my judgment competed constantly with the overhead of getting things done.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        heading: "A personal AI operating system for the parts that matter",
        body: [
          "I started treating Claude as a thought partner and execution accelerator, effectively a senior generalist available at any time. Over time I developed a personal operating system: a set of workflows where AI has fundamentally changed how I work and how much time I spend on the parts of the job that actually matter.",
          "At GlossGenius, I extended this beyond my own practice, deploying Claude Enterprise with cross-functional connectors and AI-assisted workflows spanning product, engineering, and operations.",
          "My stack:",
        ],
      },
      {
        id: "challenges",
        label: "Key Challenges",
        heading: "What actually changed — and what didn't",
        body: [
          "How I prompt is as important as what I prompt. Treating AI as a collaborator, sharing full context, pushing back on outputs, and asking it to find holes in my thinking improves output quality tremendously.",
          "Deploying Claude Enterprise required more than giving people access. I focused on showing concrete workflows rather than making abstract cases, starting with the highest-friction tasks people already complained about and making the before/after undeniable.",
          "The hardest thing to delegate to AI is cross-functional judgment. It's great at synthesis, drafting, and analysis. But product decisions, stakeholder reads, and prioritization calls still require a human. I use AI to assist this process rather than replace it.",
          "Engineering leverage is outpacing PM and design leverage. Small engineering teams now produce dramatically more output with AI. The response isn't to work harder; it's to build a personal operating system that scales your judgment, not just your hours.",
        ],
        boldPrefixes: [
          "How I prompt is as important as what I prompt.",
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
          "The lines between product, design, and engineering are blurring. I think that's a good thing. AI doesn't replace the depth of expertise that comes from years of practicing a discipline. What it does is give each function more agency in the others' territory. For example, I built this entire portfolio with Claude Code in a few days. I could not have built anything like it on my own two years ago. This changes how I show up as a PM: I can prototype instead of only spec, launch an experiment on my own, and bring more informed judgment to design and engineering conversations because I'm closer to the work. These shifts help us all get more out of every hour the team has.",
        ],
        boldPrefixes: [
          "The lines between product, design, and engineering are blurring.",
        ],
      },
    ],
    stack: [
      {
        tool: "Claude:",
        description:
          "Thought partner, writing, synthesis, strategy, workflow automation. Claude Enterprise at GlossGenius for team-wide deployment.",
      },
      {
        tool: "Claude Cowork:",
        description: "Knowledge work execution and personal productivity automation.",
      },
      {
        tool: "Claude Design:",
        description: "Visual ideation, design iteration, and rapid prototyping.",
      },
      {
        tool: "Claude Code:",
        description: "Building and iterating on personal projects.",
      },
      {
        tool: "Fellow, Granola:",
        description: "Automated meeting capture and structured notes.",
      },
      {
        tool: "Superwhisper:",
        description: "Voice dictation, removing the gap between thinking and writing.",
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

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Scheduling Tool for Phone Agents
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "phone-agent-tool",
    company: "Rula Health",
    thumbnail: "/thumb-rula-scheduling.png",
    title: "Scheduling Tool for Phone Agents",
    oneLineDesc:
      "Patients calling their insurer for mental healthcare had no direct path to booking an appointment. I built the bridge and it became the most impactful feature launch in Rula's history.",
    keyMetric: {
      number: "21%",
      label: "patient growth",
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
          "We made deliberate scope tradeoffs with scale in mind. We could have launched faster for a single payer, but that would have limited how quickly the scheduling tool could expand across all payers we partnered with. Given strong MVP traction and clear relevance across existing and prospective partners, I included the additional scope needed to scale from the start. That investment paid off, enabling fast adoption across partners and making it the biggest launch in Rula history.",
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
          "The existing therapist list — built for patient browsing, not agent scheduling",
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
        heading: "The largest feature launch in Rula's history",
        body: [
          "📈 21% patient growth (largest feature launch ever at Rula)",
          "📈 66% conversion increase vs. the previous phone agent flow",
        ],
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
  // 5. Therapist Directory
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "therapist-directory",
    company: "Rula Health",
    thumbnail: "/thumb-rula-directory.png",
    title: "Therapist Directory",
    oneLineDesc:
      "345% lift in organic patient starts from an SEO-driven therapist directory targeting long-tail searches.",
    keyMetric: {
      number: "345%",
      label: "organic patient starts",
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
        heading: "Breadth, speed, and a 30-second load time",
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
          "Therapist directory search flow — from Google result to filtered therapist list",
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
          "The most important decision on this project was strategic, not tactical. We could have spent months trying to rank for \"therapist near me\" and gotten nowhere. The insight that changed everything: we didn't need to win the most competitive searches to win the channel. The long tail was wide open, the content needs were well-defined, and we already had most of the infrastructure we needed to build the right content. Sometimes the best growth move is finding the game you can actually win.",
          "Infrastructure investments can pay off cross-functionally – if someone connects the dots. The load-time fix was built for the directory, but I looked across teams for ways to compound the value beyond the original scope. As a result, this work also improved the existing sign-up flow, boosting booking conversion for the majority of traffic by multiple percentage points.",
        ],
        boldPrefixes: [
          "The most important decision on this project was strategic, not tactical.",
          "Infrastructure investments can pay off cross-functionally – if someone connects the dots.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Burrow — Growing a DTC Ecommerce Site to 4x Revenue
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "burrow-growth",
    company: "Burrow",
    thumbnail: "/burrow-3.png",
    title: "Growing an Ecommerce Site to 4x Revenue",
    oneLineDesc:
      "4x revenue growth through navigation restructuring and promotions optimization.",
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
          "📈 4x revenue growth during this period",
          "📈 +41% increase in add-to-cart rate and +9% increase in average order value following improvements to the promotions experience",
          "📈 Highest revenue day in company history within one week of launching in-stock messaging",
        ],
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
