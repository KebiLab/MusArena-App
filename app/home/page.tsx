import { fetchUserTracks } from "@/lib/api/userTracks";
import { getChartTracks } from "@/lib/api/deezer";
import { deezerTrackToAny, type AnyTrack } from "@/lib/api/deezer";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export default async function HomePage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");

  const [chart, userTracks] = await Promise.all([
    getChartTracks(0, 50),
    fetchUserTracks(user.id),
  ]);

  const dz = chart?.data?.filter((t) => t.preview).map(deezerTrackToAny) ?? [];
  const dzIds = new Set(dz.map((t) => t.id));
  const own = userTracks.filter((t) => !dzIds.has(t.id));
  const tracks: AnyTrack[] = [...own, ...dz];

  return <HomeScreen tracks={tracks} userId={user.id} />;
}
