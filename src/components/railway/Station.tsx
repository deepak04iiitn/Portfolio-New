"use client";

import Platform from "./Platform";
import type { StationConfig } from "@/lib/railway/types";
import { STATION_SPACING } from "@/lib/railway/stations";

/**
 * WORLD_OFFSET_INITIAL: The pixel offset at which Station 0 is visible
 * when the world starts at translateX(0). Stations appear to the right
 * of the train at this distance from the world origin.
 *
 * This value represents approximately where the train's viewport-fixed
 * position falls in world space (calibrated to a ~1440px-wide viewport).
 */
export const WORLD_INITIAL_OFFSET = 500;

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
