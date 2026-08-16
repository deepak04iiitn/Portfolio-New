"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXPERIENCE_DATA } from "@/lib/railway/stations";

/**
 * ExperienceStation — ARRIVALS / DEPARTURES board.
 * Each row is the experience entry; clicking a row expands the
 * responsibilities drawer.
 */
export default function ExperienceStation() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ maxWidth: 680, margin: "0 auto" }}
    >
      {/* Board outer frame */}
      <div
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(244,196,48,0.4)",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* Board header */}
        <div
          style={{
            background: "#0D0D0D",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(244,196,48,0.25)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              letterSpacing: "6px",
              color: "#F4C430",
              fontWeight: 700,
            }}
          >
            ARRIVALS / DEPARTURES
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2ECC71",
                boxShadow: "0 0 8px #2ECC71",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#2ECC71",
                letterSpacing: "2px",
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* Column headers */}
        <div
          style={{
            background: "#0F0F0F",
            padding: "7px 20px",
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.2fr 1fr",
            gap: 12,
            borderBottom: "2px solid rgba(244,196,48,0.35)",
          }}
        >
          {["COMPANY", "ROLE", "PERIOD", "STATUS"].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#5C6370",
                letterSpacing: "3px",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Experience rows */}
        {EXPERIENCE_DATA.map((exp, i) => (
          <div key={exp.company}>
            {/* Main row */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.15 }}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedIdx === i}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setExpandedIdx(expandedIdx === i ? null : i);
                }
              }}
              style={{
                background: i % 2 === 0 ? "#0D0D0D" : "#0A0A0A",
                padding: "18px 20px",
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1.2fr 1fr",
                gap: 12,
                alignItems: "center",
                cursor: "pointer",
                borderBottom: expandedIdx === i
                  ? "none"
                  : "1px solid rgba(244,196,48,0.08)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(26,58,42,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = i % 2 === 0 ? "#0D0D0D" : "#0A0A0A";
              }}
            >
              {/* Company */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(13px, 2vw, 17px)",
                    fontWeight: 600,
                    color: "#F5F0E8",
                    letterSpacing: "2px",
                  }}
                >
                  {exp.company.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(168,200,168,0.4)",
                    letterSpacing: "1px",
                  }}
                >
                  {exp.location}
                </span>
              </div>

              {/* Role */}
              <div
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: 13,
                  color: "#A8C8A8",
                  fontWeight: 500,
                }}
              >
                {exp.role}
              </div>

              {/* Period */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#6B7280",
                  letterSpacing: "0.5px",
                }}
              >
                {exp.period}
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
                    boxShadow:
                      exp.status === "ACTIVE"
                        ? "0 0 6px #2ECC71"
                        : "0 0 6px #F4C430",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
                    letterSpacing: "2px",
                  }}
                >
                  {exp.status === "ACTIVE" ? "ON TIME" : "COMPLETED"}
                </span>
              </div>
            </motion.div>

            {/* Responsibilities drawer */}
            <AnimatePresence>
              {expandedIdx === i && (
                <motion.div
                  key={`drawer-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "14px 20px 18px",
                      background: "rgba(26,58,42,0.15)",
                      borderBottom: "1px solid rgba(244,196,48,0.1)",
                      borderLeft: "2px solid rgba(244,196,48,0.3)",
                      marginLeft: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 8,
                        color: "#6B7280",
                        letterSpacing: "3px",
                        marginBottom: 10,
                      }}
                    >
                      RESPONSIBILITIES
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {exp.responsibilities.map((r, ri) => (
                        <motion.li
                          key={ri}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ri * 0.07 }}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              color: "#F4C430",
                              fontFamily: "var(--font-mono)",
                              fontSize: 9,
                              marginTop: 3,
                              flexShrink: 0,
                            }}
                          >
                            →
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-railway)",
                              fontSize: 13,
                              color: "#D4C9B8",
                              lineHeight: 1.55,
                            }}
                          >
                            {r}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </motion.div>
  );
}
