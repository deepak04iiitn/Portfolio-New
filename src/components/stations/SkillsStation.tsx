"use client";

import { motion } from "framer-motion";
import { SKILLS_DATA } from "@/lib/railway/stations";

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; description: string }
> = {
  languages:    { label: "LANGUAGES & TOOLS",    icon: "{ }",  color: "#F4C430", description: "Core languages and developer tools" },
  frontend:     { label: "FRONTEND",             icon: "◻",    color: "#87CEEB", description: "UI frameworks and styling technologies" },
  backend:      { label: "BACKEND",              icon: "⬡",    color: "#A8C8A8", description: "Server-side runtimes and databases" },
  genai:        { label: "GENERATIVE AI & LLMs", icon: "◈",    color: "#C8A8E8", description: "AI/ML frameworks and orchestration" },
  fundamentals: { label: "CS FUNDAMENTALS",      icon: "∑",    color: "#E07070", description: "Computer science foundations" },
};

function makeCategorySlide(category: string): React.ComponentType {
  const skills = SKILLS_DATA[category as keyof typeof SKILLS_DATA];
  const meta   = CATEGORY_META[category];

  return function CategorySlide() {
    const { label, icon, color, description } = meta;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── Category identity ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            paddingBottom: 18,
            marginBottom: 20,
            borderBottom: `1px solid ${color}22`,
          }}
        >
          {/* Large icon badge */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              background: `${color}14`,
              border: `1px solid ${color}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              color: color,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 2.8vw, 26px)",
                fontWeight: 700,
                color: color,
                letterSpacing: "3px",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#5C6370",
                letterSpacing: "1.5px",
              }}
            >
              {description}
            </div>
          </div>

          {/* Skill count badge */}
          <div
            style={{
              padding: "6px 14px",
              background: `${color}12`,
              border: `1px solid ${color}28`,
              borderRadius: 20,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: color,
              letterSpacing: "2px",
              flexShrink: 0,
            }}
          >
            {skills.length}
          </div>
        </div>

        {/* ── Skills grid — 2 columns of substantial cards ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            hidden:  {},
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill}
              variants={{
                hidden:   { opacity: 0, y: 14 },
                visible:  { opacity: 1, y: 0  },
              }}
              style={{
                padding: "14px 18px",
                background: `${color}08`,
                border: `1px solid ${color}1E`,
                borderLeft: `3px solid ${color}`,
                borderRadius: "0 4px 4px 0",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Index number */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: `${color}55`,
                  letterSpacing: "1px",
                  flexShrink: 0,
                  minWidth: 18,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Skill name */}
              <span
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                  color: "#D4C9B8",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  lineHeight: 1.3,
                }}
              >
                {skill}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };
}

export const SLIDES: React.ComponentType[] = Object.keys(SKILLS_DATA).map(makeCategorySlide);
export const SLIDE_LABELS: string[] = Object.keys(SKILLS_DATA).map(
  (k) => CATEGORY_META[k]?.label ?? k.toUpperCase(),
);
