"use client";

import { createClient } from "@/lib/supabase/client";
import type { AnyTrack } from "@/lib/api/deezer";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type HistoryItem = {
  id: string;
  user_id: string;
  track_id: string;
  track_meta: AnyTrack | null;
  played_at: string;
};

export async function recordPlay(track: AnyTrack) {
  if (!HAS_SUPABASE) return;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("play_history").insert({
      user_id: user.id,
      track_id: track.id,
      track_meta: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        cover_url: track.cover_url,
        audio_url: track.audio_url,
        duration: track.duration,
        source: track.source,
        uploaded_by: track.uploaded_by,
      },
    });
  } catch {
    // silent
  }
}

export async function clearHistory() {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("play_history")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) return { error: error.message };
  return { ok: true };
}
