"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import styles from "./StoryView.module.css";

// ── Types ─────────────────────────────────────────────────────────

interface LightboxState {
  images: string[];
  altTexts: string[];
  index: number;
}

interface Props {
  projectId: string;
  onClose: () => void;
  onLightbox: (state: LightboxState) => void;
}

// ── Component ─────────────────────────────────────────────────────

export default function StoryView({ projectId: initialId, onClose, onLightbox }: Props) {
  const [projectId, setProjectId] = useState(initialId);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [slideClass, setSlideClass] = useState<string>("");
  const [closing, setClosing] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTransitioning = useRef(false);

  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  const section = project.sections[sectionIdx];
  const projIdx = projects.findIndex((p) => p.id === projectId);
  const isReflection = section?.id === "reflection";

  // ── Prevent body scroll ─────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Focus management ────────────────────────────────────────────
  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  // ── Escape key ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close with slide-down animation ────────────────────────────
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  // ── Slide animation helper ─────────────────────────────────────
  function animateSlide(dir: "left" | "right", duration: number, cb: () => void) {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setSlideClass(dir === "left" ? styles.slideOutLeft : styles.slideOutRight);
    setTimeout(() => {
      cb();
      setSlideClass(dir === "left" ? styles.slideInRight : styles.slideInLeft);
      setTimeout(() => {
        setSlideClass("");
        isTransitioning.current = false;
      }, duration);
    }, duration);
  }

  // ── Navigate forward / back ────────────────────────────────────
  const navigate = useCallback((dir: "forward" | "back") => {
    if (isTransitioning.current) return;

    if (dir === "forward") {
      const currentSection = project.sections[sectionIdx];
      const currentIsReflection = currentSection?.id === "reflection";

      if (currentIsReflection) {
        // End of any project — return to work section
        handleClose();
      } else if (sectionIdx < project.sections.length - 1) {
        // Next section within project
        animateSlide("left", 250, () => setSectionIdx((i) => i + 1));
      } else {
        handleClose();
      }
    } else {
      if (sectionIdx > 0) {
        // Go back one section
        animateSlide("right", 250, () => setSectionIdx((i) => i - 1));
      } else if (sectionIdx === 0 && projIdx > 0) {
        // On first section, go back to previous project's last section
        const prev = projects[projIdx - 1];
        animateSlide("right", 250, () => {
          setProjectId(prev.id);
          setSectionIdx(prev.sections.length - 1);
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projIdx, sectionIdx, project.sections, handleClose]);

  // ── Touch handling ─────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    touchStart.current = null;

    // Swipe down to close — only when content is scrolled to top
    const contentScrollTop = contentRef.current?.scrollTop ?? 0;
    if (dy > 80 && dy > Math.abs(dx) * 2 && dt < 500 && contentScrollTop === 0) {
      handleClose();
      return;
    }
    // Swipe left/right to navigate
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2 && dt < 400) {
      navigate(dx < 0 ? "forward" : "back");
      return;
    }
    // Tap: left 40% = back, right 60% = forward
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 300) {
      const w = window.innerWidth;
      navigate(t.clientX < w * 0.4 ? "back" : "forward");
    }
  }

  // ── Section content rendering ───────────────────────────────────
  function renderSectionBody() {
    if (!section) return null;

    if (section.id === "results") {
      return (
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
                  <span className={styles.bafAfterText}>
                    <span className={styles.bafArrow} aria-hidden="true">→</span>
                    {row.after}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    return (
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

        {/* Design images — stacked vertically on mobile */}
        {section.id === "design" && section.images && section.images.length > 0 && (
          <div className={styles.designImages}>
            {section.images.map((img, i) => (
              <div key={i} className={styles.designImageWrapOuter}>
                <button
                  className={styles.designImageWrap}
                  onClick={() =>
                    onLightbox({
                      images: section!.images!,
                      altTexts:
                        section!.altTexts ??
                        section!.images!.map((_, j) => `Design image ${j + 1}`),
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
                    className={styles.designImageImg}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <span className={styles.expandIndicator} aria-hidden="true">↗</span>
                </button>
                {section.captions?.[i] && (
                  <p className={styles.designCaption}>{section.captions[i]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stack list (AI project, solution section) */}
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

  // ── Pips ───────────────────────────────────────────────────────
  function renderPips() {
    return project.sections.map((s, i) => {
      let pipClass = styles.pip;
      if (i < sectionIdx) pipClass += ` ${styles.pipDone}`;
      else if (i === sectionIdx) pipClass += ` ${styles.pipActive}`;
      return <span key={s.id} className={pipClass} />;
    });
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${closing ? styles.overlayOut : styles.overlayIn}`}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}${section ? ` — ${section.label}` : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Fixed header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleClose} aria-label="Close story view">
          ‹ Back
        </button>
        <span className={styles.headerTitle}>{project.title}</span>
        <span className={styles.headerSpacer} aria-hidden="true" />
      </div>

      {/* ── Progress pips ── */}
      <div className={styles.pips} aria-hidden="true">
        {renderPips()}
      </div>

      {/* ── Section content ── */}
      <div ref={contentRef} className={`${styles.content} ${slideClass}`}>
        <span className={styles.sectionLabel}>{section?.label}</span>
        {renderSectionBody()}
      </div>
    </div>
  );
}
