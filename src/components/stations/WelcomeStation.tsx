"use client";

import { motion } from "framer-motion";
import { STATIONS } from "@/lib/railway/stations";

const ROUTE = STATIONS.map((s) => s.displayName);

/**
 * WelcomeStation — shown when stopped at Central Station (Platform 01).
 * Acts as a "journey map" card, orienting the visitor before they depart.
 */
export default function WelcomeStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ maxWidth: 560, margin: "0 auto", fontFamily: "var(--font-railway)" }}
    >
      <div
        style={{
          background: "#0A0F0A",
          border: "2px solid #F4C430",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.65)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1A3A2A",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(244,196,48,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#F4C430",
              letterSpacing: "4px",
            }}
          >
            PLATFORM 01 · CENTRAL STATION
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(244,196,48,0.55)",
              letterSpacing: "2px",
            }}
          >
            DEPARTURE READY
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          {/* Headline */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "3px",
              marginBottom: 6,
            }}
          >
            WELCOME ABOARD
          </div>
          <div
            style={{
              fontFamily: "var(--font-railway)",
              fontSize: 13,
              color: "#6B7280",
              letterSpacing: "1px",
              marginBottom: 24,
            }}
          >
            An interactive portfolio by Deepak · B.Tech ECE · IIIT Nagpur 2026
          </div>

          {/* Gold divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, #F4C430, transparent)",
              opacity: 0.35,
              marginBottom: 24,
            }}
          />

          {/* Journey route */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "#6B7280",
              letterSpacing: "3px",
              marginBottom: 14,
            }}
          >
            YOUR JOURNEY TODAY
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ROUTE.map((name, i) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "6px 0",
                  borderBottom:
                    i < ROUTE.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                {/* Track dot */}
                <div
                  style={{
                    width: i === 0 ? 10 : 6,
                    height: i === 0 ? 10 : 6,
                    borderRadius: "50%",
                    background: i === 0 ? "#F4C430" : "rgba(168,200,168,0.4)",
                    border: i === 0 ? "none" : "1px solid rgba(168,200,168,0.2)",
                    flexShrink: 0,
                    boxShadow: i === 0 ? "0 0 8px rgba(244,196,48,0.5)" : "none",
                  }}
                />
                {/* Connector line (all but last) */}
                {i < ROUTE.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      marginLeft: 4,
                      marginTop: 16,
                      width: 2,
                      height: 8,
                      background: "rgba(168,200,168,0.15)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: i === 0 ? "#F4C430" : "#A8C8A8",
                    letterSpacing: "2px",
                    fontWeight: i === 0 ? 700 : 400,
                  }}
                >
                  {name.toUpperCase()}
                </span>
                {i === 0 && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "rgba(244,196,48,0.45)",
                      letterSpacing: "2px",
                      marginLeft: "auto",
                    }}
                  >
                    YOU ARE HERE
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Instruction hint */}
          <div
            style={{
              marginTop: 24,
              padding: "10px 14px",
              background: "rgba(244,196,48,0.05)",
              border: "1px solid rgba(244,196,48,0.12)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(244,196,48,0.5)",
              letterSpacing: "2px",
              lineHeight: 1.7,
            }}
          >
            PRESS DEPART → TO BEGIN · USE ARROW KEYS OR CLICK STATION PILLS
            TO NAVIGATE · CLICK CABIN WINDOWS FOR ABOUT ME
          </div>
        </div>
      </div>
    </motion.div>
  );
}
