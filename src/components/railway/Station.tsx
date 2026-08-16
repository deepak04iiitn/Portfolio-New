"use client";

import Platform from "./Platform";
import type { StationConfig } from "@/lib/railway/types";
import { STATION_SPACING } from "@/lib/railway/stations";

/*
 * WORLD_INITIAL_OFFSET — screen-x where every station platform appears
 * when the world translateX equals -(N * STATION_SPACING).
 *
 * We want the platform's left edge to sit just past the locomotive's
 * right edge so the signboard is always fully visible:
 *
 *   train_left  = viewport_width × 0.30  (matches TRAIN_SCREEN_LEFT in RailwayWorld)
 *   train_width = 440 × 0.95 = 418 px   (SVG width × scale)
 *   gap         = 30 px                  (breathing room between loco and platform)
 *
 * Computed once at module-load time (client-side only).
 * Falls back to 880 px (correct for a 1440 px viewport) during SSR.
 */
const TRAIN_WIDTH_PX = Math.round(440 * 0.95); // 418

function computeWorldOffset(): number {
  if (typeof window === "undefined") return 880;
  return Math.round(window.innerWidth * 0.30) + TRAIN_WIDTH_PX + 30;
}

export const WORLD_INITIAL_OFFSET = computeWorldOffset();

interface StationWrapperProps {
  station: StationConfig;
  currentStationId: string | null;
}

/**
 * Places a station platform at its absolute world-space position.
 * The parent world container's translateX shifts all stations in unison.
 *
 * World x of station N = WORLD_INITIAL_OFFSET + (N * STATION_SPACING)
 */
export default function StationWrapper({
  station,
  currentStationId,
}: StationWrapperProps) {
  const worldX = WORLD_INITIAL_OFFSET + station.order * STATION_SPACING;
  const isActive = currentStationId === station.id;

  return (
    <div
      id={`station-${station.id}`}
      style={{
        position: "absolute",
        /* Platform sits on top of the track — aligned so its slab base
           meets the top of the rail surface. The track SVG is 82px tall
           and sits at the bottom of the world container; the platform
           slab (at y=103 in the 160px-tall Platform SVG) needs to sit
           right on top of the rail.
           bottom: 82px (track height) → positions the platform just above. */
        bottom: "78px",
        left: `${worldX}px`,
        width: "240px",
        height: "160px",
        willChange: "transform",
      }}
      aria-label={`${station.displayName} station`}
    >
      <Platform
        stationName={station.displayName}
        platformLabel={station.platformLabel}
        isActive={isActive}
        timeOfDay={station.environment.timeOfDay}
      />
    </div>
  );
}
