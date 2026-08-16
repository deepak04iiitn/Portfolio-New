"use client";

import type { RefObject } from "react";
import Environment from "./Environment";
import Track, { TRACK_WORLD_WIDTH } from "./Track";
import Train from "./Train";
import StationWrapper from "./Station";
import ParticleSystem from "./Particles";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";

const TRAIN_SCREEN_LEFT = "30%";

interface RailwayWorldProps {
  /** Ref attached to the #world-pan div — translated by useTrainController */
  worldRef: RefObject<HTMLDivElement | null>;
  /** Ref attached to the train container div — used for shake effects */
  trainRef: RefObject<HTMLDivElement | null>;
  /** Ref attached to the #camera-rig div — target for camera transitions */
  cameraRef: RefObject<HTMLDivElement | null>;
  /** Passed to Train to enable cabin-view click area */
  onWindowClick?: () => void;
}

/**
 * RailwayWorld is a pure rendering layer.
 * It places every scene element at the correct position and hands
 * refs to the parent (RailwayWorldClient) for GSAP control.
 *
 * Layout:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  #camera-rig  (fixed, inset 0 — camera zoom target)     │
 *  │   ├─ Environment (absolute — sky / ground / clouds)      │
 *  │   │   └─ #world-pan  (absolute — translates left/right)  │
 *  │   │       ├─ Track SVG                                   │
 *  │   │       └─ Station wrappers                            │
 *  │   └─ #train-container (fixed at 30% from left)          │
 *  └─────────────────────────────────────────────────────────┘
 *
 * No GSAP lives here — all animation is driven by the controller
 * hooks in RailwayWorldClient.
 */
export default function RailwayWorld({
  worldRef,
  trainRef,
  cameraRef,
  onWindowClick,
}: RailwayWorldProps) {
  const { trainState, currentStationIndex } = useJourneyStore();
  const currentStation = STATIONS[currentStationIndex];

  return (
    /* ── Camera rig — whole scene scales / translates together ── */
    <div
      ref={cameraRef}
      id="camera-rig"
      style={{
        position: "fixed",
        inset: 0,
        /* transformOrigin set by AnimationController at runtime.
           Pre-declare it here so the first GSAP tween doesn't
           cause a layout jump. */
        transformOrigin: "50% 58%",
      }}
    >
      {/* ── Environment backdrop ─────────────────────────────── */}
      <Environment state={currentStation.environment}>

        {/* ── World pan container ──────────────────────────── */}
        <div
          ref={worldRef}
          id="world-pan"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${TRACK_WORLD_WIDTH}px`,
            height: "42%",
            willChange: "transform",
          }}
          aria-hidden="true"
        >
          {/* Ground grass strip above track */}
          <div
            style={{
              position: "absolute",
              bottom: "78px",
              left: 0,
              width: "100%",
              height: "40px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Track */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              lineHeight: 0,
            }}
          >
            <Track />
          </div>

          {/* Station platforms */}
          {STATIONS.map((station) => (
            <StationWrapper
              key={station.id}
              station={station}
              currentStationId={trainState.currentStationId}
            />
          ))}
        </div>
      </Environment>

      {/* ── Train — fixed in screen space, world moves behind ── */}
      {/*
          Vertical alignment calculation:
          - Track SVG height = 82px, positioned bottom:0 (flush with screen bottom)
          - Left rail top face at y=20 in Track SVG → 82-20 = 62px from screen bottom
          - Train SVG viewBox 0 0 440 165, wheel bottoms at y=156 (scale 0.95 → 148.2px)
          - SVG rendered height = 165 * 0.95 = 156.75px
          - Space below wheel bottoms = 156.75 - 148.2 = 8.55px
          - Container bottom = rail_top - tail = 62 - 8.55 ≈ 54px
      */}
      <div
        ref={trainRef}
        id="train-container"
        style={{
          position: "fixed",
          bottom: "54px",
          left: TRAIN_SCREEN_LEFT,
          zIndex: 10,
          /* Enable pointer events so the cabin window hitbox works */
          pointerEvents: onWindowClick ? "auto" : "none",
          transform: "translateZ(0)",
        }}
        aria-label="Deepak Express locomotive"
      >
        <Train
          engineLight={trainState.headlightOn}
          smoke={trainState.smokeActive}
          wheelsRotating={trainState.wheelsRotating}
          headlightOn={trainState.headlightOn}
          scale={0.95}
          onWindowClick={onWindowClick}
        />

        {/* Smoke particles — chimney SVG center x=95, scaled ×0.95 → ~90px */}
        <ParticleSystem
          active={trainState.smokeActive}
          type="smoke"
          originX={90}
          originY={155}
          width={150}
          height={180}
        />
      </div>
    </div>
  );
}
