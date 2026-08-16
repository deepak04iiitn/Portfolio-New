"use client";

import { motion } from "framer-motion";
import { SKILLS_DATA } from "@/lib/railway/stations";

const CATEGORY_COLORS: Record<string, string> = {
  languages:  "#F4C430",
  frameworks: "#A8C8A8",
  tools:      "#87CEEB",
  concepts:   "#E07070",
};

const CATEGORY_LABELS: Record<string, string> = {
  languages:  "LANGUAGES",
  frameworks: "FRAMEWORKS & RUNTIMES",
  tools:      "TOOLS & PLATFORMS",
  concepts:   "CONCEPTS",
};

const CATEGORY_ICONS: Record<string, string> = {
  languages:  "{ }",
  frameworks: "⬡",
  tools:      "⚙",
  concepts:   "◈",
};

/**
 * SkillsStation — Night-mode signal board (Platform 05).
 * 2×2 grid of categorised skill lists with coloured accent lines.
 */
export default function SkillsStation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      {/* Section header */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          letterSpacing: "8px",
          color: "#F4C430",
          textAlign: "center",
          marginBottom: 18,
          fontWeight: 700,
        }}
      >
        SKILLS SIGNAL BOARD
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {Object.entries(SKILLS_DATA).map(([category, skills], catIndex) => {
          const color = CATEGORY_COLORS[category] ?? "#F4C430";
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.08 }}
              style={{
                background: "#060A06",
                border: `1px solid ${color}28`,
                borderTop: `2px solid ${color}`,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {/* Category header */}
              <div
                style={{
                  padding: "8px 14px",
                  background: `${color}0F`,
                  borderBottom: `1px solid ${color}1C`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: color,
                    opacity: 0.6,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {CATEGORY_ICONS[category]}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 8,
                    color: color,
                    letterSpacing: "3px",
                    opacity: 0.85,
                  }}
                >
                  {CATEGORY_LABELS[category]}
                </span>
              </div>

              {/* Skill list */}
              <div style={{ padding: "10px 14px" }}>
                {(skills as string[]).map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.08 + i * 0.04 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "5px 0",
                      borderBottom:
                        i < (skills as string[]).length - 1
                          ? "1px solid rgba(255,255,255,0.035)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        opacity: 0.65,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-railway)",
                        fontSize: 13,
                        color: "#D4C9B8",
                        fontWeight: 500,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
