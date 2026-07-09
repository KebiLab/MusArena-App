"use client";

import { ChevronLeft, MoreVertical, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlayer } from "@/store/playerStore";
import { TrackRow } from "@/components/music/TrackRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import type { Artist, Album, TrackWithRelations } from "@/lib/types";

export function ArtistScreen({
  artist,
  tracks,
  albums,
}: {
  artist: Artist;
  tracks: TrackWithRelations[];
  albums: Album[];
}) {
  const router = useRouter();
  const setQueue = usePlayer((s) => s.setQueue);

  return (
    <div className="mx-auto max-w-md">
      <div className="relative h-80 w-full overflow-hidden">
        {artist.image_url ? (
          <img
            src={artist.image_url}
            alt={artist.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-bg" />
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <ChevronLeft size={22} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <h1 className="text-3xl font-extrabold drop-shadow">{artist.name}</h1>
          <p className="mt-1 text-sm opacity-80">
            {albums.length} Album · {tracks.length} Track
          </p>
        </div>
      </div>

      <div className="-mt-6 px-5">
        <p className="text-sm text-muted">{artist.bio ?? "Артист MusArena."}</p>
        <button
          onClick={() =>
            tracks.length > 0 &&
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
              0,
            )
          }
          className="mt-4 grid h-14 w-14 place-items-center rounded-full bg-fg text-bg"
        >
          <Play size={26} fill="currentColor" className="translate-x-0.5" />
        </button>
      </div>

      <section className="mt-6 px-4">
        <h2 className="mb-3 text-xl font-bold">Albums</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {albums.map((al, i) => {
            const firstTrack = tracks.find((t) => t.album_id === al.id) ?? tracks[0];
            if (!firstTrack) return null;
            return (
              <AlbumCard
                key={al.id}
                track={{ ...firstTrack, album: al }}
                tracks={tracks}
                index={tracks.findIndex((t) => t.id === firstTrack.id)}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-6 mb-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Songs</h2>
          <button className="text-sm text-muted">See More</button>
        </div>
        <div className="space-y-1">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} tracks={tracks} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
