"use client";

import { createSynthSounds, destroySynthCtx, warmAudioCtx } from "./synthAudio";

export { warmAudioCtx };

/*
 * SoundItem — minimal interface used by AudioManager and ControlPanel.
 * Matches the subset of the Howler `Howl` API that we actually call,
 * so both Howl objects and SynthSound objects satisfy it.
 */
export interface SoundItem {
  play():   this;
  stop():   this;
  /** Getter: returns current volume.  Setter: sets volume, returns this. */
  volume(v?: number): this | number;
  /** duration in milliseconds (same as Howler) */
  fade(from: number, to: number, duration: number): this;
  mute(muted: boolean): this;
  unload(): void;
}

export interface SoundLayer {
  ambient:      SoundItem;
  engine:       SoundItem;
  railClicks:   SoundItem;
  horn:         SoundItem;
  brake:        SoundItem;
  announcement: SoundItem;
  door:         SoundItem;
}

let sounds: SoundLayer | null = null;

/**
 * Initialise the sound layer after the first user gesture.
 * Uses the Web Audio API synthesiser so no external audio files are needed.
 * Safe to call multiple times — returns the singleton on subsequent calls.
 */
export function initSounds(): SoundLayer {
  if (sounds) return sounds;
  sounds = createSynthSounds();
  return sounds;
}

/**
 * Returns the active sound layer, or null if not yet initialised.
 */
export function getSounds(): SoundLayer | null {
  return sounds;
}

/**
 * Stop all sounds and tear down the AudioContext.
 */
export function destroySounds(): void {
  if (!sounds) return;
  Object.values(sounds).forEach((s) => {
    s.stop();
    s.unload();
  });
  sounds = null;
  destroySynthCtx();
}
