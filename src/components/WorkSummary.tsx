"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import ReadingView from "./ReadingView";
import { trackEvent } from "@/lib/analytics";
import styles from "./WorkSummary.module.css";

// Sorted by `order` so adding a new study later is a data change, not a
// layout one: just give it the next number.
const VISIBLE_PROJECTS = [...projects].sort((a, b) => a.order - b.order);

// Vertical offset between each stuck card's `top`, in px: this is how much
// of a covered card stays peeking above the one that settles over it.
const PEEK = 48;

export default function WorkSummary() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // ── Stacked-card recede: as the next card slides up to cover the
  // current one, ease the current one's scale/opacity down slightly for
  // depth. Scroll-linked, so it's a rAF-throttled passive listener rather
  // than IntersectionObserver; it never touches scroll position itself,
  // only reads it. Skipped only under reduced motion; the stack (and
  // this recede effect) now runs at every width, including mobile. ──
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const els = cardRefs.current;
      for (let i = 0; i < els.length - 1; i++) {
        const cur = els[i];
        const next = els[i + 1];
        if (!cur || !next) continue;
        const curRect = cur.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const travel = Math.max(curRect.height - PEEK, 1);
        const raw = (nextRect.top - curRect.top - PEEK) / travel;
        const progress = Math.min(Math.max(1 - raw, 0), 1);
        // Scale + a slight brightness dim, never opacity: this card is
        // still a fully opaque box sitting in front of the one behind it,
        // so making it translucent would let that earlier card show
        // through its whole body instead of just the peek strip above it.
        cur.style.transform = `scale(${1 - progress * 0.04})`;
        cur.style.filter = `brightness(${1 - progress * 0.08})`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const openProject = useCallback((id: string, rect: DOMRect | null) => {
    setOpenId(id);
    setOriginRect(rect);
    history.pushState(null, "", `#work-${id}`);
    trackEvent("project_open", { project_id: id, cta_location: "work_summary_card" });
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    setOriginRect(null);
    history.pushState(null, "", "#work");
  }, []);

  const switchTo = useCallback((id: string) => {
    setOpenId(id);
    history.replaceState(null, "", `#work-${id}`);
  }, []);

  return (
    <section id="work" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Recent work</h2>
      </div>

      <div className={styles.stack}>
        {VISIBLE_PROJECTS.map((project, i) => (
          <StackItem
            key={project.id}
            index={i}
            registerRef={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <Card
              project={project}
              onOpen={(rect) => openProject(project.id, rect)}
            />
          </StackItem>
        ))}
      </div>

      {openId && (
        <ReadingView
          projectId={openId}
          onClose={close}
          onSwitchProject={switchTo}
          originRect={originRect}
        />
      )}
    </section>
  );
}

// ── Sticky stack wrapper: pins each card near the top of the viewport,
// each one slightly lower than the last, so the previous card peeks out
// above it. Also triggers a one-time fade/scale entrance as the card
// arrives. ─────────────────────────────────────────────────────────────

interface StackItemProps {
  index: number;
  registerRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

function StackItem({ index, registerRef, children }: StackItemProps) {
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={(el) => {
        ref.current = el;
        registerRef(el);
      }}
      className={styles.stackItem}
      style={
        {
          // Base clears the fixed nav plus room to still read as "just
          // below the Recent Work heading," not jammed under the nav bar.
          "--stack-top": `calc(var(--nav-height) + 32px + ${index * PEEK}px)`,
          zIndex: index + 1,
        } as React.CSSProperties
      }
    >
      <div className="container">
        <div className={`${styles.card} ${entered ? styles.cardEnter : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Summary card content ─────────────────────────────────────────────

interface CardProps {
  project: Project;
  onOpen: (rect: DOMRect | null) => void;
}

function Card({ project, onOpen }: CardProps) {
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

  // Whole card opens the study; the "See more" button keeps its own
  // visible affordance and is still the keyboard-operable control, but no
  // longer needs its own handler since a native click on it bubbles up to
  // this one.
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const cardEl = (e.currentTarget as HTMLElement).closest(`.${styles.card}`) as HTMLElement | null;
    onOpen(cardEl?.getBoundingClientRect() ?? null);
  };

  return (
    <article ref={ref} className={styles.cardInner} onClick={handleCardClick}>
      {project.cardImage && (
        <div className={styles.imageWrap}>
          <div className={styles.imageClip}>
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
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.oneLiner}>{project.oneLineDesc}</p>
        <div
          className={`${styles.resultBlock} ${inView ? styles.resultBlockIn : ""}`}
        >
          <span className={styles.resultTag}>Key result</span>
          <div className={styles.resultRow}>
            <span className={styles.resultNumber}>{project.keyMetric.number}</span>
            <span className={styles.resultLabel}>{project.keyMetric.label}</span>
          </div>
        </div>
        <button className={styles.seeMore}>See more</button>
      </div>
    </article>
  );
}
