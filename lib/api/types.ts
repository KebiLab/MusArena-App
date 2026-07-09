export type DeezerImageSize = "small" | "medium" | "big" | "xl";

export type DeezerArtist = {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album?: number;
  nb_fan?: number;
  radio?: boolean;
  tracklist?: string;
};

export type DeezerAlbum = {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  release_date?: string;
  artist: DeezerArtist;
  nb_tracks?: number;
  duration?: number;
};

export type DeezerTrack = {
  id: number;
  title: string;
  link: string;
  duration: number;
  rank?: number;
  preview: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type?: string;
};

export type DeezerSearchResponse<T> = {
  data: T[];
  total: number;
  next?: string;
  prev?: string;
};

export type DeezerChartResponse = {
  tracks: { data: DeezerTrack[] };
  artists: { data: DeezerArtist[] };
  albums: { data: DeezerAlbum[] };
};
