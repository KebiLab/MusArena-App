import { fetchUserTracks } from "@/lib/api/userTracks";
import { createClient } from "@/lib/supabase/server";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Playlist } from "@/lib/api/playlists";
import type { HistoryItem } from "@/lib/api/history";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  const supabase = await createClient();

  const [tracks, recentRes, playlistsRes] = await Promise.all([
    fetchUserTracks(user.id),
    supabase
      .from("play_history")
      .select("*")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .limit(20),
    supabase
      .from("playlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <LibraryScreen
      tracks={tracks}
      userId={user.id}
      recent={(recentRes.data ?? []) as HistoryItem[]}
      playlists={(playlistsRes.data ?? []) as Playlist[]}
    />
  );
}
