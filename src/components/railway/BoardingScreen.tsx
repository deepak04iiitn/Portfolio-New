"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";

/**
 * BoardingScreen — cinematic first-boot gate.
 *
 * Shown while phase === "LOADING" | "BOARDING".
 * On "BOARD THE TRAIN" click:
 *  1. Plays exit animation
 *  2. Calls enableAudio() (unlocks AudioManager after user gesture)
 *  3. Sets phase → "IDLE" (reveals the railway world)
 */
export default function BoardingScreen() {
  const { phase, setPhase, enableAudio } = useJourneyStore();
  const visible = phase === "LOADING" || phase === "BOARDING";
  const [leaving, setLeaving] = useState(false);

  const handleBoard = () => {
    if (leaving) return;
    setLeaving(true);
    enableAudio();
  };

  /* After the exit animation completes, advance the phase */
  const handleExitComplete = () => {
    if (leaving) {
      setPhase("IDLE");
    }
  };

  /* Reset leaving state if somehow shown again */
  useEffect(() => {
    if (visible) setLeaving(false);
  }, [visible]);

  /* Keyboard: Enter / Space → board */
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") handleBoard();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, leaving]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && !leaving && (
        <motion.div
          key="boarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeIn" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "linear-gradient(160deg, #060B06 0%, #0D150D 55%, #060A06 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Board the Deepak Express"
        >
          {/* ── Film grain overlay ────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              pointerEvents: "none",
              opacity: 0.4,
            }}
          />

          {/* ── Horizontal rule lines (station board aesthetic) ── */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(244,196,48,0.15) 20%, rgba(244,196,48,0.15) 80%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "14%",
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(244,196,48,0.15) 20%, rgba(244,196,48,0.15) 80%, transparent 100%)",
            }}
          />

          {/* ── Main content area ─────────────────────────────── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              maxWidth: 520,
              width: "90%",
            }}
          >
            {/* Line 1: train ID */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                fontSize: 10,
                letterSpacing: "6px",
                color: "rgba(244,196,48,0.5)",
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              DX-2026 · PLATFORM 01 · CENTRAL STATION
            </motion.div>

            {/* Line 2: main title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 8vw, 72px)",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "6px",
                lineHeight: 1,
                textAlign: "center",
                margin: 0,
                marginBottom: 12,
              }}
            >
              DEEPAK
            </motion.h1>

            {/* Line 3: subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(11px, 2vw, 16px)",
                color: "#A8C8A8",
                letterSpacing: "10px",
                textAlign: "center",
                marginBottom: 40,
                fontWeight: 500,
              }}
            >
              EXPRESS
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              style={{
                width: "100%",
                maxWidth: 280,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent)",
                transformOrigin: "center",
                marginBottom: 40,
              }}
            />

            {/* Journey route */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 48,
              }}
            >
              {[
                "CENTRAL",
                "EDUCATION",
                "EXPERIENCE",
                "PROJECTS",
                "SKILLS",
                "CONTACT",
              ].map((stop, i, arr) => (
                <div
                  key={stop}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color:
                        i === 0
                          ? "#F4C430"
                          : "rgba(168,200,168,0.5)",
                      letterSpacing: "2px",
                    }}
                  >
                    {stop}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      style={{ fontSize: 9, color: "rgba(92,99,112,0.4)" }}
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* BOARD button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              onClick={handleBoard}
              style={{
                padding: "16px 52px",
                background: "#F4C430",
                border: "none",
                borderRadius: 2,
                color: "#0A0A0A",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "5px",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
                marginBottom: 20,
                boxShadow: "0 8px 32px rgba(244,196,48,0.25)",
                transition: "transform 0.1s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(244,196,48,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(244,196,48,0.25)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              BOARD THE TRAIN
            </motion.button>

            {/* Keyboard hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              style={{
                fontSize: 9,
                color: "rgba(92,99,112,0.5)",
                letterSpacing: "2px",
              }}
            >
              PRESS ENTER OR SPACE TO BOARD
            </motion.div>
          </div>

          {/* ── Bottom ticker tape ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            style={{
              position: "absolute",
              bottom: "6%",
              left: 0,
              right: 0,
              overflow: "hidden",
              height: 20,
              borderTop: "1px solid rgba(244,196,48,0.06)",
              borderBottom: "1px solid rgba(244,196,48,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                animation: "ticker-scroll 28s linear infinite",
                fontSize: 9,
                color: "rgba(244,196,48,0.2)",
                letterSpacing: "3px",
                lineHeight: "20px",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} style={{ paddingRight: 80 }}>
                  DEEPAK EXPRESS · DX-2026 · PORTFOLIO JOURNEY · ALL ABOARD ·
                  PLATFORM 01 · DEPARTURE IMMINENT · DESTINATIONS: EDUCATION ·
                  EXPERIENCE · PROJECTS · SKILLS · CONTACT ·
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Ticker animation keyframe ─────────────────────── */}
          <style>{`
            @keyframes ticker-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
