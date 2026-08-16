"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 1024; // px — below this we show the notice

export default function DesktopGuard() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth >= BREAKPOINT) {
        setDismissed(false); // reset dismissal if they resize back to desktop
      }
      setShow(window.innerWidth < BREAKPOINT);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!show || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#030806",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "transparent",
          border: "1px solid rgba(244,196,48,0.2)",
          borderRadius: 3,
          color: "rgba(244,196,48,0.5)",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 9,
          letterSpacing: "2px",
          padding: "6px 12px",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(244,196,48,0.55)";
          e.currentTarget.style.color = "#F4C430";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(244,196,48,0.2)";
          e.currentTarget.style.color = "rgba(244,196,48,0.5)";
        }}
      >
        CONTINUE ANYWAY ×
      </button>
      {/* Animated train icon */}
      <div
        style={{
          marginBottom: 32,
          fontSize: 56,
          lineHeight: 1,
          animation: "sway 3s ease-in-out infinite",
        }}
      >
        🚂
      </div>

      {/* Heading */}
      <div
        style={{
          fontFamily: "var(--font-display, monospace)",
          fontSize: "clamp(20px, 6vw, 28px)",
          fontWeight: 700,
          color: "#F4C430",
          letterSpacing: "4px",
          textAlign: "center",
          marginBottom: 8,
          lineHeight: 1.2,
        }}
      >
        WRONG PLATFORM
      </div>

      {/* Sub-heading */}
      <div
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(9px, 2.5vw, 11px)",
          color: "rgba(168,200,168,0.6)",
          letterSpacing: "3px",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        DK-0402 · DEEPAK EXPRESS
      </div>

      {/* Divider */}
      <div
        style={{
          width: "min(320px, 80vw)",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent)",
          marginBottom: 32,
        }}
      />

      {/* Message */}
      <div
        style={{
          maxWidth: 320,
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "clamp(11px, 3vw, 13px)",
            color: "#9CA3AF",
            lineHeight: 1.75,
            letterSpacing: "0.5px",
            margin: 0,
          }}
        >
          This experience is built for a{" "}
          <span style={{ color: "#F4C430", fontWeight: 600 }}>
            larger screen
          </span>
          . Please open it on a{" "}
          <span style={{ color: "#F4C430", fontWeight: 600 }}>
            laptop or desktop
          </span>{" "}
          for the full interactive railway journey.
        </p>
      </div>

      {/* Ticket-style hint */}
      <div
        style={{
          padding: "12px 24px",
          border: "1px dashed rgba(244,196,48,0.25)",
          borderRadius: 4,
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(8px, 2.5vw, 10px)",
          color: "rgba(244,196,48,0.45)",
          letterSpacing: "2px",
          textAlign: "center",
        }}
      >
        RECOMMENDED — 1024 px WIDTH OR ABOVE
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: translateX(-6px); }
          50%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
