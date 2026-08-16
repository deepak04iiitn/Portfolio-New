/**
 * generate-audio-placeholders.mjs
 *
 * Writes minimal silent WAV files into public/audio/.
 * These satisfy Howler's src lookup so the 404 errors go away
 * during development. Replace them with real recordings whenever
 * you have the actual assets.
 *
 * Usage:  node scripts/generate-audio-placeholders.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "audio");

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Build a minimal silent WAV buffer.
 * Format: PCM 16-bit mono 44100 Hz, `durationSec` seconds of silence.
 */
function silentWav(durationSec = 1) {
  const sampleRate   = 44100;
  const numChannels  = 1;
  const bitsPerSample = 16;
  const blockAlign   = (numChannels * bitsPerSample) / 8;   // 2
  const byteRate     = sampleRate * blockAlign;              // 88200
  const dataSize     = Math.round(sampleRate * durationSec) * blockAlign;
  const fileSize     = 36 + dataSize;

  const buf = Buffer.alloc(44 + dataSize, 0);

  // RIFF header
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(fileSize, 4);
  buf.write("WAVE", 8, "ascii");

  // fmt chunk
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16,            16); // chunk size
  buf.writeUInt16LE(1,             20); // PCM
  buf.writeUInt16LE(numChannels,   22);
  buf.writeUInt32LE(sampleRate,    24);
  buf.writeUInt32LE(byteRate,      28);
  buf.writeUInt16LE(blockAlign,    32);
  buf.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataSize, 40);
  // remaining bytes are already 0 (silence)

  return buf;
}

const FILES = [
  { name: "ambient.wav",              duration: 3 },   // looping — even 3 s of silence is fine
  { name: "train_engine.wav",         duration: 3 },
  { name: "rail_clicks.wav",          duration: 2 },
  { name: "horn.wav",                 duration: 1 },
  { name: "brake.wav",                duration: 1 },
  { name: "door.wav",                 duration: 1 },
  { name: "station_announcement.wav", duration: 2 },
];

for (const { name, duration } of FILES) {
  const path = join(OUT_DIR, name);
  writeFileSync(path, silentWav(duration));
  console.log(`  ✓  ${name}`);
}

console.log(`\nCreated ${FILES.length} silent placeholder WAV files in public/audio/`);
console.log("Replace them with real recordings for the full audio experience.");
