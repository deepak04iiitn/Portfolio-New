"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import type { StationId } from "@/lib/railway/types";

interface StationMapProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * StationMap — full-route linear diagram.
 * Opened via MAP button or `m` key.
 * Clicking a station dot jumps directly to it and closes the map.
 *
 * Visual: horizontal track line with station nodes (yellow=current,
 * green=visited, dark=future). Station label below each node.
 */
export default function StationMap({ isOpen, onClose }: StationMapProps) {
  const { jumpToStation, currentStationIndex } = useJourneyStore();

  const handleStationClick = (id: StationId) => {
    jumpToStation(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="station-map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Journey route map"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0A0F0A",
              border: "1px solid rgba(244,196,48,0.3)",
              borderRadius: 4,
              padding: "32px 40px 28px",
              maxWidth: 680,
              width: "90%",
              fontFamily: "var(--font-mono)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Title */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#F4C430",
                  letterSpacing: "5px",
                  fontWeight: 700,
                }}
              >
                JOURNEY MAP — DK-0402
              </span>
              <button
                onClick={onClose}
                aria-label="Close map"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#3A4A3A",
                  cursor: "pointer",
                  fontSize: 14,
                  padding: "4px 8px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "1px",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#F4C430")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#3A4A3A")
                }
              >
                ✕
              </button>
            </div>

            {/* Route diagram */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              {/* Horizontal track line */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  right: 10,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, rgba(244,196,48,0.35) 10%, rgba(244,196,48,0.35) 90%, transparent)",
                }}
              />

              {/* Station nodes */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {STATIONS.map((station, i) => {
                  const isPast    = i < currentStationIndex;
                  const isCurrent = i === currentStationIndex;

                  return (
                    <button
                      key={station.id}
                      onClick={() =>
                        handleStationClick(station.id as StationId)
                      }
                      aria-label={`Jump to ${station.displayName}`}
                      aria-current={isCurrent ? "true" : undefined}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {/* Node dot */}
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: isCurrent
                            ? "#F4C430"
                            : isPast
                              ? "#2ECC71"
                              : "#1E2E1E",
                          border: `2px solid ${
                            isCurrent
                              ? "#F4C430"
                              : isPast
                                ? "#2ECC71"
                                : "rgba(244,196,48,0.25)"
                          }`,
                          boxShadow: isCurrent
                            ? "0 0 14px rgba(244,196,48,0.6)"
                            : isPast
                              ? "0 0 8px rgba(46,204,113,0.3)"
                              : "none",
                          transition: "all 0.3s ease",
                          flexShrink: 0,
                        }}
                      />

                      {/* Label */}
                      <div
                        style={{
                          fontSize: 7,
                          color: isCurrent
                            ? "#F4C430"
                            : isPast
                              ? "#A8C8A8"
                              : "#3A4A3A",
                          letterSpacing: "1.5px",
                          textAlign: "center",
                          maxWidth: 72,
                          lineHeight: 1.5,
                          transition: "color 0.3s ease",
                          textTransform: "uppercase",
                        }}
                      >
                        {station.displayName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend + hint */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 16,
                borderTop: "1px solid rgba(244,196,48,0.08)",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {[
                  { color: "#F4C430", label: "CURRENT" },
                  { color: "#2ECC71", label: "VISITED" },
                  { color: "#1E2E1E", label: "UPCOMING" },
                ].map(({ color, label }) => (
                  <div
                    key={label}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: color,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <span
                      style={{ fontSize: 6, color: "#3A4A3A", letterSpacing: "2px" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span
                style={{ fontSize: 7, color: "#2A3A2A", letterSpacing: "2px" }}
              >
                CLICK TO JUMP · ESC TO CLOSE
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
