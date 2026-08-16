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
    name: "LLDCanvas",
    tagline: "LLD Interview Prep Platform",
    highlights: [
      "Full-stack React Flow UML editor with text-to-UML, all 23 GoF design patterns, multi-format export, blog, and admin dashboard.",
      "Real-time collaboration via Socket.io — live cursors, JWT auth, role-based access, and a multi-language code execution sandbox across 12 compilers.",
      "Razorpay subscription billing (Free / Pro / Ultimate) with webhook-driven plan enforcement across all platform features.",
    ],
    stack: ["Next.js", "React.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "Socket.io", "Firebase"],
    liveUrl: "https://www.lldcanvas.in/",
    githubUrl: "https://github.com/deepak04iiitn/LLDCanvas",
    status: "LIVE",
  },
  {
    id: "route2hire",
    name: "Route2Hire",
    tagline: "One-Stop Platform for QA / SDET Professionals",
    highlights: [
      "Grew to 1,600+ active users and a 3,500+ member community — consolidating job listings, interview experiences, salary structures, roadmaps, and a QA/SDET DSA sheet with a LeetCode-style compiler and leaderboard.",
      "90+ core APIs crafted; job load time cut from ~15 s to 2 s. Razorpay subscription billing with daily premium email digest.",
      "Resume builder, coding sandbox with 50 test cases per problem, 70+ active leaderboard participants, and full end-to-end performance optimization.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Framer Motion", "Redux", "Firebase"],
    liveUrl: "https://route2hire.com/",
    githubUrl: "https://github.com/deepak04iiitn/Route2Hire",
    status: "LIVE",
  },
  {
    id: "askbro",
    name: "AskBro",
    tagline: "Team Knowledge Assistant — RAG-Powered",
    highlights: [
      "RAG application for teams to query private knowledge bases in plain English — supports PDF, Word, Markdown uploads, GitHub repo ingestion, and Notion page sync, with every answer citing the exact source.",
      "Hybrid search pipeline: BGE-large-en-v1.5 dense embeddings in Qdrant + BM25 keyword search, cross-encoder re-ranking, and per-workspace metadata filtering for high retrieval precision.",
      "Multi-tenant workspaces with JWT auth, bcrypt, and invite-code access. SSE token streaming via Qwen3-32B; Celery handles long ingestion jobs asynchronously so the UI stays responsive.",
    ],
    stack: ["Next.js 16", "FastAPI", "Python", "Celery", "MongoDB", "Qdrant", "BGE Embeddings", "Qwen3-32B", "SSE"],
    githubUrl: "https://github.com/deepak04iiitn/AskBro",
    status: "LIVE",
  },
  {
    id: "engazium",
    name: "Engazium",
    tagline: "Community Engagement for Micro-Creators",
    highlights: [
      "Niche squads with fair participation — creators join squads matched by niche, format, and follower range; a credit-based loop, squad-rules gate, and plan-based daily post limits (Growth / Pro / Momentum) keep engagement even and cut freeloading.",
      "Platform-safe, human engagement — content links shared and engaged with via a validated watch window (20s+); cron jobs recompute engagement scores, warn or remove low-engagement members, and clean stale posts.",
      "Full auth (email + Google), weekly growth check-ins with charts, live activity feeds, achievements, admin governance with searchable user/squad management, block/remove, audit logs, and moderated testimonials.",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "shadcn/ui", "Redux Toolkit", "Node.js", "Express 5", "MongoDB", "JWT", "Recharts"],
    liveUrl: "https://www.engazium.in/",
    githubUrl: "https://github.com/deepak04iiitn/Engazium",
    status: "LIVE",
  },
];

export const SKILLS_DATA: SkillsData = {
  languages:    ["C", "C++", "JavaScript", "TypeScript", "Python", "GitHub", "BrowserStack", "Appium"],
  frontend:     ["HTML", "CSS", "Tailwind CSS", "React.js", "Next.js", "React Native", "Redux"],
  backend:      ["Node.js", "Express.js", "REST APIs", "Webhooks", "Firebase", "MongoDB", "MySQL"],
  genai:        ["LangChain", "LangGraph", "RAG", "Vectorless RAG", "LLM Gateway", "Guardrails"],
  fundamentals: ["Data Structures & Algorithms", "DBMS", "Object-Oriented Programming", "Operating Systems"],
};

export const CONTACT_DATA: ContactData = {
  email: "deepak@example.com",
  github: "https://github.com/deepak",
  linkedin: "https://linkedin.com/in/deepak",
  resumeUrl: "/resume-deepak.pdf",
};
