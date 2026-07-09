"use client";

import { createClient } from "@/lib/supabase/client";
import type { AnyTrack } from "@/lib/api/deezer";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Playlist = {
  id: string;
  user_id: string;
  name: string;
  cover_url: string | null;
  created_at: string;
};

export async function createPlaylistAction(name: string) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { data, error } = await supabase
    .from("playlists")
    .insert({ user_id: user.id, name: name.trim() || "Новый плейлист" })
    .select()
    .single();
  if (error) return { error: error.message };
  return { playlist: data as Playlist };
}

export async function deletePlaylistAction(id: string) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function renamePlaylistAction(id: string, name: string) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlists")
    .update({ name: name.trim() })
    .eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function addTrackToPlaylistAction(
  playlistId: string,
  trackId: string,
  position: number,
) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlist_tracks")
    .insert({ playlist_id: playlistId, track_id: trackId, position });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function removeTrackFromPlaylistAction(
  playlistId: string,
  trackId: string,
) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);
  if (error) return { error: error.message };
  return { ok: true };
}
