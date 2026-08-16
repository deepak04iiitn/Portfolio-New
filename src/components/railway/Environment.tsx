"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import type { EnvironmentState } from "@/lib/railway/types";

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

  return (
    <div
      style={{
        position: "fixed",
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

      {/* ── Scene children (world, platforms, etc.) ───────── */}
      {children}
    </div>
  );
}
