"use client";

import { useEffect } from "react";
import RailwayWorld from "./RailwayWorld";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";

/**
 * Client shell that owns:
 *  - Journey phase initialisation (LOADING → IDLE)
 *  - Phase 1 navigation controls (NEXT STATION / PREV STATION)
 *  - Station overview strip at the top
 *  - Platform strip showing all platform names
 *
 * Phase 2 will replace the nav controls with the full cinematic sequence.
 */
export default function RailwayWorldClient() {
  const {
    phase,
    currentStationIndex,
    setPhase,
    advanceStation,
    jumpToStation,
    trainState,
  } = useJourneyStore();

  /* ── Initialise journey on mount ─────────────────────────── */
  useEffect(() => {
    if (phase === "LOADING") {
      setPhase("IDLE");
    }
  }, [phase, setPhase]);

  const currentStation = STATIONS[currentStationIndex];
  const isFirst = currentStationIndex === 0;
  const isLast = currentStationIndex === STATIONS.length - 1;

  return (
    <>
      {/* ── Scene ─────────────────────────────────────────── */}
      <RailwayWorld />

      {/* ── Platform overview strip ───────────────────────── */}
      <div
        role="navigation"
        aria-label="Journey stations"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "stretch",
          background: "rgba(6, 10, 6, 0.82)",
          borderBottom: "1px solid rgba(244, 196, 48, 0.18)",
          backdropFilter: "blur(10px)",
          fontFamily: "var(--font-mono)",
          overflow: "hidden",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            padding: "10px 16px",
            borderRight: "1px solid rgba(244, 196, 48, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "2px",
            minWidth: "120px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#F4C430",
              letterSpacing: "3px",
              lineHeight: 1,
            }}
          >
            DX-2026
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "rgba(244,196,48,0.4)",
              letterSpacing: "2px",
            }}
          >
            DEEPAK EXPRESS
          </span>
        </div>

        {/* Station pills */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {STATIONS.map((station, i) => {
            const isPast = i < currentStationIndex;
            const isCurrent = i === currentStationIndex;
            return (
              <button
                key={station.id}
                onClick={() => jumpToStation(station.id)}
                aria-label={`Go to ${station.displayName}`}
                aria-current={isCurrent ? "true" : undefined}
                style={{
                  padding: "8px 14px",
                  background: isCurrent
                    ? "rgba(244, 196, 48, 0.12)"
                    : "transparent",
                  border: "none",
                  borderRight: "1px solid rgba(244, 196, 48, 0.08)",
                  borderBottom: isCurrent
                    ? "2px solid #F4C430"
                    : "2px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = "rgba(244,196,48,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "7px",
                    letterSpacing: "2px",
                    color: isCurrent
                      ? "#F4C430"
                      : isPast
                      ? "rgba(168, 200, 168, 0.6)"
                      : "rgba(92, 99, 112, 0.7)",
                  }}
                >
                  {station.platformLabel.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    color: isCurrent
                      ? "#F5F0E8"
                      : isPast
                      ? "#A8C8A8"
                      : "#4A5A4A",
                  }}
                >
                  {station.displayName.toUpperCase()}
                </span>
                {/* Visited indicator */}
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isCurrent
                      ? "#F4C430"
                      : isPast
                      ? "#2ECC71"
                      : "#2A3A2A",
                    marginTop: "1px",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Train status */}
        <div
          style={{
            padding: "8px 16px",
            borderLeft: "1px solid rgba(244, 196, 48, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "3px",
            minWidth: "110px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#2ECC71",
                boxShadow: "0 0 6px #2ECC71",
              }}
            />
            <span
              style={{ fontSize: "8px", color: "#2ECC71", letterSpacing: "2px" }}
            >
              ON TIME
            </span>
          </div>
          <span
            style={{ fontSize: "8px", color: "#3A4A3A", letterSpacing: "1.5px" }}
          >
            {trainState.speed} KM/H
          </span>
        </div>
      </div>

      {/* ── Bottom navigation controls ────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(6, 10, 6, 0.88)",
          border: "1px solid rgba(244, 196, 48, 0.2)",
          borderRadius: "4px",
          padding: "12px 20px",
          backdropFilter: "blur(12px)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {/* Current station label */}
        <div style={{ textAlign: "center", minWidth: "160px" }}>
          <div
            style={{
              fontSize: "7px",
              color: "rgba(244,196,48,0.5)",
              letterSpacing: "3px",
              marginBottom: "3px",
            }}
          >
            {currentStation.platformLabel.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "2px",
              fontFamily: "var(--font-display)",
            }}
          >
            {currentStation.displayName.toUpperCase()}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "rgba(244,196,48,0.15)",
          }}
        />

        {/* PREV button */}
        <button
          disabled={isFirst}
          onClick={() =>
            jumpToStation(STATIONS[currentStationIndex - 1].id)
          }
          aria-label="Previous station"
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid rgba(244,196,48,0.25)",
            borderRadius: "2px",
            color: isFirst ? "#2A3A2A" : "#F4C430",
            fontSize: "9px",
            letterSpacing: "2px",
            cursor: isFirst ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-mono)",
          }}
        >
          ← PREV
        </button>

        {/* NEXT button */}
        <button
          disabled={isLast}
          onClick={advanceStation}
          aria-label="Next station"
          style={{
            padding: "8px 20px",
            background: isLast ? "rgba(30,40,30,0.5)" : "#F4C430",
            border: "1px solid",
            borderColor: isLast ? "rgba(244,196,48,0.15)" : "#F4C430",
            borderRadius: "2px",
            color: isLast ? "#2A3A2A" : "#0A0A0A",
            fontSize: "9px",
            letterSpacing: "3px",
            fontWeight: 700,
            cursor: isLast ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-mono)",
          }}
        >
          {isLast ? "END OF LINE" : "NEXT STATION →"}
        </button>
      </div>

      {/* ── Screen-reader accessible station content ─────── */}
      <div className="sr-only" aria-live="polite">
        Currently at {currentStation.displayName}, {currentStation.platformLabel}.
      </div>
    </>
  );
}
