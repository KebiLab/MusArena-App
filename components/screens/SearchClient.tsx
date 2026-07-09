"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Music, Disc3, User as UserIcon, Play } from "lucide-react";
import {
  searchTracks,
  searchArtists,
  searchAlbums,
  deezerTrackToAny,
  deezerArtistToAny,
  deezerAlbumToAny,
  type AnyTrack,
  type AnyArtist,
  type AnyAlbum,
} from "@/lib/api/deezer";
import { usePlayer } from "@/store/playerStore";

type Tab = "tracks" | "artists" | "albums";
const TABS: Tab[] = ["tracks", "artists", "albums"];

export function SearchClient() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("tracks");
  const [tracks, setTracks] = useState<AnyTrack[]>([]);
  const [artists, setArtists] = useState<AnyArtist[]>([]);
  const [albums, setAlbums] = useState<AnyAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const setQueue = usePlayer((s) => s.setQueue);

  useEffect(() => {
    if (q.trim().length < 2) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    Promise.all([
      searchTracks(q, 15, ctrl.signal),
      searchArtists(q, 10, ctrl.signal),
      searchAlbums(q, 10, ctrl.signal),
    ]).then(([t, a, al]) => {
      setTracks((t?.data ?? []).filter((x) => x.preview).map(deezerTrackToAny));
      setArtists((a?.data ?? []).map(deezerArtistToAny));
      setAlbums((al?.data ?? []).map(deezerAlbumToAny));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <h1 className="text-2xl font-extrabold">Search</h1>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-card px-3 h-12">
        <Search size={18} className="text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Треки, артисты, альбомы…"
          className="flex-1 bg-transparent outline-none placeholder:text-muted"
          autoFocus
        />
      </div>

      <nav className="mt-4 flex items-center gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-2 px-1 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "text-fg" : "text-muted"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-fg" />
            )}
          </button>
        ))}
      </nav>

      {q.trim().length < 2 ? (
        <div className="mt-12 text-center text-sm text-muted">
          Введи минимум 2 символа
        </div>
      ) : loading ? (
        <div className="mt-12 text-center text-sm text-muted">Ищу…</div>
      ) : (
        <div className="mt-4 space-y-6">
          {tab === "tracks" && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Треки
              </h2>
              {tracks.length === 0 ? (
                <p className="text-sm text-muted">Ничего не нашлось</p>
              ) : (
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
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-card">
                          {t.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={t.cover_url}
                              alt={t.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center">
                              <Music size={18} className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{t.title}</p>
                          <p className="truncate text-xs text-muted">{t.artist}</p>
                        </div>
                        <Play size={18} className="text-muted" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "artists" && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Артисты
              </h2>
              {artists.length === 0 ? (
                <p className="text-sm text-muted">Ничего не нашлось</p>
              ) : (
                <ul className="space-y-1">
                  {artists.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/artist/${a.id}`}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-hover"
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-card">
                          {a.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.image_url}
                              alt={a.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center">
                              <UserIcon size={18} className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{a.name}</p>
                          {a.nb_fan != null && (
                            <p className="truncate text-xs text-muted">
                              {a.nb_fan.toLocaleString()} фанатов
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "albums" && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Альбомы
              </h2>
              {albums.length === 0 ? (
                <p className="text-sm text-muted">Ничего не нашлось</p>
              ) : (
                <ul className="space-y-1">
                  {albums.map((al) => (
                    <li key={al.id}>
                      <Link
                        href={`/album/${al.id}`}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-hover"
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-card">
                          {al.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={al.cover_url}
                              alt={al.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center">
                              <Disc3 size={18} className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{al.title}</p>
                          <p className="truncate text-xs text-muted">
                            {al.artist} · {al.year ?? "—"}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
