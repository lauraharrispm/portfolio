import {
  cleanParams,
  type BrowserEvent,
  type EventName,
  type EventParams,
} from "./measurement/contract";

type Gtag = (command: string, ...args: unknown[]) => void;
let conversationId: string | null = null;
let nextProjectLocation = "deep_link";
const queue: BrowserEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
export function setAnalyticsConversation(id: string | null) {
  conversationId = id;
}
export function setProjectEntry(location: string) {
  nextProjectLocation = location;
}
export function takeProjectEntry() {
  const location = nextProjectLocation;
  nextProjectLocation = "browser_navigation";
  return location;
}
export function isInternalVisit() { return typeof document !== "undefined" && /(?:^|; )lh_internal=1(?:;|$)/.test(document.cookie); }
export function measurementAllowed() {
  return (
    typeof window !== "undefined" &&
    ["www.lauraharrispm.com", "lauraharrispm.com"].includes(
      location.hostname,
    ) &&
    process.env.NEXT_PUBLIC_MEASUREMENT_ENV === "production" && !isInternalVisit() &&
    navigator.doNotTrack !== "1" &&
    !(navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  );
}
export function flushEvents() {
  if (!queue.length) return;
  const batch = queue.splice(0, 20);
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: batch }),
    keepalive: true,
  })
    .then((response) => {
      if (!response.ok)
        console.warn("Measurement delivery failed", response.status);
    })
    .catch(() => {
      /* Navigation/offline delivery is best effort; server outcomes are separate. */
    });
}
export function trackEvent(
  name: EventName,
  params: Record<string, unknown> = {},
) {
  if (!measurementAllowed()) return;
  let trafficSource = "direct";
  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      trafficSource = host.endsWith("linkedin.com")
        ? "linkedin"
        : /(^|\.)google\./.test(host)
          ? "google"
          : host === location.hostname
            ? "direct"
            : "other";
    } catch {
      trafficSource = "other";
    }
  }
  const safe = cleanParams({
    traffic_source: trafficSource,
    ...(conversationId ? { conversation_id: conversationId } : {}),
    ...params,
  });
  if (!safe) return;
  const event: BrowserEvent = {
    name,
    event_id: crypto.randomUUID(),
    params: safe,
  };
  const win = window as unknown as { gtag?: Gtag; dataLayer?: unknown[] };
  // The head bootstrap exists before interaction, so early events are queued.
  win.dataLayer ??= [];
  (win.gtag ?? ((...args: unknown[]) => win.dataLayer!.push(args)))(
    "event",
    name,
    { ...safe, event_id: event.event_id },
  );
  queue.push(event);
  if (queue.length >= 20) flushEvents();
  clearTimeout(timer);
  timer = setTimeout(flushEvents, 500);
}
export function chatParams(
  id: string,
  requestId: string,
  turn: number,
): EventParams {
  return { conversation_id: id, request_id: requestId, turn_number: turn };
}
