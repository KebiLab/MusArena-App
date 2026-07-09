"use client";

import { usePlayer } from "@/store/playerStore";
import { formatTime, cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Repeat1, Repeat, Shuffle, Heart, MoreHorizontal, ChevronUp, ListMusic, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { parseLrc, findActiveLine } from "@/lib/lyrics";
import { LikeButton } from "@/components/music/LikeButton";
import { CrossfadeControl } from "./CrossfadeControl";

export function PlayerView() {
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    expanded,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    setExpanded,
  } = usePlayer();
  const [activeLine, setActiveLine] = useState(-1);
  const [showLyrics, setShowLyrics] = useState(false);

  const lines = parseLrc(current?.lyrics_lrc ?? null);

  useEffect(() => {
    if (lines.length === 0) return;
    setActiveLine(findActiveLine(lines, progress));
  }, [progress, lines]);

  if (!current) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      <AnimatePresence>
        {!expanded && (
          <motion.div
            key="mini"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[60px] inset-x-0 z-30"
          >
            <div className="mx-auto max-w-md px-3">
              <button
                onClick={() => setExpanded(true)}
                className="w-full flex items-center gap-3 rounded-xl border border-line bg-card p-2 pr-4 hover:bg-hover transition-colors"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-hover">
                  {current.cover_url ? (
                    <Image
                      src={current.cover_url}
                      alt={current.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-hover" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate">{current.title}</p>
                  <p className="text-xs text-muted truncate">{current.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-fg text-bg"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && !showLyrics && (
          <motion.div
            key="full"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-bg text-fg flex flex-col"
          >
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <button
                onClick={() => setExpanded(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
                aria-label="Minimize"
              >
                <ChevronUp size={22} className="rotate-180" />
              </button>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted">Now playing</p>
                <p className="text-sm font-medium truncate max-w-[60vw]">
                  {current.album ?? "Single"}
                </p>
              </div>
              <button
                onClick={() => setShowLyrics(true)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
                aria-label="Lyrics"
              >
                <ListMusic size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-2xl">
                {current.cover_url ? (
                  <Image
                    src={current.cover_url}
                    alt={current.title}
                    fill
                    sizes="(max-width: 480px) 90vw, 480px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-card" />
                )}
              </div>
            </div>

            <div className="px-6 pb-8 pt-4">
              <div className="flex items-end justify-between mb-3">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold truncate">{current.title}</h2>
                  <p className="text-base text-muted truncate">{current.artist}</p>
                </div>
                <LikeButton trackId={current.id} size={22} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted tabular-nums w-10 text-right">
                  {formatTime(progress)}
                </span>
                <div
                  className="relative flex-1 h-1.5 rounded-full bg-line cursor-pointer"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - r.left) / r.width;
                    seek(ratio * duration);
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-fg"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted tabular-nums w-10">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full",
                    shuffle ? "text-fg" : "text-muted hover:text-fg",
                  )}
                  aria-label="Shuffle"
                >
                  <Shuffle size={20} />
                </button>
                <button
                  onClick={prev}
                  className="grid h-12 w-12 place-items-center rounded-full hover:bg-hover"
                  aria-label="Previous"
                >
                  <SkipBack size={28} fill="currentColor" />
                </button>
                <button
                  onClick={toggle}
                  className="grid h-16 w-16 place-items-center rounded-full bg-fg text-bg"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <button
                  onClick={next}
                  className="grid h-12 w-12 place-items-center rounded-full hover:bg-hover"
                  aria-label="Next"
                >
                  <SkipForward size={28} fill="currentColor" />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full",
                    repeat !== "off" ? "text-fg" : "text-muted hover:text-fg",
                  )}
                  aria-label="Repeat"
                >
                  {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 px-1">
                <span className="text-[10px] text-muted">VOL</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-fg"
                />
              </div>

              <div className="mt-4 border-t border-line pt-4">
                <CrossfadeControl />
              </div>
            </div>
          </motion.div>
        )}

        {expanded && showLyrics && (
          <motion.div
            key="lyrics"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-bg text-fg flex flex-col"
          >
            <div
              className="absolute inset-0 -z-10 opacity-30"
              style={{
                background: current.cover_url
                  ? `center / cover no-repeat url(${current.cover_url})`
                  : "var(--card)",
                filter: "blur(40px) saturate(150%)",
              }}
            />
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <button
                onClick={() => setShowLyrics(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
                aria-label="Back"
              >
                <ChevronUp size={22} className="rotate-180" />
              </button>
              <p className="text-sm font-medium">{current.title}</p>
              <button
                onClick={() => {
                  setShowLyrics(false);
                  setExpanded(false);
                }}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="text-center text-muted mt-20">
                  Текст не добавлен для этого трека.
                </p>
              ) : (
                <ul className="space-y-3 max-w-2xl mx-auto text-center">
                  {lines.map((l, i) => (
                    <li
                      key={i}
                      className={cn(
                        "transition-all duration-300",
                        i === activeLine
                          ? "text-fg text-2xl font-semibold scale-100"
                          : i < activeLine
                          ? "text-muted/60 text-lg"
                          : "text-muted/40 text-lg",
                      )}
                    >
                      {l.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-line p-3 flex items-center gap-3 bg-bg">
              <button
                onClick={toggle}
                className="grid h-10 w-10 place-items-center rounded-full bg-fg text-bg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{current.title}</p>
                <p className="text-xs text-muted truncate">{current.artist}</p>
              </div>
              <span className="text-xs text-muted tabular-nums">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
