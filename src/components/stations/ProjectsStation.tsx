"use client";

import { motion } from "framer-motion";
import { PROJECTS_DATA } from "@/lib/railway/stations";

function makeProjectSlide(idx: number): React.ComponentType {
  const project = PROJECTS_DATA[idx];
  return function ProjectSlide() {
    return (
      <div style={{ fontFamily: "var(--font-railway)" }}>
        {/* Bay / status header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "#6B7280",
              letterSpacing: "4px",
            }}
          >
            BAY {String(idx + 1).padStart(2, "0")}
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
                boxShadow: project.status === "LIVE" ? "0 0 6px #2ECC71" : "0 0 6px #F4C430",
                display: "inline-block",
              }}
            />
            {project.status}
          </span>
        </div>

        {/* Project name */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 42px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "3px",
            lineHeight: 1,
            marginBottom: 18,
          }}
        >
          {project.name.toUpperCase()}
        </div>

        {/* Gold divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, #B87ED655, transparent)",
            marginBottom: 18,
          }}
        />

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            color: "#A8B89A",
            lineHeight: 1.65,
            margin: "0 0 20px",
          }}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "#6B7280",
              letterSpacing: "3px",
              marginBottom: 10,
            }}
          >
            TECH STACK
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
            style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {project.stack.map((tech) => (
              <motion.span
                key={tech}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                style={{
                  padding: "5px 12px",
                  background: "rgba(26,58,42,0.7)",
                  border: "1px solid rgba(184,126,214,0.2)",
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#B87ED6",
                  letterSpacing: "0.5px",
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "#B87ED6",
              color: "#0A0A0A",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "3px",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: 2,
              fontWeight: 700,
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            LIVE DEMO ↗
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "transparent",
              border: "1px solid rgba(184,126,214,0.35)",
              color: "#B87ED6",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "3px",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: 2,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(184,126,214,0.1)";
              e.currentTarget.style.borderColor = "rgba(184,126,214,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(184,126,214,0.35)";
            }}
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    );
  };
}

export const SLIDES: React.ComponentType[] = PROJECTS_DATA.map((_, i) => makeProjectSlide(i));
export const SLIDE_LABELS: string[] = PROJECTS_DATA.map((p) => p.name.toUpperCase());
