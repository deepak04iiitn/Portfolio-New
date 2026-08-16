"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import { warmAudioCtx } from "@/lib/audio/sounds";
import type { StationId } from "@/lib/railway/types";

/**
 * BoardingScreen — cinematic first-boot gate (Phase 6 design).
 *
 * Visual: "INDIAN RAILWAYS" style ticket — Train ID, route, platform,
 *         primary CTA, and a direct-access station strip.
 *
 * Logic (Phase 3):
 *   • Shown while phase === "LOADING" | "BOARDING"
 *   • On "BOARD" click: play exit → enableAudio → setPhase("IDLE")
 *   • On direct station click: play exit → enableAudio → jumpToStation(id)
 *   • Enter / Space triggers boarding from keyboard
 */
export default function BoardingScreen() {
  const { phase, setPhase, enableAudio, jumpToStation } = useJourneyStore();
  const visible = phase === "BOARDING";
  const [leaving, setLeaving] = useState(false);
  const pendingJumpRef = useRef<StationId | null>(null);

  /* ── Board the train (main CTA) ────────────────────────────── */
  const handleBoard = () => {
    if (leaving) return;
    /*
     * warmAudioCtx() MUST be called here, directly in the click handler,
     * while the user gesture is still on the call stack.
     * Chrome / Safari only allow AudioContext.resume() during a gesture —
     * if we wait until AudioManager's useEffect the window has closed.
     */
    warmAudioCtx();
    pendingJumpRef.current = null;
    setLeaving(true);
    enableAudio();
  };

  /* ── Direct station jump ────────────────────────────────────── */
  const handleJump = (id: StationId) => {
    if (leaving) return;
    warmAudioCtx();
    pendingJumpRef.current = id;
    setLeaving(true);
    enableAudio();
  };

  /* ── After exit animation completes ────────────────────────── */
  const handleExitComplete = () => {
    if (!leaving) return;
    if (pendingJumpRef.current) {
      jumpToStation(pendingJumpRef.current);
    } else {
      setPhase("IDLE");
    }
  };

  /* Reset on re-show */
  useEffect(() => {
    if (visible) {
      setLeaving(false);
      pendingJumpRef.current = null;
    }
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
          exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeIn" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(160deg, #0A0F0A 0%, #0D180D 50%, #080C08 100%)",
            fontFamily: "var(--font-railway)",
            overflowY: "auto",
            padding: "24px",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Board the Deepak Express"
        >
          {/* Background texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.007) 40px, rgba(255,255,255,0.007) 41px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              width: "100%",
              maxWidth: 640,
              position: "relative",
            }}
          >
            {/* ── Railway ticket card ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                border: "2px solid rgba(244,196,48,0.6)",
                borderRadius: 4,
                marginBottom: 24,
                overflow: "hidden",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(244,196,48,0.04)",
              }}
            >
              {/* Ticket header band */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1A3A2A, #0D180D)",
                  padding: "18px 28px",
                  borderBottom: "1px solid rgba(244,196,48,0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(17px, 3vw, 22px)",
                      fontWeight: 700,
                      color: "#F4C430",
                      letterSpacing: "4px",
                      marginBottom: 4,
                    }}
                  >
                    INDIAN RAILWAYS
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: "rgba(244,196,48,0.45)",
                      letterSpacing: "4px",
                    }}
                  >
                    PORTFOLIO EXPRESS · CLASS: ENGINEERING
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 22,
                      color: "#F4C430",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      lineHeight: 1,
                    }}
                  >
                    DK-0402
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "#2ECC71",
                      letterSpacing: "3px",
                      marginTop: 4,
                    }}
                  >
                    ● ON TIME
                  </div>
                </div>
              </div>

              {/* Route row */}
              <div
                style={{
                  padding: "20px 28px",
                  background: "#0A0A0A",
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "#5C6370",
                      letterSpacing: "3px",
                      marginBottom: 6,
                    }}
                  >
                    ORIGIN
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(14px, 2.5vw, 18px)",
                      color: "#F5F0E8",
                      fontWeight: 600,
                      letterSpacing: "2px",
                    }}
                  >
                    GORAKHPUR
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "rgba(244,196,48,0.4)",
                    letterSpacing: "2px",
                  }}
                >
                  →
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "#5C6370",
                      letterSpacing: "3px",
                      marginBottom: 6,
                    }}
                  >
                    DESTINATION
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(14px, 2.5vw, 18px)",
                      color: "#A8C8A8",
                      fontWeight: 600,
                      letterSpacing: "2px",
                    }}
                  >
                    SOFTWARE ENGINEER
                  </div>
                </div>
              </div>

              {/* Platform footer */}
              <div
                style={{
                  background: "#1A3A2A",
                  padding: "8px 28px",
                  borderTop: "1px solid rgba(244,196,48,0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(244,196,48,0.6)",
                    letterSpacing: "4px",
                  }}
                >
                  PLATFORM 01
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "#A8C8A8",
                    letterSpacing: "3px",
                  }}
                >
                  DEP: NOW
                </span>
              </div>
            </motion.div>

            {/* ── Primary CTA ─────────────────────────────────── */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              onClick={handleBoard}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              style={{
                width: "100%",
                padding: "18px 24px",
                background: "#F4C430",
                border: "none",
                borderRadius: 3,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 2.5vw, 17px)",
                fontWeight: 700,
                color: "#0A0A0A",
                letterSpacing: "5px",
                cursor: "pointer",
                marginBottom: 16,
                display: "block",
                boxShadow: "0 4px 20px rgba(244,196,48,0.25)",
              }}
            >
              BOARD DEEPAK EXPRESS
            </motion.button>

            {/* ── Direct station access ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{
                border: "1px solid rgba(244,196,48,0.14)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "9px 16px",
                  background: "rgba(26,58,42,0.18)",
                  borderBottom: "1px solid rgba(244,196,48,0.1)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  color: "#5C6370",
                  letterSpacing: "4px",
                }}
              >
                EXPLORE JOURNEY — DIRECT ACCESS
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                {STATIONS.filter((s) => s.id !== "welcome").map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleJump(station.id as StationId)}
                    style={{
                      flex: 1,
                      padding: "12px 4px",
                      background: "transparent",
                      border: "none",
                      borderRight: "1px solid rgba(244,196,48,0.08)",
                      color: "#6B7280",
                      fontFamily: "var(--font-mono)",
                      fontSize: 7,
                      letterSpacing: "1.5px",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#F4C430";
                      e.currentTarget.style.background = "rgba(26,58,42,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6B7280";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {station.displayName.split(" ")[0]}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Keyboard hint */}
            <div
              style={{
                marginTop: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                color: "#2A3A2A",
                textAlign: "center",
                letterSpacing: "2px",
              }}
            >
              PRESS ENTER OR SPACE TO BOARD
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
