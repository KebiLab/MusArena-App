import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getChartTracks } from "@/lib/api/deezer";
import { deezerTrackToAny } from "@/lib/api/deezer";
import { getLikedTracksServer } from "@/lib/api/likes";
import { fetchUserTracks } from "@/lib/api/userTracks";
import { LikedScreen } from "@/components/screens/LikedScreen";

export const revalidate = 60;

export default async function LikedPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  const [likedIds, chart, userTracks] = await Promise.all([
    getLikedTracksServer(user.id),
    getChartTracks(0, 100),
    fetchUserTracks(user.id),
  ]);
  const allTracks = [
    ...userTracks,
    ...(chart?.data ?? []).filter((t) => t.preview).map(deezerTrackToAny),
  ];
  const likedSet = new Set(likedIds);
  const liked = allTracks.filter((t) => likedSet.has(t.id));
  return <LikedScreen tracks={liked} />;
}
