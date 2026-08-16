"use client";

import { motion } from "framer-motion";
import { EDUCATION_DATA } from "@/lib/railway/stations";

/**
 * EducationStation — station-board style panel for Platform 02.
 * Displays institution, degree, CGPA, period, and coursework chips.
 */
export default function EducationStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-railway)" }}
    >
      <div
        style={{
          background: "#0A0F0A",
          border: "2px solid #F4C430",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(244,196,48,0.08)",
        }}
      >
        {/* Board header */}
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
            PLATFORM 02 · EDUCATION JUNCTION
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(244,196,48,0.55)",
              letterSpacing: "2px",
            }}
          >
            ARR 2022 · DEP 2026
          </span>
        </div>

        {/* Main content */}
        <div style={{ padding: "28px 32px" }}>
          {/* Institution */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "2px",
              marginBottom: 4,
            }}
          >
            {EDUCATION_DATA.institution.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6B7280",
              letterSpacing: "0.5px",
              marginBottom: 22,
            }}
          >
            {EDUCATION_DATA.institutionFull}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, #F4C430, transparent)",
              opacity: 0.35,
              marginBottom: 22,
            }}
          />

          {/* Degree + CGPA row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              alignItems: "start",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "#6B7280",
                  letterSpacing: "3px",
                  marginBottom: 6,
                }}
              >
                DEGREE
              </div>
              <div
                style={{
                  fontSize: "clamp(13px, 2vw, 15px)",
                  color: "#D4C9B8",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {EDUCATION_DATA.degree}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "#6B7280",
                  letterSpacing: "3px",
                  marginBottom: 4,
                }}
              >
                CGPA
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontWeight: 700,
                  color: "#F4C430",
                  letterSpacing: "2px",
                  lineHeight: 1,
                }}
              >
                {EDUCATION_DATA.cgpa}
              </div>
            </div>
          </div>

          {/* Period */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 26,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "#A8C8A8",
                letterSpacing: "3px",
              }}
            >
              {EDUCATION_DATA.period}
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background: "linear-gradient(90deg, rgba(168,200,168,0.4), transparent)",
              }}
            />
          </div>

          {/* Coursework */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "#6B7280",
              letterSpacing: "3px",
              marginBottom: 12,
            }}
          >
            COURSEWORK
          </div>
          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
              hidden: {},
            }}
          >
            {EDUCATION_DATA.highlights.map((course) => (
              <motion.span
                key={course}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                style={{
                  padding: "4px 12px",
                  background: "rgba(26,58,42,0.6)",
                  border: "1px solid rgba(168,200,168,0.18)",
                  borderRadius: 2,
                  fontSize: 11,
                  color: "#A8C8A8",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.5px",
                }}
              >
                {course}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
