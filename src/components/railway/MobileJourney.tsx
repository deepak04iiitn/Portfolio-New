"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import SlideFrame from "@/components/railway/SlideFrame";
import { SLIDES as WelcomeSlides,    SLIDE_LABELS as WelcomeLabels    } from "@/components/stations/WelcomeStation";
import { SLIDES as EducationSlides,  SLIDE_LABELS as EducationLabels  } from "@/components/stations/EducationStation";
import { SLIDES as ExperienceSlides, SLIDE_LABELS as ExperienceLabels } from "@/components/stations/ExperienceStation";
import { SLIDES as ProjectsSlides,   SLIDE_LABELS as ProjectsLabels   } from "@/components/stations/ProjectsStation";
import { SLIDES as SkillsSlides,     SLIDE_LABELS as SkillsLabels     } from "@/components/stations/SkillsStation";
import { SLIDES as ContactSlides,    SLIDE_LABELS as ContactLabels    } from "@/components/stations/ContactStation";
import { SLIDES as SocialsSlides,    SLIDE_LABELS as SocialsLabels    } from "@/components/stations/SocialsStation";
import type { StationId } from "@/lib/railway/types";

const STATION_SLIDES: Record<StationId, { slides: React.ComponentType[]; labels: string[] }> = {
  welcome:    { slides: WelcomeSlides,    labels: WelcomeLabels    },
  education:  { slides: EducationSlides,  labels: EducationLabels  },
  experience: { slides: ExperienceSlides, labels: ExperienceLabels },
  projects:   { slides: ProjectsSlides,   labels: ProjectsLabels   },
  skills:     { slides: SkillsSlides,     labels: SkillsLabels     },
  socials:    { slides: SocialsSlides,    labels: SocialsLabels    },
  contact:    { slides: ContactSlides,    labels: ContactLabels    },
};

const ENV_COLORS: Record<string, { bg: string; accent: string }> = {
  day:     { bg: "#0A120A", accent: "#4A90C8" },
  evening: { bg: "#120A08", accent: "#C0703A" },
  sunset:  { bg: "#100816", accent: "#6B2D5E" },
  night:   { bg: "#080C10", accent: "#1A2E4E" },
  sunrise: { bg: "#080C14", accent: "#1A3A6E" },
};

/**
 * MobileJourney — simplified, vertically-stacked layout for mobile.
 *
 * No world panning, no camera system, no particles, no film grain.
 * Each station is a full-screen scrollable card that snaps to view.
 * Train illustration stays fixed at the top as a branded header.
 * Day/night CSS background transitions are preserved via inline style.
 */
export default function MobileJourney() {
  const {
    phase,
    currentStationIndex,
    setPhase,
    enableAudio,
    jumpToStation,
    trainState,
  } = useJourneyStore();

  const [boarded, setBoarded] = useState(phase !== "LOADING" && phase !== "BOARDING");
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentStation = STATIONS[currentStationIndex];
  const env = currentStation?.environment;
  const envColors = ENV_COLORS[env?.timeOfDay ?? "day"];

  const isFirst = currentStationIndex === 0;
  const isLast  = currentStationIndex === STATIONS.length - 1;

  const handleBoard = () => {
    enableAudio();
    setPhase("IDLE");
    setBoarded(true);
  };

  const handleNext = () => {
    if (isLast) return;
    setDirection(1);
    jumpToStation(STATIONS[currentStationIndex + 1].id as StationId);
  };

  const handlePrev = () => {
    if (isFirst) return;
    setDirection(-1);
    jumpToStation(STATIONS[currentStationIndex - 1].id as StationId);
  };

  const slideSet = STATION_SLIDES[currentStation?.id as StationId];

  /* ── Boarding gate ──────────────────────────────────────────── */
  if (!boarded) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(160deg, #0A0F0A 0%, #0D180D 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "var(--font-railway)",
          zIndex: 500,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            color: "#F4C430",
            letterSpacing: "4px",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          DEEPAK EXPRESS
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#3A4A3A",
            letterSpacing: "4px",
            marginBottom: 48,
          }}
        >
          DK-0402 · PORTFOLIO RAILWAY
        </div>
        <button
          onClick={handleBoard}
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "18px 24px",
            background: "#F4C430",
            border: "none",
            borderRadius: 3,
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "4px",
            cursor: "pointer",
          }}
        >
          BOARD
        </button>
        {/* Direct access grid */}
        <div
          style={{
            marginTop: 24,
            width: "100%",
            maxWidth: 320,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {STATIONS.filter((s) => s.id !== "welcome").map((s) => (
            <button
              key={s.id}
              onClick={() => {
                enableAudio();
                jumpToStation(s.id as StationId);
                setBoarded(true);
              }}
              style={{
                padding: "10px 4px",
                background: "rgba(26,58,42,0.3)",
                border: "1px solid rgba(244,196,48,0.18)",
                borderRadius: 2,
                color: "#6B7280",
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "2px",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {s.displayName.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Main journey view ───────────────────────────────────────── */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: `linear-gradient(180deg, ${envColors.bg} 0%, #060A06 100%)`,
        transition: "background 2.5s ease",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-railway)",
        overflowY: "hidden",
      }}
    >
      {/* Fixed branded header */}
      <div
        style={{
          padding: "12px 20px",
          background: "rgba(6,10,6,0.85)",
          borderBottom: "1px solid rgba(244,196,48,0.18)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              color: "#F4C430",
              letterSpacing: "3px",
            }}
          >
            DK-0402
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "rgba(244,196,48,0.4)",
              letterSpacing: "2px",
            }}
          >
            DEEPAK EXPRESS
          </div>
        </div>

        {/* Station pills mini strip */}
        <div style={{ display: "flex", gap: 4 }}>
          {STATIONS.map((s, i) => (
            <div
              key={s.id}
              style={{
                width: i === currentStationIndex ? 12 : 5,
                height: 5,
                borderRadius: 3,
                background:
                  i === currentStationIndex
                    ? "#F4C430"
                    : i < currentStationIndex
                      ? "#2ECC71"
                      : "#1E2E1E",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Speed indicator */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "#3A4A3A",
            letterSpacing: "1px",
          }}
        >
          {trainState.speed} km/h
        </div>
      </div>

      {/* Scrollable station content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          scrollbarWidth: "none",
        }}
        className="station-content-scroll"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStation?.id}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Platform label */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                color: "rgba(244,196,48,0.5)",
                letterSpacing: "4px",
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              {currentStation?.platformLabel?.toUpperCase()}
            </div>

            {/* Station content — swipeable slides (same as desktop) */}
            {slideSet && (
              <div style={{ height: 420, overflow: "hidden" }}>
                <SlideFrame
                  key={currentStation.id}
                  slides={slideSet.slides}
                  labels={slideSet.labels}
                  accent="#F4C430"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — large touch targets */}
      <div
        style={{
          padding: "12px 16px",
          background: "rgba(6,10,6,0.9)",
          borderTop: "1px solid rgba(244,196,48,0.14)",
          backdropFilter: "blur(8px)",
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          disabled={isFirst}
          onClick={handlePrev}
          aria-label="Previous station"
          style={{
            minHeight: 48,
            padding: "10px 8px",
            background: "transparent",
            border: "1px solid rgba(244,196,48,0.2)",
            borderRadius: 2,
            color: isFirst ? "#2A3A2A" : "#F4C430",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "2px",
            cursor: isFirst ? "not-allowed" : "pointer",
          }}
        >
          ← PREV
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "2px",
            }}
          >
            {currentStation?.displayName?.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "rgba(244,196,48,0.4)",
              letterSpacing: "2px",
              marginTop: 2,
            }}
          >
            {currentStationIndex + 1} / {STATIONS.length}
          </div>
        </div>

        <button
          disabled={isLast}
          onClick={handleNext}
          aria-label="Next station"
          style={{
            minHeight: 48,
            padding: "10px 8px",
            background: isLast ? "transparent" : "#F4C430",
            border: "1px solid rgba(244,196,48,0.2)",
            borderRadius: 2,
            color: isLast ? "#2A3A2A" : "#0A0A0A",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "2px",
            cursor: isLast ? "not-allowed" : "pointer",
          }}
        >
          {isLast ? "END" : "NEXT →"}
        </button>
      </div>
    </div>
  );
}
