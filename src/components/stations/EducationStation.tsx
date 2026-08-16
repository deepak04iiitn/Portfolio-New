"use client";

import { motion } from "framer-motion";
import { EDUCATION_DATA } from "@/lib/railway/stations";

/* ── Slide 1: Credentials ────────────────────────────────────── */
function CredentialsSlide() {
  return (
    <div style={{ fontFamily: "var(--font-railway)" }}>
      {/* Institution */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(22px, 4vw, 38px)",
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
          fontSize: 12,
          color: "#6B7280",
          letterSpacing: "0.5px",
          marginBottom: 28,
        }}
      >
        {EDUCATION_DATA.institutionFull}
      </div>

      {/* Gold divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, #87CEEB, transparent)",
          opacity: 0.35,
          marginBottom: 28,
        }}
      />

      {/* Degree + CGPA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "#6B7280",
              letterSpacing: "3px",
              marginBottom: 8,
            }}
          >
            DEGREE
          </div>
          <div
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              color: "#D4C9B8",
              fontWeight: 600,
              lineHeight: 1.45,
            }}
          >
            {EDUCATION_DATA.degree}
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            padding: "12px 20px",
            background: "rgba(135,206,235,0.06)",
            border: "1px solid rgba(135,206,235,0.18)",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
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
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 700,
              color: "#87CEEB",
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
          gap: 14,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            color: "#A8C8A8",
            letterSpacing: "4px",
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
    </div>
  );
}

/* ── Slide 2: Coursework ─────────────────────────────────────── */
function CourseworkSlide() {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          color: "#6B7280",
          letterSpacing: "4px",
          marginBottom: 22,
        }}
      >
        COURSEWORK MANIFEST
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
          hidden:  {},
        }}
        style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
      >
        {EDUCATION_DATA.highlights.map((course) => (
          <motion.div
            key={course}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            style={{
              padding: "14px 20px",
              background: "rgba(26,58,42,0.5)",
              border: "1px solid rgba(135,206,235,0.2)",
              borderLeft: "3px solid #87CEEB",
              borderRadius: 3,
              fontFamily: "var(--font-display)",
              fontSize: 13,
              color: "#D4C9B8",
              letterSpacing: "1px",
              fontWeight: 500,
            }}
          >
            {course}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export const SLIDES: React.ComponentType[] = [CredentialsSlide, CourseworkSlide];
export const SLIDE_LABELS = ["CREDENTIALS", "COURSEWORK"];
