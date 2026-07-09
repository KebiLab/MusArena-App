"use client";

import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, MoreVertical } from "lucide-react";
import { LogoPlain } from "@/components/branding/Logo";
import { HeroCard } from "@/components/music/HeroCard";
import { TrackRow } from "@/components/music/TrackRow";
import { useThemeStore } from "@/store/themeStore";
import { useRouter } from "next/navigation";
import type { AnyTrack } from "@/lib/api/deezer";

const TABS = ["News", "Video", "Artists", "Podcasts"] as const;
type Tab = (typeof TABS)[number];

export function HomeScreen({ tracks, userId }: { tracks: AnyTrack[]; userId: string }) {
  const [tab, setTab] = useState<Tab>("News");
  const theme = useThemeStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  const hero = tracks[0];
  const featured = tracks.slice(0, 6);
  const recent = tracks.slice(0, 12);

  const ownSet = useMemo(
    () => new Set(tracks.filter((t) => t.uploaded_by === userId).map((t) => t.id)),
    [tracks, userId],
  );

  if (!hero) {
    return (
      <div className="mx-auto max-w-md px-4 pt-12 text-center">
        <p className="text-muted">Не удалось загрузить треки. Попробуй позже.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <header className="flex items-center justify-between">
        <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover">
          <SearchIcon size={22} />
        </button>
        <div className="flex items-center gap-2">
          {mounted && <LogoPlain size={28} invert={theme === "dark"} />}
          <span className="text-2xl font-extrabold tracking-tight">MusArena</span>
        </div>
        <button
          onClick={() => router.push("/about")}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-hover"
        >
          <MoreVertical size={20} />
        </button>
      </header>

      <section className="mt-4">
        <HeroCard track={hero} tracks={tracks} index={0} />
      </section>

      <nav className="mt-6 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-2 text-lg font-bold whitespace-nowrap transition-colors ${
              tab === t ? "text-fg" : "text-muted"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-fg" />
            )}
          </button>
        ))}
      </nav>

      <section className="mt-4 overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-3">
          {featured.map((t, i) => (
            <div
              key={t.id}
              className="relative w-44 shrink-0 overflow-hidden rounded-2xl bg-card aspect-square"
            >
              {t.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.cover_url}
                  alt={t.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-card" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="truncate text-sm font-bold">{t.title}</p>
                <p className="truncate text-xs opacity-80">{t.artist}</p>
              </div>
              <div className="absolute right-2 bottom-2 grid h-9 w-9 place-items-center rounded-full bg-fg text-bg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold">Trending</h3>
          <button className="text-sm text-muted">See More</button>
        </div>
        <div className="space-y-1">
          {recent.map((t, i) => (
            <TrackRow
              key={t.id}
              track={t}
              tracks={tracks}
              index={i}
              showCover={false}
              isOwn={ownSet.has(t.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
