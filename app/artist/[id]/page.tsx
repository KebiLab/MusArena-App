import { notFound } from "next/navigation";
import {
  getArtist,
  getArtistTop,
  getArtistAlbums,
  deezerTrackToAny,
  deezerAlbumToAny,
} from "@/lib/api/deezer";
import { ArtistScreen } from "@/components/screens/ArtistScreen";

export const revalidate = 3600;

function parseArtistId(id: string): number | null {
  if (id.startsWith("dz-a-")) {
    const n = Number(id.slice(4));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numeric = parseArtistId(id);
  if (numeric == null) notFound();

  const [artist, top, albums] = await Promise.all([
    getArtist(numeric),
    getArtistTop(numeric, 20),
    getArtistAlbums(numeric, 20),
  ]);
  if (!artist) notFound();

  const tracks = (top?.data ?? []).filter((t) => t.preview).map(deezerTrackToAny);
  const albumList = (albums?.data ?? []).map(deezerAlbumToAny);

  return (
    <ArtistScreen
      artist={{
        id: `dz-a-${artist.id}`,
        name: artist.name,
        image_url: artist.picture_xl ?? artist.picture_big ?? artist.picture_medium ?? null,
        source: "deezer",
        nb_fan: artist.nb_fan,
        bio: null,
      }}
      tracks={tracks}
      albums={albumList}
    />
  );
}
