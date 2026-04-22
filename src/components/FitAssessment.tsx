"use client";

import { useReducer } from "react";
import { InlineWidget } from "react-calendly";
import { caseStudies } from "@/content/caseStudies";
import type { CaseStudy } from "@/content/caseStudies";
import styles from "./FitAssessment.module.css";

// ─── Types ───────────────────────────────────────────────────────

type Outcome = "strong" | "possible" | "not";

interface State {
  step: number;
  answers: (number | null)[];
  result: Outcome | null;
}

type Action =
  | { type: "ANSWER"; step: number; choice: number }
  | { type: "BACK"; step: number }
  | { type: "RESTART" };

// ─── Questions ───────────────────────────────────────────────────

const QUESTIONS = [
  {
    q: "What kind of business are you building?",
    options: [
      "B2C (Business to Consumer)",
      "Consumer Marketplace",
      "Consumer Subscription",
      "B2B2C (Business to Business to Consumer)",
      "Something else",
    ],
  },
  {
    q: "Where are you in your growth journey?",
    options: [
      "Pre-launch or very early. Still finding product-market fit.",
      "Found early traction. Now trying to grow it.",
      "Growing but plateaued. Not sure what's blocking us.",
      "Scaling quickly. Need more senior growth horsepower.",
    ],
  },
  {
    q: "What's your biggest growth challenge right now?",
    options: [
      "Acquisition: Getting more people to discover and try the product",
      "Activation: Getting people who try it to actually stick around",
      "Monetization: Converting trials or signups into paying customers",
      "All of the above",
      "Not sure yet. That's part of what we need help figuring out.",
    ],
  },
  {
    q: "Do you have a product team today?",
    options: [
      "Just me (founder-led, no dedicated PM)",
      "One PM or a small team",
      "Engineering team but no dedicated PM",
      "Yes, a full product team",
    ],
  },
  {
    q: "What kind of help are you looking for?",
    options: [
      "Diagnosis: Help figuring out what to focus on",
      "Execution: Someone to do the work you've already identified",
      "Embedded: Full ownership of product growth end-to-end",
      "Not sure yet. Still exploring options.",
    ],
  },
  {
    q: "How quickly do you need to move?",
    options: [
      "Actively looking and want to move in the next few weeks",
      "In the next few months",
      "Just exploring for now",
    ],
  },
];

const NON_CONSUMER_Q1 = 4;
const PRE_LAUNCH_Q2 = 0;
const UNSURE_Q5 = 3;
const EXECUTION_Q5 = 1;
const EMBEDDED_Q5 = 2;

function score(answers: (number | null)[]): Outcome {
  const [q1, q2, , , q5] = answers;
  if (q1 === NON_CONSUMER_Q1) return "not";
  if (q2 === PRE_LAUNCH_Q2) return "not";
  if (q5 === UNSURE_Q5 && q2 === PRE_LAUNCH_Q2) return "not";
  if (
    q1 !== NON_CONSUMER_Q1 &&
    q2 !== null && q2 !== PRE_LAUNCH_Q2 &&
    (q5 === EXECUTION_Q5 || q5 === EMBEDDED_Q5)
  ) return "strong";
  if (q1 !== NON_CONSUMER_Q1 && q2 !== null && q2 !== PRE_LAUNCH_Q2) return "possible";
  return "not";
}

function challengeExplanation(q3Answer: number | null): string {
  if (q3Answer === 0)
    return "You're building a consumer business that has traction but needs more people finding and trying it. That's exactly where I've driven the most impact — building acquisition programs that actually move the needle.";
  if (q3Answer === 1)
    return "You have people trying the product but they're not sticking. Activation is often the highest-leverage growth problem at your stage — and it's where I've done my most quantified work.";
  if (q3Answer === 2)
    return "You're leaving revenue on the table between trial and conversion. I've driven significant monetization impact at companies like GlossGenius — this is a well-defined problem with a clear playbook.";
  if (q3Answer === 3)
    return "Growth feels stuck across the board — that's actually a good diagnostic starting point. Multi-area stalls usually have a single highest-leverage unlock hiding underneath.";
  return "The growth problem isn't fully defined yet — which is actually the right time to bring in a diagnostic eye. A focused sprint to figure out what's actually blocking growth is often more valuable than jumping straight to execution.";
}

function relevantStudies(answers: (number | null)[], outcome: Outcome): CaseStudy[] {
  if (outcome === "not") return [];
  const q3 = answers[2];
  const byId = (id: string) => caseStudies.find(s => s.id === id)!;
  if (q3 === 1) return [byId("gg-payments")];
  if (q3 === 0) return [byId("rula-scheduling"), byId("rula-directory")];
  if (q3 === 2) return [byId("gg-payments"), byId("gg-annual")];
  return [byId("gg-payments"), byId("rula-directory")];
}

// ─── Reducer ─────────────────────────────────────────────────────

const initialState: State = { step: 0, answers: Array(6).fill(null), result: null };

function reducer(state: State, action: Action): State {
  if (action.type === "RESTART") return initialState;

  if (action.type === "BACK") {
    return { ...state, step: Math.max(0, action.step - 1) };
  }

  if (action.type === "ANSWER") {
    const answers = [...state.answers];
    answers[action.step] = action.choice;
    for (let i = action.step + 1; i < answers.length; i++) {
      answers[i] = null;
    }
    if (action.step === 4) {
      const provisional = score(answers);
      if (provisional === "not") return { ...state, answers, step: 6, result: "not" };
      return { ...state, answers, step: 5 };
    }
    if (action.step === 5) {
      return { ...state, answers, step: 6, result: score(answers) };
    }
    return { ...state, answers, step: action.step + 1 };
  }

  return state;
}

// ─── Component ───────────────────────────────────────────────────

export default function FitAssessment() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, answers, result } = state;

  const totalVisibleSteps = result === "not" ? 5 : 6;
  const currentStep = Math.min(step, totalVisibleSteps);

  return (
    <section id="fit" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Should We Work Together?</h2>
          <p className={styles.subhead}>
            Answer a few quick questions about your business. I&apos;ll tell you
            whether we could be a good fit and point you to relevant case studies.
          </p>
        </div>

        <div className={styles.assessment}>
          {result !== null ? (
            <ResultView
              outcome={result}
              answers={answers}
              onRestart={() => dispatch({ type: "RESTART" })}
            />
          ) : (
            <QuestionView
              key={step}
              step={step}
              currentStep={currentStep}
              totalSteps={totalVisibleSteps}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Question View ────────────────────────────────────────────────

interface QuestionViewProps {
  step: number;
  currentStep: number;
  totalSteps: number;
  dispatch: (a: Action) => void;
}

function QuestionView({ step, currentStep, totalSteps, dispatch }: QuestionViewProps) {
  const q = QUESTIONS[step];
  const isFirst = step === 0;

  return (
    <div className={styles.questionCard}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <p className={styles.progressLabel}>
        {currentStep + 1} of {totalSteps}
      </p>

      <h3 className={styles.question}>{q.q}</h3>

      <ul className={styles.options}>
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              className={styles.option}
              onClick={() => dispatch({ type: "ANSWER", step, choice: i })}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      {!isFirst && (
        <div className={styles.navRow}>
          <button
            className={styles.navBtn}
            onClick={() => dispatch({ type: "BACK", step })}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Anchor mapping: old caseStudy IDs → new Work section anchors ──

const ANCHOR_MAP: Record<string, string> = {
  "gg-payments":     "payments-onboarding",
  "gg-annual":       "annual-plans",
  "rula-scheduling": "phone-agent-tool",
  "rula-directory":  "therapist-directory",
  "ai-pm-os":        "ai-operating-system",
};

// ─── Inline Case Study (results page) ────────────────────────────

function InlineCaseStudy({ study }: { study: CaseStudy }) {
  const anchor = ANCHOR_MAP[study.id] ?? study.id;
  return (
    <a href={`#${anchor}`} className={styles.inlineStudy}>
      <span className={styles.inlineCompany}>{study.company}</span>
      <h4 className={styles.inlineTitle}>{study.title}</h4>
      <p className={styles.inlineDesc}>{study.description}</p>
      <div className={styles.inlineMetricRow}>
        <span className={styles.inlineMetricPrefix}>Key Result:</span>
        <span className={styles.inlineMetricNumber}>{study.metric}</span>
        <span className={styles.inlineMetricLabel}>{study.metricLabel}</span>
      </div>
      <span className={styles.inlineStudyCta}>View case study →</span>
    </a>
  );
}

// ─── Result View ──────────────────────────────────────────────────

interface ResultViewProps {
  outcome: Outcome;
  answers: (number | null)[];
  onRestart: () => void;
}

function ResultView({ outcome, answers, onRestart }: ResultViewProps) {
  const studies = relevantStudies(answers, outcome);
  const explanation = challengeExplanation(answers[2]);
  const CALENDLY_URL = "https://calendly.com/laura-harris-pm";

  return (
    <div className={styles.result}>
      {outcome === "strong" && (
        <>
          <h3 className={styles.resultHeading}>Sounds like a strong fit.</h3>
          <p className={styles.resultBody}>{explanation}</p>
          <p className={styles.resultBody}>
            <strong>Suggested engagement:</strong>{" "}Execution sprint to start, 4 to 6 weeks, scoped to your specific challenge. Most sprint clients continue to a retainer once we&apos;ve established context and momentum.
          </p>
        </>
      )}

      {outcome === "possible" && (
        <>
          <h3 className={styles.resultHeading}>Possibly a good fit — let&apos;s find out.</h3>
          <p className={styles.resultBody}>
            You&apos;re at an early stage where the growth problem isn&apos;t fully defined yet, which is actually the right time to bring in a diagnostic eye. A focused sprint to figure out what&apos;s actually blocking growth is often more valuable than jumping straight to execution.
          </p>
          <p className={styles.resultBody}>
            <strong>Suggested engagement:</strong>{" "}Diagnostic sprint, start with the problem before the solution.
          </p>
        </>
      )}

      {outcome === "not" && (
        <>
          <h3 className={styles.resultHeading}>Probably not the right fit, at least right now.</h3>
          <p className={styles.resultBody}>
            My work is most impactful at companies that have found product-market fit and are working on <em>growing</em> it, not building it. If you&apos;re still finding PMF, the highest-leverage work right now is likely product and customer discovery, not growth optimization. When you&apos;re ready to grow, come back.
          </p>
        </>
      )}

      {studies.length > 0 && (
        <div className={styles.studyLinks}>
          <p className={styles.studyLinksLabel}>
            Here&apos;s some of my past work that relates to your business:
          </p>
          <div className={styles.studyList}>
            {studies.map((s) => (
              <InlineCaseStudy key={s.id} study={s} />
            ))}
          </div>
        </div>
      )}

      {outcome !== "not" && (
        <div className={styles.calendlyWrap}>
          <p className={styles.calendlyLabel}>Book a 30-minute scoping call:</p>
          <InlineWidget
            url={CALENDLY_URL}
            styles={{ minWidth: "100%", height: "700px" }}
            pageSettings={{
              primaryColor: "2E2820",
              textColor: "2E2820",
              backgroundColor: "FAF9F6",
            }}
          />
        </div>
      )}

      <button className={styles.restart} onClick={onRestart}>
        Start over
      </button>
    </div>
  );
}
