"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TicketProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const ROWS: [string, string][] = [
  ["PASSENGER", "VISITOR"],
  ["FROM", "INTERNET"],
  ["TO", "SOFTWARE ENGINEER"],
  ["COACH", "PORTFOLIO"],
];

/**
 * Ticket — floating railway ticket widget.
 * Slides up from the bottom-right on first boarding, dismissed on click.
 * Auto-dismisses after 10 seconds.
 */
export default function Ticket({ isVisible, onDismiss }: TicketProps) {
  /* Auto-dismiss after 10 seconds */
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(onDismiss, 10_000);
    return () => clearTimeout(t);
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ticket"
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 48, rotate: -2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            zIndex: 150,
            width: 240,
            background: "#F5F0E8",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
          }}
          onClick={onDismiss}
          role="button"
          aria-label="Dismiss travel ticket"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onDismiss();
          }}
        >
          {/* Header stripe */}
          <div
            style={{
              background: "#1A3A2A",
              padding: "8px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 8, color: "#F4C430", letterSpacing: "3px" }}
            >
              DEEPAK EXPRESS
            </span>
            <span
              style={{
                fontSize: 8,
                color: "rgba(244,196,48,0.45)",
                letterSpacing: "2px",
              }}
            >
              DK-0402
            </span>
          </div>

          {/* Body rows */}
          <div style={{ padding: "12px 14px" }}>
            {ROWS.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  paddingBottom: 8,
                  borderBottom: "1px dashed rgba(0,0,0,0.1)",
                }}
              >
                <span
                  style={{ fontSize: 8, color: "#6B7280", letterSpacing: "2px" }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "#1A1A1A",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textAlign: "right",
                    maxWidth: "60%",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Perforated edge */}
          <div
            style={{
              borderTop: "1px dashed rgba(0,0,0,0.18)",
              padding: "9px 14px",
              background: "rgba(0,0,0,0.025)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: 7, color: "#9CA3AF", letterSpacing: "3px" }}
            >
              TAP TO DISMISS
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
