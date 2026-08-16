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
      <div
        ref={trainRef}
        id="train-container"
        style={{
          position: "fixed",
          bottom: "calc(35% + 4px)",
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

        {/* Smoke particles — origin aligned with SVG chimney at x≈91,y≈17
            (SVG coords 96×18 × scale 0.95). Canvas is 150×180px with
            originY=155 so its bottom sits just above the funnel tip. */}
        <ParticleSystem
          active={trainState.smokeActive}
          type="smoke"
          originX={43}
          originY={155}
          width={150}
          height={180}
        />
      </div>
    </div>
  );
}
