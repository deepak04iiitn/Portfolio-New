"use client";

import { useJourneyStore } from "@/hooks/useJourneyState";

/**
 * MuteToggle — compact SVG-icon button placed at the right end
 * of the top HUD strip. Globally mutes / unmutes all Howler sounds.
 */
export default function MuteToggle() {
  const { isMuted, isAudioEnabled, toggleMute } = useJourneyStore();

  /* Don't render until audio is enabled (user has boarded) */
  if (!isAudioEnabled) return null;

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      title={isMuted ? "Unmute" : "Mute"}
      style={{
        padding: "8px 14px",
        background: "transparent",
        border: "none",
        borderLeft: "1px solid rgba(244, 196, 48, 0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isMuted ? "rgba(92,99,112,0.7)" : "rgba(244,196,48,0.75)",
        transition: "color 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = isMuted ? "#5C6370" : "#F4C430";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = isMuted
          ? "rgba(92,99,112,0.7)"
          : "rgba(244,196,48,0.75)";
      }}
    >
      {isMuted ? <IconMuted /> : <IconUnmuted />}
    </button>
  );
}

/* ── SVG Icons ──────────────────────────────────────────────── */

function IconUnmuted() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {/* Sound waves */}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {/* X lines */}
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
