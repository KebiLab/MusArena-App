"use client";

import { TrackRow } from "@/components/music/TrackRow";
import { Heart, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { AnyTrack } from "@/lib/api/deezer";

export function LikedScreen({ tracks }: { tracks: AnyTrack[] }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <header className="flex items-center gap-3">
        <Link
          href="/library"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold">Liked Tracks</h1>
          <p className="text-sm text-muted">{tracks.length} треков</p>
        </div>
      </header>

      {tracks.length === 0 ? (
        <div className="mt-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-card">
            <Heart size={32} className="text-muted" />
          </div>
          <p className="mt-4 text-sm text-muted">
            Пока ничего нет. Жми ❤️ на треках, чтобы добавить их сюда.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-1">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} tracks={tracks} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
