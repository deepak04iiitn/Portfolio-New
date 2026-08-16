"use client";

import { useRef, useEffect, useMemo, type CSSProperties } from "react";
import gsap from "gsap";
import type { EnvironmentState } from "@/lib/railway/types";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";

interface EnvironmentProps {
  state: EnvironmentState;
  children?: React.ReactNode;
}

/**
 * Full-screen environment backdrop.
 * Sky, horizon glow, fog, clouds, and ground transition smoothly
 * between time-of-day states using GSAP color tweening.
 */
export default function Environment({ state, children }: EnvironmentProps) {
  const skyRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<SVGSVGElement>(null);

  /* ── Animate environment on station change ────────────────── */
  useEffect(() => {
    const dur = 3.5;
    const ease = "power1.inOut";

    // Sky gradient: tween proxy object and update background on each frame
    const skyProxy = { top: 0, bot: 0 }; // dummy — we use the raw values below

    gsap.to(skyRef.current, {
      background: `linear-gradient(180deg, ${state.skyTop} 0%, ${state.skyBottom} 100%)`,
      duration: dur,
      ease,
    });

    gsap.to(groundRef.current, {
      backgroundColor: state.groundColor,
      duration: dur,
      ease,
    });

    gsap.to(horizonRef.current, {
      background: state.horizonGlow === "transparent"
        ? "rgba(0,0,0,0)"
        : state.horizonGlow,
      opacity: state.horizonGlow === "transparent" ? 0 : 1,
      duration: dur,
      ease,
    });

    gsap.to(fogRef.current, {
      opacity: state.fogOpacity,
      duration: dur,
      ease,
    });

    if (cloudRef.current) {
      gsap.to(cloudRef.current, {
        opacity: state.cloudOpacity,
        duration: dur,
        ease,
      });
    }
  }, [
    state.skyTop,
    state.skyBottom,
    state.groundColor,
    state.horizonGlow,
    state.fogOpacity,
    state.cloudOpacity,
  ]);

  /* ── Sync data-time attribute on <html> for CSS-driven theming ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-time", state.timeOfDay);
  }, [state.timeOfDay]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* ── Sky ────────────────────────────────────────────── */}
      <div
        ref={skyRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "65%",
          background: `linear-gradient(180deg, ${state.skyTop} 0%, ${state.skyBottom} 100%)`,
          transition: "background 0.1s", // GSAP overrides this
        }}
      />

      {/* ── Ground ─────────────────────────────────────────── */}
      <div
        ref={groundRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "36%",
          backgroundColor: state.groundColor,
        }}
      />

      {/* ── Horizon glow (sunset/sunrise accent) ─────────── */}
      <div
        ref={horizonRef}
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          height: "160px",
          background: state.horizonGlow,
          filter: "blur(32px)",
          opacity: state.horizonGlow === "transparent" ? 0 : 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Fog layer ─────────────────────────────────────── */}
      <div
        ref={fogRef}
        style={{
          position: "absolute",
          bottom: "30%",
          left: 0,
          right: 0,
          height: "100px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(196,188,176,0.5) 100%)",
          opacity: state.fogOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Clouds ───────────────────────────────────────── */}
      <svg
        ref={cloudRef}
        viewBox="0 0 1440 200"
        style={{
          position: "absolute",
          top: "40px",
          left: 0,
          width: "100%",
          opacity: state.cloudOpacity,
          pointerEvents: "none",
        }}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="cloudBlur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Cloud 1 — large foreground */}
        <g filter="url(#cloudBlur)" opacity="0.88">
          <ellipse cx="220" cy="58" rx="96" ry="30" fill="#F8F8F8" />
          <ellipse cx="265" cy="46" rx="64" ry="22" fill="#FAFAFA" />
          <ellipse cx="178" cy="52" rx="52" ry="19" fill="#F3F3F3" />
        </g>

        {/* Cloud 2 — medium mid */}
        <g filter="url(#cloudBlur)" opacity="0.72">
          <ellipse cx="720" cy="80" rx="76" ry="24" fill="#ECECEC" />
          <ellipse cx="756" cy="68" rx="48" ry="18" fill="#F2F2F2" />
          <ellipse cx="688" cy="75" rx="38" ry="15" fill="#E8E8E8" />
        </g>

        {/* Cloud 3 — small far */}
        <g filter="url(#cloudBlur)" opacity="0.55">
          <ellipse cx="1120" cy="48" rx="58" ry="19" fill="#F0F0F0" />
          <ellipse cx="1152" cy="39" rx="38" ry="13" fill="#F5F5F5" />
        </g>

        {/* Cloud 4 — distant right */}
        <g filter="url(#cloudBlur)" opacity="0.45">
          <ellipse cx="1340" cy="70" rx="44" ry="15" fill="#EBEBEB" />
          <ellipse cx="1362" cy="62" rx="28" ry="10" fill="#F0F0F0" />
        </g>
      </svg>

      {/* ── Stars (visible at night / sunset) ───────────── */}
      {(state.timeOfDay === "night" || state.timeOfDay === "sunset") && (
        <svg
          viewBox="0 0 1440 350"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "65%",
            opacity: state.timeOfDay === "night" ? 0.8 : 0.25,
            pointerEvents: "none",
            transition: "opacity 3s ease",
          }}
          aria-hidden="true"
        >
          {[
            [120, 40], [280, 85], [450, 30], [620, 65], [750, 20],
            [900, 50], [1050, 35], [1180, 75], [1300, 25], [1400, 55],
            [60, 100], [340, 15], [510, 90], [680, 42], [840, 10],
            [970, 80], [1120, 55], [1240, 30], [1380, 90],
          ].map(([x, y], i) => (
            <circle
              key={`star-${i}`}
              cx={x} cy={y} r={1 + (i % 3) * 0.4}
              fill="#F5F0E8"
              opacity={0.4 + (i % 4) * 0.15}
            />
          ))}
        </svg>
      )}

      {/* ── Building silhouettes ─────────────────────────── */}
      <BuildingLayer timeOfDay={state.timeOfDay} />

      {/* ── Scene children (world, platforms, etc.) ───────── */}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BuildingLayer — contextual SVG silhouettes per station
   Positioned at the horizon (bottom: 36%) inside the environment.
   Window opacity driven by timeOfDay; lit pattern is deterministic
   so windows don't flicker on re-render.
───────────────────────────────────────────────────────────────── */
function BuildingLayer({ timeOfDay }: { timeOfDay: string }) {
  const { currentStationIndex } = useJourneyStore();
  const stationType = STATIONS[currentStationIndex]?.id ?? "welcome";

  const windowOpacity =
    timeOfDay === "night"
      ? 0.85
      : timeOfDay === "sunset"
        ? 0.55
        : timeOfDay === "evening"
          ? 0.25
          : 0;

  /* Deterministic lit-window check — avoids flicker on re-render */
  const isLit = (bi: number, row: number, col: number) =>
    (bi * 7 + row * 3 + col * 11) % 5 !== 0;

  return (
    <svg
      viewBox="0 0 1440 320"
      style={{
        position: "absolute",
        bottom: "35%",
        left: 0,
        width: "100%",
        pointerEvents: "none",
        transition: "opacity 3s ease",
        /* No zIndex — DOM order places {children} (world-pan/platforms)
           after BuildingLayer in the JSX, so they naturally render on top
           without an explicit z-index fight. */
      }}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* ── Office towers — Experience / Projects station ── */}
      {(stationType === "experience" || stationType === "projects") && (
        <>
          {/* Left cluster */}
          <rect x="80"  y="120" width="60"  height="200" fill="#1A1A1A" />
          <rect x="160" y="60"  width="80"  height="260" fill="#141414" />
          <rect x="260" y="140" width="50"  height="180" fill="#1C1C1C" />
          {/* Right cluster */}
          <rect x="900"  y="80"  width="90"  height="240" fill="#161616" />
          <rect x="1010" y="120" width="60"  height="200" fill="#1A1A1A" />
          <rect x="1090" y="50"  width="100" height="270" fill="#131313" />
          <rect x="1220" y="100" width="75"  height="220" fill="#181818" />

          {/* Window grids */}
          {(
            [
              [100, 140],
              [180, 80],
              [280, 160],
              [920, 100],
              [1030, 140],
              [1110, 70],
              [1240, 120],
            ] as [number, number][]
          ).map(([bx, by], bi) =>
            Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 3 }).map((_, col) => (
                <rect
                  key={`w-${bi}-${row}-${col}`}
                  x={bx + col * 12}
                  y={by + row * 20}
                  width="6"
                  height="10"
                  fill="#F4C430"
                  opacity={isLit(bi, row, col) ? windowOpacity * 0.8 : 0}
                />
              ))
            )
          )}
        </>
      )}

      {/* ── Campus / academia — Education station ── */}
      {stationType === "education" && (
        <>
          {/* Main building with gabled roof */}
          <rect    x="100" y="180" width="120" height="140" fill="#2A2A1A" />
          <polygon points="100,180 220,180 160,120"          fill="#3A3A22" />
          <rect    x="140" y="200" width="40"  height="60"  fill="#1A1A0A" />

          {/* Clock tower */}
          <rect   x="600" y="100" width="40"  height="220" fill="#1E1E14" />
          <rect   x="590" y="95"  width="60"  height="20"  fill="#282818" />
          <circle cx="620" cy="120" r="18"
            fill="none" stroke="#5C5C3A" strokeWidth="2" />
          {/* Clock face glow at night */}
          {windowOpacity > 0 && (
            <circle cx="620" cy="120" r="16"
              fill="#F4C430" opacity={windowOpacity * 0.15} />
          )}

          {/* Distant building row */}
          <rect x="820"  y="150" width="90"  height="170" fill="#242414" />
          <rect x="930"  y="170" width="70"  height="150" fill="#1E1E10" />
          <rect x="1010" y="130" width="60"  height="190" fill="#222212" />

          {/* Trees */}
          {[200, 320, 450, 800, 950, 1100, 1280].map((tx) => (
            <g key={tx}>
              <ellipse cx={tx}   cy="260" rx="28" ry="36" fill="#1A3A1A" />
              <ellipse cx={tx}   cy="255" rx="22" ry="28" fill="#243A24" />
              <rect    x={tx - 4} y="290" width="8" height="30" fill="#1A0F0A" />
            </g>
          ))}
        </>
      )}

      {/* ── Terminal / digital motif — Projects station ── */}
      {stationType === "projects" && (
        <>
          {/* Monitors — grounded: stands reach y=320 (SVG ground line) */}
          {/* Left monitor */}
          <rect x="310" y="258" width="140" height="8"  fill="#080808" /> {/* desk surface */}
          <rect x="340" y="210" width="80"  height="48" rx="3"
            fill="#0D0D0D" stroke="#1A3A2A" strokeWidth="1" />
          <rect x="375" y="258" width="10"  height="62" fill="#090909" /> {/* neck */}
          <rect x="345" y="312" width="70"  height="8"  fill="#0A0A0A" /> {/* base */}

          {/* Right monitor */}
          <rect x="710" y="250" width="160" height="8"  fill="#080808" /> {/* desk surface */}
          <rect x="740" y="196" width="100" height="54" rx="3"
            fill="#0D0D0D" stroke="#1A3A2A" strokeWidth="1" />
          <rect x="785" y="250" width="10"  height="62" fill="#090909" /> {/* neck */}
          <rect x="748" y="304" width="84"  height="8"  fill="#0A0A0A" /> {/* base */}

          {/* Screen glows at night */}
          {windowOpacity > 0 && (
            <>
              <rect x="342" y="212" width="76" height="44" rx="2"
                fill="#0D2A0D" opacity={windowOpacity * 0.4} />
              <rect x="742" y="198" width="96" height="50" rx="2"
                fill="#0D2A0D" opacity={windowOpacity * 0.4} />
            </>
          )}
        </>
      )}

      {/* ── Industrial skyline — Skills station ── */}
      {stationType === "skills" && (
        <>
          {/* Factory silhouettes */}
          <rect x="60"   y="160" width="100" height="160" fill="#181810" />
          <rect x="60"   y="140" width="30"  height="20"  fill="#201E10" />
          {/* Smoke stacks */}
          <rect x="170"  y="130" width="18"  height="190" fill="#141410" />
          <rect x="200"  y="150" width="14"  height="170" fill="#181814" />
          <rect x="500"  y="110" width="20"  height="210" fill="#141410" />
          {/* Right side warehouse */}
          <rect x="950"  y="170" width="160" height="150" fill="#161612" />
          <rect x="1120" y="180" width="80"  height="140" fill="#1A1A14" />
          <rect x="1210" y="140" width="100" height="180" fill="#141410" />
          {/* Antenna masts */}
          <line x1="1000" y1="170" x2="1000" y2="80"
            stroke="#2A2A20" strokeWidth="2" />
          <line x1="1050" y1="170" x2="1050" y2="100"
            stroke="#2A2A20" strokeWidth="2" />
          {/* Signal light at night */}
          {windowOpacity > 0 && (
            <>
              <circle cx="1000" cy="80" r="3"
                fill="#C0392B" opacity={windowOpacity} />
              <circle cx="1050" cy="100" r="2.5"
                fill="#C0392B" opacity={windowOpacity * 0.8} />
            </>
          )}
        </>
      )}

      {/* ── Signal towers — Socials station ── */}
      {stationType === "socials" && (
        <>
          {/* Left antenna tower */}
          <rect x="140" y="100" width="6"  height="220" fill="#0E0E16" />
          <rect x="134" y="100" width="18" height="4"   fill="#0E0E16" />
          {/* cross-braces */}
          <line x1="140" y1="140" x2="134" y2="160" stroke="#14141E" strokeWidth="2" />
          <line x1="146" y1="140" x2="152" y2="160" stroke="#14141E" strokeWidth="2" />
          <line x1="140" y1="190" x2="134" y2="210" stroke="#14141E" strokeWidth="2" />
          <line x1="146" y1="190" x2="152" y2="210" stroke="#14141E" strokeWidth="2" />
          {/* blinking light */}
          {windowOpacity > 0 && (
            <circle cx="143" cy="96" r="3" fill="#60A5FA" opacity={windowOpacity * 0.9} />
          )}
          {/* Dish */}
          <path d="M 160,180 Q 185,165 210,180" fill="none" stroke="#0E0E16" strokeWidth="5" />
          <line x1="185" y1="172" x2="185" y2="195" stroke="#0E0E16" strokeWidth="3" />

          {/* Right tall tower */}
          <rect x="820" y="60"  width="8"  height="260" fill="#0A0A12" />
          <rect x="812" y="60"  width="24" height="5"   fill="#0A0A12" />
          <line x1="820" y1="110" x2="812" y2="135" stroke="#111118" strokeWidth="2" />
          <line x1="828" y1="110" x2="836" y2="135" stroke="#111118" strokeWidth="2" />
          <line x1="820" y1="170" x2="812" y2="195" stroke="#111118" strokeWidth="2" />
          <line x1="828" y1="170" x2="836" y2="195" stroke="#111118" strokeWidth="2" />
          <line x1="820" y1="230" x2="812" y2="255" stroke="#111118" strokeWidth="2" />
          <line x1="828" y1="230" x2="836" y2="255" stroke="#111118" strokeWidth="2" />
          {windowOpacity > 0 && (
            <circle cx="824" cy="56" r="4" fill="#60A5FA" opacity={windowOpacity * 0.85} />
          )}
          {/* Satellite dish right */}
          <path d="M 855,200 Q 878,183 900,200" fill="none" stroke="#0A0A12" strokeWidth="5" />
          <line x1="877" y1="190" x2="877" y2="215" stroke="#0A0A12" strokeWidth="3" />

          {/* Faint signal ripples (night only) */}
          {windowOpacity > 0 && (
            <>
              <circle cx="143" cy="96" r="10" fill="none" stroke="#60A5FA" strokeWidth="1" opacity={windowOpacity * 0.15} />
              <circle cx="143" cy="96" r="18" fill="none" stroke="#60A5FA" strokeWidth="1" opacity={windowOpacity * 0.08} />
              <circle cx="824" cy="56" r="12" fill="none" stroke="#60A5FA" strokeWidth="1" opacity={windowOpacity * 0.15} />
              <circle cx="824" cy="56" r="22" fill="none" stroke="#60A5FA" strokeWidth="1" opacity={windowOpacity * 0.07} />
            </>
          )}
        </>
      )}

      {/* ── Sunset coast — Contact / final station ── */}
      {stationType === "contact" && (
        <>
          {/* Low cliffs */}
          <path
            d="M 0 320 L 0 220 Q 100 200 200 210 Q 350 215 400 200
               Q 500 180 600 195 Q 700 205 800 190 L 1440 195 L 1440 320 Z"
            fill="#1A1A12"
          />
          {/* Distant lighthouse */}
          <rect x="880" y="100" width="16"  height="90"  fill="#1E1E18" />
          <rect x="876" y="96"  width="24"  height="12"  fill="#2A2A1E" />
          {windowOpacity > 0 && (
            <circle cx="888" cy="96" r="6"
              fill="#F4C430" opacity={windowOpacity}
              style={{ filter: "blur(1px)" }} />
          )}
          {/* Horizon palm cluster */}
          {[240, 320, 1100, 1200].map((tx) => (
            <g key={tx}>
              <rect x={tx - 2} y="220" width="4" height="60" fill="#0F0F08" />
              <ellipse cx={tx}    cy="218" rx="18" ry="12" fill="#1A2A0A" />
            </g>
          ))}
        </>
      )}

      {/* ── Welcome — sparse distant hills ── */}
      {stationType === "welcome" && (
        <path
          d="M 0 320 L 0 260 Q 200 240 400 250 Q 600 255 720 240
             Q 900 225 1100 242 Q 1300 255 1440 250 L 1440 320 Z"
          fill="#1A2A1A"
          opacity="0.7"
        />
      )}
    </svg>
  );
}
