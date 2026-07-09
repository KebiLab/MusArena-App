import type { Track } from "@/lib/types";

export const DEMO_TRACKS: Array<
  Pick<Track, "title" | "duration" | "audio_url" | "lyrics_lrc"> & {
    artist_name: string;
    album_title: string;
    cover_url: string;
  }
> = [
  {
    title: "Bad Guy",
    duration: 194,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics_lrc: null,
    artist_name: "Billie Eilish",
    album_title: "Happier Than Ever",
    cover_url:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "As It Was",
    duration: 167,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics_lrc: null,
    artist_name: "Harry Styles",
    album_title: "Harry's House",
    cover_url:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "God Did",
    duration: 223,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lyrics_lrc: null,
    artist_name: "DJ Khaled",
    album_title: "God Did",
    cover_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Scorpion",
    duration: 210,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    lyrics_lrc: null,
    artist_name: "Drake",
    album_title: "Scorpion",
    cover_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Lilibubblegum",
    duration: 197,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    lyrics_lrc: null,
    artist_name: "Billie Eilish",
    album_title: "Lilibubblegum",
    cover_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Dont Smile At Me",
    duration: 180,
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    lyrics_lrc: null,
    artist_name: "Billie Eilish",
    album_title: "Dont Smile At Me",
    cover_url:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
  },
];
