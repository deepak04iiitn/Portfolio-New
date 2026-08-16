"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS_DATA } from "@/lib/railway/stations";

/**
 * ProjectsStation — Terminal Bay cards on Platform 04.
 * Clicking a card expands the project links (LIVE DEMO / GITHUB).
 */
export default function ProjectsStation() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 780, margin: "0 auto" }}
    >
      {/* Section header */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          letterSpacing: "8px",
          color: "#F4C430",
          textAlign: "center",
          marginBottom: 20,
          fontWeight: 700,
        }}
      >
        PROJECTS TERMINAL
      </div>

      {/* Bay grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {PROJECTS_DATA.map((project, i) => {
          const isOpen = expandedId === project.id;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() =>
                setExpandedId(isOpen ? null : project.id)
              }
              style={{
                background: "#0A0F0A",
                border: `1px solid ${isOpen ? "rgba(244,196,48,0.55)" : "rgba(244,196,48,0.22)"}`,
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = "rgba(244,196,48,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = "rgba(244,196,48,0.22)";
                }
              }}
            >
              {/* Bay header */}
              <div
                style={{
                  background: isOpen ? "rgba(26,58,42,0.6)" : "#1A3A2A",
                  padding: "7px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(244,196,48,0.18)",
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "#6B7280",
                    letterSpacing: "3px",
                  }}
                >
                  BAY {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 8,
                    color:
                      project.status === "LIVE"
                        ? "#2ECC71"
                        : "#F4C430",
                    letterSpacing: "2px",
                  }}
                >
                  ● {project.status}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(15px, 2.5vw, 19px)",
                    fontWeight: 700,
                    color: "#F5F0E8",
                    letterSpacing: "2px",
                    marginBottom: 9,
                  }}
                >
                  {project.name.toUpperCase()}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-railway)",
                    fontSize: 13,
                    color: "#8A9280",
                    lineHeight: 1.6,
                    margin: 0,
                    marginBottom: 13,
                  }}
                >
                  {project.description}
                </p>

                {/* Stack tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginBottom: 14,
                  }}
                >
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: "2px 8px",
                        background: "rgba(26,58,42,0.8)",
                        border: "1px solid rgba(168,200,168,0.18)",
                        borderRadius: 2,
                        fontSize: 9,
                        color: "#A8C8A8",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Click hint when collapsed */}
                {!isOpen && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      color: "rgba(244,196,48,0.3)",
                      letterSpacing: "2px",
                    }}
                  >
                    CLICK TO EXPAND →
                  </div>
                )}

                {/* Expandable links */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{ display: "flex", gap: 8, paddingTop: 4 }}
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "9px 8px",
                            background: "#F4C430",
                            color: "#0A0A0A",
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            letterSpacing: "2px",
                            textAlign: "center",
                            textDecoration: "none",
                            borderRadius: 2,
                            fontWeight: 700,
                            transition: "opacity 0.15s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          LIVE DEMO
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "9px 8px",
                            background: "transparent",
                            border: "1px solid rgba(244,196,48,0.4)",
                            color: "#F4C430",
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            letterSpacing: "2px",
                            textAlign: "center",
                            textDecoration: "none",
                            borderRadius: 2,
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(244,196,48,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          GITHUB
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
