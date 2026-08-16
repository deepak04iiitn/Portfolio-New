"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoaded: () => void;
}

const STEPS = [
  { to: 18,  label: "LOADING TRACK DATA..." },
  { to: 40,  label: "CALIBRATING ENGINE..." },
  { to: 65,  label: "LOADING AUDIO SYSTEMS..." },
  { to: 86,  label: "PREPARING PLATFORMS..." },
  { to: 100, label: "ALL SYSTEMS GO." },
];

/**
 * LoadingScreen — shown during phase === "LOADING".
 * Runs a stepped fake-progress bar, then fires `onLoaded()` 600ms after
 * reaching 100% so the user sees the complete bar briefly before the
 * boarding screen fades in.
 */
export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALISING SYSTEMS...");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= STEPS.length) {
        clearInterval(interval);
        setTimeout(onLoaded, 650);
        return;
      }
      setProgress(STEPS[i].to);
      setStatus(STEPS[i].label);
      i++;
    }, 500);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "#060A06",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Diagonal texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.005) 40px, rgba(255,255,255,0.005) 41px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo block */}
      <div style={{ marginBottom: 48, textAlign: "center", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 5vw, 36px)",
            fontWeight: 700,
            color: "#F4C430",
            letterSpacing: "6px",
            marginBottom: 6,
          }}
        >
          DEEPAK EXPRESS
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontSize: 9,
            color: "#2A3A2A",
            letterSpacing: "5px",
          }}
        >
          DX-2026 · PORTFOLIO RAILWAY
        </motion.div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 280,
          height: 2,
          background: "rgba(244,196,48,0.08)",
          borderRadius: 1,
          overflow: "hidden",
          marginBottom: 16,
          position: "relative",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "#F4C430",
            boxShadow: "0 0 8px rgba(244,196,48,0.6)",
            transformOrigin: "left",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Status text */}
      <motion.div
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          fontSize: 8,
          color: "#3A4A3A",
          letterSpacing: "3px",
        }}
      >
        {status}
      </motion.div>

      {/* Track dots decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: i % 2 === 0 ? 12 : 6,
              height: 2,
              background: "rgba(244,196,48,0.12)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
