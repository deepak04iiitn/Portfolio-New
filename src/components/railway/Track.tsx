"use client";

/** Total world width — must span all stations + generous padding either side */
export const TRACK_WORLD_WIDTH = 14000;

interface TrackProps {
  /** Total width in px. Defaults to TRACK_WORLD_WIDTH */
  width?: number;
}

export default function Track({ width = TRACK_WORLD_WIDTH }: TrackProps) {
  const sleepersCount = Math.ceil(width / 46);

  return (
    <svg
      viewBox={`0 0 ${width} 82`}
      width={width}
      height={82}
      preserveAspectRatio="none"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <defs>
        {/* Ballast bed */}
        <linearGradient id="ballastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9B8B6E" />
          <stop offset="40%" stopColor="#8B7B5E" />
          <stop offset="100%" stopColor="#6B5B40" />
        </linearGradient>

        {/* Rail face (top face of the rail — bright highlight) */}
        <linearGradient id="railTopFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D8D8D8" />
          <stop offset="30%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#686868" />
        </linearGradient>

        {/* Rail web (vertical part of the I-beam) */}
        <linearGradient id="railWebGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#787878" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </linearGradient>
      </defs>

      {/* ── Ballast bed ──────────────────────────────────── */}
      <rect x="0" y="22" width={width} height="60" fill="url(#ballastGrad)" />

      {/* Ballast texture: irregular gravel dots */}
      {Array.from({ length: Math.ceil(width / 14) }).map((_, i) => {
        const x = (i * 14) + (i % 5) * 3;
        const y = 28 + (i % 7) * 4;
        const r = 1 + (i % 3) * 0.5;
        return (
          <circle
            key={`g-${i}`}
            cx={x} cy={y} r={r}
            fill="#5C4C34"
            opacity={0.45 + (i % 4) * 0.1}
          />
        );
      })}

      {/* ── Railway sleepers (ties) ──────────────────────── */}
      {Array.from({ length: sleepersCount }).map((_, i) => {
        const x = i * 46 + 2;
        return (
          <g key={`sl-${i}`}>
            {/* Sleeper body — dark pressure-treated wood */}
            <rect x={x} y="25" width="38" height="13" rx="1.5" fill="#2C1E10" />
            {/* Wood grain lines */}
            <line x1={x + 2} y1="28" x2={x + 36} y2="28"
              stroke="#1C1208" strokeWidth="0.6" opacity="0.5" />
            <line x1={x + 2} y1="31" x2={x + 36} y2="31"
              stroke="#1C1208" strokeWidth="0.5" opacity="0.4" />
            <line x1={x + 2} y1="34" x2={x + 36} y2="34"
              stroke="#1C1208" strokeWidth="0.4" opacity="0.3" />
            {/* Sleeper top highlight */}
            <rect x={x} y="25" width="38" height="2" rx="1"
              fill="rgba(255,255,255,0.04)" />
          </g>
        );
      })}

      {/* ── Spike heads (fishbolts) on sleepers ─────────── */}
      {Array.from({ length: Math.ceil(sleepersCount / 1) }).map((_, i) => {
        const sx = i * 46 + 2;
        return (
          <g key={`sp-${i}`}>
            {/* Left rail spikes */}
            <circle cx={sx + 6} cy="27" r="2" fill="#4A4A4A" />
            <circle cx={sx + 12} cy="27" r="2" fill="#4A4A4A" />
            {/* Right rail spikes */}
            <circle cx={sx + 26} cy="27" r="2" fill="#4A4A4A" />
            <circle cx={sx + 32} cy="27" r="2" fill="#4A4A4A" />
          </g>
        );
      })}

      {/* ── Left rail ───────────────────────────────────── */}
      {/* Rail base flange */}
      <rect x="0" y="31" width={width} height="4" fill="#4A4A4A" />
      {/* Rail web */}
      <rect x="0" y="22" width={width} height="9" fill="url(#railWebGrad)" />
      {/* Rail head (top face — brightest, this is what wheels ride on) */}
      <rect x="0" y="20" width={width} height="5" rx="1" fill="url(#railTopFace)" />
      {/* Worn centre groove */}
      <rect x="0" y="20" width={width} height="1" fill="rgba(255,255,255,0.18)" />

      {/* ── Right rail ──────────────────────────────────── */}
      {/* Rail base flange */}
      <rect x="0" y="46" width={width} height="4" fill="#4A4A4A" />
      {/* Rail web */}
      <rect x="0" y="37" width={width} height="9" fill="url(#railWebGrad)" />
      {/* Rail head */}
      <rect x="0" y="35" width={width} height="5" rx="1" fill="url(#railTopFace)" />
      {/* Worn centre groove */}
      <rect x="0" y="35" width={width} height="1" fill="rgba(255,255,255,0.18)" />

      {/* ── Rail joint gaps (every 30 sleepers) ─────────── */}
      {Array.from({ length: Math.ceil(width / (46 * 30)) }).map((_, i) => {
        const jx = i * 46 * 30;
        return (
          <g key={`joint-${i}`}>
            {/* Left rail joint */}
            <line x1={jx} y1="18" x2={jx} y2="38"
              stroke="#0A0A0A" strokeWidth="1.5" opacity="0.6" />
            {/* Right rail joint */}
            <line x1={jx} y1="33" x2={jx} y2="53"
              stroke="#0A0A0A" strokeWidth="1.5" opacity="0.6" />
          </g>
        );
      })}
    </svg>
  );
}
