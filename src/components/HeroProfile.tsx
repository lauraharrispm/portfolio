"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./HeroProfile.module.css";

type BubbleStage = "hidden" | "typing" | "message";

// The photo, plus (when the AI chat is on) a one-time hello bubble that
// points visitors to the chat right below the hero. It types for a beat
// about a second after load, then shows the message and stays. Never
// loops. Desktop only (hidden on mobile in the CSS). Under reduced motion
// it simply appears.
export default function HeroProfile({ chatEnabled }: { chatEnabled: boolean }) {
  const [stage, setStage] = useState<BubbleStage>("hidden");

  useEffect(() => {
    if (!chatEnabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("message");
      return;
    }
    const typing = window.setTimeout(() => setStage("typing"), 1000);
    const message = window.setTimeout(() => setStage("message"), 1800);
    return () => {
      window.clearTimeout(typing);
      window.clearTimeout(message);
    };
  }, [chatEnabled]);

  const goToChat = () => {
    const section = document.getElementById("ask");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.photoFrame}>
        <div className={styles.photoWrap}>
          {/* Intrinsic size well above the ~160px/130px this actually displays
             at (see .photoWrap/.photoImg): next/image otherwise generates a
             srcset capped near the requested size, which reads as pixelated
             under zoom even though the source file itself is high-res. */}
          <Image
            src="/headshot.jpg"
            alt="Laura Harris"
            width={512}
            height={512}
            quality={90}
            preload
            className={styles.photoImg}
          />
        </div>

        {chatEnabled && stage !== "hidden" && (
          <button
            type="button"
            className={`${styles.bubble} ${stage === "typing" ? styles.bubbleTyping : ""}`}
            onClick={goToChat}
            aria-label="Hi, I'm Laura. Questions? Ask my AI"
          >
            {stage === "typing" ? (
              <span className={styles.typingDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <span className={styles.bubbleText} aria-hidden="true">
                Hi, I&apos;m Laura.
                <br />
                Questions? Ask my AI ↓
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
