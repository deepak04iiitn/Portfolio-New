"use client";

import { useEffect } from "react";
import { useJourneyStore } from "./useJourneyState";

export function useKeyboardNav() {
  const { phase, advanceStation, setMapOpen } = useJourneyStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire while user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      switch (e.key) {
        case "ArrowRight":
        case "n":
          if (phase === "STOPPED" || phase === "EXPLORE") {
            advanceStation();
            window.dispatchEvent(new CustomEvent("journey:depart"));
          }
          break;
        case "m":
          setMapOpen(true);
          break;
        case "h":
          window.dispatchEvent(new CustomEvent("journey:horn"));
          break;
        case "Escape":
          setMapOpen(false);
          window.dispatchEvent(new CustomEvent("journey:close-overlays"));
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, advanceStation, setMapOpen]);
}
