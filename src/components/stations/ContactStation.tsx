"use client";

import { motion } from "framer-motion";
import { CONTACT_DATA } from "@/lib/railway/stations";

function ContactSlide() {
  return (
    <div style={{ fontFamily: "var(--font-railway)", textAlign: "center" }}>
      {/* End of line */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4.5vw, 40px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "5px",
            marginBottom: 6,
          }}
        >
          END OF LINE
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#A8C8A8",
            letterSpacing: "3px",
            marginBottom: 24,
          }}
        >
          DEEPAK IS OPEN FOR OPPORTUNITIES
        </div>
      </motion.div>

      {/* Availability badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 18px",
          background: "rgba(46,204,113,0.1)",
          border: "1px solid rgba(46,204,113,0.25)",
          borderRadius: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#2ECC71",
            boxShadow: "0 0 8px #2ECC71",
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#2ECC71",
            letterSpacing: "3px",
          }}
        >
          AVAILABLE · 2026
        </span>
      </motion.div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.35), transparent)",
          marginBottom: 22,
        }}
      />

      {/* Contact links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 440, margin: "0 auto" }}
      >
        <a
          href={`mailto:${CONTACT_DATA.email}`}
          style={{
            display: "block",
            padding: "14px 24px",
            background: "#F4C430",
            color: "#0A0A0A",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "4px",
            textDecoration: "none",
            borderRadius: 2,
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
          SEND A MESSAGE →
        </a>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "GITHUB",   url: CONTACT_DATA.github },
            { label: "LINKEDIN", url: CONTACT_DATA.linkedin },
            { label: "RÉSUMÉ",   url: CONTACT_DATA.resumeUrl },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "11px 8px",
                background: "transparent",
                border: "1px solid rgba(244,196,48,0.28)",
                color: "#F4C430",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "2px",
                textDecoration: "none",
                borderRadius: 2,
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244,196,48,0.08)";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.28)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>

      <div
        style={{
          marginTop: 22,
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          color: "#2A3A2A",
          letterSpacing: "3px",
        }}
      >
        ● DEEPAK EXPRESS · JOURNEY COMPLETE
      </div>

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
export const SLIDE_LABELS: string[] = ["DESTINATION"];
