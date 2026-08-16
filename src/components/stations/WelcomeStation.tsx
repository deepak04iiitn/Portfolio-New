"use client";

import { motion } from "framer-motion";
import { STATIONS } from "@/lib/railway/stations";

/* ── Slide 1: Welcome aboard ─────────────────────────────────── */
function WelcomeSlide() {
  return (
    <div style={{ fontFamily: "var(--font-railway)" }}>
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(244,196,48,0.5)",
            letterSpacing: "6px",
            marginBottom: 10,
          }}
        >
          PASSENGER MANIFEST
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "4px",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          DEEPAK
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "#F4C430",
            letterSpacing: "5px",
            fontWeight: 600,
          }}
        >
          SOFTWARE DEVELOPER
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, #F4C430, transparent)",
          opacity: 0.3,
          marginBottom: 22,
        }}
      />

      {/* Fact chips */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
        style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
      >
        {[
          { label: "INSTITUTE",  value: "IIIT NAGPUR" },
          { label: "DEGREE",     value: "B.TECH ECE" },
          { label: "BATCH",      value: "2022 – 2026" },
          { label: "TRAIN",      value: "DK-0402" },
          { label: "ORIGIN",     value: "GORAKHPUR" },
          { label: "DESTINATION",value: "SOFTWARE ENGINEER" },
        ].map(({ label, value }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            style={{
              padding: "10px 16px",
              background: "rgba(244,196,48,0.05)",
              border: "1px solid rgba(244,196,48,0.15)",
              borderRadius: 3,
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                color: "rgba(244,196,48,0.5)",
                letterSpacing: "3px",
                marginBottom: 4,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 12,
                color: "#F5F0E8",
                letterSpacing: "1.5px",
                fontWeight: 600,
              }}
            >
              {value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Instruction hint */}
      <div
        style={{
          marginTop: 24,
          padding: "10px 14px",
          background: "rgba(244,196,48,0.04)",
          border: "1px solid rgba(244,196,48,0.1)",
          borderRadius: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          color: "rgba(244,196,48,0.4)",
          letterSpacing: "2px",
          lineHeight: 1.7,
        }}
      >
        PRESS DEPART → TO BEGIN · USE ARROW KEYS OR STATION PILLS TO NAVIGATE
      </div>
    </div>
  );
}

/* ── Slide 2: Journey route ──────────────────────────────────── */
function RouteSlide() {
  return (
    <div style={{ fontFamily: "var(--font-mono)" }}>
      <div
        style={{
          fontSize: 8,
          color: "rgba(244,196,48,0.5)",
          letterSpacing: "5px",
          marginBottom: 20,
        }}
      >
        YOUR JOURNEY TODAY
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {STATIONS.map((station, i) => (
          <div
            key={station.id}
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 16,
            }}
          >
            {/* Track line + dot */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 20,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: i === 0 ? 12 : 8,
                  height: i === 0 ? 12 : 8,
                  borderRadius: "50%",
                  background: i === 0 ? "#F4C430" : "rgba(168,200,168,0.45)",
                  border: i === 0 ? "none" : "1px solid rgba(168,200,168,0.25)",
                  flexShrink: 0,
                  boxShadow: i === 0 ? "0 0 10px rgba(244,196,48,0.5)" : "none",
                  marginTop: 2,
                }}
              />
              {i < STATIONS.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    minHeight: 28,
                    background: "rgba(168,200,168,0.15)",
                    margin: "4px 0",
                  }}
                />
              )}
            </div>

            {/* Station info */}
            <div
              style={{
                paddingBottom: i < STATIONS.length - 1 ? 16 : 0,
                paddingTop: 0,
              }}
            >
              <div
                style={{
                  fontSize: 7,
                  color: "rgba(244,196,48,0.4)",
                  letterSpacing: "3px",
                  marginBottom: 2,
                }}
              >
                {station.platformLabel.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? "#F4C430" : "#A8C8A8",
                  letterSpacing: "2px",
                  fontFamily: "var(--font-display)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {station.displayName.toUpperCase()}
                {i === 0 && (
                  <span
                    style={{
                      fontSize: 7,
                      color: "rgba(244,196,48,0.45)",
                      letterSpacing: "2px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 400,
                    }}
                  >
                    YOU ARE HERE
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SLIDES: React.ComponentType[] = [WelcomeSlide, RouteSlide];
export const SLIDE_LABELS = ["WELCOME ABOARD", "ROUTE MAP"];
