"use client";

import { TrackRow } from "@/components/music/TrackRow";
import { ChevronLeft, MoreVertical, ListMusic, Trash2, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/store/playerStore";
import { deletePlaylistAction } from "@/lib/api/playlists";
import type { AnyTrack } from "@/lib/api/deezer";
import type { Playlist } from "@/lib/api/playlists";

export function PlaylistScreen({
  playlist,
  tracks,
}: {
  playlist: Playlist;
  tracks: AnyTrack[];
}) {
  const router = useRouter();
  const setQueue = usePlayer((s) => s.setQueue);
  const [menu, setMenu] = useState(false);

  const onDelete = async () => {
    if (!confirm(`Удалить плейлист "${playlist.name}"?`)) return;
    await deletePlaylistAction(playlist.id);
    router.push("/library");
  };

  const totalSec = tracks.reduce((s, t) => s + t.duration, 0);
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h} ч ${m} мин`;
    return `${m} мин`;
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="relative h-72 w-full overflow-hidden bg-card">
        {playlist.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.cover_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center">
            <ListMusic size={64} className="text-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-bg" />
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
          <Link
            href="/library"
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </Link>
          <button
            onClick={() => setMenu(!menu)}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="More"
          >
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Плейлист</p>
          <h1 className="mt-1 text-3xl font-extrabold drop-shadow">{playlist.name}</h1>
          <p className="mt-1 text-sm opacity-80">
            {tracks.length} треков · {fmt(totalSec)}
          </p>
        </div>
      </div>

      {menu && (
        <div className="mx-4 mt-2 rounded-2xl border border-line bg-card">
          <button
            onClick={onDelete}
            className="flex w-full items-center gap-3 rounded-2xl p-3 text-left text-red-500 hover:bg-hover"
          >
            <Trash2 size={18} />
            <span className="font-semibold">Удалить плейлист</span>
          </button>
        </div>
      )}

      {tracks.length === 0 ? (
        <div className="mt-20 text-center px-4">
          <p className="text-sm text-muted">В плейлисте пока нет треков.</p>
        </div>
      ) : (
        <>
          <div className="px-5 -mt-2 py-4">
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
                    lyrics_lrc: null,
                  })),
                  0,
                )
              }
              className="grid h-14 w-14 place-items-center rounded-full bg-fg text-bg"
              aria-label="Play"
            >
              <Play size={26} fill="currentColor" className="translate-x-0.5" />
            </button>
          </div>
          <div className="px-4 space-y-1">
            {tracks.map((t, i) => (
              <TrackRow key={t.id} track={t} tracks={tracks} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
