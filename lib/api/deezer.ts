import type { DeezerTrack, DeezerArtist, DeezerAlbum } from "./types";
import type { QueueItem } from "@/store/playerStore";

const DZ = "https://api.deezer.com";

async function dzFetch<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const res = await fetch(`${DZ}${path}`, {
      signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getChart(genreId = 0, limit = 50, signal?: AbortSignal) {
  return dzFetch<{
    tracks?: { data: DeezerTrack[] };
    artists?: { data: DeezerArtist[] };
    albums?: { data: DeezerAlbum[] };
  }>(`/chart/${genreId}?limit=${limit}`, signal);
}

export async function getChartTracks(genreId = 0, limit = 50, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerTrack[] }>(`/chart/${genreId}/tracks?limit=${limit}`, signal);
}

export async function getChartArtists(genreId = 0, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerArtist[] }>(`/chart/${genreId}/artists?limit=${limit}`, signal);
}

export async function getChartAlbums(genreId = 0, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerAlbum[] }>(`/chart/${genreId}/albums?limit=${limit}`, signal);
}

export async function searchTracks(q: string, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerTrack[] }>(
    `/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}`,
    signal,
  );
}

export async function searchArtists(q: string, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerArtist[] }>(
    `/search?q=${encodeURIComponent(q)}&type=artist&limit=${limit}`,
    signal,
  );
}

export async function searchAlbums(q: string, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerAlbum[] }>(
    `/search?q=${encodeURIComponent(q)}&type=album&limit=${limit}`,
    signal,
  );
}

export async function getArtist(id: number | string, signal?: AbortSignal) {
  return dzFetch<DeezerArtist & { top_tracks?: { data: DeezerTrack[] } }>(
    `/artist/${id}`,
    signal,
  );
}

export async function getArtistTop(id: number | string, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerTrack[] }>(`/artist/${id}/top?limit=${limit}`, signal);
}

export async function getArtistAlbums(id: number | string, limit = 20, signal?: AbortSignal) {
  return dzFetch<{ data: DeezerAlbum[] }>(`/artist/${id}/albums?limit=${limit}`, signal);
}

export async function getAlbum(id: number | string, signal?: AbortSignal) {
  return dzFetch<DeezerAlbum & { tracks?: { data: DeezerTrack[] } }>(`/album/${id}`, signal);
}

export function trackToQueueItem(t: DeezerTrack): QueueItem {
  return {
    id: `dz-${t.id}`,
    title: t.title,
    artist: t.artist?.name ?? "Unknown",
    album: t.album?.title ?? null,
    cover_url: t.album?.cover_medium ?? t.album?.cover ?? null,
    audio_url: t.preview,
    duration: t.duration,
    lyrics_lrc: null,
  };
}

export type AnyTrack = {
  id: string;
  title: string;
  artist: string;
  artist_id?: string;
  album?: string | null;
  album_id?: string | null;
  cover_url?: string | null;
  audio_url: string;
  duration: number;
  lyrics_lrc?: string | null;
  uploaded_by?: string | null;
  source: "deezer" | "user";
};

export function deezerTrackToAny(t: DeezerTrack): AnyTrack {
  return {
    id: `dz-${t.id}`,
    title: t.title,
    artist: t.artist.name,
    artist_id: t.artist ? `dz-a-${t.artist.id}` : undefined,
    album: t.album?.title ?? null,
    album_id: t.album ? `dz-al-${t.album.id}` : undefined,
    cover_url: t.album?.cover_medium ?? t.album?.cover ?? null,
    audio_url: t.preview,
    duration: t.duration,
    lyrics_lrc: null,
    uploaded_by: null,
    source: "deezer",
  };
}

export type AnyArtist = {
  id: string;
  name: string;
  image_url: string | null;
  source: "deezer" | "user";
  nb_fan?: number;
  bio?: string | null;
};

export function deezerArtistToAny(a: DeezerArtist): AnyArtist {
  return {
    id: `dz-a-${a.id}`,
    name: a.name,
    image_url: a.picture_medium ?? a.picture ?? null,
    source: "deezer",
    nb_fan: a.nb_fan,
  };
}

export type AnyAlbum = {
  id: string;
  title: string;
  artist: string;
  artist_id: string;
  cover_url: string | null;
  year: number | null;
  source: "deezer" | "user";
};

export function deezerAlbumToAny(a: DeezerAlbum): AnyAlbum {
  return {
    id: `dz-al-${a.id}`,
    title: a.title,
    artist: a.artist?.name ?? "Unknown",
    artist_id: a.artist ? `dz-a-${a.artist.id}` : "",
    cover_url: a.cover_medium ?? a.cover ?? null,
    year: a.release_date ? Number(a.release_date.slice(0, 4)) : null,
    source: "deezer",
  };
}
