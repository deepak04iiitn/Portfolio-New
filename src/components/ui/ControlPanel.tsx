"use client";

import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import { getSounds } from "@/lib/audio/sounds";

interface ControlPanelProps {
  onOpenMap: () => void;
}

/**
 * ControlPanel — compact bottom-left HUD.
 * Shows live STATUS / SPEED / NEXT STOP and action buttons (HORN / MAP).
 * Appears only after the user has boarded (phase !== "BOARDING" / "LOADING").
 */
export default function ControlPanel({ onOpenMap }: ControlPanelProps) {
  const { trainState, phase, isAudioEnabled } = useJourneyStore();

  const isEnRoute = phase === "DEPARTING" || phase === "TRAVELLING" || phase === "APPROACHING_STATION" || phase === "ARRIVING";

  const nextIdx = STATIONS.findIndex((s) => s.id === trainState.nextStationId);
  const nextStation = nextIdx >= 0 ? STATIONS[nextIdx] : null;

  const statusLabel =
    phase === "IDLE"    ? "STANDBY" :
    phase === "STOPPED" ? "AT STATION" :
    isEnRoute           ? "EN ROUTE" :
    phase;

  const statusColor =
    phase === "STOPPED" || phase === "IDLE" ? "#A8C8A8" : "#F4C430";

  /* Only show after boarding */
  if (phase === "LOADING" || phase === "BOARDING") return null;

  const handleHorn = () => {
    getSounds()?.horn.play();
  };

  return (
    <div
      role="complementary"
      aria-label="Train control panel"
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 100,
        background: "var(--panel-bg)",
        border: "1px solid var(--panel-border)",
        borderRadius: "var(--panel-radius)",
        padding: "14px 18px",
        minWidth: 200,
        backdropFilter: "blur(12px)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(244,196,48,0.12)",
        }}
      >
        <span
          style={{ fontSize: 9, color: "#F4C430", letterSpacing: "2px", fontWeight: 700 }}
        >
          DEEPAK EXPRESS
        </span>
        <span style={{ fontSize: 7, color: "#3A4A3A", letterSpacing: "2px" }}>
          DX-2026
        </span>
      </div>

      {/* Status rows */}
      {[
        { label: "STATUS",    value: statusLabel,                       color: statusColor },
        { label: "SPEED",     value: `${trainState.speed} km/h`,        color: "#F5F0E8" },
        { label: "NEXT STOP", value: nextStation?.displayName.toUpperCase() ?? "—", color: "#87CEEB" },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 7, color: "#5C6370", letterSpacing: "3px" }}>
            {label}
          </span>
          <span
            style={{ fontSize: 9, color, letterSpacing: "0.5px", fontWeight: 600 }}
          >
            {value}
          </span>
        </div>
      ))}

      {/* Action buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid rgba(244,196,48,0.12)",
        }}
      >
        {[
          {
            label: "HORN",
            action: handleHorn,
            disabled: !isAudioEnabled,
          },
          {
            label: "MAP",
            action: onOpenMap,
            disabled: false,
          },
        ].map(({ label, action, disabled }) => (
          <button
            key={label}
            onClick={action}
            disabled={disabled}
            style={{
              padding: "7px 4px",
              background: disabled
                ? "rgba(20,30,20,0.4)"
                : "rgba(26,58,42,0.4)",
              border: `1px solid ${disabled ? "rgba(244,196,48,0.08)" : "rgba(244,196,48,0.2)"}`,
              borderRadius: 2,
              color: disabled ? "#2A3A2A" : "#F4C430",
              fontSize: 8,
              letterSpacing: "2px",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-mono)",
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(244,196,48,0.14)";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(26,58,42,0.4)";
                e.currentTarget.style.borderColor = "rgba(244,196,48,0.2)";
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
