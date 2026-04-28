"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { projects } from "@/content/projects";
import type { Project, ProjectSection } from "@/content/projects";
import StoryView from "./StoryView";
import Lightbox from "./Lightbox";
import styles from "./Work.module.css";

// Nav height in px — must match --nav-height CSS token
const NAV_H = 64;
// How far from the top of the viewport (below nav + project nav bar) to treat as "active"
const TRIGGER_RATIO = 0.32;

// ── Types ──────────────────────────────────────────────────────────

interface LightboxState {
  images: string[];
  altTexts: string[];
  index: number;
}

// ── Main component ─────────────────────────────────────────────────

export default function Work() {
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [storyProjectId, setStoryProjectId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const rafRef = useRef<number>(0);
  const projectNavRef = useRef<HTMLDivElement>(null);

  // ── Scroll tracking (window-level) ─────────────────────────────

  const trackScroll = useCallback(() => {
    const projectNavH = projectNavRef.current?.offsetHeight ?? 0;
    const triggerY = NAV_H + projectNavH + window.innerHeight * TRIGGER_RATIO;

    let foundProjectId: string | null = null;
    for (const p of projects) {
      const hero = document.querySelector(
        `[data-hero="${p.id}"]`
      ) as HTMLElement | null;
      if (hero && hero.getBoundingClientRect().top <= triggerY) {
        foundProjectId = p.id;
      }
    }

    if (!foundProjectId) return;

    setActiveProjectId((prev) => {
      if (prev !== foundProjectId) {
        history.replaceState(null, "", `#${foundProjectId}`);
      }
      return foundProjectId!;
    });
  }, []);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(trackScroll);
  }, [trackScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // ── Initial URL hash ───────────────────────────────────────────

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const proj = projects.find((p) => p.id === hash);
    if (!proj) return;

    if (window.innerWidth < 768) {
      setStoryProjectId(proj.id);
    } else {
      setTimeout(() => {
        const hero = document.querySelector(
          `[data-hero="${hash}"]`
        ) as HTMLElement | null;
        if (hero) {
          const projectNavH = projectNavRef.current?.offsetHeight ?? 0;
          const top =
            hero.getBoundingClientRect().top + window.scrollY - NAV_H - projectNavH - 20;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 120);
    }
  }, []);

  // ── Project nav click → scroll page to project ─────────────────

  const scrollToProject = useCallback((projectId: string) => {
    const hero = document.querySelector(
      `[data-hero="${projectId}"]`
    ) as HTMLElement | null;
    if (hero) {
      const projectNavH = projectNavRef.current?.offsetHeight ?? 0;
      const top =
        hero.getBoundingClientRect().top + window.scrollY - NAV_H - projectNavH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <section id="work" className={styles.work}>
      {/* ── Desktop layout ── */}
      <div className={styles.desktop}>
        {/* Work heading */}
        <div className={styles.headingWrap}>
          <h2 className={styles.heading}>Work</h2>
        </div>

        {/* Sticky horizontal project nav bar */}
        <div className={styles.projectNav} ref={projectNavRef}>
          <div className={styles.projectNavInner}>
            {projects.map((project) => {
              const isActive = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  className={`${styles.projectNavCard} ${isActive ? styles.projectNavCardActive : ""}`}
                  onClick={() => scrollToProject(project.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className={styles.projectNavThumb}>
                    <Image
                      src={project.thumbnail}
                      alt=""
                      fill
                      className={styles.projectNavThumbImg}
                      sizes="200px"
                    />
                  </div>
                  <div className={styles.projectNavInfo}>
                    <span className={styles.projectNavCompany}>{project.company}</span>
                    <span className={styles.projectNavTitle}>{project.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project blocks — hero full-width, sections constrained */}
        {projects.map((project) => (
          <ProjectBlock
            key={project.id}
            project={project}
            onLightbox={setLightbox}
          />
        ))}
      </div>

      {/* ── Mobile card list ── */}
      <div className={styles.mobile}>
        <h2 className={styles.mobileHeading}>Work</h2>
        {projects.map((project) => (
          <MobileCard
            key={project.id}
            project={project}
            onOpen={() => setStoryProjectId(project.id)}
          />
        ))}
      </div>

      {/* ── Mobile story view overlay ── */}
      {storyProjectId && (
        <StoryView
          projectId={storyProjectId}
          onClose={() => setStoryProjectId(null)}
          onLightbox={setLightbox}
        />
      )}

      {/* ── Lightbox (desktop + mobile) ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          altTexts={lightbox.altTexts}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}

// ── Project block ───────────────────────────────────────────────────

interface ProjectBlockProps {
  project: Project;
  onLightbox: (s: LightboxState) => void;
}

function ProjectBlock({ project, onLightbox }: ProjectBlockProps) {
  return (
    <div className={styles.projectBlock} data-project-id={project.id}>
      {/* ── Hero band — outer wrapper matches nav width, inner aligns with content ── */}
      <div className={styles.heroWrap}>
      <div className={styles.hero} data-hero={project.id}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroCompany}>{project.company}</span>
            {(project.fundingStage || project.employeeRange) && (
              <span className={styles.heroMeta}>
                {[project.fundingStage, project.employeeRange]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
            <h2 className={styles.heroTitle}>{project.title}</h2>
            {project.oneLineDesc && (
              <p className={styles.heroDesc}>{project.oneLineDesc}</p>
            )}
          </div>
          <div className={styles.heroMetricCircle} aria-label={`Key result: ${project.keyMetric.number} ${project.keyMetric.label}`}>
            <span className={styles.heroNumber}>{project.keyMetric.number}</span>
            <span className={styles.heroLabel}>{project.keyMetric.label}</span>
          </div>
        </div>
      </div>
      </div>

      {/* ── Sections — constrained reading width ── */}
      <div className={styles.projectSections}>
        {project.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            project={project}
            onLightbox={onLightbox}
          />
        ))}
      </div>
    </div>
  );
}

// ── Section block ───────────────────────────────────────────────────

interface SectionBlockProps {
  section: ProjectSection;
  project: Project;
  onLightbox: (s: LightboxState) => void;
}

function SectionBlock({ section, project, onLightbox }: SectionBlockProps) {
  return (
    <div
      className={styles.section}
      data-section={section.id}
      data-project={project.id}
    >
      <span className={styles.sectionLabel}>{section.label}</span>

      {/* ── Results section ── */}
      {section.id === "results" ? (
        <>
          {section.body.length > 0 && (
            <ul className={styles.resultsList}>
              {section.body.map((r, i) => (
                <li key={i} className={styles.resultsItem}>{r}</li>
              ))}
            </ul>
          )}
          {project.beforeAfterTable && (
            <div className={styles.bafList}>
              <div className={styles.bafHeader}>
                <span>BEFORE ☹️</span>
                <span>AFTER 🤩</span>
              </div>
              {project.beforeAfterTable.map((row, i) => (
                <div key={i} className={styles.bafRow}>
                  <span className={styles.bafBefore}>{row.before}</span>
                  <span className={styles.bafAfter}>
                    <span className={styles.bafArrow} aria-hidden="true">→</span>
                    {row.after}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── All other sections ── */
        <div className={styles.bodyParagraphs}>
          {section.body.map((para, i) => {
            const prefix = section.boldPrefixes?.[i];
            if (prefix && para.startsWith(prefix)) {
              const rest = para.slice(prefix.length);
              return (
                <p key={i} className={styles.para}>
                  <strong>{prefix}</strong>{rest}
                </p>
              );
            }
            return <p key={i} className={styles.para}>{para}</p>;
          })}
        </div>
      )}

      {/* ── Design images ── */}
      {section.id === "design" && section.images && section.images.length > 0 && (() => {
        const imgs = section.images!;
        const count = imgs.length;
        // Aspect ratio (w÷h) for each image — drives grid column widths
        const ratios = imgs.map((_, i) =>
          (section.imageWidths?.[i] ?? 16) / (section.imageHeights?.[i] ?? 9)
        );
        // Grid template: for 1 image use 1fr; for 2+ use first two ratios as fr units
        const gridCols =
          count === 1 ? "1fr" : `${ratios[0]}fr ${ratios[1]}fr`;

        return (
          <div
            className={styles.designImages}
            style={{ gridTemplateColumns: gridCols }}
          >
            {imgs.map((img, i) => (
              <div
                key={i}
                className={styles.designThumbWrap}
                // Third image in a 3-up layout spans both columns on its own row
                style={count === 3 && i === 2 ? { gridColumn: "1 / -1" } : undefined}
              >
                <button
                  className={styles.designThumb}
                  onClick={() =>
                    onLightbox({
                      images: imgs,
                      altTexts:
                        section.altTexts ??
                        imgs.map((_, j) => `Design image ${j + 1}`),
                      index: i,
                    })
                  }
                  aria-label={`View design image ${i + 1} of ${count}`}
                >
                  <Image
                    src={img}
                    alt={section.altTexts?.[i] ?? `Design image ${i + 1}`}
                    width={section.imageWidths?.[i] ?? 1200}
                    height={section.imageHeights?.[i] ?? 750}
                    className={styles.designThumbImg}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <span className={styles.expandIcon} aria-hidden="true">↗</span>
                </button>
                {section.captions?.[i] && (
                  <p className={styles.designCaption}>{section.captions[i]}</p>
                )}
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Stack list (AI project, solution section) ── */}
      {project.stack && section.id === "solution" && (
        <ul className={styles.stackList}>
          {project.stack.map((item, i) => (
            <li key={i} className={styles.stackItem}>
              <strong>{item.tool}</strong> {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Mobile card ─────────────────────────────────────────────────────

interface MobileCardProps {
  project: Project;
  onOpen: () => void;
}

function MobileCard({ project, onOpen }: MobileCardProps) {
  return (
    <button
      className={styles.mobileCard}
      onClick={onOpen}
      aria-label={`Open ${project.title}`}
    >
      <div className={styles.mobileThumbWrap}>
        <Image
          src={project.thumbnail}
          alt=""
          fill
          className={styles.mobileThumbImg}
          sizes="120px"
        />
      </div>
      <div className={styles.mobileInfo}>
        <div className={styles.mobileText}>
          <span className={styles.mobileCompany}>{project.company}</span>
          <span className={styles.mobileTitle}>{project.title}</span>
          <span className={styles.mobileMetric} aria-label={`Key result: ${project.keyMetric.number} ${project.keyMetric.label}`}>
            <span className={styles.mobileMetricNumber}>{project.keyMetric.number}</span>
            <span className={styles.mobileMetricLabel}>{project.keyMetric.label}</span>
          </span>
        </div>
        <span className={styles.mobileChevron} aria-hidden="true">›</span>
      </div>
    </button>
  );
}
