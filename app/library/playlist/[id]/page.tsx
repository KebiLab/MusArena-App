import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { fetchUserTracks } from "@/lib/api/userTracks";
import { getChartTracks, deezerTrackToAny } from "@/lib/api/deezer";
import { PlaylistScreen } from "@/components/screens/PlaylistScreen";

export const dynamic = "force-dynamic";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  const { id } = await params;

  const supabase = await createClient();
  const { data: playlist } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!playlist) notFound();

  const { data: items } = await supabase
    .from("playlist_tracks")
    .select("track_id, position")
    .eq("playlist_id", id)
    .order("position", { ascending: true });

  const trackIds = (items ?? []).map((i: { track_id: string }) => i.track_id);

  // Pull metadata: split into user / deezer
  const userIds = trackIds.filter((t: string) => t.startsWith("us-"));
  const dzIds = trackIds.filter((t: string) => t.startsWith("dz-"));

  let userTrackMap = new Map<string, Awaited<ReturnType<typeof fetchUserTracks>>[number]>();
  if (userIds.length) {
    const ut = await fetchUserTracks(user.id);
    ut.forEach((t) => userTrackMap.set(t.id, t));
  }

  let dzTrackMap = new Map<string, Awaited<ReturnType<typeof deezerTrackToAny>>>();
  if (dzIds.length) {
    const chart = await getChartTracks(0, 100);
    (chart?.data ?? []).filter((t) => t.preview).forEach((t) => {
      dzTrackMap.set(`dz-${t.id}`, deezerTrackToAny(t));
    });
  }

  const tracks = trackIds
    .map((id: string) => userTrackMap.get(id) ?? dzTrackMap.get(id))
    .filter((t): t is NonNullable<typeof t> => t != null);

  return (
    <PlaylistScreen
      playlist={{
        id: playlist.id,
        name: playlist.name,
        cover_url: playlist.cover_url,
        created_at: playlist.created_at,
        user_id: playlist.user_id,
      }}
      tracks={tracks}
    />
  );
}
