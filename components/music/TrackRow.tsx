"use client";

import { Play, Heart, MoreHorizontal } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import type { TrackWithRelations } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function TrackRow({
  track,
  tracks,
  index,
  showCover = true,
}: {
  track: TrackWithRelations;
  tracks: TrackWithRelations[];
  index: number;
  showCover?: boolean;
}) {
  const setQueue = usePlayer((s) => s.setQueue);

  const onPlay = () => {
    setQueue(
      tracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist.name,
        album: t.album?.title ?? null,
        cover_url: t.cover_url,
        audio_url: t.audio_url,
        duration: t.duration,
        lyrics_lrc: t.lyrics_lrc,
      })),
      index,
    );
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg p-2 hover:bg-hover transition-colors">
      {showCover && (
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-card cursor-pointer"
          onClick={onPlay}
        >
          {track.cover_url ? (
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
        <p className="truncate text-sm font-semibold">{track.title}</p>
        <p className="truncate text-xs text-muted">{track.artist.name}</p>
      </div>
      <span className="text-xs text-muted tabular-nums">{formatTime(track.duration)}</span>
      <button
        className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-fg"
        aria-label="Like"
      >
        <Heart size={16} />
      </button>
      <button
        className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-fg"
        aria-label="More"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}
