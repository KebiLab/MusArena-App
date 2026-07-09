import { createClient } from "@/lib/supabase/server";
import type { AnyTrack, AnyArtist, AnyAlbum } from "@/lib/api/deezer";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type DbTrack = {
  id: string;
  title: string;
  artist_id: string | null;
  album_id: string | null;
  artist_name: string | null;
  album_title: string | null;
  duration: number;
  audio_url: string;
  cover_url: string | null;
  lyrics_lrc: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export async function fetchUserTracks(userId: string | null | undefined): Promise<AnyTrack[]> {
  if (!HAS_SUPABASE || !userId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("uploaded_by", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return (data as DbTrack[]).map(dbTrackToAny);
  } catch {
    return [];
  }
}

export function dbTrackToAny(t: DbTrack): AnyTrack {
  return {
    id: `us-${t.id}`,
    title: t.title,
    artist: t.artist_name ?? "Unknown",
    album: t.album_title ?? null,
    cover_url: t.cover_url,
    audio_url: t.audio_url,
    duration: t.duration,
    lyrics_lrc: t.lyrics_lrc ?? null,
    uploaded_by: t.uploaded_by,
    source: "user",
  };
}

export function dbArtistToAny(id: string, name: string, image_url: string | null): AnyArtist {
  return { id, name, image_url, source: "user" };
}

export function dbAlbumToAny(id: string, title: string, artist: string, artist_id: string, cover_url: string | null, year: number | null): AnyAlbum {
  return { id, title, artist, artist_id, cover_url, year, source: "user" };
}
