"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { STARTER_QUESTIONS } from "@/content/chat/config";
import type { Chip, ChatApiResponse, ChatMessage } from "@/lib/chat/types";
import styles from "./AskChat.module.css";
import {
  trackEvent,
  setAnalyticsConversation,
  setProjectEntry,
  chatParams,
  isInternalVisit,
} from "@/lib/analytics";
import type { EventParams } from "@/lib/measurement/contract";

// ── Reduced motion ────────────────────────────────────────────────────
// useSyncExternalStore, not useState+useEffect: this is the correct tool
// for reading a browser API that doesn't exist during SSR. A lazy
// useState initializer (what this used to do) computes the right value
// on the client, but nothing forces React to reconcile that against the
// server's "false" default right after hydration, so a real SSR round
// trip could leave the placeholder stuck on the server's stale value
// (window.matchMedia has no signal telling React "I might differ from
// the server, please re-check me after mount"). useSyncExternalStore is
// built exactly for this: it takes a getServerSnapshot for the SSR pass
// and re-syncs to the real client value immediately post-hydration.
function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

// ── Start gate for the typed placeholder ───────────────────────────────
// The hero's cursor-chat greeting plays on load, and two animations
// moving at once split a visitor's attention. Where that greeting plays
// (the same media query CursorChat tests), hold the rotating examples
// until the page has been scrolled, so the greeting reads first and the
// examples start once the hero has been read. Everywhere else, and under
// reduced motion, nothing changes.
//
// Module state behind useSyncExternalStore, like the reduced-motion hook
// above: the gate reads an external source and only ever opens once, so
// there is no component state to keep in sync and nothing to re-close.
const SCROLL_START_PX = 40;

let examplesArmed = false;
const armedListeners = new Set<() => void>();

function armExamples() {
  if (examplesArmed) return;
  examplesArmed = true;
  window.removeEventListener("scroll", onArmingScroll);
  for (const notify of armedListeners) notify();
}

function onArmingScroll() {
  if (window.scrollY > SCROLL_START_PX) armExamples();
}

function subscribeToArmed(onStoreChange: () => void): () => void {
  armedListeners.add(onStoreChange);
  if (!examplesArmed) {
    // No greeting to defer to, or the page was restored partway down and
    // the hero isn't what's being read: start the examples right away.
    if (
      !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches ||
      window.scrollY > SCROLL_START_PX
    ) {
      armExamples();
    } else {
      window.addEventListener("scroll", onArmingScroll, { passive: true });
    }
  }
  return () => {
    armedListeners.delete(onStoreChange);
  };
}

function getArmedSnapshot(): boolean {
  return examplesArmed;
}

function getArmedServerSnapshot(): boolean {
  return false;
}

function useExamplesArmed(): boolean {
  return useSyncExternalStore(
    subscribeToArmed,
    getArmedSnapshot,
    getArmedServerSnapshot,
  );
}

// ── Rotating typed placeholder ─────────────────────────────────────────
// `phaseEmpty` gates the whole thing on the empty (pre-conversation)
// state; `focused` doesn't stop it outright anymore, it just means
// "finish the word in progress instead of continuing to type further
// examples" (see below) so a visitor who clicks in mid-type can still
// read the full question that was on screen, rather than it freezing
// wherever the animation happened to be. On blur, the effect re-runs
// and restarts the rotation from the first example, same as a fresh
// page load.
function useTypedPlaceholder(
  phaseEmpty: boolean,
  focused: boolean,
  reducedMotion: boolean,
  started: boolean,
): { placeholder: string; fullQuestion: string } {
  const [text, setText] = useState("");
  const [fullQuestion, setFullQuestion] = useState(STARTER_QUESTIONS[0]);
  const currentExampleRef = useRef(STARTER_QUESTIONS[0]);

  useEffect(() => {
    // Reduced motion returns a constant directly (below) instead of
    // going through state, so the effect has nothing to do in that case.
    if (!phaseEmpty || reducedMotion || !started) return;

    // Focused: snap straight to the full text of whichever example was
    // on screen (mid-type or not) when focus happened, and stop there.
    // No further typing/rotation while focused.
    if (focused) {
      setText(currentExampleRef.current);
      return;
    }

    let cancelled = false;
    let exampleIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeExample() {
      const example =
        STARTER_QUESTIONS[exampleIndex % STARTER_QUESTIONS.length];
      currentExampleRef.current = example;
      setFullQuestion(example);
      let charIndex = 0;

      function typeChar() {
        if (cancelled) return;
        charIndex += 1;
        setText(example.slice(0, charIndex));
        if (charIndex < example.length) {
          timeoutId = setTimeout(typeChar, 32);
        } else {
          timeoutId = setTimeout(clear, 1600);
        }
      }

      typeChar();
    }

    function clear() {
      if (cancelled) return;
      setText("");
      exampleIndex += 1;
      timeoutId = setTimeout(typeExample, 300);
    }

    typeExample();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [phaseEmpty, focused, reducedMotion, started]);

  return {
    placeholder: reducedMotion ? STARTER_QUESTIONS[0] : text,
    fullQuestion,
  };
}

// ── Word-by-word answer reveal ─────────────────────────────────────────
// When not playing (reduced motion, or a non-assistant message), the full
// text is returned directly below rather than mirrored into state, so
// there's nothing to synchronize and no setState call needed for that case.
function useRevealedText(
  fullText: string,
  play: boolean,
  onDone: () => void,
): string {
  const [revealed, setRevealed] = useState("");
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  // Not animating: just fire the "done" callback (e.g. to reveal chips)
  // once. No state to set, so this doesn't trip the setState-in-effect rule.
  useEffect(() => {
    if (!play) onDoneRef.current();
  }, [play, fullText]);

  useEffect(() => {
    if (!play) return;
    // No reset-to-"" here: each message bubble is a fresh mount (keyed by
    // message id in the parent), so `revealed` already starts at "" from
    // useState above; this effect only ever runs once per message.
    const words = fullText.split(" ");
    let i = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      i += 1;
      setRevealed(words.slice(0, i).join(" "));
      if (i < words.length) {
        setTimeout(tick, 35);
      } else {
        onDoneRef.current();
      }
    }
    const id = setTimeout(tick, 35);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [fullText, play]);

  return play ? revealed : fullText;
}

// ── Types ────────────────────────────────────────────────────────────
interface DisplayMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  chips?: Chip[];
  revealing?: boolean;
  variant?: "answer" | "error" | "limited";
  analytics?: EventParams;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export default function AskChat() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"empty" | "conversation">("empty");
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const apiHistoryRef = useRef<ChatMessage[]>([]);
  const touchedTopicsRef = useRef<Set<string>>(new Set());
  const conversationIdRef = useRef<string | null>(null);
  const focusedPlaceholderRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const revealedIds = useRef(new Set<string>());
  const inputId = useId();
  const examplesStarted = useExamplesArmed();
  const { placeholder, fullQuestion } = useTypedPlaceholder(
    phase === "empty",
    inputFocused,
    reducedMotion,
    examplesStarted,
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const startOver = useCallback(() => {
    if (conversationIdRef.current)
      trackEvent("chat_clear", {
        conversation_id: conversationIdRef.current,
        turn_count: apiHistoryRef.current.filter((m) => m.role === "user")
          .length,
      });
    setAnalyticsConversation(null);
    setLoading(false);
    setPhase("empty");
    setDisplayMessages([]);
    setInputValue("");
    apiHistoryRef.current = [];
    touchedTopicsRef.current = new Set();
    conversationIdRef.current = null;
    setDisabled(false);
  }, []);

  const send = useCallback(
    async (question: string, inputSource = "free_text", starterId?: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading || disabled) return;

      setPhase("conversation");
      setInputValue("");
      const first = !conversationIdRef.current;
      conversationIdRef.current ??= crypto.randomUUID();
      const conversationId = conversationIdRef.current;
      setAnalyticsConversation(conversationId);
      const requestId = crypto.randomUUID();
      const turn =
        apiHistoryRef.current.filter((m) => m.role === "user").length + 1;
      const context = chatParams(conversationId, requestId, turn);
      const source = {
        ...context,
        input_source: inputSource,
        ...(starterId ? { starter_id: starterId } : {}),
      };
      if (first) trackEvent("chat_start", source);
      trackEvent("chat_message_sent", source);
      const started = performance.now();

      const userMsg: DisplayMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      setDisplayMessages((prev) => [...prev, userMsg]);
      apiHistoryRef.current = [
        ...apiHistoryRef.current,
        { role: "user", content: trimmed },
      ];
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: apiHistoryRef.current,
            touchedTopics: Array.from(touchedTopicsRef.current),
            conversationId,
            requestId,
            internalVisit: isInternalVisit(),
            inputSource,
            starterId,
          }),
        });
        const data: ChatApiResponse = await res.json();
        if (conversationIdRef.current !== conversationId) return;
        setLoading(false);

        if (data.status === "ok") {
          const metadata = { ...context, intent: data.intent };
          trackEvent("chat_response_received", {
            ...metadata,
            latency_ms: performance.now() - started,
          });
          data.sources.forEach((source) =>
            trackEvent("chat_source_cited", { ...context, source_id: source }),
          );
          apiHistoryRef.current = [
            ...apiHistoryRef.current,
            { role: "assistant", content: data.answer },
          ];
          data.sources.forEach((s) => touchedTopicsRef.current.add(s));
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: data.answer,
              chips: data.chips,
              revealing: true,
              variant: "answer",
              analytics: metadata,
            },
          ]);
        } else if (data.status === "limited") {
          trackEvent("chat_limit_reached", {
            ...context,
            error_type: data.errorType ?? "limit_unknown",
          });
          setDisabled(true);
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: data.message,
              chips: [
                { kind: "book_call", label: "Book a call", href: "#book" },
              ],
              variant: "limited",
              analytics: context,
            },
          ]);
        } else {
          trackEvent("chat_error", {
            ...context,
            error_type: data.errorType ?? "server_error",
          });
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: data.message,
              chips: [
                { kind: "book_call", label: "Book a call", href: "#book" },
              ],
              variant: "error",
              analytics: context,
            },
          ]);
        }
      } catch {
        if (conversationIdRef.current !== conversationId) return;
        trackEvent("chat_error", {
          ...context,
          error_type: "network_or_parse",
        });
        setLoading(false);
        setDisplayMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content:
              "Something went wrong on my end. Try again, or book a call and ask me directly.",
            chips: [{ kind: "book_call", label: "Book a call", href: "#book" }],
            variant: "error",
            analytics: context,
          },
        ]);
      }
    },
    [loading, disabled],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const question =
        inputValue.trim() ||
        (phase === "empty"
          ? focusedPlaceholderRef.current || fullQuestion
          : "");
      focusedPlaceholderRef.current = null;
      if (question) {
        const starter = !inputValue.trim() && phase === "empty";
        send(
          question,
          starter ? "starter_example" : "free_text",
          starter
            ? `starter_${STARTER_QUESTIONS.indexOf(question)}`
            : undefined,
        );
      }
    },
    [inputValue, phase, fullQuestion, send],
  );

  const handleChipClick = useCallback(
    (chip: Chip, message: DisplayMessage, index: number) => {
      trackEvent("chat_action_click", actionParams(message, chip, index));
      if (chip.kind === "book_call" || chip.kind === "case_study") {
        if (chip.kind === "case_study") setProjectEntry("ai_chat");
        if (chip.kind === "book_call")
          trackEvent("booking_cta_click", {
            ...message.analytics,
            cta_location: "ai_chat",
            cta_label: "book_call",
          });
        if (chip.href) window.location.hash = chip.href.replace("#", "");
        return;
      }
      if (chip.question)
        send(
          chip.question,
          chip.kind === "deeper" ? "go_deeper" : "go_sideways",
        );
    },
    [send],
  );

  const markRevealed = useCallback(
    (id: string) => {
      const message = displayMessages.find((m) => m.id === id);
      if (message?.variant === "answer" && !revealedIds.current.has(id)) {
        revealedIds.current.add(id);
        trackEvent("chat_response_displayed", message.analytics);
      }
      setDisplayMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, revealing: false } : m)),
      );
    },
    [displayMessages],
  );

  return (
    <section
      id="ask"
      className={styles.section}
      aria-label="Ask my AI anything, an AI assistant"
    >
      <div className="container">
        {phase === "empty" ? (
          <div className={styles.emptyState}>
            <h2 className={styles.heading}>Ask my AI anything</h2>
            <form onSubmit={handleSubmit} className={styles.emptyForm}>
              <label htmlFor={inputId} className={styles.srOnly}>
                Ask a question about Laura&apos;s work
              </label>
              <textarea
                ref={inputRef}
                id={inputId}
                rows={2}
                className={styles.emptyInput}
                value={inputValue}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  focusedPlaceholderRef.current = fullQuestion;
                  setInputFocused(true);
                }}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                maxLength={500}
              />
              <button
                type="submit"
                className={styles.emptySubmit}
                aria-label="Ask"
              >
                →
              </button>
            </form>
            <p className={styles.disclaimer}>
              An AI trained on my work. For anything else,{" "}
              <a href="#book">let&apos;s chat</a>.
            </p>
          </div>
        ) : (
          <div className={`${styles.conversation} ${styles.conversationEnter}`}>
            <div className={styles.convoHeader}>
              <h2 className={styles.heading}>Ask my AI anything</h2>
              <button
                type="button"
                className={styles.startOver}
                onClick={startOver}
              >
                Clear
              </button>
            </div>

            <div className={styles.messages} ref={scrollRef} aria-live="polite">
              {displayMessages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  reducedMotion={reducedMotion}
                  onRevealed={markRevealed}
                  onChip={handleChipClick}
                />
              ))}
              {loading && (
                <div className={styles.typingIndicator} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className={styles.convoForm}>
              <label htmlFor={inputId} className={styles.srOnly}>
                Ask a follow-up question
              </label>
              <input
                id={inputId}
                type="text"
                className={styles.convoInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  disabled ? "Conversation limit reached" : "Ask a follow-up..."
                }
                maxLength={500}
                disabled={disabled}
              />
              <button
                type="submit"
                className={styles.convoSubmit}
                disabled={disabled || loading}
                aria-label="Send"
              >
                →
              </button>
            </form>
            <p className={styles.disclaimer}>
              An AI trained on Laura&apos;s work. It can make mistakes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Message bubble ──────────────────────────────────────────────────
function MessageBubble({
  message,
  reducedMotion,
  onRevealed,
  onChip,
}: {
  message: DisplayMessage;
  reducedMotion: boolean;
  onRevealed: (id: string) => void;
  onChip: (chip: Chip, message: DisplayMessage, index: number) => void;
}) {
  const chipsRef = useRef<HTMLDivElement>(null);
  const impressionSent = useRef(false);
  useEffect(() => {
    if (message.revealing || !chipsRef.current || impressionSent.current)
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].intersectionRatio < 0.5 ||
          document.visibilityState !== "visible"
        )
          return;
        impressionSent.current = true;
        message.chips?.forEach((chip, index) =>
          trackEvent("chat_action_shown", actionParams(message, chip, index)),
        );
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(chipsRef.current);
    return () => observer.disconnect();
  }, [message]);
  const play =
    Boolean(message.revealing) &&
    !reducedMotion &&
    message.role === "assistant";
  const revealed = useRevealedText(message.content, play, () =>
    onRevealed(message.id),
  );
  const shown = message.role === "assistant" ? revealed : message.content;
  const chipsReady = message.role === "assistant" && !message.revealing;

  if (message.role === "user") {
    return (
      <div className={styles.rowUser}>
        <p className={styles.bubbleUser}>{message.content}</p>
      </div>
    );
  }

  return (
    <div className={styles.rowAssistant}>
      <p
        className={`${styles.answer} ${message.variant === "error" || message.variant === "limited" ? styles.answerMuted : ""}`}
        dangerouslySetInnerHTML={{ __html: renderLightMarkdown(shown) }}
      />
      {chipsReady && message.chips && message.chips.length > 0 && (
        <div className={styles.chips} ref={chipsRef}>
          {message.chips.map((chip, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.chip} ${chip.kind === "book_call" ? styles.chipCta : ""}`}
              onClick={() => onChip(chip, message, i)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Bold-only light markdown, matching the system prompt's own rule
// ("Use bold sparingly"). No new dependency: escape first, then turn
// **text** into <strong>.
function renderLightMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function actionParams(
  message: DisplayMessage,
  chip: Chip,
  index: number,
): EventParams {
  return {
    ...message.analytics,
    action_id: `${message.analytics?.turn_number ?? 0}_${index}_${chip.kind}`,
    action_kind: chip.kind,
    action_position: index + 1,
    target_id:
      chip.kind === "book_call"
        ? "book"
        : chip.kind === "case_study"
          ? (chip.href ?? "").replace("#work-", "")
          : (chip.topic ?? chip.kind),
  };
}
