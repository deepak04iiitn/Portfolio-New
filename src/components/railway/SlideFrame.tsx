"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";

interface SlideFrameProps {
  slides: React.ComponentType[];
  accent: string;
  /** Optional label shown for each slide (e.g. "CREDENTIALS", "COURSEWORK") */
  labels?: string[];
}

/* Hex → "r, g, b" for rgba() usage */
function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`
    : "244, 196, 48";
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

/**
 * SlideFrame — renders an array of slide components one at a time.
 *
 * Navigation:
 *  • Drag / swipe left-right (mouse or touch).
 *  • Click the ‹ › arrow buttons on the sides.
 *  • Click any dot in the indicator row.
 *
 * When station changes the parent remounts this via key prop,
 * so `current` resets to 0 automatically.
 */
export default function SlideFrame({ slides, accent, labels }: SlideFrameProps) {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = back

  const total   = slides.length;
  const hasMany = total > 1;

  const go = (next: number) => {
    if (next < 0 || next >= total) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  /* ── Keyboard navigation ──────────────────────────────────── */
  useEffect(() => {
    if (!hasMany) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      if (e.key === "ArrowLeft") {
        e.stopImmediatePropagation(); // prevent global ArrowLeft shortcuts
        go(current - 1);
      } else if (e.key === "ArrowRight") {
        e.stopImmediatePropagation(); // prevent global ArrowRight → DEPART
        go(current + 1);
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total, hasMany]);

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const DIST = 60;
    const VEL  = 280;
    if (info.offset.x < -DIST || info.velocity.x < -VEL) go(current + 1);
    else if (info.offset.x > DIST || info.velocity.x > VEL) go(current - 1);
  };

  const SlideContent = slides[current];
  const rgb          = hexToRgb(accent);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Top slide indicator bar ─────────────────────────────── */}
      {hasMany && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px 6px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Current slide label */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "4px",
              color: `rgba(${rgb}, 0.6)`,
            }}
          >
            {labels?.[current] ?? `PAGE ${current + 1}`}
          </span>

          {/* Dot row */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? 22 : 7,
                  height: 4,
                  borderRadius: 2,
                  border: "none",
                  padding: 0,
                  background: i === current ? accent : `rgba(${rgb}, 0.25)`,
                  cursor: "pointer",
                  transition: "width 0.32s ease, background 0.32s ease",
                  flexShrink: 0,
                }}
              />
            ))}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                color: `rgba(${rgb}, 0.35)`,
                letterSpacing: "2px",
                marginLeft: 6,
              }}
            >
              {current + 1}&thinsp;/&thinsp;{total}
            </span>
          </div>
        </div>
      )}

      {/* ── Slide viewport ──────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.85 }}
            drag={hasMany ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={onDragEnd}
            style={{
              position: "absolute",
              inset: 0,
              padding: "22px 44px 22px 28px", /* right extra for arrow button */
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              cursor: hasMany ? "grab" : "default",
              userSelect: "none",
            }}
          >
            <SlideContent />
          </motion.div>
        </AnimatePresence>

        {/* ── Left arrow ──────────────────────────────────────── */}
        {hasMany && current > 0 && (
          <button
            onClick={() => go(current - 1)}
            aria-label="Previous slide"
            style={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `rgba(${rgb}, 0.08)`,
              border: `1px solid rgba(${rgb}, 0.25)`,
              color: accent,
              fontSize: 18,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 5,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${rgb}, 0.18)`;
              e.currentTarget.style.borderColor = `rgba(${rgb}, 0.55)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${rgb}, 0.08)`;
              e.currentTarget.style.borderColor = `rgba(${rgb}, 0.25)`;
            }}
          >
            ‹
          </button>
        )}

        {/* ── Right arrow ─────────────────────────────────────── */}
        {hasMany && current < total - 1 && (
          <button
            onClick={() => go(current + 1)}
            aria-label="Next slide"
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `rgba(${rgb}, 0.08)`,
              border: `1px solid rgba(${rgb}, 0.25)`,
              color: accent,
              fontSize: 18,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 5,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${rgb}, 0.18)`;
              e.currentTarget.style.borderColor = `rgba(${rgb}, 0.55)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${rgb}, 0.08)`;
              e.currentTarget.style.borderColor = `rgba(${rgb}, 0.25)`;
            }}
          >
            ›
          </button>
        )}

        {/* Swipe hint — fades in on first render, hidden when only 1 slide */}
        {hasMany && current === 0 && (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.8, duration: 1.2 }}
            style={{
              position: "absolute",
              bottom: 14,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: `rgba(${rgb}, 0.5)`,
              letterSpacing: "3px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            SWIPE · DRAG · ← → KEYS
          </motion.div>
        )}
      </div>
    </div>
  );
}
