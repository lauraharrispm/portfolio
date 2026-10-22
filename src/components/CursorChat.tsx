"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorChat.module.css";

// A FigJam-style multiplayer cursor that glides into the hero, types a
// hello in cursor chat, then fades out. Decoration only: desktop with a
// real pointer, once per session, never under reduced motion, hidden from
// screen readers, never blocks a click. Spec: the design partner's
// .context/site-hero-cursor-chat/notes.md (recolored charcoal and moved to
// the slot between the subhead and the photo after review).

const MESSAGE = "Hey, I'm Laura. Nice to meet you!";

// Timeline, in ms from mount.
const ENTER_AT = 1000;
const ENTER_MS = 900;
const EXPAND_AT = 2200;
const TYPE_AT = 2420;
const HOLD_MS = 3000;
const FADE_MS = 400;

// When each character appears: 38ms per character plus a small fixed
// jitter, and a beat after punctuation, so it reads as typed by a person.
const CHAR_TIMES: number[] = (() => {
  const times: number[] = [];
  let t = TYPE_AT;
  for (let i = 0; i < MESSAGE.length; i++) {
    times.push(t);
    t += 38 + ((i * 37) % 35);
    if (",.!".includes(MESSAGE[i])) t += 200;
  }
  return times;
})();
const FADE_AT = CHAR_TIMES[CHAR_TIMES.length - 1] + HOLD_MS;
const DONE_AT = FADE_AT + FADE_MS;

const SEEN_KEY = "cursorChatSeen";

const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

export default function CursorChat() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Play only on desktop with a real pointer, without reduced motion,
    // and once per session. Otherwise the node just stays hidden.
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduced) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      // Storage blocked: still play, it just may repeat in this session.
    }

    const root = rootRef.current;
    const tag = tagRef.current;
    const hero = document.getElementById("hero");
    const subhead = hero?.querySelector<HTMLElement>("h1 + p");
    const photo = hero?.querySelector<HTMLElement>("img");
    if (!root || !tag || !hero || !subhead || !photo) return;

    // Rest in the open slot between the subhead and the photo: the tip
    // just past the end of the subhead's first line. The bubble may wrap
    // to a second line (as FigJam's does) rather than run onto the photo;
    // if there isn't room for even that, skip it.
    const heroRect = hero.getBoundingClientRect();
    const photoLeft = photo.getBoundingClientRect().left - heroRect.left;
    const range = document.createRange();
    range.selectNodeContents(subhead);
    const lineRects = Array.from(range.getClientRects()).filter((r) => r.width > 0);
    const firstTop = Math.min(...lineRects.map((r) => r.top));
    const line1Right =
      Math.max(...lineRects.filter((r) => Math.abs(r.top - firstTop) < 4).map((r) => r.right)) -
      heroRect.left;
    const end = { x: line1Right + 8, y: firstTop - heroRect.top - 6 };
    const bubbleMax = photoLeft - 6 - (end.x + 12);
    if (bubbleMax < 140) return;
    root.style.setProperty("--bubble-max", `${bubbleMax}px`);
    const start = { x: heroRect.width + 40, y: end.y + 260 };
    const ctrl = { x: end.x + 200, y: end.y + 240 };

    const place = (p: number) => {
      const q = 1 - p;
      const x = q * q * start.x + 2 * q * p * ctrl.x + p * p * end.x;
      const y = q * q * start.y + 2 * q * p * ctrl.y + p * p * end.y;
      root.style.transform = `translate(${x}px, ${y}px)`;
    };
    place(0);

    let frame = 0;
    // Stop for good if the hero scrolls out of view mid-sequence.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frame);
        setDone(true);
      }
    });
    observer.observe(hero);

    // Mark it seen on the first frame (not in the effect body), so a
    // cancelled first run never burns the one play for this session.
    const markSeen = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // ignore
      }
    };
    const startedAt = performance.now();
    let first = true;
    const tick = () => {
      if (first) {
        markSeen();
        first = false;
      }
      const t = performance.now() - startedAt;
      if (t >= DONE_AT) {
        setDone(true);
        return;
      }
      root.style.visibility = t < ENTER_AT ? "hidden" : "visible";
      place(easeOutQuart(Math.min(Math.max((t - ENTER_AT) / ENTER_MS, 0), 1)));
      // Text and the tag-to-bubble switch go straight to the DOM, in the
      // same frame as position and opacity, so they can never lag behind.
      const isChatting = t >= EXPAND_AT;
      tag.classList.toggle(styles.chatting, isChatting);
      const text = isChatting ? MESSAGE.slice(0, CHAR_TIMES.filter((ct) => ct <= t).length) : "Laura";
      if (tag.textContent !== text) tag.textContent = text;
      root.style.opacity = t < FADE_AT ? "1" : String(1 - (t - FADE_AT) / FADE_MS);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <svg className={styles.cursor} viewBox="0 0 18 23" width="18" height="23">
        <path
          d="M1.5 1.5v17.2l4.6-4.3 3.3 7.1 3-1.4-3.2-6.9h6.3z"
          fill="var(--cursor-chat)"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span ref={tagRef} className={styles.tag}>
        Laura
      </span>
    </div>
  );
}
