"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import type { TrackWithRelations } from "@/lib/types";

export function HeroCard({
  track,
  tracks,
  index,
}: {
  track: TrackWithRelations;
  tracks: TrackWithRelations[];
  index: number;
}) {
  const setQueue = usePlayer((s) => s.setQueue);

  return (
    <button
      onClick={() =>
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
        )
      }
      className="group relative block w-full overflow-hidden rounded-3xl bg-card text-left"
    >
      <div className="aspect-[16/8] w-full">
        {track.cover_url ? (
          <img
            src={track.cover_url}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-card" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute left-5 bottom-5 right-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80">New Album</p>
        <h2 className="mt-1 text-3xl font-extrabold leading-tight drop-shadow">
          {track.album?.title ?? track.title}
        </h2>
        <p className="mt-1 text-sm opacity-90">{track.artist.name}</p>
      </div>
      <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-fg text-bg opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={22} fill="currentColor" className="translate-x-0.5" />
      </div>
    </button>
  );
}
