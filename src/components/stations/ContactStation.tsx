"use client";

import { motion } from "framer-motion";
import { CONTACT_DATA } from "@/lib/railway/stations";

/**
 * ContactStation — Final Destination (Platform 06).
 * End-of-line signboard with contact links and availability status.
 */
export default function ContactStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}
    >
      {/* Final station signboard */}
      <div
        style={{
          background: "#0A0A0A",
          border: "2px solid #F4C430",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 16px 56px rgba(0,0,0,0.65), 0 0 40px rgba(244,196,48,0.06)",
          marginBottom: 16,
        }}
      >
        {/* Board header */}
        <div
          style={{
            background: "#1A3A2A",
            padding: "10px 20px",
            borderBottom: "1px solid rgba(244,196,48,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#F4C430",
              letterSpacing: "4px",
            }}
          >
            PLATFORM 06 · DESTINATION STATION
          </span>
        </div>

        <div style={{ padding: "32px 40px" }}>
          {/* End-of-line label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 4.5vw, 36px)",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "4px",
                marginBottom: 8,
              }}
            >
              END OF LINE
            </div>
            <div
              style={{
                fontFamily: "var(--font-railway)",
                fontSize: 13,
                color: "#A8C8A8",
                letterSpacing: "2px",
                marginBottom: 28,
              }}
            >
              DEEPAK IS OPEN FOR OPPORTUNITIES
            </div>
          </motion.div>

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(46,204,113,0.1)",
              border: "1px solid rgba(46,204,113,0.25)",
              borderRadius: 20,
              marginBottom: 28,
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
              AVAILABLE · JUNE 2026
            </span>
          </motion.div>

          {/* Gold divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.35), transparent)",
              marginBottom: 24,
            }}
          />

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {/* Primary CTA */}
            <a
              href={`mailto:${CONTACT_DATA.email}`}
              style={{
                display: "block",
                padding: "13px 24px",
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
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              SEND A MESSAGE →
            </a>

            {/* Secondary links */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
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
                    padding: "10px 8px",
                    background: "transparent",
                    border: "1px solid rgba(244,196,48,0.28)",
                    color: "#F4C430",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "2px",
                    textDecoration: "none",
                    borderRadius: 2,
                    transition: "all 0.15s ease",
                    textAlign: "center",
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
        </div>
      </div>

      {/* Journey complete tag */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
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
    </motion.div>
  );
}
