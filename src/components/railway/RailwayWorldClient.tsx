"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import RailwayWorld from "./RailwayWorld";
import CabinView from "./CabinView";
import BoardingScreen from "./BoardingScreen";
import StationContentOverlay from "./StationContentOverlay";
import AudioManager from "@/components/audio/AudioManager";
import MuteToggle from "@/components/ui/MuteToggle";
import FilmGrain from "@/components/ui/FilmGrain";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Ticket from "@/components/ui/Ticket";
import ControlPanel from "@/components/ui/ControlPanel";
import StationMap from "@/components/ui/StationMap";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { useTrainController } from "@/hooks/useTrainController";
import { AnimationController } from "@/lib/railway/animationController";
import { STATIONS, STATION_SPACING } from "@/lib/railway/stations";
import { getSounds } from "@/lib/audio/sounds";

/**
 * RailwayWorldClient — master orchestration shell (Phase 6).
 *
 * Owns:
 *  - All DOM refs (world, train, camera)
 *  - Phase lifecycle: LOADING → BoardingScreen → IDLE
 *  - LoadingScreen (fake progress) → BOARDING
 *  - BoardingScreen (ticket design) → IDLE / jump
 *  - Full cinematic departure sequence (useTrainController)
 *  - Instant-jump fallback for PREV / station-pill navigation
 *  - Camera resets via AnimationController
 *  - CabinView overlay toggle
 *  - Ticket widget (shown once on first IDLE)
 *  - ControlPanel (MAP, HORN, live status)
 *  - StationMap overlay
 *  - Keyboard shortcuts (→/n depart, m map, h horn, Esc close)
 *  - HUD: top station strip, bottom PREV/DEPART navigation
 */
export default function RailwayWorldClient() {
  /* ── Scene refs ───────────────────────────────────────────── */
  const worldRef  = useRef<HTMLDivElement>(null);
  const trainRef  = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  /* ── Standalone animation controller ──────────────────────── */
  const animCtrlRef = useRef(new AnimationController());

  /* ── Train controller ─────────────────────────────────────── */
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
    setMapOpen,
    isMapOpen,
    trainState,
  } = useJourneyStore();

  /* ── Local UI state ───────────────────────────────────────── */
  const [cabinOpen,    setCabinOpen]    = useState(false);
  const [ticketVisible, setTicketVisible] = useState(false);
  const hasShownTicket = useRef(false);

  /* ── Derived ──────────────────────────────────────────────── */
  const currentStation = STATIONS[currentStationIndex];
  const isFirst = currentStationIndex === 0;
  const isLast  = currentStationIndex === STATIONS.length - 1;

  /* ── Phase lifecycle ──────────────────────────────────────────
     LOADING  → LoadingScreen (stays in LOADING until onLoaded)
     onLoaded → setPhase("BOARDING") → shows BoardingScreen
     BoardingScreen → setPhase("IDLE")
     First IDLE → show Ticket widget once
  ─────────────────────────────────────────────────────────── */
  const handleLoaded = () => {
    setPhase("BOARDING");
    if (worldRef.current) gsap.set(worldRef.current, { x: 0 });
  };

  /* Show Ticket once on first IDLE */
  useEffect(() => {
    if (phase === "IDLE" && !hasShownTicket.current) {
      hasShownTicket.current = true;
      setTimeout(() => setTicketVisible(true), 800);
    }
  }, [phase]);

  /* ── Instant-jump effect ──────────────────────────────────────
     When currentStationIndex changes via jumpToStation() / PREV
     and the controller is NOT running, tween the world ourselves.
  ─────────────────────────────────────────────────────────── */
  const prevIdxRef = useRef(currentStationIndex);
  useEffect(() => {
    if (prevIdxRef.current === currentStationIndex) return;
    prevIdxRef.current = currentStationIndex;
    if (isAnimating || !worldRef.current) return;

    const targetX = -(currentStationIndex * STATION_SPACING);
    gsap.to(worldRef.current, {
      x: targetX,
      duration: 1.4,
      ease: "power2.inOut",
    });
  }, [currentStationIndex, isAnimating]);

  /* ── Camera reset on external STOPPED ────────────────────── */
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

  /* ── Keyboard shortcuts ───────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      switch (e.key) {
        case "ArrowRight":
        case "n":
          handleDepart();
          break;
        case "m":
          setMapOpen(!isMapOpen);
          break;
        case "h":
          getSounds()?.horn.play();
          break;
        case "Escape":
          setCabinOpen(false);
          setMapOpen(false);
          setTicketVisible(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, isLast, currentStationIndex, isMapOpen]);

  return (
    <>
      {/* ── Behavioural: audio sequencer (renders nothing) ─── */}
      <AudioManager />

      {/* ── Film grain — persistent analogue texture ─────────── */}
      <FilmGrain />

      {/* ── Loading screen ───────────────────────────────────── */}
      <AnimatePresence>
        {phase === "LOADING" && (
          <LoadingScreen key="loading" onLoaded={handleLoaded} />
        )}
      </AnimatePresence>

      {/* ── Boarding gate — shown during BOARDING phase ──────── */}
      <BoardingScreen />

      {/* ── Scene (always rendered; hidden under overlays when boarding) */}
      <RailwayWorld
        worldRef={worldRef}
        trainRef={trainRef}
        cameraRef={cameraRef}
        onWindowClick={() => setCabinOpen(true)}
      />

      {/* ── Cabin view overlay ───────────────────────────────── */}
      <CabinView isOpen={cabinOpen} onClose={() => setCabinOpen(false)} />

      {/* ── Station content panels (shown when STOPPED) ──────── */}
      <StationContentOverlay isAnimating={isAnimating} />

      {/* ── Travel ticket (shown once on first IDLE) ─────────── */}
      <Ticket
        isVisible={ticketVisible}
        onDismiss={() => setTicketVisible(false)}
      />

      {/* ── Control panel (MAP / HORN / status) ──────────────── */}
      <ControlPanel onOpenMap={() => setMapOpen(true)} />

      {/* ── Station map overlay ───────────────────────────────── */}
      <StationMap isOpen={isMapOpen} onClose={() => setMapOpen(false)} />

      {/* ── Top HUD — platform overview strip ────────────────── */}
      {phase !== "LOADING" && phase !== "BOARDING" && (
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
              gap: 2,
              minWidth: 120,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#F4C430",
                letterSpacing: "3px",
                lineHeight: 1,
              }}
            >
              DK-0402
            </span>
            <span
              style={{
                fontSize: 7,
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
                    gap: 3,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    minWidth: 100,
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
                      fontSize: 7,
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
                      fontSize: 9,
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
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: isCurrent
                        ? "#F4C430"
                        : isPast
                          ? "#2ECC71"
                          : "#2A3A2A",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Status readout */}
          <div
            style={{
              padding: "8px 16px",
              borderLeft: "1px solid rgba(244, 196, 48, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
              minWidth: 110,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
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
                  fontSize: 8,
                  color: isAnimating ? "#F4C430" : "#2ECC71",
                  letterSpacing: "2px",
                  transition: "color 0.3s",
                }}
              >
                {isAnimating ? "EN ROUTE" : "ON TIME"}
              </span>
            </div>
            <span
              style={{ fontSize: 8, color: "#3A4A3A", letterSpacing: "1.5px" }}
            >
              {trainState.speed} KM/H
            </span>
          </div>

          {/* Mute toggle */}
          <MuteToggle />
        </div>
      )}

      {/* ── Bottom navigation controls ────────────────────────── */}
      {/* Hidden while the station panel is open — re-appears once it closes */}
      {phase !== "LOADING" && phase !== "BOARDING" && phase !== "STOPPED" && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(6, 10, 6, 0.88)",
            border: "1px solid rgba(244, 196, 48, 0.2)",
            borderRadius: 4,
            padding: "12px 20px",
            backdropFilter: "blur(12px)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {/* Current station label */}
          <div style={{ textAlign: "center", minWidth: 160 }}>
            <div
              style={{
                fontSize: 7,
                color: "rgba(244,196,48,0.5)",
                letterSpacing: "3px",
                marginBottom: 3,
              }}
            >
              {isAnimating
                ? "NEXT STOP"
                : currentStation.platformLabel.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 11,
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
              width: 1,
              height: 32,
              background: "rgba(244,196,48,0.15)",
            }}
          />

          {/* INFO button — reopen station panel when it has been closed */}
          {phase === "EXPLORE" && (
            <button
              onClick={() => setPhase("STOPPED")}
              aria-label="Open station information panel"
              style={{
                padding: "8px 14px",
                background: "rgba(244,196,48,0.07)",
                border: "1px solid rgba(244,196,48,0.3)",
                borderRadius: 2,
                color: "#F4C430",
                fontSize: 9,
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244,196,48,0.14)";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(244,196,48,0.07)";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.3)";
              }}
            >
              ↗ INFO
            </button>
          )}

          {/* Divider before PREV */}
          {phase === "EXPLORE" && (
            <div
              style={{
                width: 1,
                height: 32,
                background: "rgba(244,196,48,0.15)",
              }}
            />
          )}

          {/* PREV button */}
          <button
            disabled={isFirst || isAnimating}
            onClick={() => {
              if (!isFirst && !isAnimating)
                jumpToStation(STATIONS[currentStationIndex - 1].id);
            }}
            aria-label="Previous station"
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid rgba(244,196,48,0.25)",
              borderRadius: 2,
              color: isFirst || isAnimating ? "#2A3A2A" : "#F4C430",
              fontSize: 9,
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
              background: isLast
                ? "rgba(30,40,30,0.5)"
                : isAnimating
                  ? "rgba(244,196,48,0.15)"
                  : "#F4C430",
              border: "1px solid",
              borderColor: isLast
                ? "rgba(244,196,48,0.15)"
                : isAnimating
                  ? "rgba(244,196,48,0.3)"
                  : "#F4C430",
              borderRadius: 2,
              color: isLast || isAnimating ? "#5A6A3A" : "#0A0A0A",
              fontSize: 9,
              letterSpacing: "3px",
              fontWeight: 700,
              cursor: isLast || isAnimating ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-mono)",
            }}
          >
            {isLast ? "END OF LINE" : isAnimating ? "TRAVELLING..." : "DEPART →"}
          </button>
        </div>
      )}

      {/* ── Cabin hint (first station only) ──────────────────── */}
      {phase === "IDLE" && currentStationIndex === 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "30%",
            transform: "translateX(-20px)",
            zIndex: 90,
            background: "rgba(6,10,6,0.78)",
            border: "1px solid rgba(244,196,48,0.2)",
            borderRadius: 3,
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(244,196,48,0.6)",
            letterSpacing: "2px",
            pointerEvents: "none",
            animation: "pulse-hint 2s ease-in-out infinite",
          }}
        >
          CLICK WINDOWS → CABIN VIEW
        </div>
      )}

      {/* ── SR live region ────────────────────────────────────── */}
      <div className="sr-only" aria-live="polite">
        {isAnimating
          ? `Travelling to ${currentStation.displayName}`
          : `At ${currentStation.displayName}, ${currentStation.platformLabel}.`}
      </div>

      <style>{`
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </>
  );
}
