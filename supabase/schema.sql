-- MusArena schema. Run in Supabase SQL Editor.
-- This script is idempotent — safe to re-run.

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references public.artists(id) on delete cascade,
  cover_url text,
  year int,
  created_at timestamptz not null default now()
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references public.artists(id) on delete set null,
  album_id uuid references public.albums(id) on delete set null,
  artist_name text,
  album_title text,
  duration int default 0,
  audio_url text not null,
  cover_url text,
  lyrics_lrc text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tracks_artist_idx on public.tracks(artist_id);
create index if not exists tracks_album_idx on public.tracks(album_id);
create index if not exists tracks_uploader_idx on public.tracks(uploaded_by);

-- playlists
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  playlist_id uuid references public.playlists(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  position int not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);

-- likes
create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

-- RLS
alter table public.artists enable row level security;
alter table public.albums enable row level security;
alter table public.tracks enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.likes enable row level security;

-- Все могут читать artists/albums/tracks
create policy "artists read" on public.artists for select using (true);
create policy "albums read" on public.albums for select using (true);
create policy "tracks read" on public.tracks for select using (true);

-- Писать в artists/albums могут только залогиненные
create policy "artists write" on public.artists for insert with check (auth.role() = 'authenticated');
create policy "albums write" on public.albums for insert with check (auth.role() = 'authenticated');

-- В tracks может писать любой залогиненный (свои uploaded_by)
create policy "tracks write" on public.tracks for insert with check (auth.uid() = uploaded_by);
create policy "tracks update own" on public.tracks for update using (auth.uid() = uploaded_by);
create policy "tracks delete own" on public.tracks for delete using (auth.uid() = uploaded_by);

-- playlists — только владелец
create policy "playlists own" on public.playlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "playlist_tracks own" on public.playlist_tracks for all using (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);

-- likes — только свои
create policy "likes own" on public.likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for tracks
-- В Supabase UI: Storage → Create bucket → Name: tracks, Public: true
-- File size limit: 50 MB (или больше)
-- Allowed MIME: audio/*
