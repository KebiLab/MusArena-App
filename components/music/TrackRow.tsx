"use client";

import { Play, MoreHorizontal, User } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import { formatTime } from "@/lib/utils";
import type { AnyTrack } from "@/lib/api/deezer";
import { LikeButton } from "./LikeButton";

export function TrackRow({
  track,
  tracks,
  index,
  showCover = true,
  isOwn = false,
}: {
  track: AnyTrack;
  tracks: AnyTrack[];
  index: number;
  showCover?: boolean;
  isOwn?: boolean;
}) {
  const setQueue = usePlayer((s) => s.setQueue);

  const onPlay = () => {
    setQueue(
      tracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album ?? null,
        cover_url: t.cover_url ?? null,
        audio_url: t.audio_url,
        duration: t.duration,
        lyrics_lrc: t.lyrics_lrc ?? null,
      })),
      index,
    );
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl p-2 hover:bg-hover transition-colors">
      {showCover && (
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-card cursor-pointer"
          onClick={onPlay}
        >
          {track.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.cover_url}
              alt={track.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-card" />
          )}
          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" fill="currentColor" />
          </div>
        </div>
      )}
      {!showCover && (
        <button
          onClick={onPlay}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card hover:bg-line"
          aria-label="Play"
        >
          <Play size={16} className="text-fg" fill="currentColor" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{track.title}</p>
          {isOwn && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-fg/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              <User size={9} />
              Твой
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted">{track.artist}</p>
      </div>
      <span className="text-xs text-muted tabular-nums">{formatTime(track.duration)}</span>
      <LikeButton trackId={track.id} size={16} />
      <button
        className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-fg"
        aria-label="More"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}
