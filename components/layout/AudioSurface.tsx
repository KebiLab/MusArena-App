"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { recordPlay } from "@/lib/api/history";
import type { QueueItem } from "@/store/playerStore";

type MediaSessionArtwork = { src: string; sizes: string; type: string };

function setMediaMetadata(track: QueueItem | null) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  type MS = {
    metadata: {
      title?: string;
      artist?: string;
      album?: string;
      artwork?: MediaSessionArtwork[];
    } | null;
  };
  const ms = (navigator as Navigator & { mediaSession: MS }).mediaSession;
  if (!track) {
    ms.metadata = null;
    return;
  }
  const artwork: MediaSessionArtwork[] = track.cover_url
    ? [
        { src: track.cover_url, sizes: "96x96", type: "image/jpeg" },
        { src: track.cover_url, sizes: "192x192", type: "image/jpeg" },
        { src: track.cover_url, sizes: "512x512", type: "image/jpeg" },
      ]
    : [];
  ms.metadata = {
    title: track.title,
    artist: track.artist,
    album: track.album ?? "",
    artwork,
  };
}

function setMediaHandlers() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const ms = (navigator as Navigator & {
    mediaSession: {
      setActionHandler: (action: string, handler: (() => void) | null) => void;
    };
  }).mediaSession;
  const player = usePlayer.getState();
  ms.setActionHandler("play", () => player.play());
  ms.setActionHandler("pause", () => player.pause());
  ms.setActionHandler("nexttrack", () => player.next());
  ms.setActionHandler("previoustrack", () => player.prev());
  ms.setActionHandler("seekto", (e: unknown) => {
    const ev = e as { seekTime?: number };
    if (typeof ev?.seekTime === "number") player.seek(ev.seekTime);
  });
  ms.setActionHandler("seekforward", () => player.seek(usePlayer.getState().progress + 10));
  ms.setActionHandler("seekbackward", () => player.seek(Math.max(0, usePlayer.getState().progress - 10)));
  ms.setActionHandler("stop", () => player.pause());
}

function setMediaPlaybackState() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const ms = (navigator as Navigator & {
    mediaSession: { playbackState: "playing" | "paused" | "none" };
  }).mediaSession;
  ms.playbackState = usePlayer.getState().isPlaying ? "playing" : "paused";
}

export function AudioSurface() {
  const currentRef = useRef<HTMLAudioElement | null>(null);
  const nextRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const recordedRef = useRef<string | null>(null);

  const current = usePlayer((s) => s.current);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const volume = usePlayer((s) => s.volume);
  const crossfadeMs = useSettingsStore((s) => s.crossfadeDuration) * 1000;

  // Subscribe to player store
  useEffect(() => {
    const unsub = usePlayer.subscribe((state, prev) => {
      const cur = currentRef.current;
      if (!cur) return;
      if (state.isPlaying !== prev.isPlaying) {
        if (state.isPlaying) cur.play().catch(() => {});
        else cur.pause();
        setMediaPlaybackState();
      }
      if (state.current && state.current.id !== prev.current?.id) {
        cur.src = state.current.audio_url;
        cur.volume = state.volume;
        cur.load();
        if (state.isPlaying) cur.play().catch(() => {});
        setMediaMetadata(state.current);

        // Record play (once per track id)
        if (recordedRef.current !== state.current.id) {
          recordedRef.current = state.current.id;
          recordPlay({
            id: state.current.id,
            title: state.current.title,
            artist: state.current.artist,
            album: state.current.album,
            cover_url: state.current.cover_url,
            audio_url: state.current.audio_url,
            duration: state.current.duration,
            lyrics_lrc: state.current.lyrics_lrc,
            source: state.current.id.startsWith("dz-") ? "deezer" : "user",
            uploaded_by: null,
          });
        }
      }
      if (Math.abs(state.progress - cur.currentTime) > 0.7) {
        cur.currentTime = state.progress;
      }
    });
    return unsub;
  }, []);

  // Volume
  useEffect(() => {
    const cur = currentRef.current;
    if (cur) cur.volume = volume;
    const nxt = nextRef.current;
    if (nxt) nxt.volume = volume;
  }, [volume]);

  // Crossfade — pre-buffer next track when near end
  useEffect(() => {
    if (crossfadeMs === 0) return;
    const state = usePlayer.getState();
    if (!state.current || !state.isPlaying) return;
    if (state.duration <= 0) return;
    const remaining = state.duration - state.progress;
    if (remaining <= 0) return;

    // Trigger when ~1.2x crossfade remaining, чтобы успело загрузиться
    const triggerAt = Math.max(crossfadeMs * 1.2, crossfadeMs + 1000);
    if (remaining > triggerAt / 1000) {
      // Cancel any prepared next
      if (nextRef.current) {
        nextRef.current.pause();
        nextRef.current.src = "";
        nextRef.current = null;
      }
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
        fadeRafRef.current = null;
      }
      return;
    }

    // Already prepared
    if (nextRef.current) return;

    const cur = currentRef.current;
    const queue = state.queue;
    const idx = queue.findIndex((q) => q.id === state.current!.id);
    if (idx < 0) return;
    const next = queue[(idx + 1) % queue.length];
    if (!next || next.id === state.current.id) return;

    const nextAudio = new Audio(next.audio_url);
    nextAudio.preload = "auto";
    nextAudio.volume = 0;
    nextRef.current = nextAudio;

    const startFade = () => {
      const start = performance.now();
      const step = () => {
        const elapsed = performance.now() - start;
        const ratio = Math.min(1, elapsed / crossfadeMs);
        if (cur) cur.volume = volume * (1 - ratio);
        nextAudio.volume = volume * ratio;
        if (ratio < 1 && usePlayer.getState().isPlaying) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          // swap
          if (cur) {
            cur.pause();
            cur.src = "";
          }
          currentRef.current = nextAudio;
          nextRef.current = null;
          // advance player queue
          usePlayer.getState().next();
        }
      };
      fadeRafRef.current = requestAnimationFrame(step);
    };

    nextAudio.addEventListener("canplay", startFade, { once: true });
    nextAudio.addEventListener("error", () => {
      nextRef.current = null;
    });
  }, [current, isPlaying, crossfadeMs, volume]);

  // Set media handlers once
  useEffect(() => {
    setMediaHandlers();
  }, []);

  return (
    <audio
      ref={currentRef}
      onTimeUpdate={(e) => {
        const t = e.currentTarget.currentTime;
        usePlayer.getState().setProgress(t);
      }}
      onLoadedMetadata={(e) => {
        usePlayer.getState().setDuration(e.currentTarget.duration);
      }}
      onEnded={() => {
        // Если crossfade активен — fade уже начался
        const cf = useSettingsStore.getState().crossfadeDuration;
        if (cf === 0) {
          usePlayer.getState().next();
        }
      }}
      preload="metadata"
    />
  );
}
