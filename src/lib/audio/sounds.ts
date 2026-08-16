import { Howl } from "howler";

export interface SoundLayer {
  ambient:      Howl;
  engine:       Howl;
  railClicks:   Howl;
  horn:         Howl;
  brake:        Howl;
  announcement: Howl;
  door:         Howl;
}

let sounds: SoundLayer | null = null;

/**
 * Build a Howl instance with graceful error handling.
 * Missing audio files are silently ignored — the UI works
 * fully without them; audio simply won't play.
 */
function makeSound(config: {
  src: string[];
  loop?: boolean;
  volume?: number;
  preload?: boolean;
}): Howl {
  return new Howl({
    src: config.src,
    loop: config.loop ?? false,
    volume: config.volume ?? 0.5,
    preload: config.preload ?? true,
    html5: false,
    onloaderror: (_id: number, err: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Audio] Failed to load:", config.src[0], err);
      }
    },
    onplayerror: (_id: number, err: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Audio] Play error:", config.src[0], err);
      }
    },
  });
}

/**
 * Initialise all sound layers after a user gesture (FR-3 / FR-19).
 * Safe to call multiple times — returns the singleton on subsequent calls.
 */
export function initSounds(): SoundLayer {
  if (sounds) return sounds;

  sounds = {
    /** Soft station ambience — birds, distant wind — continuous loop */
    ambient: makeSound({
      src: ["/audio/ambient.mp3", "/audio/ambient.webm"],
      loop: true,
      volume: 0,       // fades in to 0.15 after init
      preload: true,
    }),

    /** Steam / diesel engine rumble — fades in/out with speed */
    engine: makeSound({
      src: ["/audio/train_engine.mp3", "/audio/train_engine.webm"],
      loop: true,
      volume: 0,       // brought up on departure
      preload: true,
    }),

    /** Track tie rhythm — layered under engine during travel */
    railClicks: makeSound({
      src: ["/audio/rail_clicks.mp3", "/audio/rail_clicks.webm"],
      loop: true,
      volume: 0,
      preload: true,
    }),

    /** Train whistle / horn — one shot, played at departure + arrival */
    horn: makeSound({
      src: ["/audio/horn.mp3", "/audio/horn.webm"],
      loop: false,
      volume: 0.7,
      preload: true,
    }),

    /** Brake squeal — played as train decelerates to a stop */
    brake: makeSound({
      src: ["/audio/brake.mp3", "/audio/brake.webm"],
      loop: false,
      volume: 0.6,
      preload: true,
    }),

    /** Station arrival announcement — played after stop */
    announcement: makeSound({
      src: ["/audio/station_announcement.mp3", "/audio/station_announcement.webm"],
      loop: false,
      volume: 0.55,
      preload: false,  // lazy-loaded; not needed until first arrival
    }),

    /** Door close clunk — kicked off at departure start */
    door: makeSound({
      src: ["/audio/door.mp3", "/audio/door.webm"],
      loop: false,
      volume: 0.5,
      preload: true,
    }),
  };

  return sounds;
}

/**
 * Returns the active sound layer, or null if not yet initialised.
 * Use this in reactive effects that run after initSounds().
 */
export function getSounds(): SoundLayer | null {
  return sounds;
}

/**
 * Immediately stop and unload all sounds.
 * Called on unmount / page navigation cleanup.
 */
export function destroySounds(): void {
  if (!sounds) return;
  Object.values(sounds).forEach((s) => {
    s.stop();
    s.unload();
  });
  sounds = null;
}
