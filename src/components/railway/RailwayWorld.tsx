"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Environment from "./Environment";
import Track, { TRACK_WORLD_WIDTH } from "./Track";
import Train from "./Train";
import StationWrapper, { WORLD_INITIAL_OFFSET } from "./Station";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS, STATION_SPACING } from "@/lib/railway/stations";

gsap.registerPlugin(useGSAP);

/**
 * The fixed screen-space X position of the train (% of viewport).
 * The world scrolls to bring each station to this horizontal position.
 */
const TRAIN_SCREEN_LEFT = "30%";

/**
 * RailwayWorld is the root scene compositor.
 *
 * Layout:
 *  ┌──────────────────────────────────────────────────────┐
 *  │  Environment (fixed, full-screen backdrop)           │
 *  │   └─ #world-pan  (absolute, translates left)         │
 *  │       ├─ Track SVG  (bottom 0, full world width)     │
 *  │       └─ Station wrappers (absolute in world space)  │
 *  │  Train (fixed in screen space, world moves behind)   │
 *  └──────────────────────────────────────────────────────┘
 */
export default function RailwayWorld() {
  const worldRef = useRef<HTMLDivElement>(null);
  const { trainState, currentStationIndex } = useJourneyStore();
  const currentStation = STATIONS[currentStationIndex];

  /**
   * Phase 1 world offset: instant snap to station position.
   * Phase 2 will replace this with the GSAP animation controller.
   *
   * worldOffset = -(stationIndex * STATION_SPACING)
   * so that station N's platform (at world x = WORLD_INITIAL_OFFSET + N*1800)
   * arrives at approximately TRAIN_SCREEN_LEFT (~432px on 1440px viewport).
   */
  const targetOffset = -(currentStationIndex * STATION_SPACING);

  useGSAP(
    () => {
      if (!worldRef.current) return;

      // Phase 1: animate with a simple ease (Phase 2 replaces with full controller)
      gsap.to(worldRef.current, {
        x: targetOffset,
        duration: 1.8,
        ease: "power2.inOut",
      });
    },
    {
      scope: worldRef,
      dependencies: [targetOffset],
    }
  );

  return (
    <>
      {/* ── Environment backdrop ─────────────────────────── */}
      <Environment state={currentStation.environment}>

        {/* ── World pan container ──────────────────────── */}
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
            // Initial x set to 0; GSAP takes over immediately
            transform: "translateX(0px)",
          }}
          aria-hidden="true"
        >
          {/* ── Ground grass strip above the track ─────── */}
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

          {/* ── Track ──────────────────────────────────── */}
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

          {/* ── Station platforms ──────────────────────── */}
          {STATIONS.map((station) => (
            <StationWrapper
              key={station.id}
              station={station}
              currentStationId={trainState.currentStationId}
            />
          ))}
        </div>
      </Environment>

      {/* ── Train — fixed in screen space ────────────────── */}
      <div
        id="train-container"
        style={{
          position: "fixed",
          bottom: "calc(35% + 4px)",
          left: TRAIN_SCREEN_LEFT,
          zIndex: 10,
          pointerEvents: "none",
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
        />
      </div>
    </>
  );
}
