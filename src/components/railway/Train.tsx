"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export interface TrainProps {
  engineLight?: boolean;
  smoke?: boolean;
  wheelsRotating?: boolean;
  headlightOn?: boolean;
  direction?: "right" | "left";
  scale?: number;
  className?: string;
}

export default function Train({
  engineLight = false,
  smoke = false,
  wheelsRotating = false,
  headlightOn = false,
  direction = "right",
  scale = 1,
  className,
}: TrainProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const wheel1Ref = useRef<SVGGElement>(null);
  const wheel2Ref = useRef<SVGGElement>(null);
  const wheel3Ref = useRef<SVGGElement>(null);
  const wheelSmallRef = useRef<SVGGElement>(null);

  /* ── Wheel rotation ───────────────────────────────────────── */
  useGSAP(
    () => {
      const wheels = [wheel1Ref, wheel2Ref, wheel3Ref, wheelSmallRef];
      if (wheelsRotating) {
        wheels.forEach((ref) => {
          if (!ref.current) return;
          gsap.to(ref.current, {
            rotation: 360,
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
            duration: 0.55,
            ease: "none",
            repeat: -1,
          });
        });
      } else {
        wheels.forEach((ref) => {
          if (!ref.current) return;
          gsap.killTweensOf(ref.current);
          gsap.set(ref.current, { rotation: 0 });
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [wheelsRotating],
    }
  );

  /* ── Smoke puffs ──────────────────────────────────────────── */
  useGSAP(
    () => {
      if (!smokeRef.current) return;
      const puffs = Array.from(smokeRef.current.children) as SVGElement[];
      if (smoke) {
        gsap.fromTo(
          puffs,
          { y: 0, opacity: 0.65, scale: 1, transformOrigin: "50% 100%" },
          {
            y: -48,
            opacity: 0,
            scale: 2.2,
            duration: 1.5,
            stagger: 0.35,
            repeat: -1,
            ease: "power1.out",
          }
        );
      } else {
        gsap.killTweensOf(puffs);
        gsap.set(puffs, { y: 0, opacity: 0, scale: 1 });
      }
    },
    {
      scope: containerRef,
      dependencies: [smoke],
    }
  );

  const headlightColor = headlightOn ? "#FFF8C0" : "#111111";
  const headlightGlowOpacity = headlightOn ? 0.65 : 0;

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 440 165"
      width={440 * scale}
      height={165 * scale}
      className={className}
      style={{
        transform: direction === "left" ? "scaleX(-1)" : undefined,
        overflow: "visible",
        display: "block",
      }}
      aria-label="Deepak Express locomotive"
      role="img"
    >
      <defs>
        {/* ── Body ── */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A6B4A" />
          <stop offset="55%" stopColor="#1A3A2A" />
          <stop offset="100%" stopColor="#0D1E14" />
        </linearGradient>

        {/* ── Cabin ── */}
        <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C4E3C" />
          <stop offset="100%" stopColor="#152B1F" />
        </linearGradient>

        {/* ── Chrome trim ── */}
        <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D0D0D0" />
          <stop offset="50%" stopColor="#8A8A8A" />
          <stop offset="100%" stopColor="#4A4A4A" />
        </linearGradient>

        {/* ── Red stripe ── */}
        <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A1A1A" />
          <stop offset="50%" stopColor="#C0392B" />
          <stop offset="100%" stopColor="#7A1A1A" />
        </linearGradient>

        {/* ── Wheel ── */}
        <radialGradient id="wheelGrad" cx="45%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#787878" />
          <stop offset="50%" stopColor="#2A2A2A" />
          <stop offset="100%" stopColor="#101010" />
        </radialGradient>

        {/* ── Wheel hub ── */}
        <radialGradient id="hubGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#888888" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </radialGradient>

        {/* ── Headlight glow (cone) ── */}
        <radialGradient id="headGlow" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(255,248,192,0.6)" stopOpacity={headlightGlowOpacity} />
          <stop offset="100%" stopColor="rgba(255,248,192,0)" stopOpacity="0" />
        </radialGradient>

        {/* ── Boiler dome ── */}
        <radialGradient id="domeGrad" cx="40%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#2C5A3C" />
          <stop offset="100%" stopColor="#0D1E14" />
        </radialGradient>

        {/* ── Window glass ── */}
        <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={engineLight ? "#2A4A2A" : "#0D180D"} />
          <stop offset="100%" stopColor={engineLight ? "#1A3A1A" : "#080E08"} />
        </linearGradient>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          HEADLIGHT CONE (behind everything)
      ════════════════════════════════════════════════════════ */}
      {headlightOn && (
        <polygon
          points="16,92 -100,55 -100,130"
          fill="url(#headGlow)"
          opacity="0.8"
        />
      )}

      {/* ═══════════════════════════════════════════════════════
          SMOKE STACK + SMOKE PUFFS
      ════════════════════════════════════════════════════════ */}
      {/* Stack */}
      <rect x="88" y="32" width="14" height="18" rx="2" fill="#0D0D0D" />
      <rect x="85" y="26" width="20" height="8" rx="3" fill="#161616" />
      <rect x="83" y="24" width="24" height="5" rx="2" fill="#1A1A1A" />

      {/* Smoke puffs (animated) */}
      <g ref={smokeRef}>
        <ellipse cx="96" cy="22" rx="7" ry="5" fill="#848484" opacity="0" />
        <ellipse cx="93" cy="15" rx="6" ry="4.5" fill="#737373" opacity="0" />
        <ellipse cx="99" cy="8" rx="5" ry="3.5" fill="#626262" opacity="0" />
      </g>

      {/* ═══════════════════════════════════════════════════════
          BOILER — main cylindrical body
      ════════════════════════════════════════════════════════ */}
      {/* Main boiler body */}
      <rect x="24" y="54" width="190" height="54" rx="10" fill="url(#bodyGrad)" />

      {/* Boiler panel ribs (riveted look) */}
      {[58, 78, 98, 118, 138, 158, 178, 198].map((x) => (
        <line
          key={`rib-${x}`}
          x1={x} y1="55" x2={x} y2="107"
          stroke="#0A1A0E" strokeWidth="1.2" opacity="0.5"
        />
      ))}

      {/* Boiler top chrome strip */}
      <rect x="24" y="54" width="190" height="3" rx="1" fill="url(#chromeGrad)" opacity="0.6" />
      {/* Boiler bottom chrome strip */}
      <rect x="24" y="105" width="190" height="3" rx="1" fill="url(#chromeGrad)" opacity="0.6" />

      {/* Red decorative band */}
      <rect x="24" y="93" width="190" height="9" fill="url(#stripeGrad)" />

      {/* Boiler dome */}
      <ellipse cx="160" cy="54" rx="20" ry="11" fill="url(#domeGrad)" />
      <ellipse cx="160" cy="54" rx="15" ry="8" fill="#2C5A3C" opacity="0.6" />
      {/* Safety valve on dome */}
      <rect x="157" y="43" width="6" height="9" rx="1" fill="#5C6370" />
      <rect x="155" y="42" width="10" height="4" rx="2" fill="#4A5260" />

      {/* Sand dome */}
      <ellipse cx="128" cy="55" rx="11" ry="7" fill="#1A3A2A" />

      {/* Steam pipe */}
      <path
        d="M100 54 Q100 42 112 42 L120 42"
        fill="none" stroke="#3A3A3A" strokeWidth="4" strokeLinecap="round"
      />
      <rect x="118" y="38" width="6" height="8" rx="1" fill="#2A2A2A" />

      {/* ═══════════════════════════════════════════════════════
          CABIN / FOOTPLATE
      ════════════════════════════════════════════════════════ */}
      {/* Cabin body */}
      <rect x="212" y="44" width="116" height="72" rx="4" fill="url(#cabinGrad)" />
      {/* Cabin roof overhang */}
      <rect x="206" y="38" width="128" height="10" rx="3" fill="#0A1A0E" />
      {/* Roof top highlight */}
      <rect x="206" y="38" width="128" height="2" rx="1" fill="rgba(255,255,255,0.08)" />

      {/* Cabin front panel (firebox side) */}
      <rect x="212" y="54" width="18" height="52" fill="#111E14" />
      <rect x="228" y="54" width="2" height="52" fill="#0A0A0A" />

      {/* Cab window 1 (large front window) */}
      <rect x="234" y="50" width="38" height="30" rx="3"
        fill="url(#windowGrad)" stroke="#9A9A9A" strokeWidth="1.5" />
      {/* Window cross panes */}
      <line x1="253" y1="50" x2="253" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="234" y1="65" x2="272" y2="65" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Window interior glow when cabin light on */}
      {engineLight && (
        <rect x="235" y="51" width="36" height="28" rx="2"
          fill="rgba(255, 215, 120, 0.10)" />
      )}

      {/* Cab window 2 (smaller side window) */}
      <rect x="280" y="50" width="28" height="30" rx="3"
        fill="url(#windowGrad)" stroke="#9A9A9A" strokeWidth="1.5" />
      {engineLight && (
        <rect x="281" y="51" width="26" height="28" rx="2"
          fill="rgba(255, 215, 120, 0.08)" />
      )}

      {/* Cab door */}
      <rect x="310" y="74" width="20" height="38" rx="2"
        fill="#0D180D" stroke="#2A4A2A" strokeWidth="1" />
      {/* Door handle */}
      <circle cx="317" cy="93" r="2.5" fill="#787878" />
      <rect x="313" y="91" width="4" height="5" rx="1" fill="#5C6370" />

      {/* Number plate on cabin */}
      <rect x="234" y="85" width="70" height="20" rx="2"
        fill="#080E08" stroke="#F4C430" strokeWidth="1.2" />
      <text
        x="269" y="99"
        textAnchor="middle"
        fill="#F4C430"
        fontSize="9.5"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        letterSpacing="2.5"
      >
        DX-2026
      </text>

      {/* ═══════════════════════════════════════════════════════
          HEADLIGHT ASSEMBLY
      ════════════════════════════════════════════════════════ */}
      {/* Outer housing */}
      <circle cx="18" cy="90" r="12" fill="#151515" stroke="#4A4A4A" strokeWidth="1.5" />
      {/* Inner reflector */}
      <circle cx="18" cy="90" r="8" fill="#1E1E1E" />
      {/* Lens */}
      <circle cx="18" cy="90" r="6" fill={headlightColor} />
      {headlightOn && (
        <circle cx="18" cy="90" r="6"
          fill="rgba(255,248,192,0.9)"
          style={{ filter: "blur(1.5px)" }}
        />
      )}
      {/* Lens rim */}
      <circle cx="18" cy="90" r="8" fill="none" stroke="#3A3A3A" strokeWidth="1.5" />

      {/* ═══════════════════════════════════════════════════════
          PILOT / COWCATCHER
      ════════════════════════════════════════════════════════ */}
      <polygon
        points="18,101 2,116 2,124 30,124 30,101"
        fill="#0D0D0D"
      />
      <line x1="5" y1="111" x2="30" y2="107" stroke="#282828" strokeWidth="2" />
      <line x1="5" y1="115" x2="30" y2="113" stroke="#282828" strokeWidth="2" />
      <line x1="5" y1="119" x2="30" y2="119" stroke="#282828" strokeWidth="2" />
      <line x1="5" y1="122" x2="30" y2="122" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* ═══════════════════════════════════════════════════════
          RUNNING GEAR / FRAME
      ════════════════════════════════════════════════════════ */}
      {/* Main frame sill */}
      <rect x="16" y="108" width="316" height="15" rx="2" fill="#0A0A0A" />
      <rect x="16" y="110" width="316" height="5" fill="#141414" />

      {/* Valve gear / connecting rods */}
      <rect x="58" y="113" width="126" height="5" rx="2" fill="#5C6370" />
      {/* Valve rod pins */}
      <rect x="76" y="110" width="7" height="12" rx="1.5" fill="#8A929E" />
      <rect x="128" y="110" width="7" height="12" rx="1.5" fill="#8A929E" />
      <rect x="178" y="110" width="7" height="12" rx="1.5" fill="#8A929E" />

      {/* Cross-head slide bar */}
      <rect x="58" y="116" width="126" height="2" fill="#4A5260" />

      {/* ═══════════════════════════════════════════════════════
          LARGE DRIVE WHEELS (×3)
      ════════════════════════════════════════════════════════ */}

      {/* Wheel 1 — front drive */}
      <g ref={wheel1Ref}>
        <circle cx="80" cy="133" r="23" fill="url(#wheelGrad)" />
        <circle cx="80" cy="133" r="23" fill="none" stroke="#404040" strokeWidth="1.5" />
        {/* Spokes */}
        <line x1="80" y1="110" x2="80" y2="156" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="57" y1="133" x2="103" y2="133" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="63" y1="116" x2="97" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="97" y1="116" x2="63" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="64" y1="147" x2="96" y2="119" stroke="#4A5260" strokeWidth="1.5" />
        <line x1="64" y1="119" x2="96" y2="147" stroke="#4A5260" strokeWidth="1.5" />
        {/* Hub */}
        <circle cx="80" cy="133" r="7" fill="url(#hubGrad)" />
        <circle cx="80" cy="133" r="4" fill="#3A3A3A" />
        <circle cx="80" cy="133" r="2" fill="#5C6370" />
        {/* Tyre highlight */}
        <path d="M 62,116 A 23,23 0 0,1 98,116" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      </g>

      {/* Wheel 2 — middle drive */}
      <g ref={wheel2Ref}>
        <circle cx="140" cy="133" r="23" fill="url(#wheelGrad)" />
        <circle cx="140" cy="133" r="23" fill="none" stroke="#404040" strokeWidth="1.5" />
        <line x1="140" y1="110" x2="140" y2="156" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="117" y1="133" x2="163" y2="133" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="123" y1="116" x2="157" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="157" y1="116" x2="123" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="124" y1="147" x2="156" y2="119" stroke="#4A5260" strokeWidth="1.5" />
        <line x1="124" y1="119" x2="156" y2="147" stroke="#4A5260" strokeWidth="1.5" />
        <circle cx="140" cy="133" r="7" fill="url(#hubGrad)" />
        <circle cx="140" cy="133" r="4" fill="#3A3A3A" />
        <circle cx="140" cy="133" r="2" fill="#5C6370" />
        <path d="M 122,116 A 23,23 0 0,1 158,116" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      </g>

      {/* Wheel 3 — rear drive */}
      <g ref={wheel3Ref}>
        <circle cx="200" cy="133" r="23" fill="url(#wheelGrad)" />
        <circle cx="200" cy="133" r="23" fill="none" stroke="#404040" strokeWidth="1.5" />
        <line x1="200" y1="110" x2="200" y2="156" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="177" y1="133" x2="223" y2="133" stroke="#5C6370" strokeWidth="2.5" />
        <line x1="183" y1="116" x2="217" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="217" y1="116" x2="183" y2="150" stroke="#5C6370" strokeWidth="2" />
        <line x1="184" y1="147" x2="216" y2="119" stroke="#4A5260" strokeWidth="1.5" />
        <line x1="184" y1="119" x2="216" y2="147" stroke="#4A5260" strokeWidth="1.5" />
        <circle cx="200" cy="133" r="7" fill="url(#hubGrad)" />
        <circle cx="200" cy="133" r="4" fill="#3A3A3A" />
        <circle cx="200" cy="133" r="2" fill="#5C6370" />
        <path d="M 182,116 A 23,23 0 0,1 218,116" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      </g>

      {/* ═══════════════════════════════════════════════════════
          SMALL LEADING WHEEL
      ════════════════════════════════════════════════════════ */}
      <g ref={wheelSmallRef}>
        <circle cx="38" cy="133" r="14" fill="url(#wheelGrad)" />
        <circle cx="38" cy="133" r="14" fill="none" stroke="#404040" strokeWidth="1.2" />
        <line x1="38" y1="119" x2="38" y2="147" stroke="#5C6370" strokeWidth="2" />
        <line x1="24" y1="133" x2="52" y2="133" stroke="#5C6370" strokeWidth="2" />
        <line x1="28" y1="123" x2="48" y2="143" stroke="#4A5260" strokeWidth="1.5" />
        <line x1="48" y1="123" x2="28" y2="143" stroke="#4A5260" strokeWidth="1.5" />
        <circle cx="38" cy="133" r="5" fill="url(#hubGrad)" />
        <circle cx="38" cy="133" r="2.5" fill="#3A3A3A" />
      </g>

      {/* ═══════════════════════════════════════════════════════
          REAR TRAILING WHEEL
      ════════════════════════════════════════════════════════ */}
      <circle cx="300" cy="133" r="14" fill="url(#wheelGrad)" />
      <circle cx="300" cy="133" r="14" fill="none" stroke="#404040" strokeWidth="1.2" />
      <line x1="300" y1="119" x2="300" y2="147" stroke="#5C6370" strokeWidth="2" />
      <line x1="286" y1="133" x2="314" y2="133" stroke="#5C6370" strokeWidth="2" />
      <circle cx="300" cy="133" r="5" fill="url(#hubGrad)" />
      <circle cx="300" cy="133" r="2.5" fill="#3A3A3A" />

      {/* ═══════════════════════════════════════════════════════
          COUPLER (rear)
      ════════════════════════════════════════════════════════ */}
      <rect x="328" y="110" width="16" height="9" rx="1.5"
        fill="#1A1A1A" stroke="#4A5260" strokeWidth="1" />
      <rect x="342" y="112" width="10" height="5" rx="1"
        fill="#0A0A0A" stroke="#3A3A3A" strokeWidth="0.5" />
    </svg>
  );
}
