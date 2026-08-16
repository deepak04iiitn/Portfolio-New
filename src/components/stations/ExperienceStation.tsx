"use client";

import { motion } from "framer-motion";
import { EXPERIENCE_DATA } from "@/lib/railway/stations";

/* One slide component per experience entry, plus a responsibilities slide */

function makeOverviewSlide(idx: number): React.ComponentType {
  const exp = EXPERIENCE_DATA[idx];
  return function OverviewSlide() {
    return (
      <div style={{ fontFamily: "var(--font-railway)" }}>
        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
              boxShadow: exp.status === "ACTIVE" ? "0 0 8px #2ECC71" : "0 0 8px #F4C430",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
              letterSpacing: "3px",
            }}
          >
            {exp.status === "ACTIVE" ? "CURRENTLY ACTIVE" : "COMPLETED"}
          </span>
        </div>

        {/* Company */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4.5vw, 44px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "3px",
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {exp.company.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(168,200,168,0.55)",
            letterSpacing: "2px",
            marginBottom: 28,
          }}
        >
          {exp.location}
        </div>

        {/* Gold divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, #E88B5A55, transparent)",
            marginBottom: 22,
          }}
        />

        {/* Role + Period row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                color: "#6B7280",
                letterSpacing: "3px",
                marginBottom: 6,
              }}
            >
              ROLE
            </div>
            <div
              style={{
                fontSize: "clamp(14px, 2vw, 17px)",
                color: "#A8C8A8",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              {exp.role}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                color: "#6B7280",
                letterSpacing: "3px",
                marginBottom: 6,
              }}
            >
              PERIOD
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "#D4C9B8",
                letterSpacing: "1px",
              }}
            >
              {exp.period}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

function makeResponsibilitiesSlide(idx: number): React.ComponentType {
  const exp = EXPERIENCE_DATA[idx];
  return function ResponsibilitiesSlide() {
    return (
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "#6B7280",
            letterSpacing: "4px",
            marginBottom: 20,
          }}
        >
          {exp.company.toUpperCase()} · RESPONSIBILITIES
        </div>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }, hidden: {} }}
          style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}
        >
          {exp.responsibilities.map((r, i) => (
            <motion.li
              key={i}
              variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "14px 16px",
                background: "rgba(26,58,42,0.2)",
                border: "1px solid rgba(232,139,90,0.12)",
                borderLeft: "3px solid rgba(232,139,90,0.5)",
                borderRadius: 3,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#E88B5A",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                →
              </span>
              <span
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: 14,
                  color: "#D4C9B8",
                  lineHeight: 1.6,
                }}
              >
                {r}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    );
  };
}

/* Build slides array: [overview, responsibilities] per entry */
export const SLIDES: React.ComponentType[] = EXPERIENCE_DATA.flatMap((_, i) => [
  makeOverviewSlide(i),
  makeResponsibilitiesSlide(i),
]);

export const SLIDE_LABELS: string[] = EXPERIENCE_DATA.flatMap((exp) => [
  exp.company.toUpperCase(),
  "RESPONSIBILITIES",
]);
