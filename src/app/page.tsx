/**
 * Root page — Phase 0 entry point.
 * Renders the loading screen placeholder while the full journey shell
 * is assembled in subsequent phases.
 */

export default function Home() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060A06",
        fontFamily: "var(--font-display)",
        gap: "24px",
      }}
    >
      {/* Identity block */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "6px",
            color: "rgba(244, 196, 48, 0.5)",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          Platform 01 · Deepak Express
        </p>

        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700,
            color: "#F4C430",
            letterSpacing: "6px",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          DEEPAK EXPRESS
        </h1>

        <p
          style={{
            fontFamily: "var(--font-railway)",
            fontSize: "14px",
            letterSpacing: "5px",
            color: "#A8C8A8",
            fontWeight: 500,
          }}
        >
          DX-2026 · SOFTWARE ENGINEER
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "120px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent)",
        }}
      />

      {/* Phase indicator */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "4px",
          color: "#3A4A3A",
          textTransform: "uppercase",
        }}
      >
        ● Phase 0 — Foundation complete
      </p>
    </main>
  );
}
