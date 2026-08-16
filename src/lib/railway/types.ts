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
  | "socials"
  | "contact";

export type TimeOfDay = "day" | "evening" | "sunset" | "night" | "sunrise";

export type StationContentType =
  | "welcome"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "socials"
  | "contact";

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

export interface StationContent {
  type: StationContentType;
  data: Record<string, unknown>;
}

export interface StationConfig {
  id: StationId;
  order: number;
  displayName: string;
  platformLabel: string;
  environment: EnvironmentState;
  content: StationContent;
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

export interface JourneyStore {
  phase: JourneyPhase;
  trainState: TrainState;
  currentStationIndex: number;
  isAudioEnabled: boolean;
  isMuted: boolean;
  isMapOpen: boolean;
  isTicketVisible: boolean;

  setPhase: (phase: JourneyPhase) => void;
  setTrainState: (partial: Partial<TrainState>) => void;
  advanceStation: () => void;
  jumpToStation: (id: StationId) => void;
  toggleMute: () => void;
  enableAudio: () => void;
  setMapOpen: (open: boolean) => void;
  setTicketVisible: (visible: boolean) => void;
}

/* ─── Content data types ─────────────────────────────────────── */

export interface EducationData {
  institution: string;
  institutionFull: string;
  degree: string;
  period: string;
  cgpa: string;
  highlights: string[];
}

export interface RoleStep {
  role: string;
  period: string;
  tag?: string;
}

export interface ExperienceEntry {
  company: string;
  companyFull?: string;
  role: string;
  period: string;
  location: string;
  stack: string[];
  responsibilities: string[];
  status: "ACTIVE" | "COMPLETED";
  roleProgression?: RoleStep[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  githubUrl: string;
  status: "LIVE" | "WIP" | "ARCHIVED";
}

export interface SkillsData {
  languages:    string[];
  frontend:     string[];
  backend:      string[];
  genai:        string[];
  fundamentals: string[];
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  gfg: string;
  leetcode: string;
  resumeUrl: string;
}
