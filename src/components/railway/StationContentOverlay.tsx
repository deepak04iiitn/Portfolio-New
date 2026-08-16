"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import WelcomeStation    from "@/components/stations/WelcomeStation";
import EducationStation  from "@/components/stations/EducationStation";
import ExperienceStation from "@/components/stations/ExperienceStation";
import ProjectsStation   from "@/components/stations/ProjectsStation";
import SkillsStation     from "@/components/stations/SkillsStation";
import ContactStation    from "@/components/stations/ContactStation";
import type { StationId } from "@/lib/railway/types";

/* Map every station ID to its content component */
const STATION_PANELS: Record<StationId, React.ComponentType> = {
  welcome:    WelcomeStation,
  education:  EducationStation,
  experience: ExperienceStation,
  projects:   ProjectsStation,
  skills:     SkillsStation,
  contact:    ContactStation,
};

/**
 * StationContentOverlay — floats above the railway scene when the
 * train is STOPPED at a station. Renders the matching content panel,
 * transitions in from below and out upward via AnimatePresence.
 *
 * Positioning strategy:
 *   top: 52px   — clears the HUD strip
 *   bottom: 90px — clears the bottom navigation controls
 *   Overflow is internally scrollable with no visible scrollbar.
 */
export default function StationContentOverlay() {
  const { phase, currentStationIndex } = useJourneyStore();

  const isVisible = phase === "STOPPED" || phase === "EXPLORE";
  const currentStation = STATIONS[currentStationIndex];
  const PanelComponent = currentStation
    ? STATION_PANELS[currentStation.id]
    : null;

  return (
    <AnimatePresence>
      {isVisible && PanelComponent && (
        <motion.div
          key={currentStation.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: 52,
            left: "50%",
            transform: "translateX(-50%)",
            width: "92%",
            maxWidth: 820,
            maxHeight: "calc(100vh - 148px)",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 50,
            /* Hide scrollbar across browsers */
            scrollbarWidth: "none",
          }}
          /* Webkit scrollbar hidden via className */
          className="station-content-scroll"
        >
          {/* Semi-transparent backdrop blur behind the card */}
          <div
            style={{
              position: "absolute",
              inset: "-20px -10px",
              background:
                "radial-gradient(ellipse at center top, rgba(6,10,6,0.55) 0%, transparent 80%)",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />

          <PanelComponent />

          {/* Fade-out gradient at the bottom — hints at scrollability */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              height: 32,
              background:
                "linear-gradient(transparent, rgba(6,10,6,0.7))",
              pointerEvents: "none",
              marginTop: -32,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
