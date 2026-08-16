"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  decay: number;
  color: string;
}

export type ParticleType = "smoke" | "steam" | "spark";

interface ParticleSystemProps {
  /** Whether the emitter is currently active */
  active: boolean;
  type: ParticleType;
  /**
   * Pixel coordinates of the emission point, relative to the canvas
   * top-left corner (which is positioned by the parent).
   */
  originX: number;
  originY: number;
  /** Canvas width in pixels */
  width?: number;
  /** Canvas height in pixels */
  height?: number;
}

function makeParticle(
  type: ParticleType,
  originX: number,
  originY: number,
): Particle {
  const configs = {
    smoke: {
      vx: (Math.random() - 0.5) * 0.9,
      vy: -(Math.random() * 1.1 + 0.5),
      radius: Math.random() * 14 + 7,
      decay: Math.random() * 0.005 + 0.003,
      color: `rgba(${100 + Math.random() * 55}, ${100 + Math.random() * 55}, ${95 + Math.random() * 55}`,
    },
    steam: {
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.9 + 0.3),
      radius: Math.random() * 9 + 5,
      decay: Math.random() * 0.009 + 0.004,
      color: `rgba(220, 220, 215`,
    },
    spark: {
      vx: (Math.random() - 0.5) * 3.2,
      vy: -(Math.random() * 2.2 + 1.0),
      radius: Math.random() * 2 + 0.8,
      decay: Math.random() * 0.04 + 0.02,
      color: `rgba(244, 196, 48`,
    },
  };

  const cfg = configs[type];
  return {
    x: originX + (Math.random() - 0.5) * 12,
    y: originY,
    vx: cfg.vx,
    vy: cfg.vy,
    radius: cfg.radius,
    opacity: 0.55 + Math.random() * 0.3,
    decay: cfg.decay,
    color: cfg.color,
  };
}

/**
 * ParticleSystem — lightweight canvas-based emitter for smoke, steam,
 * and sparks. Positioned absolutely inside the parent container so
 * it can overflow the container bounds upward.
 *
 * Mount inside `#train-container` with appropriate offset:
 *
 *   <ParticleSystem
 *     active={trainState.smokeActive}
 *     type="smoke"
 *     originX={43}     // x of chimney relative to canvas left edge
 *     originY={155}    // y ≈ near-bottom of canvas (= chimney top)
 *   />
 */
export default function ParticleSystem({
  active,
  type,
  originX,
  originY,
  width = 150,
  height = 180,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const emitRate = type === "smoke" ? 0.28 : type === "steam" ? 0.5 : 0.75;
    const batchSize = type === "spark" ? 3 : 1;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && Math.random() < emitRate) {
        for (let i = 0; i < batchSize; i++) {
          particlesRef.current.push(makeParticle(type, originX, originY));
        }
      }

      particlesRef.current = particlesRef.current.filter(
        (p) => p.opacity > 0.01,
      );

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.985;
        p.vx *= 0.993;
        if (type === "smoke") p.radius *= 1.006;
        p.opacity -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [active, type, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        /* Offset so the bottom of the canvas sits just above the chimney */
        top: -(height - 24),
        left: 0,
        pointerEvents: "none",
        zIndex: 11,
      }}
      aria-hidden="true"
    />
  );
}
