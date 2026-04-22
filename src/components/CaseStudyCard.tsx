"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { CaseStudy } from "@/content/caseStudies";
import styles from "./CaseStudyCard.module.css";

interface Props {
  study: CaseStudy;
  initiallyExpanded?: boolean;
}

export default function CaseStudyCard({ study, initiallyExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function expandIfMatched() {
      if (window.location.hash === `#${study.id}`) {
        setExpanded(true);
        setTimeout(() => {
          cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    }

    // Check on mount (direct URL with hash, or same-page link already settled)
    expandIfMatched();

    // Re-check when the hash changes (e.g. clicking a link from the fit assessment results)
    window.addEventListener("hashchange", expandIfMatched);
    return () => window.removeEventListener("hashchange", expandIfMatched);
  }, [study.id]);

  const toggle = () => setExpanded((e) => !e);

  return (
    <div
      id={study.id}
      ref={cardRef}
      className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`}
    >
      {/* Always-visible row: thumbnail left + header content right */}
      <div className={styles.row}>
        {/* Thumbnail — left column */}
        {study.thumbnailImage ? (
          <div className={styles.thumbnail} aria-hidden="true">
            <Image
              src={study.thumbnailImage}
              alt=""
              fill
              className={styles.thumbnailImg}
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
        ) : (
          <div
            className={styles.thumbnail}
            style={{ background: study.thumbnailBg }}
            aria-hidden="true"
          >
            <span
              className={styles.thumbnailStat}
              style={{ color: study.thumbnailStatColor }}
            >
              {study.thumbnailStat}
            </span>
          </div>
        )}

        {/* Header content — right column, clickable */}
        <button
          className={styles.header}
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={`${study.id}-body`}
        >
          <div className={styles.headerMeta}>
            <span className={styles.company}>{study.company}</span>
            <h3 className={styles.title}>{study.title}</h3>
            <p className={styles.desc}>{study.description}</p>
            <div className={styles.metricRow}>
              <span className={styles.metricPrefix}>Key Result:</span>
              <span className={styles.metricNumber}>{study.metric}</span>
              <span className={styles.metricLabel}>{study.metricLabel}</span>
            </div>
          </div>
          <span
            className={`${styles.chevron} ${expanded ? styles.chevronUp : ""}`}
            aria-hidden="true"
          >
            ›
          </span>
        </button>
      </div>

      {/* Expanded body — full width below the row */}
      <div
        id={`${study.id}-body`}
        className={`${styles.body} ${expanded ? styles.bodyOpen : ""}`}
      >
        <div
          className={styles.bodyInner}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("a, button")) toggle();
          }}
        >

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Problem</h4>
            <p>{study.problem}</p>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Solution</h4>
            <p>{study.solution}</p>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Results</h4>
            <ul className={styles.list}>
              {study.results.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Key Challenges</h4>
            <ul className={styles.list}>
              {study.challenges.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Design</h4>
            <p>{study.design}</p>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionHeading}>Reflection</h4>
            <p>{study.reflection}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
