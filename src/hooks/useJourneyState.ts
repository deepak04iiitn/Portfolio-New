"use client";

import { create } from "zustand";
import type { JourneyPhase, StationId, TrainState, JourneyStore } from "@/lib/railway/types";
import { STATIONS } from "@/lib/railway/stations";

export const useJourneyStore = create<JourneyStore>((set, get) => ({
  phase: "LOADING",
  currentStationIndex: 0,
  isAudioEnabled: false,
  isMuted: false,
  isMapOpen: false,
  isTicketVisible: false,

  trainState: {
    phase: "LOADING",
    speed: 0,
    worldOffset: 0,
    currentStationId: "welcome",
    nextStationId: "education",
    isMoving: false,
    smokeActive: false,
    headlightOn: false,
    wheelsRotating: false,
  },

  setPhase: (phase: JourneyPhase) =>
    set((state) => ({
      phase,
      trainState: { ...state.trainState, phase },
    })),

  setTrainState: (partial: Partial<TrainState>) =>
    set((state) => ({
      trainState: { ...state.trainState, ...partial },
    })),

  advanceStation: () => {
    const { currentStationIndex, trainState } = get();
    const nextIndex = Math.min(currentStationIndex + 1, STATIONS.length - 1);
    const nextStation = STATIONS[nextIndex];
    const afterStation = STATIONS[nextIndex + 1] ?? null;

    set({
      currentStationIndex: nextIndex,
      trainState: {
        ...trainState,
        currentStationId: nextStation.id,
        nextStationId: afterStation?.id ?? null,
      },
    });
  },

  jumpToStation: (id: StationId) => {
    const index = STATIONS.findIndex((s) => s.id === id);
    if (index < 0) return;
    const afterStation = STATIONS[index + 1] ?? null;

    set((state) => ({
      currentStationIndex: index,
      phase: "STOPPED",
      trainState: {
        ...state.trainState,
        phase: "STOPPED",
        currentStationId: id,
        nextStationId: afterStation?.id ?? null,
        isMoving: false,
        speed: 0,
        wheelsRotating: false,
        smokeActive: false,
        headlightOn: STATIONS[index].environment.headlightIntensity > 0.5,
      },
    }));
  },

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  enableAudio: () => set({ isAudioEnabled: true }),
  setMapOpen: (open: boolean) => set({ isMapOpen: open }),
  setTicketVisible: (visible: boolean) => set({ isTicketVisible: visible }),
}));
