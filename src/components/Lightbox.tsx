"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Lightbox.module.css";

interface Props {
  images: string[];
  altTexts: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, altTexts, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [fading, setFading] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Prevent page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === "ArrowRight") go("next");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function go(dir: "prev" | "next") {
    const next = dir === "next"
      ? Math.min(index + 1, images.length - 1)
      : Math.max(index - 1, 0);
    if (next === index) return;
    setFading(true);
    setTimeout(() => { setIndex(next); setFading(false); }, 150);
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    // Swipe down to close
    if (dy > 80 && dy > Math.abs(dx) * 2) { onClose(); return; }
    // Swipe left / right
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
      go(dx < 0 ? "next" : "prev");
    }
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        ref={closeRef}
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close image viewer"
      >
        ✕
      </button>

      {/* Image */}
      <div className={`${styles.imageWrap} ${fading ? styles.fading : ""}`}>
        <Image
          src={images[index]}
          alt={altTexts[index] ?? `Image ${index + 1} of ${images.length}`}
          fill
          className={styles.image}
          sizes="90vw"
        />
      </div>

      {/* Navigation row: prev · counter · next — sits below the image */}
      <div className={styles.navRow}>
        <button
          className={styles.navBtn}
          onClick={() => go("prev")}
          disabled={index === 0 || images.length === 1}
          aria-label="Previous image"
        >
          ‹
        </button>
        <p className={styles.counter} aria-live="polite">
          {index + 1} of {images.length}
        </p>
        <button
          className={styles.navBtn}
          onClick={() => go("next")}
          disabled={index === images.length - 1 || images.length === 1}
          aria-label="Next image"
        >
          ›
        </button>
      </div>
    </div>
  );
}
