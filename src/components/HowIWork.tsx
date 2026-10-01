"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import ToolsStrip from "./ToolsStrip";
import styles from "./HowIWork.module.css";

interface ComparisonRow {
  label: string;
  fractional: ReactNode;
  projectBased: ReactNode;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Best for",
    fractional: "Several growth opportunities with no owner and engineers ready to build",
    projectBased: "One prioritized growth opportunity with fixed scope and cost",
  },
  {
    label: "What you get",
    fractional:
      "I own product strategy, the roadmap, design leadership, and engineering alignment.",
    projectBased: "One project taken from diagnosis to launch",
  },
  {
    label: "Scope",
    fractional: "Flexible. Shifts to whatever matters most right now",
    projectBased: "Fixed. Problem, deliverables, and timeline agreed up front",
  },
  {
    label: "Duration",
    fractional: "Usually 2 months or more",
    projectBased: "Usually under 2 months",
  },
  {
    label: "Cadence",
    fractional: "1 to 3 days a week",
    projectBased: "1 to 3 days a week",
  },
  {
    label: "How we start",
    fractional:
      "Align on business goals, diagnose the biggest product bottlenecks, and set priorities with your team.",
    projectBased:
      "Agree on the target outcome, identify the main friction, and take one solution through launch.",
  },
];

interface Format {
  key: "fractional" | "project-based";
  name: string;
  pill: string;
}

const FORMATS: Format[] = [
  { key: "fractional", name: "Fractional", pill: "Ongoing ownership" },
  { key: "project-based", name: "Project-Based", pill: "Defined outcome" },
];

// ── AI-native panel icons: plain inline SVG, no icon library needed ──
function AIIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--coral)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.aiIcon}
    >
      {children}
    </svg>
  );
}

function TargetIcon() {
  return (
    <AIIcon>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </AIIcon>
  );
}

function BoltIcon() {
  return (
    <AIIcon>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </AIIcon>
  );
}

function PeopleIcon() {
  return (
    <AIIcon>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M16 14.2c2.8.3 5 2.6 5 5.8" />
    </AIIcon>
  );
}

interface AIItem {
  icon: ReactNode;
  title: string;
  description: string;
}

const AI_ITEMS: AIItem[] = [
  {
    icon: <TargetIcon />,
    title: "Choose the right problem.",
    description:
      "AI can speed up building; product judgment decides what's worth building.",
  },
  {
    icon: <BoltIcon />,
    title: "Learn through prototypes.",
    description:
      "I can build prototypes in your design system to make ideas tangible and testable.",
  },
  {
    icon: <PeopleIcon />,
    title: "Leave the team stronger.",
    description:
      "I work alongside your team and document decisions and workflows so useful knowledge stays with them.",
  },
];

// Fade/rise-in once a section comes into view: same IntersectionObserver +
// toggled-class pattern used elsewhere (see WorkSummary's card/image
// reveals), skipped entirely under reduced motion via the CSS media query.
function useInViewOnce<T extends HTMLElement>() {
  const [inView, setInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

// ── Mobile/tablet engagement toggle: a real tabs pattern ──────────────
function EngagementToggle() {
  const [selected, setSelected] = useState<Format["key"]>("fractional");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (key: Format["key"]) => {
    setSelected(key);
    tabRefs.current[key]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = FORMATS.findIndex((f) => f.key === selected);
    const nextIdx =
      e.key === "ArrowRight"
        ? (idx + 1) % FORMATS.length
        : (idx - 1 + FORMATS.length) % FORMATS.length;
    select(FORMATS[nextIdx].key);
  };

  const activeFormat = FORMATS.find((f) => f.key === selected)!;

  return (
    <div className={styles.mobileToggle}>
      <div role="tablist" aria-label="Engagement format" className={styles.tabList}>
        {FORMATS.map((format) => {
          const active = format.key === selected;
          return (
            <button
              key={format.key}
              ref={(el) => {
                tabRefs.current[format.key] = el;
              }}
              role="tab"
              id={`tab-${format.key}`}
              aria-selected={active}
              aria-controls={`panel-${format.key}`}
              tabIndex={active ? 0 : -1}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              onClick={() => select(format.key)}
              onKeyDown={onKeyDown}
            >
              {format.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeFormat.key}`}
        aria-labelledby={`tab-${activeFormat.key}`}
        className={styles.tabPanel}
      >
        <div className={styles.mobileFormatHeader}>
          <span className={styles.mobileFormatName}>{activeFormat.name}</span>
          <span className={styles.pill}>{activeFormat.pill}</span>
        </div>
        <div className={styles.mobileRows}>
          {COMPARISON_ROWS.map((row) => (
            <div className={styles.mobileRow} key={row.label}>
              <span className={styles.mobileRowLabel}>{row.label}</span>
              <span className={styles.mobileRowValue}>
                {activeFormat.key === "fractional" ? row.fractional : row.projectBased}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowIWork() {
  const [tableRef, tableInView] = useInViewOnce<HTMLDivElement>();
  const [panelRef, panelInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section id="how" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>How I work</h2>

        {/* ── Part 1: Engagement formats ──────────────────────────── */}
        <h3 className={styles.partStatement}>
          Support based on what you need right now.
        </h3>

        <div
          ref={tableRef}
          className={`${styles.tableReveal} ${tableInView ? styles.tableRevealIn : ""}`}
        >
          <div className={styles.tableWrap}>
            <table className={styles.table} role="table">
              <caption className={styles.visuallyHidden}>
                Fractional compared with project-based work.
              </caption>
              <colgroup>
                <col className={styles.colLabel} />
                <col className={styles.colFormat} />
                <col className={styles.colFormat} />
              </colgroup>
              <thead role="rowgroup">
                <tr className={styles.headerRow} role="row">
                  <th className={styles.cornerCell} aria-hidden="true" />
                  <th scope="col" role="columnheader" className={styles.formatHeader}>
                    <span className={styles.formatHeaderInner}>
                      <span className={styles.formatName}>Fractional</span>
                      <span className={styles.pill}>Ongoing ownership</span>
                    </span>
                  </th>
                  <th scope="col" role="columnheader" className={styles.formatHeader}>
                    <span className={styles.formatHeaderInner}>
                      <span className={styles.formatName}>Project-Based</span>
                      <span className={styles.pill}>Defined outcome</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className={styles.row} role="row">
                    <th scope="row" role="rowheader" className={styles.rowLabel}>
                      {row.label}
                    </th>
                    <td role="cell" className={styles.cell}>
                      {row.fractional}
                    </td>
                    <td role="cell" className={styles.cell}>
                      {row.projectBased}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <EngagementToggle />
        </div>

        {/* ── Part 2: AI-native approach ──────────────────────────── */}
        <div className={styles.part2}>
          <h3 className={styles.partStatement}>
            Part-time no longer means partial impact.
          </h3>

          <div
            ref={panelRef}
            className={`${styles.aiReveal} ${panelInView ? styles.aiRevealIn : ""}`}
          >
            <div className={styles.aiPoints}>
              {AI_ITEMS.map((item) => (
                <div className={styles.aiItem} key={item.title}>
                  <span className={styles.aiIconCircle}>{item.icon}</span>
                  <div className={styles.aiItemText}>
                    <h4 className={styles.aiItemTitle}>{item.title}</h4>
                    <p className={styles.aiItemDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.toolsStripSlot}>
              <ToolsStrip />
            </div>
          </div>

          <a
            href="#book"
            className={styles.cta}
            onClick={() =>
              trackEvent("cta_click", { cta_label: "lets_chat", cta_location: "how_i_work" })
            }
          >
            Let&apos;s chat
          </a>
        </div>
      </div>
    </section>
  );
}
