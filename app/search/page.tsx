import { fetchArtists } from "@/lib/data";
import { SearchScreen } from "@/components/screens/SearchScreen";

export default async function SearchPage() {
  const artists = await fetchArtists();
  return <SearchScreen artists={artists} />;
}
