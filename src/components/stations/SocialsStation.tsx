"use client";

import { motion } from "framer-motion";
import { CONTACT_DATA } from "@/lib/railway/stations";

const ACCENT = "#60A5FA"; // cool blue — fits the deep-night atmosphere

const LINKS = [
  {
    id: "github",
    label: "GITHUB",
    sub: "deepak04iiitn",
    url: CONTACT_DATA.github,
    icon: "⌥",
    desc: "61 repositories · open-source projects & experiments",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    sub: "deepak-kumar-yadav",
    url: CONTACT_DATA.linkedin,
    icon: "◈",
    desc: "Professional network · experiences & endorsements",
  },
  {
    id: "gfg",
    label: "GEEKSFORGEEKS",
    sub: "deepak04_iiitn",
    url: CONTACT_DATA.gfg,
    icon: "◉",
    desc: "800+ problems solved · DSA practice & articles",
  },
  {
    id: "leetcode",
    label: "LEETCODE",
    sub: "deepak04_iiitn",
    url: CONTACT_DATA.leetcode,
    icon: "◆",
    desc: "Competitive programming · algorithm challenges",
  },
];

function SocialsSlide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font-railway)" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "#4B5563",
            letterSpacing: "4px",
            marginBottom: 10,
          }}
        >
          ONLINE PRESENCE · RESUME & SOCIALS
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3.5vw, 34px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "3px",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          CONNECT & FOLLOW
        </div>
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${ACCENT}44, transparent)`,
          }}
        />
      </div>

      {/* Resume download — prominent button */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            color: "#4B5563",
            letterSpacing: "3px",
            marginBottom: 10,
          }}
        >
          CURRICULUM VITAE
        </div>
        <motion.a
          href={CONTACT_DATA.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            background: ACCENT,
            color: "#05080E",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "4px",
            textDecoration: "none",
            borderRadius: 4,
            fontWeight: 700,
            transition: "opacity 0.15s ease, transform 0.1s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>DOWNLOAD RESUME</span>
          <span style={{ fontSize: 16 }}>↓</span>
        </motion.a>
      </div>

      {/* Social link cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }, hidden: {} }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {LINKS.map((link) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 18px",
              background: `${ACCENT}07`,
              border: `1px solid ${ACCENT}18`,
              borderLeft: `3px solid ${ACCENT}`,
              borderRadius: "0 6px 6px 0",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${ACCENT}12`;
              e.currentTarget.style.borderColor = `${ACCENT}40`;
              e.currentTarget.style.borderLeftColor = ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${ACCENT}07`;
              e.currentTarget.style.borderColor = `${ACCENT}18`;
              e.currentTarget.style.borderLeftColor = ACCENT;
            }}
          >
            {/* Icon badge */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                background: `${ACCENT}12`,
                border: `1px solid ${ACCENT}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                color: ACCENT,
                flexShrink: 0,
              }}
            >
              {link.icon}
            </div>

            {/* Text content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: ACCENT,
                  letterSpacing: "2px",
                  marginBottom: 2,
                }}
              >
                {link.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-railway)",
                  fontSize: "clamp(11px, 1.4vw, 13px)",
                  color: "#9CA3AF",
                  letterSpacing: "0.3px",
                  marginBottom: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {link.desc}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "#4B5563",
                  letterSpacing: "0.5px",
                }}
              >
                @{link.sub}
              </div>
            </div>

            {/* Arrow */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: `${ACCENT}55`,
                flexShrink: 0,
              }}
            >
              ↗
            </span>
          </motion.a>
        ))}
      </motion.div>

    </div>
  );
}

export const SLIDES: React.ComponentType[] = [SocialsSlide];
export const SLIDE_LABELS: string[] = ["RESUME & SOCIALS"];
