import { fetchTracks } from "@/lib/data";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");

  const tracks = await fetchTracks();
  return <HomeScreen tracks={tracks} />;
}
