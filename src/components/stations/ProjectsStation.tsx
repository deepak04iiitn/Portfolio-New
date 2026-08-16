"use client";

import { motion } from "framer-motion";
import { PROJECTS_DATA } from "@/lib/railway/stations";

const ACCENT = "#B87ED6";

function makeProjectSlide(idx: number): React.ComponentType {
  const project = PROJECTS_DATA[idx];

  return function ProjectSlide() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font-railway)" }}>

        {/* ── Bay / status bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "#4B5563",
              letterSpacing: "4px",
            }}
          >
            BAY {String(idx + 1).padStart(2, "0")} / {String(PROJECTS_DATA.length).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: project.status === "LIVE" ? "#2ECC71" : "#F4C430",
              letterSpacing: "3px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: project.status === "LIVE" ? "#2ECC71" : "#F4C430",
                boxShadow:
                  project.status === "LIVE"
                    ? "0 0 6px #2ECC71"
                    : "0 0 6px #F4C430",
                display: "inline-block",
              }}
            />
            {project.status}
          </span>
        </div>

        {/* ── Project name + tagline + links ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
          {/* Left: name + tagline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 3.5vw, 36px)",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "3px",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {project.name.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: `${ACCENT}99`,
                letterSpacing: "2px",
              }}
            >
              {project.tagline}
            </div>
          </div>

          {/* Right: stacked link buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "7px 16px",
                  background: ACCENT,
                  color: "#0A0A0A",
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: "2.5px",
                  textAlign: "center",
                  textDecoration: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.84"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                LIVE DEMO ↗
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "7px 16px",
                background: "transparent",
                border: `1px solid ${ACCENT}44`,
                color: ACCENT,
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "2.5px",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: 2,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${ACCENT}14`;
                e.currentTarget.style.borderColor = `${ACCENT}77`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${ACCENT}44`;
              }}
            >
              SOURCE CODE ↗
            </a>
          </div>
        </div>

        {/* ── Accent divider ── */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${ACCENT}44, transparent)`,
            marginBottom: 20,
          }}
        />

        {/* ── Highlights — numbered bullet cards ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }, hidden: {} }}
          style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}
        >
          {project.highlights.map((point, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 16px",
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
                  letterSpacing: "1px",
                  flexShrink: 0,
                  marginTop: 2,
                  minWidth: 18,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "clamp(12px, 1.4vw, 13.5px)",
                  color: "#A8B89A",
                  lineHeight: 1.65,
                }}
              >
                {point}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Tech stack ── */}
        <div style={{ marginBottom: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "#4B5563",
              letterSpacing: "3px",
              marginBottom: 10,
            }}
          >
            TECH STACK
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
            style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
          >
            {project.stack.map((tech) => (
              <motion.span
                key={tech}
                variants={{ hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } }}
                style={{
                  padding: "4px 11px",
                  background: "rgba(26,42,36,0.75)",
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

export const SLIDES: React.ComponentType[] = PROJECTS_DATA.map((_, i) => makeProjectSlide(i));
export const SLIDE_LABELS: string[] = PROJECTS_DATA.map((p) => p.name.toUpperCase());
