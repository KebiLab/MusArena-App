import { fetchTracksByArtist, fetchArtistById, fetchAlbumsByArtist } from "@/lib/data";
import { ArtistScreen } from "@/components/screens/ArtistScreen";
import { notFound } from "next/navigation";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = await fetchArtistById(id);
  if (!artist) notFound();
  const [tracks, albums] = await Promise.all([
    fetchTracksByArtist(id),
    fetchAlbumsByArtist(id),
  ]);
  return <ArtistScreen artist={artist} tracks={tracks} albums={albums} />;
}
