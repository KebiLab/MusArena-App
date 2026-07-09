import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { AnyTrack } from "@/lib/api/deezer";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getLikedTracksServer(userId: string): Promise<string[]> {
  if (!HAS_SUPABASE) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("likes")
      .select("track_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((r: { track_id: string }) => r.track_id);
  } catch {
    return [];
  }
}

export async function toggleLikeAction(trackId: string, liked: boolean) {
  if (!HAS_SUPABASE) return { error: "Supabase not configured" };
  try {
    const supabase = await createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("track_id", trackId);
      if (error) return { error: error.message };
      return { liked: false };
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: user.id, track_id: trackId });
      if (error) return { error: error.message };
      return { liked: true };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
