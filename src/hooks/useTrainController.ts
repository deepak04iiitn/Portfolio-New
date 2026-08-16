"use client";

import { useRef, useState, useCallback } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useJourneyStore } from "./useJourneyState";
import { STATIONS, STATION_SPACING } from "@/lib/railway/stations";
import { AnimationController } from "@/lib/railway/animationController";

/* ── Absolute timeline timestamps (seconds) ─────────────────────
   These drive every departure beat. Adjust here to tune the feel.
   ────────────────────────────────────────────────────────────── */
const T = {
  VIBRATE:        0.0,
  WHEELS_START:   0.6,
  SMOKE_ON:       1.1,
  SPEED_RAMP_UP:  1.8,
  CAM_TRAVEL:     2.2,
  WORLD_ACCEL:    2.5,   // world starts moving (30% of distance, 2s)
  WORLD_CONST:    4.5,   // constant speed (45% of distance, 2s) + advanceStation
  APPROACH:       6.5,   // approaching phase starts
  DECEL_1:        6.5,   // seg 1 — 10% distance, 1.2s
  DECEL_2:        7.7,   // seg 2 — 7.5% distance, 1.0s
  DECEL_3:        8.7,   // seg 3 — 5.0% distance, 0.9s
  DECEL_4:        9.6,   // seg 4 — 2.5% distance, 1.0s
  SNAP:          10.6,   // final snap to exact position, 0.4s
};

export function useTrainController(
  worldRef:  RefObject<HTMLDivElement | null>,
  trainRef:  RefObject<HTMLDivElement | null>,
  cameraRef: RefObject<HTMLDivElement | null>,
) {
  const store = useJourneyStore();
  const tlRef   = useRef<gsap.core.Timeline | null>(null);
  const animCtrl = useRef(new AnimationController());
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Full cinematic departure → travel → arrival sequence.
   * @param nextStationIndex  Zustand index to travel to (current + 1).
   */
  const depart = useCallback(
    (nextStationIndex: number) => {
      const world  = worldRef.current;
      const train  = trainRef.current;
      const camera = cameraRef.current;

      if (!world || !train || !camera) return;
      if (isAnimating) return;
      if (nextStationIndex >= STATIONS.length) return;

      const { setPhase, setTrainState, advanceStation } = store;

      /* Target world-x for next station (negative = left pan) */
      const targetX   = -(nextStationIndex * STATION_SPACING);
      const currentX  = (gsap.getProperty(world, "x") as number) || 0;
      const totalDist = targetX - currentX; // always negative

      setIsAnimating(true);
      setPhase("DEPARTING");

      tlRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });
      tlRef.current = tl;

      /* ── Camera — departure lean ────────────────────────────── */
      animCtrl.current.transitionCamera(camera, "departure");

      /* ── t=0.0s: locomotive vibration ──────────────────────── */
      tl.to(
        train,
        { x: "+=3", yoyo: true, repeat: 9, duration: 0.05, ease: "none" },
        T.VIBRATE,
      );

      /* ── t=0.6s: wheels start rotating ─────────────────────── */
      tl.add(() => {
        setTrainState({ wheelsRotating: true });
      }, T.WHEELS_START);

      /* ── t=1.1s: smoke billows + headlight on ───────────────── */
      tl.add(() => {
        setTrainState({ smokeActive: true, isMoving: true, headlightOn: true });
      }, T.SMOKE_ON);

      /* ── t=1.8s: speed counter starts climbing ──────────────── */
      tl.add(() => {
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: 84,
          duration: 4.5,
          ease: "power2.in",
          onUpdate() {
            setTrainState({ speed: Math.round(proxy.v) });
          },
        });
      }, T.SPEED_RAMP_UP);

      /* ── t=2.2s: camera widens to travel state ──────────────── */
      tl.add(() => {
        animCtrl.current.transitionCamera(camera, "travel");
      }, T.CAM_TRAVEL);

      /* ── t=2.5s: world acceleration phase (30% distance) ────── */
      tl.to(
        world,
        { x: `+=${totalDist * 0.30}`, duration: 2.0, ease: "power3.in" },
        T.WORLD_ACCEL,
      );

      /* ── t=4.5s: constant speed (45%) + advance station ─────── */
      tl.to(
        world,
        {
          x: `+=${totalDist * 0.45}`,
          duration: 2.0,
          ease: "none",
          onStart() {
            /* Advance now so environment starts blending at full speed */
            advanceStation();
          },
        },
        T.WORLD_CONST,
      );

      /* ── t=6.5s: approaching — camera and speed drop ─────────── */
      tl.add(() => {
        setPhase("APPROACHING_STATION");
        animCtrl.current.transitionCamera(camera, "approach");
        /* Speed counter descends in parallel */
        const proxy = { v: 84 };
        gsap.to(proxy, {
          v: 0,
          duration: 4.0,
          ease: "power3.out",
          onUpdate() {
            setTrainState({ speed: Math.round(proxy.v) });
          },
        });
      }, T.APPROACH);

      /* ── Deceleration segments (25% of distance total) ──────── */
      /* Seg 1: 10%, power1.out */
      tl.to(
        world,
        { x: `+=${totalDist * 0.10}`, duration: 1.2, ease: "power1.out" },
        T.DECEL_1,
      );
      /* Seg 2: 7.5%, power2.out */
      tl.to(
        world,
        { x: `+=${totalDist * 0.075}`, duration: 1.0, ease: "power2.out" },
        T.DECEL_2,
      );
      /* Seg 3: 5%, power3.out — smoke cuts */
      tl.to(
        world,
        {
          x: `+=${totalDist * 0.05}`,
          duration: 0.9,
          ease: "power3.out",
          onStart() {
            setTrainState({ smokeActive: false });
          },
        },
        T.DECEL_3,
      );
      /* Seg 4: 2.5%, power4.out — final crawl */
      tl.to(
        world,
        { x: `+=${totalDist * 0.025}`, duration: 1.0, ease: "power4.out" },
        T.DECEL_4,
      );

      /* ── t=10.6s: snap exactly to platform + arrive ─────────── */
      tl.to(
        world,
        {
          x: targetX,
          duration: 0.4,
          ease: "power2.out",
          onStart() {
            setTrainState({ wheelsRotating: false, speed: 0, isMoving: false });
            setPhase("ARRIVING");
            animCtrl.current.transitionCamera(camera, "arrival");
          },
          onComplete() {
            setPhase("STOPPED");
            /* After brief pause, return camera to neutral */
            gsap.delayedCall(0.9, () => {
              animCtrl.current.transitionCamera(camera, "tight");
            });
          },
        },
        T.SNAP,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAnimating],
  );

  /**
   * Immediately halt any in-flight journey sequence.
   */
  const kill = useCallback(() => {
    tlRef.current?.kill();
    setIsAnimating(false);
  }, []);

  return { depart, isAnimating, kill, animCtrl: animCtrl.current };
}
