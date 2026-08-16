"use client";

import { motion } from "framer-motion";
import { CONTACT_DATA } from "@/lib/railway/stations";

const ACCENT = "#F4C430";

const DETAILS = [
  {
    label: "PASSENGER",
    value: CONTACT_DATA.name,
    href: undefined,
    icon: "◎",
    copyable: false,
  },
  {
    label: "EMAIL ADDRESS",
    value: CONTACT_DATA.email,
    href: `mailto:${CONTACT_DATA.email}`,
    icon: "✉",
    copyable: true,
  },
  {
    label: "PHONE",
    value: CONTACT_DATA.phone,
    href: `tel:${CONTACT_DATA.phone.replace(/\s/g, "")}`,
    icon: "◈",
    copyable: true,
  },
];

function ContactSlide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font-railway)" }}>

      {/* Status + heading */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#2ECC71",
              boxShadow: "0 0 8px #2ECC71",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "#2ECC71",
              letterSpacing: "3px",
            }}
          >
            OPEN FOR OPPORTUNITIES · 2026
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3.5vw, 36px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "3px",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          GET IN TOUCH
        </div>
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${ACCENT}44, transparent)`,
          }}
        />
      </div>

      {/* Contact detail cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }, hidden: {} }}
        style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}
      >
        {DETAILS.map((item) => {
          const inner = (
            <motion.div
              key={item.label}
              variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                background: `${ACCENT}07`,
                border: `1px solid ${ACCENT}18`,
                borderLeft: `3px solid ${ACCENT}`,
                borderRadius: "0 6px 6px 0",
                transition: item.href ? "all 0.18s ease" : undefined,
                cursor: item.href ? "pointer" : "default",
                textDecoration: "none",
              }}
              {...(item.href
                ? {
                    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.background = `${ACCENT}12`;
                      e.currentTarget.style.borderColor = `${ACCENT}40`;
                    },
                    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.background = `${ACCENT}07`;
                      e.currentTarget.style.borderColor = `${ACCENT}18`;
                    },
                  }
                : {})}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  background: `${ACCENT}10`,
                  border: `1px solid ${ACCENT}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: ACCENT,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 7,
                    color: "#4B5563",
                    letterSpacing: "3px",
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-railway)",
                    fontSize: "clamp(13px, 1.8vw, 16px)",
                    color: "#F5F0E8",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value}
                </div>
              </div>

              {/* Link arrow */}
              {item.href && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: `${ACCENT}55`, flexShrink: 0 }}>
                  ↗
                </span>
              )}
            </motion.div>
          );

          return item.href ? (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              {inner}
            </a>
          ) : (
            <div key={item.label}>{inner}</div>
          );
        })}
      </motion.div>

      {/* End of line marker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        style={{
          borderTop: "1px solid rgba(244,196,48,0.12)",
          paddingTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.3), transparent)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "rgba(244,196,48,0.35)",
            letterSpacing: "4px",
            whiteSpace: "nowrap",
          }}
        >
          ● DK EXPRESS · END OF LINE
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.3), transparent)",
          }}
        />
      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

export const SLIDES: React.ComponentType[] = [ContactSlide];
export const SLIDE_LABELS: string[] = ["CONTACT ME"];
