"use client";

import { TrackRow } from "@/components/music/TrackRow";
import { Upload, Heart, ListMusic, Plus, History, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AnyTrack } from "@/lib/api/deezer";
import type { Playlist } from "@/lib/api/playlists";
import type { HistoryItem } from "@/lib/api/history";
import { useState } from "react";
import { createPlaylistAction } from "@/lib/api/playlists";
import { useRouter } from "next/navigation";

export function LibraryScreen({
  tracks,
  userId,
  recent,
  playlists,
}: {
  tracks: AnyTrack[];
  userId: string;
  recent: HistoryItem[];
  playlists: Playlist[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  // Build AnyTrack from history
  const recentTracks: AnyTrack[] = recent
    .filter((h) => h.track_meta)
    .map((h) => {
      const m = h.track_meta as unknown as AnyTrack;
      return {
        ...m,
        source: (m.source ?? (h.track_id.startsWith("dz-") ? "deezer" : "user")) as "deezer" | "user",
      };
    });

  const onCreate = async () => {
    setCreating(true);
    const name = prompt("Название плейлиста:");
    if (name) {
      const res = await createPlaylistAction(name);
      if (res.playlist) {
        router.push(`/library/playlist/${res.playlist.id}`);
      }
    }
    setCreating(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Library</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onCreate}
            disabled={creating}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
            aria-label="New playlist"
          >
            <Plus size={20} />
          </button>
          <Link
            href="/upload"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
            aria-label="Upload"
          >
            <Upload size={20} />
          </Link>
        </div>
      </header>

      <section className="mt-6 space-y-2">
        <Link
          href="/library/liked"
          className="flex items-center gap-3 rounded-2xl bg-card p-3 hover:bg-hover"
        >
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-fg text-bg">
            <Heart size={22} fill="currentColor" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Liked Tracks</p>
            <p className="text-sm text-muted">Все что ты лайкнул</p>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </Link>

        {playlists.length > 0 && (
          <div>
            <h2 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wider text-muted">
              Плейлисты
            </h2>
            <ul className="space-y-1">
              {playlists.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/library/playlist/${p.id}`}
                    className="flex items-center gap-3 rounded-2xl p-2 hover:bg-hover"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-card">
                      {p.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.cover_url}
                          alt=""
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <ListMusic size={20} className="text-muted" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted">Плейлист</p>
                    </div>
                    <ChevronRight size={18} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {recentTracks.length > 0 && (
        <section className="mt-6 mb-8">
          <div className="mb-2 flex items-center gap-2">
            <History size={14} className="text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Recently played
            </h2>
          </div>
          <div className="space-y-1">
            {recentTracks.map((t, i) => (
              <TrackRow
                key={`${t.id}-${recent[i].played_at}`}
                track={t}
                tracks={recentTracks}
                index={i}
                showCover={false}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 mb-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
          Твои аплоады
        </h2>
        {tracks.length === 0 ? (
          <p className="text-sm text-muted">
            Пока ничего нет. Загрузи свой первый трек на странице{" "}
            <Link href="/upload" className="underline">
              Upload
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-1">
            {tracks.map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                tracks={tracks}
                index={i}
                isOwn
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
