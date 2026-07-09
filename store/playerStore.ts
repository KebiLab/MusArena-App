"use client";

import { create } from "zustand";

export type QueueItem = {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  cover_url: string | null;
  audio_url: string;
  duration: number;
  lyrics_lrc: string | null;
};

type Repeat = "off" | "one" | "all";

type PlayerState = {
  current: QueueItem | null;
  queue: QueueItem[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: Repeat;
  expanded: boolean;

  setQueue: (items: QueueItem[], startIndex?: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (v: boolean) => void;
  setProgress: (sec: number) => void;
  setDuration: (sec: number) => void;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  current: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.7,
  shuffle: false,
  repeat: "off",
  expanded: false,

  setQueue: (items, startIndex = 0) =>
    set({
      queue: items,
      current: items[startIndex] ?? null,
      progress: 0,
      duration: items[startIndex]?.duration ?? 0,
      isPlaying: items.length > 0,
    }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () => {
    const { queue, current, repeat, shuffle } = get();
    if (!current || queue.length === 0) return;
    if (repeat === "one") {
      set({ progress: 0 });
      return;
    }
    let idx = queue.findIndex((q) => q.id === current.id);
    if (shuffle) {
      idx = Math.floor(Math.random() * queue.length);
    } else {
      idx = (idx + 1) % queue.length;
      if (idx === 0 && repeat === "off") {
        set({ isPlaying: false, progress: 0 });
        return;
      }
    }
    const nextItem = queue[idx];
    set({ current: nextItem, progress: 0, duration: nextItem.duration });
  },
  prev: () => {
    const { queue, current } = get();
    if (!current || queue.length === 0) return;
    const idx = queue.findIndex((q) => q.id === current.id);
    const prevItem = queue[(idx - 1 + queue.length) % queue.length];
    set({ current: prevItem, progress: 0, duration: prevItem.duration });
  },
  seek: (sec) => set({ progress: sec }),
  setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),
  setExpanded: (v) => set({ expanded: v }),
  setProgress: (sec) => set({ progress: sec }),
  setDuration: (sec) => set({ duration: sec }),
}));
