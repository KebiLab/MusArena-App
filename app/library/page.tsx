import { fetchUserTracks } from "@/lib/api/userTracks";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  const tracks = await fetchUserTracks(user.id);
  return <LibraryScreen tracks={tracks} userId={user.id} />;
}
