import { createClient } from "@/lib/supabase/server";
import { DEMO_TRACKS } from "@/lib/demo";
import type { Artist, Album, Track, TrackWithRelations } from "@/lib/types";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function fetchArtists(): Promise<Artist[]> {
  if (!HAS_SUPABASE) return buildDemoArtists();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("artists").select("*");
    if (error || !data || data.length === 0) return buildDemoArtists();
    return data as Artist[];
  } catch {
    return buildDemoArtists();
  }
}

export async function fetchAlbums(): Promise<Album[]> {
  if (!HAS_SUPABASE) return buildDemoAlbums();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("albums").select("*");
    if (error || !data || data.length === 0) return buildDemoAlbums();
    return data as Album[];
  } catch {
    return buildDemoAlbums();
  }
}

export async function fetchTracks(): Promise<TrackWithRelations[]> {
  if (!HAS_SUPABASE) return buildDemoTracks();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tracks")
      .select("*, artist:artists(*), album:albums(*)");
    if (error || !data || data.length === 0) return buildDemoTracks();
    return data as TrackWithRelations[];
  } catch {
    return buildDemoTracks();
  }
}

export async function fetchArtistById(id: string): Promise<Artist | null> {
  if (!HAS_SUPABASE) {
    return buildDemoArtists().find((a) => a.id === id) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("artists").select("*").eq("id", id).maybeSingle();
    return (data as Artist) ?? null;
  } catch {
    return null;
  }
}

export async function fetchTracksByArtist(artistId: string): Promise<TrackWithRelations[]> {
  const all = await fetchTracks();
  return all.filter((t) => t.artist_id === artistId);
}

export async function fetchAlbumsByArtist(artistId: string): Promise<Album[]> {
  const all = await fetchAlbums();
  return all.filter((a) => a.artist_id === artistId);
}

export async function fetchTrackById(id: string): Promise<TrackWithRelations | null> {
  if (!HAS_SUPABASE) {
    return buildDemoTracks().find((t) => t.id === id) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tracks")
      .select("*, artist:artists(*), album:albums(*)")
      .eq("id", id)
      .maybeSingle();
    return (data as TrackWithRelations) ?? null;
  } catch {
    return null;
  }
}

function buildDemoArtists(): Artist[] {
  const map = new Map<string, Artist>();
  DEMO_TRACKS.forEach((t, i) => {
    if (!map.has(t.artist_name)) {
      map.set(t.artist_name, {
        id: `artist-${t.artist_name.toLowerCase().replace(/\s+/g, "-")}`,
        name: t.artist_name,
        image_url: t.cover_url,
        bio: "Демо-артист. made by KebiLab",
      });
    }
  });
  return Array.from(map.values());
}

function buildDemoAlbums(): Album[] {
  const map = new Map<string, Album>();
  DEMO_TRACKS.forEach((t, i) => {
    const key = `${t.artist_name}-${t.album_title}`;
    if (!map.has(key)) {
      const artistId = `artist-${t.artist_name.toLowerCase().replace(/\s+/g, "-")}`;
      map.set(key, {
        id: `album-${i}`,
        title: t.album_title,
        artist_id: artistId,
        cover_url: t.cover_url,
        year: 2024,
      });
    }
  });
  return Array.from(map.values());
}

function buildDemoTracks(): TrackWithRelations[] {
  const artists = buildDemoArtists();
  const albums = buildDemoAlbums();
  return DEMO_TRACKS.map((t, i) => {
    const artistId = `artist-${t.artist_name.toLowerCase().replace(/\s+/g, "-")}`;
    const artist = artists.find((a) => a.id === artistId)!;
    const album = albums.find((a) => a.artist_id === artistId && a.title === t.album_title)!;
    return {
      id: `track-${i}`,
      title: t.title,
      artist_id: artistId,
      album_id: album?.id ?? null,
      duration: t.duration,
      audio_url: t.audio_url,
      cover_url: t.cover_url,
      lyrics_lrc: t.lyrics_lrc,
      uploaded_by: null,
      created_at: new Date().toISOString(),
      artist,
      album,
    };
  });
}

export type { Track, TrackWithRelations, Artist, Album };
