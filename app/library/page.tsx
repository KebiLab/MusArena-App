import { fetchTracks } from "@/lib/data";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  const tracks = await fetchTracks();
  return <LibraryScreen tracks={tracks} />;
}
