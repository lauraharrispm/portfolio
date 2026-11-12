"use client";

import { useEffect, useRef } from "react";
import styles from "./Recommendations.module.css";

const replies = [
  {
    name: "Lo Bauman",
    initials: "LB",
    profile: "baumanlaura",
    quote: "Laura is a dream PM. She really gets the full picture and can translate and build on complex concepts effortlessly.",
  },
  {
    name: "Gianna Gross",
    initials: "GG",
    profile: "giannafischer",
    quote: "You can trust Laura to deliver, whether she’s building from 0 to 1 or scaling through hypergrowth.\n\nShe’s got a strong instinct for identifying what matters most, connecting product decisions to broader business goals, and getting teams aligned around (and excited about!) the work that will actually move the needle.",
  },
  {
    name: "Rad Wakefield",
    initials: "RW",
    profile: "rad-wakefield",
    quote: "It's rare to find someone who can balance the art and science of building something that's both truly valuable and a joy for people to experience.\n\nLaura helps businesses achieve both with ease and confidence. I'd highly recommend her if you're looking for someone to jump in and make a positive impact.",
  },
  {
    name: "Chandini Ramesh",
    initials: "CR",
    profile: "chandinir",
    quote: "One of the best PMs I’ve worked with as an analyst. She treated data and measurement as part of the plan, not an afterthought.",
  },
];

function HeartReactions() {
  return (
    <>
      <span className={styles.srOnly}> Three heart reactions.</span>
      <span className={styles.reactions} aria-hidden="true">
        {[0, 1, 2].map((heart) => (
          <span className={styles.heart} key={heart}>
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-9-5.4-9-11.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 9 2.8C21 15.6 12 21 12 21Z" />
            </svg>
          </span>
        ))}
      </span>
    </>
  );
}

export default function Recommendations() {
  const threadRef = useRef<HTMLOListElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (!threadRef.current || !phoneRef.current || motion.matches) return;
    const thread = threadRef.current;
    const phone = phoneRef.current;

    const desktop = matchMedia("(min-width: 769px)");
    const messages = Array.from(thread.querySelectorAll<HTMLElement>("[data-message]"));
    let nextReply = 0;
    let typing = false;
    let started = false;
    let finished = false;
    let timer: number | undefined;
    let dueAt = 0;
    let remaining = 950;
    let followFrame = 0;
    let viewportFrame = 0;

    function pause() {
      thread.setAttribute("data-paused", "");
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, dueAt - performance.now());
    }

    function revealAll() {
      finished = true;
      pause();
      cancelAnimationFrame(followFrame);
      thread.removeAttribute("data-animated");
      messages.forEach((message) => message.removeAttribute("data-typing"));
    }

    function follow(message: HTMLElement) {
      if (!desktop.matches) return;
      followFrame = requestAnimationFrame(() => {
        const bottom = thread.getBoundingClientRect().bottom - 30;
        const overflow = message.getBoundingClientRect().bottom - bottom;
        if (overflow > 0) thread.scrollBy({ top: overflow, behavior: "smooth" });
      });
    }

    function play() {
      if (finished || timer !== undefined) return;
      thread.removeAttribute("data-paused");
      dueAt = performance.now() + remaining;
      timer = window.setTimeout(() => {
        timer = undefined;
        const reply = replies[nextReply];
        const message = messages[nextReply + 1];

        if (typing) {
          message.removeAttribute("data-typing");
          message.setAttribute("data-shown", "");
          follow(message);
          nextReply += 1;
          if (nextReply === replies.length) {
            finished = true;
            return;
          }
          remaining = 250 + reply.quote.split(/\s+/).length * 95;
        } else {
          message.setAttribute("data-typing", "");
          const indicator = message.querySelector<HTMLElement>("[data-indicator]");
          if (indicator) follow(indicator);
          remaining = Math.min(1000, Math.max(600, 500 + reply.quote.length * 3));
        }

        typing = !typing;
        play();
      }, remaining);
    }

    function updateViewport() {
      viewportFrame = 0;
      if (finished) return;

      const { top, bottom } = phone.getBoundingClientRect();
      const height = window.innerHeight;
      if (!started && top < height * 0.55 && bottom > height * 0.5) {
        started = true;
        messages[0].setAttribute("data-shown", "");
      }

      if (!desktop.matches && messages[nextReply + 1].getBoundingClientRect().top < height * 0.55) {
        revealAll();
        return;
      }

      if (started && !document.hidden && top < height * 0.85 && bottom > height * 0.15) {
        play();
      } else {
        pause();
        cancelAnimationFrame(followFrame);
      }
    }

    function queueViewportUpdate() {
      if (!finished && !viewportFrame) viewportFrame = requestAnimationFrame(updateViewport);
    }

    thread.setAttribute("data-animated", "");
    updateViewport();
    thread.addEventListener("wheel", revealAll, { passive: true });
    thread.addEventListener("pointerdown", revealAll);
    thread.addEventListener("focusin", revealAll);
    window.addEventListener("scroll", queueViewportUpdate, { passive: true });
    window.addEventListener("resize", queueViewportUpdate);
    document.addEventListener("visibilitychange", updateViewport);
    motion.addEventListener("change", revealAll);

    return () => {
      revealAll();
      thread.removeEventListener("wheel", revealAll);
      thread.removeEventListener("pointerdown", revealAll);
      thread.removeEventListener("focusin", revealAll);
      window.removeEventListener("scroll", queueViewportUpdate);
      window.removeEventListener("resize", queueViewportUpdate);
      document.removeEventListener("visibilitychange", updateViewport);
      cancelAnimationFrame(viewportFrame);
      motion.removeEventListener("change", revealAll);
      messages.forEach((message) => message.removeAttribute("data-shown"));
    };
  }, []);

  return (
    <section className={styles.recs} id="recommendations" aria-labelledby="recs-heading">
      <div className={`container ${styles.recsInner}`}>
        <div>
          <h2 className={styles.heading} id="recs-heading">Your reference check, done.</h2>
        </div>
        <div className={styles.phoneWrap}>
          <div className={styles.phone} ref={phoneRef}>
            <div className={styles.screen}>
              <div className={styles.island} aria-hidden="true" />
              <div className={styles.statusBar} aria-hidden="true">
                <span>9:41</span>
                <span className={styles.statusIcons}>
                  <svg width="17" height="11" viewBox="0 0 17 11">
                    <rect x="0" y="7" width="3" height="4" rx="1" />
                    <rect x="4.6" y="5" width="3" height="6" rx="1" />
                    <rect x="9.2" y="2.5" width="3" height="8.5" rx="1" />
                    <rect x="13.8" y="0" width="3" height="11" rx="1" />
                  </svg>
                  <svg width="15" height="11" viewBox="0 0 15 11">
                    <path d="M7.5 2.2c2.2 0 4.2.9 5.7 2.3l1.2-1.2C12.6 1.5 10.2.5 7.5.5S2.4 1.5.6 3.3l1.2 1.2C3.3 3.1 5.3 2.2 7.5 2.2zm0 3.3c1.3 0 2.5.5 3.4 1.4l1.2-1.2C10.9 4.5 9.3 3.8 7.5 3.8s-3.4.7-4.6 1.9l1.2 1.2c.9-.9 2.1-1.4 3.4-1.4zm0 3.3c-.5 0-.9.2-1.2.5l1.2 1.2 1.2-1.2c-.3-.3-.7-.5-1.2-.5z" />
                  </svg>
                  <svg width="25" height="12" viewBox="0 0 25 12">
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4" />
                    <rect x="2" y="2" width="16" height="8" rx="2" />
                    <rect x="22.6" y="4" width="1.6" height="4" rx=".8" opacity=".4" />
                  </svg>
                </span>
              </div>
              <div className={styles.chatHeader}>
                <svg className={styles.back} viewBox="0 0 11 19" aria-hidden="true">
                  <path d="M9.5 1.5 2 9.5l7.5 8" />
                </svg>
                <span className={styles.groupName}>Teammates <span aria-hidden="true">🩶</span></span>
              </div>
              <ol className={styles.thread} ref={threadRef} aria-label="Group chat: former teammates on working with Laura" role="list">
                <li className={styles.stamp} aria-hidden="true">Today 9:41 AM</li>
                <li className={`${styles.msg} ${styles.me}`} data-message>
                  <div className={styles.content}>
                    <div className={styles.bubble}>
                      <span className={styles.srOnly}>Laura: </span>
                      <p>Putting my website together! What would you tell a founder who&apos;s thinking about working with me?</p>
                      <HeartReactions />
                    </div>
                  </div>
                </li>
                {replies.map(({ name, initials, profile, quote }) => (
                  <li className={`${styles.msg} ${styles.them}`} key={profile} data-message>
                    <div className={`${styles.content} ${styles.themRow}`}>
                      <span className={styles.avatar} aria-hidden="true">{initials}</span>
                      <div className={styles.body}>
                        <a className={styles.sender} href={`https://www.linkedin.com/in/${profile}/`} target="_blank" rel="noopener noreferrer">
                          <span className={styles.senderName}>{name}</span>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M14.8 0H1.2C.5 0 0 .5 0 1.2v13.6c0 .7.5 1.2 1.2 1.2h13.6c.7 0 1.2-.5 1.2-1.2V1.2C16 .5 15.5 0 14.8 0ZM4.8 13.6H2.4V6h2.4v7.6ZM3.6 5a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm10 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 1.9v3.8H6.2V6h2.3v1h.1a2.5 2.5 0 0 1 2.2-1.2c2.4 0 2.8 1.6 2.8 3.6v4.2Z" />
                          </svg>
                          <span className={styles.srOnly}>, LinkedIn profile (opens in a new tab)</span>
                        </a>
                        <blockquote className={styles.bubble}>
                          {quote.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </blockquote>
                      </div>
                    </div>
                    <div className={styles.typing} data-indicator aria-hidden="true">
                      <span className={styles.avatar}>{initials}</span>
                      <span className={styles.dots}><i /><i /><i /></span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.homeBar} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
