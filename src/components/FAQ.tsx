import styles from "./FAQ.module.css";

const questions = [
  {
    question: "What does a fractional product manager do?",
    answer: "A fractional product manager does the job of a head of product, part-time (1 to 3 days a week). I run the roadmap with you, work directly with your team, and ship growth work from idea to launch.",
  },
  {
    question: "How do I know I need a fractional product manager?",
    answer: "You probably need one if you have a dev team but not enough product strategy: every decision waits on you, engineers write their own specs, or the roadmap follows whoever you talked to last.",
  },
  {
    question: "Is my startup a good fit?",
    answer: "I work primarily with seed to Series B consumer and marketplace startups that have more growth potential than time to chase it. I love working with people who are quick, considerate, and curious.",
  },
  {
    question: "Do I need a product manager or a CTO?",
    answer: "A product manager decides what to build and why. A CTO decides how to build it. If your engineers ship well but the work isn't moving growth, you need someone to decide what's worth building.",
  },
  {
    question: "How does a fractional engagement work?",
    answer: "I work 1 to 3 days a week, usually for at least 2 months. For a fixed project scope, we probably wrap in under 2 months.",
  },
  {
    question: "Is a fractional product manager cheaper than a full-time hire?",
    answer: "Yes, by a lot. A full-time head of product costs far more once you add salary, equity, benefits, and recruiting. If you need me 4+ days a week, it's probably time to hire, and I can help with that when you get there.",
  },
  {
    question: "We're hiring a full-time PM. Can you help in the meantime?",
    answer: "Yes, and it's often the best time for me to jump in. I ship work that moves your numbers while you search, and your full-time PM starts with momentum and the context to make the roadmap their own.",
  },
  {
    question: "How do you use AI in product work?",
    answer: "I love using AI for the digging: data queries, edge cases, and prototypes in your design system. The judgment calls stay with me, since AI can be wrong even when it sounds right. And your privacy rules, HIPAA included, are baked in from the first chat.",
  },
  {
    question: "What happens when the engagement ends?",
    answer: "I document everything as we go, and you keep it all: the roadmap, specs, analytics, and a team that knows how to run it without me.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={`container ${styles.inner}`}>
        <h2 id="faq-heading" className={styles.heading}>FAQ</h2>
        <div className={styles.questions}>
          {questions.map(({ question, answer }) => (
            <details key={question} className={styles.item}>
              <summary className={styles.question}>
                <span>{question}</span>
                <svg className={styles.plus} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className={styles.answer}>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
