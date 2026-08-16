/**
 * Root page — Phase 1 entry point.
 * Mounts the railway world scene and provides basic navigation controls
 * so the world panning and platform visibility can be tested.
 *
 * Phase 2 will replace the manual nav controls with the full
 * animation-driven boarding / departure / arrival sequence.
 */

import RailwayWorldClient from "@/components/railway/RailwayWorldClient";

export default function Home() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <RailwayWorldClient />
    </main>
  );
}
