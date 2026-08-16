"use client";

/*
 * synthAudio.ts — Web Audio API train sound synthesiser.
 *
 * Generates every required railway sound programmatically using the
 * browser's AudioContext. No external files required.
 *
 * Sound design overview
 * ─────────────────────
 *  engine      Brown noise + amplitude modulation = steam chuffing
 *  railClicks  Periodic sharp noise bursts (rail-joint clickety-clack)
 *  ambient     Pink noise (station wind / background atmosphere)
 *  horn        5-partial harmonic chord (Union-Pacific-style 5-chime)
 *  brake       White noise + sweeping sine (rising squeal)
 *  door        Low-frequency thump transient (heavy carriage door)
 *  announcement  Station ding-dong bell (two-note descending)
 */

import type { SoundItem } from "./sounds";

/* ── Shared AudioContext singleton ──────────────────────────── */
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") {
    _ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  return _ctx;
}

/**
 * MUST be called directly inside a user-gesture handler (click/touch).
 *
 * Chrome / Safari require AudioContext.resume() to be called while a user
 * gesture is on the call stack. React's useEffect runs after the commit,
 * outside the gesture window, so if we wait until AudioManager's effect
 * the context starts in "suspended" state and stays there.
 *
 * Call this from BoardingScreen's onClick → the context is warm and
 * "running" by the time play() is called milliseconds later.
 */
export function warmAudioCtx(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  if (ctx.state !== "running") {
    ctx.resume().catch(() => {/* silently ignored */});
  }
}

/* ── Buffer generators ──────────────────────────────────────── */

function makeEngineBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 2.0; // 2-second loop
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);
  let last = 0;
  const puffs = 3.2; // steam chuffs per second

  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.025 * w) / 1.025; // brown noise integrator
    const t = i / sr;
    // Chuff envelope: raised cosine at puff rate
    const chuff = 0.3 + 0.7 * Math.pow(Math.max(0, Math.sin(Math.PI * puffs * t)), 2);
    // Low thump on each beat
    const thump = 0.45 * Math.exp(-8 * ((t * puffs) % 1)) *
                  Math.max(0, Math.sin(2 * Math.PI * 60 * t));
    d[i] = (last * 3.0 * chuff + thump) * 0.55;
  }
  return buf;
}

function makeRailClicksBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 1.4;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);
  // 5 irregular clicks per loop (~3.5 Hz average)
  const clickTimes = [0.0, 0.27, 0.55, 0.84, 1.12];
  const clickLen = Math.floor(sr * 0.04);

  for (const ct of clickTimes) {
    const start = Math.floor(ct * sr);
    for (let i = 0; i < clickLen && start + i < d.length; i++) {
      const env = Math.exp(-i / (sr * 0.007));
      d[start + i] = (Math.random() * 2 - 1) * env * 0.95;
    }
  }
  return buf;
}

function makeAmbientBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 4.0;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);
  // Paul Kellett pink-noise approximation
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179;
    b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520;
    b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522;
    b5 = -0.7616*b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * 0.075;
    b6 = w * 0.115926;
  }
  return buf;
}

function makeHornBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 2.0;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);
  // 5-chime train horn: Bb-major pentatonic cluster (F3 Bb3 D4 F4 Ab4)
  const partials = [
    { f: 174.61, a: 0.42 },
    { f: 233.08, a: 0.38 },
    { f: 293.66, a: 0.28 },
    { f: 349.23, a: 0.22 },
    { f: 415.30, a: 0.14 },
  ];
  const vibRate = 5.5;
  const vibDepth = 0.0028;

  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    // Envelope: 80 ms attack → hold → 350 ms decay
    const atk  = Math.min(1, t / 0.08);
    const dcy  = Math.min(1, (secs - t) / 0.35);
    const env  = Math.max(0, Math.min(atk, dcy));

    let s = 0;
    for (const { f, a } of partials) {
      const phase = 2 * Math.PI * f * t * (1 + vibDepth * Math.sin(2 * Math.PI * vibRate * t));
      s += a * Math.sin(phase);
    }
    d[i] = s * env * 0.55;
  }
  return buf;
}

function makeBrakeBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 2.4;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);

  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const p = t / secs;
    const freq  = 380 + p * 3400; // 380 Hz → 3780 Hz sweep
    const squeal = Math.sin(2 * Math.PI * freq * t) * 0.55;
    const noise  = (Math.random() * 2 - 1) * 0.30;
    // Build-up then release envelope
    const env = p < 0.25 ? p / 0.25 : Math.max(0, 1 - (p - 0.25) / 0.75);
    d[i] = (squeal + noise) * env;
  }
  return buf;
}

function makeDoorBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const secs = 0.55;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);

  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    // Heavy wooden thump: low sine + high-frequency click
    const thump = Math.sin(2 * Math.PI * 75 * t) * Math.exp(-t * 22) * 0.85;
    const click = (Math.random() * 2 - 1)         * Math.exp(-t * 55) * 0.35;
    d[i] = thump + click;
  }
  return buf;
}

function makeBellBuffer(ctx: AudioContext): AudioBuffer {
  // Station ding-dong announcement bell (E5 → D5)
  const sr = ctx.sampleRate;
  const secs = 3.0;
  const buf = ctx.createBuffer(1, Math.ceil(sr * secs), sr);
  const d = buf.getChannelData(0);
  const bells = [
    { onset: 0.0, fund: 659.25, amp: 0.65, decay: 2.8 },
    { onset: 0.9, fund: 587.33, amp: 0.55, decay: 2.2 },
  ];

  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    let s = 0;
    for (const b of bells) {
      const bt = t - b.onset;
      if (bt < 0) continue;
      const env = Math.exp(-bt * 3 / b.decay);
      // Bell timbre: fundamental + inharmonic partials
      s += b.amp * env * (
        Math.sin(2 * Math.PI * b.fund       * bt) * 0.60 +
        Math.sin(2 * Math.PI * b.fund * 2.756 * bt) * 0.20 * Math.exp(-bt * 4) +
        Math.sin(2 * Math.PI * b.fund * 5.404 * bt) * 0.10 * Math.exp(-bt * 7)
      );
    }
    d[i] = s * 0.75;
  }
  return buf;
}

/* ── SynthSound class ───────────────────────────────────────── */

class SynthSound implements SoundItem {
  private gainNode: GainNode | null = null;
  private source:   AudioBufferSourceNode | null = null;
  private _volume:  number;
  private _loop:    boolean;
  private _muted  = false;
  private _buf:   AudioBuffer | null = null;

  constructor(
    private readonly bufFactory: () => AudioBuffer,
    private readonly opts: { volume?: number; loop?: boolean },
  ) {
    this._volume = opts.volume ?? 0.5;
    this._loop   = opts.loop   ?? false;
  }

  /* Lazy-create buffer on first play */
  private buf(): AudioBuffer {
    if (!this._buf) this._buf = this.bufFactory();
    return this._buf;
  }

  play(): this {
    if (this.source) return this; // already playing
    const ctx = getCtx();

    const src = ctx.createBufferSource();
    src.buffer = this.buf();
    src.loop   = this._loop;

    const gain = ctx.createGain();
    gain.gain.value = this._muted ? 0 : this._volume;

    src.connect(gain);
    gain.connect(ctx.destination);

    /*
     * Set gainNode and source BEFORE the async resume so that fade()
     * called synchronously after play() (e.g. ambient.fade(0, 0.14, 2000))
     * can schedule its automation on the already-connected gain node.
     */
    this.gainNode = gain;
    this.source   = src;

    src.onended = () => {
      if (this.source === src) {
        this.source   = null;
        this.gainNode = null;
      }
    };

    /*
     * Resume the context THEN start the source.
     * This is safe even if the context is already "running" —
     * resume() on a running context resolves instantly.
     */
    ctx.resume()
      .then(() => { src.start(0); })
      .catch(() => { src.start(0); }); // start anyway if resume rejects

    return this;
  }

  stop(): this {
    if (this.source) {
      try { this.source.stop(0); } catch { /* already stopped */ }
      this.source  = null;
      this.gainNode = null;
    }
    return this;
  }

  /* Howl-compatible: volume() → getter, volume(v) → setter */
  volume(v?: number): this | number {
    if (v === undefined) return this._volume;
    this._volume = v;
    if (this.gainNode && !this._muted) this.gainNode.gain.value = v;
    return this;
  }

  /* duration is in milliseconds (same as Howler) */
  fade(from: number, to: number, duration: number): this {
    this._volume = to;
    if (this.gainNode) {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const sec = duration / 1000;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(from, now);
      this.gainNode.gain.linearRampToValueAtTime(this._muted ? 0 : to, now + sec);
    }
    return this;
  }

  mute(m: boolean): this {
    this._muted = m;
    if (this.gainNode) {
      this.gainNode.gain.value = m ? 0 : this._volume;
    }
    return this;
  }

  playing(): boolean { return this.source !== null; }
  unload(): void { this.stop(); this._buf = null; }
}

/* ── Public factory ─────────────────────────────────────────── */

/**
 * Create the full synth sound layer.
 * Each SynthSound is lazily initialised: buffers are generated on first
 * `.play()` call so the constructor is cheap and AudioContext-safe.
 */
export function createSynthSounds() {
  const make = (f: (ctx: AudioContext) => AudioBuffer, opts: { volume?: number; loop?: boolean }) =>
    new SynthSound(() => f(getCtx()), opts);

  return {
    ambient:      make(makeAmbientBuffer,    { loop: true,  volume: 0    }),
    engine:       make(makeEngineBuffer,     { loop: true,  volume: 0    }),
    railClicks:   make(makeRailClicksBuffer, { loop: true,  volume: 0    }),
    horn:         make(makeHornBuffer,       { loop: false, volume: 0.70 }),
    brake:        make(makeBrakeBuffer,      { loop: false, volume: 0.60 }),
    announcement: make(makeBellBuffer,       { loop: false, volume: 0.55 }),
    door:         make(makeDoorBuffer,       { loop: false, volume: 0.50 }),
  };
}

export function destroySynthCtx(): void {
  if (_ctx) {
    _ctx.close();
    _ctx = null;
  }
}
