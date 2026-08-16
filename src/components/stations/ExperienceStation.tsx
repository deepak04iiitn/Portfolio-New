"use client";

import { motion } from "framer-motion";
import { EXPERIENCE_DATA } from "@/lib/railway/stations";

const ACCENT = "#E88B5A";

/* ── Overview slide: company identity, role progression, stack ── */
function makeOverviewSlide(idx: number): React.ComponentType {
  const exp = EXPERIENCE_DATA[idx];
  const isActive = exp.status === "ACTIVE";

  return function OverviewSlide() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font-railway)" }}>

        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isActive ? "#2ECC71" : "#6B7280",
              boxShadow: isActive ? "0 0 8px #2ECC71" : "none",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: isActive ? "#2ECC71" : "#6B7280",
              letterSpacing: "3px",
            }}
          >
            {isActive ? "CURRENTLY ACTIVE" : "COMPLETED · " + exp.period.split("→")[1]?.trim()}
          </span>
        </div>

        {/* Company name */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "3px",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {(exp.companyFull ?? exp.company).toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(168,200,168,0.45)",
            letterSpacing: "2px",
            marginBottom: 20,
          }}
        >
          {exp.location}
        </div>

        {/* Accent divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${ACCENT}44, transparent)`,
            marginBottom: 22,
          }}
        />

        {/* Role progression timeline — or simple role row */}
        {exp.roleProgression ? (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                color: "#4B5563",
                letterSpacing: "3px",
                marginBottom: 12,
              }}
            >
              CAREER PROGRESSION
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
              {/* vertical rail */}
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12,
                  bottom: 12,
                  width: 2,
                  background: `linear-gradient(180deg, ${ACCENT}55, ${ACCENT}22)`,
                  borderRadius: 2,
                }}
              />
              {exp.roleProgression.map((step, i) => {
                const isLast = i === exp.roleProgression!.length - 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      paddingLeft: 28,
                      paddingBottom: isLast ? 0 : 18,
                      position: "relative",
                    }}
                  >
                    {/* node dot */}
                    <span
                      style={{
                        position: "absolute",
                        left: 5,
                        top: 5,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: isLast ? ACCENT : `${ACCENT}44`,
                        border: `2px solid ${isLast ? ACCENT : ACCENT + "66"}`,
                        boxShadow: isLast ? `0 0 8px ${ACCENT}88` : "none",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "clamp(13px, 1.8vw, 15px)",
                          color: isLast ? "#F5F0E8" : "#9CA3AF",
                          fontWeight: isLast ? 700 : 500,
                          letterSpacing: "0.5px",
                          marginBottom: 3,
                        }}
                      >
                        {step.role}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: "#6B7280",
                            letterSpacing: "1px",
                          }}
                        >
                          {step.period}
                        </span>
                        {step.tag && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 7,
                              color: isLast ? ACCENT : "#6B7280",
                              letterSpacing: "2px",
                              padding: "2px 8px",
                              border: `1px solid ${isLast ? ACCENT + "44" : "rgba(255,255,255,0.08)"}`,
                              borderRadius: 2,
                            }}
                          >
                            {step.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: "#4B5563", letterSpacing: "3px", marginBottom: 6 }}>
                ROLE
              </div>
              <div style={{ fontSize: "clamp(13px, 1.8vw, 16px)", color: "#A8C8A8", fontWeight: 600 }}>
                {exp.role}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: "#4B5563", letterSpacing: "3px", marginBottom: 6 }}>
                PERIOD
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#D4C9B8" }}>
                {exp.period}
              </div>
            </div>
          </div>
        )}

        {/* Tech stack */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "#4B5563",
              letterSpacing: "3px",
              marginBottom: 10,
            }}
          >
            TECH USED
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
            style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
          >
            {exp.stack.map((tech) => (
              <motion.span
                key={tech}
                variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } }}
                style={{
                  padding: "4px 11px",
                  background: `${ACCENT}09`,
                  border: `1px solid ${ACCENT}22`,
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: ACCENT,
                  letterSpacing: "0.4px",
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };
}

/* ── Work slide: what they built / contributed ── */
function makeWorkSlide(idx: number): React.ComponentType {
  const exp = EXPERIENCE_DATA[idx];

  return function WorkSlide() {
    return (
      <div>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "#4B5563",
              letterSpacing: "4px",
              marginBottom: 4,
            }}
          >
            {exp.company.toUpperCase()} · CONTRIBUTIONS
          </div>
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${ACCENT}33, transparent)`,
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }, hidden: {} }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {exp.responsibilities.map((r, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "14px 16px",
                background: `${ACCENT}07`,
                border: `1px solid ${ACCENT}16`,
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
                  marginTop: 3,
                  minWidth: 18,
                  letterSpacing: "1px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: "clamp(12px, 1.4vw, 13.5px)",
                  color: "#D4C9B8",
                  lineHeight: 1.68,
                }}
              >
                {r}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };
}

/* ── Slide exports: [overview, work] per entry in reverse-chron order ── */
export const SLIDES: React.ComponentType[] = EXPERIENCE_DATA.flatMap((_, i) => [
  makeOverviewSlide(i),
  makeWorkSlide(i),
]);

export const SLIDE_LABELS: string[] = EXPERIENCE_DATA.flatMap((exp) => [
  exp.company.toUpperCase(),
  "CONTRIBUTIONS",
]);
