# Product Requirements Document
## Deepak Express — Interactive Railway-Themed Portfolio

**Document Owner:** Deepak
**Version:** 1.0
**Status:** Draft
**Last Updated:** August 15, 2026

---

## 1. Overview

### 1.1 Summary
Deepak Express is an interactive personal portfolio built around a railway journey metaphor. Instead of a traditional scrolling website with sections, visitors "board" a train and travel through stations that represent different parts of Deepak's career — Education, Experience, Projects, Skills, and Contact. The interaction itself is the differentiator: the portfolio is designed and experienced like a lightweight game/simulation rather than a static content site.

### 1.2 Problem Statement
Most developer portfolios look and feel identical: a hero section, an about section, a projects grid, a contact form. Recruiters and hiring managers skim past them quickly because nothing about the format signals technical craft or creativity. A generic portfolio does not differentiate a candidate in a crowded market.

### 1.3 Goal
Build a portfolio that:
- Demonstrates strong frontend engineering ability (animation, state management, audio, architecture) as part of the experience itself, not just as listed skills.
- Tells a cohesive "career as a journey" story.
- Remains fast, accessible, and usable for time-constrained recruiters (not just a cinematic gimmick).

### 1.4 Non-Goals
- This is not a full 3D game or flight-simulator-level render.
- This is not a CMS-driven multi-author site — content is static/personal.
- Three.js and true 3D environments are explicitly out of scope for v1.

---

## 2. Target Users / Personas

| Persona | Description | Primary Need |
|---|---|---|
| Recruiter (time-constrained) | Skims 20+ portfolios a day | Fast path to skills, experience, projects, resume/contact |
| Hiring Manager / Tech Lead | Evaluates technical depth | Wants to see code quality, architecture decisions, live projects |
| Returning Visitor | Has seen the site before | Wants to skip the cinematic intro and jump to a section |
| Mobile Visitor | Browsing on a phone | Wants a lighter, faster, thumb-friendly version of the journey |

---

## 3. Core Concept & Metaphor Mapping

| Railway Element | Portfolio Meaning |
|---|---|
| Train | Deepak's career |
| Passenger | Recruiter / visitor |
| Journey | Career journey / timeline |
| Station | Portfolio section |
| Platform | Section content |
| Ticket | Visitor identity / session |
| Train number (DX-2026) | Personal brand identifier |
| Destination | Career goal (Software Engineer role) |
| Horn / whistle | Station transition cue |
| Railway map | Portfolio navigation |
| Engine | Technical skill set |
| Final station | Contact / Hire Me |

**Narrative shift:** From *"Hi, I'm Deepak, here are my projects"* to *"Welcome aboard — this is the journey that brought me here."*

---

## 4. Experience Flow

### 4.1 Landing Screen
- Displays "INDIAN RAILWAYS" style header, train number (DX-2026), origin (Gorakhpur) → destination (Software Engineer).
- Primary CTA: **"BOARD DEEPAK EXPRESS"**.
- Secondary CTA: **"Explore Journey"** — a simplified station list for users who want to skip the cinematic experience.
- This first user gesture is also used to unlock audio playback (browser autoplay restrictions require a user interaction before sound can play).

### 4.2 Journey State Machine
The train/journey progresses through a defined sequence of states:

```
IDLE → BOARDING → DEPARTING → TRAVELLING → APPROACHING_STATION
→ ARRIVING → STOPPED → EXPLORE → DEPARTING → TRAVELLING → ... → FINAL_STATION
```

### 4.3 Station Sequence
| Order | Station ID | Display Name | Content |
|---|---|---|---|
| 1 | `welcome` | Central Station | Intro / hero |
| 2 | `education` | Education Junction | Academic background |
| 3 | `experience` | Experience Junction | Work history |
| 4 | `projects` | Project Junction | Portfolio projects |
| 5 | `skills` | Skills Junction | Tech stack |
| 6 | `contact` | Destination Station | Contact / resume / hire me |

### 4.4 Arrival & Departure Sequence (per station)
1. Train decelerates as it approaches (distance-based speed curve).
2. Brake sound effect plays; horn/whistle sounds.
3. Train comes to a full stop.
4. Platform content transitions into view (station-specific layout).
5. User can interact with content (e.g., expand a project card).
6. User clicks **"NEXT STATION →"** to depart, or uses the map/skip control to jump ahead.

### 4.5 Returning Visitor / Skip Flow
- A "Explore Journey" / station map option is always available, allowing direct navigation to any station without the full cinematic traversal.
- Journey state (last visited station) can optionally persist in-session so a returning visitor within the same session doesn't have to replay the full intro.

---

## 5. Functional Requirements

### 5.1 Landing / Boarding Screen
- FR-1: Landing screen displays a railway-header identity block: "🚉 INDIAN RAILWAYS", a boxed CTA "BOARD DEEPAK EXPRESS", platform label "Platform 01", and route line "Gorakhpur → Software Engineer".
- FR-2: Landing screen shall also expose a secondary, non-cinematic path: **"Explore Journey"**, listing the station sequence (Education → Experience → Projects → Skills → Contact) as direct-jump links for time-constrained visitors.
- FR-3: The "BOARD DEEPAK EXPRESS" click is the single required user gesture that both (a) starts the journey state machine and (b) initializes the Howler.js audio context (browsers block autoplay before a gesture).

### 5.2 Boarding Sequence (exact beat sequence)
- FR-4: On boarding, the following sequence shall play in order: screen shake (subtle) → lights turn on → train whistle sound → train begins moving → camera follows train → station markers appear along the track.
- FR-5: A persistent overview strip shall render above the track showing all platforms at a glance, e.g.:
  ```
  Platform 01        Platform 02        Platform 03
  EDUCATION          EXPERIENCE         PROJECTS
      🏫                 💼                🚀
  ```

### 5.3 Train & Track System
- FR-6: Train shall be rendered as a componentized SVG with independently controllable parts: Engine, Cabin, Windows, Wheels, Headlight, Smoke, Couplers.
- FR-7: Individual parts shall be controllable via props, e.g.:
  ```tsx
  <Train
    engineLight={isNight}
    smoke={trainMoving}
    wheelsRotating={trainMoving}
  />
  ```
- FR-8: Wheels shall visually rotate only while the train is moving (`wheelsRotating === trainMoving`), e.g. conceptually:
  ```
          🚂
        ┌──────┐
  ──────┤      ├──────────────
        O      O
        ↻      ↻
  ════════════════════════════
  ```
- FR-9: The train's screen position stays fixed (roughly centered); the **world/track moves relative to the train** rather than the train moving across the literal page. Internally this is modeled as a `trainPosition` value with the world offset by `-trainPosition`:
  ```
  TRAIN
    🚂
     ↓ stays around here
  ──────────────────────────────
  WORLD MOVES →
        Station 1        Station 2        Station 3
  ```

### 5.4 Cinematic Camera
- FR-10: Camera shall reposition at each phase of travel:
  - **Start:** camera framed tight on the train (`🚂` centered, track visible ahead).
  - **Departure:** camera pulls backward as the train begins moving.
  - **Approach:** camera pans laterally toward the incoming station/platform.
  - **Arrival:** camera zooms in toward the platform as the station name appears (e.g., "🚉 EDUCATION JUNCTION").
- FR-11: Camera transitions shall be implemented as GSAP timelines, e.g.:
  ```js
  const tl = gsap.timeline();
  tl
    .to(train, { x: 300, duration: 2, ease: "power2.in" })   // depart
    .to(train, { x: 900, duration: 5, ease: "none" })         // constant travel
    .to(train, { x: 1100, duration: 2, ease: "power2.out" }); // arrival
  ```

### 5.5 Departure Motion Sequence (exact timing)
- FR-12: Departure shall follow this timed beat sequence:
  | Time | Beat |
  |---|---|
  | 0.0s | Train stopped |
  | 1.0s | Small vibration |
  | 1.5s | Wheels start rotating |
  | 2.0s | Steam/smoke appears |
  | 2.5s | Train accelerates |
  | 3.0s+ | Constant travel speed |

### 5.6 Arrival Motion Sequence (distance-based deceleration)
- FR-13: Arrival braking shall scale train speed to distance-from-station, using this curve as the reference table:
  | Distance from station | Behavior |
  |---|---|
  | 500px | Normal speed |
  | 300px | Slow down |
  | 150px | Brake |
  | 50px | Very slow |
  | 0px | Full stop |
- FR-14: On full stop: brake sound plays → horn/whistle plays → station name/board fades in → platform content transitions into view.

### 5.7 Audio System
- FR-15: Audio layers (via Howler.js): `ambient.mp3`, `train_engine.mp3`, `rail_clicks.mp3`, `horn.mp3`, `brake.mp3`, `station_announcement.mp3`, `door.mp3`.
- FR-16: Departure audio order: door/click sound → engine sound → rail-clack sound → whistle → continuous train-moving loop.
- FR-17: Arrival audio order: engine volume fades down → rail sound fades down → brake sound → horn → station ambience loop.
- FR-18: A station announcement voice/text cue plays on arrival, e.g.: *"Attention please. Deepak Express arriving at Platform 3."*
- FR-19: No audio shall autoplay before the boarding gesture (see FR-3). A persistent mute/volume toggle is available at all times, independent of journey state.

### 5.8 Station Content Modules
- FR-20: Each station renders a dedicated component (`EducationStation`, `ExperienceStation`, `ProjectsStation`, `SkillsStation`, `ContactStation`) driven by a shared `Station` wrapper, e.g.:
  ```tsx
  <Station type="education">
    <Education />
  </Station>
  ```
- FR-21: **Education station** renders as a station-board mockup, e.g.:
  ```
  ┌────────────────────────────────────┐
  │      IIIT NAGPUR CENTRAL           │
  │                                    │
  │      B.Tech ECE                    │
  │      2022 ── 2026                  │
  │                                    │
  │      CGPA: 8.43                    │
  └────────────────────────────────────┘
  ```
- FR-22: **Experience station** renders as a live arrivals/departures board, e.g.:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ARRIVALS / DEPARTURES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASHWAM
  Software Developer
  2026 → Present
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```
- FR-23: **Projects station** renders as a "Projects Terminal" with project cards laid out like platform bays, e.g.:
  ```
                PROJECTS TERMINAL
       ┌─────────┐    ┌─────────┐
       │ LLD     │    │ Route2  │
       │ Canvas  │    │ Hire    │
       └─────────┘    └─────────┘
  ```
  Clicking a project card expands the corresponding "platform" in place (title, description, stack, live link, GitHub link).
- FR-24: Content shall be fully data-driven via a `stations.ts` config so copy/content can be updated without touching animation or layout code.

### 5.9 Environment & Atmosphere per Station
- FR-25: Background environment (skyline, ambient elements) changes by station to reflect career progression:
  | Station | Environment motif |
  |---|---|
  | Education | ☀️ daylight, 🏫 school buildings, 🌳 trees |
  | Experience | 🏢 office towers, 🌆 city skyline |
  | Projects | 💻 monitors, ⚡ energy/light accents, 🖥️ workstation silhouettes, 🚀 launch motif |
  | Contact | 🌅 sunrise / 🌇 sunset, 🚉 final station silhouette |

### 5.10 Day/Night Cycle
- FR-26: A day/night lighting cycle runs across the full journey, tied to station order:
  | Station | Time of day |
  |---|---|
  | Education | ☀️ Day |
  | Experience | 🌤️ Evening |
  | Projects | 🌆 Sunset |
  | Skills | 🌙 Night |
  | Contact | 🌅 Sunrise |
- FR-27: Lighting is driven via CSS custom properties animated by GSAP: `--sky-color`, `--building-opacity`, `--light-intensity`, `--cloud-opacity`.
- FR-28: During night segments, building windows illuminate as small lit rectangles and the train's headlight visually activates, e.g.:
  ```
  🏢      🏢
   ▪️      ▪️
   ▪️      ▪️
  ━━━━━━━━━━━━━━━━━━
         🚂💡
  ```

### 5.11 Interactive Train Window ("Cabin View")
- FR-29: Clicking a window on the train triggers a **"View from cabin"** transition where the camera moves inside the train.
- FR-30: The interior cabin view serves as the hero/intro section, displaying an in-cabin card, e.g.:
  ```
  ┌──────────────────────────────┐
  │       DEEPAK EXPRESS         │
  │                               │
  │  Software Engineer            │
  │                               │
  │  Building scalable products   │
  └──────────────────────────────┘
  ```

### 5.12 Digital Ticket
- FR-31: On boarding, a themed digital ticket is displayed to the visitor (presentational only, not persisted server-side):
  ```
  ╔════════════════════════════╗
  ║      DEEPAK EXPRESS        ║
  ║                             ║
  ║ PASSENGER: VISITOR          ║
  ║ FROM: INTERNET               ║
  ║ TO: SOFTWARE ENGINEER        ║
  ║                             ║
  ║ COACH: PORTFOLIO             ║
  ╚════════════════════════════╝
  ```
- FR-32: Train identity elements are shown consistently across the UI: Train number `DX-2026`, Destination `SOFTWARE ENGINEER`, Status indicator `● ON TIME`.

### 5.13 Railway Control Panel
- FR-33: A persistent control panel UI displays live journey status:
  ```
  ┌────────────────────────────────────┐
  │ DEEPAK EXPRESS  DX-2026            │
  │                                    │
  │ STATUS      RUNNING                │
  │ SPEED       84 km/h                │
  │ NEXT STOP   PROJECTS JUNCTION      │
  │                                    │
  │ [ BRAKE ] [ HORN ] [ MAP ]         │
  └────────────────────────────────────┘
  ```
- FR-34: **HORN** button plays the horn sound effect on demand at any time.
- FR-35: **BRAKE** button allows the visitor to manually pause/slow the journey.
- FR-36: **MAP** button opens a station map showing the full route and branch structure, allowing direct navigation to any station, e.g.:
  ```
  START ─── EDUCATION ─── EXPERIENCE
                      \
                       PROJECTS
                           \
                            SKILLS ─── CONTACT
  ```

### 5.14 Skip / Direct Navigation
- FR-37: At any point during the cinematic journey, a "Skip to [Station Name]" control is available so returning visitors (e.g., a recruiter on a third visit) don't have to wait through the full travel animation to reach a specific station.
- FR-38: The landing screen's "Explore Journey" option (FR-2) and the in-journey station map (FR-36) both serve as direct-jump entry points into any station.

### 5.15 Railway Announcements & Station Boards
- FR-39: Station arrival announcements display as on-screen text overlays synced with the audio cue (FR-18), styled like a physical railway announcement/departure board.

### 5.16 Keyboard Navigation & Accessibility
- FR-40: Keyboard navigation shall be supported (e.g., arrow keys or explicit Next/Previous controls) as an alternative to clicking "NEXT STATION →".
- FR-41: A "reduced motion" mode shall be available/detected via `prefers-reduced-motion`, replacing animated transitions with simple fades/instant section switches.
- FR-42: All interactive controls must be keyboard-operable and screen-reader labeled; station content must exist as real DOM content (not canvas-only rendering) so it remains accessible and crawlable independent of the animation layer.

### 5.17 Mobile Experience
- FR-43: Mobile is **not** a shrunken desktop experience. It uses a simplified, vertically-stacked interaction pattern, e.g.:
  ```
  ┌──────────────────────┐
  │   DEEPAK EXPRESS      │
  │                       │
  │       🚂              │
  │═══════════════════════│
  │                       │
  │  NEXT STOP            │
  │  PROJECTS             │
  │                       │
  │  [ ENTER STATION ]    │
  └──────────────────────┘
  ```
- FR-44: On mobile, full cinematic camera work, particle/smoke effects, and continuous day/night environment rendering are reduced or removed in favor of performance and clarity; the journey metaphor (train, next stop, stations) is preserved but presented as a controlled step-by-step flow rather than a continuous simulation.

### 5.18 Loading Screen
- FR-45: A themed loading screen (railway/station-departure visual motif) covers initial asset loading (SVG, audio, fonts) before the boarding screen is shown.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Initial load (landing screen) should be interactive in under ~2.5s on a standard broadband connection; animation assets lazy-loaded per station. |
| Compatibility | Latest 2 versions of Chrome, Firefox, Safari, Edge; iOS Safari and Android Chrome for mobile. |
| Accessibility | WCAG 2.1 AA where feasible for a highly animated experience; content must degrade gracefully without JS animation. |
| SEO | Core identity/content (name, role, key projects, contact) must be crawlable/indexable even though the primary UI is animation-driven (e.g., via SSR content or a fallback static summary). |
| Maintainability | All train/camera/environment/audio orchestration centralized behind a single controller abstraction (see Section 8). |
| Analytics | Basic engagement analytics (which stations are visited, skip usage, time spent) to evaluate if the format helps or hinders recruiter engagement. |

---

## 7. Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js (React, TypeScript) | App structure, routing, SSR/SEO fallback |
| Animation | GSAP | Train movement, camera transitions, easing curves |
| Graphics | SVG | Train, tracks, platforms (componentized, style-controllable) |
| Styling | CSS (custom properties) | Environment theming, lighting, textures |
| Audio | Howler.js | Layered sound effects and ambience |
| UI Overlays | Framer Motion | Menus, cards, ticket, control panel transitions |
| 3D (deferred) | Three.js | Only considered post-v1 if 2.5D experience proves insufficient |

**Explicit decision:** Do not start with Three.js. A polished 2D/2.5D experience is prioritized for scope control and can be more distinctive than a partial 3D implementation.

---

## 8. Architecture

### 8.1 Directory Structure

```
app/
├── page.tsx
├── layout.tsx
└── globals.css

components/
├── railway/
│   ├── RailwayWorld.tsx
│   ├── Train.tsx
│   ├── Track.tsx
│   ├── Platform.tsx
│   ├── Station.tsx
│   ├── RailwayLights.tsx
│   └── Environment.tsx
│
├── stations/
│   ├── EducationStation.tsx
│   ├── ExperienceStation.tsx
│   ├── ProjectsStation.tsx
│   ├── SkillsStation.tsx
│   └── ContactStation.tsx
│
├── ui/
│   ├── BoardingScreen.tsx
│   ├── StationBoard.tsx
│   ├── Ticket.tsx
│   ├── ControlPanel.tsx
│   └── Navigation.tsx
│
└── audio/
    ├── TrainAudio.ts
    └── SoundManager.ts

lib/
├── railway/
│   ├── stations.ts
│   ├── trainController.ts
│   └── animationController.ts
│
└── audio/
    └── sounds.ts
```

### 8.2 Railway Controller Abstraction
All orchestration logic (movement, camera, environment, audio, station transitions) is centralized in a single controller so UI components remain simple:

```ts
class RailwayController {
  startJourney(): void;
  accelerate(): void;
  travelToStation(stationId: string): void;
  slowDown(): void;
  arriveAtStation(stationId: string): void;
  depart(): void;
  stop(): void;
}
```

React components call high-level methods only, e.g.:
```ts
railway.travelToStation("projects");
```

### 8.3 Data Model (Station Config Example)
```ts
interface Station {
  id: string;
  name: string;
  type: "intro" | "education" | "experience" | "projects" | "skills" | "contact";
  environment: {
    timeOfDay: "day" | "evening" | "sunset" | "night" | "sunrise";
    skyColor: string;
  };
}
```

---

## 9. Visual & Audio Design Direction

### 9.1 Visual Style
Cinematic + stylized + realistic motion — not hyper-realistic 3D. Aesthetic blend of:
- Indian railway visual language (station boards, retro railway typography)
- Modern SaaS UI cleanliness
- Cinematic game-intro pacing

**Palette:** Cream/off-white, deep green, railway red, black, warm yellow lights, metallic grey.

**Effects (used subtly, applied across Phase 5 polish):** film grain, motion blur, depth of field, shadows, light bloom, particles, steam, environmental ambience.

### 9.2 Audio Direction
Layered, diegetic sound design: ambient bed → engine loop → rail clack → horn/whistle on transitions → brake sound and station announcement on arrival. Sound reinforces pacing rather than being decorative.

---

## 10. Success Metrics

| Metric | Target / Purpose |
|---|---|
| Time-to-first-meaningful-content | Recruiter can reach any station's core info within 2 clicks via skip/map |
| Bounce rate on landing | Track drop-off before "Board" click; iterate on landing copy/CTA if high |
| Station completion rate | % of visitors who reach Contact station |
| Skip usage rate | Indicates whether cinematic mode is valued or seen as friction |
| Mobile completion parity | Mobile completion rate should not lag desktop by a wide margin |
| Contact conversions | Clicks on resume download / contact link / project links |

---

## 11. Implementation Phases

| Phase | Scope | Related FRs |
|---|---|---|
| Phase 1 — Railway Prototype | Train (SVG parts), track, 3 stations, basic world-relative movement | FR-6–9 |
| Phase 2 — Animation | Departure/arrival timing curves, distance-based deceleration, camera transitions, cabin-view window interaction | FR-10–14, FR-29–30 |
| Phase 3 — Sound | Engine, horn, brake, rail clack, station announcement, ambience via Howler.js | FR-15–19, FR-39 |
| Phase 4 — Portfolio Content | Education, Experience, Projects, Skills, Contact station components wired to real data via `stations.ts` | FR-20–24 |
| Phase 5 — Cinematic Polish | Day/night cycle, environment motifs per station, lighting, smoke/particles, motion blur, film grain | FR-25–28, Section 9.1 |
| Phase 6 — UX Hardening | Digital ticket, control panel (brake/horn/map), skip flow, station map, keyboard navigation, mobile version, reduced-motion mode, loading screen, analytics | FR-31–38, FR-40–45 |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Recruiters bounce before "getting" the concept | Lost opportunities | Always offer "Explore Journey" skip path on landing screen |
| Animation-heavy site hurts SEO / crawlability | Reduced discoverability | Render core content in real DOM with SSR fallback; don't rely purely on canvas/animation for text |
| Over-scoping into full 3D early | Delayed launch, wasted effort | Explicitly defer Three.js; ship 2.5D version first and evaluate |
| Audio annoyance / unexpected sound | Poor first impression | Require explicit user gesture to start audio; persistent mute control |
| Mobile performance degradation | Poor experience on majority of casual visits | Dedicated lightweight mobile flow, not a scaled-down desktop build |
| Accessibility gaps due to heavy animation | Excludes some users, potential compliance concerns | `prefers-reduced-motion` support, real DOM content, keyboard operability |

---

## 13. Open Questions
- Should returning-visitor state (last station reached) persist across sessions (localStorage) or reset every visit?
- Should the "ticket" or journey progress be shareable (e.g., a link that drops a visitor at a specific station)?
- Do we need real backend/analytics infrastructure for Section 10 metrics, or is a lightweight client-side analytics tool (e.g., Plausible/Vercel Analytics) sufficient for v1?
- Should project data be hardcoded in `stations.ts` or fetched from GitHub API at build time for auto-updating project lists?

---

## 14. Appendix — Content Inventory Needed
- [ ] Education details (institution, degree, dates, CGPA, coursework highlights)
- [ ] Experience details (company, role, dates, responsibilities, impact)
- [ ] Project list (name, description, stack, live link, GitHub link, screenshots)
- [ ] Skills list grouped by category (languages, frameworks, tools)
- [ ] Resume file (PDF) for download at Contact station
- [ ] Contact links (email, GitHub, LinkedIn)