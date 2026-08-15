# Implementation Guide
## Deepak Express — Railway Portfolio

**Document Owner:** Deepak  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** August 15, 2026  
**Companion Document:** [PRD.md](./PRD.md)

---

## Quick Reference — Phase Map

| Phase | Name | Key Output | Est. Effort |
|---|---|---|---|
| 0 | Project Foundation | Working Next.js scaffold, all dependencies installed, global tokens | 1 day |
| 1 | Railway Prototype | SVG train, track, world-relative movement, 3 bare stations | 3–4 days |
| 2 | Animation Engine | Departure/arrival curves, camera system, cabin-view transition | 3–4 days |
| 3 | Sound System | Howler.js layers, full audio state machine | 2 days |
| 4 | Portfolio Content | All 5 station components wired to real data | 3–4 days |
| 5 | Cinematic Polish | Day/night cycle, environment motifs, particles, film grain | 3–4 days |
| 6 | UX Hardening | Ticket, control panel, map, skip, mobile, a11y, analytics | 3–5 days |

---

## Phase 0 — Project Foundation

### 0.1 Scaffold the Next.js Application

```bash
npx create-next-app@latest portfolio-new \
  --typescript \
  --app \
  --tailwind \
  --eslint \
  --src-dir \
  --import-alias "@/*"
cd portfolio-new
```

### 0.2 Install All Dependencies

```bash
# Animation
npm install gsap @gsap/react

# Audio
npm install howler
npm install --save-dev @types/howler

# UI animation layer
npm install framer-motion

# Utility
npm install clsx tailwind-merge

# Fonts (Google Fonts via next/font)
# No package needed — configured in layout.tsx
```

### 0.3 Directory Structure

Create the full directory tree before writing a single component. This prevents import-path drift later.

```bash
mkdir -p src/components/railway
mkdir -p src/components/stations
mkdir -p src/components/ui
mkdir -p src/components/audio
mkdir -p src/lib/railway
mkdir -p src/lib/audio
mkdir -p src/hooks
mkdir -p src/styles
mkdir -p public/audio
mkdir -p public/fonts
```

Final structure expected at the end of Phase 0:

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── railway/
│   │   ├── RailwayWorld.tsx
│   │   ├── Train.tsx
│   │   ├── Track.tsx
│   │   ├── Platform.tsx
│   │   ├── Station.tsx
│   │   ├── RailwayLights.tsx
│   │   └── Environment.tsx
│   │
│   ├── stations/
│   │   ├── EducationStation.tsx
│   │   ├── ExperienceStation.tsx
│   │   ├── ProjectsStation.tsx
│   │   ├── SkillsStation.tsx
│   │   └── ContactStation.tsx
│   │
│   ├── ui/
│   │   ├── BoardingScreen.tsx
│   │   ├── StationBoard.tsx
│   │   ├── Ticket.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── Navigation.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── StationMap.tsx
│   │
│   └── audio/
│       └── AudioManager.tsx
│
├── lib/
│   ├── railway/
│   │   ├── stations.ts
│   │   ├── trainController.ts
│   │   └── animationController.ts
│   └── audio/
│       └── sounds.ts
│
├── hooks/
│   ├── useJourneyState.ts
│   ├── useTrainPhysics.ts
│   └── useReducedMotion.ts
│
└── styles/
    └── tokens.css
```

### 0.4 Design Tokens (Global CSS Variables)

Create `src/styles/tokens.css`. These drive every environment shift and ensure no magic strings exist inside component files.

```css
/* ─── Brand Palette ─────────────────────────────────── */
:root {
  /* Core identity */
  --color-cream:         #F5F0E8;
  --color-cream-dark:    #E8E0CF;
  --color-railway-green: #1A3A2A;
  --color-railway-red:   #C0392B;
  --color-warm-yellow:   #F4C430;
  --color-metal-grey:    #5C6370;
  --color-metal-light:   #8A929E;
  --color-black-true:    #0A0A0A;

  /* Text */
  --color-text-primary:  #1A1A1A;
  --color-text-muted:    #6B7280;
  --color-text-inverse:  #F5F0E8;

  /* ─── Environment Sky (animated per station) ───────── */
  --sky-top:             #87CEEB;   /* day */
  --sky-bottom:          #B8D4E8;
  --horizon-glow:        transparent;
  --ground-color:        #5C7A3A;   /* grass */
  --track-bed-color:     #8B7355;   /* ballast */

  /* ─── Lighting State ─────────────────────────────── */
  --ambient-intensity:   1;
  --building-opacity:    1;
  --window-glow:         0;         /* 0 = off, 1 = lit */
  --fog-opacity:         0;
  --cloud-opacity:       0.7;
  --sun-angle:           45deg;

  /* ─── Train ──────────────────────────────────────── */
  --headlight-intensity: 0;
  --smoke-opacity:       0;
  --wheel-animation-play-state: paused;

  /* ─── Timing ─────────────────────────────────────── */
  --transition-env:      2s;

  /* ─── Typography ─────────────────────────────────── */
  --font-railway:       'Rajdhani', 'Barlow Condensed', system-ui, sans-serif;
  --font-mono:          'JetBrains Mono', 'Fira Code', monospace;
  --font-display:       'Oswald', var(--font-railway);

  /* ─── UI Layout ──────────────────────────────────── */
  --panel-bg:           rgba(10, 10, 10, 0.85);
  --panel-border:       rgba(244, 196, 48, 0.25);
  --panel-radius:       4px;
}
```

Import this in `src/app/globals.css`:

```css
@import "../styles/tokens.css";
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Oswald:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  overflow: hidden;          /* The world scrolls internally, not the page */
  height: 100%;
  width: 100%;
  background: var(--sky-bottom);
}

body {
  font-family: var(--font-railway);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}
```

### 0.5 Journey State Types

Create `src/lib/railway/types.ts` — every other file imports from here, no inline type duplication.

```typescript
export type JourneyPhase =
  | "LOADING"
  | "IDLE"
  | "BOARDING"
  | "DEPARTING"
  | "TRAVELLING"
  | "APPROACHING_STATION"
  | "ARRIVING"
  | "STOPPED"
  | "EXPLORE"
  | "FINAL_STATION";

export type StationId =
  | "welcome"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

export type TimeOfDay = "day" | "evening" | "sunset" | "night" | "sunrise";

export interface EnvironmentState {
  timeOfDay: TimeOfDay;
  skyTop: string;
  skyBottom: string;
  horizonGlow: string;
  groundColor: string;
  ambientIntensity: number;
  cloudOpacity: number;
  fogOpacity: number;
  windowGlow: number;       // 0–1
  headlightIntensity: number; // 0–1
}

export interface StationConfig {
  id: StationId;
  order: number;
  displayName: string;
  platformLabel: string;
  environment: EnvironmentState;
  content: StationContent;
}

export interface StationContent {
  type: "welcome" | "education" | "experience" | "projects" | "skills" | "contact";
  data: Record<string, unknown>;
}

export interface TrainState {
  phase: JourneyPhase;
  speed: number;              // km/h (display value)
  worldOffset: number;        // px — how far the world has scrolled
  currentStationId: StationId | null;
  nextStationId: StationId | null;
  isMoving: boolean;
  smokeActive: boolean;
  headlightOn: boolean;
  wheelsRotating: boolean;
}
```

---

## Phase 1 — Railway Prototype

**Goal:** A browser window showing a detailed SVG train sitting on a track, with a basic world pan revealing 3 placeholder stations. No audio. No content. Proof that the core rendering and movement model works.

### 1.1 Stations Data Config

Create `src/lib/railway/stations.ts`. This is the single source of truth for order, naming, and environment.

```typescript
import { StationConfig } from "./types";

export const STATION_SPACING = 1800; // px between station centers in world space

export const STATIONS: StationConfig[] = [
  {
    id: "welcome",
    order: 0,
    displayName: "Central Station",
    platformLabel: "Platform 01",
    environment: {
      timeOfDay: "day",
      skyTop: "#4A90C8",
      skyBottom: "#87CEEB",
      horizonGlow: "transparent",
      groundColor: "#5C7A3A",
      ambientIntensity: 1,
      cloudOpacity: 0.7,
      fogOpacity: 0,
      windowGlow: 0,
      headlightIntensity: 0,
    },
    content: { type: "welcome", data: {} },
  },
  {
    id: "education",
    order: 1,
    displayName: "Education Junction",
    platformLabel: "Platform 02",
    environment: {
      timeOfDay: "day",
      skyTop: "#3D85C8",
      skyBottom: "#87CEEB",
      horizonGlow: "transparent",
      groundColor: "#4A6E2E",
      ambientIntensity: 0.95,
      cloudOpacity: 0.5,
      fogOpacity: 0,
      windowGlow: 0,
      headlightIntensity: 0,
    },
    content: { type: "education", data: {} },
  },
  {
    id: "experience",
    order: 2,
    displayName: "Experience Junction",
    platformLabel: "Platform 03",
    environment: {
      timeOfDay: "evening",
      skyTop: "#C0703A",
      skyBottom: "#E8A870",
      horizonGlow: "rgba(255, 160, 60, 0.4)",
      groundColor: "#3A5526",
      ambientIntensity: 0.8,
      cloudOpacity: 0.6,
      fogOpacity: 0.05,
      windowGlow: 0.1,
      headlightIntensity: 0,
    },
    content: { type: "experience", data: {} },
  },
  {
    id: "projects",
    order: 3,
    displayName: "Projects Junction",
    platformLabel: "Platform 04",
    environment: {
      timeOfDay: "sunset",
      skyTop: "#6B2D5E",
      skyBottom: "#D4603A",
      horizonGlow: "rgba(255, 100, 30, 0.6)",
      groundColor: "#2C3E20",
      ambientIntensity: 0.65,
      cloudOpacity: 0.4,
      fogOpacity: 0.08,
      windowGlow: 0.5,
      headlightIntensity: 0.3,
    },
    content: { type: "projects", data: {} },
  },
  {
    id: "skills",
    order: 4,
    displayName: "Skills Junction",
    platformLabel: "Platform 05",
    environment: {
      timeOfDay: "night",
      skyTop: "#080C1A",
      skyBottom: "#0D1A2E",
      horizonGlow: "rgba(30, 60, 120, 0.3)",
      groundColor: "#1A2210",
      ambientIntensity: 0.3,
      cloudOpacity: 0.15,
      fogOpacity: 0.15,
      windowGlow: 1,
      headlightIntensity: 1,
    },
    content: { type: "skills", data: {} },
  },
  {
    id: "contact",
    order: 5,
    displayName: "Destination Station",
    platformLabel: "Platform 06",
    environment: {
      timeOfDay: "sunrise",
      skyTop: "#1A3A6E",
      skyBottom: "#F4A04A",
      horizonGlow: "rgba(244, 160, 74, 0.7)",
      groundColor: "#3A5020",
      ambientIntensity: 0.75,
      cloudOpacity: 0.45,
      fogOpacity: 0.05,
      windowGlow: 0.3,
      headlightIntensity: 0.2,
    },
    content: { type: "contact", data: {} },
  },
];

export const getStation = (id: string) =>
  STATIONS.find((s) => s.id === id) ?? null;

export const getNextStation = (currentId: string) => {
  const current = STATIONS.find((s) => s.id === currentId);
  if (!current) return null;
  return STATIONS.find((s) => s.order === current.order + 1) ?? null;
};
```

### 1.2 Train SVG Component

This is the most critical visual element. Build it as a pure SVG with individually addressable parts — every detail must read as a real locomotive, not a toy.

`src/components/railway/Train.tsx`

```tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface TrainProps {
  engineLight?: boolean;
  smoke?: boolean;
  wheelsRotating?: boolean;
  headlightOn?: boolean;
  direction?: "right" | "left";
  scale?: number;
}

export default function Train({
  engineLight = false,
  smoke = false,
  wheelsRotating = false,
  headlightOn = false,
  direction = "right",
  scale = 1,
}: TrainProps) {
  const smokeRef = useRef<SVGGElement>(null);
  const wheel1Ref = useRef<SVGGElement>(null);
  const wheel2Ref = useRef<SVGGElement>(null);
  const wheel3Ref = useRef<SVGGElement>(null);
  const wheelSmallRef = useRef<SVGGElement>(null);
  const smokeAnim = useRef<gsap.core.Tween | null>(null);
  const wheelAnim = useRef<gsap.core.Timeline | null>(null);

  // Wheel rotation animation
  useEffect(() => {
    if (wheelsRotating) {
      wheelAnim.current = gsap.timeline({ repeat: -1 });
      [wheel1Ref, wheel2Ref, wheel3Ref, wheelSmallRef].forEach((ref) => {
        if (ref.current) {
          gsap.to(ref.current, {
            rotation: 360,
            transformOrigin: "50% 50%",
            duration: 0.5,
            ease: "none",
            repeat: -1,
          });
        }
      });
    } else {
      [wheel1Ref, wheel2Ref, wheel3Ref, wheelSmallRef].forEach((ref) => {
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          gsap.set(ref.current, { rotation: 0 });
        }
      });
    }

    return () => {
      [wheel1Ref, wheel2Ref, wheel3Ref, wheelSmallRef].forEach((ref) => {
        if (ref.current) gsap.killTweensOf(ref.current);
      });
    };
  }, [wheelsRotating]);

  // Smoke puff animation
  useEffect(() => {
    if (smoke && smokeRef.current) {
      smokeAnim.current = gsap.to(smokeRef.current.children, {
        y: -40,
        opacity: 0,
        scale: 2,
        duration: 1.4,
        stagger: 0.3,
        repeat: -1,
        ease: "power1.out",
        transformOrigin: "50% 100%",
      });
    } else if (smokeRef.current) {
      gsap.killTweensOf(smokeRef.current.children);
      gsap.set(smokeRef.current.children, { y: 0, opacity: 0.6, scale: 1 });
    }
  }, [smoke]);

  const headlightColor = headlightOn ? "#FFF8D0" : "transparent";
  const headlightGlow = headlightOn ? "rgba(255, 240, 150, 0.35)" : "transparent";

  return (
    <svg
      viewBox="0 0 420 160"
      width={420 * scale}
      height={160 * scale}
      style={{ transform: direction === "left" ? "scaleX(-1)" : "none", overflow: "visible" }}
      aria-label="Deepak Express locomotive"
    >
      <defs>
        {/* Metal gradient for body panels */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A6B4A" />
          <stop offset="60%" stopColor="#1A3A2A" />
          <stop offset="100%" stopColor="#0D1E14" />
        </linearGradient>

        {/* Cabin gradient */}
        <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C4E3C" />
          <stop offset="100%" stopColor="#1A3A2A" />
        </linearGradient>

        {/* Wheel gradient */}
        <radialGradient id="wheelGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6B6B6B" />
          <stop offset="60%" stopColor="#2A2A2A" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>

        {/* Headlight cone */}
        <radialGradient id="headlightGlow" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor={headlightGlow} stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Chrome trim gradient */}
        <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8C8C8" />
          <stop offset="50%" stopColor="#8A8A8A" />
          <stop offset="100%" stopColor="#5C5C5C" />
        </linearGradient>

        {/* Red stripe gradient */}
        <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B1A1A" />
          <stop offset="50%" stopColor="#C0392B" />
          <stop offset="100%" stopColor="#8B1A1A" />
        </linearGradient>
      </defs>

      {/* ── Headlight cone (rendered behind everything) ── */}
      {headlightOn && (
        <polygon
          points="18,88 -80,60 -80,116"
          fill="url(#headlightGlow)"
          opacity="0.7"
        />
      )}

      {/* ── Smoke stack + smoke ── */}
      <g ref={smokeRef} opacity={smoke ? 1 : 0}>
        <ellipse cx="95" cy="30" rx="6" ry="4" fill="#888" opacity="0.6" />
        <ellipse cx="92" cy="24" rx="5" ry="3.5" fill="#777" opacity="0.5" />
        <ellipse cx="98" cy="18" rx="4" ry="3" fill="#666" opacity="0.4" />
      </g>
      {/* Chimney */}
      <rect x="90" y="34" width="12" height="16" rx="2" fill="#111" />
      <rect x="88" y="30" width="16" height="6" rx="2" fill="#1A1A1A" />

      {/* ── Boiler (main cylindrical body) ── */}
      <rect x="28" y="52" width="180" height="52" rx="8" fill="url(#bodyGrad)" />
      {/* Boiler ribs — riveted look */}
      {[60, 80, 100, 120, 140, 160, 180].map((x) => (
        <line
          key={x}
          x1={x} y1="52" x2={x} y2="104"
          stroke="#0D1E14" strokeWidth="1.5" opacity="0.6"
        />
      ))}
      {/* Boiler dome */}
      <ellipse cx="155" cy="52" rx="18" ry="10" fill="#1A3A2A" />
      <ellipse cx="155" cy="52" rx="14" ry="7" fill="#2A5A3A" />
      {/* Safety valve */}
      <rect x="152" y="42" width="6" height="8" rx="1" fill="#5C6370" />

      {/* ── Red decorative stripe ── */}
      <rect x="28" y="90" width="180" height="8" fill="url(#stripeGrad)" />

      {/* ── Chrome trim lines ── */}
      <rect x="28" y="52" width="180" height="3" rx="1" fill="url(#chromeGrad)" opacity="0.7" />
      <rect x="28" y="101" width="180" height="3" rx="1" fill="url(#chromeGrad)" opacity="0.7" />

      {/* ── Cabin / footplate ── */}
      <rect x="198" y="46" width="110" height="68" rx="4" fill="url(#cabinGrad)" />
      {/* Cabin roof overhang */}
      <rect x="192" y="40" width="122" height="10" rx="3" fill="#0D1E14" />
      {/* Cabin front panel */}
      <rect x="198" y="56" width="16" height="48" fill="#152B1F" />
      {/* Cabin side detail */}
      <rect x="214" y="56" width="2" height="48" fill="#0D1E14" />

      {/* ── Cabin Windows ── */}
      {/* Window 1 */}
      <rect x="226" y="52" width="34" height="28" rx="3"
        fill={engineLight ? "#2A3A2A" : "#1A2A1A"}
        stroke="#C8C8C8" strokeWidth="1.5"
      />
      {/* Window frame cross */}
      <line x1="243" y1="52" x2="243" y2="80" stroke="#8A929E" strokeWidth="1" opacity="0.5" />
      <line x1="226" y1="66" x2="260" y2="66" stroke="#8A929E" strokeWidth="1" opacity="0.5" />
      {/* Interior light glow */}
      {engineLight && (
        <rect x="227" y="53" width="32" height="26" rx="2"
          fill="rgba(255, 220, 140, 0.12)" />
      )}

      {/* Window 2 */}
      <rect x="272" y="52" width="26" height="28" rx="3"
        fill={engineLight ? "#2A3A2A" : "#1A2A1A"}
        stroke="#C8C8C8" strokeWidth="1.5"
      />
      {engineLight && (
        <rect x="273" y="53" width="24" height="26" rx="2"
          fill="rgba(255, 220, 140, 0.10)" />
      )}

      {/* ── Cabin door ── */}
      <rect x="298" y="76" width="18" height="34" rx="2" fill="#0D1E14" stroke="#3A5A3A" strokeWidth="1" />
      <circle cx="304" cy="93" r="2.5" fill="#8A929E" />

      {/* ── Number plate ── */}
      <rect x="220" y="84" width="68" height="18" rx="2" fill="#111" stroke="#F4C430" strokeWidth="1" />
      <text x="254" y="97" textAnchor="middle" fill="#F4C430"
        fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="600"
        letterSpacing="2"
      >
        DX-2026
      </text>

      {/* ── Headlight ── */}
      <circle cx="22" cy="88" r="10" fill="#1A1A1A" stroke="#5C6370" strokeWidth="1.5" />
      <circle cx="22" cy="88" r="7" fill={headlightOn ? headlightColor : "#111"} />
      {headlightOn && (
        <circle cx="22" cy="88" r="7"
          fill="rgba(255, 248, 200, 0.9)"
          filter="blur(1px)"
        />
      )}
      <circle cx="22" cy="88" r="10" fill="none" stroke="#3A3A3A" strokeWidth="2" />

      {/* ── Pilot / cowcatcher ── */}
      <polygon points="18,98 4,110 4,118 28,118 28,98" fill="#111" />
      <line x1="8" y1="108" x2="28" y2="104" stroke="#3A3A3A" strokeWidth="2" />
      <line x1="8" y1="112" x2="28" y2="110" stroke="#3A3A3A" strokeWidth="2" />
      <line x1="8" y1="116" x2="28" y2="116" stroke="#3A3A3A" strokeWidth="2" />

      {/* ── Running gear / frame ── */}
      <rect x="18" y="108" width="296" height="14" rx="2" fill="#0D0D0D" />
      <rect x="18" y="110" width="296" height="4" fill="#1A1A1A" />

      {/* ── Connecting rods ── */}
      <rect x="60" y="112" width="120" height="5" rx="2" fill="#5C6370" />
      <rect x="80" y="109" width="6" height="11" rx="1" fill="#8A929E" />
      <rect x="130" y="109" width="6" height="11" rx="1" fill="#8A929E" />
      <rect x="175" y="109" width="6" height="11" rx="1" fill="#8A929E" />

      {/* ── Wheels (large drive wheels) ── */}
      {/* Wheel 1 */}
      <g ref={wheel1Ref} style={{ transformOrigin: "80px 128px" }}>
        <circle cx="80" cy="128" r="22" fill="url(#wheelGrad)" stroke="#5C6370" strokeWidth="2" />
        <circle cx="80" cy="128" r="6" fill="#3A3A3A" stroke="#8A929E" strokeWidth="1.5" />
        <line x1="80" y1="106" x2="80" y2="150" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="58" y1="128" x2="102" y2="128" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="64" y1="112" x2="96" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
        <line x1="96" y1="112" x2="64" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
        {/* Tyre highlight */}
        <circle cx="80" cy="128" r="22" fill="none" stroke="#888" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Wheel 2 */}
      <g ref={wheel2Ref} style={{ transformOrigin: "138px 128px" }}>
        <circle cx="138" cy="128" r="22" fill="url(#wheelGrad)" stroke="#5C6370" strokeWidth="2" />
        <circle cx="138" cy="128" r="6" fill="#3A3A3A" stroke="#8A929E" strokeWidth="1.5" />
        <line x1="138" y1="106" x2="138" y2="150" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="116" y1="128" x2="160" y2="128" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="122" y1="112" x2="154" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
        <line x1="154" y1="112" x2="122" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* Wheel 3 */}
      <g ref={wheel3Ref} style={{ transformOrigin: "196px 128px" }}>
        <circle cx="196" cy="128" r="22" fill="url(#wheelGrad)" stroke="#5C6370" strokeWidth="2" />
        <circle cx="196" cy="128" r="6" fill="#3A3A3A" stroke="#8A929E" strokeWidth="1.5" />
        <line x1="196" y1="106" x2="196" y2="150" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="174" y1="128" x2="218" y2="128" stroke="#5C6370" strokeWidth="2" opacity="0.7" />
        <line x1="180" y1="112" x2="212" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
        <line x1="212" y1="112" x2="180" y2="144" stroke="#5C6370" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* Small leading wheel */}
      <g ref={wheelSmallRef} style={{ transformOrigin: "36px 128px" }}>
        <circle cx="36" cy="128" r="13" fill="url(#wheelGrad)" stroke="#5C6370" strokeWidth="1.5" />
        <circle cx="36" cy="128" r="4" fill="#3A3A3A" stroke="#8A929E" strokeWidth="1" />
        <line x1="36" y1="115" x2="36" y2="141" stroke="#5C6370" strokeWidth="1.5" opacity="0.6" />
        <line x1="23" y1="128" x2="49" y2="128" stroke="#5C6370" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* Rear trailing wheel */}
      <g style={{ transformOrigin: "290px 128px" }}>
        <circle cx="290" cy="128" r="13" fill="url(#wheelGrad)" stroke="#5C6370" strokeWidth="1.5" />
        <circle cx="290" cy="128" r="4" fill="#3A3A3A" stroke="#8A929E" strokeWidth="1" />
      </g>

      {/* ── Coupler (rear) ── */}
      <rect x="305" y="112" width="14" height="8" rx="1" fill="#2A2A2A" stroke="#5C6370" strokeWidth="1" />
      <rect x="318" y="114" width="8" height="4" rx="1" fill="#1A1A1A" />
    </svg>
  );
}
```

### 1.3 Track Component

`src/components/railway/Track.tsx` — a wide, horizontally-tiling SVG track with ballast, sleepers, and two rails. The world offset is applied here.

```tsx
"use client";

interface TrackProps {
  worldOffset: number;  // px — negative value scrolls world left (train moves right)
  width?: number;       // canvas width in px, defaults to 200vw
}

export default function Track({ worldOffset, width = 4000 }: TrackProps) {
  const sleepersCount = Math.ceil(width / 48);

  return (
    <div
      className="track-wrapper"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${width}px`,
        height: "80px",
        transform: `translateX(${worldOffset}px)`,
        willChange: "transform",
      }}
    >
      <svg viewBox={`0 0 ${width} 80`} width={width} height="80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ballastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5840" />
          </linearGradient>
          <linearGradient id="railGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B8B8B8" />
            <stop offset="40%" stopColor="#787878" />
            <stop offset="100%" stopColor="#4A4A4A" />
          </linearGradient>
        </defs>

        {/* Ballast bed */}
        <rect x="0" y="28" width={width} height="52" fill="url(#ballastGrad)" />

        {/* Ballast texture — scattered dots */}
        {Array.from({ length: sleepersCount * 3 }).map((_, i) => (
          <circle
            key={`gravel-${i}`}
            cx={(i * 67) % width}
            cy={36 + ((i * 13) % 30)}
            r={1 + (i % 3) * 0.5}
            fill="#6B5840"
            opacity="0.6"
          />
        ))}

        {/* Sleepers (railway ties) */}
        {Array.from({ length: sleepersCount }).map((_, i) => (
          <g key={`sleeper-${i}`}>
            <rect
              x={i * 48 + 2}
              y="32"
              width="36"
              height="12"
              rx="1"
              fill="#3D2B1A"
            />
            {/* Wood grain */}
            <line
              x1={i * 48 + 4} y1="36"
              x2={i * 48 + 36} y2="36"
              stroke="#2D1F10" strokeWidth="0.5" opacity="0.4"
            />
            <line
              x1={i * 48 + 4} y1="40"
              x2={i * 48 + 36} y2="40"
              stroke="#2D1F10" strokeWidth="0.5" opacity="0.4"
            />
          </g>
        ))}

        {/* Rail left */}
        <rect x="0" y="26" width={width} height="10" rx="2" fill="url(#railGrad)" />
        {/* Rail inner face highlight */}
        <rect x="0" y="26" width={width} height="2" fill="rgba(255,255,255,0.15)" />

        {/* Rail right */}
        <rect x="0" y="46" width={width} height="10" rx="2" fill="url(#railGrad)" />
        <rect x="0" y="46" width={width} height="2" fill="rgba(255,255,255,0.15)" />

        {/* Spike heads on sleepers */}
        {Array.from({ length: sleepersCount }).map((_, i) => (
          <g key={`spikes-${i}`}>
            <circle cx={i * 48 + 10} cy="29" r="1.5" fill="#5C5C5C" />
            <circle cx={i * 48 + 30} cy="29" r="1.5" fill="#5C5C5C" />
            <circle cx={i * 48 + 10} cy="49" r="1.5" fill="#5C5C5C" />
            <circle cx={i * 48 + 30} cy="49" r="1.5" fill="#5C5C5C" />
          </g>
        ))}
      </svg>
    </div>
  );
}
```

### 1.4 Environment / Sky Component

`src/components/railway/Environment.tsx` — renders the sky, ground, and background layers. CSS custom properties drive all color transitions.

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EnvironmentState } from "@/lib/railway/types";

interface EnvironmentProps {
  state: EnvironmentState;
  children?: React.ReactNode;
}

export default function Environment({ state, children }: EnvironmentProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    gsap.to(rootRef.current, {
      "--sky-top": state.skyTop,
      "--sky-bottom": state.skyBottom,
      "--ground-color": state.groundColor,
      "--cloud-opacity": state.cloudOpacity,
      "--fog-opacity": state.fogOpacity,
      "--window-glow": state.windowGlow,
      "--headlight-intensity": state.headlightIntensity,
      "--ambient-intensity": state.ambientIntensity,
      duration: 3.5,
      ease: "power1.inOut",
    });
  }, [state]);

  return (
    <div
      ref={rootRef}
      className="environment-root"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: `linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 65%, var(--ground-color) 65%)`,
        transition: "background 3.5s ease",
      } as React.CSSProperties}
    >
      {/* Horizon glow */}
      <div
        style={{
          position: "absolute",
          bottom: "35%",
          left: 0,
          right: 0,
          height: "120px",
          background: state.horizonGlow,
          filter: "blur(24px)",
          transition: "background 3.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Fog layer */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(transparent, rgba(180,170,160,0.4))",
          opacity: state.fogOpacity,
          transition: "opacity 3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Cloud layer */}
      <CloudLayer opacity={state.cloudOpacity} />

      {children}
    </div>
  );
}

function CloudLayer({ opacity }: { opacity: number }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      style={{
        position: "absolute",
        top: "60px",
        left: 0,
        width: "100%",
        opacity,
        transition: "opacity 3s ease",
        pointerEvents: "none",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="cloudSoften">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Cloud 1 — large */}
      <g filter="url(#cloudSoften)" opacity="0.85">
        <ellipse cx="200" cy="60" rx="90" ry="28" fill="#F5F5F5" />
        <ellipse cx="240" cy="50" rx="60" ry="20" fill="#FAFAFA" />
        <ellipse cx="160" cy="55" rx="50" ry="18" fill="#F0F0F0" />
      </g>

      {/* Cloud 2 */}
      <g filter="url(#cloudSoften)" opacity="0.7">
        <ellipse cx="700" cy="80" rx="70" ry="22" fill="#EBEBEB" />
        <ellipse cx="730" cy="68" rx="45" ry="16" fill="#F2F2F2" />
      </g>

      {/* Cloud 3 — small */}
      <g filter="url(#cloudSoften)" opacity="0.6">
        <ellipse cx="1100" cy="50" rx="55" ry="18" fill="#F0F0F0" />
        <ellipse cx="1130" cy="42" rx="36" ry="12" fill="#F8F8F8" />
      </g>
    </svg>
  );
}
```

### 1.5 Journey State Hook

`src/hooks/useJourneyState.ts` — single source of truth for journey state consumed by all components.

```typescript
import { create } from "zustand";
import { JourneyPhase, StationId, TrainState } from "@/lib/railway/types";
import { STATIONS, getNextStation } from "@/lib/railway/stations";

interface JourneyStore {
  phase: JourneyPhase;
  trainState: TrainState;
  currentStationIndex: number;
  isAudioEnabled: boolean;
  isMuted: boolean;

  setPhase: (phase: JourneyPhase) => void;
  setTrainState: (partial: Partial<TrainState>) => void;
  advanceStation: () => void;
  jumpToStation: (id: StationId) => void;
  toggleMute: () => void;
  enableAudio: () => void;
}

// Using zustand for global journey state
// Install: npm install zustand
export const useJourneyStore = create<JourneyStore>((set, get) => ({
  phase: "LOADING",
  currentStationIndex: 0,
  isAudioEnabled: false,
  isMuted: false,

  trainState: {
    phase: "LOADING",
    speed: 0,
    worldOffset: 0,
    currentStationId: "welcome",
    nextStationId: "education",
    isMoving: false,
    smokeActive: false,
    headlightOn: false,
    wheelsRotating: false,
  },

  setPhase: (phase) => set({ phase }),

  setTrainState: (partial) =>
    set((state) => ({
      trainState: { ...state.trainState, ...partial },
    })),

  advanceStation: () => {
    const { currentStationIndex } = get();
    const nextIndex = Math.min(currentStationIndex + 1, STATIONS.length - 1);
    const nextStation = STATIONS[nextIndex];
    const afterStation = STATIONS[nextIndex + 1] ?? null;

    set({
      currentStationIndex: nextIndex,
      trainState: {
        ...get().trainState,
        currentStationId: nextStation.id,
        nextStationId: afterStation?.id ?? null,
      },
    });
  },

  jumpToStation: (id) => {
    const index = STATIONS.findIndex((s) => s.id === id);
    if (index < 0) return;
    const afterStation = STATIONS[index + 1] ?? null;

    set({
      currentStationIndex: index,
      phase: "STOPPED",
      trainState: {
        ...get().trainState,
        currentStationId: id,
        nextStationId: afterStation?.id ?? null,
        isMoving: false,
        speed: 0,
        wheelsRotating: false,
        smokeActive: false,
      },
    });
  },

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  enableAudio: () => set({ isAudioEnabled: true }),
}));
```

> Add `zustand` to dependencies: `npm install zustand`

### 1.6 RailwayWorld — Composing the Scene

`src/components/railway/RailwayWorld.tsx` — orchestrates Environment + Track + Train in a single full-screen canvas. At the end of Phase 1 this renders a static or manually-panned scene.

```tsx
"use client";

import { useRef } from "react";
import Environment from "./Environment";
import Track from "./Track";
import Train from "./Train";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";

export default function RailwayWorld() {
  const worldRef = useRef<HTMLDivElement>(null);
  const { trainState, currentStationIndex } = useJourneyStore();
  const currentStation = STATIONS[currentStationIndex];

  return (
    <Environment state={currentStation.environment}>
      {/* Background city/buildings layer — rendered per station in Phase 5 */}
      <div
        id="bg-layer"
        style={{
          position: "absolute",
          bottom: "35%",
          left: 0,
          right: 0,
          height: "40%",
          pointerEvents: "none",
        }}
      />

      {/* World container — everything that moves */}
      <div
        ref={worldRef}
        id="world"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "45%",
        }}
      >
        <Track worldOffset={trainState.worldOffset} />

        {/* Station platforms rendered in world space */}
        {STATIONS.map((station) => (
          <div
            key={station.id}
            id={`platform-${station.id}`}
            style={{
              position: "absolute",
              bottom: "60px",
              left: `${station.order * 1800 + trainState.worldOffset + window.innerWidth * 0.6}px`,
              width: "200px",
            }}
          >
            {/* Platform structure — detailed in Phase 1.7 */}
          </div>
        ))}
      </div>

      {/* Train — fixed in screen space, world moves behind it */}
      <div
        id="train-container"
        style={{
          position: "absolute",
          bottom: "calc(35% + 20px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <Train
          engineLight={trainState.headlightOn}
          smoke={trainState.smokeActive}
          wheelsRotating={trainState.wheelsRotating}
          headlightOn={trainState.headlightOn}
        />
      </div>
    </Environment>
  );
}
```

### 1.7 Platform Component

`src/components/railway/Platform.tsx` — a realistic station platform: raised concrete slab, roof canopy, name board, yellow safety line.

```tsx
"use client";

interface PlatformProps {
  stationName: string;
  platformLabel: string;
  isActive: boolean;
}

export default function Platform({ stationName, platformLabel, isActive }: PlatformProps) {
  return (
    <svg viewBox="0 0 220 140" width="220" height="140" aria-label={`${stationName} platform`}>
      <defs>
        <linearGradient id="concGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D0C8BA" />
          <stop offset="100%" stopColor="#B0A898" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B5A3E" />
          <stop offset="100%" stopColor="#4A3D28" />
        </linearGradient>
      </defs>

      {/* Canopy roof */}
      <rect x="10" y="8" width="200" height="12" rx="2" fill="url(#roofGrad)" />
      {/* Roof edge highlight */}
      <rect x="10" y="8" width="200" height="2" fill="rgba(255,255,255,0.15)" />

      {/* Roof support pillars */}
      {[22, 80, 138, 196].map((x) => (
        <rect key={x} x={x - 3} y="20" width="6" height="80" rx="1" fill="#4A3D28" />
      ))}

      {/* Platform slab */}
      <rect x="0" y="100" width="220" height="30" rx="0" fill="url(#concGrad)" />
      {/* Slab edge */}
      <rect x="0" y="100" width="220" height="3" fill="#B8B0A0" />

      {/* Yellow safety line */}
      <rect x="0" y="105" width="220" height="4" fill="#F4C430" opacity="0.85" />

      {/* Tactile paving dots */}
      {Array.from({ length: 11 }).map((_, i) => (
        Array.from({ length: 2 }).map((_, j) => (
          <circle
            key={`dot-${i}-${j}`}
            cx={10 + i * 20}
            cy={108 + j * 4}
            r="1.5"
            fill="#DAB800"
            opacity="0.7"
          />
        ))
      ))}

      {/* Concrete slab joints */}
      {[55, 110, 165].map((x) => (
        <line key={x} x1={x} y1="103" x2={x} y2="130" stroke="#A09888" strokeWidth="1" opacity="0.5" />
      ))}

      {/* Station name board */}
      <rect x="30" y="28" width="160" height="60" rx="3" fill="#1A2A1A" stroke="#F4C430" strokeWidth="1.5" />
      <rect x="32" y="30" width="156" height="56" rx="2"
        fill={isActive ? "#1F3A1F" : "#141E14"}
      />
      <text
        x="110" y="52"
        textAnchor="middle"
        fill="#F4C430"
        fontSize="9"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="600"
        letterSpacing="2"
      >
        {platformLabel.toUpperCase()}
      </text>
      <text
        x="110" y="66"
        textAnchor="middle"
        fill="#F5F0E8"
        fontSize="11"
        fontFamily="'Oswald', 'Rajdhani', sans-serif"
        fontWeight="600"
        letterSpacing="1"
      >
        {stationName.toUpperCase()}
      </text>

      {/* Status indicator */}
      <circle cx="175" cy="35" r="4" fill={isActive ? "#2ECC71" : "#555"} />
      {isActive && (
        <circle cx="175" cy="35" r="7" fill="none" stroke="#2ECC71" strokeWidth="1" opacity="0.5" />
      )}

      {/* Bench */}
      <rect x="50" y="88" width="60" height="8" rx="2" fill="#3D2B1A" />
      <rect x="55" y="80" width="4" height="10" rx="1" fill="#2D1F10" />
      <rect x="101" y="80" width="4" height="10" rx="1" fill="#2D1F10" />

      {/* Lamp post */}
      <rect x="188" y="20" width="4" height="82" rx="1" fill="#2A2A2A" />
      <ellipse cx="190" cy="20" rx="10" ry="5" fill="#1A1A1A" />
      <ellipse cx="190" cy="18" rx="7" ry="3"
        fill={isActive ? "#FFF8D0" : "#333"}
        opacity={isActive ? 0.9 : 1}
      />
    </svg>
  );
}
```

---

## Phase 2 — Animation Engine

**Goal:** The train visually departs, travels at speed, decelerates, and arrives with exact timing curves. Camera logic is in place. The cabin-view transition is wired to a window click.

### 2.1 Train Controller

`src/lib/railway/trainController.ts` — the orchestration class. All component-level animation calls go through here.

```typescript
import gsap from "gsap";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS, STATION_SPACING } from "./stations";
import { StationId } from "./types";

export class TrainController {
  private worldRef: React.RefObject<HTMLDivElement>;
  private trainRef: React.RefObject<HTMLDivElement>;
  private currentTl: gsap.core.Timeline | null = null;
  private worldOffset = 0;

  constructor(
    worldRef: React.RefObject<HTMLDivElement>,
    trainRef: React.RefObject<HTMLDivElement>
  ) {
    this.worldRef = worldRef;
    this.trainRef = trainRef;
  }

  private get store() {
    return useJourneyStore.getState();
  }

  /** ── Departure sequence (see FR-12) ── */
  async depart(onComplete?: () => void) {
    const { setTrainState, setPhase } = this.store;
    const tl = gsap.timeline({ onComplete });
    this.currentTl = tl;

    setPhase("DEPARTING");

    // 0.0s — stopped; 1.0s — vibration
    tl.to(this.trainRef.current, {
      x: "+=3",
      duration: 0.08,
      repeat: 6,
      yoyo: true,
      ease: "none",
      delay: 1.0,
    });

    // 1.5s — wheels start
    tl.add(() => setTrainState({ wheelsRotating: true }), "+=0.4");

    // 2.0s — smoke
    tl.add(() => setTrainState({ smokeActive: true }), "+=0.5");

    // 2.5s — speed counter ramps up
    tl.add(() => {
      gsap.to({ speed: 0 }, {
        speed: 84,
        duration: 3,
        onUpdate: function () {
          setTrainState({ speed: Math.round(this.targets()[0].speed) });
        },
      });
    }, "+=0.5");

    // World starts moving
    tl.to(this.worldRef.current, {
      x: "-=300",
      duration: 2.5,
      ease: "power2.in",
    }, "+=0.3");

    setPhase("TRAVELLING");
    return tl;
  }

  /** ── Constant travel to next station ── */
  async travelToStation(stationId: StationId) {
    const { setPhase, setTrainState } = this.store;
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return;

    setPhase("TRAVELLING");

    const targetOffset = -(station.order * STATION_SPACING);
    const distanceToTravel = targetOffset - this.worldOffset;
    const travelDuration = Math.abs(distanceToTravel) / 300; // 300px/s constant speed

    const tl = gsap.timeline();

    // Constant speed travel
    tl.to(this.worldRef.current, {
      x: `+=${distanceToTravel * 0.7}`,
      duration: travelDuration * 0.7,
      ease: "none",
      onUpdate: () => {
        const currentX = gsap.getProperty(this.worldRef.current!, "x") as number;
        setTrainState({ worldOffset: currentX });
      },
    });

    // Approach deceleration (FR-13)
    this.applyArrivalCurve(tl, distanceToTravel * 0.3);

    return tl;
  }

  /** ── Distance-based deceleration (FR-13) ── */
  private applyArrivalCurve(tl: gsap.core.Timeline, remaining: number) {
    const { setTrainState, setPhase } = this.store;
    setPhase("APPROACHING_STATION");

    // Speed curve: 500px → normal, 300px → slow, 150px → brake, 50px → crawl, 0 → stop
    tl
      .to(this.worldRef.current, {
        x: `+=${remaining * 0.4}`,   // 500px → 300px range
        duration: 1.5,
        ease: "power1.out",
        onStart: () => setTrainState({ speed: 60 }),
      })
      .to(this.worldRef.current, {
        x: `+=${remaining * 0.3}`,   // 300px → 150px
        duration: 1.2,
        ease: "power2.out",
        onStart: () => setTrainState({ speed: 35 }),
      })
      .to(this.worldRef.current, {
        x: `+=${remaining * 0.2}`,   // 150px → 50px
        duration: 1.0,
        ease: "power3.out",
        onStart: () => setTrainState({ speed: 15 }),
      })
      .to(this.worldRef.current, {
        x: `+=${remaining * 0.1}`,   // final crawl
        duration: 1.4,
        ease: "power4.out",
        onStart: () => setTrainState({ speed: 5 }),
        onComplete: () => {
          setTrainState({ speed: 0, isMoving: false, wheelsRotating: false });
          setPhase("ARRIVING");
        },
      });
  }

  /** ── Full arrival sequence (FR-14) ── */
  async arrive(stationId: StationId, onArrived?: () => void) {
    const { setPhase, setTrainState } = this.store;

    // Stop vibration/shake (screen shake simulated by Environment)
    gsap.to(this.trainRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    setTrainState({
      smokeActive: false,
      wheelsRotating: false,
      speed: 0,
      isMoving: false,
      currentStationId: stationId,
    });

    setPhase("STOPPED");
    onArrived?.();
  }

  kill() {
    this.currentTl?.kill();
  }
}
```

### 2.2 Camera Transition System

`src/lib/railway/animationController.ts` — GSAP timeline-driven camera states.

```typescript
import gsap from "gsap";

type CameraState = "tight" | "departure" | "travel" | "approach" | "arrival" | "cabin";

interface CameraTarget {
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
  duration: number;
  ease: string;
}

const CAMERA_STATES: Record<CameraState, CameraTarget> = {
  tight:     { scaleX: 1.05, scaleY: 1.05, x: 0,   y: 0,  duration: 1.0, ease: "power2.out" },
  departure: { scaleX: 0.92, scaleY: 0.92, x: 60,  y: 8,  duration: 1.5, ease: "power2.in"  },
  travel:    { scaleX: 0.88, scaleY: 0.88, x: 0,   y: 0,  duration: 2.0, ease: "power1.out" },
  approach:  { scaleX: 0.95, scaleY: 0.95, x: -40, y: -5, duration: 1.5, ease: "power2.out" },
  arrival:   { scaleX: 1.08, scaleY: 1.08, x: -60, y: -12,duration: 2.0, ease: "power3.out" },
  cabin:     { scaleX: 2.2,  scaleY: 2.2,  x: -80, y: -40,duration: 1.2, ease: "power4.inOut"},
};

export class AnimationController {
  private cameraTarget: HTMLElement;
  private currentState: CameraState = "tight";

  constructor(cameraTarget: HTMLElement) {
    this.cameraTarget = cameraTarget;
  }

  transitionCamera(state: CameraState, onComplete?: () => void) {
    const params = CAMERA_STATES[state];
    this.currentState = state;

    return gsap.to(this.cameraTarget, {
      scale: params.scaleX,
      x: params.x,
      y: params.y,
      duration: params.duration,
      ease: params.ease,
      onComplete,
    });
  }

  /** Train shake on departure vibration */
  shake(target: HTMLElement, intensity = 4, duration = 0.6) {
    return gsap.to(target, {
      x: `+=${intensity}`,
      yoyo: true,
      repeat: Math.round(duration / 0.08),
      duration: 0.04,
      ease: "none",
    });
  }

  /** Screen flash (station arrival announcement) */
  flashOverlay(overlayEl: HTMLElement) {
    return gsap.timeline()
      .set(overlayEl, { opacity: 0, display: "block" })
      .to(overlayEl, { opacity: 0.5, duration: 0.2 })
      .to(overlayEl, { opacity: 0, duration: 0.6, delay: 0.3 })
      .set(overlayEl, { display: "none" });
  }
}
```

### 2.3 Cabin View Transition (FR-29 / FR-30)

Add an overlay component triggered when a user clicks the train's window area.

`src/components/railway/CabinView.tsx`

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CabinViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CabinView({ isOpen, onClose }: CabinViewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0, borderRadius: "50%" }}
          animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
          exit={{ scale: 0.2, opacity: 0, borderRadius: "50%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "linear-gradient(135deg, #0D1A0D 0%, #1A2A1A 50%, #0D180D 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Window frame — looking out */}
          <div style={{
            position: "absolute",
            inset: 0,
            border: "28px solid #1A1A1A",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(26,58,26,0.4)",
            pointerEvents: "none",
          }} />

          {/* Passing landscape (simplified horizontal scroll) */}
          <div style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.25,
          }}>
            <div style={{
              position: "absolute",
              bottom: "30%",
              width: "200%",
              height: "30%",
              background: "linear-gradient(90deg, #1A3A2A, #2A4A2A, #1A3A2A)",
              animation: "scroll-bg 8s linear infinite",
            }} />
          </div>

          {/* Hero card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              background: "rgba(10, 10, 10, 0.88)",
              border: "1px solid rgba(244, 196, 48, 0.35)",
              borderRadius: "4px",
              padding: "48px 52px",
              maxWidth: "520px",
              width: "90%",
              textAlign: "center",
              backdropFilter: "blur(12px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#F4C430",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}>
              DX-2026 · CABIN VIEW
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "2px",
              marginBottom: "12px",
              lineHeight: 1.1,
            }}>
              DEEPAK
            </h1>

            <div style={{
              fontFamily: "var(--font-railway)",
              fontSize: "clamp(14px, 2.5vw, 18px)",
              color: "#A8C8A8",
              letterSpacing: "3px",
              marginBottom: "28px",
              fontWeight: 500,
            }}>
              SOFTWARE ENGINEER
            </div>

            <p style={{
              fontFamily: "var(--font-railway)",
              fontSize: "15px",
              color: "rgba(245, 240, 232, 0.65)",
              lineHeight: 1.7,
              maxWidth: "340px",
              margin: "0 auto 36px",
            }}>
              Building scalable products at the intersection of clean architecture and thoughtful UX.
            </p>

            <button
              onClick={onClose}
              style={{
                padding: "12px 32px",
                background: "transparent",
                border: "1px solid #F4C430",
                color: "#F4C430",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "3px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F4C430";
                (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#F4C430";
              }}
            >
              BACK TO PLATFORM
            </button>
          </motion.div>

          {/* Window reflection */}
          <div style={{
            position: "absolute",
            top: "28px",
            left: "28px",
            right: "28px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            pointerEvents: "none",
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Phase 3 — Sound System

**Goal:** Every state transition is reinforced by a corresponding audio layer. No audio plays before the boarding gesture.

### 3.1 Sound Asset Manifest

Place all audio files in `public/audio/`. Required files:

| File | Description | Loop | Format |
|---|---|---|---|
| `ambient.mp3` | Soft background ambience (birds, wind) | Yes | MP3 + WebM |
| `train_engine.mp3` | Diesel/steam engine rumble loop | Yes | MP3 + WebM |
| `rail_clicks.mp3` | Track clack rhythm (ties under wheels) | Yes | MP3 + WebM |
| `horn.mp3` | Train whistle/horn — one shot | No | MP3 |
| `brake.mp3` | Brake squeal — one shot | No | MP3 |
| `station_announcement.mp3` | Voice announcement on arrival | No | MP3 |
| `door.mp3` | Door click/clunk on departure | No | MP3 |

> Source royalty-free audio from freesound.org — search for "steam train", "train horn", "train station ambience". Target 44.1kHz, 128kbps MP3.

### 3.2 Sound Manager

`src/lib/audio/sounds.ts`

```typescript
import { Howl, Howler } from "howler";

export interface SoundLayer {
  ambient: Howl;
  engine: Howl;
  railClicks: Howl;
  horn: Howl;
  brake: Howl;
  announcement: Howl;
  door: Howl;
}

let sounds: SoundLayer | null = null;

export function initSounds(): SoundLayer {
  if (sounds) return sounds;

  sounds = {
    ambient: new Howl({
      src: ["/audio/ambient.mp3", "/audio/ambient.webm"],
      loop: true,
      volume: 0.15,
      preload: true,
    }),
    engine: new Howl({
      src: ["/audio/train_engine.mp3", "/audio/train_engine.webm"],
      loop: true,
      volume: 0,   // starts silent; fades in on departure
      preload: true,
    }),
    railClicks: new Howl({
      src: ["/audio/rail_clicks.mp3", "/audio/rail_clicks.webm"],
      loop: true,
      volume: 0,
      preload: true,
    }),
    horn: new Howl({
      src: ["/audio/horn.mp3", "/audio/horn.webm"],
      volume: 0.7,
      preload: true,
    }),
    brake: new Howl({
      src: ["/audio/brake.mp3", "/audio/brake.webm"],
      volume: 0.6,
      preload: true,
    }),
    announcement: new Howl({
      src: ["/audio/station_announcement.mp3", "/audio/station_announcement.webm"],
      volume: 0.55,
      preload: false,  // lazy-load per station
    }),
    door: new Howl({
      src: ["/audio/door.mp3", "/audio/door.webm"],
      volume: 0.5,
      preload: true,
    }),
  };

  return sounds;
}

export function getSounds(): SoundLayer | null {
  return sounds;
}
```

### 3.3 Audio Manager Component

`src/components/audio/AudioManager.tsx` — listens to journey phase changes and triggers appropriate audio sequences.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { initSounds, getSounds } from "@/lib/audio/sounds";

export default function AudioManager() {
  const { phase, isAudioEnabled, isMuted } = useJourneyStore();
  const initialized = useRef(false);

  // Initialize after first user gesture (FR-3 / FR-19)
  useEffect(() => {
    if (!isAudioEnabled || initialized.current) return;
    initialized.current = true;
    const s = initSounds();
    s.ambient.play();
    s.ambient.fade(0, 0.15, 2000);
  }, [isAudioEnabled]);

  // Sync mute state
  useEffect(() => {
    const s = getSounds();
    if (!s) return;
    Object.values(s).forEach((h) => h.mute(isMuted));
  }, [isMuted]);

  // React to journey phase (FR-16 / FR-17)
  useEffect(() => {
    const s = getSounds();
    if (!s || !isAudioEnabled) return;

    switch (phase) {
      case "DEPARTING":
        // FR-16 departure audio order
        s.door.play();
        setTimeout(() => {
          s.engine.play();
          s.engine.fade(0, 0.4, 1500);
        }, 400);
        setTimeout(() => {
          s.railClicks.play();
          s.railClicks.fade(0, 0.3, 1000);
        }, 900);
        setTimeout(() => s.horn.play(), 1800);
        break;

      case "APPROACHING_STATION":
        // FR-17 arrival audio order
        s.engine.fade(0.4, 0.15, 2000);
        s.railClicks.fade(0.3, 0.05, 2000);
        break;

      case "ARRIVING":
        s.brake.play();
        setTimeout(() => s.horn.play(), 800);
        setTimeout(() => s.announcement.play(), 1600);
        break;

      case "STOPPED":
        s.engine.fade(0.15, 0, 1000);
        s.railClicks.fade(0.05, 0, 800);
        break;

      case "IDLE":
        s.engine.stop();
        s.railClicks.stop();
        break;
    }
  }, [phase, isAudioEnabled]);

  return null; // purely behavioral
}
```

### 3.4 Mute Toggle Button

A persistent 32×32px button, always visible, styled as a physical switch.

```tsx
// In src/components/ui/MuteToggle.tsx
"use client";
import { useJourneyStore } from "@/hooks/useJourneyState";

export default function MuteToggle() {
  const { isMuted, toggleMute } = useJourneyStore();

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 100,
        width: "36px",
        height: "36px",
        background: "rgba(10,10,10,0.8)",
        border: "1px solid rgba(244,196,48,0.3)",
        borderRadius: "4px",
        color: isMuted ? "#5C6370" : "#F4C430",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        transition: "all 0.2s ease",
        backdropFilter: "blur(8px)",
      }}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
```

---

## Phase 4 — Portfolio Content

**Goal:** Each station renders real content from `stations.ts`. Content is readable, accessible, and styled within the railway theme.

### 4.1 Personal Data Config

`src/lib/railway/stations.ts` — extend the file with real content data:

```typescript
// Education data
export const EDUCATION_DATA = {
  institution: "IIIT Nagpur",
  institutionFull: "Indian Institute of Information Technology, Nagpur",
  degree: "B.Tech Electronics & Communication Engineering",
  period: "2022 – 2026",
  cgpa: "8.43",
  highlights: [
    "Data Structures & Algorithms",
    "Computer Networks",
    "Operating Systems",
    "Database Management",
    "Embedded Systems",
  ],
};

// Experience data
export const EXPERIENCE_DATA = [
  {
    company: "Ashwam",
    role: "Software Developer",
    period: "2026 → Present",
    location: "Remote",
    responsibilities: [
      "Building scalable backend services",
      "Frontend development with React & TypeScript",
      "System design and architecture decisions",
    ],
    status: "ACTIVE",   // shown as "ON TIME" in the departures board
  },
];

// Projects data
export const PROJECTS_DATA = [
  {
    id: "lld-canvas",
    name: "LLD Canvas",
    shortName: "LLD\nCanvas",
    description: "A collaborative low-level design whiteboard with real-time multiplayer, UML diagramming, and export.",
    stack: ["Next.js", "TypeScript", "WebSocket", "Canvas API"],
    liveUrl: "#",
    githubUrl: "#",
    status: "LIVE",
  },
  {
    id: "route2hire",
    name: "Route2Hire",
    shortName: "Route2\nHire",
    description: "Job application tracker with Kanban board, interview stage pipeline, and company research tools.",
    stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
    status: "LIVE",
  },
];

// Skills data
export const SKILLS_DATA = {
  languages: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  frameworks: ["Next.js", "React", "Node.js", "Express", "Prisma"],
  tools: ["Git", "Docker", "PostgreSQL", "Redis", "Vercel", "Linux"],
  concepts: ["System Design", "REST APIs", "WebSockets", "Data Structures", "CI/CD"],
};

// Contact data
export const CONTACT_DATA = {
  email: "deepak@example.com",
  github: "https://github.com/deepak",
  linkedin: "https://linkedin.com/in/deepak",
  resumeUrl: "/resume-deepak.pdf",
};
```

### 4.2 Education Station — Station Board Style

`src/components/stations/EducationStation.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { EDUCATION_DATA } from "@/lib/railway/stations";

export default function EducationStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        fontFamily: "var(--font-railway)",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      {/* Station board outer frame */}
      <div style={{
        background: "#0A0F0A",
        border: "2px solid #F4C430",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(244,196,48,0.1)",
      }}>
        {/* Board header */}
        <div style={{
          background: "#1A3A2A",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(244,196,48,0.3)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#F4C430",
            letterSpacing: "4px",
          }}>PLATFORM 02 · EDUCATION JUNCTION</span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "rgba(244,196,48,0.6)",
            letterSpacing: "2px",
          }}>ARR 2022 · DEP 2026</span>
        </div>

        {/* Main content */}
        <div style={{ padding: "28px 32px" }}>
          {/* Institution name — like a station name on a signboard */}
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 3vw, 26px)",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "2px",
            marginBottom: "4px",
          }}>
            {EDUCATION_DATA.institution.toUpperCase()}
          </div>
          <div style={{
            fontFamily: "var(--font-railway)",
            fontSize: "12px",
            color: "#6B7280",
            letterSpacing: "1px",
            marginBottom: "24px",
          }}>
            {EDUCATION_DATA.institutionFull}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, #F4C430, transparent)",
            marginBottom: "24px",
            opacity: 0.4,
          }} />

          {/* Degree row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", marginBottom: "20px" }}>
            <div>
              <div style={{
                fontSize: "10px",
                color: "#6B7280",
                letterSpacing: "3px",
                marginBottom: "6px",
                fontFamily: "var(--font-mono)",
              }}>DEGREE</div>
              <div style={{
                fontSize: "clamp(13px, 2vw, 16px)",
                color: "#D4C9B8",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}>
                {EDUCATION_DATA.degree}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "10px",
                color: "#6B7280",
                letterSpacing: "3px",
                marginBottom: "6px",
                fontFamily: "var(--font-mono)",
              }}>CGPA</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 700,
                color: "#F4C430",
                letterSpacing: "2px",
                lineHeight: 1,
              }}>
                {EDUCATION_DATA.cgpa}
              </div>
            </div>
          </div>

          {/* Period indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              color: "#A8C8A8",
              letterSpacing: "3px",
            }}>
              {EDUCATION_DATA.period}
            </div>
            <div style={{
              height: "1px",
              flex: 1,
              background: "linear-gradient(90deg, rgba(168,200,168,0.5), transparent)",
            }} />
          </div>

          {/* Coursework grid */}
          <div style={{
            fontSize: "9px",
            color: "#6B7280",
            letterSpacing: "3px",
            fontFamily: "var(--font-mono)",
            marginBottom: "12px",
          }}>COURSEWORK</div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}>
            {EDUCATION_DATA.highlights.map((course) => (
              <span
                key={course}
                style={{
                  padding: "4px 12px",
                  background: "rgba(26, 58, 42, 0.6)",
                  border: "1px solid rgba(168, 200, 168, 0.2)",
                  borderRadius: "2px",
                  fontSize: "11px",
                  color: "#A8C8A8",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.5px",
                }}
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

### 4.3 Experience Station — Departures Board

`src/components/stations/ExperienceStation.tsx` — styled as a live ARRIVALS/DEPARTURES split-flap board.

```tsx
"use client";
import { motion } from "framer-motion";
import { EXPERIENCE_DATA } from "@/lib/railway/stations";

export default function ExperienceStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: "680px", margin: "0 auto" }}
    >
      {/* Board header */}
      <div style={{
        background: "#0A0A0A",
        border: "1px solid rgba(244,196,48,0.4)",
        borderBottom: "none",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "4px 4px 0 0",
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "16px",
          letterSpacing: "6px",
          color: "#F4C430",
          fontWeight: 700,
        }}>ARRIVALS / DEPARTURES</span>
        <div style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#2ECC71",
            boxShadow: "0 0 8px #2ECC71",
          }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#2ECC71",
            letterSpacing: "2px",
          }}>LIVE</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        background: "#111",
        border: "1px solid rgba(244,196,48,0.2)",
        borderBottom: "2px solid rgba(244,196,48,0.5)",
        padding: "8px 20px",
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr 1fr",
        gap: "16px",
      }}>
        {["COMPANY", "ROLE", "PERIOD", "STATUS"].map((h) => (
          <span key={h} style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "#5C6370",
            letterSpacing: "3px",
          }}>{h}</span>
        ))}
      </div>

      {/* Experience rows */}
      {EXPERIENCE_DATA.map((exp, i) => (
        <motion.div
          key={exp.company}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 + 0.2 }}
          style={{
            background: i % 2 === 0 ? "#0D0D0D" : "#0A0A0A",
            border: "1px solid rgba(244,196,48,0.15)",
            borderTop: "none",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr",
            gap: "16px",
            alignItems: "center",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          whileHover={{ background: "rgba(26, 58, 42, 0.3)" }}
        >
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 600,
            color: "#F5F0E8",
            letterSpacing: "2px",
          }}>
            {exp.company.toUpperCase()}
          </div>
          <div style={{
            fontFamily: "var(--font-railway)",
            fontSize: "13px",
            color: "#A8C8A8",
            fontWeight: 500,
          }}>
            {exp.role}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#6B7280",
            letterSpacing: "1px",
          }}>
            {exp.period}
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: exp.status === "ACTIVE" ? "#2ECC71" : "#F4C430",
              letterSpacing: "2px",
            }}>
              {exp.status === "ACTIVE" ? "ON TIME" : "COMPLETED"}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Responsibilities drawer (expanded view) */}
      {/* Expanding on row click — implement with local state in Phase 4 */}
    </motion.div>
  );
}
```

### 4.4 Projects Station — Terminal Bay Cards

`src/components/stations/ProjectsStation.tsx`

```tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS_DATA } from "@/lib/railway/stations";

export default function ProjectsStation() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: "780px", margin: "0 auto" }}
    >
      {/* Terminal header */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "13px",
        letterSpacing: "8px",
        color: "#F4C430",
        textAlign: "center",
        marginBottom: "24px",
        fontWeight: 700,
      }}>
        PROJECTS TERMINAL
      </div>

      {/* Platform bays grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
      }}>
        {PROJECTS_DATA.map((project, i) => (
          <motion.div
            key={project.id}
            layoutId={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
            style={{
              background: "#0A0F0A",
              border: "1px solid rgba(244,196,48,0.25)",
              borderRadius: "4px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
            whileHover={{ borderColor: "rgba(244, 196, 48, 0.6)" }}
          >
            {/* Bay number indicator */}
            <div style={{
              background: "#1A3A2A",
              padding: "6px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(244,196,48,0.2)",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "#6B7280",
                letterSpacing: "3px",
              }}>BAY {String(i + 1).padStart(2, "0")}</span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                color: project.status === "LIVE" ? "#2ECC71" : "#F4C430",
                letterSpacing: "2px",
              }}>● {project.status}</span>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(16px, 2.5vw, 20px)",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}>
                {project.name.toUpperCase()}
              </div>

              <p style={{
                fontFamily: "var(--font-railway)",
                fontSize: "13px",
                color: "#8A9280",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}>
                {project.description}
              </p>

              {/* Tech stack tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {project.stack.map((tech) => (
                  <span key={tech} style={{
                    padding: "2px 8px",
                    background: "rgba(26,58,42,0.8)",
                    border: "1px solid rgba(168,200,168,0.2)",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#A8C8A8",
                    fontFamily: "var(--font-mono)",
                  }}>{tech}</span>
                ))}
              </div>

              {/* Links */}
              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", gap: "10px", overflow: "hidden" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#F4C430",
                        color: "#0A0A0A",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        textAlign: "center",
                        textDecoration: "none",
                        borderRadius: "2px",
                        fontWeight: 600,
                      }}
                    >
                      LIVE DEMO
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "transparent",
                        border: "1px solid rgba(244,196,48,0.4)",
                        color: "#F4C430",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        textAlign: "center",
                        textDecoration: "none",
                        borderRadius: "2px",
                      }}
                    >
                      GITHUB
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
```

### 4.5 Skills Station — Night-Mode Signal Board

`src/components/stations/SkillsStation.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { SKILLS_DATA } from "@/lib/railway/stations";

const CATEGORY_COLORS: Record<string, string> = {
  languages: "#F4C430",
  frameworks: "#A8C8A8",
  tools: "#87CEEB",
  concepts: "#C0392B",
};

const CATEGORY_LABELS: Record<string, string> = {
  languages: "LANGUAGES",
  frameworks: "FRAMEWORKS & RUNTIMES",
  tools: "TOOLS & PLATFORMS",
  concepts: "CONCEPTS",
};

export default function SkillsStation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "700px", margin: "0 auto" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {Object.entries(SKILLS_DATA).map(([category, skills], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            style={{
              background: "#060A06",
              border: `1px solid ${CATEGORY_COLORS[category]}30`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Category header */}
            <div style={{
              padding: "8px 14px",
              background: `${CATEGORY_COLORS[category]}12`,
              borderBottom: `1px solid ${CATEGORY_COLORS[category]}25`,
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: CATEGORY_COLORS[category],
                letterSpacing: "3px",
                opacity: 0.9,
              }}>
                {CATEGORY_LABELS[category]}
              </span>
            </div>

            {/* Skills list */}
            <div style={{ padding: "14px" }}>
              {(skills as string[]).map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 + i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "5px 0",
                    borderBottom: i < (skills as string[]).length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  }}
                >
                  <div style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[category],
                    flexShrink: 0,
                    opacity: 0.7,
                  }} />
                  <span style={{
                    fontFamily: "var(--font-railway)",
                    fontSize: "13px",
                    color: "#D4C9B8",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}>
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
```

### 4.6 Contact Station — Final Destination

`src/components/stations/ContactStation.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { CONTACT_DATA } from "@/lib/railway/stations";

export default function ContactStation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: "580px", margin: "0 auto", textAlign: "center" }}
    >
      {/* Final station signboard */}
      <div style={{
        background: "#0A0A0A",
        border: "2px solid #F4C430",
        borderRadius: "4px",
        padding: "40px 48px",
        marginBottom: "24px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "5px",
          color: "#F4C430",
          marginBottom: "16px",
        }}>
          PLATFORM 06 · DESTINATION STATION
        </div>

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 4vw, 32px)",
          fontWeight: 700,
          color: "#F5F0E8",
          letterSpacing: "3px",
          marginBottom: "8px",
        }}>
          END OF LINE
        </div>
        <div style={{
          fontFamily: "var(--font-railway)",
          fontSize: "14px",
          color: "#A8C8A8",
          letterSpacing: "2px",
          marginBottom: "32px",
        }}>
          DEEPAK IS OPEN FOR OPPORTUNITIES
        </div>

        {/* Contact links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a
            href={`mailto:${CONTACT_DATA.email}`}
            style={{
              display: "block",
              padding: "14px 24px",
              background: "#F4C430",
              color: "#0A0A0A",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "3px",
              textDecoration: "none",
              borderRadius: "2px",
              fontWeight: 700,
              transition: "opacity 0.2s ease",
            }}
          >
            SEND A MESSAGE →
          </a>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[
              { label: "GITHUB", url: CONTACT_DATA.github },
              { label: "LINKEDIN", url: CONTACT_DATA.linkedin },
              { label: "RÉSUMÉ", url: CONTACT_DATA.resumeUrl },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "10px 8px",
                  background: "transparent",
                  border: "1px solid rgba(244,196,48,0.3)",
                  color: "#F4C430",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "#3A4A3A",
        letterSpacing: "3px",
      }}>
        ● DEEPAK EXPRESS · JOURNEY COMPLETE
      </div>
    </motion.div>
  );
}
```

---

## Phase 5 — Cinematic Polish

**Goal:** Environment transitions, particle effects, building silhouettes, day/night lighting, film grain, and motion trails turn the prototype into a cinematic experience.

### 5.1 Building Silhouettes per Station

`src/components/railway/Environment.tsx` — add a per-station `BuildingLayer` that renders contextually themed SVG silhouettes.

```tsx
// Add inside Environment.tsx

function BuildingLayer({
  timeOfDay,
  stationType,
}: {
  timeOfDay: string;
  stationType: string;
}) {
  const windowOpacity = timeOfDay === "night" ? 1
    : timeOfDay === "sunset" ? 0.6
    : timeOfDay === "evening" ? 0.3
    : 0;

  return (
    <svg
      viewBox="0 0 1440 320"
      style={{
        position: "absolute",
        bottom: "35%",
        left: 0,
        width: "100%",
        pointerEvents: "none",
        transition: "all 3s ease",
      }}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Office towers — Experience / Projects station */}
      {(stationType === "experience" || stationType === "projects") && <>
        <rect x="80" y="120" width="60" height="200" fill="#1A1A1A" />
        <rect x="160" y="60" width="80" height="260" fill="#151515" />
        <rect x="260" y="140" width="50" height="180" fill="#1C1C1C" />
        <rect x="900" y="80" width="90" height="240" fill="#161616" />
        <rect x="1010" y="120" width="60" height="200" fill="#1A1A1A" />
        <rect x="1090" y="50" width="100" height="270" fill="#141414" />
        <rect x="1220" y="100" width="75" height="220" fill="#181818" />

        {/* Building windows grid */}
        {[[100, 140], [180, 80], [280, 160], [920, 100], [1030, 140], [1110, 70], [1240, 120]].map(([bx, by], bi) => (
          Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, col) => (
              <rect
                key={`w-${bi}-${row}-${col}`}
                x={bx + col * 12}
                y={by + row * 20}
                width="6"
                height="10"
                fill="#F4C430"
                opacity={(Math.random() > 0.35 ? windowOpacity : 0) * 0.8}
              />
            ))
          )
        ))}
      </>}

      {/* School / campus buildings — Education station */}
      {stationType === "education" && <>
        <rect x="100" y="180" width="120" height="140" fill="#2A2A1A" />
        <polygon points="100,180 220,180 160,120" fill="#3A3A22" />
        <rect x="140" y="200" width="40" height="60" fill="#1A1A0A" />
        {/* Clock tower */}
        <rect x="600" y="100" width="40" height="220" fill="#1E1E14" />
        <rect x="590" y="95" width="60" height="20" fill="#282818" />
        <circle cx="620" cy="120" r="18" fill="none" stroke="#5C5C3A" strokeWidth="2" />
        {/* Trees */}
        {[200, 320, 450, 800, 950, 1100, 1280].map((tx) => (
          <g key={tx}>
            <ellipse cx={tx} cy="260" rx="28" ry="36" fill="#1A3A1A" />
            <ellipse cx={tx} cy="255" rx="22" ry="28" fill="#243A24" />
            <rect x={tx - 4} y="290" width="8" height="30" fill="#1A0F0A" />
          </g>
        ))}
      </>}

      {/* Terminal/launch motif — Projects station */}
      {stationType === "projects" && <>
        {/* Monitor silhouettes */}
        <rect x="340" y="220" width="80" height="50" rx="4" fill="#0D0D0D" stroke="#1A3A2A" strokeWidth="1" />
        <rect x="360" y="270" width="40" height="10" fill="#0A0A0A" />
        <rect x="740" y="210" width="100" height="60" rx="4" fill="#0D0D0D" stroke="#1A3A2A" strokeWidth="1" />
        <rect x="770" y="270" width="40" height="10" fill="#0A0A0A" />
      </>}
    </svg>
  );
}
```

### 5.2 Particle System — Smoke and Steam

`src/components/railway/Particles.tsx` — a lightweight canvas-based particle emitter for smoke, sparks, and ambient dust.

```tsx
"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  decay: number;
  color: string;
}

interface ParticleSystemProps {
  active: boolean;
  type: "smoke" | "steam" | "spark";
  originX: number;
  originY: number;
}

export default function ParticleSystem({ active, type, originX, originY }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const createParticle = (): Particle => {
    const configs = {
      smoke: {
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        radius: Math.random() * 12 + 6,
        decay: Math.random() * 0.006 + 0.003,
        color: `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}`,
      },
      steam: {
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.2),
        radius: Math.random() * 8 + 4,
        decay: Math.random() * 0.01 + 0.005,
        color: `rgba(220, 220, 220`,
      },
      spark: {
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 2 + 1),
        radius: Math.random() * 2 + 1,
        decay: Math.random() * 0.04 + 0.02,
        color: `rgba(244, 196, 48`,
      },
    };

    const cfg = configs[type];
    return {
      x: originX + (Math.random() - 0.5) * 10,
      y: originY,
      vx: cfg.vx,
      vy: cfg.vy,
      radius: cfg.radius,
      opacity: 0.6 + Math.random() * 0.3,
      decay: cfg.decay,
      color: cfg.color,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const emit = type === "spark" ? 3 : 1;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && Math.random() < (type === "smoke" ? 0.3 : type === "steam" ? 0.5 : 0.8)) {
        for (let i = 0; i < emit; i++) {
          particles.current.push(createParticle());
        }
      }

      particles.current = particles.current.filter((p) => p.opacity > 0.01);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.98;
        p.vx *= 0.995;
        p.radius *= type === "smoke" ? 1.005 : 1;
        p.opacity -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, type, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}
```

### 5.3 Day/Night CSS Cycle

Add to `src/styles/tokens.css` — environment class overrides applied by `Environment.tsx` via `gsap.set` on the `:root`.

```css
/* These are applied programmatically via GSAP to :root —
   kept here as reference values only. The JS animates between them. */

[data-time="day"] {
  --sky-top: #4A90C8;
  --sky-bottom: #87CEEB;
  --ground-color: #5C7A3A;
  --ambient-intensity: 1;
  --window-glow: 0;
}

[data-time="evening"] {
  --sky-top: #C0703A;
  --sky-bottom: #E8A870;
  --ground-color: #3A5526;
  --ambient-intensity: 0.8;
  --window-glow: 0.1;
}

[data-time="sunset"] {
  --sky-top: #6B2D5E;
  --sky-bottom: #D4603A;
  --ground-color: #2C3E20;
  --ambient-intensity: 0.65;
  --window-glow: 0.5;
}

[data-time="night"] {
  --sky-top: #080C1A;
  --sky-bottom: #0D1A2E;
  --ground-color: #1A2210;
  --ambient-intensity: 0.3;
  --window-glow: 1;
  --headlight-intensity: 1;
}

[data-time="sunrise"] {
  --sky-top: #1A3A6E;
  --sky-bottom: #F4A04A;
  --ground-color: #3A5020;
  --ambient-intensity: 0.75;
  --window-glow: 0.3;
}
```

### 5.4 Film Grain Overlay

A persistent full-screen SVG filter overlay for analogue texture. Applied as a fixed `<div>` at z-index 200, pointer-events none.

```tsx
// src/components/ui/FilmGrain.tsx
"use client";
export default function FilmGrain() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          opacity: 0.035,
          filter: "url(#grain)",
          pointerEvents: "none",
          animation: "grain-shift 0.15s steps(1) infinite",
        }}
      />
      <style>{`
        @keyframes grain-shift {
          0%  { transform: translate(0, 0) }
          10% { transform: translate(-2%, -3%) }
          20% { transform: translate(3%, 1%) }
          30% { transform: translate(-1%, 3%) }
          40% { transform: translate(2%, -2%) }
          50% { transform: translate(-3%, 1%) }
          60% { transform: translate(1%, 2%) }
          70% { transform: translate(-2%, -1%) }
          80% { transform: translate(3%, 3%) }
          90% { transform: translate(-1%, -2%) }
        }
      `}</style>
    </>
  );
}
```

---

## Phase 6 — UX Hardening

### 6.1 Boarding Screen

`src/components/ui/BoardingScreen.tsx` — the first visual a visitor sees. Must instantly communicate the railway metaphor and provide both the cinematic and skip paths.

```tsx
"use client";
import { motion } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";

export default function BoardingScreen() {
  const { setPhase, enableAudio } = useJourneyStore();

  const handleBoard = () => {
    enableAudio();
    setPhase("BOARDING");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0A0F0A 0%, #0D180D 50%, #080C08 100%)",
        fontFamily: "var(--font-railway)",
      }}
    >
      {/* Texture: subtle diagonal lines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.008) 40px, rgba(255,255,255,0.008) 41px)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "640px",
        padding: "0 24px",
        position: "relative",
      }}>
        {/* Header — Indian Railways style */}
        <div style={{
          border: "2px solid rgba(244,196,48,0.6)",
          borderRadius: "4px",
          marginBottom: "32px",
          overflow: "hidden",
        }}>
          {/* Top band */}
          <div style={{
            background: "linear-gradient(135deg, #1A3A2A, #0D180D)",
            padding: "20px 28px",
            borderBottom: "1px solid rgba(244,196,48,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 700,
                color: "#F4C430",
                letterSpacing: "4px",
                marginBottom: "4px",
              }}>
                INDIAN RAILWAYS
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "rgba(244,196,48,0.5)",
                letterSpacing: "4px",
              }}>PORTFOLIO EXPRESS · CLASS: ENGINEERING</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "20px",
                color: "#F4C430",
                fontWeight: 700,
                letterSpacing: "2px",
              }}>DX-2026</div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                color: "#2ECC71",
                letterSpacing: "3px",
                marginTop: "2px",
              }}>● ON TIME</div>
            </div>
          </div>

          {/* Route details */}
          <div style={{
            padding: "20px 28px",
            background: "#0A0A0A",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "12px",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "#5C6370",
                letterSpacing: "3px",
                marginBottom: "4px",
              }}>ORIGIN</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: "#F5F0E8",
                fontWeight: 600,
                letterSpacing: "2px",
              }}>LUCKNOW</div>
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "rgba(244,196,48,0.5)",
              letterSpacing: "2px",
            }}>→</div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "#5C6370",
                letterSpacing: "3px",
                marginBottom: "4px",
              }}>DESTINATION</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: "#A8C8A8",
                fontWeight: 600,
                letterSpacing: "2px",
              }}>SOFTWARE ENGINEER</div>
            </div>
          </div>

          {/* Platform label */}
          <div style={{
            background: "#1A3A2A",
            padding: "8px 28px",
            borderTop: "1px solid rgba(244,196,48,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(244,196,48,0.6)",
              letterSpacing: "4px",
            }}>PLATFORM 01</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "#3A4A3A",
              letterSpacing: "3px",
            }}>DEP: NOW</span>
          </div>
        </div>

        {/* Primary CTA */}
        <motion.button
          onClick={handleBoard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "18px 24px",
            background: "#F4C430",
            border: "none",
            borderRadius: "3px",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 2.5vw, 18px)",
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "5px",
            cursor: "pointer",
            marginBottom: "16px",
            display: "block",
          }}
        >
          BOARD DEEPAK EXPRESS
        </motion.button>

        {/* Skip / Explore Journey */}
        <div style={{
          border: "1px solid rgba(244,196,48,0.15)",
          borderRadius: "3px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "10px 16px",
            background: "rgba(26,58,42,0.2)",
            borderBottom: "1px solid rgba(244,196,48,0.1)",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "#5C6370",
            letterSpacing: "4px",
          }}>EXPLORE JOURNEY — DIRECT ACCESS</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          }}>
            {STATIONS.filter((s) => s.id !== "welcome").map((station) => (
              <button
                key={station.id}
                onClick={() => {
                  enableAudio();
                  useJourneyStore.getState().jumpToStation(station.id);
                }}
                style={{
                  padding: "12px 8px",
                  background: "transparent",
                  border: "none",
                  borderRight: "1px solid rgba(244,196,48,0.1)",
                  color: "#6B7280",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#F4C430";
                  e.currentTarget.style.background = "rgba(26,58,42,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {station.displayName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

### 6.2 Digital Ticket

`src/components/ui/Ticket.tsx`

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

interface TicketProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function Ticket({ isVisible, onDismiss }: TicketProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            zIndex: 150,
            width: "240px",
            background: "#F5F0E8",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
          }}
          onClick={onDismiss}
        >
          {/* Ticket header stripe */}
          <div style={{
            background: "#1A3A2A",
            padding: "8px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: "9px", color: "#F4C430", letterSpacing: "3px" }}>
              DEEPAK EXPRESS
            </span>
            <span style={{ fontSize: "8px", color: "rgba(244,196,48,0.5)", letterSpacing: "2px" }}>
              DX-2026
            </span>
          </div>

          {/* Ticket body */}
          <div style={{ padding: "14px" }}>
            {[
              ["PASSENGER", "VISITOR"],
              ["FROM", "INTERNET"],
              ["TO", "SOFTWARE ENGINEER"],
              ["COACH", "PORTFOLIO"],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                paddingBottom: "8px",
                borderBottom: "1px dashed rgba(0,0,0,0.1)",
              }}>
                <span style={{ fontSize: "8px", color: "#6B7280", letterSpacing: "2px" }}>
                  {label}
                </span>
                <span style={{ fontSize: "9px", color: "#1A1A1A", fontWeight: 700, letterSpacing: "1px" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Perforated edge */}
          <div style={{
            borderTop: "1px dashed rgba(0,0,0,0.2)",
            padding: "10px 14px",
            background: "rgba(0,0,0,0.03)",
            display: "flex",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: "8px", color: "#9CA3AF", letterSpacing: "2px" }}>
              TAP TO DISMISS
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 6.3 Control Panel

`src/components/ui/ControlPanel.tsx` — the persistent HUD showing speed, next stop, and action buttons.

```tsx
"use client";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import { getSounds } from "@/lib/audio/sounds";

export default function ControlPanel() {
  const { trainState, phase } = useJourneyStore();
  const nextStation = STATIONS.find((s) => s.id === trainState.nextStationId);

  const handleHorn = () => {
    const s = getSounds();
    s?.horn.play();
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "24px",
      zIndex: 100,
      background: "var(--panel-bg)",
      border: "1px solid var(--panel-border)",
      borderRadius: "var(--panel-radius)",
      padding: "16px 20px",
      minWidth: "260px",
      backdropFilter: "blur(12px)",
      fontFamily: "var(--font-mono)",
    }}>
      {/* Header row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        paddingBottom: "10px",
        borderBottom: "1px solid rgba(244,196,48,0.15)",
      }}>
        <span style={{ fontSize: "10px", color: "#F4C430", letterSpacing: "2px", fontWeight: 700 }}>
          DEEPAK EXPRESS
        </span>
        <span style={{ fontSize: "8px", color: "#5C6370", letterSpacing: "2px" }}>DX-2026</span>
      </div>

      {/* Status rows */}
      {[
        {
          label: "STATUS",
          value: phase === "STOPPED" ? "AT STATION" : phase === "TRAVELLING" ? "RUNNING" : phase,
          color: phase === "STOPPED" ? "#A8C8A8" : "#F4C430",
        },
        {
          label: "SPEED",
          value: `${trainState.speed} km/h`,
          color: "#F5F0E8",
        },
        {
          label: "NEXT STOP",
          value: nextStation?.displayName.toUpperCase() ?? "—",
          color: "#87CEEB",
        },
      ].map(({ label, value, color }) => (
        <div key={label} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "8px", color: "#5C6370", letterSpacing: "3px" }}>{label}</span>
          <span style={{ fontSize: "10px", color, letterSpacing: "1px", fontWeight: 600 }}>{value}</span>
        </div>
      ))}

      {/* Action buttons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "6px",
        marginTop: "14px",
        paddingTop: "12px",
        borderTop: "1px solid rgba(244,196,48,0.15)",
      }}>
        {[
          { label: "BRAKE", action: () => useJourneyStore.getState().setPhase("STOPPED") },
          { label: "HORN", action: handleHorn },
          { label: "MAP", action: () => {/* open map overlay */} },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              padding: "8px 4px",
              background: "rgba(26,58,42,0.4)",
              border: "1px solid rgba(244,196,48,0.2)",
              borderRadius: "2px",
              color: "#F4C430",
              fontSize: "8px",
              letterSpacing: "2px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-mono)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244,196,48,0.15)";
              e.currentTarget.style.borderColor = "rgba(244,196,48,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,58,42,0.4)";
              e.currentTarget.style.borderColor = "rgba(244,196,48,0.2)";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 6.4 Station Map Overlay

`src/components/ui/StationMap.tsx` — opened via the MAP button; shows the full route with branch structure.

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { STATIONS } from "@/lib/railway/stations";
import type { StationId } from "@/lib/railway/types";

interface StationMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StationMap({ isOpen, onClose }: StationMapProps) {
  const { jumpToStation, currentStationIndex } = useJourneyStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0A0F0A",
              border: "1px solid rgba(244,196,48,0.3)",
              borderRadius: "4px",
              padding: "32px 40px",
              maxWidth: "640px",
              width: "90%",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{
              fontSize: "10px",
              color: "#F4C430",
              letterSpacing: "5px",
              marginBottom: "28px",
              fontWeight: 700,
            }}>
              JOURNEY MAP — DX-2026
            </div>

            {/* Linear route diagram */}
            <div style={{ position: "relative", marginBottom: "24px" }}>
              {/* Track line */}
              <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                right: "20px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent)",
              }} />

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
              }}>
                {STATIONS.map((station, i) => {
                  const isPast = i < currentStationIndex;
                  const isCurrent = i === currentStationIndex;

                  return (
                    <button
                      key={station.id}
                      onClick={() => {
                        jumpToStation(station.id as StationId);
                        onClose();
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Station dot */}
                      <div style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: isCurrent ? "#F4C430" : isPast ? "#2ECC71" : "#2A3A2A",
                        border: `2px solid ${isCurrent ? "#F4C430" : isPast ? "#2ECC71" : "rgba(244,196,48,0.3)"}`,
                        boxShadow: isCurrent ? "0 0 12px #F4C430" : "none",
                        transition: "all 0.3s ease",
                      }} />

                      {/* Station label */}
                      <div style={{
                        fontSize: "7px",
                        color: isCurrent ? "#F4C430" : isPast ? "#A8C8A8" : "#4A5A4A",
                        letterSpacing: "1.5px",
                        textAlign: "center",
                        maxWidth: "70px",
                        lineHeight: 1.4,
                        transition: "color 0.3s ease",
                        textTransform: "uppercase",
                      }}>
                        {station.displayName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              fontSize: "8px",
              color: "#3A4A3A",
              letterSpacing: "2px",
              textAlign: "center",
            }}>
              SELECT A STATION TO JUMP DIRECTLY
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 6.5 Loading Screen

`src/components/ui/LoadingScreen.tsx` — shown while audio/fonts/SVGs load.

```tsx
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoaded: () => void;
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALISING SYSTEMS...");

  useEffect(() => {
    const steps = [
      { to: 20, label: "LOADING TRACK DATA..." },
      { to: 45, label: "CALIBRATING ENGINE..." },
      { to: 70, label: "LOADING AUDIO SYSTEMS..." },
      { to: 88, label: "PREPARING PLATFORMS..." },
      { to: 100, label: "ALL SYSTEMS GO." },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(onLoaded, 600);
        return;
      }
      setProgress(steps[i].to);
      setStatus(steps[i].label);
      i++;
    }, 480);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "#060A06",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "48px", textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "32px",
          fontWeight: 700,
          color: "#F4C430",
          letterSpacing: "6px",
          marginBottom: "6px",
        }}>DEEPAK EXPRESS</div>
        <div style={{
          fontSize: "9px",
          color: "#3A4A3A",
          letterSpacing: "5px",
        }}>DX-2026 · PORTFOLIO RAILWAY</div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: "280px",
        height: "2px",
        background: "rgba(244,196,48,0.1)",
        borderRadius: "1px",
        overflow: "hidden",
        marginBottom: "16px",
      }}>
        <motion.div
          style={{
            height: "100%",
            background: "#F4C430",
            transformOrigin: "left",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Status text */}
      <div style={{
        fontSize: "8px",
        color: "#5C6370",
        letterSpacing: "3px",
      }}>
        {status}
      </div>
    </motion.div>
  );
}
```

### 6.6 Keyboard Navigation & Accessibility

In `src/hooks/useKeyboardNav.ts`:

```typescript
import { useEffect } from "react";
import { useJourneyStore } from "./useJourneyState";

export function useKeyboardNav() {
  const { phase, advanceStation, jumpToStation } = useJourneyStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "n":
          if (phase === "STOPPED" || phase === "EXPLORE") advanceStation();
          break;
        case "m":
          // Open map — dispatch custom event to ControlPanel
          window.dispatchEvent(new CustomEvent("open-map"));
          break;
        case "h":
          // Horn
          window.dispatchEvent(new CustomEvent("play-horn"));
          break;
        case "Escape":
          window.dispatchEvent(new CustomEvent("close-overlays"));
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, advanceStation]);
}
```

Add `aria` labels to all interactive elements. Every SVG text content must also exist in DOM:

```tsx
// Pattern: always pair SVG text with aria-label or hidden DOM equivalent
<svg aria-label="Platform 02 — Education Junction, Platform label">
  {/* SVG visual */}
</svg>
<span className="sr-only">Platform 02 — Education Junction</span>
```

Add to `globals.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
```

### 6.7 Reduced Motion Mode

`src/hooks/useReducedMotion.ts`:

```typescript
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

Use in `RailwayWorld.tsx` — when `reducedMotion === true`:
- Replace GSAP world panning with instant CSS class toggling
- Replace Framer Motion `AnimatePresence` with `initial={false}` and instant transitions
- Disable `ParticleSystem` and `FilmGrain` entirely
- Replace cinematic camera transitions with simple fade-in of station content

### 6.8 Mobile Experience

In `src/app/page.tsx`, detect mobile and render a simplified `MobileJourney` component:

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

return isMobile ? <MobileJourney /> : <RailwayWorld />;
```

`src/components/railway/MobileJourney.tsx` key principles:
- Vertically stacked steps — no horizontal world panning
- Each station is a full-screen card, swiped/tapped to advance
- Train illustration remains visible at top as a fixed header
- Day/night CSS background transitions preserved
- No particle system, no camera system, no film grain
- `NEXT STATION →` button is large, thumb-friendly (min 48×48px touch target)

### 6.9 Analytics Integration

Add Vercel Analytics (zero-config for Vercel deployments):

```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Track custom events in the journey store:

```typescript
import { track } from "@vercel/analytics";

// In advanceStation():
track("station_visit", { stationId: nextStation.id });

// In jumpToStation():
track("station_skip", { fromStation: currentId, toStation: id });

// On boarding:
track("journey_started");
```

---

## Cross-Cutting Implementation Rules

These apply throughout all phases and must never be broken:

### Realism & Visual Standards

1. **No placeholder colors.** Every element uses the palette from `tokens.css`. Never use `red`, `blue`, or `#ccc`.
2. **No emoji in production UI.** The PRD uses emoji for planning clarity. The actual render uses SVG elements and CSS. Station icons are custom SVG, not Unicode emoji.
3. **Every SVG uses gradients.** Flat single-color SVG elements look fake. Every significant SVG surface — train body, wheels, rails, platform slab — uses a `linearGradient` or `radialGradient`.
4. **Text is always real DOM.** Station names, CGPA, company names, project titles — all are real `<p>`, `<span>`, `<h1>` elements (not SVG `<text>`), so they're accessible and indexable.
5. **Type everything.** No `any`. `TrainState`, `EnvironmentState`, `StationConfig`, `JourneyPhase` — all imported from `types.ts`.

### Performance

1. **Lazy-load station content.** Each station component is dynamically imported:
   ```typescript
   const EducationStation = dynamic(() => import("@/components/stations/EducationStation"));
   ```
2. **`will-change` only on actively animating elements.** Apply `will-change: transform` to the `#world` div only during `TRAVELLING` phase; remove it during `STOPPED`.
3. **Audio files are not bundled.** They live in `public/audio/` and are fetched at runtime, not at build time.
4. **Particle canvas is unmounted** when `active === false` for more than 2 seconds to free GPU memory.

### Architecture Integrity

1. **No animation logic in station components.** `EducationStation.tsx` renders content. GSAP lives in `trainController.ts` and `animationController.ts` only.
2. **No hardcoded content strings in components.** Every name, date, description comes from `stations.ts`.
3. **No inline `setTimeout`.** All timed sequences are GSAP timelines with labeled positions.

---

## Dependency Lock

| Package | Purpose | Min Version |
|---|---|---|
| `next` | Framework | 14.x |
| `react` | UI | 18.x |
| `typescript` | Type safety | 5.x |
| `gsap` | Animation | 3.12.x |
| `@gsap/react` | GSAP React integration | 2.x |
| `howler` | Audio | 2.2.x |
| `framer-motion` | UI transitions | 11.x |
| `zustand` | Global state | 4.x |
| `clsx` | Conditional classNames | 2.x |
| `tailwind-merge` | Tailwind class merging | 2.x |
| `@vercel/analytics` | Event tracking | 1.x |

---

## Definition of Done — Per Phase

| Phase | Done When |
|---|---|
| Phase 0 | `npm run dev` opens a blank page with correct fonts loaded, no console errors |
| Phase 1 | A manually triggered state change pans the world, revealing 3 platform structures with name boards |
| Phase 2 | Clicking a "Depart" button triggers the full timed beat sequence; train arrives at next station and stops smoothly |
| Phase 3 | Every phase transition plays the correct audio; mute toggle silences all layers |
| Phase 4 | All 5 station components render real personal data; projects expand on click; contact links work |
| Phase 5 | Sky transitions smoothly across all 5 time-of-day states; film grain visible; building windows lit at night; particle smoke visible while moving |
| Phase 6 | Ticket shown on boarding; control panel shows live speed; MAP opens all stations; keyboard nav works; mobile layout distinct from desktop; Lighthouse accessibility score ≥ 80 |
