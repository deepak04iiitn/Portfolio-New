"use client";

/**
 * FilmGrain — persistent full-screen analogue texture overlay.
 *
 * Uses an SVG feTurbulence filter to generate film grain.
 * The CSS `grain-shift` keyframe (defined in globals.css) jitters
 * the overlay pixel-by-pixel each frame, creating a flickering
 * analogue film feel without any JavaScript animation cost.
 *
 * z-index 201 — above CabinView (200) so grain is visible everywhere,
 * but pointer-events: none so it never blocks interaction.
 */
export default function FilmGrain() {
  return (
    <>
      {/* Invisible SVG filter definition */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="film-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Grain overlay div */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 201,
          opacity: 0.038,
          filter: "url(#film-grain-filter)",
          pointerEvents: "none",
          animation: "grain-shift 0.12s steps(1) infinite",
          willChange: "transform",
        }}
      />
    </>
  );
}
