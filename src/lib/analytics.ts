// Tiny wrapper around the gtag.js global installed in src/app/layout.tsx.
// Safe to call before gtag has loaded (call is a no-op).

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, unknown>,
) => void;

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  gtag?.("event", name, params);
}
