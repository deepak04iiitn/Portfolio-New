import type {
  StationConfig,
  EducationData,
  ExperienceEntry,
  ProjectEntry,
  SkillsData,
  ContactData,
  StationId,
} from "./types";

/* ─── World layout constant ─────────────────────────────────── */
export const STATION_SPACING = 1800; // px between station centers in world space

/* ─── Station sequence ───────────────────────────────────────── */
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

/* ─── Lookup helpers ─────────────────────────────────────────── */
export const getStation = (id: StationId): StationConfig | null =>
  STATIONS.find((s) => s.id === id) ?? null;

export const getNextStation = (currentId: StationId): StationConfig | null => {
  const current = STATIONS.find((s) => s.id === currentId);
  if (!current) return null;
  return STATIONS.find((s) => s.order === current.order + 1) ?? null;
};

export const isLastStation = (id: StationId): boolean =>
  STATIONS[STATIONS.length - 1].id === id;

/* ─── Personal content data ──────────────────────────────────── */

export const EDUCATION_DATA: EducationData = {
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

export const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    company: "Ashwam",
    role: "Software Developer",
    period: "2026 → Present",
    location: "Remote",
    responsibilities: [
      "Building scalable backend services with Node.js and TypeScript",
      "Frontend development with React, Next.js, and Tailwind CSS",
      "System design, architecture decisions, and code reviews",
    ],
    status: "ACTIVE",
  },
];

export const PROJECTS_DATA: ProjectEntry[] = [
  {
    id: "lld-canvas",
    name: "LLD Canvas",
    description:
      "A collaborative low-level design whiteboard with real-time multiplayer, UML diagramming, and export to PNG/SVG.",
    stack: ["Next.js", "TypeScript", "WebSocket", "Canvas API"],
    liveUrl: "#",
    githubUrl: "#",
    status: "LIVE",
  },
  {
    id: "route2hire",
    name: "Route2Hire",
    description:
      "Job application tracker with Kanban board, interview stage pipeline, and integrated company research tools.",
    stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
    status: "LIVE",
  },
];

export const SKILLS_DATA: SkillsData = {
  languages: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  frameworks: ["Next.js", "React", "Node.js", "Express", "Prisma"],
  tools: ["Git", "Docker", "PostgreSQL", "Redis", "Vercel", "Linux"],
  concepts: ["System Design", "REST APIs", "WebSockets", "Data Structures", "CI/CD"],
};

export const CONTACT_DATA: ContactData = {
  email: "deepak@example.com",
  github: "https://github.com/deepak",
  linkedin: "https://linkedin.com/in/deepak",
  resumeUrl: "/resume-deepak.pdf",
};
