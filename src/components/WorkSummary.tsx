"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import ReadingView from "./ReadingView";
import { trackEvent } from "@/lib/analytics";
import styles from "./WorkSummary.module.css";

// TEMP (Phase 4 checkpoint): only Payments Onboarding has a cardImage chosen
// and a reviewed card treatment so far. Swap this back to `projects` once
// the rest are approved and cardImage is set for all five.
const VISIBLE_PROJECTS = projects.filter((p) => p.cardImage);

export default function WorkSummary() {
  const [openId, setOpenId] = useState<string | null>(null);

  // ── Deep link on load: #work-<slug> opens that study ──────────────
  useEffect(() => {
    const hash = window.location.hash.replace("#work-", "");
    if (hash && projects.some((p) => p.id === hash)) {
      setOpenId(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Back button closes the reading view instead of leaving the page ──
  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.replace("#work-", "");
      if (hash && projects.some((p) => p.id === hash)) {
        setOpenId(hash);
      } else {
        setOpenId(null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProject = useCallback((id: string) => {
    setOpenId(id);
    history.pushState(null, "", `#work-${id}`);
    trackEvent("project_open", { project_id: id, cta_location: "work_summary_card" });
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    history.pushState(null, "", "#work");
  }, []);

  const switchTo = useCallback((id: string) => {
    setOpenId(id);
    history.replaceState(null, "", `#work-${id}`);
  }, []);

  return (
    <section id="work" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Work</h2>
      </div>

      <div className={styles.stack}>
        {VISIBLE_PROJECTS.map((project, i) => (
          <Card
            key={project.id}
            project={project}
            alt={i % 2 === 1}
            onOpen={() => openProject(project.id)}
          />
        ))}
      </div>

      {openId && (
        <ReadingView
          projectId={openId}
          onClose={close}
          onSwitchProject={switchTo}
        />
      )}
    </section>
  );
}

// ── Summary card ─────────────────────────────────────────────────────

interface CardProps {
  project: Project;
  alt: boolean;
  onOpen: () => void;
}

function Card({ project, alt, onOpen }: CardProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stageLine = [project.fundingStage, project.employeeRange]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      ref={ref}
      className={`${styles.card} ${alt ? styles.cardAlt : ""}`}
    >
      <div className="container">
        <div className={styles.cardInner}>
          {project.cardImage && (
            <div className={styles.imageWrap}>
              <div className={`${styles.imageScale} ${inView ? styles.imageScaleIn : ""}`}>
                <Image
                  src={project.cardImage.src}
                  alt={project.cardImage.alt}
                  width={project.cardImage.width}
                  height={project.cardImage.height}
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}

          <div className={styles.text}>
            <div className={styles.meta}>
              <span className={styles.company}>{project.company}</span>
              {project.tags.map((tag) => (
                <span className={styles.tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            {stageLine && <p className={styles.stageLine}>{stageLine}</p>}
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.oneLiner}>{project.oneLineDesc}</p>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{project.keyMetric.number}</span>
              <span className={styles.metricLabel}>{project.keyMetric.label}</span>
            </div>
            <button className={styles.seeMore} onClick={onOpen}>
              See more →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
