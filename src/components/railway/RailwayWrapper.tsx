"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* Lazy-load both entry points — avoids loading mobile code on desktop
   and desktop code on mobile. */
const RailwayWorldClient = dynamic(
  () => import("./RailwayWorldClient"),
  { ssr: false },
);

const MobileJourney = dynamic(
  () => import("./MobileJourney"),
  { ssr: false },
);

/**
 * RailwayWrapper — client entry point.
 * Detects viewport width on mount and renders either the full
 * desktop railway experience or the simplified mobile layout.
 *
 * ≤768 px  → MobileJourney (vertical card stack, no GSAP world pan)
 * > 768 px → RailwayWorldClient (full scene with camera + particles)
 */
export default function RailwayWrapper() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Render nothing until we know the viewport (avoids hydration flash) */
  if (isMobile === null) return null;

  return isMobile ? <MobileJourney /> : <RailwayWorldClient />;
}
