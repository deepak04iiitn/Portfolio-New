"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import RailwayWorld from "./RailwayWorld";
import CabinView from "./CabinView";
import BoardingScreen from "./BoardingScreen";
import StationContentOverlay from "./StationContentOverlay";
import AudioManager from "@/components/audio/AudioManager";
import MuteToggle from "@/components/ui/MuteToggle";
import FilmGrain from "@/components/ui/FilmGrain";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { useTrainController } from "@/hooks/useTrainController";
import { AnimationController } from "@/lib/railway/animationController";
import { STATIONS, STATION_SPACING } from "@/lib/railway/stations";

/**
 * RailwayWorldClient — the phase-2 orchestration shell.
 *
 * Owns:
 *  - All DOM refs passed down to RailwayWorld
 *  - Journey phase initialisation (LOADING → IDLE)
 *  - Full cinematic departure sequence (via useTrainController)
 *  - Instant-jump fallback for PREV / station-pill navigation
 *  - Camera resets via AnimationController
 *  - CabinView overlay toggle
 *  - HUD: top station strip, bottom navigation controls
 */
export default function RailwayWorldClient() {
  /* ── Scene refs ───────────────────────────────────────────── */
  const worldRef  = useRef<HTMLDivElement>(null);
  const trainRef  = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  /* ── Standalone animation controller (for external camera ops) */
  const animCtrlRef = useRef(new AnimationController());

  /* ── Train controller — owns all departure/arrival timelines ─ */
  const { depart, isAnimating } = useTrainController(
    worldRef,
    trainRef,
    cameraRef,
  );

  /* ── Zustand store ────────────────────────────────────────── */
  const {
    phase,
    currentStationIndex,
    setPhase,
    jumpToStation,
    trainState,
  } = useJourneyStore();

  /* ── Cabin-view overlay ───────────────────────────────────── */
  const [cabinOpen, setCabinOpen] = useState(false);

  /* ── Derived ──────────────────────────────────────────────── */
  const currentStation = STATIONS[currentStationIndex];
  const isFirst = currentStationIndex === 0;
  const isLast  = currentStationIndex === STATIONS.length - 1;

  /* ── Initialise journey ───────────────────────────────────────
     Show the boarding screen first (LOADING → BOARDING).
     The BoardingScreen component handles the BOARDING → IDLE
     transition once the user clicks "BOARD THE TRAIN".
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase === "LOADING") {
      setPhase("BOARDING");
      /* Ensure world-pan starts at x=0 without an animated transition */
      if (worldRef.current) {
        gsap.set(worldRef.current, { x: 0 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Instant-jump effect ─────────────────────────────────────
     When currentStationIndex changes via jumpToStation() / PREV,
     the train controller is NOT running, so we animate the world
     ourselves. If the controller IS running, it owns the world,
     so we skip.
  ─────────────────────────────────────────────────────────── */
  const prevIdxRef = useRef(currentStationIndex);
  useEffect(() => {
    if (prevIdxRef.current === currentStationIndex) return;
    prevIdxRef.current = currentStationIndex;
    if (isAnimating) return; // controller owns this
    if (!worldRef.current) return;

    const targetX = -(currentStationIndex * STATION_SPACING);
    gsap.to(worldRef.current, {
      x: targetX,
      duration: 1.4,
      ease: "power2.inOut",
    });
  }, [currentStationIndex, isAnimating]);

  /* ── Camera reset on external STOPPED ────────────────────────
     If phase hits STOPPED while the controller is NOT running
     (e.g. from jumpToStation), return the camera to tight.
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase === "STOPPED" && !isAnimating && cameraRef.current) {
      animCtrlRef.current.transitionCamera(cameraRef.current, "tight");
    }
  }, [phase, isAnimating]);

  /* ── Departure handler ────────────────────────────────────── */
  const handleDepart = () => {
    if (isAnimating || isLast) return;
    depart(currentStationIndex + 1);
  };

  /* ── Keyboard shortcut: → or n → depart ──────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "n") handleDepart();
      if (e.key === "Escape") setCabinOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, isLast, currentStationIndex]);

  return (
    <>
      {/* ── Behavioural: audio sequencer (renders nothing) ─── */}
      <AudioManager />

      {/* ── Film grain — persistent analogue texture ─────────── */}
      <FilmGrain />

      {/* ── Boarding gate — shown before IDLE ────────────────── */}
      <BoardingScreen />

      {/* ── Scene ───────────────────────────────────────────── */}
      <RailwayWorld
        worldRef={worldRef}
        trainRef={trainRef}
        cameraRef={cameraRef}
        onWindowClick={() => setCabinOpen(true)}
      />

      {/* ── Cabin view overlay ──────────────────────────────── */}
      <CabinView isOpen={cabinOpen} onClose={() => setCabinOpen(false)} />

      {/* ── Station content panels (shown when STOPPED) ─────── */}
      <StationContentOverlay />

      {/* ── Top HUD — platform overview strip ────────────────── */}
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
            const isPast    = i < currentStationIndex;
            const isCurrent = i === currentStationIndex;
            return (
              <button
                key={station.id}
                onClick={() => {
                  if (!isAnimating) jumpToStation(station.id);
                }}
                disabled={isAnimating}
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
                  cursor: isAnimating ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                  opacity: isAnimating && !isCurrent ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent && !isAnimating) {
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

        {/* Train status readout */}
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
                background: isAnimating ? "#F4C430" : "#2ECC71",
                boxShadow: isAnimating
                  ? "0 0 6px #F4C430"
                  : "0 0 6px #2ECC71",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            />
            <span
              style={{
                fontSize: "8px",
                color: isAnimating ? "#F4C430" : "#2ECC71",
                letterSpacing: "2px",
                transition: "color 0.3s",
              }}
            >
              {isAnimating ? "EN ROUTE" : "ON TIME"}
            </span>
          </div>
          <span
            style={{ fontSize: "8px", color: "#3A4A3A", letterSpacing: "1.5px" }}
          >
            {trainState.speed} KM/H
          </span>
        </div>

        {/* Mute toggle — only visible after boarding */}
        <MuteToggle />
      </div>

      {/* ── Bottom navigation controls ─────────────────────────── */}
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
            {isAnimating
              ? "NEXT STOP"
              : currentStation.platformLabel.toUpperCase()}
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
          disabled={isFirst || isAnimating}
          onClick={() => {
            if (!isFirst && !isAnimating) {
              jumpToStation(STATIONS[currentStationIndex - 1].id);
            }
          }}
          aria-label="Previous station"
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid rgba(244,196,48,0.25)",
            borderRadius: "2px",
            color: isFirst || isAnimating ? "#2A3A2A" : "#F4C430",
            fontSize: "9px",
            letterSpacing: "2px",
            cursor: isFirst || isAnimating ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-mono)",
          }}
        >
          ← PREV
        </button>

        {/* NEXT / DEPART button */}
        <button
          disabled={isLast || isAnimating}
          onClick={handleDepart}
          aria-label={isAnimating ? "Travelling" : "Depart to next station"}
          style={{
            padding: "8px 20px",
            background:
              isLast
                ? "rgba(30,40,30,0.5)"
                : isAnimating
                ? "rgba(244,196,48,0.15)"
                : "#F4C430",
            border: "1px solid",
            borderColor:
              isLast
                ? "rgba(244,196,48,0.15)"
                : isAnimating
                ? "rgba(244,196,48,0.3)"
                : "#F4C430",
            borderRadius: "2px",
            color:
              isLast || isAnimating ? "#5A6A3A" : "#0A0A0A",
            fontSize: "9px",
            letterSpacing: "3px",
            fontWeight: 700,
            cursor: isLast || isAnimating ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-mono)",
          }}
        >
          {isLast
            ? "END OF LINE"
            : isAnimating
            ? "TRAVELLING..."
            : "DEPART →"}
        </button>
      </div>

      {/* ── Cabin hint tooltip (shows briefly on IDLE at first station) */}
      {phase === "IDLE" && currentStationIndex === 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "30%",
            transform: "translateX(-20px)",
            zIndex: 90,
            background: "rgba(6,10,6,0.78)",
            border: "1px solid rgba(244,196,48,0.2)",
            borderRadius: "3px",
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "rgba(244,196,48,0.6)",
            letterSpacing: "2px",
            pointerEvents: "none",
            animation: "pulse-hint 2s ease-in-out infinite",
          }}
        >
          CLICK WINDOWS → CABIN VIEW
        </div>
      )}

      {/* ── Screen-reader live region ─────────────────────────── */}
      <div className="sr-only" aria-live="polite">
        {isAnimating
          ? `Travelling to ${currentStation.displayName}`
          : `At ${currentStation.displayName}, ${currentStation.platformLabel}.`}
      </div>

      {/* ── Pulse keyframe for the cabin hint ─────────────────── */}
      <style>{`
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </>
  );
}
