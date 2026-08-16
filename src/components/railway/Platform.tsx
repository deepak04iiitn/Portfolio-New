"use client";

export interface PlatformProps {
  stationName: string;
  platformLabel: string;
  isActive?: boolean;
  timeOfDay?: string;
}

/**
 * Station platform rendered as SVG.
 * Includes: canopy with support pillars, concrete slab, yellow tactile paving,
 * name signboard, bench, lamp post, and a status LED.
 */
export default function Platform({
  stationName,
  platformLabel,
  isActive = false,
  timeOfDay = "day",
}: PlatformProps) {
  const isNight = timeOfDay === "night" || timeOfDay === "sunset";
  const lampColor = isNight ? "#FFF0A0" : "#333333";
  const lampGlow = isNight ? "rgba(255,240,160,0.5)" : "transparent";

  return (
    <svg
      viewBox="0 0 240 160"
      width={240}
      height={160}
      style={{ display: "block", overflow: "visible" }}
      aria-label={`${stationName}, ${platformLabel}`}
      role="img"
    >
      <defs>
        {/* Concrete slab */}
        <linearGradient id={`concGrad-${platformLabel}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4CCBC" />
          <stop offset="100%" stopColor="#A89E8E" />
        </linearGradient>

        {/* Canopy roof timber */}
        <linearGradient id={`roofGrad-${platformLabel}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5C4A2C" />
          <stop offset="100%" stopColor="#3A2E1A" />
        </linearGradient>

        {/* Corrugated roof metal */}
        <linearGradient id={`corrGrad-${platformLabel}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7A6A50" />
          <stop offset="50%" stopColor="#5A4C36" />
          <stop offset="100%" stopColor="#3A2E1A" />
        </linearGradient>

        {/* Signboard */}
        <linearGradient id={`signGrad-${platformLabel}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A2E1A" />
          <stop offset="100%" stopColor="#0E1C0E" />
        </linearGradient>

        {/* Lamp glow filter */}
        <filter id={`lampGlow-${platformLabel}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          CANOPY ROOF
      ════════════════════════════════════════════════════════ */}
      {/* Corrugated metal roof */}
      {[0, 6, 12, 18, 24, 30, 36].map((x) => (
        <rect
          key={`cor-${x}`}
          x={x * 6 + 14} y="6" width="6" height="15"
          rx="1"
          fill="url(#corrGrad-${platformLabel})"
          opacity={0.9}
        />
      ))}
      {/* Roof fascia beam */}
      <rect x="14" y="6" width="212" height="7" rx="2"
        fill={`url(#roofGrad-${platformLabel})`} />
      {/* Roof gutter edge */}
      <rect x="14" y="18" width="212" height="3" rx="1" fill="#2A1E0E" />
      {/* Roof top highlight */}
      <rect x="14" y="6" width="212" height="1.5" rx="1"
        fill="rgba(255,255,255,0.10)" />

      {/* Roof support pillars */}
      {[24, 78, 132, 186, 216].map((x) => (
        <g key={`pillar-${x}`}>
          <rect x={x - 4} y="21" width="8" height="82" rx="1.5" fill="#2A1E0E" />
          {/* Pillar highlight */}
          <rect x={x - 4} y="21" width="2" height="82" rx="1"
            fill="rgba(255,255,255,0.04)" />
          {/* Pillar base plate */}
          <rect x={x - 6} y="101" width="12" height="4" rx="1" fill="#1E1610" />
        </g>
      ))}

      {/* ═══════════════════════════════════════════════════════
          PLATFORM SLAB
      ════════════════════════════════════════════════════════ */}
      {/* Main slab */}
      <rect x="0" y="103" width="240" height="38" rx="0"
        fill={`url(#concGrad-${platformLabel})`} />
      {/* Slab front edge (rounded nosing) */}
      <rect x="0" y="103" width="240" height="4" rx="0" fill="#C0B8A8" />

      {/* Slab expansion joints */}
      {[60, 120, 180].map((x) => (
        <line key={`joint-${x}`}
          x1={x} y1="107" x2={x} y2="141"
          stroke="#8A8070" strokeWidth="1" opacity="0.5" />
      ))}

      {/* ── Yellow tactile / safety strip ─────────────── */}
      <rect x="0" y="107" width="240" height="5"
        fill="#F4C430" opacity="0.88" />
      {/* Tactile dome pattern */}
      {Array.from({ length: 12 }).map((_, i) =>
        [0, 1].map((row) => (
          <circle
            key={`tact-${i}-${row}`}
            cx={10 + i * 20}
            cy={109.5 + row * 4}
            r="1.5"
            fill="#C8A000"
            opacity="0.7"
          />
        ))
      )}

      {/* ── Concrete surface detail (poured lines) ─────── */}
      {[20, 40, 80, 100, 140, 160, 200, 220].map((x, i) => (
        <line
          key={`crack-${i}`}
          x1={x} y1="115"
          x2={x + 5 + (i % 3) * 4} y2="140"
          stroke="#9A9286" strokeWidth="0.4" opacity="0.3"
        />
      ))}

      {/* ═══════════════════════════════════════════════════════
          STATION SIGNBOARD
      ════════════════════════════════════════════════════════ */}
      {/* Board frame (outer glow when active) */}
      {isActive && (
        <rect x="27" y="28" width="186" height="66" rx="4"
          fill="none" stroke="#F4C430" strokeWidth="2"
          opacity="0.4"
          style={{ filter: "blur(3px)" }}
        />
      )}
      {/* Board body */}
      <rect x="30" y="31" width="180" height="62" rx="3"
        fill={`url(#signGrad-${platformLabel})`}
        stroke="#F4C430" strokeWidth={isActive ? "1.5" : "1"}
        opacity={isActive ? 1 : 0.85}
      />
      {/* Board inner inset */}
      <rect x="33" y="34" width="174" height="56" rx="2"
        fill="rgba(255,255,255,0.02)" />

      {/* Platform label */}
      <text
        x="120" y="52"
        textAnchor="middle"
        fill="#F4C430"
        fontSize="9"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="600"
        letterSpacing="3"
        opacity="0.9"
      >
        {platformLabel.toUpperCase()}
      </text>

      {/* Divider line on sign */}
      <line x1="45" y1="57" x2="195" y2="57"
        stroke="rgba(244,196,48,0.3)" strokeWidth="0.8" />

      {/* Station name */}
      <text
        x="120" y="73"
        textAnchor="middle"
        fill="#F5F0E8"
        fontSize="11.5"
        fontFamily="'Oswald', 'Rajdhani', sans-serif"
        fontWeight="700"
        letterSpacing="1.5"
      >
        {stationName.toUpperCase()}
      </text>

      {/* Status LED */}
      <circle cx="198" cy="39" r="4.5"
        fill={isActive ? "#2ECC71" : "#444444"} />
      {isActive && (
        <>
          <circle cx="198" cy="39" r="7"
            fill="none" stroke="#2ECC71" strokeWidth="1" opacity="0.4" />
          <circle cx="198" cy="39" r="4.5"
            fill="#2ECC71"
            style={{ filter: "blur(2px)" }}
            opacity="0.6"
          />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          BENCH
      ════════════════════════════════════════════════════════ */}
      {/* Seat plank */}
      <rect x="48" y="92" width="70" height="9" rx="2" fill="#3A2810" />
      {/* Plank grain */}
      <line x1="52" y1="95" x2="114" y2="95" stroke="#2A1C08" strokeWidth="0.5" opacity="0.4" />
      <line x1="52" y1="98" x2="114" y2="98" stroke="#2A1C08" strokeWidth="0.4" opacity="0.3" />
      {/* Seat legs */}
      <rect x="52" y="82" width="5" height="12" rx="1" fill="#2A1C08" />
      <rect x="108" y="82" width="5" height="12" rx="1" fill="#2A1C08" />
      {/* Back support */}
      <rect x="48" y="80" width="70" height="5" rx="2" fill="#3A2810" />

      {/* ═══════════════════════════════════════════════════════
          LAMP POST
      ════════════════════════════════════════════════════════ */}
      {/* Pole */}
      <rect x="202" y="22" width="5" height="84" rx="1.5" fill="#222222" />
      {/* Arm */}
      <path d="M 205,28 Q 205,18 215,18" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      {/* Lamp housing */}
      <ellipse cx="215" cy="18" rx="12" ry="5" fill="#1A1A1A" />
      {/* Lamp lens */}
      {isNight ? (
        <>
          <ellipse cx="215" cy="16" rx="9" ry="4" fill={lampColor} />
          <ellipse cx="215" cy="16" rx="9" ry="4"
            fill={lampGlow}
            style={{ filter: "blur(4px)" }}
          />
        </>
      ) : (
        <ellipse cx="215" cy="16" rx="9" ry="4" fill="#282828" />
      )}
      {/* Pole base */}
      <rect x="199" y="103" width="11" height="6" rx="1" fill="#1A1A1A" />
    </svg>
  );
}
