"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LetsChat.module.css";

// Cal.com's own event-type link (username/event-slug, not the full URL):
// what their embed API's calLink option expects.
const CAL_LINK = "lauraharrispm/30min";
// An arbitrary but stable namespace for this one embed, matching the
// pattern in Cal.com's own docs; only matters if a page ever embeds more
// than one Cal link and needs to address them separately.
const CAL_NAMESPACE = "30min";
// Reserved up front so there's no layout shift before the widget loads.
// Unlike the old Calendly embed, there's no postMessage height-sync to
// wait on: Cal.com's inline embed resizes its own iframe internally.
const BOOKING_MIN_HEIGHT = 560;

/** Minimal shape of the `window.Cal` global Cal.com's embed script
 * installs; not exported by any package since this isn't installed as a
 * dependency, just loaded from Cal.com's own CDN at runtime. */
interface CalApi {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns: Record<string, CalApi>;
  q: unknown[][];
}

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/** Installs window.Cal (Cal.com's official embed snippet, reimplemented
 * in TypeScript instead of inlined as a raw <script> string, so it's
 * type-checked and lintable like the rest of the codebase). Idempotent:
 * safe to call more than once, since the real function short-circuits
 * once `loaded` is set. No package installed for this, it just loads
 * Cal.com's own hosted embed.js. */
function installCalEmbedApi() {
  if (typeof window === "undefined" || window.Cal) return;

  const api: CalApi = ((...args: unknown[]) => {
    const cal = window.Cal!;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q ?? [];
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const namespace = args[1];
      if (typeof namespace === "string") {
        const nsApi = ((...nsArgs: unknown[]) => {
          nsApi.q.push(nsArgs);
        }) as CalApi;
        nsApi.q = [];
        nsApi.ns = {};
        cal.ns[namespace] = cal.ns[namespace] ?? nsApi;
        cal.ns[namespace].q.push(args);
        cal.q.push(["initNamespace", namespace]);
        return;
      }
    }
    cal.q.push(args);
  }) as CalApi;
  api.q = [];
  api.ns = {};
  window.Cal = api;
}

function CheckIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="var(--coral)" strokeWidth="1.5" />
      <path
        d="M6 10.5L8.5 13L14 7"
        stroke="var(--coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LetsChat() {
  const [nearViewport, setNearViewport] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const calTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nearViewport) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nearViewport]);

  // Loads and renders the Cal.com inline embed once the section is near
  // the viewport. Cal.com's own embed.js resizes the iframe to fit its
  // content internally, so there's no height-sync listener needed here
  // the way the old Calendly embed required.
  useEffect(() => {
    if (!nearViewport || !calTargetRef.current) return;

    installCalEmbedApi();
    const Cal = window.Cal!;
    Cal("init", CAL_NAMESPACE, { origin: "https://cal.com" });
    Cal.ns[CAL_NAMESPACE]("inline", {
      elementOrSelector: calTargetRef.current,
      calLink: CAL_LINK,
      config: { layout: "month_view" },
    });
    Cal.ns[CAL_NAMESPACE]("ui", {
      hideEventTypeDetails: true,
      layout: "month_view",
    });
  }, [nearViewport]);

  return (
    <section id="book" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2 className={styles.heading}>Let&apos;s chat</h2>

            <p className={styles.body}>
              Tell me where the product is today, what&apos;s getting in the
              way, and what you want to change. In 30 minutes, we&apos;ll talk
              through how I&apos;d approach it, whether a fractional or
              project-based engagement fits, and whether we should work
              together. You&apos;ll leave with a useful next step either way.
            </p>

            <div className={styles.fitBlock}>
              <h3 className={styles.fitHeading}>We&apos;re likely a fit if you:</h3>
              <ul className={styles.fitList}>
                <li>
                  <CheckIcon />
                  <span>Run a consumer-facing business</span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Have product-market fit and want to grow faster</span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Have engineers but little or no dedicated product guidance</span>
                </li>
              </ul>
            </div>

            <p className={styles.altContact}>
              Rather write? Reach me at{" "}
              <a href="mailto:laura@lauraharrispm.com">laura@lauraharrispm.com</a> or on{" "}
              <a
                href="https://www.linkedin.com/in/laurakayharris/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>

          <div
            ref={sectionRef}
            className={styles.bookingWrap}
            style={{ minHeight: BOOKING_MIN_HEIGHT }}
          >
            {nearViewport ? (
              <div ref={calTargetRef} className={styles.bookingEmbed} />
            ) : (
              <div className={styles.bookingPlaceholder} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
