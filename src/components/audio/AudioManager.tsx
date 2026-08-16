"use client";

import { useEffect, useRef } from "react";
import { useJourneyStore } from "@/hooks/useJourneyState";
import { initSounds, getSounds, destroySounds } from "@/lib/audio/sounds";

/**
 * AudioManager — purely behavioural, renders nothing.
 *
 * Listens to journey phase and mute state from Zustand and drives
 * all Howler sound layers accordingly. Audio is only initialised
 * after the user clicks "BOARD" (isAudioEnabled gate, FR-3 / FR-19).
 *
 * Departure audio sequence (FR-16):
 *  t=0.0s  door close
 *  t=0.4s  engine starts → fades to 0.4
 *  t=0.9s  rail clicks start → fades to 0.3
 *  t=2.0s  horn blast
 *
 * Approach audio sequence (FR-17):
 *  phase APPROACHING → engine + rail clicks fade down
 *
 * Arrival audio sequence (FR-17):
 *  phase ARRIVING → brake squeal → horn → announcement
 *
 * Stopped:
 *  engine + rail clicks fade to silence
 */
export default function AudioManager() {
  const { phase, isAudioEnabled, isMuted } = useJourneyStore();
  const initialised = useRef(false);
  const departureTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const arrivalTimers   = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── Cleanup on unmount ───────────────────────────────────── */
  useEffect(() => {
    return () => {
      [...departureTimers.current, ...arrivalTimers.current].forEach(clearTimeout);
      destroySounds();
    };
  }, []);

  /* ── Initialise sounds after first user gesture ─────────────
     Howler requires a user interaction before AudioContext can
     resume on Chrome / Safari. The BoardingScreen "BOARD" button
     sets isAudioEnabled, which this effect watches.
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isAudioEnabled || initialised.current) return;
    initialised.current = true;

    const s = initSounds();
    /* Fade ambient in gently over 2s */
    s.ambient.play();
    s.ambient.fade(0, 0.14, 2000);
  }, [isAudioEnabled]);

  /* ── Sync global mute ─────────────────────────────────────── */
  useEffect(() => {
    const s = getSounds();
    if (!s) return;
    Object.values(s).forEach((h) => h.mute(isMuted));
  }, [isMuted]);

  /* ── Phase-based audio sequencing ───────────────────────────
     Each case mirrors one segment of the visual sequence in
     useTrainController so audio and animation feel locked together.
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const s = getSounds();
    if (!s || !isAudioEnabled) return;

    const clearDeparture = () =>
      departureTimers.current.forEach(clearTimeout);
    const clearArrival = () =>
      arrivalTimers.current.forEach(clearTimeout);

    switch (phase) {
      /* ── Departure beat sequence (mirrors t-values in trainController) */
      case "DEPARTING": {
        clearDeparture();
        const ts: ReturnType<typeof setTimeout>[] = [];

        // t=0ms: door close
        ts.push(setTimeout(() => s.door.play(), 0));

        // t=400ms: engine starts, fades up to 0.38 over 1.5s
        ts.push(
          setTimeout(() => {
            s.engine.volume(0);
            s.engine.play();
            s.engine.fade(0, 0.38, 1500);
          }, 400),
        );

        // t=900ms: rail clicks layer in
        ts.push(
          setTimeout(() => {
            s.railClicks.volume(0);
            s.railClicks.play();
            s.railClicks.fade(0, 0.28, 1000);
          }, 900),
        );

        // t=2200ms: horn blast as train reaches full speed
        ts.push(setTimeout(() => s.horn.play(), 2200));

        departureTimers.current = ts;
        break;
      }

      /* ── Approaching — taper engine and clicks ─────────────── */
      case "APPROACHING_STATION":
        clearDeparture();
        s.engine.fade(s.engine.volume() as number, 0.12, 2200);
        s.railClicks.fade(s.railClicks.volume() as number, 0.04, 2200);
        break;

      /* ── Arriving — brake + horn + announcement ─────────────── */
      case "ARRIVING": {
        clearArrival();
        const ts: ReturnType<typeof setTimeout>[] = [];

        ts.push(setTimeout(() => s.brake.play(), 0));
        ts.push(setTimeout(() => s.horn.play(), 900));
        ts.push(setTimeout(() => s.announcement.play(), 1800));

        arrivalTimers.current = ts;
        break;
      }

      /* ── Stopped — silence loops ─────────────────────────────── */
      case "STOPPED":
        clearArrival();
        s.engine.fade(s.engine.volume() as number, 0, 1000);
        s.railClicks.fade(s.railClicks.volume() as number, 0, 800);
        break;

      /* ── Idle / Boarding — fully stop loops ─────────────────── */
      case "IDLE":
        s.engine.stop();
        s.railClicks.stop();
        break;

      default:
        break;
    }
  }, [phase, isAudioEnabled]);

  return null;
}
