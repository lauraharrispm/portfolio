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
    fractional: "Several growth bets and no one owning them",
    projectBased: "One growth problem, fixed scope and price",
  },
  {
    label: "What you get",
    fractional: "I own strategy, roadmap, and design",
    projectBased: "One project, diagnosis to launch",
  },
  {
    label: "Duration",
    fractional: "2+ months at 1 to 3 days a week",
    projectBased: "Under 2 months at 1 to 3 days a week",
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

interface AIItem {
  title: string;
  description: string;
}

const AI_ITEMS: AIItem[] = [
  {
    title: "Choose the right problem.",
    description:
      "Humans decide what's worth building. AI\u00a0assists.",
  },
  {
    title: "Learn through prototypes.",
    description:
      "Fast prototypes in your design system, tested before anything gets built.",
  },
  {
    title: "Ship with your team.",
    description:
      "I build with your engineers and document decisions, so nothing leaves with me.",
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
              <span className={styles.tabName}>{format.name}</span>
              <span className={styles.pill}>{format.pill}</span>
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
            Part-time no longer means partial&nbsp;impact.
          </h3>

          <div
            ref={panelRef}
            className={`${styles.aiReveal} ${panelInView ? styles.aiRevealIn : ""}`}
          >
            <div className={styles.aiPoints}>
              {AI_ITEMS.map((item) => (
                <div className={styles.aiItem} key={item.title}>
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
