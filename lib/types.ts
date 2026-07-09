export type Theme = "light" | "dark";

export type Track = {
  id: string;
  title: string;
  artist_id: string;
  album_id: string | null;
  duration: number;
  audio_url: string;
  cover_url: string | null;
  lyrics_lrc: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
};

export type Album = {
  id: string;
  title: string;
  artist_id: string;
  cover_url: string | null;
  year: number | null;
};

export type Playlist = {
  id: string;
  name: string;
  user_id: string;
  cover_url: string | null;
  created_at: string;
};

export type TrackWithRelations = Track & {
  artist: Artist;
  album: Album | null;
};
