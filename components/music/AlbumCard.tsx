"use client";

import { Play } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import type { AnyTrack } from "@/lib/api/deezer";

export function AlbumCard({
  track,
  tracks,
  index,
  size = "md",
}: {
  track: AnyTrack;
  tracks: AnyTrack[];
  index: number;
  size?: "sm" | "md" | "lg";
}) {
  const setQueue = usePlayer((s) => s.setQueue);
  const dims = size === "sm" ? "h-32" : size === "lg" ? "h-56" : "h-44";

  return (
    <button
      onClick={() =>
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
        )
      }
      className="group flex w-36 shrink-0 flex-col gap-2 text-left"
    >
      <div className={`relative w-full ${dims} overflow-hidden rounded-2xl bg-card`}>
        {track.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.cover_url}
            alt={track.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-card" />
        )}
        <div className="absolute inset-0 grid place-items-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-fg text-bg opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} fill="currentColor" className="translate-x-0.5" />
          </div>
        </div>
      </div>
      <div>
        <p className="truncate text-sm font-semibold">{track.album ?? track.title}</p>
        <p className="truncate text-xs text-muted">{track.artist}</p>
      </div>
    </button>
  );
}
