"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/content/projects";
import type { Project, ProjectSection } from "@/content/projects";
import StoryView from "./StoryView";
import Lightbox from "./Lightbox";
import { trackEvent } from "@/lib/analytics";
import styles from "./ReadingView.module.css";

interface LightboxState {
  images: string[];
  altTexts: string[];
  index: number;
}

interface Props {
  projectId: string;
  onClose: () => void;
  onSwitchProject: (id: string) => void;
  originRect?: DOMRect | null;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

// One component, two presentations: desktop gets a continuous-scroll
// overlay; mobile gets the upgraded section-by-section story view. Both
// share deep-link/hash syncing and the lightbox, owned here.
export default function ReadingView({ projectId, onClose, onSwitchProject, originRect }: Props) {
  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Don't render either presentation until we know the viewport, to
  // avoid a desktop-then-mobile (or vice versa) flash on open.
  if (isMobile === null) return null;

  return (
    <>
      {isMobile ? (
        <StoryView
          projectId={projectId}
          onClose={onClose}
          onSwitchProject={onSwitchProject}
          onLightbox={setLightbox}
          lightboxOpen={!!lightbox}
        />
      ) : (
        <DesktopReadingView
          projectId={projectId}
          onClose={onClose}
          onSwitchProject={onSwitchProject}
          lightboxOpen={!!lightbox}
          setLightbox={setLightbox}
          originRect={originRect}
        />
      )}

      {/* Lightbox opens above whichever presentation is active */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          altTexts={lightbox.altTexts}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

// ── Desktop overlay ───────────────────────────────────────────────────

interface DesktopProps {
  projectId: string;
  onClose: () => void;
  onSwitchProject: (id: string) => void;
  lightboxOpen: boolean;
  setLightbox: (s: LightboxState | null) => void;
  originRect?: DOMRect | null;
}

const EXPAND_MS = 450;
const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function DesktopReadingView({
  projectId,
  onClose,
  onSwitchProject,
  lightboxOpen,
  setLightbox,
  originRect,
}: DesktopProps) {
  const idx = projects.findIndex((p) => p.id === projectId);
  const project = projects[idx] ?? projects[0];
  const next = projects[idx + 1];

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── "Card expands into the modal" open animation ───────────────────
  // Only when we have the clicked card's rect (a fresh open from a
  // summary card, not in-panel prev/next nav, and not reduced motion):
  // render the panel pinned to that exact rect first, then transition it
  // to the centered target rect on the next frame. Once the transition
  // finishes, the inline rect styles are dropped so the panel goes back
  // to being normally laid out (and stays correct across resizes).
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [expandPhase, setExpandPhase] = useState<"start" | "end" | "done">(
    originRect && !reduceMotion ? "start" : "done"
  );

  useEffect(() => {
    if (!originRect || reduceMotion) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setExpandPhase("end"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (expandPhase !== "end") return;
    const t = setTimeout(() => setExpandPhase("done"), EXPAND_MS);
    return () => clearTimeout(t);
  }, [expandPhase]);

  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | undefined>(() => {
    if (!originRect || reduceMotion) return undefined;
    return {
      position: "fixed",
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      margin: 0,
      borderRadius: 20,
    };
  });

  useEffect(() => {
    if (expandPhase === "done") {
      setPanelStyle(undefined);
      return;
    }
    if (expandPhase === "end" && originRect) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(920, vw - 80);
      const height = Math.min(860, vh - 80);
      setPanelStyle({
        position: "fixed",
        top: (vh - height) / 2,
        left: (vw - width) / 2,
        width,
        height,
        margin: 0,
        borderRadius: 16,
        transition: `top ${EXPAND_MS}ms ${EXPAND_EASE}, left ${EXPAND_MS}ms ${EXPAND_EASE}, width ${EXPAND_MS}ms ${EXPAND_EASE}, height ${EXPAND_MS}ms ${EXPAND_EASE}, border-radius ${EXPAND_MS}ms ${EXPAND_EASE}`,
      });
    }
  }, [expandPhase, originRect]);

  // Scroll to top whenever the study changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [projectId]);

  // Focus the panel on open / on study change
  useEffect(() => {
    panelRef.current?.focus();
  }, [projectId]);

  // Lock page scroll behind the overlay
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goTo = useCallback(
    (id: string) => {
      onSwitchProject(id);
      trackEvent("project_open", { project_id: id, cta_location: "reading_view_nav" });
    },
    [onSwitchProject]
  );

  // Escape / arrow keys. Escape closes the lightbox first if one is open.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) return; // Lightbox's own handler closes it first
        onClose();
        return;
      }
      const target = e.target as HTMLElement;
      const isInteractive = ["INPUT", "TEXTAREA", "BUTTON", "A", "SELECT"].includes(
        target.tagName
      );
      if (isInteractive || lightboxOpen) return;
      if (e.key === "ArrowLeft" && idx > 0) goTo(projects[idx - 1].id);
      if (e.key === "ArrowRight" && idx < projects.length - 1) goTo(projects[idx + 1].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, lightboxOpen, onClose, goTo]);

  // Basic focus trap
  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const stageLine = [project.fundingStage, project.employeeRange]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${panelStyle ? styles.panelExpanding : ""}`}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-view-title"
        tabIndex={-1}
        onKeyDown={onKeyDownTrap}
      >
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close reading view">
            ✕
          </button>
          <div className={styles.headerNav}>
            <button
              className={styles.navBtn}
              onClick={() => idx > 0 && goTo(projects[idx - 1].id)}
              disabled={idx === 0}
              aria-label="Previous study"
            >
              ‹
            </button>
            <button
              className={styles.navBtn}
              onClick={() => idx < projects.length - 1 && goTo(projects[idx + 1].id)}
              disabled={idx === projects.length - 1}
              aria-label="Next study"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={contentRef} className={styles.content}>
          {/* Full study header before Problem */}
          <div className={styles.studyHeader}>
            <div className={styles.studyHeaderText}>
              <span className={styles.company}>{project.company}</span>
              {stageLine && <span className={styles.stageLine}>{stageLine}</span>}
              <h1 id="reading-view-title" className={styles.title}>
                {project.title}
              </h1>
              {project.oneLineDesc && (
                <p className={styles.oneLiner}>{project.oneLineDesc}</p>
              )}
            </div>
            <div className={styles.metricBadge}>
              <span className={styles.metricNumber}>{project.keyMetric.number}</span>
              <span className={styles.metricLabel}>{project.keyMetric.label}</span>
            </div>
          </div>

          {project.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              project={project}
              onLightbox={setLightbox}
            />
          ))}

          {next && (
            <button className={styles.nextStudy} onClick={() => goTo(next.id)}>
              Next: {next.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section renderer (ported from the old Work.tsx layout) ────────────

interface SectionBlockProps {
  section: ProjectSection;
  project: Project;
  onLightbox: (s: LightboxState) => void;
}

function SectionBlock({ section, project, onLightbox }: SectionBlockProps) {
  return (
    <div className={styles.section} data-section={section.id}>
      <span className={styles.sectionLabel}>{section.label}</span>

      {section.id === "results" ? (
        <>
          {section.body.length > 0 && (
            <ul className={styles.resultsList}>
              {section.body.map((r, i) => (
                <li key={i} className={styles.resultsItem}>
                  {r}
                </li>
              ))}
            </ul>
          )}
          {project.beforeAfterTable && (
            <div className={styles.bafList}>
              <div className={styles.bafHeader}>
                <span>BEFORE</span>
                <span>AFTER</span>
              </div>
              {project.beforeAfterTable.map((row, i) => (
                <div key={i} className={styles.bafRow}>
                  <span className={styles.bafBefore}>{row.before}</span>
                  <span className={styles.bafAfter}>
                    <span aria-hidden="true">→</span> {row.after}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.bodyParagraphs}>
          {section.body.map((para, i) => {
            const prefix = section.boldPrefixes?.[i];
            if (prefix && para.startsWith(prefix)) {
              const rest = para.slice(prefix.length);
              return (
                <p key={i} className={styles.para}>
                  <strong>{prefix}</strong>
                  {rest}
                </p>
              );
            }
            return (
              <p key={i} className={styles.para}>
                {para}
              </p>
            );
          })}
        </div>
      )}

      {section.id === "design" && section.images && section.images.length > 0 && (
        <div className={styles.designImages}>
          {section.images.map((img, i) => (
            <div key={i} className={styles.designThumbWrap}>
              <button
                className={styles.designThumb}
                onClick={() =>
                  onLightbox({
                    images: section.images!,
                    altTexts:
                      section.altTexts ?? section.images!.map((_, j) => `Design image ${j + 1}`),
                    index: i,
                  })
                }
                aria-label={`View design image ${i + 1} of ${section.images!.length}`}
              >
                <Image
                  src={img}
                  alt={section.altTexts?.[i] ?? `Design image ${i + 1}`}
                  width={section.imageWidths?.[i] ?? 1200}
                  height={section.imageHeights?.[i] ?? 750}
                  className={styles.designThumbImg}
                  sizes="(max-width: 768px) 100vw, 760px"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <span className={styles.expandIcon} aria-hidden="true">
                  ↗
                </span>
              </button>
              {section.captions?.[i] && (
                <p className={styles.designCaption}>{section.captions[i]}</p>
              )}
            </div>
          ))}
        </div>
      )}

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
