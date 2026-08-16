"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import SlideFrame from "@/components/railway/SlideFrame";
import { SLIDES as WelcomeSlides,    SLIDE_LABELS as WelcomeLabels    } from "@/components/stations/WelcomeStation";
import { SLIDES as EducationSlides,  SLIDE_LABELS as EducationLabels  } from "@/components/stations/EducationStation";
import { SLIDES as ExperienceSlides, SLIDE_LABELS as ExperienceLabels } from "@/components/stations/ExperienceStation";
import { SLIDES as ProjectsSlides,   SLIDE_LABELS as ProjectsLabels   } from "@/components/stations/ProjectsStation";
import { SLIDES as SkillsSlides,     SLIDE_LABELS as SkillsLabels     } from "@/components/stations/SkillsStation";
import { SLIDES as ContactSlides,    SLIDE_LABELS as ContactLabels    } from "@/components/stations/ContactStation";
import type { StationId } from "@/lib/railway/types";

/* ── Slide set registry ──────────────────────────────────────── */
const STATION_SLIDES: Record<StationId, { slides: React.ComponentType[]; labels: string[] }> = {
  welcome:    { slides: WelcomeSlides,    labels: WelcomeLabels    },
  education:  { slides: EducationSlides,  labels: EducationLabels  },
  experience: { slides: ExperienceSlides, labels: ExperienceLabels },
  projects:   { slides: ProjectsSlides,   labels: ProjectsLabels   },
  skills:     { slides: SkillsSlides,     labels: SkillsLabels     },
  contact:    { slides: ContactSlides,    labels: ContactLabels    },
};

/*
 * Per-station accent colour — used for the panel left-edge stripe,
 * header text, progress pills, and scrollbar thumb.
 */
const STATION_ACCENTS: Record<StationId, string> = {
  welcome:    "#F4C430",
  education:  "#87CEEB",
  experience: "#E88B5A",
  projects:   "#B87ED6",
  skills:     "#A8C8A8",
  contact:    "#F4C430",
};

interface StationContentOverlayProps {
  /** Disables the progress-pill jump buttons while a journey animation runs */
  isAnimating: boolean;
}

/**
 * StationContentOverlay — "Carriage Logbook" side drawer.
 *
 * Replaces the old floating overlay card with a full-height panel that
 * slides in from the right edge like a carriage door opening. Key benefits:
 *
 *  • Full 100 vh height  → content never clips vertically.
 *  • Internally scrollable with a thin amber scrollbar.
 *  • Footer contains navigation (PREV / DEPART) so the bottom HUD
 *    can be hidden while the panel is open.
 *  • Per-station accent stripe on the left edge for visual identity.
 *  • Clicking the dimmed scene backdrop closes the panel.
 */
export default function StationContentOverlay({ isAnimating }: StationContentOverlayProps) {
  const {
    phase,
    currentStationIndex,
    jumpToStation,
    setPhase,
  } = useJourneyStore();

  const isVisible      = phase === "STOPPED";
  const currentStation = STATIONS[currentStationIndex];
  const slideSet       = currentStation ? STATION_SLIDES[currentStation.id] : null;
  const accent         = currentStation ? STATION_ACCENTS[currentStation.id] : "#F4C430";

  /* Close = keep train stopped but hide the panel (EXPLORE mode) */
  const handleClose = () => setPhase("EXPLORE");

  return (
    <>
      <AnimatePresence>
        {isVisible && slideSet && (
          <>
            {/* ── Scene backdrop / dimmer ───────────────────────────── */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(2,6,2,0.58)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                zIndex: 48,
                cursor: "pointer",
              }}
            />

            {/* ── Carriage door panel ───────────────────────────────── */}
            <motion.aside
              key={`panel-${currentStation.id}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              aria-label={`${currentStation.displayName} — station information`}
              style={{
                position: "fixed",
                top: 42,          /* clears the top HUD strip (~42px tall) */
                right: 0,
                width: "min(62vw, 840px)",
                height: "calc(100vh - 42px)",
                background: "#060C06",
                borderLeft: `3px solid ${accent}`,
                zIndex: 49,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: "var(--font-mono)",
              }}
            >
              {/* Decorative rivets on the left edge */}
              {[18, "calc(100% - 18px)"].map((top, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: -6,
                    top,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: accent,
                    opacity: 0.7,
                    zIndex: 2,
                    flexShrink: 0,
                  }}
                />
              ))}

              {/* Subtle graph-paper texture overlay (very faint) */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(168,200,168,0.02) 1px, transparent 1px)," +
                    "linear-gradient(90deg, rgba(168,200,168,0.02) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              {/* ── Header ──────────────────────────────────────────── */}
              <header
                style={{
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 28px",
                  height: 60,
                  background:
                    "linear-gradient(180deg, rgba(4,8,4,0.95) 0%, rgba(6,12,6,0.85) 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Platform + station name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span
                    style={{
                      fontSize: 8,
                      color: "rgba(244,196,48,0.45)",
                      letterSpacing: "5px",
                      lineHeight: 1,
                    }}
                  >
                    {currentStation.platformLabel.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: accent,
                      letterSpacing: "4px",
                      lineHeight: 1,
                    }}
                  >
                    {currentStation.displayName.toUpperCase()}
                  </span>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  aria-label="Close station panel"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(244,196,48,0.2)",
                    borderRadius: 2,
                    padding: "6px 12px",
                    color: "rgba(244,196,48,0.5)",
                    fontSize: 8,
                    letterSpacing: "2px",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(244,196,48,0.6)";
                    e.currentTarget.style.color = "#F4C430";
                    e.currentTarget.style.background = "rgba(244,196,48,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(244,196,48,0.2)";
                    e.currentTarget.style.color = "rgba(244,196,48,0.5)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  [ × CLOSE ]
                </button>
              </header>

              {/* Accent gradient line below header */}
              <div
                aria-hidden="true"
                style={{
                  height: 2,
                  flexShrink: 0,
                  background: `linear-gradient(90deg, ${accent}60 0%, ${accent}18 55%, transparent 100%)`,
                }}
              />

              {/* ── Slide content area ───────────────────────────── */}
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <SlideFrame
                  key={currentStation.id}
                  slides={slideSet.slides}
                  labels={slideSet.labels}
                  accent={accent}
                />
              </div>

              {/* ── Footer — journey progress only ─────────────── */}
              <footer
                style={{
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  padding: "12px 28px",
                  background:
                    "linear-gradient(0deg, rgba(4,8,4,0.95) 0%, rgba(6,12,6,0.85) 100%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {STATIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { if (!isAnimating) jumpToStation(s.id); }}
                    aria-label={`Go to ${s.displayName}`}
                    title={s.displayName}
                    style={{
                      height: 4,
                      width: i === currentStationIndex ? 22 : 8,
                      borderRadius: 2,
                      border: "none",
                      padding: 0,
                      background:
                        i === currentStationIndex
                          ? accent
                          : i < currentStationIndex
                            ? `${accent}55`
                            : "rgba(255,255,255,0.08)",
                      cursor: isAnimating ? "not-allowed" : "pointer",
                      transition: "width 0.35s ease, background 0.35s ease",
                      flexShrink: 0,
                    }}
                  />
                ))}
                <span
                  style={{
                    fontSize: 7,
                    color: "rgba(244,196,48,0.32)",
                    letterSpacing: "2px",
                    whiteSpace: "nowrap",
                    marginLeft: 8,
                  }}
                >
                  {currentStationIndex + 1}&nbsp;/&nbsp;{STATIONS.length}
                </span>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
