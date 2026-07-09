"use client";

import { ChevronLeft, MoreVertical, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/store/playerStore";
import { TrackRow } from "@/components/music/TrackRow";
import type { AnyTrack, AnyArtist, AnyAlbum } from "@/lib/api/deezer";

export function ArtistScreen({
  artist,
  tracks,
  albums,
}: {
  artist: AnyArtist;
  tracks: AnyTrack[];
  albums: AnyAlbum[];
}) {
  const router = useRouter();
  const setQueue = usePlayer((s) => s.setQueue);

  const firstAlbumTrack = (albumId: string): AnyTrack | undefined => {
    const al = albums.find((a) => a.id === albumId);
    if (!al) return tracks[0];
    return (
      tracks.find((t) => t.album_id === albumId) ??
      {
        ...(tracks[0] as AnyTrack),
        album: al.title,
        album_id: al.id,
        cover_url: al.cover_url,
      }
    );
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="relative h-80 w-full overflow-hidden">
        {artist.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
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
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="More"
          >
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <h1 className="text-3xl font-extrabold drop-shadow">{artist.name}</h1>
          <p className="mt-1 text-sm opacity-80">
            {albums.length} Album · {tracks.length} Track
            {artist.nb_fan != null && ` · ${artist.nb_fan.toLocaleString()} фанатов`}
          </p>
        </div>
      </div>

      <div className="-mt-6 px-5">
        <button
          onClick={() =>
            tracks.length > 0 &&
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
              0,
            )
          }
          className="mt-4 grid h-14 w-14 place-items-center rounded-full bg-fg text-bg"
          aria-label="Play"
        >
          <Play size={26} fill="currentColor" className="translate-x-0.5" />
        </button>
      </div>

      <section className="mt-6 px-4">
        <h2 className="mb-3 text-xl font-bold">Albums</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {albums.slice(0, 12).map((al) => {
            const t = firstAlbumTrack(al.id);
            if (!t) return null;
            return (
              <div key={al.id} className="w-36 shrink-0">
                <ArtistAlbumTile track={t} tracks={tracks} />
                <p className="mt-2 truncate text-sm font-semibold">{al.title}</p>
                <p className="truncate text-xs text-muted">{al.year ?? ""}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 mb-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Top Tracks</h2>
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

function ArtistAlbumTile({
  track,
  tracks,
}: {
  track: AnyTrack;
  tracks: AnyTrack[];
}) {
  const setQueue = usePlayer((s) => s.setQueue);
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
          0,
        )
      }
      className="group block w-full"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-card">
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
      </div>
    </button>
  );
}
