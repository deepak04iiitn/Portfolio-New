"use client";

import { motion } from "framer-motion";
import { EDUCATION_DATA } from "@/lib/railway/stations";

const ACCENT = "#87CEEB";

function EducationSlide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font-railway)" }}>

      {/* ── Institution ── */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 700,
          color: "#F5F0E8",
          letterSpacing: "3px",
          lineHeight: 1.1,
          marginBottom: 4,
        }}
      >
        {EDUCATION_DATA.institution.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#6B7280",
          letterSpacing: "0.5px",
          marginBottom: 18,
        }}
      >
        {EDUCATION_DATA.institutionFull}
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${ACCENT}55, transparent)`,
          marginBottom: 18,
        }}
      />

      {/* ── Degree + CGPA row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "start",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "#4B5563",
              letterSpacing: "3px",
              marginBottom: 6,
            }}
          >
            DEGREE
          </div>
          <div
            style={{
              fontSize: "clamp(13px, 1.8vw, 15px)",
              color: "#D4C9B8",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            {EDUCATION_DATA.degree}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "#A8C8A8",
              letterSpacing: "3px",
              marginTop: 8,
            }}
          >
            {EDUCATION_DATA.period}
          </div>
        </div>

        {/* CGPA badge */}
        <div
          style={{
            textAlign: "center",
            padding: "10px 18px",
            background: `${ACCENT}08`,
            border: `1px solid ${ACCENT}22`,
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "#4B5563",
              letterSpacing: "3px",
              marginBottom: 4,
            }}
          >
            CGPA
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: "2px",
              lineHeight: 1,
            }}
          >
            {EDUCATION_DATA.cgpa}
          </div>
        </div>
      </div>

      {/* ── Coursework ── */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            color: "#4B5563",
            letterSpacing: "3px",
            marginBottom: 12,
          }}
        >
          COURSEWORK
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            hidden:  {},
          }}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {EDUCATION_DATA.highlights.map((course, i) => (
            <motion.div
              key={course}
              variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "11px 16px",
                background: `${ACCENT}07`,
                border: `1px solid ${ACCENT}18`,
                borderLeft: `3px solid ${ACCENT}`,
                borderRadius: "0 4px 4px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: `${ACCENT}55`,
                  flexShrink: 0,
                  minWidth: 18,
                  letterSpacing: "1px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                  color: "#D4C9B8",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                {course}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export const SLIDES: React.ComponentType[] = [EducationSlide];
export const SLIDE_LABELS = ["EDUCATION"];
