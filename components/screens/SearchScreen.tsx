"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Artist } from "@/lib/types";

export function SearchScreen({ artists }: { artists: Artist[] }) {
  const [q, setQ] = useState("");

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <h1 className="text-2xl font-extrabold">Search</h1>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-card px-3 h-12">
        <Search size={18} className="text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Артисты, треки, альбомы…"
          className="flex-1 bg-transparent outline-none placeholder:text-muted"
        />
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Артисты
        </h2>
        <ul className="mt-3 space-y-1">
          {filtered.map((a) => (
            <li key={a.id}>
              <Link
                href={`/artist/${a.id}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-hover"
              >
                <div className="h-12 w-12 overflow-hidden rounded-full bg-card">
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-card" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted">Артист</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
