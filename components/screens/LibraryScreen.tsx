"use client";

import { TrackRow } from "@/components/music/TrackRow";
import { Upload, Heart } from "lucide-react";
import Link from "next/link";
import type { TrackWithRelations } from "@/lib/types";

export function LibraryScreen({ tracks }: { tracks: TrackWithRelations[] }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Library</h1>
        <Link
          href="/upload"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
          aria-label="Upload"
        >
          <Upload size={20} />
        </Link>
      </header>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Liked
        </h2>
        <Link
          href="/library/liked"
          className="flex items-center gap-3 rounded-xl bg-card p-3 hover:bg-hover"
        >
          <div className="grid h-14 w-14 place-items-center rounded-md bg-fg text-bg">
            <Heart size={22} fill="currentColor" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold">Liked Tracks</p>
            <p className="text-sm text-muted">Плейлист · {tracks.length} треков</p>
          </div>
        </Link>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          All tracks
        </h2>
        <div className="space-y-1">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} tracks={tracks} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
