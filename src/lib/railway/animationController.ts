import gsap from "gsap";

export type CameraState =
  | "tight"      // idle at platform — default view
  | "departure"  // pulling away — slight lean forward
  | "travel"     // full speed — wide stable view
  | "approach"   // nearing platform — lean toward station
  | "arrival"    // stopped at platform — focus in
  | "cabin";     // cabin view (extreme zoom, handled separately)

interface CameraPreset {
  scale: number;
  x: number;     // px translate
  y: number;     // px translate
  duration: number;
  ease: string;
}

/**
 * Subtle camera presets — all above scale 1 to avoid visible
 * edges of the scene peeking through. TransformOrigin is set
 * to the train + track area (50% 58%).
 */
const PRESETS: Record<CameraState, CameraPreset> = {
  tight:     { scale: 1.00, x:   0, y:  0, duration: 1.2, ease: "power2.out"  },
  departure: { scale: 1.01, x:  10, y:  4, duration: 1.4, ease: "power2.in"   },
  travel:    { scale: 1.00, x:   0, y:  0, duration: 2.0, ease: "power1.out"  },
  approach:  { scale: 1.02, x: -10, y: -4, duration: 1.4, ease: "power2.out"  },
  arrival:   { scale: 1.05, x: -20, y: -8, duration: 1.8, ease: "power3.out"  },
  cabin:     { scale: 1.00, x:   0, y:  0, duration: 0.5, ease: "power2.inOut"},
};

export class AnimationController {
  private currentState: CameraState = "tight";

  /**
   * Smoothly transition the camera-rig element to a new state.
   * Returns the tween so callers can chain or await.
   */
  transitionCamera(
    target: HTMLElement,
    state: CameraState,
    onComplete?: () => void,
  ): gsap.core.Tween {
    this.currentState = state;
    const p = PRESETS[state];

    return gsap.to(target, {
      scale: p.scale,
      x: p.x,
      y: p.y,
      duration: p.duration,
      ease: p.ease,
      transformOrigin: "50% 58%",
      onComplete,
    });
  }

  /**
   * Rapid lateral shake — simulates locomotive vibration on departure.
   * @param intensity  px amplitude each half-oscillation
   * @param duration   total shake duration (s)
   */
  shake(target: HTMLElement, intensity = 3, duration = 0.7): gsap.core.Tween {
    return gsap.to(target, {
      x: `+=${intensity}`,
      yoyo: true,
      repeat: Math.round(duration / 0.08),
      duration: 0.04,
      ease: "none",
    });
  }

  /**
   * Brief white-flash overlay on arrival announcement.
   */
  flashOverlay(overlayEl: HTMLElement): gsap.core.Timeline {
    return gsap
      .timeline()
      .set(overlayEl, { opacity: 0, display: "block" })
      .to(overlayEl, { opacity: 0.35, duration: 0.15 })
      .to(overlayEl, { opacity: 0, duration: 0.5, delay: 0.2 })
      .set(overlayEl, { display: "none" });
  }

  get state(): CameraState {
    return this.currentState;
  }
}
