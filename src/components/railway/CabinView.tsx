"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface CabinViewProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cabin View — a full-screen overlay triggered when the user clicks
 * the locomotive's cabin windows. Animates in with a circle-expand
 * transition (FR-29 / FR-30).
 *
 * Shows an "engineer's perspective" with:
 *  - Passing dark landscape behind frosted glass
 *  - Hero introduction card for Deepak
 *  - "BACK TO PLATFORM" dismiss button
 */
export default function CabinView({ isOpen, onClose }: CabinViewProps) {
  const landscapeRef = useRef<HTMLDivElement>(null);

  /* Continuous horizontal scroll for the fake passing landscape */
  useEffect(() => {
    if (!isOpen || !landscapeRef.current) return;

    const el = landscapeRef.current;
    const tween = gsap.to(el, {
      x: "-50%",
      duration: 12,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
      gsap.set(el, { x: "0%" });
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cabin-view"
          initial={{ clipPath: "circle(0% at 67% 62%)", opacity: 0 }}
          animate={{ clipPath: "circle(150% at 67% 62%)", opacity: 1 }}
          exit={{ clipPath: "circle(0% at 67% 62%)", opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "linear-gradient(160deg, #0B180B 0%, #111E11 45%, #0D1A0D 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Cabin View — About Deepak"
        >
          {/* ── Passing landscape strip ──────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          >
            <div
              ref={landscapeRef}
              style={{
                position: "absolute",
                bottom: "22%",
                left: 0,
                width: "200%",
                height: "28%",
                background:
                  "linear-gradient(90deg, #1A3A2A 0%, #243E28 8%, #1A2E1E 16%, " +
                  "#2A4A30 24%, #1C3420 32%, #283C26 40%, #1A3A2A 50%, " +
                  "#243E28 58%, #1A2E1E 66%, #2A4A30 74%, #1C3420 82%, " +
                  "#283C26 90%, #1A3A2A 100%)",
              }}
            />
            {/* Silhouette treeline */}
            <svg
              style={{
                position: "absolute",
                bottom: "26%",
                left: 0,
                width: "200%",
                height: "14%",
              }}
              viewBox="0 0 2880 80"
              preserveAspectRatio="none"
            >
              {Array.from({ length: 72 }).map((_, i) => (
                <polygon
                  key={i}
                  points={`${i * 40},80 ${i * 40 + 20},${10 + ((i * 17 + 3) % 40)} ${i * 40 + 40},80`}
                  fill="#0D1E0D"
                />
              ))}
            </svg>
          </div>

          {/* ── Rain streaks on glass ──────────────────────────── */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1={`${5 + i * 5.5}%`}
                y1="0"
                x2={`${3 + i * 5.5}%`}
                y2="100%"
                stroke="white"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* ── Window frame border ───────────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "24px solid #111",
              boxShadow:
                "inset 0 0 80px rgba(0,0,0,0.9), inset 0 0 30px rgba(20,50,20,0.3)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          {/* Corner rivets */}
          {([
            { top: 28, left: 28 },
            { top: 28, right: 28 },
            { bottom: 28, left: 28 },
            { bottom: 28, right: 28 },
          ] as React.CSSProperties[]).map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#2A2A2A",
                border: "1px solid #444",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* ── Top window reflection ─────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 26,
              left: 26,
              right: 26,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.04) 70%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* ── Hero card ─────────────────────────────────────── */}
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ delay: 0.28, duration: 0.48, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 10,
              background: "rgba(8, 10, 8, 0.84)",
              border: "1px solid rgba(244, 196, 48, 0.28)",
              borderRadius: 3,
              padding: "44px 52px",
              maxWidth: 500,
              width: "88%",
              textAlign: "center",
              backdropFilter: "blur(16px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* Train ID badge */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "4px",
                color: "#F4C430",
                marginBottom: 20,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              DX-2026 · ENGINEER ON DUTY
            </div>

            {/* Name */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5.5vw, 52px)",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "3px",
                marginBottom: 8,
                lineHeight: 1.05,
              }}
            >
              DEEPAK
            </h1>

            {/* Role */}
            <div
              style={{
                fontFamily: "var(--font-railway)",
                fontSize: "clamp(13px, 2vw, 17px)",
                color: "#A8C8A8",
                letterSpacing: "4px",
                marginBottom: 28,
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              Software Engineer
            </div>

            {/* Divider */}
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(244,196,48,0.3)",
                margin: "0 auto 28px",
              }}
            />

            {/* Bio */}
            <p
              style={{
                fontFamily: "var(--font-railway)",
                fontSize: 14.5,
                color: "rgba(245, 240, 232, 0.62)",
                lineHeight: 1.75,
                maxWidth: 340,
                margin: "0 auto 36px",
              }}
            >
              Building scalable products at the intersection of clean
              architecture and thoughtful UX. Currently at Ashwam —
              full-stack with Next.js, TypeScript &amp; Node.
            </p>

            {/* Stat row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 32,
                marginBottom: 36,
              }}
            >
              {[
                { label: "YEAR", value: "2026" },
                { label: "CGPA", value: "8.43" },
                { label: "STACK", value: "T3" },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      color: "#F4C430",
                      fontWeight: 700,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "rgba(244,196,48,0.4)",
                      letterSpacing: "2px",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Dismiss button */}
            <button
              onClick={onClose}
              style={{
                padding: "11px 36px",
                background: "transparent",
                border: "1px solid rgba(244, 196, 48, 0.55)",
                borderRadius: 2,
                color: "#F4C430",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "3px",
                cursor: "pointer",
                transition: "background 0.18s ease, color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F4C430";
                e.currentTarget.style.color = "#0A0A0A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#F4C430";
              }}
            >
              BACK TO PLATFORM
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
