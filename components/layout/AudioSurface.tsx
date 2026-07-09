"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/store/playerStore";

export function AudioSurface() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const current = usePlayer((s) => s.current);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const volume = usePlayer((s) => s.volume);
  const progress = usePlayer((s) => s.progress);
  const setProgress = usePlayer((s) => s.setProgress);
  const setDuration = usePlayer((s) => s.setDuration);
  const next = usePlayer((s) => s.next);
  const seek = usePlayer((s) => s.seek);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current && audio.src !== current.audio_url) {
      audio.src = current.audio_url;
      audio.load();
    }
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Math.abs(audio.currentTime - progress) > 0.5) {
      audio.currentTime = progress;
    }
  }, [progress]);

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      onEnded={() => next()}
      onSeeked={(e) => seek(e.currentTarget.currentTime)}
      preload="metadata"
    />
  );
}
