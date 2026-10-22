"use client";
import { useEffect } from "react";
import { flushEvents, setProjectEntry, trackEvent } from "@/lib/analytics";
export default function SiteAnalytics() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const section = link.closest("section")?.id;
      const location = section
        ? section === "how"
          ? "how_i_work"
          : section
        : link.closest("footer")
          ? "footer"
          : "nav";
      if (href.startsWith("#work-"))
        setProjectEntry(
          section === "services" ? "services_example" : "internal_link",
        );
      if (href === "#book")
        trackEvent("booking_cta_click", {
          cta_location: location,
          cta_label: "lets_chat",
        });
      if (href.startsWith("mailto:"))
        trackEvent("contact_click", {
          contact_method: "email",
          cta_location: location,
        });
      if (href.includes("linkedin.com/in/laurakayharris"))
        trackEvent("contact_click", {
          contact_method: "linkedin",
          cta_location: location,
        });
    };
    document.addEventListener("click", click, true);
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const seen = new Set<Element>();
    // Observe headings: large sections can exceed a viewport and never be 50% visible.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const old = timers.get(entry.target);
          if (old) clearTimeout(old);
          if (entry.intersectionRatio < 0.5 || seen.has(entry.target)) continue;
          timers.set(
            entry.target,
            setTimeout(() => {
              if (document.visibilityState !== "visible") return;
              const r = entry.target.getBoundingClientRect();
              if (
                Math.min(r.bottom, innerHeight) - Math.max(r.top, 0) <
                r.height * 0.5
              )
                return;
              seen.add(entry.target);
              trackEvent("section_view", {
                section_id: entry.target.closest("section")!.id,
              });
            }, 1000),
          );
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    for (const id of ["ask", "services", "how", "work", "book"]) {
      const heading = document.querySelector(`#${id} h2`);
      if (heading) observer.observe(heading);
    }
    const flush = () => {
      if (document.visibilityState === "hidden") flushEvents();
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flushEvents);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      document.removeEventListener("click", click, true);
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flushEvents);
    };
  }, []);
  return null;
}
