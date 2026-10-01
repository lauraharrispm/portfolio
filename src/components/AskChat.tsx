"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { STARTER_QUESTIONS } from "@/content/chat/config";
import type { Chip, ChatApiResponse, ChatMessage } from "@/lib/chat/types";
import styles from "./AskChat.module.css";

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
    getReducedMotionServerSnapshot
  );
}

// ── Rotating typed placeholder ─────────────────────────────────────────
function useTypedPlaceholder(active: boolean, reducedMotion: boolean): string {
  const [text, setText] = useState("");

  useEffect(() => {
    // Reduced motion returns a constant directly (below) instead of
    // going through state, so the effect has nothing to do in that case.
    if (!active || reducedMotion) return;

    let cancelled = false;
    let exampleIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeExample() {
      const example = STARTER_QUESTIONS[exampleIndex % STARTER_QUESTIONS.length];
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
  }, [active, reducedMotion]);

  return reducedMotion ? STARTER_QUESTIONS[0] : text;
}

// ── Word-by-word answer reveal ─────────────────────────────────────────
// When not playing (reduced motion, or a non-assistant message), the full
// text is returned directly below rather than mirrored into state, so
// there's nothing to synchronize and no setState call needed for that case.
function useRevealedText(fullText: string, play: boolean, onDone: () => void): string {
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputId = useId();
  const placeholder = useTypedPlaceholder(phase === "empty" && !inputFocused, reducedMotion);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const startOver = useCallback(() => {
    setPhase("empty");
    setDisplayMessages([]);
    setInputValue("");
    apiHistoryRef.current = [];
    touchedTopicsRef.current = new Set();
    setDisabled(false);
  }, []);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading || disabled) return;

      setPhase("conversation");
      setInputValue("");

      const userMsg: DisplayMessage = { id: nextId(), role: "user", content: trimmed };
      setDisplayMessages((prev) => [...prev, userMsg]);
      apiHistoryRef.current = [...apiHistoryRef.current, { role: "user", content: trimmed }];
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: apiHistoryRef.current,
            touchedTopics: Array.from(touchedTopicsRef.current),
          }),
        });
        const data: ChatApiResponse = await res.json();
        setLoading(false);

        if (data.status === "ok") {
          apiHistoryRef.current = [...apiHistoryRef.current, { role: "assistant", content: data.answer }];
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
            },
          ]);
        } else if (data.status === "limited") {
          setDisabled(true);
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: data.message,
              chips: [{ kind: "book_call", label: "Book a call", href: "#book" }],
              variant: "limited",
            },
          ]);
        } else {
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: data.message,
              chips: [{ kind: "book_call", label: "Book a call", href: "#book" }],
              variant: "error",
            },
          ]);
        }
      } catch {
        setLoading(false);
        setDisplayMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: "Something went wrong on my end. Try again, or book a call and ask me directly.",
            chips: [{ kind: "book_call", label: "Book a call", href: "#book" }],
            variant: "error",
          },
        ]);
      }
    },
    [loading, disabled]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const question = inputValue.trim() || (phase === "empty" ? placeholder : "");
      if (question) send(question);
    },
    [inputValue, phase, placeholder, send]
  );

  const handleChipClick = useCallback(
    (chip: Chip) => {
      if (chip.kind === "book_call" || chip.kind === "case_study") {
        if (chip.href) window.location.hash = chip.href.replace("#", "");
        return;
      }
      if (chip.question) send(chip.question);
    },
    [send]
  );

  const markRevealed = useCallback((id: string) => {
    setDisplayMessages((prev) => prev.map((m) => (m.id === id ? { ...m, revealing: false } : m)));
  }, []);

  return (
    <section id="ask" className={styles.section} aria-label="Ask my AI anything, an AI assistant">
      <div className="container">
        {phase === "empty" ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyHeader}>
              <div className={styles.headshotWrap}>
                <Image src="/headshot.jpg" alt="" fill className={styles.headshotImg} sizes="56px" />
              </div>
              <h2 className={styles.heading}>Ask my AI anything</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.emptyForm}>
              <label htmlFor={inputId} className={styles.srOnly}>
                Ask a question about Laura&apos;s work
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                className={styles.emptyInput}
                value={inputValue}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setInputFocused(true)}
                maxLength={500}
              />
              <button type="submit" className={styles.emptySubmit} aria-label="Ask">
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
              <button type="button" className={styles.startOver} onClick={startOver}>
                Clear
              </button>
            </div>

            <div className={styles.messages} ref={scrollRef} aria-live="polite">
              {displayMessages.map((m) => (
                <MessageBubble key={m.id} message={m} reducedMotion={reducedMotion} onRevealed={markRevealed} onChip={handleChipClick} />
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
                placeholder={disabled ? "Conversation limit reached" : "Ask a follow-up..."}
                maxLength={500}
                disabled={disabled}
              />
              <button type="submit" className={styles.convoSubmit} disabled={disabled || loading} aria-label="Send">
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
  onChip: (chip: Chip) => void;
}) {
  const play = Boolean(message.revealing) && !reducedMotion && message.role === "assistant";
  const revealed = useRevealedText(message.content, play, () => onRevealed(message.id));
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
      <div className={styles.headshotWrapSmall}>
        <Image src="/headshot.jpg" alt="" fill className={styles.headshotImg} sizes="32px" />
      </div>
      <div className={styles.assistantContent}>
        <p
          className={`${styles.answer} ${message.variant === "error" || message.variant === "limited" ? styles.answerMuted : ""}`}
          dangerouslySetInnerHTML={{ __html: renderLightMarkdown(shown) }}
        />
        {chipsReady && message.chips && message.chips.length > 0 && (
          <div className={styles.chips}>
            {message.chips.map((chip, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.chip} ${chip.kind === "book_call" ? styles.chipCta : ""}`}
                onClick={() => onChip(chip)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>
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
