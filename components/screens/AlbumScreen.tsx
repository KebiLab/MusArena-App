"use client";

import Link from "next/link";
import { ChevronLeft, MoreVertical, Play, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/store/playerStore";
import { formatTime } from "@/lib/utils";
import type { AnyTrack, AnyAlbum } from "@/lib/api/deezer";

export function AlbumScreen({
  album,
  tracks,
}: {
  album: AnyAlbum;
  tracks: AnyTrack[];
}) {
  const router = useRouter();
  const setQueue = usePlayer((s) => s.setQueue);

  const total = tracks.reduce((s, t) => s + t.duration, 0);

  return (
    <div className="mx-auto max-w-md">
      <div className="relative h-80 w-full overflow-hidden">
        {album.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={album.cover_url}
            alt={album.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bg" />
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
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Album</p>
          <h1 className="mt-1 text-3xl font-extrabold drop-shadow">{album.title}</h1>
          <Link
            href={`/artist/${album.artist_id}`}
            className="mt-1 inline-block text-sm font-semibold opacity-90 hover:opacity-100"
          >
            {album.artist}
          </Link>
          <p className="mt-1 text-xs opacity-70">
            {album.year ?? ""} · {tracks.length} треков · {formatTime(total)}
          </p>
        </div>
      </div>

      <div className="px-5 -mt-2">
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

      <section className="mt-6 mb-8 px-4">
        <ul className="space-y-1">
          {tracks.map((t, i) => (
            <li key={t.id}>
              <button
                onClick={() =>
                  setQueue(
                    tracks.map((x) => ({
                      id: x.id,
                      title: x.title,
                      artist: x.artist,
                      album: x.album ?? null,
                      cover_url: x.cover_url ?? null,
                      audio_url: x.audio_url,
                      duration: x.duration,
                      lyrics_lrc: null,
                    })),
                    i,
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-hover"
              >
                <span className="w-5 text-center text-sm text-muted tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="truncate text-xs text-muted">{t.artist}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted tabular-nums">
                  <Clock size={12} />
                  {formatTime(t.duration)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
