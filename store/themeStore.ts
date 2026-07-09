"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (t) => set({ theme: t }),
      toggle: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "musarena-theme" },
  ),
);
