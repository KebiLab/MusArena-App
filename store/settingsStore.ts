"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Settings = {
  crossfadeDuration: number; // 0, 3, 5, 7, 10
  setCrossfade: (v: number) => void;
  // sync state
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  hydrate: (data: { crossfade_duration: number }) => void;
};

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      crossfadeDuration: 0,
      loaded: false,
      setCrossfade: (v) => set({ crossfadeDuration: v }),
      setLoaded: (v) => set({ loaded: v }),
      hydrate: (data) =>
        set({
          crossfadeDuration: data.crossfade_duration ?? 0,
          loaded: true,
        }),
    }),
    {
      name: "musarena-settings",
      partialize: (s) => ({ crossfadeDuration: s.crossfadeDuration }),
    },
  ),
);
