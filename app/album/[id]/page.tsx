import { notFound } from "next/navigation";
import { getAlbum, deezerTrackToAny, deezerAlbumToAny } from "@/lib/api/deezer";
import { AlbumScreen } from "@/components/screens/AlbumScreen";

export const revalidate = 3600;

function parseAlbumId(id: string): number | null {
  if (id.startsWith("dz-al-")) {
    const n = Number(id.slice(5));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numeric = parseAlbumId(id);
  if (numeric == null) notFound();

  const data = await getAlbum(numeric);
  if (!data) notFound();

  const tracks = (data.tracks?.data ?? [])
    .filter((t) => t.preview)
    .map(deezerTrackToAny);
  const album = deezerAlbumToAny(data);

  return <AlbumScreen album={album} tracks={tracks} />;
}
